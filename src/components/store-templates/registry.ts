/**
 * Store Template Registry
 * Maps template IDs to components and metadata
 */

import { TemplateInfo } from './types'
import SimpleClassicTemplate from './SimpleClassicTemplate'
import ElegantShopTemplate from './ElegantShopTemplate'
import LuxuryBoutiqueTemplate from './LuxuryBoutiqueTemplate'

export const STORE_TEMPLATES = {
  // FREE TIER
  'simple-classic': SimpleClassicTemplate,
  'minimal-clean': SimpleClassicTemplate, // Can add more later
  
  // PREMIUM TIER
  'elegant-shop': ElegantShopTemplate,
  'modern-professional': ElegantShopTemplate, // Can add more later
  'bold-colorful': ElegantShopTemplate, // Can add more later
  
  // UNLIMITED TIER
  'luxury-boutique': LuxuryBoutiqueTemplate,
  'royal-marketplace': LuxuryBoutiqueTemplate, // Can add more later
  'futuristic-store': LuxuryBoutiqueTemplate, // Can add more later
  'artisan-craft': LuxuryBoutiqueTemplate, // Can add more later
  'modern-showcase': LuxuryBoutiqueTemplate, // Can add more later
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
    features: ['Basic layout', 'Product grid', 'WhatsApp integration', 'Mobile responsive'],
  },
  'minimal-clean': {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Minimalist design with focus on content',
    tier: 'FREE',
    features: ['Minimal style', 'Fast loading', 'Easy navigation', 'Clean typography'],
  },
  
  // PREMIUM TIER
  'elegant-shop': {
    id: 'elegant-shop',
    name: 'Elegant Shop',
    description: 'Professional and elegant design for premium brands',
    tier: 'PREMIUM',
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
    description: 'Contemporary design for professional businesses',
    tier: 'PREMIUM',
    features: ['Modern layout', 'Smooth transitions', 'Contact section', 'Stats display'],
  },
  'bold-colorful': {
    id: 'bold-colorful',
    name: 'Bold & Colorful',
    description: 'Eye-catching design with vibrant colors',
    tier: 'PREMIUM',
    features: ['Bold colors', 'Dynamic layout', 'Attention-grabbing', 'Energetic feel'],
  },
  
  // UNLIMITED TIER
  'luxury-boutique': {
    id: 'luxury-boutique',
    name: 'Luxury Boutique',
    description: 'Ultra-premium design with advanced animations',
    tier: 'UNLIMITED',
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
    description: 'Regal design with gold accents and royal theme',
    tier: 'UNLIMITED',
    features: ['Royal theme', 'Gold accents', 'Elegant animations', 'Premium feel'],
  },
  'futuristic-store': {
    id: 'futuristic-store',
    name: 'Futuristic Store',
    description: 'Modern tech-inspired design with cutting-edge visuals',
    tier: 'UNLIMITED',
    features: ['Futuristic design', 'Tech aesthetic', 'Advanced effects', 'Sci-fi inspired'],
  },
  'artisan-craft': {
    id: 'artisan-craft',
    name: 'Artisan Craft',
    description: 'Artistic and unique design for creative brands',
    tier: 'UNLIMITED',
    features: ['Artistic style', 'Unique layout', 'Creative elements', 'Hand-crafted feel'],
  },
  'modern-showcase': {
    id: 'modern-showcase',
    name: 'Modern Showcase',
    description: 'Trendy design perfect for showcasing products',
    tier: 'UNLIMITED',
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
