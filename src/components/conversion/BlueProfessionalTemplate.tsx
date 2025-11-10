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
  benefits: Array<{text: string, imageUrl?: string}>
  features: Array<{text: string, imageUrl?: string}>
  // Phase 4
  hasCountdown: boolean
  countdownEnd: Date | null
  urgencyText: string | null
  ctaText: string | null
  ctaColor: string | null
  // Phase 5
  testimonials: Array<{name: string, rating: number, text: string, role: string, photoUrl?: string}>
  bonuses: Array<{title: string, description: string, value: string, imageUrl?: string}>
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

      {/* Video */}
      {product.videoUrl && (
        <div className="bg-blue-900 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-white text-center mb-8">
              🎥 VIDEO PRODUK
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-400">
              <iframe
                src={product.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              📝 DETAIL PRODUK
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              {product.description}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {product.benefits && product.benefits.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
              ✨ KEUNGGULAN PRODUK
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  {benefit.imageUrl ? (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                      <img src={`https://drive.google.com/thumbnail?id=${benefit.imageUrl}&sz=w100`} alt={benefit.text} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-blue-600 text-2xl flex-shrink-0 font-bold">✓</span>
                  )}
                  <p className="text-gray-800 font-medium flex-1">{typeof benefit === 'string' ? benefit : benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
              ⚙️ SPESIFIKASI TEKNIS
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {typeof feature === 'object' && feature.imageUrl ? (
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                        <img src={`https://drive.google.com/thumbnail?id=${feature.imageUrl}&sz=w80`} alt={feature.text} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <span className="text-blue-600 font-black text-lg">•</span>
                    )}
                    <span className="text-gray-700">{typeof feature === 'string' ? feature : feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      {product.testimonials && product.testimonials.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
              💼 TESTIMONI PROFESIONAL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    {testimonial.photoUrl ? (
                      <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200">
                        <img src={`https://drive.google.com/thumbnail?id=${testimonial.photoUrl}&sz=w100`} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  {testimonial.role && (
                    <p className="text-sm text-gray-600 border-t pt-3">{testimonial.role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bonuses Section */}
      {product.bonuses && product.bonuses.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-white mb-8">
              🎁 BONUS EKSKLUSIF
            </h2>
            <div className="space-y-4">
              {product.bonuses.map((bonus, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-xl border-l-4 border-blue-600">
                  <div className="flex items-start gap-4">
                    {bonus.imageUrl && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-300">
                        <img src={`https://drive.google.com/thumbnail?id=${bonus.imageUrl}&sz=w200`} alt={bonus.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">🎁 {bonus.title}</h3>
                          <p className="text-gray-700">{bonus.description}</p>
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap self-start">
                          {bonus.value}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guarantee Section */}
      {product.guarantee && (
        <div className="bg-blue-600 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">
                GARANSI PROFESIONAL
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.guarantee}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
            ❓ PERTANYAAN UMUM
          </h2>
          <div className="space-y-4">
            {product.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Q: {faq.question}
                </h3>
                <p className="text-gray-700 pl-4 border-l-2 border-gray-300">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            HUBUNGI KAMI SEKARANG
          </h2>
          <p className="text-xl text-white mb-8 opacity-95">
            Solusi Profesional untuk Kebutuhan Anda
          </p>
          <button
            onClick={handleOrder}
            className={`px-12 py-5 text-xl font-black rounded-xl shadow-2xl transition-all transform hover:scale-105 ${
              product.ctaColor === 'red' ? 'bg-red-600 hover:bg-red-700' :
              product.ctaColor === 'green' ? 'bg-green-600 hover:bg-green-700' :
              product.ctaColor === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
              product.ctaColor === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
              'bg-white hover:bg-gray-100 text-blue-600'
            } text-white`}
          >
            {product.ctaText || '💬 PESAN SEKARANG'}
          </button>
        </div>
      </div>

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
