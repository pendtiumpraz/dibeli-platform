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
  // FREE TIER (2)
  'simple-classic': SimpleClassicTemplate,
  'minimal-clean': MinimalCleanTemplate,
  
  // PREMIUM TIER (18) - Using existing templates as placeholders
  'elegant-shop': ElegantShopTemplate,
  'modern-professional': ModernProfessionalTemplate,
  'bold-colorful': BoldColorfulTemplate,
  'ocean-breeze': ElegantShopTemplate, // TODO: Create unique
  'sunset-glow': ElegantShopTemplate, // TODO: Create unique
  'forest-green': ElegantShopTemplate, // TODO: Create unique
  'berry-blast': ElegantShopTemplate, // TODO: Create unique
  'midnight-blue': ModernProfessionalTemplate, // TODO: Create unique
  'coffee-shop': ModernProfessionalTemplate, // TODO: Create unique
  'lavender-dreams': ElegantShopTemplate, // TODO: Create unique
  'coral-reef': BoldColorfulTemplate, // TODO: Create unique
  'mint-fresh': ElegantShopTemplate, // TODO: Create unique
  'peach-perfect': ElegantShopTemplate, // TODO: Create unique
  'steel-gray': ModernProfessionalTemplate, // TODO: Create unique
  'ruby-red': BoldColorfulTemplate, // TODO: Create unique
  'golden-hour': LuxuryBoutiqueTemplate, // TODO: Create unique
  'turquoise-bay': ElegantShopTemplate, // TODO: Create unique
  'charcoal-elite': ModernProfessionalTemplate, // TODO: Create unique
  'rose-garden': ElegantShopTemplate, // TODO: Create unique
  
  // UNLIMITED TIER (20) - Using existing as placeholders
  'luxury-boutique': LuxuryBoutiqueTemplate,
  'royal-marketplace': RoyalMarketplaceTemplate,
  'futuristic-store': FuturisticStoreTemplate,
  'diamond-sparkle': LuxuryBoutiqueTemplate, // TODO: Create unique
  'platinum-elite': LuxuryBoutiqueTemplate, // TODO: Create unique
  'crystal-palace': LuxuryBoutiqueTemplate, // TODO: Create unique
  'neon-nights': FuturisticStoreTemplate, // TODO: Create unique
  'aurora-borealis': LuxuryBoutiqueTemplate, // TODO: Create unique
  'cosmic-galaxy': FuturisticStoreTemplate, // TODO: Create unique
  'phoenix-fire': RoyalMarketplaceTemplate, // TODO: Create unique
  'dragon-scale': RoyalMarketplaceTemplate, // TODO: Create unique
  'thunder-storm': FuturisticStoreTemplate, // TODO: Create unique
  'ice-kingdom': LuxuryBoutiqueTemplate, // TODO: Create unique
  'velvet-noir': RoyalMarketplaceTemplate, // TODO: Create unique
  'champagne-dreams': LuxuryBoutiqueTemplate, // TODO: Create unique
  'emerald-city': LuxuryBoutiqueTemplate, // TODO: Create unique
  'sapphire-sky': LuxuryBoutiqueTemplate, // TODO: Create unique
  'opal-magic': LuxuryBoutiqueTemplate, // TODO: Create unique
  'obsidian-edge': FuturisticStoreTemplate, // TODO: Create unique
  'rose-quartz': LuxuryBoutiqueTemplate, // TODO: Create unique
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
  
  // UNLIMITED TIER (20 total - ULTRA PREMIUM)
  'luxury-boutique': {
    id: 'luxury-boutique',
    name: 'Luxury Boutique',
    description: 'Ultra-premium with advanced animations',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/luxury-boutique.svg',
    features: ['Animated background', 'Luxury gradients', 'Scroll effects', 'Premium animations', 'Maps integration', 'VIP experience'],
  },
  'royal-marketplace': {
    id: 'royal-marketplace',
    name: 'Royal Marketplace',
    description: 'Regal purple & gold with crown elements',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/royal-marketplace.svg',
    features: ['Royal purple theme', 'Gold accents', 'Crown elements', 'Elegant animations', 'Luxury feel', 'Complete footer'],
  },
  'futuristic-store': {
    id: 'futuristic-store',
    name: 'Futuristic Store',
    description: 'Sci-fi tech with neon & grid patterns',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/futuristic-store.svg',
    features: ['Neon cyan theme', 'Tech grid background', 'Mouse glow effect', 'Futuristic UI', 'Monospace fonts', 'Advanced animations'],
  },
  'diamond-sparkle': {
    id: 'diamond-sparkle',
    name: 'Diamond Sparkle',
    description: 'Brilliant diamond theme with sparkle effects',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/diamond-sparkle.svg',
    features: ['Diamond white/silver', 'Sparkle animations', 'Crystal effects', 'Luxury shine', 'Premium feel', 'Maps & social'],
  },
  'platinum-elite': {
    id: 'platinum-elite',
    name: 'Platinum Elite',
    description: 'Exclusive platinum theme for VIP brands',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/platinum-elite.svg',
    features: ['Platinum silver', 'Metallic gradients', 'Elite animations', 'Exclusive design', 'VIP vibes', 'Full footer'],
  },
  'crystal-palace': {
    id: 'crystal-palace',
    name: 'Crystal Palace',
    description: 'Majestic crystal design with glass effects',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/crystal-palace.svg',
    features: ['Crystal clear', 'Glass morphism', 'Prismatic effects', 'Elegant luxury', 'Palace theme', 'Location map'],
  },
  'neon-nights': {
    id: 'neon-nights',
    name: 'Neon Nights',
    description: 'Electric neon nightlife theme',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/neon-nights.svg',
    features: ['Multi-neon colors', 'Nightclub vibes', 'Glow effects', 'Party atmosphere', 'Electric energy', 'Complete footer'],
  },
  'aurora-borealis': {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Northern lights inspired magical theme',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/aurora-borealis.svg',
    features: ['Aurora gradients', 'Northern lights', 'Magical effects', 'Sky animations', 'Wonder theme', 'Maps & social'],
  },
  'cosmic-galaxy': {
    id: 'cosmic-galaxy',
    name: 'Cosmic Galaxy',
    description: 'Space galaxy with stars & nebula',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/cosmic-galaxy.svg',
    features: ['Galaxy background', 'Star field', 'Nebula colors', 'Space theme', 'Cosmic vibes', 'Full footer'],
  },
  'phoenix-fire': {
    id: 'phoenix-fire',
    name: 'Phoenix Fire',
    description: 'Fiery phoenix theme with flame effects',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/phoenix-fire.svg',
    features: ['Fire gradients', 'Flame animations', 'Phoenix rising', 'Heat effects', 'Power theme', 'Location map'],
  },
  'dragon-scale': {
    id: 'dragon-scale',
    name: 'Dragon Scale',
    description: 'Mythical dragon with iridescent scales',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/dragon-scale.svg',
    features: ['Iridescent scales', 'Dragon elements', 'Mythical theme', 'Color shifting', 'Epic feel', 'Complete footer'],
  },
  'thunder-storm': {
    id: 'thunder-storm',
    name: 'Thunder Storm',
    description: 'Electric storm with lightning effects',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/thunder-storm.svg',
    features: ['Storm clouds', 'Lightning bolts', 'Thunder effects', 'Electric blue', 'Powerful energy', 'Maps & social'],
  },
  'ice-kingdom': {
    id: 'ice-kingdom',
    name: 'Ice Kingdom',
    description: 'Frozen ice castle with crystal effects',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/ice-kingdom.svg',
    features: ['Icy blue/white', 'Frost effects', 'Crystal ice', 'Snow particles', 'Winter magic', 'Full footer'],
  },
  'velvet-noir': {
    id: 'velvet-noir',
    name: 'Velvet Noir',
    description: 'Luxurious black velvet with gold accents',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/velvet-noir.svg',
    features: ['Velvet black', 'Gold highlights', 'Luxury dark', 'Elegant mystery', 'High-end feel', 'Location map'],
  },
  'champagne-dreams': {
    id: 'champagne-dreams',
    name: 'Champagne Dreams',
    description: 'Elegant champagne gold with bubbles',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/champagne-dreams.svg',
    features: ['Champagne gold', 'Bubble effects', 'Celebration theme', 'Sparkling luxury', 'Toast vibes', 'Complete footer'],
  },
  'emerald-city': {
    id: 'emerald-city',
    name: 'Emerald City',
    description: 'Rich emerald green with gem effects',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/emerald-city.svg',
    features: ['Emerald green', 'Gem sparkle', 'City lights', 'Rich luxury', 'Jewel theme', 'Maps & social'],
  },
  'sapphire-sky': {
    id: 'sapphire-sky',
    name: 'Sapphire Sky',
    description: 'Deep sapphire blue with sky gradients',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/sapphire-sky.svg',
    features: ['Sapphire blue', 'Sky gradients', 'Cloud effects', 'Jewel luxury', 'Heaven theme', 'Full footer'],
  },
  'opal-magic': {
    id: 'opal-magic',
    name: 'Opal Magic',
    description: 'Mystical opal with rainbow iridescence',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/opal-magic.svg',
    features: ['Rainbow opal', 'Iridescent colors', 'Magic sparkle', 'Color shifting', 'Mystical vibe', 'Location map'],
  },
  'obsidian-edge': {
    id: 'obsidian-edge',
    name: 'Obsidian Edge',
    description: 'Sharp obsidian black with purple glow',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/obsidian-edge.svg',
    features: ['Obsidian black', 'Purple glow', 'Sharp edges', 'Dark luxury', 'Modern edge', 'Complete footer'],
  },
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    description: 'Soft rose crystal with healing vibes',
    tier: 'UNLIMITED',
    thumbnail: '/template-previews/rose-quartz.svg',
    features: ['Rose quartz pink', 'Crystal clarity', 'Healing energy', 'Soft luxury', 'Zen vibes', 'Maps & social'],
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
