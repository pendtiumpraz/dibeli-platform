'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function NeonNightsTemplate({ store, products }: StoreTemplateProps) {
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
      {/* Neon Glow Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-pink-950"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Neon Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-2xl shadow-2xl shadow-pink-500/20 border-b border-pink-500/30' : 'bg-black/50 backdrop-blur-md border-b border-pink-500/20'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-lg opacity-70 animate-pulse"></div>
                  <img src={store.logoUrl} alt={store.name} className="relative h-14 w-14 rounded-full object-cover ring-4 ring-pink-500/50 shadow-2xl shadow-pink-500/50"/>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-lg opacity-70 animate-pulse"></div>
                  <div className="relative h-14 w-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-pink-500/50 ring-4 ring-pink-500/50">
                    {store.name[0]}
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text animate-pulse">
                  {store.name}
                </h1>
                {store.tagline && <p className="text-sm text-pink-300 font-light">{store.tagline}</p>}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 hover:from-pink-600 hover:via-purple-700 hover:to-blue-600 text-white px-8 py-4 rounded-full font-black shadow-2xl shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-pulse"></span>
              <span className="relative z-10">Chat Now</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Cyber Hero */}
      <header className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-2xl opacity-70 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500 p-5 rounded-full shadow-2xl shadow-pink-500/50 ring-4 ring-pink-500/30">
                <svg className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">
              Neon Collection
            </span>
          </h2>
          {store.description && (
            <p className="text-xl md:text-2xl text-pink-200 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
              {store.description}
            </p>
          )}
          <div className="flex justify-center gap-12 text-pink-300">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">{products.length}</span>
              <span className="text-sm font-bold uppercase tracking-wider mt-1">Produk</span>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">★</span>
                  <span className="text-5xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">{store.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-wider mt-1">{store.reviewCount || 0} Reviews</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Neon Product Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-sm rounded-3xl border border-pink-500/30">
            <div className="text-6xl mb-4 animate-pulse">⚡</div>
            <p className="text-3xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text mb-2">Coming Soon</p>
            <p className="text-pink-300">Produk akan segera hadir</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-pink-500/50 transition-all duration-500 transform hover:-translate-y-2 border border-pink-500/30 hover:border-pink-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product.id ? 'scale-125 blur-sm' : 'scale-100'}`}
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400">
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
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-pink-500/50">
                      -{product.discountPercent}%
                    </span>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-${hoveredProduct === product.id ? '100' : '0'} transition-opacity duration-300`}>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-bold">Klik untuk pesan</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-pink-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
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

                  {product.hasConversionPage && product.conversionPageSlug ? (
                    <div className="space-y-2">
                      <Link
                        href={`/${store.slug}/${product.conversionPageSlug}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                      >
                        Lihat Detail
                      </Link>
                      <button
                        onClick={() => handleWhatsAppOrder(product.name, product.price)}
                        className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 hover:from-pink-600 hover:via-purple-700 hover:to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Order Now
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleWhatsAppOrder(product.name, product.price)}
                      className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 hover:from-pink-600 hover:via-purple-700 hover:to-blue-600 text-white py-4 rounded-xl font-black shadow-2xl shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      Order Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-black" textColor="text-pink-300" accentColor="text-pink-400"/>
    </div>
  )
}
