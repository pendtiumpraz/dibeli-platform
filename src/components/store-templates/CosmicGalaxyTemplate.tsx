'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import { useState, useEffect } from 'react'

export default function CosmicGalaxyTemplate({ store, products }: StoreTemplateProps) {
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
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black"></div>
        {/* Galaxy nebula effects */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '6s' }}></div>
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Space Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-2xl shadow-2xl shadow-purple-500/20 border-b border-purple-500/30' : 'bg-black/50 backdrop-blur-lg border-b border-purple-500/20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <img src={store.logoUrl} alt={store.name} className="relative h-14 w-14 rounded-full object-cover ring-4 ring-purple-500/50 shadow-2xl shadow-purple-500/50"/>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
                  <div className="relative h-14 w-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-purple-500/50 ring-4 ring-purple-500/50">
                    {store.name[0]}
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text">
                  {store.name}
                </h1>
                {store.tagline && <p className="text-sm text-purple-300 font-light">{store.tagline}</p>}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></span>
              <span className="relative z-10">Contact</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Cosmic Hero */}
      <header className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-3xl opacity-70 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-6 rounded-full shadow-2xl shadow-purple-500/50 ring-4 ring-purple-500/30 animate-spin" style={{ animationDuration: '10s' }}>
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text drop-shadow-[0_0_50px_rgba(167,139,250,0.8)]">
              Cosmic Galaxy
            </span>
          </h2>
          {store.description && (
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
              {store.description}
            </p>
          )}
          <div className="flex justify-center gap-12 text-purple-300">
            <div className="flex flex-col items-center bg-purple-900/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
              <span className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{products.length}</span>
              <span className="text-sm font-bold uppercase tracking-wider mt-2">Items</span>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="flex flex-col items-center bg-purple-900/30 backdrop-blur-sm px-8 py-4 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/20">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-300 text-3xl drop-shadow-[0_0_15px_rgba(253,224,71,1)]">★</span>
                  <span className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{store.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-wider mt-2">{store.reviewCount || 0} Ratings</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Galaxy Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="text-6xl mb-4">🌌</div>
            <p className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text mb-2">
              Cosmic Launch
            </p>
            <p className="text-purple-300">Products will arrive from the stars</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-gray-950/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:-translate-y-3 border border-purple-500/30 hover:border-purple-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product.id ? 'scale-125 rotate-6' : 'scale-100 rotate-0'}`}
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-400">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                  {product.isNew && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/50 animate-pulse">
                      NEW
                    </span>
                  )}
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-red-500/50">
                      -{product.discountPercent}%
                    </span>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-purple-950/95 via-transparent to-transparent ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-bold animate-pulse">🚀 Tap to order</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-purple-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                      {product.reviewCount && product.reviewCount > 0 && (
                        <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => handleWhatsAppOrder(product.name, product.price)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white py-4 rounded-xl font-black shadow-2xl shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-black" textColor="text-purple-300" accentColor="text-purple-400"/>
    </div>
  )
}
