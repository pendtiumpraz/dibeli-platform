'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function GoldenHourTemplate({ store, products }: StoreTemplateProps) {
  const [scrolled, setScrolled] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 text-gray-900">
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {store.logoUrl ? <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full" /> : <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center font-bold text-xl text-white">{store.name[0]}</div>}
            <div><h1 className="text-xl md:text-2xl font-bold text-gray-900">{store.name}</h1>{store.tagline && <p className="text-xs text-gray-600">{store.tagline}</p>}</div>
          </div>
          <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-6 py-2 rounded-full font-semibold transition-all">Chat</a>
        </div>
      </nav>

      <header className="py-16 md:py-24 text-center px-4">
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text">{store.name}</h2>
        {store.tagline && <p className="text-lg md:text-xl text-gray-700 mb-3">{store.tagline}</p>}
        {store.description && <p className="text-gray-600 max-w-2xl mx-auto">{store.description}</p>}
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16"><div className="text-6xl mb-4">🌅</div><h3 className="text-2xl font-bold text-gray-700">Belum Ada Produk</h3></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="relative aspect-square bg-gradient-to-br from-yellow-100 to-amber-100">
                  {product.images.length > 0 ? <img src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w600`} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w600` }} /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                  {product.isNew && <span className="absolute top-3 right-3 bg-yellow-600 text-white text-xs px-3 py-1 rounded-full font-semibold">NEW</span>}
                  {product.discountPercent && product.discountPercent > 0 && <span className="absolute top-3 left-3 bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold">-{product.discountPercent}%</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">{product.name}</h3>
                  <div className="mb-4">
                    {product.originalPrice && product.originalPrice > product.price && <p className="text-sm text-gray-500 line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</p>}
                    <p className="text-2xl font-bold text-amber-600">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  {product.hasConversionPage && product.conversionPageSlug ? (
                    <div className="space-y-2">
                      <Link href={`/p/${product.conversionPageSlug}`} className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-semibold text-center transition-colors">Detail</Link>
                      <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition-colors">Pesan</button>
                    </div>
                  ) : (
                    <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white py-3 rounded-lg font-semibold transition-all">Pesan Sekarang</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-amber-100" textColor="text-gray-800" accentColor="text-amber-900"/>
    </div>
  )
}
