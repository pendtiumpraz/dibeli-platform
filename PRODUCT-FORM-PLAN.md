# 📝 Product Form Enhancement Plan

## Current State
The product edit form currently has:
- Multi-image upload ✅
- Basic info (name, description, price, stock) ✅
- Availability toggle ✅

## What Needs to be Added

### 1. **Media Section (Enhanced)**
```tsx
// EXISTING
images: string[]  ✅

// NEW
videoUrl: string  // YouTube/Vimeo embed
```

### 2. **Pricing & Discount Section** ⭐
```tsx
price: number              // Current (already exists)
originalPrice: number      // NEW - Harga coret
discountPercent: number    // NEW - Persentase diskon
discountValidUntil: Date   // NEW - Diskon berlaku sampai
```

### 3. **Conversion Landing Page Section** 🚀
```tsx
// Toggle
hasConversionPage: boolean

// IF ENABLED, show:
conversionPageSlug: string
conversionTemplate: 'red-urgency' | 'green-trust' | 'yellow-energy'
headline: string
subheadline: string
benefits: string[]  // Dynamic list
features: string[]  // Dynamic list
socialProof: string
guarantee: string
urgencyText: string
hasCountdown: boolean
countdownEnd: Date
limitedStock: number
ctaText: string
ctaColor: string
```

### 4. **Testimonials Builder**
```tsx
testimonials: [{
  name: string
  text: string
  rating: 1-5
  image: string (optional)
  date: string
}]
```

### 5. **Bonuses Builder**
```tsx
bonuses: [{
  title: string
  description: string
  image: string (optional)
}]
```

### 6. **FAQs Builder**
```tsx
faqs: [{
  question: string
  answer: string
}]
```

## Implementation Strategy

Since this is a MASSIVE form, we'll break it into TABS:

### Tab 1: **Basic Info** (Current)
- Images (existing)
- Video URL (new)
- Name, Description
- Pricing with Discount (enhanced)
- Stock & Availability

### Tab 2: **Conversion Page** (New)
- Enable toggle
- Template selector
- Custom slug
- Headline & Subheadline
- Benefits & Features (dynamic lists)
- Social Proof & Guarantee
- Urgency settings

### Tab 3: **Social Proof** (New)
- Testimonials builder
- Bonuses builder

### Tab 4: **FAQs** (New)
- FAQ builder

## UI Components Needed

### 1. TabNavigation Component
```tsx
<Tabs defaultValue="basic">
  <TabsList>
    <TabsTrigger value="basic">Basic Info</TabsTrigger>
    <TabsTrigger value="conversion">Conversion Page</TabsTrigger>
    <TabsTrigger value="social">Social Proof</TabsTrigger>
    <TabsTrigger value="faqs">FAQs</TabsTrigger>
  </TabsList>
</Tabs>
```

### 2. DynamicListInput Component
```tsx
<DynamicListInput
  label="Benefits"
  value={benefits}
  onChange={setBenefits}
  placeholder="e.g. Kulit lebih cerah dalam 7 hari"
  maxItems={10}
/>
```

### 3. TestimonialBuilder Component
```tsx
<TestimonialBuilder
  testimonials={testimonials}
  onChange={setTestimonials}
/>
```

### 4. BonusBuilder Component
```tsx
<BonusBuilder
  bonuses={bonuses}
  onChange={setBonuses}
/>
```

### 5. FAQBuilder Component
```tsx
<FAQBuilder
  faqs={faqs}
  onChange={setFAQs}
/>
```

## Step-by-Step Implementation

### Phase 1: Basic Enhancements (Quick Win)
1. Add video URL input ✅
2. Add pricing discount fields ✅
3. Test and commit

### Phase 2: Conversion Toggle
1. Add hasConversionPage checkbox
2. Show/hide conversion fields
3. Add template selector
4. Add slug input
5. Test and commit

### Phase 3: Conversion Content
1. Add headline/subheadline
2. Create DynamicListInput component
3. Add benefits list
4. Add features list
5. Add social proof & guarantee textareas
6. Test and commit

### Phase 4: Urgency Settings
1. Add countdown toggle
2. Add date picker for countdown
3. Add urgency text input
4. Add limited stock input
5. Add CTA customization
6. Test and commit

### Phase 5: Builders (Complex)
1. Create TestimonialBuilder
2. Create BonusBuilder
3. Create FAQBuilder
4. Test and commit

### Phase 6: Tab System (Final)
1. Install/create Tab component
2. Organize fields into tabs
3. Add tab validation
4. Test all flows
5. Final commit

## API Updates Needed

### Update `/api/products/[id]` PUT endpoint
Must accept all new fields:
```typescript
{
  // Existing
  name, description, price, stock, isAvailable, images
  
  // NEW
  videoUrl,
  originalPrice,
  discountPercent,
  discountValidUntil,
  hasConversionPage,
  conversionPageSlug,
  conversionTemplate,
  headline,
  subheadline,
  benefits,
  features,
  testimonials,
  socialProof,
  bonuses,
  guarantee,
  hasCountdown,
  countdownEnd,
  urgencyText,
  limitedStock,
  faqs,
  ctaText,
  ctaColor,
  metaTitle,
  metaDescription
}
```

## Testing Checklist

- [ ] Can add/remove multiple images
- [ ] Can add video URL
- [ ] Discount calculation shows correctly
- [ ] Discount deadline validates properly
- [ ] Conversion toggle shows/hides fields
- [ ] Can add/remove benefits dynamically
- [ ] Can add/remove features dynamically
- [ ] Can build testimonials with all fields
- [ ] Can build bonuses
- [ ] Can build FAQs
- [ ] All fields save to database
- [ ] Form loads existing data correctly
- [ ] Validation works on all required fields

## Next Action

Start with Phase 1: Quick wins
1. Add videoUrl field
2. Add originalPrice, discountPercent, discountValidUntil
3. Show discount preview
4. Test & commit

Then move to Phase 2: Conversion toggle & basic fields.

## Estimated Time
- Phase 1: 30 minutes ✅
- Phase 2: 1 hour
- Phase 3: 1 hour
- Phase 4: 45 minutes
- Phase 5: 2 hours (complex builders)
- Phase 6: 1 hour (tab refactor)

Total: ~6 hours of focused work

But we'll do it step by step, testing each phase!
