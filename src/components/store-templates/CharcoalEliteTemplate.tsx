'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'

export default function CharcoalEliteTemplate({ store, products }: StoreTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900">
      <nav className="bg-black/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50"><div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"><div className="flex items-center gap-4">{store.logoUrl ? <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full"/> : <div className="h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center font-bold text-xl text-white">{store.name[0]}</div>}<h1 className="text-2xl font-bold text-white">{store.name}</h1></div><a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold">Chat</a></div></nav>
      <header className="bg-gradient-to-b from-gray-800 to-zinc-900 text-white py-20 text-center"><h2 className="text-5xl font-bold">{store.name}</h2></header>
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">{products.map((p) => (<div key={p.id} className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700"><div className="aspect-square bg-gradient-to-br from-gray-700 to-zinc-800">{p.images?.[0] ? <img src={`https://drive.google.com/thumbnail?id=${p.images[0]}&sz=w400`} alt={p.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-6xl">🖤</div>}</div><div className="p-6"><h3 className="text-xl font-bold text-white">{p.name}</h3><div className="text-2xl font-bold text-gray-300 my-4">Rp {p.price.toLocaleString('id-ID')}</div><button onClick={() => window.open(`https://wa.me/${store.whatsappNumber}`, '_blank')} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold">Pesan</button></div></div>))}</main>
      <StoreFooter store={store} bgColor="bg-black" textColor="text-gray-400" accentColor="text-white"/>
    </div>
  )
}
