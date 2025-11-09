/**
 * Template Renderer - Convert template variables to real data
 * Uses Handlebars for proper template parsing
 */

import Handlebars from 'handlebars'

export interface TemplateData {
  store: {
    name: string
    logo?: string
    tagline?: string
    description?: string
    whatsappNumber: string
    address?: string
  }
  products: Array<{
    id: string
    name: string
    slug: string
    price: string
    priceRaw: number
    description?: string
    image: string
    images: string[]
    isAvailable: boolean
    stock?: number
    isNew?: boolean
    category?: string
    rating?: number
    reviewCount?: number
  }>
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    headingFont: string
    borderRadius: string
    buttonStyle: string
  }
}

/**
 * Register Handlebars helpers
 */
function registerHelpers() {
  // Helper for comparing values
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b
  })
  
  // Helper for formatting currency
  Handlebars.registerHelper('currency', function(value) {
    return formatPriceRupiah(value)
  })
}

/**
 * Main render function
 * Combines HTML, CSS, JS with data using Handlebars
 */
export function renderTemplate(
  html: string,
  css: string,
  js: string,
  data: TemplateData
): string {
  // Register helpers
  registerHelpers()
  
  // Compile HTML template with Handlebars
  const htmlTemplate = Handlebars.compile(html)
  const processedHtml = htmlTemplate(data)
  
  // Apply theme to CSS (replace var() with actual values)
  let processedCss = css
  processedCss = processedCss.replace(/var\(--primary-color[^)]*\)/g, data.theme.primaryColor)
  processedCss = processedCss.replace(/var\(--secondary-color[^)]*\)/g, data.theme.secondaryColor)
  processedCss = processedCss.replace(/var\(--accent-color[^)]*\)/g, data.theme.accentColor)
  processedCss = processedCss.replace(/var\(--bg-color[^)]*\)/g, data.theme.backgroundColor)
  processedCss = processedCss.replace(/var\(--text-color[^)]*\)/g, data.theme.textColor)
  processedCss = processedCss.replace(/var\(--font-family[^)]*\)/g, data.theme.fontFamily)
  processedCss = processedCss.replace(/var\(--heading-font[^)]*\)/g, data.theme.headingFont)
  processedCss = processedCss.replace(/var\(--border-radius[^)]*\)/g, data.theme.borderRadius)
  
  // Apply data to JS (compile with Handlebars)
  const jsTemplate = Handlebars.compile(js)
  const processedJs = jsTemplate(data)
  
  // Combine everything
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.store.name}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${data.theme.fontFamily}, sans-serif;
      color: ${data.theme.textColor};
      background: ${data.theme.backgroundColor};
      line-height: 1.6;
    }
    
    ${processedCss}
  </style>
</head>
<body>
  ${processedHtml}
  
  <script>
    ${processedJs}
  </script>
</body>
</html>
  `.trim()
}

/**
 * Helper: Get default theme
 */
export function getDefaultTheme(): TemplateData['theme'] {
  return {
    primaryColor: '#667eea',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    backgroundColor: '#f9fafb',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    borderRadius: '12px',
    buttonStyle: 'rounded',
  }
}

/**
 * Helper: Format price to Rupiah
 */
export function formatPriceRupiah(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}
