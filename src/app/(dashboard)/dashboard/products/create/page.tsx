'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CreateProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [session, setSession] = useState<any>(null)
  
  // Form state with ALL fields from edit page
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    isAvailable: true,
    // Phase 1: Video + Discount
    videoUrl: '',
    originalPrice: '',
    discountPercent: '',
    discountValidUntil: '',
    // Phase 2: Conversion Page
    hasConversionPage: false,
    conversionPageSlug: '',
    conversionTemplate: 'red-urgency',
    headline: '',
    subheadline: '',
    // Phase 3: Benefits & Features
    benefits: [] as Array<string | {text: string, imageFile?: File}>,
    features: [] as Array<string | {text: string, imageFile?: File}>,
    // Phase 4: Urgency Settings
    hasCountdown: false,
    countdownEnd: '',
    limitedStock: '',
    urgencyText: '',
    ctaText: '',
    ctaColor: 'red',
    // Phase 5: Social Proof & Trust Builders
    testimonials: [] as Array<{name: string, rating: number, text: string, role: string, photoFile?: File}>,
    bonuses: [] as Array<{title: string, description: string, value: string, imageFile?: File}>,
    faqs: [] as Array<{question: string, answer: string}>,
    guarantee: '',
    socialProof: '',
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  // AI Auto-Generate States (UNLIMITED only)
  const [aiProvider, setAiProvider] = useState('groq') // Default to Groq (works better!)
  const [productCategory, setProductCategory] = useState('')
  const [hasGeminiKey, setHasGeminiKey] = useState(false)
  const [hasGroqKey, setHasGroqKey] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)

  useEffect(() => {
    fetchSession()
    fetchApiKeys()
  }, [])
  
  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        setSession(data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/user/api-keys')
      if (res.ok) {
        const data = await res.json()
        setHasGeminiKey(data.hasGeminiKey)
        setHasGroqKey(data.hasGroqKey)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    setImages((prev) => [...prev, ...fileArray])

    // Create previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // AI Auto-Generate Handler with 1-Click (uses saved API keys)
  const handleAiGenerate = async () => {
    if (!formData.name) {
      alert('⚠️ Isi nama produk dulu sebelum generate dengan AI!')
      return
    }
    
    if (aiProvider === 'gemini' && !hasGeminiKey) {
      alert('⚠️ Simpan Gemini API key dulu di Settings!')
      router.push('/dashboard/settings')
      return
    }
    
    if (aiProvider === 'groq' && !hasGroqKey) {
      alert('⚠️ Simpan Groq API key dulu di Settings!')
      router.push('/dashboard/settings')
      return
    }
    
    const confirmed = confirm(
      '🤖 AI akan generate SEMUA detail produk berdasarkan nama dan harga yang sudah diisi.\\n\\n' +
      'Data yang akan di-generate:\\n' +
      '• Headline & Subheadline\\n' +
      '• Deskripsi lengkap\\n' +
      '• 5 Benefits\\n' +
      '• 5 Features\\n' +
      '• 3 Testimonials\\n' +
      '• 2 Bonuses\\n' +
      '• 5 FAQs\\n' +
      '• Guarantee Text\\n' +
      '• Social Proof\\n' +
      '• Urgency & CTA Text\\n\\n' +
      'Lanjutkan?'
    )
    
    if (!confirmed) return
    
    setAiGenerating(true)
    
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          productName: formData.name,
          price: formData.price,
          description: formData.description,
          category: productCategory || null,
          // API key will be fetched from database automatically
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        console.error('AI Generation Error:', error)
        
        // Special handling for rate limit (429)
        if (error.rateLimitExceeded) {
          const providerName = error.provider === 'gemini' ? 'Gemini' : 'Groq'
          const otherProvider = error.provider === 'gemini' ? 'Groq' : 'Gemini'
          
          if (confirm(`⚠️ ${providerName} Quota Habis!\n\n${error.error}\n\nMau switch ke ${otherProvider}?`)) {
            setAiProvider(error.provider === 'gemini' ? 'groq' : 'gemini')
            alert(`✅ Switched ke ${otherProvider}! Coba generate lagi.`)
            return
          }
        }
        
        // Other error handling...
        throw new Error(error.error || 'AI generation failed')
      }
      
      const generated = await res.json()
      
      // Generate slug from product name
      const autoSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      console.log('🔧 AI Generate - Auto Slug:', autoSlug)
      console.log('🔧 Current conversionPageSlug:', formData.conversionPageSlug)
      
      // Apply generated data + ENABLE conversion page!
      const updatedFormData = {
        ...formData,
        // Enable conversion page (CRITICAL FIX!)
        hasConversionPage: true,
        conversionPageSlug: formData.conversionPageSlug || autoSlug,
        conversionTemplate: formData.conversionTemplate || 'red-urgency',
        // Generated content
        headline: generated.headline || '',
        subheadline: generated.subheadline || '',
        description: generated.description || formData.description,
        benefits: generated.benefits || [],
        features: generated.features || [],
        testimonials: generated.testimonials || [],
        bonuses: generated.bonuses || [],
        faqs: generated.faqs || [],
        guarantee: generated.guarantee || '',
        socialProof: generated.socialProof || '',
        urgencyText: generated.urgencyText || '',
        ctaText: generated.ctaText || '',
      }
      
      console.log('✅ Updated Form Data:', updatedFormData)
      console.log('✅ hasConversionPage:', updatedFormData.hasConversionPage)
      console.log('✅ conversionPageSlug:', updatedFormData.conversionPageSlug)
      
      setFormData(updatedFormData)
      
      alert('✅ AI berhasil generate semua konten!\n\n' +
            `📄 Conversion Page: ${updatedFormData.hasConversionPage ? 'ENABLED ✅' : 'DISABLED ❌'}\n` +
            `🔗 Slug: /p/${updatedFormData.conversionPageSlug}\n\n` +
            'Scroll kebawah untuk lihat hasilnya.')
      
    } catch (error: any) {
      console.error(error)
      alert('❌ Error calling AI:\\n\\n' + error.message)
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setUploading(true)

    try {
      const formDataToSend = new FormData()
      
      // Basic fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      if (formData.stock) formDataToSend.append('stock', formData.stock)
      formDataToSend.append('isAvailable', formData.isAvailable.toString())

      // Phase 1: Video + Discount
      if (formData.videoUrl) formDataToSend.append('videoUrl', formData.videoUrl)
      if (formData.originalPrice) formDataToSend.append('originalPrice', formData.originalPrice)
      if (formData.discountPercent) formDataToSend.append('discountPercent', formData.discountPercent)
      if (formData.discountValidUntil) formDataToSend.append('discountValidUntil', formData.discountValidUntil)
      
      // Phase 2: Conversion Page
      formDataToSend.append('hasConversionPage', formData.hasConversionPage.toString())
      if (formData.conversionPageSlug) formDataToSend.append('conversionPageSlug', formData.conversionPageSlug)
      if (formData.conversionTemplate) formDataToSend.append('conversionTemplate', formData.conversionTemplate)
      if (formData.headline) formDataToSend.append('headline', formData.headline)
      if (formData.subheadline) formDataToSend.append('subheadline', formData.subheadline)
      
      // Phase 3: Benefits & Features
      if (formData.benefits.length > 0) {
        const filteredBenefits = formData.benefits.filter(b => {
          const text = typeof b === 'string' ? b : b.text
          return text && text.trim()
        })
        formDataToSend.append('benefits', JSON.stringify(filteredBenefits))
      }
      if (formData.features.length > 0) {
        const filteredFeatures = formData.features.filter(f => {
          const text = typeof f === 'string' ? f : f.text
          return text && text.trim()
        })
        formDataToSend.append('features', JSON.stringify(filteredFeatures))
      }
      
      // Phase 4: Urgency Settings
      formDataToSend.append('hasCountdown', formData.hasCountdown.toString())
      if (formData.countdownEnd) formDataToSend.append('countdownEnd', formData.countdownEnd)
      if (formData.limitedStock) formDataToSend.append('limitedStock', formData.limitedStock)
      if (formData.urgencyText) formDataToSend.append('urgencyText', formData.urgencyText)
      if (formData.ctaText) formDataToSend.append('ctaText', formData.ctaText)
      if (formData.ctaColor) formDataToSend.append('ctaColor', formData.ctaColor)
      
      // Phase 5: Social Proof & Trust Builders
      if (formData.testimonials.length > 0) {
        formDataToSend.append('testimonials', JSON.stringify(formData.testimonials.filter(t => t.name && t.text)))
      }
      if (formData.bonuses.length > 0) {
        formDataToSend.append('bonuses', JSON.stringify(formData.bonuses.filter(b => b.title)))
      }
      if (formData.faqs.length > 0) {
        formDataToSend.append('faqs', JSON.stringify(formData.faqs.filter(f => f.question && f.answer)))
      }
      if (formData.guarantee) formDataToSend.append('guarantee', formData.guarantee)
      if (formData.socialProof) formDataToSend.append('socialProof', formData.socialProof)

      // Add main product images
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })
      
      // Add section photo files with index mapping
      formData.benefits.forEach((benefit, index) => {
        if (typeof benefit === 'object' && benefit.imageFile) {
          formDataToSend.append(`benefitPhoto_${index}`, benefit.imageFile)
        }
      })
      
      formData.features.forEach((feature, index) => {
        if (typeof feature === 'object' && feature.imageFile) {
          formDataToSend.append(`featurePhoto_${index}`, feature.imageFile)
        }
      })
      
      formData.testimonials.forEach((testimonial, index) => {
        if (testimonial.photoFile) {
          formDataToSend.append(`testimonialPhoto_${index}`, testimonial.photoFile)
        }
      })
      
      formData.bonuses.forEach((bonus, index) => {
        if (bonus.imageFile) {
          formDataToSend.append(`bonusImage_${index}`, bonus.imageFile)
        }
      })

      const res = await fetch('/api/products/create', {
        method: 'POST',
        body: formDataToSend,
      })

      if (res.ok) {
        alert('✅ Produk & foto berhasil dibuat!')
        router.push('/dashboard/products')
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create product')
      }
    } catch (error) {
      console.error(error)
      alert('Error creating product')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tambah Produk</h1>
        <p className="mt-2 text-gray-600">
          Buat produk baru dengan semua detail lengkap
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Foto Produk 📸
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500">
                  <span>Upload foto</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">atau drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Foto Terpilih ({imagePreviews.length})
            </label>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full"
                    title="Hapus foto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Uploading foto ke Google Drive...</span>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Produk *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="iPhone 15 Pro Max"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi Produk
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Jelaskan produk Anda secara detail..."
          />
        </div>

        {/* AI Auto-Generate Section (UNLIMITED Only) */}
        {session?.user?.tier === 'UNLIMITED' && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 text-4xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  AI AUTO-GENERATE (1-CLICK!) 
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Biarkan AI mengisi <strong>SEMUA detail produk</strong> secara otomatis! 
                  Cukup isi <strong>Nama Produk</strong> dan <strong>Harga</strong>, lalu klik Generate. 
                  API key sudah tersimpan, jadi tinggal 1 klik! ✨
                </p>
              </div>
            </div>
            
            {/* Category Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📦 Kategori Produk (Opsional - untuk hasil AI lebih baik)
              </label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-base"
              >
                <option value="">Pilih kategori... (atau skip untuk generic)</option>
                <option value="ecommerce">🛍️ E-commerce - Fashion, Electronics, Accessories</option>
                <option value="services">💼 Services - Konsultan, Cleaning, Repair</option>
                <option value="digital">📱 Digital Products - Course, Ebook, Software</option>
                <option value="fnb">🍔 F&B - Cafe, Restaurant, Catering</option>
                <option value="homeLiving">🏠 Home & Living - Furniture, Decor</option>
                <option value="beauty">💄 Beauty & Health - Skincare, Makeup</option>
                <option value="entertainment">🎮 Entertainment - Games, Toys</option>
                <option value="education">📚 Education - Books, Courses</option>
              </select>
              {productCategory && (
                <p className="mt-2 text-xs text-green-700 bg-green-50 p-2 rounded">
                  ✨ AI akan generate dengan context khusus untuk kategori ini!
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔧 AI Provider
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="groq">⚡ Groq (Llama 3.1) - RECOMMENDED {hasGroqKey ? '✅' : '❌'}</option>
                  <option value="gemini">Google Gemini 2.0 {hasGeminiKey ? '✅' : '❌'}</option>
                </select>
                <p className="mt-1 text-xs text-gray-600">
                  💡 Groq: Super cepat (134ms avg) | Gemini: Perlu setup API key
                </p>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/settings')}
                  className="w-full px-4 py-2 border-2 border-purple-300 hover:border-purple-400 rounded-lg text-sm font-medium text-purple-700 transition-colors"
                >
                  ⚙️ Kelola API Keys
                </button>
              </div>
            </div>
            
            {!hasGeminiKey && !hasGroqKey && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Belum ada API key tersimpan. Simpan dulu di Settings untuk 1-click generate!
                </p>
              </div>
            )}
            
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={!formData.name || aiGenerating || (aiProvider === 'gemini' ? !hasGeminiKey : !hasGroqKey)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {aiGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>🔄 Generating dengan AI...</span>
                </span>
              ) : (
                '✨ 1-CLICK GENERATE SEMUA DETAIL'
              )}
            </button>
            
            <div className="mt-4 bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-xs font-bold text-purple-900 mb-2">📦 Yang akan di-generate:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
                <div>✓ Headline & Subheadline</div>
                <div>✓ Deskripsi Lengkap</div>
                <div>✓ 5 Benefit Produk</div>
                <div>✓ 5 Fitur/Spesifikasi</div>
                <div>✓ 3 Testimoni Pelanggan</div>
                <div>✓ 2 Bonus Menarik</div>
                <div>✓ 5 FAQ Lengkap</div>
                <div>✓ Teks Garansi</div>
                <div>✓ Social Proof</div>
                <div>✓ Urgency Text</div>
                <div>✓ CTA Button Text</div>
                <div>✓ Dan lainnya!</div>
              </div>
            </div>
          </div>
        )}

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (YouTube/Vimeo) 🎥
          </label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Video demo produk meningkatkan konversi hingga 80%!
          </p>
        </div>

        {/* Pricing Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Harga & Diskon</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Jual * 💵
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="150000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Kosongkan untuk unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Coret (Original)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="250000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diskon %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diskon Valid Sampai
            </label>
            <input
              type="date"
              value={formData.discountValidUntil}
              onChange={(e) => setFormData({ ...formData, discountValidUntil: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversion Page Toggle */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">🚀 Conversion Landing Page</h3>
              <p className="text-sm text-gray-600">Buat halaman landing page khusus untuk produk ini</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasConversionPage}
                onChange={(e) => setFormData({ ...formData, hasConversionPage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {formData.hasConversionPage && (
            <div className="space-y-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug * (contoh: promo-iphone-15)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">dibeli.my.id/p/</span>
                  <input
                    type="text"
                    required={formData.hasConversionPage}
                    value={formData.conversionPageSlug}
                    onChange={(e) => setFormData({ ...formData, conversionPageSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="promo-iphone-15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Warna
                </label>
                <select
                  value={formData.conversionTemplate}
                  onChange={(e) => setFormData({ ...formData, conversionTemplate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="red-urgency">🔴 Red Urgency (High Energy)</option>
                  <option value="green-trust">🟢 Green Trust (Reliability)</option>
                  <option value="yellow-energy">🟡 Yellow Energy (Excitement)</option>
                  <option value="blue-professional">🔵 Blue Professional (Corporate)</option>
                  <option value="purple-royal">🟣 Purple Royal (Premium/Luxury)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline *
                </label>
                <input
                  type="text"
                  required={formData.hasConversionPage}
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="PROMO TERBATAS! iPhone 15 Pro Max DISKON 40%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subheadline
                </label>
                <input
                  type="text"
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Dapatkan iPhone terbaru dengan harga spesial..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Benefits & Features Section */}
        {formData.hasConversionPage && (
          <div className="border-t pt-6 space-y-6">
            {/* Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>Benefits (Manfaat Produk)</span>
              </h3>
              <div className="space-y-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={typeof benefit === 'string' ? benefit : benefit.text}
                      onChange={(e) => {
                        const newBenefits = [...formData.benefits]
                        if (typeof benefit === 'string') {
                          newBenefits[index] = e.target.value
                        } else {
                          newBenefits[index] = {...benefit, text: e.target.value}
                        }
                        setFormData({ ...formData, benefits: newBenefits })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder={`Benefit ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newBenefits = formData.benefits.filter((_, i) => i !== index)
                        setFormData({ ...formData, benefits: newBenefits })
                      }}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ''] })}
                  className="w-full px-4 py-2 border-2 border-dashed border-green-300 hover:border-green-400 text-green-700 rounded-lg"
                >
                  + Tambah Benefit
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>Features (Fitur/Spesifikasi)</span>
              </h3>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={typeof feature === 'string' ? feature : feature.text}
                      onChange={(e) => {
                        const newFeatures = [...formData.features]
                        if (typeof feature === 'string') {
                          newFeatures[index] = e.target.value
                        } else {
                          newFeatures[index] = {...feature, text: e.target.value}
                        }
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = formData.features.filter((_, i) => i !== index)
                        setFormData({ ...formData, features: newFeatures })
                      }}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                  className="w-full px-4 py-2 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-700 rounded-lg"
                >
                  + Tambah Feature
                </button>
              </div>
            </div>

            {/* Urgency Settings */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⏰</span>
                <span>Urgency Settings (Penciptaan FOMO)</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasCountdown"
                    checked={formData.hasCountdown}
                    onChange={(e) => setFormData({ ...formData, hasCountdown: e.target.checked })}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasCountdown" className="text-sm font-medium text-gray-900">
                    Aktifkan Countdown Timer
                  </label>
                </div>

                {formData.hasCountdown && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Countdown Berakhir Pada
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.countdownEnd}
                      onChange={(e) => setFormData({ ...formData, countdownEnd: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limited Stock (Stok Terbatas)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.limitedStock}
                    onChange={(e) => setFormData({ ...formData, limitedStock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="10"
                  />
                  <p className="mt-1 text-xs text-gray-500">Tampilkan "Hanya X produk tersisa!"</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Text
                  </label>
                  <input
                    type="text"
                    value={formData.urgencyText}
                    onChange={(e) => setFormData({ ...formData, urgencyText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="PROMO BERAKHIR DALAM 24 JAM!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="BELI SEKARANG!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Color
                  </label>
                  <select
                    value={formData.ctaColor}
                    onChange={(e) => setFormData({ ...formData, ctaColor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="red">🔴 Red (Urgency)</option>
                    <option value="green">🟢 Green (Trust)</option>
                    <option value="yellow">🟡 Yellow (Attention)</option>
                    <option value="blue">🔵 Blue (Professional)</option>
                    <option value="orange">🟠 Orange (Energy)</option>
                    <option value="gradient">🌈 Gradient (Premium)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
              <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <span>Testimonials (Testimoni Pelanggan)</span>
              </h3>
              <div className="space-y-4">
                {formData.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border-2 border-teal-200">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => {
                          const newTestimonials = [...formData.testimonials]
                          newTestimonials[index].name = e.target.value
                          setFormData({ ...formData, testimonials: newTestimonials })
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Nama pelanggan"
                      />
                      <input
                        type="text"
                        value={testimonial.role}
                        onChange={(e) => {
                          const newTestimonials = [...formData.testimonials]
                          newTestimonials[index].role = e.target.value
                          setFormData({ ...formData, testimonials: newTestimonials })
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Profesi/Role"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="text-xs text-gray-600 mb-1 block">Rating:</label>
                      <select
                        value={testimonial.rating}
                        onChange={(e) => {
                          const newTestimonials = [...formData.testimonials]
                          newTestimonials[index].rating = parseInt(e.target.value)
                          setFormData({ ...formData, testimonials: newTestimonials })
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (5 bintang)</option>
                        <option value={4}>⭐⭐⭐⭐ (4 bintang)</option>
                        <option value={3}>⭐⭐⭐ (3 bintang)</option>
                      </select>
                    </div>
                    <textarea
                      value={testimonial.text}
                      onChange={(e) => {
                        const newTestimonials = [...formData.testimonials]
                        newTestimonials[index].text = e.target.value
                        setFormData({ ...formData, testimonials: newTestimonials })
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 mb-3"
                      placeholder="Testimoni..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newTestimonials = formData.testimonials.filter((_, i) => i !== index)
                        setFormData({ ...formData, testimonials: newTestimonials })
                      }}
                      className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                    >
                      Hapus Testimoni
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, testimonials: [...formData.testimonials, {name: '', rating: 5, text: '', role: ''}] })}
                  className="w-full px-4 py-2 border-2 border-dashed border-teal-300 hover:border-teal-400 text-teal-700 rounded-lg"
                >
                  + Tambah Testimoni
                </button>
              </div>
            </div>

            {/* Bonuses */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <span>Bonuses (Bonus Gratis)</span>
              </h3>
              <div className="space-y-4">
                {formData.bonuses.map((bonus, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                    <input
                      type="text"
                      value={bonus.title}
                      onChange={(e) => {
                        const newBonuses = [...formData.bonuses]
                        newBonuses[index].title = e.target.value
                        setFormData({ ...formData, bonuses: newBonuses })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-3"
                      placeholder="Judul Bonus"
                    />
                    <textarea
                      value={bonus.description}
                      onChange={(e) => {
                        const newBonuses = [...formData.bonuses]
                        newBonuses[index].description = e.target.value
                        setFormData({ ...formData, bonuses: newBonuses })
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-3"
                      placeholder="Deskripsi bonus..."
                    />
                    <input
                      type="text"
                      value={bonus.value}
                      onChange={(e) => {
                        const newBonuses = [...formData.bonuses]
                        newBonuses[index].value = e.target.value
                        setFormData({ ...formData, bonuses: newBonuses })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 mb-3"
                      placeholder="Nilai bonus (contoh: Rp 100.000)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newBonuses = formData.bonuses.filter((_, i) => i !== index)
                        setFormData({ ...formData, bonuses: newBonuses })
                      }}
                      className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                    >
                      Hapus Bonus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, bonuses: [...formData.bonuses, {title: '', description: '', value: ''}] })}
                  className="w-full px-4 py-2 border-2 border-dashed border-yellow-300 hover:border-yellow-400 text-yellow-700 rounded-lg"
                >
                  + Tambah Bonus
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                <span>FAQs (Frequently Asked Questions)</span>
              </h3>
              <div className="space-y-4">
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[index].question = e.target.value
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-3"
                      placeholder="Pertanyaan"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs]
                        newFaqs[index].answer = e.target.value
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-3"
                      placeholder="Jawaban..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFaqs = formData.faqs.filter((_, i) => i !== index)
                        setFormData({ ...formData, faqs: newFaqs })
                      }}
                      className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                    >
                      Hapus FAQ
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, {question: '', answer: ''}] })}
                  className="w-full px-4 py-2 border-2 border-dashed border-indigo-300 hover:border-indigo-400 text-indigo-700 rounded-lg"
                >
                  + Tambah FAQ
                </button>
              </div>
            </div>

            {/* Guarantee & Social Proof */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                <span>Guarantee & Social Proof</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guarantee Text (Jaminan)
                  </label>
                  <textarea
                    value={formData.guarantee}
                    onChange={(e) => setFormData({ ...formData, guarantee: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="100% Garansi Uang Kembali jika tidak puas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Proof Text
                  </label>
                  <input
                    type="text"
                    value={formData.socialProof}
                    onChange={(e) => setFormData({ ...formData, socialProof: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="1000+ Pelanggan Puas di Seluruh Indonesia"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center border-t pt-6">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
            Produk tersedia untuk dijual
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 border-t pt-6">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Membuat Produk...</span>
              </span>
            ) : (
              '✅ Buat Produk'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
