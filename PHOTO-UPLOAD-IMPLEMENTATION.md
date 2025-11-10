# Photo Upload Implementation Guide

## Current Status:
✅ Schema: Updated to support photos (benefits, features, testimonials, bonuses)
✅ Templates: All support photo display with fallback
✅ Google Drive: Upload functions exist

## TODO: Form UI Changes Needed

### 1. Update FormData State (Line ~13-45)

Change from:
```typescript
benefits: [] as string[]
features: [] as string[]
testimonials: [] as Array<{name, rating, text, role}>
bonuses: [] as Array<{title, description, value}>
```

To:
```typescript
benefits: [] as Array<{text: string, imageUrl?: string, imageFile?: File}>
features: [] as Array<{text: string, imageUrl?: string, imageFile?: File}>
testimonials: [] as Array<{name: string, rating: number, text: string, role: string, photoUrl?: string, photoFile?: File}>
bonuses: [] as Array<{title: string, description: string, value: string, imageUrl?: string, imageFile?: File}>
```

### 2. Benefits Builder UI (Around line ~800)

Add photo upload to each benefit:
```tsx
{formData.benefits.map((benefit, index) => (
  <div key={index} className="flex gap-3 items-start border-b pb-3">
    {/* Benefit Text */}
    <input
      type="text"
      value={typeof benefit === 'string' ? benefit : benefit.text}
      onChange={(e) => {
        const newBenefits = [...formData.benefits]
        newBenefits[index] = typeof benefit === 'string' 
          ? {text: e.target.value}
          : {...benefit, text: e.target.value}
        setFormData({ ...formData, benefits: newBenefits })
      }}
      className="flex-1 px-3 py-2 border rounded"
      placeholder="Manfaat produk"
    />
    
    {/* Photo Upload */}
    <div className="flex items-center gap-2">
      <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded border border-blue-300 text-sm">
        📸 Icon
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const newBenefits = [...formData.benefits]
              const benefitObj = typeof benefit === 'string' ? {text: benefit} : benefit
              newBenefits[index] = {...benefitObj, imageFile: file}
              setFormData({ ...formData, benefits: newBenefits })
            }
          }}
        />
      </label>
      
      {/* Preview */}
      {benefit.imageFile && (
        <img 
          src={URL.createObjectURL(benefit.imageFile)} 
          alt="Icon" 
          className="w-10 h-10 rounded object-cover border-2 border-green-500"
        />
      )}
      {benefit.imageUrl && !benefit.imageFile && (
        <img 
          src={`https://drive.google.com/thumbnail?id=${benefit.imageUrl}&sz=w100`}
          alt="Icon" 
          className="w-10 h-10 rounded object-cover border-2 border-blue-500"
        />
      )}
    </div>
    
    {/* Remove Button */}
    <button
      type="button"
      onClick={() => {
        setFormData({
          ...formData,
          benefits: formData.benefits.filter((_, i) => i !== index)
        })
      }}
      className="text-red-600 hover:text-red-800"
    >
      🗑️
    </button>
  </div>
))}
```

### 3. Features Builder UI (Similar pattern)

Same as benefits but with "Spesifikasi" placeholder

### 4. Testimonials Builder UI (Around line ~1100)

Add photo upload:
```tsx
{formData.testimonials.map((testimonial, index) => (
  <div key={index} className="border rounded-lg p-4 space-y-3">
    {/* Photo Upload */}
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto Testimoni
        </label>
        <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded border border-blue-300 inline-block">
          📸 Upload Foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const newTestimonials = [...formData.testimonials]
                newTestimonials[index] = {...testimonial, photoFile: file}
                setFormData({ ...formData, testimonials: newTestimonials })
              }
            }}
          />
        </label>
      </div>
      
      {/* Photo Preview */}
      {testimonial.photoFile && (
        <img 
          src={URL.createObjectURL(testimonial.photoFile)} 
          alt={testimonial.name} 
          className="w-16 h-16 rounded-full object-cover border-4 border-green-500"
        />
      )}
      {testimonial.photoUrl && !testimonial.photoFile && (
        <img 
          src={`https://drive.google.com/thumbnail?id=${testimonial.photoUrl}&sz=w200`}
          alt={testimonial.name} 
          className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
        />
      )}
    </div>
    
    {/* Name, Rating, Text, Role inputs... */}
    {/* ... existing fields ... */}
  </div>
))}
```

### 5. Bonuses Builder UI (Around line ~1200)

Add image upload:
```tsx
{formData.bonuses.map((bonus, index) => (
  <div key={index} className="border rounded-lg p-4 space-y-3">
    {/* Bonus Image Upload */}
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar Bonus
        </label>
        <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded border border-blue-300 inline-block">
          🖼️ Upload Gambar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                const newBonuses = [...formData.bonuses]
                newBonuses[index] = {...bonus, imageFile: file}
                setFormData({ ...formData, bonuses: newBonuses })
              }
            }}
          />
        </label>
      </div>
      
      {/* Image Preview */}
      {bonus.imageFile && (
        <img 
          src={URL.createObjectURL(bonus.imageFile)} 
          alt={bonus.title} 
          className="w-20 h-20 rounded-lg object-cover border-2 border-green-500"
        />
      )}
      {bonus.imageUrl && !bonus.imageFile && (
        <img 
          src={`https://drive.google.com/thumbnail?id=${bonus.imageUrl}&sz=w200`}
          alt={bonus.title} 
          className="w-20 h-20 rounded-lg object-cover border-2 border-blue-500"
        />
      )}
    </div>
    
    {/* Title, Description, Value inputs... */}
    {/* ... existing fields ... */}
  </div>
))}
```

### 6. API Update (src/app/api/products/[id]/route.ts)

Handle file uploads for each section:
```typescript
// Extract files from FormData
const benefitFiles: File[] = []
const featureFiles: File[] = []
const testimonialFiles: File[] = []
const bonusFiles: File[] = []

