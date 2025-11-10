import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getStoreTemplate } from '@/components/store-templates/registry'
import type { StoreTemplateStore, StoreTemplateProduct } from '@/components/store-templates/types'

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

  // Get published products
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

  // Prepare store data for template
  const storeData: StoreTemplateStore = {
    id: store.id,
    name: store.name,
    slug: store.slug,
    description: store.description,
    tagline: store.tagline,
    logoUrl: store.logoUrl,
    whatsappNumber: store.whatsappNumber,
    email: store.email,
    phone: store.phone,
    address: store.address,
    city: store.city,
    province: store.province,
    instagramUrl: store.instagramUrl,
    facebookUrl: store.facebookUrl,
    tiktokUrl: store.tiktokUrl,
    twitterUrl: store.twitterUrl,
    youtubeUrl: store.youtubeUrl,
    productCount: products.length,
    rating: store.rating ? Number(store.rating) : null,
    reviewCount: store.reviewCount,
  }

  // Prepare products data for template
  const productsData: StoreTemplateProduct[] = products.map((product) => {
    const images = Array.isArray(product.images) ? (product.images as string[]) : []
    const isNew = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      description: product.description,
      images: images,
      isAvailable: product.isAvailable,
      stock: product.stock,
      isNew,
      category: 'Produk',
      rating: 5,
      reviewCount: 0,
      hasConversionPage: product.hasConversionPage || false,
      conversionPageSlug: product.conversionPageSlug,
    }
  })

  // Get template component
  const templateId = store.templateId || 'simple-classic'
  const TemplateComponent = getStoreTemplate(templateId)

  // Render React template
  return <TemplateComponent store={storeData} products={productsData} />
}

export const dynamic = 'force-dynamic'
