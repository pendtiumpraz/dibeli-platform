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

      // Get new image files
      const images = formData.getAll('images')
      newImageFiles = images.filter((file): file is File => file instanceof File && file.size > 0)
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
