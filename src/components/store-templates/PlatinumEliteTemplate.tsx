'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import { useState, useEffect } from 'react'

export default function PlatinumEliteTemplate({ store, products }: StoreTemplateProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 overflow-x-hidden">
      {/* Metallic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-slate-200 to-zinc-200"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-300 to-slate-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-slate-300 to-zinc-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Elite Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b-2 border-gray-300' : 'bg-white/80 backdrop-blur-lg'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full blur opacity-50"></div>
                  <img src={store.logoUrl} alt={store.name} className="relative h-14 w-14 rounded-full object-cover ring-4 ring-white shadow-2xl"/>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full blur opacity-50"></div>
                  <div className="relative h-14 w-14 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl ring-4 ring-white">
                    {store.name[0]}
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {store.name}
                </h1>
                {store.tagline && <p className="text-sm text-gray-600 italic">{store.tagline}</p>}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white px-8 py-4 rounded-full font-black shadow-2xl hover:shadow-gray-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></span>
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                VIP Contact
              </span>
            </a>
          </div>
        </div>
      </nav>

      {/* Elite Hero */}
      <header className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-400 via-slate-400 to-zinc-500 p-5 rounded-full shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight text-gray-900">
            Platinum Excellence
          </h2>
          {store.description && (
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed">
              {store.description}
            </p>
          )}
          <div className="flex justify-center gap-10 text-gray-600">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-gray-900">{products.length}</span>
              <span className="text-sm font-medium uppercase tracking-wider">Koleksi</span>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <span className="text-4xl font-black text-gray-900">{store.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm font-medium uppercase tracking-wider">{store.reviewCount || 0} Review</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Product Showcase */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Segera Hadir</p>
            <p className="text-gray-600">Produk eksklusif akan segera diluncurkan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-200 hover:border-gray-400"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-slate-200">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product.id ? 'scale-110 rotate-2' : 'scale-100 rotate-0'}`}
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                  {product.isNew && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      BARU
                    </span>
                  )}
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      -{product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="relative p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-gray-900">
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
                    className="w-full bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-gradient-to-r from-gray-800 to-slate-900" textColor="text-gray-300" accentColor="text-white"/>
    </div>
  )
}
