'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import { useState, useEffect } from 'react'

export default function CrystalPalaceTemplate({ store, products }: StoreTemplateProps) {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    window.open(`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden">
      {/* Glass Morphism Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '3s' }}></div>
        {/* Glass texture overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-white/10"></div>
      </div>

      {/* Glass Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-2xl shadow-indigo-200/50 border-b-2 border-indigo-200' : 'bg-white/60 backdrop-blur-xl border-b border-blue-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-50"></div>
                  <img src={store.logoUrl} alt={store.name} className="relative h-14 w-14 rounded-full object-cover ring-4 ring-white/50 shadow-2xl backdrop-blur-sm"/>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-50"></div>
                  <div className="relative h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl ring-4 ring-white/50 backdrop-blur-sm">
                    {store.name[0]}
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                  {store.name}
                </h1>
                {store.tagline && <p className="text-sm text-indigo-600 font-medium">{store.tagline}</p>}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-indigo-300/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></span>
              <span className="relative z-10">Contact</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Crystal Hero */}
      <header className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-lg p-6 rounded-full shadow-2xl shadow-indigo-300/50 ring-4 ring-white/50 border-2 border-indigo-200">
                <svg className="w-12 h-12 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text drop-shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              Crystal Palace
            </span>
          </h2>
          {store.description && (
            <p className="text-xl md:text-2xl text-indigo-700 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              {store.description}
            </p>
          )}
          <div className="flex justify-center gap-12 text-indigo-600">
            <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
              <span className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{products.length}</span>
              <span className="text-sm font-bold uppercase tracking-wider mt-2">Koleksi</span>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-3xl drop-shadow-lg">★</span>
                  <span className="text-5xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{store.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-wider mt-2">{store.reviewCount || 0} Review</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Glass Product Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-lg rounded-3xl border-2 border-indigo-200 shadow-2xl">
            <div className="text-6xl mb-4">💎</div>
            <p className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
              Coming Soon
            </p>
            <p className="text-indigo-600">Produk eksklusif akan segera hadir</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-white/70 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl hover:shadow-indigo-300/50 transition-all duration-500 transform hover:-translate-y-3 border-2 border-indigo-200 hover:border-indigo-400"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-purple-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product.id ? 'scale-125 rotate-3' : 'scale-100 rotate-0'}`}
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-300">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                  {product.isNew && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                      BARU
                    </span>
                  )}
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                      -{product.discountPercent}%
                    </span>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-bold animate-pulse">✨ Tap untuk pesan</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-indigo-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      {product.reviewCount && product.reviewCount > 0 && (
                        <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleWhatsAppOrder(product.name, product.price)}
                    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white py-4 rounded-xl font-black shadow-2xl shadow-indigo-300/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" textColor="text-blue-100" accentColor="text-white"/>
    </div>
  )
}
