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
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean design dengan hover overlay cards - Perfect untuk pemula',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop',
    config: {
      nav: 'modern-nav',
      hero: 'gradient-hero',
      productCard: 'card-hover-overlay',
      footer: 'modern-footer',
    },
    tier: 'FREE',
  },
  {
    id: 'bold-interactive',
    name: 'Bold Interactive',
    description: '3D flip cards - Engaging & memorable experience',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    config: {
      nav: 'modern-nav',
      hero: 'gradient-hero',
      productCard: 'card-flip-3d',
      footer: 'modern-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'ecommerce-pro',
    name: 'E-Commerce Pro',
    description: 'Multi-image slider - Showcase produk dengan detail maksimal',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    config: {
      nav: 'modern-nav',
      hero: 'gradient-hero',
      productCard: 'card-image-slider',
      footer: 'modern-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'premium-zoom',
    name: 'Premium Zoom',
    description: 'Zoom hover dengan quick actions - Professional & feature-rich',
    thumbnail: 'https://images.unsplash.com/photo-1555982105-d25af4182e4e?w=400&h=300&fit=crop',
    config: {
      nav: 'modern-nav',
      hero: 'gradient-hero',
      productCard: 'card-zoom-hover',
      footer: 'modern-footer',
    },
    tier: 'PREMIUM',
  },
  {
    id: 'luxury-glow',
    name: 'Luxury Glow',
    description: 'Gradient glow border - Premium & eye-catching design',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=300&fit=crop',
    config: {
      nav: 'modern-nav',
      hero: 'gradient-hero',
      productCard: 'card-gradient-glow',
      footer: 'modern-footer',
    },
    tier: 'PREMIUM',
  },
]

/**
 * Get template package by ID
 */
export function getTemplatePackage(id: string): TemplatePackage | undefined {
  return TEMPLATE_PACKAGES.find(pkg => pkg.id === id)
}
