# Store Template Developer Guide

Complete guide untuk membuat custom store templates di dibeli.my.id platform.

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Template Structure](#template-structure)
3. [Creating a New Template](#creating-a-new-template)
4. [Template Props & Types](#template-props--types)
5. [Styling Guidelines](#styling-guidelines)
6. [Best Practices](#best-practices)
7. [Testing Your Template](#testing-your-template)
8. [Registration & Deployment](#registration--deployment)

---

## Introduction

Store templates adalah React components yang menampilkan toko online users. Setiap template harus:
- ✅ Fully responsive (mobile-first)
- ✅ Support semua product data fields
- ✅ Include WhatsApp integration
- ✅ Follow accessibility standards
- ✅ Optimized for performance

**Template Tiers:**
- **FREE**: Basic, functional designs
- **PREMIUM**: Professional designs with animations
- **UNLIMITED**: Advanced designs with premium features

---

## Template Structure

### File Location
```
src/components/store-templates/
├── types.ts                      # Shared interfaces
├── registry.ts                   # Template registration
├── YourTemplateName.tsx          # Your template component
└── README.md
```

### Basic Template Structure

```tsx
'use client'

import { StoreTemplateProps } from './types'
import Link from 'next/link'

export default function YourTemplateName({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav>{/* ... */}</nav>
      
      {/* Hero/Header */}
      <header>{/* ... */}</header>
      
      {/* Product Grid */}
      <main>{/* ... */}</main>
      
      {/* Footer */}
      <footer>{/* ... */}</footer>
    </div>
  )
}
```

---

## Creating a New Template

### Step 1: Create Component File

```bash
# Create new template file
touch src/components/store-templates/MyAwesomeTemplate.tsx
```

### Step 2: Define Component

```tsx
'use client'

import { StoreTemplateProps } from './types'
import Link from 'next/link'

/**
 * My Awesome Template
 * Description: Brief description of your template
 * Tier: FREE | PREMIUM | UNLIMITED
 */
export default function MyAwesomeTemplate({ store, products }: StoreTemplateProps) {
  // Your implementation
}
```

### Step 3: Implement Sections

**Required Sections:**
1. **Navbar** - Store branding, contact button
2. **Hero/Header** - Welcome message, store info
3. **Product Grid/List** - Display products
4. **Footer** - Store details, social links

---

## Template Props & Types

### StoreTemplateProps

```typescript
interface StoreTemplateProps {
  store: StoreTemplateStore
  products: StoreTemplateProduct[]
}
```

### StoreTemplateStore

```typescript
interface StoreTemplateStore {
  id: string
  name: string                    // Store name
  slug: string                    // URL slug
  description?: string | null     // Store description
  tagline?: string | null         // Short tagline
  logoUrl?: string | null         // Logo image URL
  whatsappNumber: string          // WhatsApp number (required)
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  province?: string | null
  // Social media
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
```

### StoreTemplateProduct

```typescript
interface StoreTemplateProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number | null
  discountPercent?: number | null
  description?: string | null
  images: string[]                // Google Drive IDs
  isAvailable: boolean
  stock?: number | null
  isNew?: boolean
  category?: string
  rating?: number
  reviewCount?: number
  hasConversionPage?: boolean
  conversionPageSlug?: string | null
}
```

---

## Styling Guidelines

### Color Schemes by Tier

**FREE Tier:**
- Simple, clean colors
- Gray/Blue/Green basics
- Minimal gradients

**PREMIUM Tier:**
- Professional color schemes
- Subtle gradients
- 2-3 accent colors

**UNLIMITED Tier:**
- Complex gradients
- Multiple accent colors
- Advanced animations

### TailwindCSS Usage

```tsx
// ✅ Good: Descriptive, reusable classes
<div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">

// ❌ Avoid: Inline styles
<div style={{ backgroundColor: '#fff', borderRadius: '12px' }}>
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  text-sm           // Mobile
  md:text-base      // Tablet
  lg:text-lg        // Desktop
">
```

---

## Best Practices

### 1. **WhatsApp Integration**

Always use the provided `handleWhatsAppOrder` pattern:

```tsx
const handleWhatsAppOrder = (productName: string, price: number) => {
  const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
  const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}
```

### 2. **Image Handling**

Google Drive images with fallback:

```tsx
<img
  src={`https://drive.google.com/thumbnail?id=${imageId}&sz=w500`}
  alt={product.name}
  onError={(e) => {
    e.currentTarget.src = `https://lh3.googleusercontent.com/d/${imageId}=w500`
  }}
/>
```

### 3. **Conversion Page Links**

Check for conversion pages before linking:

```tsx
{product.hasConversionPage && product.conversionPageSlug ? (
  <Link href={`/p/${product.conversionPageSlug}`}>
    <button>Lihat Detail</button>
  </Link>
) : (
  <button onClick={() => handleWhatsAppOrder(product.name, product.price)}>
    Pesan Sekarang
  </button>
)}
```

### 4. **Empty States**

Always handle empty products:

```tsx
{products.length === 0 ? (
  <div className="text-center py-20">
    <p>Belum ada produk tersedia</p>
  </div>
) : (
  // Product grid
)}
```

### 5. **Price Formatting**

Use Indonesian locale:

```tsx
Rp {product.price.toLocaleString('id-ID')}
```

### 6. **Discount Display**

Show original price and savings:

```tsx
{product.originalPrice && product.originalPrice > product.price && (
  <>
    <p className="line-through text-gray-400">
      Rp {product.originalPrice.toLocaleString('id-ID')}
    </p>
    {product.discountPercent && (
      <span className="bg-red-600 text-white px-2 py-1 rounded">
        -{product.discountPercent}%
      </span>
    )}
  </>
)}
```

---

## Testing Your Template

### 1. **Visual Testing**

Test dengan data berbeda:
- Empty products array
- 1 product
- Many products (10+)
- Products with/without images
- Long product names
- Various price ranges

### 2. **Responsive Testing**

Test di berbagai screen sizes:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px+

### 3. **Interaction Testing**

- Click WhatsApp button
- Click conversion page links
- Hover effects
- Loading states

---

## Registration & Deployment

### Step 1: Register in Registry

Edit `src/components/store-templates/registry.ts`:

```typescript
// 1. Import your template
import MyAwesomeTemplate from './MyAwesomeTemplate'

// 2. Add to STORE_TEMPLATES
export const STORE_TEMPLATES = {
  // ... existing templates
  'my-awesome': MyAwesomeTemplate,
} as const

// 3. Add metadata to TEMPLATE_INFO
export const TEMPLATE_INFO: Record<StoreTemplateId, TemplateInfo> = {
  // ... existing info
  'my-awesome': {
    id: 'my-awesome',
    name: 'My Awesome Template',
    description: 'Amazing template for modern stores',
    tier: 'PREMIUM', // or 'FREE' or 'UNLIMITED'
    thumbnail: '/template-previews/my-awesome.svg',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
  },
}
```

### Step 2: Create Preview Screenshot

Create SVG preview at:
```
public/template-previews/my-awesome.svg
```

Preview should be 800x600px showing:
- Navbar
- Product grid
- Overall color scheme

### Step 3: Build & Test

```bash
npm run build
npm run dev
```

Navigate to `/dashboard/store/template` to see your template.

### Step 4: Commit

```bash
git add src/components/store-templates/MyAwesomeTemplate.tsx
git add src/components/store-templates/registry.ts
git add public/template-previews/my-awesome.svg
git commit -m "feat: Add MyAwesomeTemplate (PREMIUM tier)"
```

---

## Template Examples

### Minimal Template (FREE)

```tsx
export default function MinimalTemplate({ store, products }: StoreTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b p-4">
        <h1 className="font-bold">{store.name}</h1>
      </nav>
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded p-4">
              <h3>{product.name}</h3>
              <p>Rp {product.price.toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
```

### Premium Template (PREMIUM)

```tsx
export default function PremiumTemplate({ store, products }: StoreTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        {/* Enhanced navbar with gradients */}
      </nav>
      <main>
        <div className="grid gap-6">
          {products.map(product => (
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all">
              {/* Product card with animations */}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
```

### Luxury Template (UNLIMITED)

```tsx
export default function LuxuryTemplate({ store, products }: StoreTemplateProps) {
  const [scrolled, setScrolled] = useState(false)
  
  return (
    <div className="min-h-screen bg-black">
      {/* Animated background effects */}
      <div className="fixed inset-0 opacity-20">
        {/* Gradient orbs with animations */}
      </div>
      
      {/* Advanced navbar with scroll effects */}
      <nav className={scrolled ? 'bg-black/90 backdrop-blur-xl' : 'bg-transparent'}>
        {/* ... */}
      </nav>
      
      {/* Product grid with glow effects */}
      <main>
        {products.map(product => (
          <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-0 group-hover:opacity-30" />
            {/* Product card */}
          </div>
        ))}
      </main>
    </div>
  )
}
```

---

## Performance Tips

1. **Use Next.js Image** for large images (optional)
2. **Lazy load** images below the fold
3. **Minimize animations** on mobile
4. **Use CSS transforms** instead of position changes
5. **Optimize bundle size** - avoid heavy dependencies

---

## Common Issues & Solutions

### Issue: Images not loading
**Solution:** Check Google Drive ID format, use fallback URL

### Issue: WhatsApp link not working
**Solution:** Ensure whatsappNumber format (no spaces, include country code)

### Issue: Template not showing in selector
**Solution:** Check registration in registry.ts, verify tier access

### Issue: Styling conflicts
**Solution:** Use specific class names, avoid global styles

---

## Support & Resources

- **Main Documentation:** `/README.md`
- **Type Definitions:** `/src/components/store-templates/types.ts`
- **Existing Templates:** `/src/components/store-templates/`
- **Registry:** `/src/components/store-templates/registry.ts`

---

## Changelog

- **v1.0.0** (2024-11) - Initial template system
- **v1.1.0** (2024-11) - Added 8 templates (2 FREE, 3 PREMIUM, 3 UNLIMITED)
- **v1.2.0** (2024-11) - Added preview screenshots
- **v1.3.0** (2024-11) - Added custom color support (coming soon)

---

Happy Template Building! 🎨
