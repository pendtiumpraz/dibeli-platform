# 🎨 Store Template Creation Standards

**PENTING: Ini adalah dokumen wajib untuk pembuatan template store yang DIJUAL. Setiap template HARUS mengikuti standar ini untuk menjamin kualitas premium.**

---

## 📋 Table of Contents

1. [General Requirements (Semua Tier)](#general-requirements)
2. [PREMIUM Tier Standards](#premium-tier-standards)
3. [UNLIMITED Tier Standards](#unlimited-tier-standards)
4. [Technical Requirements](#technical-requirements)
5. [Quality Checklist](#quality-checklist)
6. [AI Prompts untuk Template Creation](#ai-prompts)

---

## 🎯 General Requirements (Semua Tier)

### 1. **Core Components (WAJIB)**
Setiap template HARUS memiliki komponen berikut dengan implementasi penuh:

#### ✅ Navbar
- Logo/Initial dengan proper sizing (h-12 to h-16)
- Store name dengan typography yang sesuai tema
- Tagline (optional, conditional render)
- WhatsApp CTA button dengan hover effects
- Sticky/Fixed positioning dengan scroll detection
- Backdrop blur untuk modern feel
- Shadow effects untuk depth

#### ✅ Hero Section
- Headline besar (text-6xl to text-8xl) yang eye-catching
- Store description dengan max-width untuk readability
- Icon/Badge yang sesuai tema (animated)
- Statistics display (product count, rating, review count)
- Proper spacing (pt-32 pb-20 minimum)
- Background effects yang sesuai tier

#### ✅ Product Cards
- **Image Container:**
  - aspect-square untuk konsistensi
  - Background gradient sebagai fallback
  - Proper Google Drive URL format: `https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`
  - Fallback dengan error handler ke alternate URL
  - Placeholder icon jika tidak ada gambar
  
- **Badges:**
  - "BARU/NEW" badge jika `product.isNew === true`
  - Discount badge jika `product.discountPercent > 0`
  - Positioning absolute dengan proper spacing (top-4 left/right-4)

- **Product Info:**
  - Product name dengan line-clamp-2
  - Description (optional) dengan line-clamp-2
  - Price dengan formatting `Rp ${product.price.toLocaleString('id-ID')}`
  - Original price (strikethrough) jika ada discount
  - Rating stars (5 stars system)
  - Review count jika ada

- **CTA Button:**
  - WhatsApp order function dengan proper message format
  - Full width (w-full)
  - Bold font dengan proper sizing (py-3 to py-4)
  - Hover effects dan transitions
  - Icon WhatsApp

#### ✅ Footer (StoreFooter Component)
```tsx
<StoreFooter 
  store={store} 
  bgColor="bg-gradient-to-r from-[primary] to-[secondary]" 
  textColor="text-[color]" 
  accentColor="text-[accent]"
/>
```

### 2. **State Management (WAJIB)**
```tsx
const [scrolled, setScrolled] = useState(false)
const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 20)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### 3. **WhatsApp Integration (WAJIB)**
```tsx
const handleWhatsAppOrder = (productName: string, price: number) => {
  const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
  window.open(`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
}
```

### 3b. **Conversion Page Button Logic (WAJIB)**
**CRITICAL:** Product bisa punya conversion page! Harus ada 2 button options:

```tsx
import Link from 'next/link'

// In product card:
{product.hasConversionPage && product.conversionPageSlug ? (
  <div className="space-y-2">
    {/* Button 1: View Detail - IMPORTANT: Use /p/ route! */}
    <Link
      href={`/p/${product.conversionPageSlug}`}
      className="w-full bg-[primary-color] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
    >
      Lihat Detail
    </Link>
    {/* Button 2: Order WhatsApp */}
    <button
      onClick={() => handleWhatsAppOrder(product.name, product.price)}
      className="w-full bg-[secondary-color] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      Pesan Sekarang
    </button>
  </div>
) : (
  // Single WhatsApp button if no conversion page
  <button
    onClick={() => handleWhatsAppOrder(product.name, product.price)}
    className="w-full bg-[primary-color] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
    Pesan Sekarang
  </button>
)}
```

**Penjelasan:**
- Kalau product punya `hasConversionPage === true` dan `conversionPageSlug` → Tampilkan 2 buttons
- Button 1 (Link): "Lihat Detail" → Ke conversion page
- Button 2 (WhatsApp): "Pesan Sekarang" → Direct order
- Kalau tidak ada conversion page → Cuma 1 button WhatsApp

### 4. **Responsive Design (WAJIB)**
- Mobile-first approach
- Grid responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Proper spacing: `gap-6 to gap-8`
- Text sizing responsive: `text-6xl md:text-7xl`
- Padding responsive: `px-4 md:px-6`

### 5. **Image Handling (WAJIB)**
```tsx
{product.images.length > 0 ? (
  <img
    src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
    alt={product.name}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
    }}
  />
) : (
  <div className="w-full h-full flex items-center justify-center text-gray-400">
    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  </div>
)}
```

---

## 🥈 PREMIUM Tier Standards

**Target Market:** Toko dengan budget menengah yang ingin tampilan professional dan modern.

### Design Requirements:

#### 1. **Color Scheme**
- 2-3 main colors yang harmonis
- Gradient backgrounds (subtle, tidak terlalu ramai)
- Proper contrast untuk readability
- Consistent color palette throughout

#### 2. **Animations & Transitions**
- **Smooth transitions:** `transition-all duration-300 to duration-500`
- **Hover effects pada cards:** 
  - `hover:shadow-xl`
  - `hover:-translate-y-1 to hover:-translate-y-2`
  - Scale effects pada image: `hover:scale-105 to hover:scale-110`
- **Button hover effects:**
  - Background color change
  - Shadow intensification
  - Subtle scale: `hover:scale-105`

#### 3. **Background Design**
- Clean gradient backgrounds
- Optional: 1-2 subtle decorative elements
- **NO complex animations** (save for UNLIMITED)
- Solid backgrounds dengan texture atau gradient

#### 4. **Typography**
- Font weight variations: `font-normal`, `font-bold`, `font-black`
- Proper hierarchy: Hero (text-6xl), Section (text-4xl), Card (text-xl)
- Line height untuk readability
- Text shadows untuk depth (optional)

#### 5. **Card Design**
- Clean rounded corners: `rounded-2xl to rounded-3xl`
- Box shadow: `shadow-lg hover:shadow-2xl`
- Border subtle: `border border-gray-200`
- Padding generous: `p-6`
- Hover state clearly visible

#### 6. **Navbar**
- Scroll detection dengan backdrop blur
- Shadow saat scrolled: `shadow-lg to shadow-xl`
- Smooth transition: `transition-all duration-500`
- Logo size consistent: `h-12 to h-14`

### Example Elements:

```tsx
// PREMIUM Card Example
<div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
  <div className="relative aspect-square overflow-hidden">
    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
  </div>
  <div className="p-6">
    {/* Content */}
  </div>
</div>

// PREMIUM Button
<button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
  Pesan Sekarang
</button>
```

---

## 💎 UNLIMITED Tier Standards

**Target Market:** Toko premium yang ingin tampilan MEWAH, EKSKLUSIF, dan MEMORABLE.

### Design Requirements:

#### 1. **Animated Background (WAJIB)**
Setiap UNLIMITED template HARUS punya animated background yang kompleks:

```tsx
<div className="fixed inset-0 z-0">
  {/* Base gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[color1] via-[color2] to-[color3]"></div>
  
  {/* Animated blobs/orbs (3-4 elements) */}
  <div className="absolute top-20 left-20 w-96 h-96 bg-[color] rounded-full mix-blend-[mode] filter blur-3xl opacity-[value] animate-pulse"></div>
  <div className="absolute top-40 right-20 w-96 h-96 bg-[color] rounded-full mix-blend-[mode] filter blur-3xl opacity-[value] animate-pulse" style={{ animationDelay: '1s' }}></div>
  <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-[color] rounded-full mix-blend-[mode] filter blur-3xl opacity-[value] animate-pulse" style={{ animationDelay: '2s' }}></div>
  
  {/* Optional: Grid pattern, noise texture, or particles */}
  <div className="absolute inset-0 bg-[pattern] opacity-10"></div>
</div>
```

**Blend modes yang bagus:**
- `mix-blend-screen` untuk light themes
- `mix-blend-multiply` untuk dark themes  
- `mix-blend-overlay` untuk hybrid

#### 2. **Navbar Premium Features**
```tsx
<nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
  scrolled 
    ? 'bg-[color]/90 backdrop-blur-2xl shadow-2xl border-b-2 border-[color]' 
    : 'bg-[color]/70 backdrop-blur-lg'
}`}>
  {/* Logo dengan glow effect */}
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-[color1] to-[color2] rounded-full blur-lg opacity-70 animate-pulse"></div>
    <img className="relative h-16 w-16 rounded-full ring-4 ring-[color]/50 shadow-2xl" />
  </div>
  
  {/* CTA Button dengan glow */}
  <a className="group relative bg-gradient-to-r from-[color1] to-[color2] px-8 py-4 rounded-full font-black shadow-2xl transition-all duration-300 transform hover:scale-105">
    <span className="absolute inset-0 bg-gradient-to-r from-[color1] to-[color2] rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
    <span className="relative z-10">Text</span>
  </a>
</nav>
```

#### 3. **Hero Section Spectacular**
```tsx
<header className="relative pt-32 pb-20 z-10">
  <div className="max-w-7xl mx-auto px-6 text-center">
    {/* Animated Icon/Badge */}
    <div className="mb-8 flex justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[color1] to-[color2] rounded-full blur-2xl opacity-70 animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-[color1] to-[color2] p-5 rounded-full shadow-2xl ring-4 ring-[color]/30">
          <svg className="w-10 h-10 text-white [animation]" />
        </div>
      </div>
    </div>
    
    {/* Massive Headline */}
    <h2 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
      <span className="text-transparent bg-gradient-to-r from-[color1] via-[color2] to-[color3] bg-clip-text drop-shadow-[0_0_30px_rgba(R,G,B,0.5)]">
        [Headline Text]
      </span>
    </h2>
    
    {/* Description dengan glow */}
    <p className="text-xl md:text-2xl text-[color] max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
      {store.description}
    </p>
    
    {/* Stats dengan icon dan animations */}
    <div className="flex justify-center gap-12">
      <div className="flex flex-col items-center">
        <span className="text-5xl font-black text-transparent bg-gradient-to-r from-[color1] to-[color2] bg-clip-text">
          {products.length}
        </span>
        <span className="text-sm font-bold uppercase tracking-wider mt-1">Label</span>
      </div>
    </div>
  </div>
</header>
```

#### 4. **Product Cards Ultra Premium**
```tsx
<div
  onMouseEnter={() => setHoveredProduct(product.id)}
  onMouseLeave={() => setHoveredProduct(null)}
  className="group relative bg-[base] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[color]/50 transition-all duration-500 transform hover:-translate-y-3 border-2 border-[color]/30 hover:border-[color]"
>
  {/* Hover overlay gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[color1]/10 to-[color2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  
  {/* Image dengan multiple effects */}
  <div className="relative aspect-square overflow-hidden">
    <img 
      className={`w-full h-full object-cover transition-all duration-700 ${
        hoveredProduct === product.id 
          ? 'scale-125 rotate-2 blur-sm' 
          : 'scale-100 rotate-0'
      }`}
    />
    
    {/* Overlay gradient on hover */}
    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-${hoveredProduct === product.id ? '100' : '0'} transition-opacity duration-300`}>
      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm font-bold animate-pulse">Klik untuk pesan →</p>
      </div>
    </div>
  </div>
  
  {/* Premium content styling */}
  <div className="relative p-6">
    {/* Gradient price */}
    <span className="text-3xl font-black text-transparent bg-gradient-to-r from-[color1] to-[color2] bg-clip-text">
      Rp {product.price.toLocaleString('id-ID')}
    </span>
    
    {/* Button dengan glow effect */}
    <button className="w-full bg-gradient-to-r from-[color1] via-[color2] to-[color3] hover:from-[color1+] hover:via-[color2+] hover:to-[color3+] text-white py-4 rounded-xl font-black shadow-2xl shadow-[color]/50 transition-all duration-300 transform hover:scale-105">
      Order Now
    </button>
  </div>
</div>
```

#### 5. **Advanced Effects (WAJIB minimal 3)**
- ✅ Animated background blobs/orbs (3-4 elements)
- ✅ Glow effects pada buttons dan CTAs
- ✅ Drop shadows dengan color
- ✅ Multiple hover states (scale, rotate, blur, brightness)
- ✅ Backdrop blur effects
- ✅ Mix-blend modes
- ✅ Gradient text with animation
- ✅ Ring effects dengan opacity
- ✅ Pulse animations
- ✅ Transform transitions (translate, scale, rotate)

#### 6. **Color Gradients Complex**
```tsx
// 3+ color gradients
bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500
bg-gradient-to-br from-[color1] via-[color2] to-[color3]

// With stops
bg-[linear-gradient(135deg,_#667eea_0%,_#764ba2_50%,_#f093fb_100%)]

// Text gradients dengan clip
text-transparent bg-gradient-to-r from-[color1] via-[color2] to-[color3] bg-clip-text
```

#### 7. **Typography Ultra Premium**
- Font weights: `font-black` untuk headlines
- Text sizes: `text-7xl to text-8xl` untuk hero
- Drop shadows dengan color: `drop-shadow-[0_0_30px_rgba(R,G,B,0.5)]`
- Gradient text for emphasis
- Tracking: `tracking-tight` untuk headlines, `tracking-wider` untuk labels

#### 8. **No Empty States**
Empty state harus tetap premium:
```tsx
{products.length === 0 ? (
  <div className="text-center py-20 bg-gradient-to-br from-[color]/20 to-[color]/20 backdrop-blur-sm rounded-3xl border border-[color]/30">
    <div className="text-6xl mb-4 animate-pulse">[Icon]</div>
    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-[color1] to-[color2] bg-clip-text mb-2">
      Coming Soon
    </p>
    <p className="text-[color]">Premium products akan segera hadir</p>
  </div>
) : (
  // Products grid
)}
```

---

## 🔧 Technical Requirements

### 1. **TypeScript & Props**
```tsx
'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function [TemplateName]Template({ store, products }: StoreTemplateProps) {
  // Implementation
}
```

### 2. **Performance**
- Images lazy loaded (browser native)
- Proper image sizing: `sz=w400` untuk thumbnails
- Error handling untuk images
- Minimal re-renders (proper state management)
- Cleanup pada useEffect

### 3. **Accessibility**
- Alt text pada images
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus states visible

### 4. **Security**
- `rel="noopener noreferrer"` pada external links
- `target="_blank"` untuk WhatsApp links
- Sanitized WhatsApp message (encodeURIComponent)

### 5. **Consistent Spacing**
```tsx
// Container
max-w-7xl mx-auto px-6

// Sections
pt-32 pb-20 (Hero)
pb-20 (Main)

// Cards
p-6 (Premium)
p-6 to p-8 (Unlimited)

// Gaps
gap-6 to gap-8 (Grid)
gap-2 to gap-4 (Inline elements)
```

---

## ✅ Quality Checklist

Sebelum submit template, pastikan SEMUA ini ter-check:

### Visual Quality
- [ ] Background menarik dan sesuai tier
- [ ] Color scheme harmonis (2-3 colors)
- [ ] Typography hierarchy jelas
- [ ] Spacing consistent
- [ ] All hover states implemented
- [ ] Transitions smooth (300-500ms)
- [ ] Shadows adds depth
- [ ] Borders subtle but visible

### Functionality
- [ ] All images load correctly
- [ ] Google Drive URL format correct
- [ ] Error fallback untuk images works
- [ ] WhatsApp message formatted properly
- [ ] Badges show conditionally (isNew, discount)
- [ ] Rating stars render correctly
- [ ] Empty state looks good
- [ ] Footer integrated properly

### Responsive Design
- [ ] Mobile (< 768px) looks good
- [ ] Tablet (768px - 1024px) looks good  
- [ ] Desktop (> 1024px) looks good
- [ ] Text sizes responsive
- [ ] Grid responsive (1 col → 2 col → 3 col)
- [ ] Images don't overflow
- [ ] Buttons accessible on mobile

### Code Quality
- [ ] TypeScript types correct
- [ ] No console errors
- [ ] No unused imports
- [ ] Proper component structure
- [ ] useEffect cleanup implemented
- [ ] Event handlers don't cause re-renders
- [ ] Security attributes present

### UNLIMITED Tier Only
- [ ] Animated background present (3-4 blobs)
- [ ] Glow effects on CTAs
- [ ] Complex gradients (3+ colors)
- [ ] Advanced hover states (scale + rotate/blur)
- [ ] Drop shadows with color
- [ ] Mix-blend modes used
- [ ] Premium empty state
- [ ] Icon/badge with animations

---

## 🤖 AI Prompts untuk Template Creation

### For PREMIUM Tier Templates:

```
Create a PREMIUM tier e-commerce store template in React with TypeScript named "[ThemeName]Template".

THEME: [Describe theme - e.g., "Ocean Breeze - calming blue ocean vibes with waves"]

REQUIREMENTS:
1. Color scheme: [primary color], [secondary color], [accent color]
2. Mood: [Professional/Modern/Elegant/Vibrant/etc]
3. Target audience: [describe]

MUST HAVE:
✅ Sticky navbar with scroll detection and backdrop blur
✅ Hero section with store name (text-6xl), description, stats (product count, rating)
✅ Product grid (responsive 1/2/3 cols) with:
   - aspect-square image container
   - Proper Google Drive URL: https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400
   - Error fallback handler
   - Badges for isNew and discount
   - Price with Rp formatting
   - Original price strikethrough if discount
   - 5-star rating display
   - WhatsApp order button
✅ Hover effects: transform -translate-y-2, shadow-xl, image scale-110
✅ Smooth transitions: duration-500
✅ Clean gradient backgrounds (subtle)
✅ StoreFooter component integration
✅ Empty state with icon and message

STATES:
const [scrolled, setScrolled] = useState(false)
const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

WhatsApp function with proper message formatting.

STYLE GUIDE:
- Rounded corners: rounded-2xl to rounded-3xl
- Shadows: shadow-lg hover:shadow-2xl
- Font weights: font-bold for headings, font-black for hero
- Padding: p-6 for cards
- Gaps: gap-8 for grid
- Border: subtle border-gray-200

Make it PROFESSIONAL and READY TO SELL.
```

### For UNLIMITED Tier Templates:

```
Create an ULTRA PREMIUM UNLIMITED tier e-commerce store template in React with TypeScript named "[ThemeName]Template".

THEME: [Describe theme - e.g., "Diamond Sparkle - luxurious metallic premium with sparkle effects"]

REQUIREMENTS:
1. Color palette: [3-4 colors for complex gradients]
2. Mood: LUXURY, EXCLUSIVE, MEMORABLE, WOW-FACTOR
3. Target audience: High-end customers willing to pay premium

MANDATORY PREMIUM FEATURES:
🌟 ANIMATED BACKGROUND (CRITICAL):
   - Fixed positioned overlay with z-0
   - Base gradient (from-[color1] via-[color2] to-[color3])
   - 3-4 animated blob/orb elements with:
     * w-96 h-96 size
     * rounded-full
     * mix-blend-screen or mix-blend-multiply
     * blur-3xl
     * opacity-30 to opacity-70
     * animate-pulse with staggered delays (0s, 1s, 2s)
   - Optional: Grid pattern or noise texture overlay

🌟 NAVBAR ULTRA PREMIUM:
   - Logo with GLOW effect (absolute blur layer behind)
   - Scroll detection with extreme backdrop-blur-2xl
   - Shadow-2xl when scrolled with color tint
   - CTA button with:
     * Gradient background (3 colors)
     * Glow effect on hover (blur-xl layer)
     * Transform hover:scale-105
     * Font-black
     * Shadow-2xl with color

🌟 HERO SPECTACULAR:
   - Animated icon/badge with glow halo
   - Headline: text-7xl md:text-8xl font-black
   - Gradient text with drop-shadow-[0_0_30px_rgba(R,G,B,0.5)]
   - Description with drop-shadow-lg
   - Stats with gradient numbers (text-5xl)

🌟 PRODUCT CARDS SUPREME:
   - Multiple hover effects:
     * transform hover:-translate-y-3
     * scale-125 rotate-2 blur-sm on image
     * Gradient overlay on hover
     * Border color change
   - Overlay message on hover (bottom of image)
   - Gradient pricing text
   - Button with glow (shadow-[color]/50)
   - Border-2 with color change on hover

🌟 ADVANCED EFFECTS (Implement at least 5):
   - Mix-blend modes (screen/multiply/overlay)
   - Multiple gradients (3+ colors)
   - Drop shadows with color
   - Ring effects with opacity
   - Backdrop blur effects
   - Pulse animations
   - Complex transforms (scale + rotate + translate)
   - Glow halos (blur layers behind elements)
   - Gradient text with bg-clip-text
   - Staggered animation delays

🌟 EMPTY STATE PREMIUM:
   - Gradient background container
   - Animated icon (pulse)
   - Gradient text for heading
   - Border with color

STATES & INTERACTIONS:
const [scrolled, setScrolled] = useState(false)
const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

Full onMouseEnter/onMouseLeave on cards
WhatsApp integration with styled function

TECHNICAL:
✅ All images: https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400
✅ Error handlers for images
✅ Conditional rendering (isNew, discount, rating)
✅ StoreFooter with gradient background
✅ TypeScript StoreTemplateProps
✅ 'use client' directive
✅ Proper imports (useState, useEffect)
✅ Security: rel="noopener noreferrer"

STYLE REQUIREMENTS:
- Rounded: rounded-3xl
- Shadows: shadow-2xl with color tint
- Borders: border-2 for emphasis
- Font: font-black for all major headings
- Text sizes: text-7xl to text-8xl for hero
- Transitions: duration-500 to duration-700
- Transforms: combine multiple (scale + rotate + translate)
- Gradients: ALWAYS 3+ colors
- Effects: Glow, blur, mix-blend EVERYWHERE

This template MUST look like it's worth $100+. Make it SPECTACULAR, UNFORGETTABLE, and SELL-ABLE at premium price.
```

---

## 📊 Tier Comparison Summary

| Feature | FREE | PREMIUM | UNLIMITED |
|---------|------|---------|-----------|
| Animated Background | ❌ Static | ⚠️ Simple gradient | ✅ Complex animated blobs |
| Navbar Effects | Basic | Scroll + blur | Scroll + blur + glow |
| Hero Size | text-4xl | text-6xl | text-7xl to text-8xl |
| Gradients | 1-2 colors | 2-3 colors | 3-4+ colors |
| Hover Effects | Basic shadow | Transform + shadow | Multi-effect (scale+rotate+blur) |
| Glow Effects | ❌ None | ⚠️ Minimal | ✅ Everywhere |
| Mix-blend Modes | ❌ None | ❌ None | ✅ Yes |
| Drop Shadows | Basic | With spread | With color tint |
| Transitions | 200ms | 300-500ms | 500-700ms |
| Product Card Hover | Shadow change | Shadow + transform | Shadow + transform + image effect + overlay |
| Empty State | Text only | Icon + text | Premium gradient container + animated icon |
| Overall Feel | Functional | Professional | LUXURY |

---

## 🎬 Final Notes

**REMEMBER:**
- Ini template yang **DIJUAL**, bukan latihan
- User membayar untuk **WOW FACTOR**
- UNLIMITED tier harus membuat customer merasa **EKSKLUSIF**
- Setiap detail harus **POLISHED**
- Test di **MOBILE** juga, bukan cuma desktop
- **JANGAN SKIP** animated background untuk UNLIMITED
- **JANGAN LUPA** error handlers untuk images

**If in doubt:**
- Look at LuxuryBoutiqueTemplate.tsx (UNLIMITED reference)
- Look at ElegantShopTemplate.tsx (PREMIUM reference)
- Test hover effects on ALL interactive elements
- Check responsive at 375px, 768px, 1024px, 1440px

---

**Created:** 2025-01-10  
**Version:** 1.0  
**Status:** MANDATORY FOR ALL TEMPLATE CREATION
