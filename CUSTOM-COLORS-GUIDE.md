# Custom Color System Guide

Guide untuk implementasi custom brand colors di store templates.

## 📝 Overview

Custom colors memungkinkan users untuk mengkustomisasi warna brand mereka di template tanpa coding. System ini menggunakan:
- Database field: `Store.customColors` (JSON)
- CSS variables injection
- Dynamic color application

---

## 🎨 Color Schema

### Database Structure

```typescript
// Store.customColors JSON format
interface CustomColors {
  primary: string       // Main brand color
  secondary: string     // Secondary accent
  accent: string        // Highlight color
  background: string    // Background color
  text: string          // Text color
}

// Example:
{
  "primary": "#2563eb",
  "secondary": "#7c3aed", 
  "accent": "#f59e0b",
  "background": "#ffffff",
  "text": "#111827"
}
```

### Default Colors by Template

**Simple Classic (FREE):**
```json
{
  "primary": "#2563eb",
  "secondary": "#64748b",
  "accent": "#10b981",
  "background": "#f9fafb",
  "text": "#111827"
}
```

**Elegant Shop (PREMIUM):**
```json
{
  "primary": "#4f46e5",
  "secondary": "#7c3aed",
  "accent": "#ec4899",
  "background": "#f8fafc",
  "text": "#1e293b"
}
```

**Luxury Boutique (UNLIMITED):**
```json
{
  "primary": "#fbbf24",
  "secondary": "#ec4899",
  "accent": "#a855f7",
  "background": "#000000",
  "text": "#ffffff"
}
```

---

## 🔧 Implementation

### Step 1: Add Color Picker UI

```tsx
// src/app/(dashboard)/dashboard/store/colors/page.tsx
'use client'

import { useState } from 'react'

export default function StoreColorsPage() {
  const [colors, setColors] = useState({
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#111827',
  })

  const handleSave = async () => {
    await fetch('/api/store/colors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customColors: colors }),
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Custom Brand Colors</h1>
      
      <div className="space-y-6">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4">
            <label className="w-32 font-medium capitalize">{key}:</label>
            <input
              type="color"
              value={value}
              onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
              className="h-12 w-20 cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Save Colors
      </button>
    </div>
  )
}
```

### Step 2: Add API Endpoint

```typescript
// src/app/api/store/colors/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { customColors } = await request.json()

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
  })

  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

  await prisma.store.update({
    where: { id: store.id },
    data: { customColors },
  })

  return NextResponse.json({ success: true })
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    select: { customColors: true },
  })

  return NextResponse.json({ customColors: store?.customColors || null })
}
```

### Step 3: Apply Colors in Template

```tsx
// In template component
export default function MyTemplate({ store, products }: StoreTemplateProps) {
  // Parse custom colors
  const customColors = store.customColors as CustomColors | null
  
  // Apply CSS variables
  const styleVars = customColors ? {
    '--color-primary': customColors.primary,
    '--color-secondary': customColors.secondary,
    '--color-accent': customColors.accent,
    '--color-background': customColors.background,
    '--color-text': customColors.text,
  } as React.CSSProperties : {}

  return (
    <div style={styleVars} className="min-h-screen">
      {/* Use CSS variables */}
      <div style={{ backgroundColor: 'var(--color-primary)' }}>
        Primary Color Section
      </div>
    </div>
  )
}
```

### Step 4: Update Template Types

```typescript
// src/components/store-templates/types.ts
export interface StoreTemplateStore {
  // ... existing fields
  customColors?: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  } | null
}
```

---

## 🎯 Usage Examples

### Example 1: Button with Custom Primary

```tsx
<button
  style={{ backgroundColor: customColors?.primary || '#2563eb' }}
  className="px-6 py-3 text-white rounded-lg"
>
  Click Me
</button>
```

### Example 2: Dynamic Gradient

```tsx
const gradient = customColors 
  ? `linear-gradient(to right, ${customColors.primary}, ${customColors.secondary})`
  : 'linear-gradient(to right, #2563eb, #7c3aed)'

<div style={{ background: gradient }}>
  Gradient Background
</div>
```

### Example 3: Theme Provider (Advanced)

```tsx
'use client'

import { createContext, useContext } from 'react'

const ColorContext = createContext<CustomColors | null>(null)

export function ColorProvider({ colors, children }) {
  return (
    <ColorContext.Provider value={colors}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColors() {
  return useContext(ColorContext)
}

// Usage in component:
function ProductCard() {
  const colors = useColors()
  return (
    <div style={{ borderColor: colors?.primary }}>
      Card with custom border
    </div>
  )
}
```

---

## 🔒 Tier Restrictions

### FREE Tier
- ❌ No custom colors
- Default template colors only

### PREMIUM Tier
- ✅ Primary color customization
- ✅ Secondary color customization
- ❌ No gradient customization

### UNLIMITED Tier
- ✅ Full color customization
- ✅ All 5 color fields
- ✅ Gradient customization
- ✅ Advanced theming

---

## 🧪 Testing

### Test Cases

1. **Default Colors**: Template works without customColors
2. **Invalid Colors**: Handle invalid hex codes
3. **Contrast**: Ensure text remains readable
4. **Gradients**: Test gradient combinations
5. **Dark Mode**: Test with light/dark backgrounds

### Validation

```typescript
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

function validateColors(colors: CustomColors): boolean {
  return Object.values(colors).every(isValidHexColor)
}
```

---

## 📊 Color Contrast Guidelines

Ensure WCAG 2.1 AA compliance:

```typescript
// Calculate contrast ratio
function getContrast(color1: string, color2: string): number {
  // Implementation using luminance calculation
  // Should return ratio >= 4.5 for normal text
  // Should return ratio >= 3.0 for large text
}

// Warn user if contrast is too low
if (getContrast(colors.background, colors.text) < 4.5) {
  alert('Warning: Low contrast between background and text')
}
```

---

## 🚀 Future Enhancements

- [ ] Color palette suggestions
- [ ] Auto-generate complementary colors
- [ ] Dark mode toggle
- [ ] Import colors from brand kit
- [ ] Export color scheme
- [ ] A/B testing different colors
- [ ] Analytics on color performance

---

## 📝 Notes

**Important:**
- Always provide fallback colors
- Test color combinations before saving
- Consider accessibility (WCAG guidelines)
- Validate hex color format
- Cache color calculations

**Performance:**
- Use CSS variables (fast)
- Avoid inline styles when possible
- Memoize color calculations
- Cache API responses

---

Happy Customizing! 🎨
