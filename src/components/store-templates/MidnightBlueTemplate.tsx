'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'

export default function MidnightBlueTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    window.open(`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(`Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      <nav className="bg-blue-900/50 backdrop-blur-md border-b border-blue-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full ring-2 ring-blue-400/50"/>
            ) : (
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl font-bold text-white">{store.name}</h1>
          </div>
          <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
            Chat
          </a>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-4">{store.name}</h2>
          {store.description && <p className="text-xl max-w-3xl mx-auto">{store.description}</p>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-slate-800 rounded-3xl">
            <div className="text-6xl mb-4">🌙</div>
            <h3 className="text-2xl font-bold text-white">Belum Ada Produk</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-800 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all overflow-hidden hover:-translate-y-2">
                <div className="relative aspect-square bg-gradient-to-br from-blue-900 to-indigo-900">
                  {product.images?.[0] ? (
                    <img src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`} alt={product.name} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">✨</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <div className="text-2xl font-bold text-blue-400 mb-4">Rp {product.price.toLocaleString('id-ID')}</div>
                  <button onClick={() => handleWhatsAppOrder(product.name, product.price)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StoreFooter store={store} bgColor="bg-slate-900" textColor="text-slate-300" accentColor="text-blue-400"/>
    </div>
  )
}
