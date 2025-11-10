import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'
import { createFolderStructure, uploadImageToDrive } from '@/lib/google-drive'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (!checkPermission(session.user.tier, 'unlimited_products')) {
      if (store._count.products >= 3) {
        return NextResponse.json(
          { error: 'Product limit reached. Upgrade to Premium for unlimited products.' },
          { status: 403 }
        )
      }
    }

    // Check if multipart form data (with images)
    const contentType = req.headers.get('content-type') || ''
    
    let name: string
    let description: string | undefined
    let price: number
    let stock: number | null
    let isAvailable: boolean
    let images: string[] = []
    // Phase 1: Video + Discount
    let videoUrl: string | null = null
    let originalPrice: number | null = null
    let discountPercent: number | null = null
    let discountValidUntil: Date | null = null
    // Phase 2: Conversion Page
    let hasConversionPage: boolean = false
    let conversionPageSlug: string | null = null
    let conversionTemplate: string | null = null
    let headline: string | null = null
    let subheadline: string | null = null
    // Phase 3: Benefits & Features
    let benefits: any = []
    let features: any = []
    // Phase 4: Urgency Settings
    let hasCountdown: boolean = false
    let countdownEnd: Date | null = null
    let limitedStock: number | null = null
    let urgencyText: string | null = null
    let ctaText: string | null = null
    let ctaColor: string | null = null
    // Phase 5: Social Proof
    let testimonials: any = []
    let bonuses: any = []
    let faqs: any = []
    let guarantee: string | null = null
    let socialProof: string | null = null

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData()
      
      name = formData.get('name') as string
      description = formData.get('description') as string || undefined
      price = parseFloat(formData.get('price') as string)
      stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : null
      isAvailable = formData.get('isAvailable') !== 'false'
      
      // Phase 1: Video + Discount
      videoUrl = formData.get('videoUrl') as string || null
      originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
      discountPercent = formData.get('discountPercent') ? parseInt(formData.get('discountPercent') as string) : null
      discountValidUntil = formData.get('discountValidUntil') ? new Date(formData.get('discountValidUntil') as string) : null
      
      // Phase 2: Conversion Page  
      hasConversionPage = formData.get('hasConversionPage') === 'true'
      conversionPageSlug = formData.get('conversionPageSlug') as string || null
      conversionTemplate = formData.get('conversionTemplate') as string || null
      headline = formData.get('headline') as string || null
      subheadline = formData.get('subheadline') as string || null
      
      // Phase 3: Benefits & Features
      // NOTE: Schema expects String[] but we store objects with {text, imageUrl}
      // Need to extract just the text values for now (until schema migration)
      if (formData.get('benefits')) {
        const benefitsData = JSON.parse(formData.get('benefits') as string)
        benefits = benefitsData.map((b: any) => typeof b === 'string' ? b : b.text)
      }
      if (formData.get('features')) {
        const featuresData = JSON.parse(formData.get('features') as string)
        features = featuresData.map((f: any) => typeof f === 'string' ? f : f.text)
      }
      
      // Phase 4: Urgency Settings
      hasCountdown = formData.get('hasCountdown') === 'true'
      countdownEnd = formData.get('countdownEnd') ? new Date(formData.get('countdownEnd') as string) : null
      limitedStock = formData.get('limitedStock') ? parseInt(formData.get('limitedStock') as string) : null
      urgencyText = formData.get('urgencyText') as string || null
      ctaText = formData.get('ctaText') as string || null
      ctaColor = formData.get('ctaColor') as string || null
      
      // Phase 5: Social Proof
      if (formData.get('testimonials')) {
        testimonials = JSON.parse(formData.get('testimonials') as string)
      }
      if (formData.get('bonuses')) {
        bonuses = JSON.parse(formData.get('bonuses') as string)
      }
      if (formData.get('faqs')) {
        faqs = JSON.parse(formData.get('faqs') as string)
      }
      guarantee = formData.get('guarantee') as string || null
      socialProof = formData.get('socialProof') as string || null
      
      console.log('📦 CREATE PRODUCT - Conversion Page Data:')
      console.log('  hasConversionPage:', hasConversionPage)
      console.log('  conversionPageSlug:', conversionPageSlug)
      console.log('  headline:', headline)
      console.log('  benefits count:', benefits.length)
      console.log('  features count:', features.length)

      // Get uploaded images
      const imageFiles = formData.getAll('images') as File[]
      
      if (imageFiles.length > 0) {
        console.log(`Uploading ${imageFiles.length} images to Google Drive...`)
        
        try {
          // Create folder structure in Drive
          const productSlug = name.toLowerCase().replace(/\s+/g, '-')
          console.log(`Creating folder structure for: ${store.name}/${productSlug}`)
          
          const folderId = await createFolderStructure(store.name, productSlug)
          console.log(`Folder created with ID: ${folderId}`)
          
          // Upload each image
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i]
            console.log(`Processing image ${i + 1}: ${file.name} (${file.size} bytes)`)
            
            if (file.size > 0) {
              const fileName = `${productSlug}-${i + 1}.${file.name.split('.').pop()}`
              console.log(`Uploading as: ${fileName}`)
              
              const uploadedFile = await uploadImageToDrive(file, folderId, fileName)
              console.log(`Uploaded successfully, ID: ${uploadedFile.id}`)
              
              // Store Drive file ID (we'll construct URL when displaying)
              images.push(uploadedFile.id)
            }
          }
          
          console.log(`✅ Uploaded ${images.length} images successfully`)
        } catch (driveError) {
          console.error('❌ Google Drive upload failed:', driveError)
          console.error('Error details:', driveError instanceof Error ? driveError.message : 'Unknown error')
          console.error('Stack:', driveError instanceof Error ? driveError.stack : '')
          
          // Continue without images if Drive fails
          console.log('⚠️ Product will be created without images')
        }
      }
    } else {
      // JSON body (no images)
      const body = await req.json()
      name = body.name
      description = body.description
      price = body.price
      stock = body.stock
      isAvailable = body.isAvailable !== false
    }

    console.log('🔧 About to create product with data:')
    console.log('  hasConversionPage:', hasConversionPage)
    console.log('  conversionPageSlug:', conversionPageSlug)
    
    let product
    try {
      product = await prisma.product.create({
        data: {
          storeId: store.id,
          name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          description,
          price,
          stock,
          isAvailable,
          images, // Array of Drive file IDs
          // Phase 1: Video + Discount
          videoUrl,
          originalPrice,
          discountPercent,
          discountValidUntil,
          // Phase 2: Conversion Page
          hasConversionPage,
          conversionPageSlug,
          conversionTemplate,
          headline,
          subheadline,
          // Phase 3: Benefits & Features  
          benefits,
          features,
          // Phase 4: Urgency Settings
          hasCountdown,
          countdownEnd,
          limitedStock,
          urgencyText,
          ctaText,
          ctaColor,
          // Phase 5: Social Proof
          testimonials,
          bonuses,
          faqs,
          guarantee,
          socialProof,
        },
      })
    } catch (prismaError: any) {
      console.error('❌ Prisma create error:', prismaError)
      console.error('Error code:', prismaError.code)
      console.error('Error message:', prismaError.message)
      console.error('Error meta:', prismaError.meta)
      throw new Error(`Database error: ${prismaError.message}`)
    }
    
    console.log('✅ Product created with ID:', product.id)
    console.log('✅ hasConversionPage in DB:', product.hasConversionPage)
    console.log('✅ conversionPageSlug in DB:', product.conversionPageSlug)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
