# Panduan Menambahkan Sections ke Conversion Templates

Semua data Phase 1-5 sudah tersimpan di database dan di-pass ke templates. Berikut cara menambahkan sections yang belum ada:

## Data yang Tersedia di `product` prop:

```typescript
interface Product {
  // Basic
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  
  // Phase 1: Video + Discount
  videoUrl: string | null
  originalPrice: number | null
  discountPercent: number | null
  discountValidUntil: Date | null
  
  // Phase 2: Conversion Page
  headline: string | null
  subheadline: string | null
  
  // Phase 3: Benefits & Features
  benefits: string[]  // Array of benefit strings
  features: string[]  // Array of feature strings
  
  // Phase 4: Urgency & Scarcity
  hasCountdown: boolean
  countdownEnd: Date | null
  limitedStock: number | null
  urgencyText: string | null
  ctaText: string | null
  ctaColor: string | null
  
  // Phase 5: Social Proof & Trust
  testimonials: Array<{
    name: string
    rating: number  // 1-5
    text: string
    role: string
  }>
  bonuses: Array<{
    title: string
    description: string
    value: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  guarantee: string | null
  socialProof: string | null
}
```

## Sections yang Bisa Ditambahkan:

### 1. Benefits Section (Phase 3)
```tsx
{/* Benefits Section */}
{product.benefits && product.benefits.length > 0 && (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
      ✨ MANFAAT PRODUK INI
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {product.benefits.map((benefit, index) => (
        <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow">
          <span className="text-green-600 text-xl flex-shrink-0">✓</span>
          <p className="text-gray-800">{benefit}</p>
        </div>
      ))}
    </div>
  </div>
)}
```

### 2. Features Section (Phase 3)
```tsx
{/* Features Section */}
{product.features && product.features.length > 0 && (
  <div className="bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
        ⚙️ SPESIFIKASI LENGKAP
      </h2>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <ul className="space-y-3">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}
```

### 3. Testimonials Section (Phase 5)
```tsx
{/* Testimonials Section */}
{product.testimonials && product.testimonials.length > 0 && (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
      💬 APA KATA MEREKA?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {product.testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
          {/* Rating Stars */}
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          
          {/* Testimonial Text */}
          <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
          
          {/* Name & Role */}
          <div className="border-t pt-3">
            <p className="font-bold text-gray-900">{testimonial.name}</p>
            {testimonial.role && (
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

### 4. Bonuses Section (Phase 5)
```tsx
{/* Bonuses Section */}
{product.bonuses && product.bonuses.length > 0 && (
  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-black text-center text-white mb-8">
        🎁 BONUS GRATIS!
      </h2>
      <div className="space-y-4">
        {product.bonuses.map((bonus, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {bonus.title}
                </h3>
                <p className="text-gray-700 mb-2">{bonus.description}</p>
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">
                {bonus.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
```

### 5. FAQs Section (Phase 5)
```tsx
{/* FAQs Section */}
{product.faqs && product.faqs.length > 0 && (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
      ❓ PERTANYAAN YANG SERING DITANYAKAN
    </h2>
    <div className="space-y-4">
      {product.faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Q: {faq.question}
          </h3>
          <p className="text-gray-700 pl-4 border-l-4 border-blue-500">
            A: {faq.answer}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
```

### 6. Guarantee Section (Phase 5)
```tsx
{/* Guarantee Section */}
{product.guarantee && (
  <div className="bg-blue-600 py-12">
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
        <div className="text-6xl mb-4">🛡️</div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">
          GARANSI KAMI
        </h2>
        <p className="text-lg text-gray-700">
          {product.guarantee}
        </p>
      </div>
    </div>
  </div>
)}
```

### 7. Urgency Text (Phase 4)
```tsx
{/* Urgency Banner */}
{product.urgencyText && (
  <div className="bg-red-600 py-4">
    <div className="max-w-6xl mx-auto px-4">
      <p className="text-white text-center font-black text-lg animate-pulse">
        ⚠️ {product.urgencyText} ⚠️
      </p>
    </div>
  </div>
)}
```

### 8. Custom CTA Button (Phase 4)
```tsx
{/* CTA Button with Custom Color */}
<button
  onClick={handleOrder}
  className={`w-full font-black text-xl py-5 rounded-xl shadow-lg transition-all transform hover:scale-105 ${
    product.ctaColor === 'red' ? 'bg-red-600 hover:bg-red-700' :
    product.ctaColor === 'green' ? 'bg-green-600 hover:bg-green-700' :
    product.ctaColor === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
    product.ctaColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
    product.ctaColor === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
  } text-white`}
>
  {product.ctaText || '💬 PESAN SEKARANG'}
</button>
```

## Urutan Section yang Direkomendasikan:

1. Hero (Headline + Subheadline + Price)
2. Social Proof Text (jika ada)
3. Urgency Banner (jika ada)
4. Product Images
5. Video (jika ada)
6. Benefits Section
7. Features Section
8. Testimonials Section
9. Bonuses Section
10. Guarantee Section
11. FAQs Section
12. Final CTA
13. Footer

## Template Yang Perlu Diupdate:

- ✅ RedUrgencyTemplate.tsx - Interface sudah diupdate
- ⚠️ GreenTrustTemplate.tsx - Perlu update interface & tambah sections
- ⚠️ YellowEnergyTemplate.tsx - Perlu update interface & tambah sections
- 🆕 BlueProfessionalTemplate.tsx - Baru dibuat (basic)
- 🆕 PurplePremiumTemplate.tsx - Perlu dibuat

## Cara Update Template:

1. Update interface Product (copy dari RedUrgencyTemplate)
2. Copy-paste sections yang diinginkan dari guide ini
3. Sesuaikan warna/styling dengan tema template
4. Test dengan produk yang sudah ada data Phase 1-5

## Note:
Semua sections menggunakan conditional rendering (`&&`) sehingga hanya tampil jika datanya ada. Tidak perlu khawatir tentang null/undefined.
