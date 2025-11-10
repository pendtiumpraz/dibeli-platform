/**
 * Template Combiner - Combine multiple components into complete template
 */

import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import { TemplateData, renderTemplate, formatPriceRupiah } from './template-renderer'

// Register Handlebars helpers
Handlebars.registerHelper('gt', function(a: any, b: any) {
  return a > b
})

Handlebars.registerHelper('eq', function(a: any, b: any) {
  return a === b
})

Handlebars.registerHelper('currency', function(value: any) {
  return formatPriceRupiah(value)
})

export interface TemplateConfig {
  hero?: string // e.g., 'gradient-hero'
  productCard: string // e.g., 'card-hover-overlay', 'card-flip-3d', 'card-image-slider'
  background?: string
  nav?: string
  footer?: string
}

export interface TemplatePackage {
  id: string
  name: string
  description: string
  thumbnail: string
  config: TemplateConfig
  tier: 'FREE' | 'PREMIUM' | 'UNLIMITED'
}

/**
 * Get component HTML
 */
export function getComponent(type: string, name: string): string {
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'components',
      type,
      `${name}.html`
    )
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`Component not found: ${type}/${name}`)
    return ''
  }
}

/**
 * Get component CSS
 */
export function getComponentCSS(type: string, name: string): string {
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'components',
      type,
      `${name}.css`
    )
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`Component CSS not found: ${type}/${name}`)
    return ''
  }
}

/**
 * Get component JS
 */
export function getComponentJS(type: string, name: string): string {
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'components',
      type,
      `${name}.js`
    )
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    // JS is optional
    return ''
  }
}

/**
 * Combine template components
 */
export function combineTemplate(config: TemplateConfig, data: TemplateData): string {
  let html = ''
  let css = ''
  let js = ''

  // Add navigation
  if (config.nav) {
    const navHTML = getComponent('navs', config.nav)
    const navCSS = getComponentCSS('navs', config.nav)
    const navJS = getComponentJS('navs', config.nav)
    
    html += navHTML
    css += navCSS
    js += navJS
  }

  // Add hero section
  if (config.hero) {
    const heroHTML = getComponent('heroes', config.hero)
    const heroCSS = getComponentCSS('heroes', config.hero)
    const heroJS = getComponentJS('heroes', config.hero)
    
    html += heroHTML
    css += heroCSS
    js += heroJS
  }

  // Add products section
  const productsHTML = `
<section id="products" class="products-section">
  <div class="products-container">
    <div class="products-grid">
      {{#each products}}
        ${getComponent('products', config.productCard)}
      {{/each}}
    </div>
  </div>
</section>
  `
  
  const productsCSS = `
.products-section {
  padding: 80px 20px;
  background: var(--bg-color);
}

.products-container {
  max-width: 1280px;
  margin: 0 auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .products-section {
    padding: 60px 15px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

${getComponentCSS('products', config.productCard)}
  `
  
  const productsJS = getComponentJS('products', config.productCard)

  html += productsHTML
  css += productsCSS
  js += productsJS

  // Add Quick View Modal (for products without landing page)
  const modalHTML = getComponent('modals', 'quick-view-modal')
  const modalCSS = getComponentCSS('modals', 'quick-view-modal')
  const modalJS = getComponentJS('modals', 'quick-view-modal')
  
  html += modalHTML
  css += modalCSS
  js += modalJS

  // Add footer
  if (config.footer) {
    const footerHTML = getComponent('footers', config.footer)
    const footerCSS = getComponentCSS('footers', config.footer)
    const footerJS = getComponentJS('footers', config.footer)
    
    html += footerHTML
    css += footerCSS
    js += footerJS
  }

  // Render with Handlebars
  return renderTemplate(html, css, js, data)
}

/**
 * Predefined template packages
 */