formData.getAll('benefitImages').forEach(file => benefitFiles.push(file as File))
formData.getAll('featureImages').forEach(file => featureFiles.push(file as File))
formData.getAll('testimonialPhotos').forEach(file => testimonialFiles.push(file as File))
formData.getAll('bonusImages').forEach(file => bonusFiles.push(file as File))

// Upload to Drive and get IDs
const benefitImageIds = await Promise.all(
  benefitFiles.map(file => uploadImageToDrive(driveClient, file, productFolderId))
)

// Merge with benefits data
const benefits = JSON.parse(formData.get('benefits') as string || '[]')
benefits.forEach((b, i) => {
  if (benefitImageIds[i]) b.imageUrl = benefitImageIds[i]
})
```

## AI Auto-Generate Feature (UNLIMITED ONLY)

### 1. Add AI Settings Section to Product Form

```tsx
{/* AI Auto-Generate (UNLIMITED Only) */}
{session.user.tier === 'UNLIMITED' && (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
    <h3 className="text-xl font-bold text-purple-900 mb-4">
      🤖 AI AUTO-GENERATE (UNLIMITED)
    </h3>
    <p className="text-sm text-gray-700 mb-4">
      Biarkan AI mengisi SEMUA detail produk secara otomatis! Cukup isi nama produk, harga, dan pilih AI provider.
    </p>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Provider
        </label>
        <select
          value={aiProvider}
          onChange={(e) => setAiProvider(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="gemini">Google Gemini</option>
          <option value="groq">Groq (Llama)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <input
          type="password"
          value={aiApiKey}
          onChange={(e) => setAiApiKey(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Masukkan API key"
        />
      </div>
    </div>
    
    <button
      type="button"
      onClick={handleAiGenerate}
      disabled={!formData.name || !aiApiKey || aiGenerating}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
    >
      {aiGenerating ? '🔄 Generating...' : '✨ Generate Dengan AI'}
    </button>
    
    <p className="text-xs text-gray-600 mt-2">
      💡 AI akan generate: Headline, Subheadline, Description, Benefits (5), Features (5), Testimonials (3), Bonuses (2), FAQs (5), Guarantee, Social Proof, Urgency Text, CTA Text
    </p>
  </div>
)}
```

### 2. Create AI Generate Handler

```typescript
const [aiProvider, setAiProvider] = useState('gemini')
const [aiApiKey, setAiApiKey] = useState('')
const [aiGenerating, setAiGenerating] = useState(false)

const handleAiGenerate = async () => {
  if (!formData.name) {
    alert('Isi nama produk dulu!')
    return
  }
  
  setAiGenerating(true)
  
  try {
    const res = await fetch('/api/ai/generate-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: aiProvider,
        apiKey: aiApiKey,
        productName: formData.name,
        price: formData.price,
        description: formData.description || '',
      })
    })
    
    if (res.ok) {
      const generated = await res.json()
      
      // Auto-fill ALL fields
      setFormData({
        ...formData,
        headline: generated.headline,
        subheadline: generated.subheadline,
        description: generated.description,
        benefits: generated.benefits, // Array of {text}
        features: generated.features,
        testimonials: generated.testimonials,
        bonuses: generated.bonuses,
        faqs: generated.faqs,
        guarantee: generated.guarantee,
        socialProof: generated.socialProof,
        urgencyText: generated.urgencyText,
        ctaText: generated.ctaText,
      })
      
      alert('✅ AI berhasil generate semua detail!')
    } else {
      const error = await res.json()
      alert(error.error || 'AI generation failed')
    }
  } catch (error) {
    console.error(error)
    alert('Error calling AI')
  } finally {
    setAiGenerating(false)
  }
}
```

### 3. Create API Endpoint: /api/ai/generate-product/route.ts

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check UNLIMITED tier
    if (session.user.tier !== 'UNLIMITED') {
      return NextResponse.json({ error: 'Feature ini hanya untuk UNLIMITED users' }, { status: 403 })
    }
    
    const { provider, apiKey, productName, price, description } = await request.json()
    
    let generatedText = ''
    
    if (provider === 'gemini') {
      // Call Google Gemini API
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Kamu adalah copywriter expert untuk e-commerce Indonesia. Generate konten lengkap untuk landing page produk berikut:

Produk: ${productName}
Harga: Rp ${price}
Deskripsi singkat: ${description || 'Tidak ada deskripsi'}

Buatkan dalam format JSON dengan struktur:
{
  "headline": "Headline menarik (max 60 karakter)",
  "subheadline": "Subheadline persuasif (max 120 karakter)",
  "description": "Deskripsi lengkap produk (3-4 paragraf)",
  "benefits": [
    {"text": "Manfaat 1"},
    {"text": "Manfaat 2"},
    {"text": "Manfaat 3"},
    {"text": "Manfaat 4"},
    {"text": "Manfaat 5"}
  ],
  "features": [
    {"text": "Spesifikasi 1"},
    {"text": "Spesifikasi 2"},
    {"text": "Spesifikasi 3"},
    {"text": "Spesifikasi 4"},
    {"text": "Spesifikasi 5"}
  ],
  "testimonials": [
    {"name": "Nama 1", "rating": 5, "text": "Testimoni positif", "role": "Pembeli Verified"},
    {"name": "Nama 2", "rating": 5, "text": "Testimoni positif", "role": "Pembeli Verified"},
    {"name": "Nama 3", "rating": 5, "text": "Testimoni positif", "role": "Pembeli Verified"}
  ],
  "bonuses": [
    {"title": "Bonus 1", "description": "Deskripsi bonus", "value": "Rp 50.000"},
    {"title": "Bonus 2", "description": "Deskripsi bonus", "value": "Rp 30.000"}
  ],
  "faqs": [
    {"question": "Pertanyaan 1?", "answer": "Jawaban 1"},
    {"question": "Pertanyaan 2?", "answer": "Jawaban 2"},
    {"question": "Pertanyaan 3?", "answer": "Jawaban 3"},
    {"question": "Pertanyaan 4?", "answer": "Jawaban 4"},
    {"question": "Pertanyaan 5?", "answer": "Jawaban 5"}
  ],
  "guarantee": "Text garansi yang meyakinkan (2-3 kalimat)",
  "socialProof": "Bukti sosial (contoh: '1000+ Pelanggan Puas di Seluruh Indonesia')",
  "urgencyText": "Text urgency yang membuat FOMO",
  "ctaText": "Text CTA yang action-oriented (contoh: 'PESAN SEKARANG JUGA!')"
}

PENTING:
- Gunakan Bahasa Indonesia yang persuasif
- Buat testimonials yang realistic dan beragam
- Benefits harus spesifik dan relevan dengan produk
- FAQs harus menjawab kekhawatiran umum pembeli
- Guarantee harus membuat customer merasa aman
- Return HANYA JSON, tanpa markdown atau teks tambahan`
            }]
          }]
        })
      })
      
      if (!geminiRes.ok) {
        throw new Error('Gemini API failed')
      }
      
      const geminiData = await geminiRes.json()
      generatedText = geminiData.candidates[0].content.parts[0].text
      
    } else if (provider === 'groq') {
      // Call Groq API
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [{
            role: 'user',
            content: `[Same prompt as Gemini above]`
          }],
          temperature: 0.7,
        })
      })
      
      if (!groqRes.ok) {
        throw new Error('Groq API failed')
      }
      
      const groqData = await groqRes.json()
      generatedText = groqData.choices[0].message.content
    }
    
    // Parse JSON response
    const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const generated = JSON.parse(cleanText)
    
    return NextResponse.json(generated)
    
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'AI generation failed' },
      { status: 500 }
    )
  }
}
```

### 4. Update Submit Handler

Handle photo uploads to Google Drive before saving:
```typescript
// Upload benefit images
if (formData.benefits.some(b => b.imageFile)) {
  const benefitUploads = await Promise.all(
    formData.benefits.map(async (b) => {
      if (b.imageFile) {
        const imageId = await uploadImageToDrive(b.imageFile)
        return {...b, imageUrl: imageId, imageFile: undefined}
      }
      return b
    })
  )
  // Update formData with uploaded IDs
}
```

## Priority Order:
1. ✅ Schema & Interface (DONE)
2. ✅ Template Display (DONE)
3. ⚠️ Form UI for photo upload (TODO - Complex, ~500 lines)
4. ⚠️ API endpoint for handling uploads (TODO)
5. ⚠️ AI Auto-Generate feature (TODO - New feature)

## Estimated Work:
- Photo Upload UI: ~2-3 hours (many form builders to update)
- API Upload Handler: ~1 hour
- AI Auto-Generate: ~1-2 hours (API integration + testing)

Total: ~4-6 hours work

## Recommendation:
Since this is VERY LARGE, we can:
A) Implement photo upload first (practical)
B) Implement AI feature first (exciting new feature)
C) Do both but in separate commits

Which do you prefer?
