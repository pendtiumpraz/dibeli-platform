'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'

/**
 * Sunset Glow Template (PREMIUM Tier)
 * Warm orange sunset theme for cozy brands
 */
export default function SunsetGlowTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Sunset Navbar */}
      <nav className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full object-cover ring-4 ring-orange-300/50" />
              ) : (
                <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-orange-300/50 shadow-lg">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-md">
                  {store.name}
                </h1>
                {store.tagline && (
                  <p className="text-sm text-orange-100">{store.tagline}</p>
                )}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-orange-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Chat Sekarang
            </a>
          </div>
        </div>
      </nav>

      {/* Sunset Hero */}
      <header className="relative bg-gradient-to-b from-orange-400 via-amber-400 to-yellow-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-32 h-32 bg-white rounded-full blur-3xl"/>
          <div className="absolute bottom-10 left-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl"/>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {store.name}
          </h2>
          {store.description && (
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow">
              {store.description}
            </p>
          )}
          <div className="flex justify-center gap-8">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/30">
              <div className="text-4xl font-bold">{products.length}</div>
              <div className="text-sm">Produk</div>
            </div>
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🌅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Produk</h3>
            <p className="text-gray-600">Produk segera hadir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🌅
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-xl bg-red-500 px-6 py-2 rounded-full">
                        Habis
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="text-2xl font-bold text-orange-600 mb-4">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>

                  <button
                    onClick={() => handleWhatsAppOrder(product.name, product.price)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
                  >
                    Pesan via WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter 
        store={store}
        bgColor="bg-gradient-to-r from-orange-600 to-amber-600"
        textColor="text-orange-100"
        accentColor="text-white"
      />
    </div>
  )
}
