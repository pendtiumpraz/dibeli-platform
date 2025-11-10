'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'

export default function CoralReefTemplate({ store, products }: StoreTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50">
      <nav className="bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {store.logoUrl ? <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full"/> : <div className="h-12 w-12 bg-orange-600 rounded-full flex items-center justify-center font-bold text-xl">{store.name[0]}</div>}
            <h1 className="text-2xl font-bold">{store.name}</h1>
          </div>
          <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold">Chat</a>
        </div>
      </nav>
      <header className="bg-gradient-to-b from-orange-400 to-pink-600 text-white py-20 text-center"><h2 className="text-5xl font-bold">{store.name}</h2></header>
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-pink-100">{p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-6xl">🐠</div>}</div>
            <div className="p-6"><h3 className="text-xl font-bold">{p.name}</h3><div className="text-2xl font-bold text-orange-600 my-4">Rp {p.price.toLocaleString('id-ID')}</div><button onClick={() => window.open(`https://wa.me/${store.whatsappNumber}`, '_blank')} className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold">Pesan</button></div>
          </div>
        ))}
      </main>
      <StoreFooter store={store} bgColor="bg-orange-700" textColor="text-orange-100" accentColor="text-white"/>
    </div>
  )
}
