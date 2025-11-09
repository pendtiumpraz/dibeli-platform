# 🎨 Template Customization System - Implementation Plan

## 🎯 GOAL
Make templates **dynamic & customizable** like js-interaction examples:
- User can customize colors, fonts, layouts
- Templates fetch real product data from database
- JavaScript interactions work (WhatsApp, wishlist, etc)
- Template marketplace for users to choose

---

## 📊 CURRENT STATUS

### ✅ What We Have:
1. **45 Seeded Templates** in database
2. **Template Preview** page (`/dashboard/templates/[slug]/preview`)
3. **Template Apply** system (copy HTML/CSS/JS to store)
4. **Static HTML** - No dynamic data yet

### ❌ What's Missing:
1. **Template Rendering** with real product data
2. **Customization UI** (color picker, font selector)
3. **Template Variables** (placeholders for data)
4. **Live Preview** with user's products
5. **Template Settings** per store

---

## 🏗️ ARCHITECTURE PLAN

### **Phase 1: Template Variables System** ⭐ START HERE

Convert static templates to dynamic:

```html
<!-- BEFORE (Static): -->
<h3 class="card-title">Kurma Premium Ajwa 500gr</h3>
<div class="card-price">Rp 125.000</div>

<!-- AFTER (Dynamic): -->
<h3 class="card-title">{{product.name}}</h3>
<div class="card-price">{{product.price}}</div>
```

**Template Variables:**
```javascript
{
  // Store Info
  store: {
    name: "Toko ABC",
    logo: "url",
    tagline: "Produk Berkualitas",
    whatsapp: "081234567890"
  },
  
  // Products Array
  products: [
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: "Rp 12.500.000",
      image: "drive.google.com/...",
      description: "...",
      isAvailable: true,
      stock: 10
    }
  ],
  
  // Theme Settings
  theme: {
    primaryColor: "#667eea",
    secondaryColor: "#10b981",
    fontFamily: "Inter",
    buttonStyle: "rounded" // rounded | square
  }
}
```

---

### **Phase 2: Template Renderer** 

Create server-side renderer:

