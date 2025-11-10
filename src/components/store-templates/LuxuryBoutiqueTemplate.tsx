'use client'

import { StoreTemplateProps } from './types'
import Link from 'next/link'
import { useState, useEffect } from 'react'

/**
 * Luxury Boutique Template (UNLIMITED Tier)
 * Ultra premium, luxury design with animations and sophisticated styling
 */
export default function LuxuryBoutiqueTemplate({ store, products }: StoreTemplateProps) {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-purple-950 via-black to-rose-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Luxury Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20 shadow-xl" />
              ) : (
                <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl ring-2 ring-white/20">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  {store.name}
                </h1>
                {store.tagline && (
                  <p className="text-sm text-gray-400 italic font-light tracking-wide">{store.tagline}</p>
                )}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-3"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity"></span>
              <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="relative z-10">Contact VIP</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Luxury Hero Section */}
      <header className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Crown Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-200 text-black p-4 rounded-full shadow-2xl shadow-yellow-500/50">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
          </div>

          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Welcome to Excellence
            </span>
          </h2>
          
          {store.description && (
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
              {store.description}
            </p>
          )}

          {/* Stats with Luxury Style */}
          <div className="flex justify-center gap-12 mb-8">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {products.length}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-widest">Exclusive Products</div>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="text-center">
                <div className="text-5xl font-black flex items-center justify-center gap-2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">★</span>
                  <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                    {store.rating.toFixed(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">VIP Rating</div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent mx-auto"></div>
        </div>
      </header>

      {/* Luxury Product Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 mb-6">
              <svg className="w-32 h-32 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-gray-300 mb-3">Curated Collection Coming Soon</p>
            <p className="text-gray-500">Our exclusive products are being carefully selected for you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl transition-opacity duration-500 ${hoveredProduct === product.id ? 'opacity-75' : 'opacity-0'}`}></div>
                
                {/* Product Card */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-white/40">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black overflow-hidden">
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
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    
                    {product.isNew && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg backdrop-blur-sm border border-white/20">
                        ✨ NEW
                      </span>
                    )}
                    {product.discountPercent && product.discountPercent > 0 && (
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full font-black shadow-lg backdrop-blur-sm border border-white/20">
                        -{product.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-black text-white text-lg mb-3 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-200 group-hover:to-pink-200 group-hover:bg-clip-text transition-all">
                      {product.name}
                    </h3>
                    
                    <div className="mb-5">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through mb-1">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    {product.hasConversionPage && product.conversionPageSlug ? (
                      <Link
                        href={`/p/${product.conversionPageSlug}`}
                        className="group/btn relative block w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white text-center py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                        <span className="relative z-10">Explore Details</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleWhatsAppOrder(product.name, product.price)}
                        className="group/btn relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                        <span className="relative z-10">Order VIP</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="relative z-10 mt-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20" />
                ) : (
                  <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-2xl ring-2 ring-white/20">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  {store.name}
                </h3>
              </div>
              {store.description && (
                <p className="text-gray-400 leading-relaxed">
                  {store.description.substring(0, 120)}
                  {store.description.length > 120 && '...'}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-black text-white text-lg mb-6 uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-4 text-sm text-gray-400">
                {store.address && (
                  <p className="flex items-start gap-3">
                    <span className="text-pink-400 text-lg">📍</span>
                    <span className="leading-relaxed">{store.address}</span>
                  </p>
                )}
                {store.email && (
                  <p className="flex items-center gap-3">
                    <span className="text-pink-400 text-lg">✉️</span>
                    <span>{store.email}</span>
                  </p>
                )}
                {store.phone && (
                  <p className="flex items-center gap-3">
                    <span className="text-pink-400 text-lg">📱</span>
                    <span>{store.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-black text-white text-lg mb-6 uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-4">
                {store.instagramUrl && (
                  <a href={store.instagramUrl} target="_blank" rel="noopener noreferrer" className="group relative bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 p-4 rounded-xl transition-all hover:scale-110 shadow-lg hover:shadow-pink-500/50">
                    <span className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></span>
                    <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {store.facebookUrl && (
                  <a href={store.facebookUrl} target="_blank" rel="noopener noreferrer" className="group relative bg-blue-600 hover:bg-blue-500 p-4 rounded-xl transition-all hover:scale-110 shadow-lg hover:shadow-blue-500/50">
                    <span className="absolute inset-0 bg-blue-400 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></span>
                    <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {store.tiktokUrl && (
                  <a href={store.tiktokUrl} target="_blank" rel="noopener noreferrer" className="group relative bg-gray-800 hover:bg-gray-700 p-4 rounded-xl transition-all hover:scale-110 shadow-lg hover:shadow-gray-500/50">
                    <span className="absolute inset-0 bg-gray-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></span>
                    <svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2024 {store.name}. Crafted with Excellence.</p>
            <div className="mt-2 text-xs text-gray-600">All Rights Reserved | Premium Experience</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
