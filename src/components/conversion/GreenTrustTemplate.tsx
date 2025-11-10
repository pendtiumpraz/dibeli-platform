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

interface GreenTrustTemplateProps {
  product: Product
  store: Store
}

export default function GreenTrustTemplate({ product, store }: GreenTrustTemplateProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleOrder}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110"
        aria-label="Order via WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Trust Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-white text-green-600 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              100% TERPERCAYA & AMAN
            </div>
          </div>

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

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-bold text-lg mb-1">100% Original</h3>
              <p className="text-sm opacity-90">Garansi Keaslian</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-1">Teruji BPOM</h3>
              <p className="text-sm opacity-90">Aman & Terjamin</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-bold text-lg mb-1">Gratis Ongkir</h3>
              <p className="text-sm opacity-90">Ke Seluruh Indonesia</p>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-xl mx-auto shadow-2xl">
            {product.originalPrice && product.discountPercent && (
              <div className="text-center mb-4">
                <div className="text-gray-500 text-xl line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </div>
                <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg mt-2">
                  HEMAT {product.discountPercent}%
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-1">Harga Terbaik:</div>
              <div className="text-5xl font-black text-green-600">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              {savingsAmount > 0 && (
                <div className="text-sm text-green-700 font-bold mt-2">
                  💰 Hemat Rp {savingsAmount.toLocaleString('id-ID')}
                </div>
              )}
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-black text-xl py-5 rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              💬 PESAN SEKARANG VIA WHATSAPP
            </button>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>✅ Pembayaran Aman & Terpercaya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      {product.images.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
            📸 FOTO PRODUK ASLI
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {product.images.slice(0, 6).map((imageId, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-green-200">
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
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-8">
              🎥 VIDEO REVIEW PRODUK
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-green-200">
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
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              📝 INFORMASI LENGKAP
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              {product.description}
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {product.benefits && product.benefits.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
              ✨ MANFAAT YANG ANDA DAPATKAN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                  <span className="text-green-600 text-2xl flex-shrink-0 font-bold">✓</span>
                  <p className="text-gray-800 font-medium">{benefit}</p>
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
              ⚙️ SPESIFIKASI LENGKAP
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 font-black text-lg">•</span>
                    <span className="text-gray-700">{feature}</span>
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
              💬 APA KATA PELANGGAN KAMI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-2 border-green-100">
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
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
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
        </div>
      )}

      {/* Bonuses Section */}
      {product.bonuses && product.bonuses.length > 0 && (
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center text-white mb-8">
              🎁 BONUS EKSKLUSIF UNTUK ANDA!
            </h2>
            <div className="space-y-4">
              {product.bonuses.map((bonus, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-xl border-l-4 border-green-600">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {bonus.title}
                      </h3>
                      <p className="text-gray-700">{bonus.description}</p>
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

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
            ❓ PERTANYAAN YANG SERING DITANYAKAN
          </h2>
          <div className="space-y-4">
            {product.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
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

      {/* Guarantee Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              {product.guarantee ? 'GARANSI KAMI' : 'GARANSI 100% UANG KEMBALI'}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {product.guarantee || 'Kami sangat yakin dengan kualitas produk ini. Jika Anda tidak puas dalam 30 hari, uang Anda akan dikembalikan 100% tanpa pertanyaan!'}
            </p>
            <div className="flex justify-center gap-8 flex-wrap text-sm">
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">30</div>
                <div className="text-gray-600">Hari Garansi</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">100%</div>
                <div className="text-gray-600">Uang Kembali</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">24/7</div>
                <div className="text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            PESAN DENGAN AMAN SEKARANG
          </h2>
          <p className="text-xl text-white mb-8 opacity-95">
            Bergabunglah dengan ribuan pelanggan yang puas di seluruh Indonesia!
          </p>
          
          {product.originalPrice && product.discountPercent && (
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto mb-8">
              <div className="text-white text-lg line-through opacity-75">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </div>
              <div className="text-5xl font-black text-white my-3">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              <div className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full font-black inline-block">
                HEMAT Rp {savingsAmount.toLocaleString('id-ID')}!
              </div>
            </div>
          )}

          <button
            onClick={handleOrder}
            className="bg-white text-green-600 font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
          >
            💬 PESAN SEKARANG
          </button>
          
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-white text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Gratis Ongkir
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Garansi Keaslian
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              30 Hari Return
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 {store.name}. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Terpercaya dan Aman untuk Semua
          </p>
        </div>
      </div>
    </div>
  )
}
