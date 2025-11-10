'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function CreateProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
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
    benefits: [] as string[],
    features: [] as string[],
    // Phase 4: Urgency Settings
    hasCountdown: false,
    countdownEnd: '',
    limitedStock: '',
    urgencyText: '',
    ctaText: '',
    ctaColor: '',
    // Phase 5: Social Proof & Trust Builders
    testimonials: [] as Array<{name: string, rating: number, text: string, role: string}>,
    bonuses: [] as Array<{title: string, description: string, value: string}>,
    faqs: [] as Array<{question: string, answer: string}>,
    guarantee: '',
    socialProof: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)

    // Create previews
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

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
        formDataToSend.append('benefits', JSON.stringify(formData.benefits.filter(b => b.trim())))
      }
      if (formData.features.length > 0) {
        formDataToSend.append('features', JSON.stringify(formData.features.filter(f => f.trim())))
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

      // Add images
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const res = await fetch('/api/products/create', {
        method: 'POST',
        body: formDataToSend,
      })

      if (res.ok) {
        alert('✅ Produk berhasil dibuat!')
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
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tambah Produk</h1>
        <p className="mt-2 text-gray-600">
          Tambahkan produk baru ke toko Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
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
            Deskripsi
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Jelaskan produk Anda..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto Produk
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            📸 Upload foto produk (akan disimpan di Google Drive)
          </p>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = images.filter((_, i) => i !== index)
                      const newPreviews = imagePreviews.filter((_, i) => i !== index)
                      setImages(newImages)
                      setImagePreviews(newPreviews)
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="100000"
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
            Produk tersedia
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? 'Membuat...' : 'Tambah Produk'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
