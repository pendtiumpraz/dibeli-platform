'use client'

import Image from 'next/image'
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
}

interface Store {
  name: string
  whatsappNumber: string
  logoUrl: string | null
}

interface RedUrgencyTemplateProps {
  product: Product
  store: Store
}

export default function RedUrgencyTemplate({ product, store }: RedUrgencyTemplateProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleOrder}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all hover:scale-110 animate-bounce"
        aria-label="Order via WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-20">
          {/* Urgency Badge */}
          {product.discountValidUntil && (
            <div className="mb-6 flex justify-center">
              <div className="bg-yellow-400 text-red-900 px-6 py-3 rounded-full font-black text-sm md:text-base uppercase tracking-wider shadow-lg animate-pulse">
                ⚠️ PROMO TERBATAS! SEGERA BERAKHIR!
              </div>
            </div>
          )}

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-6 leading-tight drop-shadow-lg">
            {product.headline || product.name}
          </h1>

          {/* Subheadline */}
          {product.subheadline && (
            <p className="text-lg md:text-xl text-center mb-8 max-w-3xl mx-auto leading-relaxed opacity-95">
              {product.subheadline}
            </p>
          )}

          {/* Countdown Timer */}
          {product.discountValidUntil && (
            <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 max-w-xl mx-auto mb-8">
              <p className="text-center text-yellow-300 font-bold mb-3 text-sm md:text-base">
                ⏰ PROMO BERAKHIR DALAM:
              </p>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="bg-white text-red-600 rounded-lg px-4 py-3 min-w-[70px]">
                    <div className="text-3xl md:text-4xl font-black">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-xs mt-1 font-semibold">JAM</div>
                </div>
                <div className="text-3xl md:text-4xl font-black self-center">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 rounded-lg px-4 py-3 min-w-[70px]">
                    <div className="text-3xl md:text-4xl font-black">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-xs mt-1 font-semibold">MENIT</div>
                </div>
                <div className="text-3xl md:text-4xl font-black self-center">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 rounded-lg px-4 py-3 min-w-[70px]">
                    <div className="text-3xl md:text-4xl font-black">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-xs mt-1 font-semibold">DETIK</div>
                </div>
              </div>
            </div>
          )}

          {/* Price Box */}
          <div className="bg-white text-gray-900 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-2xl">
            {product.originalPrice && product.discountPercent && (
              <div className="text-center mb-4">
                <div className="text-gray-500 text-lg md:text-xl line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </div>
                <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full font-black text-lg mt-2">
                  HEMAT {product.discountPercent}%!
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-1">Harga Spesial:</div>
              <div className="text-4xl md:text-5xl font-black text-green-600">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              {savingsAmount > 0 && (
                <div className="text-sm text-red-600 font-bold mt-2">
                  💰 Hemat Rp {savingsAmount.toLocaleString('id-ID')}!
                </div>
              )}
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-xl py-5 rounded-xl shadow-lg transition-all transform hover:scale-105 uppercase"
            >
              🛒 BELI SEKARANG!
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>✅ Pembayaran Aman</span>
              <span>✅ Garansi Uang Kembali</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Images */}
      {product.images.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.images.slice(0, 6).map((imageId, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={`https://drive.google.com/thumbnail?id=${imageId}&sz=w800`}
                  alt={`${product.name} - Foto ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
        <div className="bg-gray-900 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-black text-white text-center mb-8">
              🎥 LIHAT VIDEO PRODUK
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
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
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              📝 DETAIL PRODUK
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              {product.description}
            </div>
          </div>
        </div>
      )}

      {/* Stock Warning */}
      {product.limitedStock && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-yellow-100 border-2 border-yellow-500 rounded-2xl p-6 text-center">
            <p className="text-2xl font-black text-yellow-900 mb-2">
              ⚠️ STOK TERBATAS!
            </p>
            <p className="text-lg font-bold text-yellow-800">
              Tersisa hanya <span className="text-3xl text-red-600">{product.limitedStock}</span> pcs!
            </p>
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            JANGAN SAMPAI MENYESAL!
          </h2>
          <p className="text-xl text-white mb-8 opacity-95">
            Promo ini tidak akan berlangsung selamanya. Pesan sekarang sebelum terlambat!
          </p>
          <button
            onClick={handleOrder}
            className="bg-white text-red-600 font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 uppercase"
          >
            🛒 BELI SEKARANG!
          </button>
          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6 text-white text-sm">
            <span>✅ Gratis Ongkir Seluruh Indonesia</span>
            <span>✅ Garansi 100% Uang Kembali</span>
            <span>✅ Customer Service 24/7</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 {store.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
