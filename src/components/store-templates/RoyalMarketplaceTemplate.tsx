'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'
import { useState } from 'react'

/**
 * Royal Marketplace Template (UNLIMITED Tier)
 * Regal design with gold accents, purple royal theme, crown elements
 */
export default function RoyalMarketplaceTemplate({ store, products }: StoreTemplateProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950">
      {/* Royal Pattern Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, gold 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Royal Navbar */}
      <nav className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 border-b-2 border-yellow-400/30 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-16 w-16 rounded-full object-cover ring-4 ring-yellow-400 shadow-2xl" />
              ) : (
                <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-purple-900 font-black text-2xl ring-4 ring-yellow-400 shadow-2xl">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text">
                    {store.name}
                  </h1>
                </div>
                {store.tagline && (
                  <p className="text-sm text-purple-200 italic font-light">{store.tagline}</p>
                )}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-purple-900 px-8 py-4 rounded-full font-black shadow-2xl hover:shadow-yellow-500/50 transition-all flex items-center gap-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity"></span>
              <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="relative z-10">Royal Service</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Royal Hero */}
      <header className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 px-8 py-3 rounded-full font-black text-sm flex items-center gap-2 shadow-2xl">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              ROYAL COLLECTION
            </div>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text">
              Exclusive Elegance
            </span>
          </h2>
          
          {store.description && (
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              {store.description}
            </p>
          )}

          <div className="flex justify-center gap-10">
            <div className="text-center">
              <div className="text-5xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text mb-2">
                {products.length}
              </div>
              <div className="text-sm text-purple-300 uppercase tracking-widest">Royal Items</div>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="text-center">
                <div className="text-5xl font-black flex items-center justify-center gap-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text">
                    {store.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-purple-300 uppercase tracking-widest">Excellence</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Royal Product Grid */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block bg-gradient-to-br from-purple-800/50 to-indigo-800/50 backdrop-blur-sm rounded-3xl p-16 border-2 border-yellow-400/30">
              <svg className="w-32 h-32 mx-auto text-yellow-400 mb-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <p className="text-2xl font-bold text-yellow-200 mb-3">Royal Collection Coming</p>
              <p className="text-purple-300">Exquisite items being curated for your majesty</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Card Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-3xl blur-xl transition-opacity duration-500 ${hoveredProduct === product.id ? 'opacity-50' : 'opacity-0'}`}></div>
                
                {/* Product Card */}
                <div className="relative bg-gradient-to-br from-purple-800/80 to-indigo-900/80 backdrop-blur-md rounded-3xl overflow-hidden border-2 border-yellow-400/30 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-yellow-400">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-purple-900 to-indigo-950 overflow-hidden">
                    {product.images.length > 0 ? (
                      <img
                        src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w600`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w600`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-700">
                        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-transparent to-transparent opacity-60"></div>
                    
                    {product.isNew && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 text-xs px-4 py-2 rounded-full font-black shadow-2xl border-2 border-yellow-300">
                        👑 NEW
                      </span>
                    )}
                    {product.discountPercent && product.discountPercent > 0 && (
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full font-black shadow-2xl border-2 border-red-400">
                        -{product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-black text-white text-lg mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
                      {product.name}
                    </h3>
                    
                    <div className="mb-5">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-purple-400 line-through mb-1">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    {product.hasConversionPage && product.conversionPageSlug ? (
                      <Link
                        href={`/p/${product.conversionPageSlug}`}
                        className="group/btn relative block w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-purple-900 text-center py-4 rounded-2xl font-black shadow-2xl hover:shadow-yellow-500/50 transition-all overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                        <span className="relative z-10">View Royal Details</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleWhatsAppOrder(product.name, product.price)}
                        className="group/btn relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-2xl font-black shadow-2xl hover:shadow-emerald-500/50 transition-all overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                        <span className="relative z-10">Order Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Universal Footer with Maps & Complete Store Data */}
      <StoreFooter 
        store={store}
        bgColor="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900"
        textColor="text-purple-200"
        accentColor="text-yellow-400"
      />
    </div>
  )
}
