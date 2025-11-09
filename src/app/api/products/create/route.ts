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

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData()
      
      name = formData.get('name') as string
      description = formData.get('description') as string || undefined
      price = parseFloat(formData.get('price') as string)
      stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : null
      isAvailable = formData.get('isAvailable') !== 'false'

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

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        price,
        stock,
        isAvailable,
        images, // Array of Drive file IDs
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
