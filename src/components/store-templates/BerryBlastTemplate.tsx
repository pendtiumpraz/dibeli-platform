'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'

export default function BerryBlastTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    window.open(`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      <nav className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full object-cover ring-4 ring-pink-300/50"/>
            ) : (
              <div className="h-12 w-12 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-pink-300/50">
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              {store.tagline && <p className="text-sm text-pink-100">{store.tagline}</p>}
            </div>
          </div>
          <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-pink-50 text-pink-600 px-6 py-3 rounded-full font-semibold shadow-lg transition-all">
            Chat
          </a>
        </div>
      </nav>

      <header className="bg-gradient-to-b from-pink-400 to-rose-500 text-white py-20 text-center">
        <h2 className="text-5xl font-bold mb-4">{store.name}</h2>
        {store.description && <p className="text-xl max-w-3xl mx-auto mb-8">{store.description}</p>}
        <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4">
          <div className="text-4xl font-bold">{products.length}</div>
          <div className="text-sm">Produk</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">🍓</div>
            <h3 className="text-2xl font-bold text-gray-900">Belum Ada Produk</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden hover:-translate-y-2">
                <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-rose-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🍓</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="text-2xl font-bold text-pink-600 mb-4">Rp {product.price.toLocaleString('id-ID')}</div>
                  <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-xl font-semibold shadow-lg">
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-gradient-to-r from-pink-600 to-rose-600" textColor="text-pink-100" accentColor="text-white"/>
    </div>
  )
}
