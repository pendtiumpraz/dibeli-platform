'use client'

import { StoreTemplateProps } from './types'
import StoreFooter from './StoreFooter'
import Link from 'next/link'

/**
 * Minimal Clean Template (FREE Tier)
 * Ultra-minimalist design, focus on content, fast and clean
 */
export default function MinimalCleanTemplate({ store, products }: StoreTemplateProps) {
  const handleWhatsAppOrder = (productName: string, price: number) => {
    const message = `Halo *${store.name}*!\n\nSaya tertarik dengan:\n*${productName}*\nHarga: Rp ${price.toLocaleString('id-ID')}\n\nApakah masih tersedia?`
    const whatsappUrl = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navbar - Fixed thin line */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.name} className="h-8 w-8 rounded object-cover" />
            ) : (
              <div className="h-8 w-8 bg-gray-900 rounded flex items-center justify-center text-white text-sm font-bold">
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-lg font-semibold text-gray-900">{store.name}</h1>
          </div>
          <a
            href={`https://wa.me/${store.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 hover:text-gray-900 underline"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Minimal Header */}
      <header className="max-w-5xl mx-auto px-4 py-12 text-center border-b border-gray-100">
        {store.tagline && (
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">{store.tagline}</p>
        )}
        {store.description && (
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {store.description}
          </p>
        )}
      </header>

      {/* Minimal Product List */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>No products available yet</p>
          </div>
        ) : (
          <div className="space-y-px">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex items-center gap-4 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* Product Image - Small square */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 overflow-hidden">
                  {product.images.length > 0 ? (
                    <img
                      src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w200`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://lh3.googleusercontent.com/d/${product.images[0]}=w200`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 truncate group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Action */}
                {product.hasConversionPage && product.conversionPageSlug ? (
                  <Link
                    href={`/p/${product.conversionPageSlug}`}
                    className="text-sm text-gray-700 hover:text-gray-900 underline whitespace-nowrap"
                  >
                    View
                  </Link>
                ) : (
                  <button
                    onClick={() => handleWhatsAppOrder(product.name, product.price)}
                    className="text-sm text-gray-700 hover:text-gray-900 underline whitespace-nowrap"
                  >
                    Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Universal Footer with Maps & Complete Store Data */}
      <StoreFooter 
        store={store}
        bgColor="bg-white"
        textColor="text-gray-500"
        accentColor="text-gray-900"
      />
    </div>
  )
}
