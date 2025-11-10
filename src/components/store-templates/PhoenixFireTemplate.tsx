'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import { useState, useEffect } from 'react'

export default function PhoenixFireTemplate({ store, products }: StoreTemplateProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-red-950 to-yellow-950 overflow-x-hidden">
      {/* Fire Background Animation */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900 via-red-900 to-yellow-900"></div>
        {/* Flame effects */}
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-orange-600 via-red-600 to-transparent opacity-40 mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-gradient-to-br from-red-500 to-rose-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '4.5s' }}></div>
        {/* Ember particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-70 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Fire Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-gradient-to-r from-orange-900/95 to-red-900/95 backdrop-blur-2xl shadow-2xl shadow-orange-600/30 border-b border-orange-500/30' : 'bg-gradient-to-r from-orange-900/70 to-red-900/70 backdrop-blur-lg border-b border-orange-500/20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-xl opacity-80 animate-pulse"></div>
                  <img src={store.logoUrl} alt={store.name} className="relative h-14 w-14 rounded-full object-cover ring-4 ring-orange-400/50 shadow-2xl shadow-orange-500/50"/>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-xl opacity-80 animate-pulse"></div>
                  <div className="relative h-14 w-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-orange-500/50 ring-4 ring-orange-400/50">
                    {store.name[0]}
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-orange-300 via-yellow-200 to-red-300 bg-clip-text drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">
                  {store.name}
                </h1>
                {store.tagline && <p className="text-sm text-orange-300 font-medium">{store.tagline}</p>}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 hover:from-orange-700 hover:via-red-700 hover:to-rose-700 text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-orange-600/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></span>
              <span className="relative z-10">🔥 Chat Now</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Phoenix Hero */}
      <header className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full blur-3xl opacity-80 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-yellow-600 p-6 rounded-full shadow-2xl shadow-orange-600/70 ring-4 ring-orange-400/50">
                <svg className="w-12 h-12 text-white animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 bg-clip-text drop-shadow-[0_0_50px_rgba(251,146,60,1)]">
              Phoenix Fire
            </span>
          </h2>
          {store.description && (
            <p className="text-xl md:text-2xl text-orange-200 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-lg font-medium">
              {store.description}
            </p>
          )}
          <div className="flex justify-center gap-12 text-orange-300">
            <div className="flex flex-col items-center bg-orange-900/40 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-orange-500/40 shadow-xl shadow-orange-600/30">
              <span className="text-5xl font-black text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">{products.length}</span>
              <span className="text-sm font-black uppercase tracking-wider mt-2">Products</span>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="flex flex-col items-center bg-orange-900/40 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-orange-500/40 shadow-xl shadow-orange-600/30">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-300 text-3xl drop-shadow-[0_0_15px_rgba(253,224,71,1)]">★</span>
                  <span className="text-5xl font-black text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">{store.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm font-black uppercase tracking-wider mt-2">{store.reviewCount || 0} Reviews</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Blazing Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-lg rounded-3xl border-2 border-orange-500/40 shadow-2xl shadow-orange-600/30">
            <div className="text-6xl mb-4 animate-bounce">🔥</div>
            <p className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text mb-2 drop-shadow-lg">
              Igniting Soon
            </p>
            <p className="text-orange-300 font-medium">Fiery products coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-gray-900/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-orange-600/60 transition-all duration-500 transform hover:-translate-y-3 border-2 border-orange-500/40 hover:border-orange-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-900 to-red-900">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product.id ? 'scale-125 brightness-125 saturate-150' : 'scale-100'}`}
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-400">
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
                      🔥 -{product.discountPercent}%
                    </span>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-orange-950/95 via-transparent to-transparent ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-bold animate-pulse">🔥 Tap to order now!</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-orange-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">
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
                    className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 hover:from-orange-700 hover:via-red-700 hover:to-rose-700 text-white py-4 rounded-xl font-black shadow-2xl shadow-orange-600/50 transition-all duration-300 transform hover:scale-105"
                  >
                    🔥 Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-gradient-to-r from-orange-900 to-red-900" textColor="text-orange-200" accentColor="text-orange-300"/>
    </div>
  )
}
