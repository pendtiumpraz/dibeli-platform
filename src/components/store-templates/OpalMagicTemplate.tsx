'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function OpalMagicTemplate({ store, products }: StoreTemplateProps) {
  const [scrolled, setScrolled] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    window.open(`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900 relative overflow-hidden">
      {/* Opal Shimmer */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-gradient-to-br from-purple-300 to-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-300 to-teal-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
      </div>

      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-purple-300/30' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-14 w-14 rounded-full border-2 border-purple-500 shadow-lg" />
              ) : (
                <div className="h-14 w-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center font-black text-2xl text-white border-2 border-purple-500">
                  {store.name[0]}
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-pink-700 via-purple-700 to-blue-700 bg-clip-text">{store.name}</h1>
                {store.tagline && <p className="text-xs text-purple-600">{store.tagline}</p>}
              </div>
            </div>
            <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-all duration-300">Chat ✨</a>
          </div>
        </div>
      </nav>

      <header className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text">{store.name}</h2>
          {store.tagline && <p className="text-xl md:text-2xl text-purple-800 mb-4 font-semibold">{store.tagline}</p>}
          {store.description && <p className="text-base md:text-lg text-purple-700 max-w-3xl mx-auto">{store.description}</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-16 relative z-10">
        {products.length === 0 ? (
          <div className="text-center py-20"><div className="text-8xl mb-6">✨</div><h3 className="text-3xl font-black text-purple-700 mb-4">Belum Ada Produk</h3></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group relative" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
                <div className={`absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl blur-xl transition-opacity duration-500 ${hoveredProduct === product.id ? 'opacity-75' : 'opacity-0'}`}></div>
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-purple-300/50 shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
                    {product.images.length > 0 ? (
                      <img src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w600`} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w600` }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-400"><svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-100 via-transparent to-transparent opacity-50"></div>
                    {product.isNew && <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">✨ NEW</span>}
                    {product.discountPercent && product.discountPercent > 0 && <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full font-black shadow-lg">-{product.discountPercent}%</span>}
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-700 group-hover:to-purple-700 group-hover:bg-clip-text transition-all">{product.name}</h3>
                    <div className="mb-5">
                      {product.originalPrice && product.originalPrice > product.price && <p className="text-sm text-gray-500 line-through mb-1">Rp {product.originalPrice.toLocaleString('id-ID')}</p>}
                      <p className="text-3xl font-black text-transparent bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text">Rp {product.price.toLocaleString('id-ID')}</p>
                    </div>
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-1 mb-5">
                        {[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                        {product.reviewCount && product.reviewCount > 0 && <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>}
                      </div>
                    )}
                    {product.hasConversionPage && product.conversionPageSlug ? (
                      <div className="space-y-2">
                        <Link href={`/p/${product.conversionPageSlug}`} className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold shadow-lg text-center">Lihat Detail</Link>
                        <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>Pesan</button>
                      </div>
                    ) : (
                      <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 rounded-xl font-black shadow-2xl transition-all duration-300 transform hover:scale-105">✨ Pesan</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-purple-100" textColor="text-purple-800" accentColor="text-purple-900"/>
    </div>
  )
}
