'use client'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  discountPercent: number | null
  discountValidUntil: Date | null
  images: string[]
  videoUrl: string | null
  headline: string | null
  subheadline: string | null
  stock: number | null
  limitedStock: number | null
  // Phase 3
  benefits: string[]
  features: string[]
  // Phase 4
  hasCountdown: boolean
  countdownEnd: Date | null
  urgencyText: string | null
  ctaText: string | null
  ctaColor: string | null
  // Phase 5
  testimonials: Array<{name: string, rating: number, text: string, role: string}>
  bonuses: Array<{title: string, description: string, value: string}>
  faqs: Array<{question: string, answer: string}>
  guarantee: string | null
  socialProof: string | null
}

interface Store {
  name: string
  whatsappNumber: string
  logoUrl: string | null
}

interface BlueProfessionalTemplateProps {
  product: Product
  store: Store
}

export default function BlueProfessionalTemplate({ product, store }: BlueProfessionalTemplateProps) {
  const handleOrder = () => {
    const message = `Halo *${store.name}*!\n\n` +
      `Saya tertarik dengan:\n\n` +
      `*Produk:* ${product.name}\n` +
      `*Harga:* Rp ${product.price.toLocaleString('id-ID')}\n\n` +
      `Apakah masih tersedia?`
    
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const savingsAmount = product.originalPrice 
    ? product.originalPrice - product.price 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleOrder}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110"
        aria-label="Order via WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Professional Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 border border-white border-opacity-30">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              💼 PROFESSIONAL QUALITY
            </div>
          </div>

          {/* Social Proof */}
          {product.socialProof && (
            <p className="text-center text-blue-100 mb-6 text-sm">
              {product.socialProof}
            </p>
          )}

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-black text-center mb-6 leading-tight">
            {product.headline || product.name}
          </h1>

          {/* Subheadline */}
          {product.subheadline && (
            <p className="text-lg md:text-xl text-center mb-8 max-w-3xl mx-auto opacity-95">
              {product.subheadline}
            </p>
          )}

          {/* Price Box */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-xl mx-auto shadow-2xl">
            {product.originalPrice && product.discountPercent && (
              <div className="text-center mb-4">
                <div className="text-gray-500 text-xl line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </div>
                <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-lg mt-2">
                  HEMAT {product.discountPercent}%
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-1">Harga Terbaik:</div>
              <div className="text-5xl font-black text-blue-600">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              {savingsAmount > 0 && (
                <div className="text-sm text-blue-700 font-bold mt-2">
                  💰 Hemat Rp {savingsAmount.toLocaleString('id-ID')}
                </div>
              )}
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xl py-5 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              {product.ctaText || '💬 PESAN SEKARANG'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Images */}
      {product.images.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
            📸 GALERI PRODUK
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {product.images.slice(0, 6).map((imageId, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-blue-200">
                <img
                  src={`https://drive.google.com/thumbnail?id=${imageId}&sz=w800`}
                  alt={`${product.name} - Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://lh3.googleusercontent.com/d/${imageId}=w800`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 {store.name}. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Professional & Trusted
          </p>
        </div>
      </div>
    </div>
  )
}
