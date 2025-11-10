'use client'
import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'

export default function DiamondSparkleTemplate({ store, products }: StoreTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100">
      <nav className="bg-gradient-to-r from-gray-200 to-slate-300 border-b border-gray-300 sticky top-0 z-50 backdrop-blur-md"><div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"><div className="flex items-center gap-4">{store.logoUrl ? <img src={store.logoUrl} alt={store.name} className="h-12 w-12 rounded-full ring-4 ring-white"/> : <div className="h-12 w-12 bg-gradient-to-br from-gray-300 to-slate-400 rounded-full flex items-center justify-center font-bold text-xl ring-4 ring-white">{store.name[0]}</div>}<h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-slate-900 bg-clip-text text-transparent">{store.name}</h1></div><a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" className="bg-gradient-to-r from-gray-700 to-slate-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg">Chat</a></div></nav>
      <header className="bg-gradient-to-b from-gray-300 via-slate-300 to-zinc-300 text-gray-900 py-20 text-center relative overflow-hidden"><div className="absolute inset-0 opacity-20"><div className="absolute top-10 left-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div><div className="absolute bottom-10 right-20 w-60 h-60 bg-gray-400 rounded-full blur-3xl animate-pulse"></div></div><div className="relative z-10"><h2 className="text-5xl font-bold">{store.name}</h2></div></header>
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">{products.map((p) => (<div key={p.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all"><div className="aspect-square bg-gradient-to-br from-gray-100 to-slate-200">{p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-6xl">💎</div>}</div><div className="p-6"><h3 className="text-xl font-bold">{p.name}</h3><div className="text-2xl font-bold text-gray-800 my-4">Rp {p.price.toLocaleString('id-ID')}</div><button onClick={() => window.open(`https://wa.me/${store.whatsappNumber}`, '_blank')} className="w-full bg-gradient-to-r from-gray-700 to-slate-800 text-white py-3 rounded-xl font-semibold shadow-lg">Pesan</button></div></div>))}</main>
      <StoreFooter store={store} bgColor="bg-gradient-to-r from-gray-800 to-slate-900" textColor="text-gray-300" accentColor="text-white"/>
    </div>
  )
}
