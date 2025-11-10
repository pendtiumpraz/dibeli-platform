'use client'

export default function YellowEnergyTemplate({ product, store }: any) {
  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-yellow-900 mb-4">
          ⚡ Yellow Energy Template
        </h1>
        <p className="text-gray-600 mb-8">Coming in Phase 3-5!</p>
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <p className="text-3xl text-yellow-600 font-bold">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  )
}
