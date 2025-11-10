import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getDefaultTheme, formatPriceRupiah } from '@/lib/template-renderer'
import { combineTemplate, getTemplatePackage } from '@/lib/template-combiner'
import { getDriveImageUrl } from '@/lib/google-drive'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
  })

  if (!store) {
    return {
      title: 'Store Not Found',
    }
  }

  return {
    title: `${store.name} - Belanja Online`,
    description: store.description || `Belanja produk berkualitas di ${store.name}`,
    openGraph: {
      title: store.name,
      description: store.description || undefined,
      type: 'website',
    },
  }
}

export default async function PublicStorePage({ params }: PageProps) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
  })

  if (!store || !store.isPublished) {
    notFound()
  }

  // Get published products separately
  const products = await prisma.product.findMany({
    where: {
      storeId: store.id,
      isAvailable: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
    take: 50,
  })

  // Get template from store settings
  const templateId = store.templateId || 'modern-minimal'
  const templatePackage = getTemplatePackage(templateId)

  if (!templatePackage) {
    return <div>Template not found</div>
  }

  // Prepare template data
  const data = {
    store: {
      name: store.name,
      logo: undefined,
      badge: `${products.length}+ Produk Tersedia`,
      heroTitle: `Selamat Datang di ${store.name}`,
      heroSubtitle: store.description || 'Temukan produk berkualitas dengan harga terbaik. Belanja sekarang dan dapatkan penawaran spesial!',
      tagline: store.description || 'Produk Berkualitas Terbaik',
      description: store.description || undefined,
      whatsappNumber: store.whatsappNumber,
      address: store.address || undefined,
      showStats: true,
      stats: {
        products: products.length,
        customers: 100,
        rating: '4.9',
      },
    },
    products: products.map((product) => {
      const images = Array.isArray(product.images) ? (product.images as string[]) : []
      const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created in last 7 days
      
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
        isNew,
        category: 'Produk',
        rating: 5,
        reviewCount: 0,
        features: undefined, // TODO: Add features field to product model
        // Conversion landing page data
        hasConversionPage: product.hasConversionPage || false,
        conversionPageSlug: product.conversionPageSlug || undefined,
      }
    }),
    theme: getDefaultTheme(),
  }

  // Render template
  const renderedHtml = combineTemplate(templatePackage.config, data)

  // Return as HTML
  return (
    <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  )
}

export const dynamic = 'force-dynamic'
