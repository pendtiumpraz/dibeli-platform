'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [product, setProduct] = useState<any>(null)
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
    benefits: [] as Array<string | {text: string, imageUrl?: string, imageFile?: File}>,
    features: [] as Array<string | {text: string, imageUrl?: string, imageFile?: File}>,
    // Phase 4: Urgency Settings
    hasCountdown: false,
    countdownEnd: '',
    limitedStock: '',
    urgencyText: '',
    ctaText: '',
    ctaColor: '',
    // Phase 5: Social Proof & Trust Builders
    testimonials: [] as Array<{name: string, rating: number, text: string, role: string, photoUrl?: string, photoFile?: File}>,
    bonuses: [] as Array<{title: string, description: string, value: string, imageUrl?: string, imageFile?: File}>,
    faqs: [] as Array<{question: string, answer: string}>,
    guarantee: '',
    socialProof: '',
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  
  // AI Auto-Generate States (UNLIMITED only)
  const [aiProvider, setAiProvider] = useState('gemini')
  const [aiApiKey, setAiApiKey] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    fetchProduct()
    fetchSession()
  }, [params.id])
  
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

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price.toString(),
          stock: data.stock?.toString() || '',
          isAvailable: data.isAvailable,
          // Phase 1: Video + Discount
          videoUrl: data.videoUrl || '',
          originalPrice: data.originalPrice?.toString() || '',
          discountPercent: data.discountPercent?.toString() || '',
          discountValidUntil: data.discountValidUntil ? new Date(data.discountValidUntil).toISOString().split('T')[0] : '',
          // Phase 2: Conversion Page
          hasConversionPage: data.hasConversionPage || false,
          conversionPageSlug: data.conversionPageSlug || '',
          conversionTemplate: data.conversionTemplate || 'red-urgency',
          headline: data.headline || '',
          subheadline: data.subheadline || '',
          // Phase 3: Benefits & Features
          benefits: data.benefits || [],
          features: data.features || [],
          // Phase 4: Urgency Settings
          hasCountdown: data.hasCountdown || false,
          countdownEnd: data.countdownEnd ? new Date(data.countdownEnd).toISOString().slice(0, 16) : '',
          limitedStock: data.limitedStock?.toString() || '',
          urgencyText: data.urgencyText || '',
          ctaText: data.ctaText || '',
          ctaColor: data.ctaColor || '',
          // Phase 5: Social Proof & Trust Builders
          testimonials: data.testimonials || [],
          bonuses: data.bonuses || [],
          faqs: data.faqs || [],
          guarantee: data.guarantee || '',
          socialProof: data.socialProof || '',
        })
        // Set existing images
        if (data.images && Array.isArray(data.images)) {
          setExistingImages(data.images)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    setNewImages((prev) => [...prev, ...fileArray])

    // Create previews
    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((id) => id !== imageId))
    setDeletedImages((prev) => [...prev, imageId])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setUploading(true)

    try {
      // Check if there are any files to upload (main images OR section photos)
      const hasBenefitPhotos = formData.benefits.some(b => typeof b === 'object' && b.imageFile)
      const hasFeaturePhotos = formData.features.some(f => typeof f === 'object' && f.imageFile)
      const hasTestimonialPhotos = formData.testimonials.some(t => t.photoFile)
      const hasBonusImages = formData.bonuses.some(b => b.imageFile)
      const hasAnyFiles = newImages.length > 0 || hasBenefitPhotos || hasFeaturePhotos || hasTestimonialPhotos || hasBonusImages
      
      // If there are new files, use FormData
      if (hasAnyFiles) {
        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('price', formData.price)
        formDataToSend.append('stock', formData.stock)
        formDataToSend.append('isAvailable', formData.isAvailable.toString())
        formDataToSend.append('existingImages', JSON.stringify(existingImages))
        formDataToSend.append('deletedImages', JSON.stringify(deletedImages))
        
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
        if (formData.testimonials.length > 0) formDataToSend.append('testimonials', JSON.stringify(formData.testimonials.filter(t => t.name && t.text)))
        if (formData.bonuses.length > 0) formDataToSend.append('bonuses', JSON.stringify(formData.bonuses.filter(b => b.title)))
        if (formData.faqs.length > 0) formDataToSend.append('faqs', JSON.stringify(formData.faqs.filter(f => f.question && f.answer)))
        if (formData.guarantee) formDataToSend.append('guarantee', formData.guarantee)
        if (formData.socialProof) formDataToSend.append('socialProof', formData.socialProof)

        // Add new image files
        newImages.forEach((file) => {
          formDataToSend.append('images', file)
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

        const res = await fetch(`/api/products/${params.id}`, {
          method: 'PUT',
          body: formDataToSend,
        })

        if (res.ok) {
          alert('Produk & foto berhasil diupdate! ✅')
          router.push('/dashboard/products')
          router.refresh()
        } else {
          const error = await res.json()
          alert(error.error || 'Failed to update product')
        }
      } else {
        // No new images, just JSON
        const res = await fetch(`/api/products/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            stock: formData.stock ? parseInt(formData.stock) : null,
            // Phase 1: Video + Discount
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
            discountPercent: formData.discountPercent ? parseInt(formData.discountPercent) : null,
            discountValidUntil: formData.discountValidUntil || null,
            // Phase 2: Conversion Page
            hasConversionPage: formData.hasConversionPage,
            conversionPageSlug: formData.conversionPageSlug || null,
            conversionTemplate: formData.conversionTemplate || 'red-urgency',
            headline: formData.headline || null,
            subheadline: formData.subheadline || null,
            // Phase 3: Benefits & Features
            benefits: formData.benefits.filter(b => {
              const text = typeof b === 'string' ? b : b.text
              return text && text.trim()
            }),
            features: formData.features.filter(f => {
              const text = typeof f === 'string' ? f : f.text
              return text && text.trim()
            }),
            // Phase 4: Urgency Settings
            hasCountdown: formData.hasCountdown,
            countdownEnd: formData.countdownEnd || null,
            limitedStock: formData.limitedStock ? parseInt(formData.limitedStock) : null,
            urgencyText: formData.urgencyText || null,
            ctaText: formData.ctaText || null,
            ctaColor: formData.ctaColor || null,
            // Phase 5: Social Proof & Trust Builders
            testimonials: formData.testimonials.filter(t => t.name && t.text),
            bonuses: formData.bonuses.filter(b => b.title),
            faqs: formData.faqs.filter(f => f.question && f.answer),
            guarantee: formData.guarantee || null,
            socialProof: formData.socialProof || null,
            existingImages,
            deletedImages,
          }),
        })

        if (res.ok) {
          alert('Produk berhasil diupdate! ✅')
          router.push('/dashboard/products')
          router.refresh()
        } else {
          const error = await res.json()
          alert(error.error || 'Failed to update product')
        }
      }
    } catch (error) {
      console.error(error)
      alert('Error updating product')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }
  
  // AI Auto-Generate Handler
  const handleAiGenerate = async () => {
    if (!formData.name) {
      alert('⚠️ Isi nama produk dulu sebelum generate dengan AI!')
      return
    }
    
    if (!aiApiKey) {
      alert('⚠️ Masukkan API key dulu!')
      return
    }
    
    const confirmed = confirm(
      '🤖 AI akan generate SEMUA detail produk berdasarkan nama dan harga yang sudah diisi.\n\n' +
      'Data yang akan di-generate:\n' +
      '• Headline & Subheadline\n' +
      '• Deskripsi lengkap\n' +
      '• 5 Benefits\n' +
      '• 5 Features\n' +
      '• 3 Testimonials\n' +
      '• 2 Bonuses\n' +
      '• 5 FAQs\n' +
      '• Guarantee\n' +
      '• Social Proof\n' +
      '• Urgency Text\n' +
      '• CTA Text\n\n' +
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
          headline: generated.headline || formData.headline,
          subheadline: generated.subheadline || formData.subheadline,
          description: generated.description || formData.description,
          benefits: generated.benefits || formData.benefits,
          features: generated.features || formData.features,
          testimonials: generated.testimonials || formData.testimonials,
          bonuses: generated.bonuses || formData.bonuses,
          faqs: generated.faqs || formData.faqs,
          guarantee: generated.guarantee || formData.guarantee,
          socialProof: generated.socialProof || formData.socialProof,
          urgencyText: generated.urgencyText || formData.urgencyText,
          ctaText: generated.ctaText || formData.ctaText,
        })
        
        alert('✅ AI berhasil generate semua detail!\n\n' +
          '📝 Silakan review dan edit jika perlu, lalu SAVE.')
      } else {
        const error = await res.json()
        alert('❌ AI generation failed:\n\n' + (error.error || 'Unknown error'))
      }
    } catch (error: any) {
      console.error(error)
      alert('❌ Error calling AI:\n\n' + error.message)
    } finally {
      setAiGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center text-red-600">Product not found</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
        <p className="mt-2 text-gray-600">
          Update informasi produk Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Existing images */}
        {existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Foto Saat Ini ({existingImages.length})
            </label>
            <div className="grid grid-cols-3 gap-4">
              {existingImages.map((imageId: string, index: number) => (
                <div key={imageId} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={`https://drive.google.com/thumbnail?id=${imageId}&sz=w500`}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to Googleusercontent if thumbnail fails
                      e.currentTarget.src = `https://lh3.googleusercontent.com/d/${imageId}=w500`
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(imageId)}
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

        {/* New images preview */}
        {imagePreviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Foto Baru ({imagePreviews.length})
            </label>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                  <img
                    src={preview}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    NEW
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
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

        {/* Upload new images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {existingImages.length > 0 ? 'Tambah Foto Lagi' : 'Upload Foto Produk'}
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* AI Auto-Generate Section (UNLIMITED Only) */}
        {session?.user?.tier === 'UNLIMITED' && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 text-4xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-purple-900 mb-2">
                  AI AUTO-GENERATE (UNLIMITED EXCLUSIVE)
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Biarkan AI mengisi <strong>SEMUA detail produk</strong> secara otomatis! 
                  Cukup isi <strong>Nama Produk</strong> dan <strong>Harga</strong>, lalu klik Generate. 
                  AI akan membuat Headlines, Benefits, Features, Testimonials, FAQs, dan semua konten lainnya dalam sekali klik! ✨
                </p>
              </div>
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
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq (Llama 3.1)</option>
                </select>
                <p className="mt-1 text-xs text-gray-600">
                  💡 Gemini: Lebih kreatif | Groq: Lebih cepat
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔑 API Key
                </label>
                <input
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => setAiApiKey(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Masukkan API key"
                />
                <p className="mt-1 text-xs text-gray-600">
                  {aiProvider === 'gemini' ? (
                    <>Get key: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener" className="text-purple-600 hover:underline">Google AI Studio</a></>
                  ) : (
                    <>Get key: <a href="https://console.groq.com/keys" target="_blank" rel="noopener" className="text-purple-600 hover:underline">Groq Console</a></>
                  )}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={!formData.name || !aiApiKey || aiGenerating}
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
                '✨ Generate Seluruh Detail Dengan AI'
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
                Harga Coret (Original) ✨
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="300000"
              />
              <p className="mt-1 text-xs text-gray-500">Harga sebelum diskon</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diskon (%) 🔥
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="50"
              />
              <p className="mt-1 text-xs text-gray-500">Contoh: 50 untuk 50%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diskon Berlaku Sampai ⏰
              </label>
              <input
                type="date"
                value={formData.discountValidUntil}
                onChange={(e) => setFormData({ ...formData, discountValidUntil: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">Buat urgency!</p>
            </div>
          </div>

          {/* Discount Preview */}
          {formData.price && formData.originalPrice && formData.discountPercent && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">👁️ Preview Harga:</h4>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Harga Coret:</p>
                  <p className="text-xl text-gray-400 line-through">
                    Rp {parseFloat(formData.originalPrice).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Harga Jual:</p>
                  <p className="text-3xl font-bold text-green-600">
                    Rp {parseFloat(formData.price).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full text-center">
                    <p className="text-sm font-bold">HEMAT</p>
                    <p className="text-2xl font-black">{formData.discountPercent}%</p>
                  </div>
                </div>
              </div>
              {formData.discountValidUntil && (
                <p className="mt-3 text-sm text-red-700 font-semibold">
                  ⚠️ Diskon berlaku sampai: {new Date(formData.discountValidUntil).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-600">
                💡 Penghematan: Rp {(parseFloat(formData.originalPrice) - parseFloat(formData.price)).toLocaleString('id-ID')}
              </p>
            </div>
          )}
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

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-700">Produk tersedia</span>
          </label>
        </div>

        {/* Phase 2: Conversion Landing Page Section */}
        <div className="border-t pt-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
                  🚀
                </div>
              </div>
              <div className="flex-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasConversionPage}
                    onChange={(e) => {
                      const enabled = e.target.checked
                      setFormData({ 
                        ...formData, 
                        hasConversionPage: enabled,
                        // Auto-generate slug if enabling for first time
                        conversionPageSlug: enabled && !formData.conversionPageSlug 
                          ? formData.name.toLowerCase().replace(/\s+/g, '-') 
                          : formData.conversionPageSlug
                      })
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-3">
                    <span className="text-lg font-bold text-gray-900">Enable Conversion Landing Page</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Buat halaman khusus yang dioptimalkan untuk penjualan maksimal!
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {formData.hasConversionPage && (
              <div className="mt-6 space-y-6 pt-6 border-t border-green-200">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">
                    ✨ <strong>Landing page akan tersedia di:</strong>
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <code className="bg-gray-100 px-3 py-2 rounded text-purple-600 font-mono">
                      /p/{formData.conversionPageSlug || 'produk-slug'}
                    </code>
                    <span className="text-gray-500">← URL khusus untuk promosi!</span>
                  </div>
                </div>

                {/* Template Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🎨 Template Style (5 Pilihan)
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.conversionTemplate === 'red-urgency' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-200 hover:border-red-300'
                    }`}>
                      <input
                        type="radio"
                        name="template"
                        value="red-urgency"
                        checked={formData.conversionTemplate === 'red-urgency'}
                        onChange={(e) => setFormData({ ...formData, conversionTemplate: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-2">🔥</div>
                        <div className="font-bold text-gray-900">Red Urgency</div>
                        <div className="text-xs text-gray-600 mt-1">FOMO & Scarcity</div>
                      </div>
                      {formData.conversionTemplate === 'red-urgency' && (
                        <div className="absolute top-2 right-2 text-red-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </label>

                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.conversionTemplate === 'green-trust' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}>
                      <input
                        type="radio"
                        name="template"
                        value="green-trust"
                        checked={formData.conversionTemplate === 'green-trust'}
                        onChange={(e) => setFormData({ ...formData, conversionTemplate: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-2">🌿</div>
                        <div className="font-bold text-gray-900">Green Trust</div>
                        <div className="text-xs text-gray-600 mt-1">Safety & Trust</div>
                      </div>
                      {formData.conversionTemplate === 'green-trust' && (
                        <div className="absolute top-2 right-2 text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </label>

                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.conversionTemplate === 'yellow-energy' 
                        ? 'border-yellow-500 bg-yellow-50' 
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}>
                      <input
                        type="radio"
                        name="template"
                        value="yellow-energy"
                        checked={formData.conversionTemplate === 'yellow-energy'}
                        onChange={(e) => setFormData({ ...formData, conversionTemplate: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="font-bold text-gray-900">Yellow Energy</div>
                        <div className="text-xs text-gray-600 mt-1">Excitement & Action</div>
                      </div>
                      {formData.conversionTemplate === 'yellow-energy' && (
                        <div className="absolute top-2 right-2 text-yellow-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </label>

                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.conversionTemplate === 'blue-professional' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}>
                      <input
                        type="radio"
                        name="template"
                        value="blue-professional"
                        checked={formData.conversionTemplate === 'blue-professional'}
                        onChange={(e) => setFormData({ ...formData, conversionTemplate: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-2">💼</div>
                        <div className="font-bold text-gray-900">Blue Pro</div>
                        <div className="text-xs text-gray-600 mt-1">Professional</div>
                      </div>
                      {formData.conversionTemplate === 'blue-professional' && (
                        <div className="absolute top-2 right-2 text-blue-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </label>

                    <label className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      formData.conversionTemplate === 'purple-premium' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}>
                      <input
                        type="radio"
                        name="template"
                        value="purple-premium"
                        checked={formData.conversionTemplate === 'purple-premium'}
                        onChange={(e) => setFormData({ ...formData, conversionTemplate: e.target.value })}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-2">👑</div>
                        <div className="font-bold text-gray-900">Purple Premium</div>
                        <div className="text-xs text-gray-600 mt-1">Luxury & Elite</div>
                      </div>
                      {formData.conversionTemplate === 'purple-premium' && (
                        <div className="absolute top-2 right-2 text-purple-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Custom Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔗 Custom URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.conversionPageSlug}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      conversionPageSlug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="produk-amazing-murah"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 URL yang mudah dibagikan di WhatsApp, Instagram, dll.
                  </p>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🎯 Headline (Judul Besar)
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold"
                    placeholder="RAHASIA KULIT GLOWING DALAM 7 HARI!"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Headline yang menarik perhatian & menjanjikan hasil spesifik
                  </p>
                </div>

                {/* Subheadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Subheadline (Penjelasan Singkat)
                  </label>
                  <textarea
                    value={formData.subheadline}
                    onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tanpa efek samping, teruji klinis, dan sudah dipercaya 10,000+ pelanggan di seluruh Indonesia!"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Jelaskan benefit utama & bangun kepercayaan
                  </p>
                </div>

                {/* Phase 3: Benefits & Features */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <span>Benefits & Features</span>
                  </h3>

                  {/* Benefits */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💎 Benefits (Manfaat untuk Pembeli)
                    </label>
                    <div className="space-y-3">
                      {formData.benefits.map((benefit, index) => {
                        const benefitText = typeof benefit === 'string' ? benefit : benefit.text
                        const benefitImageUrl = typeof benefit === 'object' ? benefit.imageUrl : undefined
                        const benefitImageFile = typeof benefit === 'object' ? benefit.imageFile : undefined
                        
                        return (
                          <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <input
                              type="text"
                              value={benefitText}
                              onChange={(e) => {
                                const newBenefits = [...formData.benefits]
                                newBenefits[index] = typeof benefit === 'string' 
                                  ? e.target.value
                                  : {...benefit, text: e.target.value}
                                setFormData({ ...formData, benefits: newBenefits })
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Contoh: Kulit lebih cerah dalam 7 hari"
                            />
                            
                            {/* Photo Upload */}
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded border border-blue-300 text-sm whitespace-nowrap">
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
                              {benefitImageFile && (
                                <img 
                                  src={URL.createObjectURL(benefitImageFile)} 
                                  alt="Icon" 
                                  className="w-10 h-10 rounded object-cover border-2 border-green-500"
                                  title="New photo"
                                />
                              )}
                              {benefitImageUrl && !benefitImageFile && (
                                <img 
                                  src={`https://drive.google.com/thumbnail?id=${benefitImageUrl}&sz=w100`}
                                  alt="Icon" 
                                  className="w-10 h-10 rounded object-cover border-2 border-blue-500"
                                  title="Existing photo"
                                />
                              )}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newBenefits = formData.benefits.filter((_, i) => i !== index)
                                setFormData({ ...formData, benefits: newBenefits })
                              }}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ''] })}
                      className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                    >
                      + Tambah Benefit
                    </button>
                    <p className="mt-2 text-xs text-gray-600">
                      💡 Benefits fokus pada HASIL yang didapat pembeli (bukan fitur teknis). Upload icon untuk visual yang lebih menarik!
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚙️ Features (Spesifikasi & Detail)
                    </label>
                    <div className="space-y-3">
                      {formData.features.map((feature, index) => {
                        const featureText = typeof feature === 'string' ? feature : feature.text
                        const featureImageUrl = typeof feature === 'object' ? feature.imageUrl : undefined
                        const featureImageFile = typeof feature === 'object' ? feature.imageFile : undefined
                        
                        return (
                          <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <input
                              type="text"
                              value={featureText}
                              onChange={(e) => {
                                const newFeatures = [...formData.features]
                                newFeatures[index] = typeof feature === 'string' 
                                  ? e.target.value
                                  : {...feature, text: e.target.value}
                                setFormData({ ...formData, features: newFeatures })
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Contoh: Mengandung Vitamin C 1000mg"
                            />
                            
                            {/* Photo Upload */}
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded border border-blue-300 text-sm whitespace-nowrap">
                                📸 Icon
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const newFeatures = [...formData.features]
                                      const featureObj = typeof feature === 'string' ? {text: feature} : feature
                                      newFeatures[index] = {...featureObj, imageFile: file}
                                      setFormData({ ...formData, features: newFeatures })
                                    }
                                  }}
                                />
                              </label>
                              
                              {/* Preview */}
                              {featureImageFile && (
                                <img 
                                  src={URL.createObjectURL(featureImageFile)} 
                                  alt="Icon" 
                                  className="w-10 h-10 rounded object-cover border-2 border-green-500"
                                  title="New photo"
                                />
                              )}
                              {featureImageUrl && !featureImageFile && (
                                <img 
                                  src={`https://drive.google.com/thumbnail?id=${featureImageUrl}&sz=w100`}
                                  alt="Icon" 
                                  className="w-10 h-10 rounded object-cover border-2 border-blue-500"
                                  title="Existing photo"
                                />
                              )}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = formData.features.filter((_, i) => i !== index)
                                setFormData({ ...formData, features: newFeatures })
                              }}
                              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                      className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                    >
                      + Tambah Feature
                    </button>
                    <p className="mt-2 text-xs text-gray-600">
                      💡 Features adalah spesifikasi teknis, komposisi, ukuran, dll. Upload icon untuk visual lebih menarik!
                    </p>
                  </div>
                </div>

                {/* Phase 4: Urgency Settings */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span>Urgency & Scarcity Settings</span>
                  </h3>

                  {/* Countdown Timer */}
                  <div className="mb-6">
                    <label className="flex items-center cursor-pointer mb-3">
                      <input
                        type="checkbox"
                        checked={formData.hasCountdown}
                        onChange={(e) => setFormData({ ...formData, hasCountdown: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-3">
                        <span className="text-base font-bold text-gray-900">⏰ Enable Countdown Timer</span>
                        <span className="block text-sm text-gray-600 mt-1">
                          Tampilkan hitung mundur untuk meningkatkan urgency
                        </span>
                      </span>
                    </label>

                    {formData.hasCountdown && (
                      <div className="ml-8 mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Countdown Berakhir Pada
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.countdownEnd}
                          onChange={(e) => setFormData({ ...formData, countdownEnd: e.target.value })}
                          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          ⏳ Timer akan berhenti saat waktu tercapai
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Limited Stock */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📦 Limited Stock (Stok Terbatas)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.limitedStock}
                      onChange={(e) => setFormData({ ...formData, limitedStock: e.target.value })}
                      className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Contoh: 15"
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      💡 Tampilkan "Stok tinggal X pcs!" untuk menciptakan scarcity
                    </p>
                  </div>

                  {/* Urgency Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚠️ Urgency Text (Pesan Mendesak)
                    </label>
                    <input
                      type="text"
                      value={formData.urgencyText}
                      onChange={(e) => setFormData({ ...formData, urgencyText: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="PROMO BERAKHIR HARI INI! BURUAN SEBELUM KEHABISAN!"
                    />
                    <p className="mt-1 text-xs text-gray-600">
                      💡 Pesan yang mendorong pembeli untuk segera action
                    </p>
                  </div>

                  {/* CTA Customization */}
                  <div className="border-t border-orange-200 pt-6">
                    <h4 className="font-bold text-gray-900 mb-4">🎯 CTA Button Customization</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CTA Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.ctaText}
                          onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="BELI SEKARANG! / PESAN VIA WHATSAPP"
                        />
                      </div>

                      {/* CTA Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Color
                        </label>
                        <select
                          value={formData.ctaColor}
                          onChange={(e) => setFormData({ ...formData, ctaColor: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Default (sesuai template)</option>
                          <option value="red">🔴 Red (Urgency)</option>
                          <option value="green">🟢 Green (Trust)</option>
                          <option value="yellow">🟡 Yellow (Energy)</option>
                          <option value="blue">🔵 Blue (Professional)</option>
                          <option value="orange">🟠 Orange (Action)</option>
                        </select>
                      </div>
                    </div>

                    {/* CTA Preview */}
                    {formData.ctaText && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Preview:</p>
                        <button 
                          type="button"
                          className={`px-6 py-3 rounded-lg font-bold text-white shadow-lg ${
                            formData.ctaColor === 'red' ? 'bg-red-600' :
                            formData.ctaColor === 'green' ? 'bg-green-600' :
                            formData.ctaColor === 'yellow' ? 'bg-yellow-500 text-black' :
                            formData.ctaColor === 'blue' ? 'bg-blue-600' :
                            formData.ctaColor === 'orange' ? 'bg-orange-600' :
                            'bg-purple-600'
                          }`}
                        >
                          {formData.ctaText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phase 5: Social Proof & Trust Builders */}
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span>Social Proof & Trust Builders</span>
                  </h3>

                  {/* Testimonials */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      💬 Testimonials (Testimoni Pelanggan)
                    </label>
                    <div className="space-y-4">
                      {formData.testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border-2 border-teal-200">
                          {/* Photo Upload */}
                          <div className="flex items-center gap-4 mb-4 pb-3 border-b border-teal-100">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                Foto Testimoni (Avatar)
                              </label>
                              <label className="cursor-pointer bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded border border-teal-300 inline-block text-sm">
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
                                title="New photo"
                              />
                            )}
                            {testimonial.photoUrl && !testimonial.photoFile && (
                              <img 
                                src={`https://drive.google.com/thumbnail?id=${testimonial.photoUrl}&sz=w200`}
                                alt={testimonial.name} 
                                className="w-16 h-16 rounded-full object-cover border-4 border-teal-500"
                                title="Existing photo"
                              />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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
                              placeholder="Profesi/Role (opsional)"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="text-xs text-gray-600 mb-1 block">Rating (1-5):</label>
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
                              <option value={2}>⭐⭐ (2 bintang)</option>
                              <option value={1}>⭐ (1 bintang)</option>
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="Testimoni lengkap..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newTestimonials = formData.testimonials.filter((_, i) => i !== index)
                              setFormData({ ...formData, testimonials: newTestimonials })
                            }}
                            className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                          >
                            Hapus Testimoni
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        testimonials: [...formData.testimonials, {name: '', rating: 5, text: '', role: ''}] 
                      })}
                      className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm transition-colors"
                    >
                      + Tambah Testimoni
                    </button>
                    <p className="mt-2 text-xs text-gray-600">
                      💡 Testimoni real dari pelanggan meningkatkan trust hingga 70%!
                    </p>
                  </div>

                  {/* Bonuses */}
                  <div className="mb-6 border-t border-teal-200 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      🎁 Bonuses (Bonus Gratis)
                    </label>
                    <div className="space-y-4">
                      {formData.bonuses.map((bonus, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border-2 border-teal-200">
                          {/* Image Upload */}
                          <div className="flex items-center gap-4 mb-4 pb-3 border-b border-teal-100">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-2">
                                Gambar Bonus
                              </label>
                              <label className="cursor-pointer bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded border border-teal-300 inline-block text-sm">
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
                                title="New image"
                              />
                            )}
                            {bonus.imageUrl && !bonus.imageFile && (
                              <img 
                                src={`https://drive.google.com/thumbnail?id=${bonus.imageUrl}&sz=w200`}
                                alt={bonus.title} 
                                className="w-20 h-20 rounded-lg object-cover border-2 border-teal-500"
                                title="Existing image"
                              />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <input
                              type="text"
                              value={bonus.title}
                              onChange={(e) => {
                                const newBonuses = [...formData.bonuses]
                                newBonuses[index].title = e.target.value
                                setFormData({ ...formData, bonuses: newBonuses })
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                              placeholder="Judul bonus"
                            />
                            <input
                              type="text"
                              value={bonus.value}
                              onChange={(e) => {
                                const newBonuses = [...formData.bonuses]
                                newBonuses[index].value = e.target.value
                                setFormData({ ...formData, bonuses: newBonuses })
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                              placeholder="Nilai (Senilai Rp 500,000)"
                            />
                          </div>
                          <textarea
                            value={bonus.description}
                            onChange={(e) => {
                              const newBonuses = [...formData.bonuses]
                              newBonuses[index].description = e.target.value
                              setFormData({ ...formData, bonuses: newBonuses })
                            }}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="Deskripsi bonus..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newBonuses = formData.bonuses.filter((_, i) => i !== index)
                              setFormData({ ...formData, bonuses: newBonuses })
                            }}
                            className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                          >
                            Hapus Bonus
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        bonuses: [...formData.bonuses, {title: '', description: '', value: ''}] 
                      })}
                      className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm transition-colors"
                    >
                      + Tambah Bonus
                    </button>
                    <p className="mt-2 text-xs text-gray-600">
                      💡 Bonus gratis meningkatkan perceived value & conversion rate!
                    </p>
                  </div>

                  {/* FAQs */}
                  <div className="mb-6 border-t border-teal-200 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ❓ FAQs (Frequently Asked Questions)
                    </label>
                    <div className="space-y-4">
                      {formData.faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border-2 border-teal-200">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...formData.faqs]
                              newFaqs[index].question = e.target.value
                              setFormData({ ...formData, faqs: newFaqs })
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 mb-3 font-semibold"
                            placeholder="Pertanyaan..."
                          />
                          <textarea
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...formData.faqs]
                              newFaqs[index].answer = e.target.value
                              setFormData({ ...formData, faqs: newFaqs })
                            }}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                            placeholder="Jawaban lengkap..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFaqs = formData.faqs.filter((_, i) => i !== index)
                              setFormData({ ...formData, faqs: newFaqs })
                            }}
                            className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                          >
                            Hapus FAQ
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        faqs: [...formData.faqs, {question: '', answer: ''}] 
                      })}
                      className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm transition-colors"
                    >
                      + Tambah FAQ
                    </button>
                    <p className="mt-2 text-xs text-gray-600">
                      💡 FAQs mengurangi keraguan & meningkatkan konversi
                    </p>
                  </div>

                  {/* Guarantee & Social Proof Text */}
                  <div className="border-t border-teal-200 pt-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        🛡️ Guarantee Text (Garansi)
                      </label>
                      <textarea
                        value={formData.guarantee}
                        onChange={(e) => setFormData({ ...formData, guarantee: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Contoh: Garansi 100% uang kembali dalam 30 hari jika tidak puas. No questions asked!"
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        💡 Garansi yang kuat menghilangkan risk dan meningkatkan trust
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📊 Social Proof Text
                      </label>
                      <input
                        type="text"
                        value={formData.socialProof}
                        onChange={(e) => setFormData({ ...formData, socialProof: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Contoh: Dipercaya 10,000+ pelanggan di Indonesia | 4.9/5 rating"
                      />
                      <p className="mt-1 text-xs text-gray-600">
                        💡 Tampilkan angka konkret untuk membangun kredibilitas
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">💡 Tips Conversion Page:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✅ Headline harus spesifik & menjanjikan hasil</li>
                    <li>✅ Gunakan kata-kata yang memicu emosi (RAHASIA, TERBUKTI, MUDAH)</li>
                    <li>✅ Tambahkan social proof di subheadline (10,000+ pelanggan)</li>
                    <li>✅ Benefits fokus pada transformasi, Features pada detail teknis</li>
                    <li>✅ Countdown + Limited stock = FOMO yang kuat!</li>
                    <li>✅ Testimonials + Guarantee = Trust yang solid!</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving || uploading} className="flex-1">
            {uploading ? 'Uploading foto...' : saving ? 'Menyimpan...' : 'Update Produk'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving || uploading}>
            Batal
          </Button>
        </div>

        {newImages.length > 0 && (
          <p className="text-sm text-gray-600">
            💡 {newImages.length} foto baru akan diupload ke Google Drive
          </p>
        )}
        {deletedImages.length > 0 && (
          <p className="text-sm text-red-600">
            🗑️ {deletedImages.length} foto akan dihapus
          </p>
        )}
      </form>
    </div>
  )
}
