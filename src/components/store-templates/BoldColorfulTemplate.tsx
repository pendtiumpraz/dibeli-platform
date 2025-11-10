'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'

/**
 * Bold & Colorful Template (PREMIUM Tier)
 * Vibrant, energetic design with bold colors and dynamic layout
 */
export default function BoldColorfulTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Bold Navbar */}
      <nav className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-14 w-14 rounded-full object-cover ring-4 ring-white/30" />
              ) : (
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center text-orange-600 font-black text-2xl ring-4 ring-white/30">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-white drop-shadow-lg">{store.name}</h1>
                {store.tagline && (
                  <p className="text-sm text-white/90 font-medium">{store.tagline}</p>
                )}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-yellow-50 text-orange-600 px-6 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="hidden md:inline">Chat Now!</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Bold Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-6 shadow-lg">
              🔥 HOT DEALS INSIDE!
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Amazing Products
              </span>
              <br />
              <span className="text-gray-900">Just For You!</span>
            </h2>
            {store.description && (
              <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
                {store.description}
              </p>
            )}
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-white rounded-2xl px-8 py-4 shadow-lg">
                <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {products.length}+
                </div>
                <div className="text-sm text-gray-600 font-semibold">Products</div>
              </div>
              {store.rating && store.rating > 0 && (
                <div className="bg-white rounded-2xl px-8 py-4 shadow-lg">
                  <div className="text-3xl font-black text-yellow-500 flex items-center justify-center gap-1">
                    ★ {store.rating.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Rating</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl p-16 inline-block shadow-2xl">
              <div className="text-8xl mb-4">🎁</div>
              <p className="text-2xl font-bold text-gray-900 mb-3">Coming Soon!</p>
              <p className="text-gray-600">Exciting products on the way!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              // Alternate gradient colors for fun effect
              const gradients = [
                'from-orange-500 to-red-500',
                'from-pink-500 to-purple-500',
                'from-yellow-500 to-orange-500',
                'from-red-500 to-pink-500',
              ]
              const gradient = gradients[index % gradients.length]

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {product.images.length > 0 ? (
                      <img
                        src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w500`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w500`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {product.isNew && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-2 rounded-full font-bold shadow-lg animate-bounce">
                        ✨ NEW
                      </span>
                    )}
                    {product.discountPercent && product.discountPercent > 0 && (
                      <span className={`absolute top-3 left-3 bg-gradient-to-r ${gradient} text-white text-sm px-4 py-2 rounded-full font-black shadow-lg`}>
                        🔥 -{product.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-black text-gray-900 text-base mb-2 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <div className="mb-4">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-gray-400 line-through mb-1">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className={`text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    {product.hasConversionPage && product.conversionPageSlug ? (
                      <Link
                        href={`/p/${product.conversionPageSlug}`}
                        className={`block w-full bg-gradient-to-r ${gradient} hover:shadow-xl text-white text-center py-3 rounded-xl font-bold transition-all transform hover:scale-105`}
                      >
                        Lihat Detail 🚀
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleWhatsAppOrder(product.name, product.price)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:shadow-xl text-white py-3 rounded-xl font-bold transition-all transform hover:scale-105"
                      >
                        Pesan Sekarang! 💬
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Universal Footer with Maps & Complete Store Data */}
      <StoreFooter 
        store={store}
        bgColor="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
        textColor="text-gray-300"
        accentColor="text-white"
      />
    </div>
  )
}
