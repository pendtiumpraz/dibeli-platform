import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDefaultTheme, formatPriceRupiah } from '@/lib/template-renderer'
import { combineTemplate, getTemplatePackage } from '@/lib/template-combiner'
import { getDriveImageUrl } from '@/lib/google-drive'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user's store
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
      include: {
        products: {
          where: { isAvailable: true },
          take: 6,
        },
      },
    })

    if (!store) {
      return new NextResponse('No store found', { status: 404 })
    }

    // Get template package (default: modern-minimal)
    const templateId = 'modern-minimal' // TODO: Get from store settings
    const templatePackage = getTemplatePackage(templateId)
    
    if (!templatePackage) {
      return new NextResponse('Template not found', { status: 404 })
    }

    // Prepare data
    const data = {
      store: {
        name: store.name,
        logo: undefined,
        badge: `${store.products.length}+ Produk Tersedia`,
        heroTitle: `Selamat Datang di ${store.name}`,
        heroSubtitle: store.description || 'Temukan produk berkualitas dengan harga terbaik. Belanja sekarang dan dapatkan penawaran spesial!',
        tagline: store.description || 'Produk Berkualitas Terbaik',
        description: store.description || undefined,
        whatsappNumber: store.whatsappNumber,
        address: store.address || undefined,
        showStats: true,
        stats: {
          products: store.products.length,
          customers: 100,
          rating: '4.9',
        },
      },
      products: store.products.map((product) => {
        const images = Array.isArray(product.images) ? product.images as string[] : []
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: formatPriceRupiah(product.price),
          priceRaw: product.price,
          description: product.description || undefined,
          image: images.length > 0 ? getDriveImageUrl(images[0]) : 'https://via.placeholder.com/500',
          images: images.map((id) => getDriveImageUrl(id)),
          isAvailable: product.isAvailable,
          stock: product.stock || undefined,
          isNew: false, // TODO: Calculate based on createdAt
          rating: 5,
          reviewCount: 0,
        }
      }),
      theme: getDefaultTheme(),
    }

    // Render template using combiner
    const renderedHtml = combineTemplate(templatePackage.config, data)

    return new NextResponse(renderedHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Template render error:', error)
    return new NextResponse(
      `<html><body><h1>Error rendering template</h1><pre>${error instanceof Error ? error.message : 'Unknown error'}</pre></body></html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    )
  }
}
