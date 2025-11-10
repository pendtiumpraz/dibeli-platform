import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import RedUrgencyTemplate from '@/components/conversion/RedUrgencyTemplate'
import GreenTrustTemplate from '@/components/conversion/GreenTrustTemplate'
import YellowEnergyTemplate from '@/components/conversion/YellowEnergyTemplate'
import BlueProfessionalTemplate from '@/components/conversion/BlueProfessionalTemplate'
import PurpleRoyalTemplate from '@/components/conversion/PurpleRoyalTemplate'

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

  // Cast JSON fields to proper types with backward compatibility
  const rawBenefits = product.benefits as any
  const rawFeatures = product.features as any
  
  const templateProps = {
    product: {
      ...product,
      // Handle both old format (string[]) and new format ({text, imageUrl}[])
      benefits: Array.isArray(rawBenefits) 
        ? rawBenefits.map((b: any) => typeof b === 'string' ? {text: b} : b)
        : [],
      features: Array.isArray(rawFeatures)
        ? rawFeatures.map((f: any) => typeof f === 'string' ? {text: f} : f)
        : [],
      testimonials: (product.testimonials as Array<{name: string, rating: number, text: string, role: string, photoUrl?: string}>) || [],
      bonuses: (product.bonuses as Array<{title: string, description: string, value: string, imageUrl?: string}>) || [],
      faqs: (product.faqs as Array<{question: string, answer: string}>) || [],
    },
    store: product.store,
  }

  switch (template) {
    case 'red-urgency':
      return <RedUrgencyTemplate {...templateProps} />
    case 'green-trust':
      return <GreenTrustTemplate {...templateProps} />
    case 'yellow-energy':
      return <YellowEnergyTemplate {...templateProps} />
    case 'blue-professional':
      return <BlueProfessionalTemplate {...templateProps} />
    case 'purple-premium':
      return <PurpleRoyalTemplate {...templateProps} />
    default:
      return <RedUrgencyTemplate {...templateProps} />
  }
}

export const dynamic = 'force-dynamic'

