import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import RedUrgencyTemplate from '@/components/conversion/RedUrgencyTemplate'
import GreenTrustTemplate from '@/components/conversion/GreenTrustTemplate'
import YellowEnergyTemplate from '@/components/conversion/YellowEnergyTemplate'

interface ConversionPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ConversionPageProps): Promise<Metadata> {
  const product = await prisma.product.findFirst({
    where: {
      conversionPageSlug: params.slug,
      hasConversionPage: true,
    },
    include: {
      store: true,
    },
  })

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    }
  }

  return {
    title: product.metaTitle || product.headline || product.name,
    description: product.metaDescription || product.subheadline || product.description,
    openGraph: {
      title: product.headline || product.name,
      description: product.subheadline || product.description || '',
      images: product.images.length > 0 
        ? [`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w1200`]
        : [],
    },
  }
}

export default async function ConversionPage({ params }: ConversionPageProps) {
  const product = await prisma.product.findFirst({
    where: {
      conversionPageSlug: params.slug,
      hasConversionPage: true,
    },
    include: {
      store: true,
    },
  })

  if (!product) {
    notFound()
  }

  // Render based on template
  const template = product.conversionTemplate || 'red-urgency'

  const templateProps = {
    product,
    store: product.store,
  }

  switch (template) {
    case 'red-urgency':
      return <RedUrgencyTemplate {...templateProps} />
    case 'green-trust':
      return <GreenTrustTemplate {...templateProps} />
    case 'yellow-energy':
      return <YellowEnergyTemplate {...templateProps} />
    default:
      return <RedUrgencyTemplate {...templateProps} />
  }
}