```typescript
// src/lib/template-renderer.ts

export function renderTemplate(
  template: Template,
  data: TemplateData,
  theme: ThemeSettings
): string {
  let html = template.htmlContent
  let css = template.cssContent
  let js = template.jsContent
  
  // Replace variables
  html = html.replace(/\{\{(\w+\.\w+)\}\}/g, (match, path) => {
    return getNestedValue(data, path) || ''
  })
  
  // Apply theme colors
  css = css.replace(/--primary-color/g, theme.primaryColor)
  css = css.replace(/--secondary-color/g, theme.secondaryColor)
  
  // Inject JavaScript
  js = js.replace('{{whatsappNumber}}', data.store.whatsapp)
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${css}</style>
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
    </html>
  `
}
```

---

### **Phase 3: Store Theme Settings**

Add theme customization to database:

```prisma
model StoreTheme {
  id        String @id @default(cuid())
  storeId   String @unique
  store     Store  @relation(fields: [storeId], references: [id])
  
  // Colors
  primaryColor    String @default("#667eea")
  secondaryColor  String @default("#10b981")
  accentColor     String @default("#f59e0b")
  backgroundColor String @default("#ffffff")
  textColor       String @default("#1f2937")
  
  // Typography
  fontFamily      String @default("Inter")
  headingFont     String @default("Inter")
  fontSize        String @default("16px")
  
  // Layout
  containerWidth  String @default("1280px")
  borderRadius    String @default("12px")
  spacing         String @default("normal") // compact | normal | spacious
  
  // Components
  buttonStyle     String @default("rounded") // rounded | square | pill
  cardStyle       String @default("shadow") // shadow | border | flat
  imageStyle      String @default("cover") // cover | contain | rounded-circle
  
  // Custom CSS
  customCss       String? @db.Text
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

### **Phase 4: Customization UI**

Create `/dashboard/store/customize` page:

```tsx
// Customization Panel
<div className="customization-panel">
  <Tabs>
    <Tab label="Colors">
      <ColorPicker
        label="Primary Color"
        value={theme.primaryColor}
        onChange={(color) => updateTheme({ primaryColor: color })}
      />
      <ColorPicker
        label="Secondary Color"
        value={theme.secondaryColor}
        onChange={(color) => updateTheme({ secondaryColor: color })}
      />
    </Tab>
    
    <Tab label="Typography">
      <FontSelect
        label="Font Family"
        value={theme.fontFamily}
        options={['Inter', 'Poppins', 'Roboto', 'Montserrat']}
        onChange={(font) => updateTheme({ fontFamily: font })}
      />
    </Tab>
    
    <Tab label="Layout">
      <Select
        label="Button Style"
        value={theme.buttonStyle}
        options={['rounded', 'square', 'pill']}
        onChange={(style) => updateTheme({ buttonStyle: style })}
      />
    </Tab>
  </Tabs>
  
  {/* Live Preview */}
  <div className="preview-pane">
    <iframe
      src={`/preview?storeId=${storeId}`}
      className="w-full h-full"
    />
  </div>
</div>
```

---

### **Phase 5: Public Store Rendering**

Update `/toko/[slug]` to use template renderer:

```typescript
// app/toko/[slug]/page.tsx

export default async function PublicStorePage({ params }) {
  const store = await getStoreBySlug(params.slug)
  const products = await getStoreProducts(store.id)
  const theme = await getStoreTheme(store.id)
  const template = await getTemplate(store.templateId)
  
  // Render template with data
  const html = renderTemplate(template, {
    store: {
      name: store.name,
      logo: store.logo,
      whatsapp: store.whatsappNumber
    },
    products: products.map(p => ({
      name: p.name,
      price: formatPrice(p.price),
      image: getDriveImageUrl(p.images[0]),
      description: p.description
    }))
  }, theme)
  
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
```

---

## 🎯 IMPLEMENTATION STEPS

### **Step 1: Convert 1 Template to Dynamic** (2 hours)
- Pick `branded-cards` template from js-interaction
- Add to database with variables: `{{product.name}}`, `{{product.price}}`
- Create simple renderer function
- Test with real product data

### **Step 2: Add Theme Settings** (2 hours)
- Create `StoreTheme` model in Prisma
- Create API routes: `/api/store/theme`
- Add default theme on store creation

### **Step 3: Build Customization UI** (3 hours)
- Create `/dashboard/store/customize` page
- Color picker component
- Font selector component
- Live preview iframe

### **Step 4: Update Public Store** (2 hours)
- Use template renderer in `/toko/[slug]`
- Load theme settings
- Inject product data
- Handle JavaScript (WhatsApp button)

### **Step 5: Add More Templates** (4 hours)
- Convert all templates from js-interaction
- Test each template with real data
- Ensure responsive design
- Test JavaScript interactions

---

## 📦 REQUIRED PACKAGES

```bash
npm install:
- react-colorful (color picker)
- @fontsource/* (Google Fonts)
- handlebars or mustache (template engine)
```

---

## 🎨 EXAMPLE: Dynamic Product Card

### Template (stored in database):
```html
<div class="product-card branded-classic">
  <div class="card-brand-header">
    <img src="{{store.logo}}" alt="Brand Logo" class="brand-logo">
    <div class="brand-info">
      <div class="brand-name">{{store.name}}</div>
      <div class="brand-tagline">{{store.tagline}}</div>
    </div>
  </div>
  
  {{#each products}}
  <div class="card-image">
    <img src="{{this.image}}" alt="{{this.name}}">
    {{#if this.isNew}}
    <div class="card-badge">Baru</div>
    {{/if}}
  </div>
  <div class="card-content">
    <h3 class="card-title">{{this.name}}</h3>
    <div class="card-price">{{this.price}}</div>
    <button class="card-button" onclick="orderViaWhatsApp('{{this.name}}', '{{this.price}}')">
      🛒 Beli Sekarang
    </button>
  </div>
  {{/each}}
</div>
```

### CSS with Variables:
```css
.product-card {
  background: var(--card-bg-color, #ffffff);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--card-shadow, 0 4px 6px rgba(0,0,0,0.1));
}

.card-button {
  background: var(--primary-color, #667eea);
  color: var(--button-text-color, #ffffff);
  border-radius: var(--button-radius, 8px);
}
```

### JavaScript:
```javascript
function orderViaWhatsApp(productName, price) {
  const whatsappNumber = '{{store.whatsapp}}'
  const message = `Halo, saya tertarik dengan:\n\nProduk: ${productName}\nHarga: ${price}\n\nApakah masih tersedia?`
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
}
```

---

## ✅ SUCCESS CRITERIA

User should be able to:
1. **Choose template** from marketplace
2. **Customize colors** (primary, secondary, accent)
3. **Customize fonts** (heading, body)
4. **Customize layout** (spacing, borders, shadows)
5. **See live preview** of changes
6. **Save settings** and apply to store
7. **View public store** with customized template
8. **Products auto-populate** from database
9. **WhatsApp button works** with store phone number
10. **Mobile responsive** automatically

---

## 🚀 NEXT ACTIONS

**START WITH:**
1. Pick 1 template from js-interaction (branded-cards)
2. Create template renderer function
3. Test with mock data
4. Show user the working proof of concept

**THEN:**
1. Add theme settings UI
2. Color picker
3. Live preview
4. Save to database

**Mau mulai implement Phase 1? Saya bisa:**
1. Convert branded-cards template ke dynamic version
2. Create template renderer
3. Test dengan product data mu
4. Show working demo!

Confirm kalau mau saya lanjut! 🚀
