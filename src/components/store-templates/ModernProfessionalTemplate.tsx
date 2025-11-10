'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'

/**
 * Modern Professional Template (PREMIUM Tier)
 * Corporate, clean, trustworthy design for professional businesses
 */
export default function ModernProfessionalTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="h-14 w-14 rounded object-cover border-2 border-gray-100" />
              ) : (
                <div className="h-14 w-14 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-xl border-2 border-gray-100">
                  {store.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
                {store.tagline && (
                  <p className="text-sm text-gray-600">{store.tagline}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-semibold">{products.length}</span>
                  <span>Products</span>
                </div>
                {store.rating && store.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-slate-700 font-semibold">{store.rating.toFixed(1)}</span>
                    <span>Rating</span>
                  </div>
                )}
              </div>
              <a
                href={`https://wa.me/${store.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Professional Hero */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Professional Quality Products
            </h2>
            {store.description && (
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {store.description}
              </p>
            )}
            <div className="flex gap-4 text-sm">
              {store.city && store.province && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  📍 {store.city}, {store.province}
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                ✓ Trusted Seller
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-xl p-12 inline-block">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg font-semibold text-gray-700 mb-2">No Products Yet</p>
              <p className="text-gray-500">Check back soon for new arrivals</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-slate-800 hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w400`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w400`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.isNew && (
                    <span className="absolute top-3 right-3 bg-slate-800 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      New
                    </span>
                  )}
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                      -{product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-slate-800">
                    {product.name}
                  </h3>
                  <div className="mb-4">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-sm text-gray-400 line-through mb-1">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </p>
                    )}
                    <p className="text-xl font-bold text-slate-800">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  {product.hasConversionPage && product.conversionPageSlug ? (
                    <Link
                      href={`/p/${product.conversionPageSlug}`}
                      className="block w-full bg-slate-800 hover:bg-slate-900 text-white text-center py-3 rounded-lg font-medium transition-colors"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleWhatsAppOrder(product.name, product.price)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Order Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Universal Footer with Maps & Complete Store Data */}
      <StoreFooter 
        store={store}
        bgColor="bg-slate-900"
        textColor="text-gray-400"
        accentColor="text-white"
      />
    </div>
  )
}
