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
  
  // PREMIUM TIER (18 total)
  'elegant-shop': {
    id: 'elegant-shop',
    name: 'Elegant Shop',
    description: 'Professional elegant design for premium brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/elegant-shop.svg',
    features: ['Gradient backgrounds', 'Hover animations', 'Social media', 'Professional typography', 'Google Maps footer'],
  },
  'modern-professional': {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Corporate professional with slate color scheme',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/modern-professional.svg',
    features: ['Corporate slate theme', 'Professional layout', 'Trust badges', 'Comprehensive footer', 'Maps integration'],
  },
  'bold-colorful': {
    id: 'bold-colorful',
    name: 'Bold & Colorful',
    description: 'Eye-catching vibrant design with energetic colors',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/bold-colorful.svg',
    features: ['Vibrant gradients', 'Dynamic animations', 'Attention-grabbing CTAs', 'Energetic feel', 'Complete footer'],
  },
  'ocean-breeze': {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Fresh blue theme perfect for lifestyle brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/ocean-breeze.svg',
    features: ['Ocean blue gradients', 'Wave animations', 'Fresh design', 'Beach vibes', 'Maps & social'],
  },
  'sunset-glow': {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm orange sunset theme for cozy brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/sunset-glow.svg',
    features: ['Sunset colors', 'Warm gradients', 'Cozy feel', 'Hover glows', 'Location map'],
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Nature-inspired eco-friendly design',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/forest-green.svg',
    features: ['Eco green theme', 'Nature elements', 'Organic feel', 'Sustainable vibe', 'Complete footer'],
  },
  'berry-blast': {
    id: 'berry-blast',
    name: 'Berry Blast',
    description: 'Sweet berry pink theme for feminine brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/berry-blast.svg',
    features: ['Berry pink colors', 'Sweet design', 'Feminine touch', 'Soft animations', 'Social & maps'],
  },
  'midnight-blue': {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep blue professional night theme',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/midnight-blue.svg',
    features: ['Midnight blue', 'Night mode', 'Professional dark', 'Star effects', 'Full footer'],
  },
  'coffee-shop': {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    description: 'Warm brown theme perfect for cafes',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/coffee-shop.svg',
    features: ['Coffee brown', 'Warm atmosphere', 'Cafe vibes', 'Steam effects', 'Maps location'],
  },
  'lavender-dreams': {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    description: 'Soft purple dreamy design for beauty brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/lavender-dreams.svg',
    features: ['Lavender purple', 'Dreamy gradients', 'Beauty focused', 'Soft animations', 'Complete footer'],
  },
  'coral-reef': {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Vibrant coral theme with underwater vibes',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/coral-reef.svg',
    features: ['Coral pink-orange', 'Underwater effects', 'Vibrant colors', 'Wave animations', 'Maps & social'],
  },
  'mint-fresh': {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    description: 'Cool mint green for fresh modern brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/mint-fresh.svg',
    features: ['Mint green', 'Fresh & cool', 'Modern clean', 'Smooth animations', 'Full footer'],
  },
  'peach-perfect': {
    id: 'peach-perfect',
    name: 'Peach Perfect',
    description: 'Soft peach theme for elegant boutiques',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/peach-perfect.svg',
    features: ['Peach colors', 'Soft elegance', 'Boutique style', 'Gentle animations', 'Location map'],
  },
  'steel-gray': {
    id: 'steel-gray',
    name: 'Steel Gray',
    description: 'Industrial gray theme for tech stores',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/steel-gray.svg',
    features: ['Steel gray', 'Industrial look', 'Tech focused', 'Metal effects', 'Complete footer'],
  },
  'ruby-red': {
    id: 'ruby-red',
    name: 'Ruby Red',
    description: 'Bold red theme for powerful brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/ruby-red.svg',
    features: ['Ruby red', 'Bold & powerful', 'High energy', 'Glow effects', 'Maps & social'],
  },
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm gold theme for luxury products',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/golden-hour.svg',
    features: ['Golden yellows', 'Warm luxury', 'Premium feel', 'Shine effects', 'Full footer'],
  },
  'turquoise-bay': {
    id: 'turquoise-bay',
    name: 'Turquoise Bay',
    description: 'Tropical turquoise for travel & lifestyle',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/turquoise-bay.svg',
    features: ['Turquoise blue', 'Tropical vibes', 'Travel theme', 'Wave effects', 'Location map'],
  },
  'charcoal-elite': {
    id: 'charcoal-elite',
    name: 'Charcoal Elite',
    description: 'Dark charcoal for premium modern brands',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/charcoal-elite.svg',
    features: ['Charcoal dark', 'Elite style', 'Modern premium', 'Subtle animations', 'Complete footer'],
  },
  'rose-garden': {
    id: 'rose-garden',
    name: 'Rose Garden',
    description: 'Romantic rose theme for wedding & gifts',
    tier: 'PREMIUM',
    thumbnail: '/template-previews/rose-garden.svg',
    features: ['Rose pink', 'Romantic design', 'Garden theme', 'Petal effects', 'Maps & social'],
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
