'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'
import { useState, useEffect } from 'react'

/**
 * Futuristic Store Template (UNLIMITED Tier)
 * Sci-fi tech design with neon colors, grid patterns, and futuristic elements
 */
export default function FuturisticStoreTemplate({ store, products }: StoreTemplateProps) {
  const [scrolled, setScrolled] = useState(false)
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleMouseMove = (e: MouseEvent) => {
      setGlowPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Mouse Glow Effect */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none blur-3xl transition-opacity duration-300 opacity-20"
        style={{
          background: 'radial-gradient(circle, cyan, transparent)',
          left: glowPosition.x - 192,
          top: glowPosition.y - 192,
        }}
      ></div>

      {/* Futuristic Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-cyan-500/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-14 w-14 rounded object-cover ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/50" />
              ) : (
                <div className="h-14 w-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center text-white font-black text-xl ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/50">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text tracking-wide">
                  {store.name}
                </h1>
                {store.tagline && (
                  <p className="text-sm text-cyan-300/70 font-mono">{store.tagline}</p>
                )}
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 rounded opacity-0 group-hover:opacity-100 blur transition-opacity"></span>
              <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="relative z-10 font-mono">CONNECT</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Futuristic Hero */}
      <header className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-8">
            <div className="relative bg-cyan-500/20 backdrop-blur-sm border border-cyan-500 px-6 py-2 rounded font-black text-sm text-cyan-400 shadow-lg shadow-cyan-500/30">
              <span className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></span>
              ⚡ TECH POWERED MARKETPLACE
            </div>
          </div>

          <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text">
              NEXT GENERATION
            </span>
            <br />
            <span className="text-white">SHOPPING</span>
          </h2>

          {store.description && (
            <p className="text-xl text-cyan-100/70 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              {store.description}
            </p>
          )}

          <div className="flex justify-center gap-8">
            <div className="relative bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-8 py-5 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                {products.length}
              </div>
              <div className="text-xs text-cyan-400 uppercase tracking-widest font-mono">ITEMS</div>
            </div>
            {store.rating && store.rating > 0 && (
              <div className="relative bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-8 py-5 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                <div className="text-4xl font-black text-cyan-400 flex items-center justify-center gap-2">
                  ★ {store.rating.toFixed(1)}
                </div>
                <div className="text-xs text-cyan-400 uppercase tracking-widest font-mono">RATING</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 z-10">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block bg-cyan-500/10 backdrop-blur-sm rounded-2xl p-16 border border-cyan-500/30">
              <div className="text-7xl mb-6 text-cyan-400">⚡</div>
              <p className="text-2xl font-bold text-cyan-300 mb-3 font-mono">LOADING CATALOG</p>
              <p className="text-cyan-500/70">New items syncing to database</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                {/* Product Card */}
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/30 shadow-xl transition-all duration-500 hover:border-cyan-400 hover:scale-105">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                    {product.images.length > 0 ? (
                      <img
                        src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w500`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w500`
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cyan-500/30">
                        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                    {product.isNew && (
                      <span className="absolute top-3 right-3 bg-cyan-500 text-black text-xs px-3 py-1 rounded font-black shadow-lg shadow-cyan-500/50 border border-cyan-400">
                        NEW
                      </span>
                    )}
                    {product.discountPercent && product.discountPercent > 0 && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1 rounded font-black shadow-lg">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-cyan-400 transition-colors">
                      {product.name}
                    </h3>

                    <div className="mb-4">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-xs text-gray-500 line-through mb-1">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {product.hasConversionPage && product.conversionPageSlug ? (
                      <Link
                        href={`/p/${product.conversionPageSlug}`}
                        className="group/btn relative block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-center py-3 rounded font-bold transition-all overflow-hidden shadow-lg shadow-cyan-500/30"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                        <span className="relative z-10 font-mono text-sm">VIEW DATA</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleWhatsAppOrder(product.name, product.price)}
                        className="group/btn relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-3 rounded font-bold transition-all overflow-hidden shadow-lg shadow-green-500/30"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-green-300 to-emerald-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"></span>
                        <span className="relative z-10 font-mono text-sm">ORDER NOW</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Futuristic Footer */}
      <footer className="relative border-t border-cyan-500/30 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="h-14 w-14 rounded object-cover ring-2 ring-cyan-500" />
                ) : (
                  <div className="h-14 w-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded flex items-center justify-center text-white font-black text-xl ring-2 ring-cyan-500">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                  {store.name}
                </h3>
              </div>
              {store.description && (
                <p className="text-cyan-300/70 text-sm leading-relaxed">
                  {store.description.substring(0, 120)}
                  {store.description.length > 120 && '...'}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-black text-cyan-400 text-sm uppercase tracking-widest mb-6 font-mono">CONTACT</h4>
              <div className="space-y-3 text-sm text-cyan-300/70">
                {store.address && (
                  <p className="flex items-start gap-2">
                    <span className="text-cyan-400">▸</span>
                    <span>{store.address}</span>
                  </p>
                )}
                {store.email && (
                  <p className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span>
                    <span className="font-mono">{store.email}</span>
                  </p>
                )}
                {store.phone && (
                  <p className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span>
                    <span className="font-mono">{store.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-black text-cyan-400 text-sm uppercase tracking-widest mb-6 font-mono">CONNECT</h4>
              <div className="flex gap-3">
                {store.instagramUrl && (
                  <a href={store.instagramUrl} target="_blank" rel="noopener noreferrer" className="group relative bg-cyan-500/20 hover:bg-cyan-500/30 p-3 rounded border border-cyan-500/30 hover:border-cyan-400 transition-all">
                    <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {store.facebookUrl && (
                  <a href={store.facebookUrl} target="_blank" rel="noopener noreferrer" className="group relative bg-blue-500/20 hover:bg-blue-500/30 p-3 rounded border border-blue-500/30 hover:border-blue-400 transition-all">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {store.tiktokUrl && (
                  <a href={store.tiktokUrl} target="_blank" rel="noopener noreferrer" className="group relative bg-gray-500/20 hover:bg-gray-500/30 p-3 rounded border border-gray-500/30 hover:border-gray-400 transition-all">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-500/20 pt-8 text-center">
            <p className="text-cyan-400/70 text-sm font-mono">© {new Date().getFullYear()} {store.name} | TECH POWERED</p>
            <div className="mt-2 text-xs text-cyan-500/50 font-mono">SYSTEM ONLINE</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
