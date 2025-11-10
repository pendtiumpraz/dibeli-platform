/**
 * Store Template Types
 * Base interfaces for all store templates
 */

export interface StoreTemplateProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  discountPercent?: number | null
  description?: string | null
  images: string[] // Google Drive IDs
  isAvailable: boolean
  stock?: number | null
  isNew?: boolean
  category?: string
  rating?: number
  reviewCount?: number
  // Conversion page
  hasConversionPage?: boolean
  conversionPageSlug?: string | null
}

export interface StoreTemplateStore {
  id: string
  name: string
  slug: string
  description?: string | null
  tagline?: string | null
  logoUrl?: string | null
  whatsappNumber: string
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  province?: string | null
  // Social links
  instagramUrl?: string | null
  facebookUrl?: string | null
  tiktokUrl?: string | null
  twitterUrl?: string | null
  youtubeUrl?: string | null
  // Stats
  productCount: number
  rating?: number | null
  reviewCount: number
}

export interface StoreTemplateProps {
  store: StoreTemplateStore
  products: StoreTemplateProduct[]
}

export type TemplateTier = 'FREE' | 'PREMIUM' | 'UNLIMITED'

export interface TemplateInfo {
  id: string
  name: string
  description: string
  tier: TemplateTier
  thumbnail?: string
  features: string[]
}
