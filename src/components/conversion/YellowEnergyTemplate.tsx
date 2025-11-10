'use client'

import { useState, useEffect } from 'react'

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

interface YellowEnergyTemplateProps {
  product: Product
  store: Store
}

export default function YellowEnergyTemplate({ product, store }: YellowEnergyTemplateProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  
  useEffect(() => {
    if (!product.discountValidUntil) return

    const calculateTimeLeft = () => {
      const difference = +new Date(product.discountValidUntil!) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [product.discountValidUntil])

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
    <div className="min-h-screen bg-black text-white">
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleOrder}
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full p-4 shadow-2xl transition-all hover:scale-110"
        aria-label="Order via WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 opacity-90"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* Flash Sale Badge */}
          {product.discountValidUntil && (
            <div className="flex justify-center mb-6">
              <div className="bg-black text-yellow-400 px-8 py-4 rounded-lg font-black text-lg uppercase tracking-widest border-4 border-yellow-400 shadow-2xl animate-pulse">
                ⚡ FLASH SALE ⚡
              </div>
            </div>
          )}

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-black text-center mb-6 leading-tight text-yellow-400 drop-shadow-2xl" style={{textShadow: '0 0 30px rgba(0,0,0,0.8), 4px 4px 0 rgba(0,0,0,1)'}}>
            {product.headline || product.name}
          </h1>

          {/* Subheadline */}
          {product.subheadline && (
            <p className="text-xl md:text-2xl text-center mb-8 max-w-3xl mx-auto font-bold text-white drop-shadow-lg">
              {product.subheadline}
            </p>
          )}

          {/* Countdown */}
          {product.discountValidUntil && (
            <div className="bg-black rounded-2xl p-6 max-w-xl mx-auto mb-8 border-4 border-yellow-400">
              <p className="text-center text-yellow-400 font-black mb-4 text-xl uppercase tracking-wider">
                ⏰ BERAKHIR DALAM:
              </p>
              <div className="flex justify-center gap-3">
                <div className="text-center">
                  <div className="bg-yellow-400 text-black rounded-xl px-5 py-4 min-w-[80px] border-4 border-yellow-300">
                    <div className="text-4xl font-black">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-sm mt-2 font-bold text-yellow-400">JAM</div>
                </div>
                <div className="text-4xl font-black self-center text-yellow-400">:</div>
                <div className="text-center">
                  <div className="bg-yellow-400 text-black rounded-xl px-5 py-4 min-w-[80px] border-4 border-yellow-300">
                    <div className="text-4xl font-black">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-sm mt-2 font-bold text-yellow-400">MENIT</div>
                </div>
                <div className="text-4xl font-black self-center text-yellow-400">:</div>
                <div className="text-center">
                  <div className="bg-yellow-400 text-black rounded-xl px-5 py-4 min-w-[80px] border-4 border-yellow-300">
                    <div className="text-4xl font-black">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-sm mt-2 font-bold text-yellow-400">DETIK</div>
                </div>
              </div>
            </div>
          )}

          {/* Price + CTA */}
          <div className="bg-black rounded-2xl p-8 max-w-xl mx-auto shadow-2xl border-4 border-yellow-400">
            {product.originalPrice && product.discountPercent && (
              <div className="text-center mb-4">
                <div className="text-white text-2xl line-through opacity-50">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </div>
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full font-black text-xl mt-3 border-2 border-yellow-300">
                  💥 DISKON {product.discountPercent}% 💥
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-6xl font-black text-yellow-400 mb-2" style={{textShadow: '0 0 20px rgba(250, 204, 21, 0.5)'}}>
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              {savingsAmount > 0 && (
                <div className="text-lg text-yellow-300 font-bold">
                  🎉 HEMAT Rp {savingsAmount.toLocaleString('id-ID')}!
                </div>
              )}
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-2xl py-6 rounded-xl shadow-2xl transition-all transform hover:scale-105 uppercase border-4 border-yellow-300"
            >
              ⚡ BELI SEKARANG! ⚡
            </button>
            
            <p className="mt-4 text-center text-yellow-400 text-sm font-bold">
              🚀 CEPAT! Sebelum Kehabisan!
            </p>
          </div>
        </div>
      </div>

      {/* Product Images */}
      {product.images.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-black mb-8" style={{textShadow: '3px 3px 0 #fbbf24'}}>
              ⚡ FOTO PRODUK ASLI
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {product.images.slice(0, 6).map((imageId, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-400 transform hover:scale-105 transition-transform">
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
        </div>
      )}

      {/* Video */}
      {product.videoUrl && (
        <div className="bg-black py-12 border-y-4 border-yellow-400">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-yellow-400 text-center mb-8" style={{textShadow: '0 0 20px rgba(250, 204, 21, 0.5)'}}>
              🎥 LIHAT AKSI PRODUK!
            </h2>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-400">
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
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-yellow-50 rounded-2xl p-8 shadow-lg border-4 border-yellow-400">
              <h2 className="text-3xl font-black text-black mb-6" style={{textShadow: '2px 2px 0 #fbbf24'}}>
                ⚡ DETAIL PRODUK
              </h2>
              <div className="prose prose-lg max-w-none text-gray-900 font-semibold">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      {product.benefits && product.benefits.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-black mb-8" style={{textShadow: '3px 3px 0 #fbbf24'}}>
              ⚡ MANFAAT LUAR BIASA!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-lg border-l-4 border-yellow-500">
                  <span className="text-yellow-600 text-2xl flex-shrink-0 font-bold">⚡</span>
                  <p className="text-gray-800 font-bold">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <div className="bg-black py-12 border-y-4 border-yellow-400">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-yellow-400 mb-8" style={{textShadow: '0 0 20px rgba(250, 204, 21, 0.5)'}}>
              🔥 SPESIFIKASI DAHSYAT
            </h2>
            <div className="bg-yellow-400 rounded-xl p-6 shadow-2xl">
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-black font-black text-xl">⚡</span>
                    <span className="text-black font-bold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      {product.testimonials && product.testimonials.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-black mb-8" style={{textShadow: '3px 3px 0 #fbbf24'}}>
              💥 BUKTI NYATA DARI PEMBELI!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-yellow-50 p-6 rounded-xl shadow-xl border-4 border-yellow-400">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < testimonial.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-800 mb-4 italic font-bold">"{testimonial.text}"</p>
                  <div className="border-t-2 border-yellow-400 pt-3">
                    <p className="font-black text-gray-900">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-sm text-gray-700 font-semibold">{testimonial.role}</p>
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
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-white mb-8" style={{textShadow: '3px 3px 0 rgba(0,0,0,0.5)'}}>
              🎁 BONUS GILA-GILAAN!
            </h2>
            <div className="space-y-4">
              {product.bonuses.map((bonus, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-2xl border-4 border-yellow-400">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-black mb-2">
                        🔥 {bonus.title}
                      </h3>
                      <p className="text-gray-700 font-bold">{bonus.description}</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-black text-lg shadow-lg">
                      {bonus.value}
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
        <div className="bg-black py-12 border-y-4 border-yellow-400">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-yellow-400 rounded-2xl p-8 text-center shadow-2xl border-4 border-white">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-4xl font-black text-black mb-4">
                GARANSI KAMI!
              </h2>
              <p className="text-xl text-black font-bold leading-relaxed">
                {product.guarantee}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center text-black mb-8" style={{textShadow: '3px 3px 0 #fbbf24'}}>
              ❓ TANYA JAWAB PENTING!
            </h2>
            <div className="space-y-4">
              {product.faqs.map((faq, index) => (
                <div key={index} className="bg-yellow-50 rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    Q: {faq.question}
                  </h3>
                  <p className="text-gray-700 pl-4 border-l-2 border-yellow-400 font-semibold">
                    A: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Warning */}
      {product.limitedStock && (
        <div className="bg-black py-8 border-y-4 border-yellow-400">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-center border-4 border-yellow-300 shadow-2xl">
              <p className="text-3xl font-black text-black mb-3 uppercase">
                ⚠️ BURUAN! STOK TINGGAL SEDIKIT! ⚠️
              </p>
              <p className="text-2xl font-black text-black">
                Hanya tersisa <span className="text-5xl text-red-600">{product.limitedStock}</span> pcs!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border-4 border-yellow-400">
            <h2 className="text-4xl md:text-6xl font-black text-yellow-400 mb-6 uppercase" style={{textShadow: '0 0 30px rgba(0,0,0,0.8), 3px 3px 0 rgba(0,0,0,1)'}}>
              ⚡ ACTION NOW! ⚡
            </h2>
            <p className="text-xl md:text-2xl text-white mb-8 font-bold">
              Jangan tunda lagi! Ambil kesempatan emas ini SEKARANG!
            </p>

            {product.originalPrice && product.discountPercent && (
              <div className="bg-black rounded-xl p-6 mb-8 border-4 border-yellow-400">
                <div className="text-yellow-400 text-2xl line-through opacity-75 mb-2">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </div>
                <div className="text-6xl font-black text-yellow-400 mb-3" style={{textShadow: '0 0 20px rgba(250, 204, 21, 0.5)'}}>
                  Rp {product.price.toLocaleString('id-ID')}
                </div>
                <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full font-black text-xl">
                  🔥 SUPER HEMAT Rp {savingsAmount.toLocaleString('id-ID')}!
                </div>
              </div>
            )}

            <button
              onClick={handleOrder}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-black text-3xl px-16 py-8 rounded-full shadow-2xl transition-all transform hover:scale-110 uppercase border-4 border-yellow-300"
            >
              ⚡ BELI SEKARANG! ⚡
            </button>
            
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-yellow-400 text-sm font-bold">
              <span>⚡ Fast Response</span>
              <span>⚡ Pengiriman Kilat</span>
              <span>⚡ Garansi Puas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-8 border-t-4 border-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-yellow-400 font-bold">
            © 2024 {store.name}. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            ⚡ Powered by Energy & Passion
          </p>
        </div>
      </div>
    </div>
  )
}