export const TEMPLATE_PACKAGES: TemplatePackage[] = [
  // ========== FREE TIER (1 template - BASIC DESIGN) ==========
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: '✨ Template basic dengan design simple & clean - Cocok untuk pemula',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop',
    config: {
      nav: 'modern-nav',
      hero: 'gradient-hero',
      productCard: 'card-hover-overlay',
      footer: 'modern-footer',
    },
    tier: 'FREE',
  },
  
  // ========== PREMIUM TIER (10 templates - PROFESSIONAL & KEREN!) ==========
  {
    id: 'bold-interactive',
    name: 'Bold Interactive',
    description: '💎 Glassmorphism nav + 3D flip cards - Engaging & modern design',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    config: {
      nav: 'glass-nav',
      hero: 'gradient-hero',
      productCard: 'card-flip-3d',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'ecommerce-pro',
    name: 'E-Commerce Pro',
    description: '💎 Premium nav + image slider - Professional showcase maksimal',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'gradient-hero',
      productCard: 'card-image-slider',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'premium-zoom',
    name: 'Premium Zoom',
    description: '💎 Glass nav + zoom hover - Elegant & feature-rich interface',
    thumbnail: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=400&h=300&fit=crop',
    config: {
      nav: 'glass-nav',
      hero: 'gradient-hero',
      productCard: 'card-zoom-hover',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'luxury-glow',
    name: 'Luxury Glow',
    description: '💎 Premium nav + gradient glow - Premium & eye-catching',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'gradient-hero',
      productCard: 'card-gradient-glow',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'carousel-showcase',
    name: 'Carousel Showcase',
    description: '💎 Glass nav + carousel hero - Dynamic & professional',
    thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
    config: {
      nav: 'glass-nav',
      hero: 'carousel-hero',
      productCard: 'card-hover-overlay',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'split-modern',
    name: 'Split Modern',
    description: '💎 Premium nav + split hero - Contemporary & stylish design',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'split-hero',
      productCard: 'card-gradient-glow',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'carousel-flip',
    name: 'Carousel Flip',
    description: '💎 Glass nav + carousel + 3D flip - Best premium combo',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    config: {
      nav: 'glass-nav',
      hero: 'carousel-hero',
      productCard: 'card-flip-3d',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'split-slider',
    name: 'Split Slider',
    description: '💎 Premium nav + split hero + slider - Perfect professional combo',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'split-hero',
      productCard: 'card-image-slider',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'gradient-zoom',
    name: 'Gradient Zoom',
    description: '💎 Glass nav + gradient hero + zoom - Clean & professional',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    config: {
      nav: 'glass-nav',
      hero: 'gradient-hero',
      productCard: 'card-zoom-hover',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'carousel-glow',
    name: 'Carousel Glow',
    description: '💎 Premium nav + carousel + glow - Luxurious premium design',
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'carousel-hero',
      productCard: 'card-gradient-glow',
      footer: 'premium-footer',
    },
    tier: 'PREMIUM',
  },
  
  // ========== UNLIMITED TIER (5 exclusive - LUXURY & CONVERSION FOCUSED!) ==========
  {
    id: 'ultimate-carousel',
    name: 'Ultimate Carousel',
    description: '⚡ Premium nav + ultimate hero + slider - Maximum luxury showcase!',
    thumbnail: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'ultimate-hero',
      productCard: 'card-image-slider',
      footer: 'ultimate-footer',
    },
    tier: 'UNLIMITED',
  },
  {
    id: 'ultimate-split',
    name: 'Ultimate Split',
    description: '⚡ Premium nav + ultimate hero + zoom - Conversion powerhouse!',
    thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'ultimate-hero',
      productCard: 'card-zoom-hover',
      footer: 'ultimate-footer',
    },
    tier: 'UNLIMITED',
  },
  {
    id: 'ultimate-gradient',
    name: 'Ultimate Gradient',
    description: '⚡ Premium nav + ultimate hero + 3D flip - Stunning luxury design!',
    thumbnail: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'ultimate-hero',
      productCard: 'card-flip-3d',
      footer: 'ultimate-footer',
    },
    tier: 'UNLIMITED',
  },
  {
    id: 'ultimate-luxury',
    name: 'Ultimate Luxury',
    description: '⚡ Premium nav + ultimate hero + overlay - Timeless luxury elegance!',
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'ultimate-hero',
      productCard: 'card-hover-overlay',
      footer: 'ultimate-footer',
    },
    tier: 'UNLIMITED',
  },
  {
    id: 'ultimate-premium',
    name: 'Ultimate Premium',
    description: '⚡ Premium nav + ultimate hero + zoom - Supreme MAX SALES combo!',
    thumbnail: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop',
    config: {
      nav: 'premium-nav',
      hero: 'ultimate-hero',
      productCard: 'card-zoom-hover',
      footer: 'ultimate-footer',
    },
    tier: 'UNLIMITED',
  },
]

/**
 * Get template package by ID
 */
export function getTemplatePackage(id: string): TemplatePackage | undefined {
  return TEMPLATE_PACKAGES.find(pkg => pkg.id === id)
}
