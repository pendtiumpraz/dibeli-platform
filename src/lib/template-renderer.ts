/**
 * Template Renderer - Convert template variables to real data
 * Supports Handlebars-style syntax: {{variable}} and {{#each}}
 */

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
 * Simple template variable replacement
 * Supports: {{store.name}}, {{product.price}}, etc
 */
export function replaceVariables(
  template: string,
  data: TemplateData
): string {
  let result = template

  // Replace store variables
  result = result.replace(/\{\{store\.(\w+)\}\}/g, (match, key) => {
    return (data.store as any)[key] || ''
  })

  // Replace theme variables
  result = result.replace(/\{\{theme\.(\w+)\}\}/g, (match, key) => {
    return (data.theme as any)[key] || ''
  })

  return result
}

/**
 * Process each loop for products
 * Supports: {{#each products}} ... {{/each}}
 */
export function processProductLoop(
  template: string,
  products: TemplateData['products']
): string {
  const eachRegex = /\{\{#each products\}\}([\s\S]*?)\{\{\/each\}\}/g
  
  return template.replace(eachRegex, (match, loopContent) => {
    return products.map((product, index) => {
      let itemHtml = loopContent
      
      // Replace product variables
      itemHtml = itemHtml.replace(/\{\{this\.(\w+)\}\}/g, (m: string, key: string) => {
        return (product as any)[key] || ''
      })
      
      // Replace index
      itemHtml = itemHtml.replace(/\{\{@index\}\}/g, index.toString())
      
      // Handle conditional: {{#if this.isNew}}
      itemHtml = itemHtml.replace(
        /\{\{#if this\.(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
        (m: string, key: string, content: string) => {
          return (product as any)[key] ? content : ''
        }
      )
      
      return itemHtml
    }).join('')
  })
}

/**
 * Apply theme CSS variables
 */
export function applyThemeVariables(
  css: string,
  theme: TemplateData['theme']
): string {
  let result = css
  
  // Replace CSS variables
  const replacements: Record<string, string> = {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--accent-color': theme.accentColor,
    '--bg-color': theme.backgroundColor,
    '--text-color': theme.textColor,
    '--font-family': theme.fontFamily,
    '--heading-font': theme.headingFont,
    '--border-radius': theme.borderRadius,
  }
  
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`var\\(${key}(?:,\\s*[^)]+)?\\)`, 'g')
    result = result.replace(regex, value)
  })
  
  return result
}

/**
 * Apply theme to JavaScript
 */
export function applyThemeToJS(
  js: string,
  data: TemplateData
): string {
  let result = js
  
  // Replace WhatsApp number
  result = result.replace(/\{\{store\.whatsappNumber\}\}/g, data.store.whatsappNumber)
  result = result.replace(/\{\{whatsappNumber\}\}/g, data.store.whatsappNumber)
  
  // Replace store name
  result = result.replace(/\{\{store\.name\}\}/g, data.store.name)
  
  return result
}

/**
 * Main render function
 * Combines HTML, CSS, JS with data
 */
export function renderTemplate(
  html: string,
  css: string,
  js: string,
  data: TemplateData
): string {
  // Process product loops first
  let processedHtml = processProductLoop(html, data.products)
  
  // Replace simple variables
  processedHtml = replaceVariables(processedHtml, data)
  
  // Apply theme to CSS
  const processedCss = applyThemeVariables(css, data.theme)
  
  // Apply theme to JS
  const processedJs = applyThemeToJS(js, data)
  
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
