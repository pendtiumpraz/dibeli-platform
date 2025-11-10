import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { store: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify ownership
    if (product.store.userId !== session.user.id && !session.user.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { store: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify ownership
    if (product.store.userId !== session.user.id && !session.user.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const contentType = request.headers.get('content-type')
    let name, description, price, stock, isAvailable, existingImages, deletedImages
    let videoUrl, originalPrice, discountPercent, discountValidUntil // Phase 1
    let hasConversionPage, conversionPageSlug, conversionTemplate, headline, subheadline // Phase 2
    let benefits, features // Phase 3
    let hasCountdown, countdownEnd, limitedStock, urgencyText, ctaText, ctaColor // Phase 4
    let testimonials, bonuses, faqs, guarantee, socialProof // Phase 5
    let newImageFiles: File[] = []

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with new images)
      const formData = await request.formData()
      name = formData.get('name') as string
      description = formData.get('description') as string
      price = parseFloat(formData.get('price') as string)
      stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : null
      isAvailable = formData.get('isAvailable') === 'true'
      existingImages = JSON.parse(formData.get('existingImages') as string || '[]')
      deletedImages = JSON.parse(formData.get('deletedImages') as string || '[]')
      
      // Phase 1: Video + Discount
      videoUrl = formData.get('videoUrl') as string || null
      originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice') as string) : null
      discountPercent = formData.get('discountPercent') ? parseInt(formData.get('discountPercent') as string) : null
      discountValidUntil = formData.get('discountValidUntil') as string || null
      
      // Phase 2: Conversion Page
      hasConversionPage = formData.get('hasConversionPage') === 'true'
      conversionPageSlug = formData.get('conversionPageSlug') as string || null
      conversionTemplate = formData.get('conversionTemplate') as string || 'red-urgency'
      headline = formData.get('headline') as string || null
      subheadline = formData.get('subheadline') as string || null
      
      // Phase 3: Benefits & Features
      benefits = formData.get('benefits') ? JSON.parse(formData.get('benefits') as string) : []
      features = formData.get('features') ? JSON.parse(formData.get('features') as string) : []
      
      // Phase 4: Urgency Settings
      hasCountdown = formData.get('hasCountdown') === 'true'
      countdownEnd = formData.get('countdownEnd') as string || null
      limitedStock = formData.get('limitedStock') ? parseInt(formData.get('limitedStock') as string) : null
      urgencyText = formData.get('urgencyText') as string || null
      ctaText = formData.get('ctaText') as string || null
      ctaColor = formData.get('ctaColor') as string || null
      
      // Phase 5: Social Proof & Trust Builders
      testimonials = formData.get('testimonials') ? JSON.parse(formData.get('testimonials') as string) : []
      bonuses = formData.get('bonuses') ? JSON.parse(formData.get('bonuses') as string) : []
      faqs = formData.get('faqs') ? JSON.parse(formData.get('faqs') as string) : []
      guarantee = formData.get('guarantee') as string || null
      socialProof = formData.get('socialProof') as string || null

      // Get new image files
      const images = formData.getAll('images')
      newImageFiles = images.filter((file): file is File => file instanceof File && file.size > 0)
      
      // Get photo files for benefits, features, testimonials, bonuses
      // Note: These will be processed later when uploading
    } else {
      // Handle JSON (no new images)
      const body = await request.json()
      name = body.name
      description = body.description
      price = body.price
      stock = body.stock
      isAvailable = body.isAvailable
      existingImages = body.existingImages || []
      deletedImages = body.deletedImages || []
      
      // Phase 1: Video + Discount
      videoUrl = body.videoUrl || null
      originalPrice = body.originalPrice || null
      discountPercent = body.discountPercent || null
      discountValidUntil = body.discountValidUntil || null
      
      // Phase 2: Conversion Page
      hasConversionPage = body.hasConversionPage || false
      conversionPageSlug = body.conversionPageSlug || null
      conversionTemplate = body.conversionTemplate || 'red-urgency'
      headline = body.headline || null
      subheadline = body.subheadline || null
      
      // Phase 3: Benefits & Features
      benefits = body.benefits || []
      features = body.features || []
      
      // Phase 4: Urgency Settings
      hasCountdown = body.hasCountdown || false
      countdownEnd = body.countdownEnd || null
      limitedStock = body.limitedStock || null
      urgencyText = body.urgencyText || null
      ctaText = body.ctaText || null
      ctaColor = body.ctaColor || null
      
      // Phase 5: Social Proof & Trust Builders
      testimonials = body.testimonials || []
      bonuses = body.bonuses || []
      faqs = body.faqs || []
      guarantee = body.guarantee || null
      socialProof = body.socialProof || null
    }

    // Upload new images to Drive
    const newImageIds: string[] = []
    if (newImageFiles.length > 0) {
      try {
        console.log(`Uploading ${newImageFiles.length} new images to Google Drive...`)
        const { createFolderStructure, uploadImageToDrive } = await import('@/lib/google-drive')
        
        const productSlug = name.toLowerCase().replace(/\s+/g, '-')
        const folderId = await createFolderStructure(product.store.name, productSlug)
        
        for (let i = 0; i < newImageFiles.length; i++) {
          const file = newImageFiles[i]
          if (file.size > 0) {
            const fileName = `${productSlug}-${Date.now()}-${i + 1}.${file.name.split('.').pop()}`
            const uploadedFile = await uploadImageToDrive(file, folderId, fileName)
            newImageIds.push(uploadedFile.id)
          }
        }
        
        console.log(`✅ Uploaded ${newImageIds.length} new images`)
      } catch (driveError) {
        console.error('❌ Google Drive upload failed:', driveError)
        // Continue without new images
      }
    }

    // Combine existing images (not deleted) with new images
    const finalImages = [...existingImages, ...newImageIds]

    // Handle photo uploads for benefits, features, testimonials, bonuses
    if (contentType?.includes('multipart/form-data')) {
      try {
        console.log('Processing section photos...')
        const formData = await request.formData()
        const { createFolderStructure, uploadImageToDrive } = await import('@/lib/google-drive')
        
        const productSlug = name.toLowerCase().replace(/\s+/g, '-')
        const productFolderId = await createFolderStructure(product.store.name, productSlug)
        
        // Upload benefit icon photos
        if (Array.isArray(benefits)) {
          for (let i = 0; i < benefits.length; i++) {
            const photoKey = `benefitPhoto_${i}`
            const photoFile = formData.get(photoKey)
            if (photoFile && photoFile instanceof File && photoFile.size > 0) {
              console.log(`Uploading benefit icon ${i}...`)
              const fileName = `benefit-${i}-${Date.now()}.${photoFile.name.split('.').pop()}`
              const uploaded = await uploadImageToDrive(photoFile, productFolderId, fileName)
              
              // Update benefit object with imageUrl
              if (typeof benefits[i] === 'object') {
                benefits[i].imageUrl = uploaded.id
                delete benefits[i].imageFile // Remove File reference
              } else {
                // Convert string to object
                benefits[i] = { text: benefits[i], imageUrl: uploaded.id }
              }
            }
          }
        }
        
        // Upload feature icon photos
        if (Array.isArray(features)) {
          for (let i = 0; i < features.length; i++) {
            const photoKey = `featurePhoto_${i}`
            const photoFile = formData.get(photoKey)
            if (photoFile && photoFile instanceof File && photoFile.size > 0) {
              console.log(`Uploading feature icon ${i}...`)
              const fileName = `feature-${i}-${Date.now()}.${photoFile.name.split('.').pop()}`
              const uploaded = await uploadImageToDrive(photoFile, productFolderId, fileName)
              
              if (typeof features[i] === 'object') {
                features[i].imageUrl = uploaded.id
                delete features[i].imageFile
              } else {
                features[i] = { text: features[i], imageUrl: uploaded.id }
              }
            }
          }
        }
        
        // Upload testimonial photos
        if (Array.isArray(testimonials)) {
          for (let i = 0; i < testimonials.length; i++) {
            const photoKey = `testimonialPhoto_${i}`
            const photoFile = formData.get(photoKey)
            if (photoFile && photoFile instanceof File && photoFile.size > 0) {
              console.log(`Uploading testimonial photo ${i}...`)
              const fileName = `testimonial-${i}-${Date.now()}.${photoFile.name.split('.').pop()}`
              const uploaded = await uploadImageToDrive(photoFile, productFolderId, fileName)
              
              testimonials[i].photoUrl = uploaded.id
              delete testimonials[i].photoFile // Remove File reference
            }
          }
        }
        
        // Upload bonus images
        if (Array.isArray(bonuses)) {
          for (let i = 0; i < bonuses.length; i++) {
            const photoKey = `bonusImage_${i}`
            const photoFile = formData.get(photoKey)
            if (photoFile && photoFile instanceof File && photoFile.size > 0) {
              console.log(`Uploading bonus image ${i}...`)
              const fileName = `bonus-${i}-${Date.now()}.${photoFile.name.split('.').pop()}`
              const uploaded = await uploadImageToDrive(photoFile, productFolderId, fileName)
              
              bonuses[i].imageUrl = uploaded.id
              delete bonuses[i].imageFile // Remove File reference
            }
          }
        }
        
        console.log('✅ Section photos processed')
      } catch (photoError) {
        console.error('❌ Photo upload error:', photoError)
        // Continue without photos
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        stock,
        isAvailable,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        images: finalImages,
        // Phase 1: Video + Discount
        videoUrl,
        originalPrice,
        discountPercent,
        discountValidUntil: discountValidUntil ? new Date(discountValidUntil) : null,
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
        countdownEnd: countdownEnd ? new Date(countdownEnd) : null,
        limitedStock,
        urgencyText,
        ctaText,
        ctaColor,
        // Phase 5: Social Proof & Trust Builders
        testimonials,
        bonuses,
        faqs,
        guarantee,
        socialProof,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { store: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify ownership
    if (product.store.userId !== session.user.id && !session.user.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
