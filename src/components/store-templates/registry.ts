/**
 * Store Template Registry
 * Maps template IDs to components and metadata
 */

import { TemplateInfo } from './types'
import SimpleClassicTemplate from './SimpleClassicTemplate'
import MinimalCleanTemplate from './MinimalCleanTemplate'
import ElegantShopTemplate from './ElegantShopTemplate'
import ModernProfessionalTemplate from './ModernProfessionalTemplate'
import BoldColorfulTemplate from './BoldColorfulTemplate'
import LuxuryBoutiqueTemplate from './LuxuryBoutiqueTemplate'
import RoyalMarketplaceTemplate from './RoyalMarketplaceTemplate'
import FuturisticStoreTemplate from './FuturisticStoreTemplate'

export const STORE_TEMPLATES = {
  // FREE TIER
  'simple-classic': SimpleClassicTemplate,
  'minimal-clean': MinimalCleanTemplate,
  
  // PREMIUM TIER
  'elegant-shop': ElegantShopTemplate,
  'modern-professional': ModernProfessionalTemplate,
  'bold-colorful': BoldColorfulTemplate,
  
  // UNLIMITED TIER
  'luxury-boutique': LuxuryBoutiqueTemplate,
  'royal-marketplace': RoyalMarketplaceTemplate,
  'futuristic-store': FuturisticStoreTemplate,
  'artisan-craft': LuxuryBoutiqueTemplate, // TODO: Create unique template
  'modern-showcase': FuturisticStoreTemplate, // TODO: Create unique template
} as const

export type StoreTemplateId = keyof typeof STORE_TEMPLATES

/**
 * Template metadata for selection UI
 */
export const TEMPLATE_INFO: Record<StoreTemplateId, TemplateInfo> = {
  // FREE TIER
  'simple-classic': {
    id: 'simple-classic',
    name: 'Simple Classic',
    description: 'Clean and functional design perfect for beginners',
    tier: 'FREE',
    thumbnail: '/template-previews/simple-classic.svg',
    features: ['Basic layout', 'Product grid', 'WhatsApp integration', 'Mobile responsive'],
  },
  'minimal-clean': {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Ultra-minimalist design with focus on content and simplicity',
    tier: 'FREE',
    thumbnail: '/template-previews/minimal-clean.svg',
    features: ['Ultra minimal style', 'List format layout', 'Fast loading', 'Clean typography', 'Text-focused design'],
  },
  
  // PREMIUM TIER
  'elegant-shop': {
    id: 'elegant-shop',
    name: 'Elegant Shop',
    description: 'Professional and elegant design for premium brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/elegant-shop.svg',
    features: [
      'Gradient backgrounds',
      'Hover animations',
      'Social media links',
      'Professional typography',
      'Enhanced product cards',
    ],
  },
  'modern-professional': {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Corporate professional design with slate color scheme',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/modern-professional.svg',
    features: [
      'Corporate slate theme',
      'Professional layout',
      'Trust badges',
      'Comprehensive footer',
      'Stats display',
    ],
  },
  'bold-colorful': {
    id: 'bold-colorful',
    name: 'Bold & Colorful',
    description: 'Eye-catching vibrant design with energetic colors',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/bold-colorful.svg',
    features: [
      'Vibrant gradients',
      'Dynamic animations',
      'Attention-grabbing CTAs',
      'Energetic feel',
      'Multiple color schemes',
    ],
  },
  
  // UNLIMITED TIER
  'luxury-boutique': {
    id: 'luxury-boutique',
    name: 'Luxury Boutique',
    description: 'Ultra-premium design with advanced animations',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/luxury-boutique.svg',
    features: [
      'Animated background',
      'Luxury gradients',
      'Scroll effects',
      'Premium animations',
      'Glow effects',
      'Advanced hover states',
      'VIP experience',
    ],
  },
  'royal-marketplace': {
    id: 'royal-marketplace',
    name: 'Royal Marketplace',
    description: 'Regal purple & gold design with crown elements',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/royal-marketplace.svg',
    features: [
      'Royal purple theme',
      'Gold accents & borders',
      'Crown elements',
      'Elegant animations',
      'Luxury feel',
      'Hover glow effects',
    ],
  },
  'futuristic-store': {
    id: 'futuristic-store',
    name: 'Futuristic Store',
    description: 'Sci-fi tech design with neon colors and grid patterns',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/futuristic-store.svg',
    features: [
      'Neon cyan theme',
      'Tech grid background',
      'Mouse glow effect',
      'Futuristic UI elements',
      'Monospace fonts',
      'Advanced animations',
    ],
  },
  'artisan-craft': {
    id: 'artisan-craft',
    name: 'Artisan Craft',
    description: 'Artistic and unique design for creative brands',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/luxury-boutique.svg',
    features: ['Artistic style', 'Unique layout', 'Creative elements', 'Hand-crafted feel'],
  },
  'modern-showcase': {
    id: 'modern-showcase',
    name: 'Modern Showcase',
    description: 'Trendy design perfect for showcasing products',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/futuristic-store.svg',
    features: ['Trendy design', 'Product focus', 'Modern aesthetics', 'Instagram-worthy'],
  },
}

/**
 * Get template component by ID
 */
export function getStoreTemplate(templateId: string) {
  const id = templateId as StoreTemplateId
  return STORE_TEMPLATES[id] || STORE_TEMPLATES['simple-classic']
}

/**
 * Get template info by ID
 */
export function getTemplateInfo(templateId: string): TemplateInfo {
  const id = templateId as StoreTemplateId
  return TEMPLATE_INFO[id] || TEMPLATE_INFO['simple-classic']
}

/**
 * Get all templates for a specific tier
 */
export function getTemplatesByTier(tier: 'FREE' | 'PREMIUM' | 'UNLIMITED'): TemplateInfo[] {
  return Object.values(TEMPLATE_INFO).filter((template) => template.tier === tier)
}

/**
 * Check if user can access template based on their tier
 */
export function canAccessTemplate(userTier: string, templateTier: string): boolean {
  const tierHierarchy = { TRIAL: 0, FREE: 0, PREMIUM: 1, UNLIMITED: 2 }
  const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0
  const templateLevel = tierHierarchy[templateTier as keyof typeof tierHierarchy] || 0
  return userLevel >= templateLevel
}
