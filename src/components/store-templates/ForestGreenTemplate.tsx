'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'

export default function ForestGreenTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <nav className="bg-gradient-to-r from-emerald-700 to-green-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full object-cover ring-4 ring-emerald-300/50" />
              ) : (
                <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-emerald-300/50">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{store.name}</h1>
                {store.tagline && <p className="text-sm text-emerald-100">{store.tagline}</p>}
              </div>
            </div>
            <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full font-semibold shadow-lg transition-all">
              Hubungi
            </a>
          </div>
        </div>
      </nav>

      <header className="relative bg-gradient-to-b from-emerald-600 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-4">{store.name}</h2>
          {store.description && <p className="text-xl text-white/95 max-w-3xl mx-auto mb-8">{store.description}</p>}
          <div className="flex justify-center gap-8">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4">
              <div className="text-4xl font-bold">{products.length}</div>
              <div className="text-sm">Produk</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🌲</div>
            <h3 className="text-2xl font-bold text-gray-900">Belum Ada Produk</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                  {product.images && product.images.length > 0 ? (
                    <img src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🌿</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  {product.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>}
                  <div className="text-2xl font-bold text-emerald-600 mb-4">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                  {product.hasConversionPage && product.conversionPageSlug ? (
                    <div className="space-y-2">
                      <Link href={`/p/${product.conversionPageSlug}`} className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-center transition-colors">Lihat Detail</Link>
                      <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg">Pesan</button>
                    </div>
                  ) : (
                    <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg">Pesan Sekarang</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-gradient-to-r from-emerald-700 to-green-700" textColor="text-emerald-100" accentColor="text-white"/>
    </div>
  )
}
