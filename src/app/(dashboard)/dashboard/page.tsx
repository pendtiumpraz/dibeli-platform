import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Redirect SuperAdmin to admin panel
  if (session.user?.isSuperAdmin) {
    redirect('/dashboard/admin')
  }

  // Get user's store and stats
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  // Get products data
  const products = store ? await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  }) : []

  const availableProducts = store ? await prisma.product.count({
    where: { storeId: store.id, isAvailable: true },
  }) : 0

  const outOfStock = store ? await prisma.product.count({
    where: { storeId: store.id, stock: 0 },
  }) : 0

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Selamat Datang, {session.user.name}! 👋
        </h1>
        <p className="text-purple-100 mb-4">
          {store ? `Kelola toko "${store.name}" Anda dengan mudah` : 'Mari mulai dengan membuat toko pertama Anda'}
        </p>
        {!store && (
          <Link href="/dashboard/store/create">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              🚀 Buat Toko Sekarang
            </Button>
          </Link>
        )}
      </div>

      {store ? (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{store._count.products}</div>
              <div className="text-sm text-gray-600">Total Produk</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{availableProducts}</div>
              <div className="text-sm text-gray-600">Produk Aktif</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{store.viewCount}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{outOfStock}</div>
              <div className="text-sm text-gray-600">Stok Habis</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/products/create">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer text-center">
                  <div className="text-3xl mb-2">➕</div>
                  <div className="text-sm font-medium text-gray-700">Tambah Produk</div>
                </div>
              </Link>
              <Link href="/dashboard/store/template">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer text-center">
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="text-sm font-medium text-gray-700">Ganti Template</div>
                </div>
              </Link>
              <Link href={`/toko/${store.slug}`} target="_blank">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer text-center">
                  <div className="text-3xl mb-2">👁️</div>
                  <div className="text-sm font-medium text-gray-700">Lihat Toko</div>
                </div>
              </Link>
              <Link href="/dashboard/store/edit">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer text-center">
                  <div className="text-3xl mb-2">✏️</div>
                  <div className="text-sm font-medium text-gray-700">Edit Toko</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">📦 Produk Terbaru</h2>
              <Link href="/dashboard/products">
                <Button variant="outline" size="sm">Lihat Semua</Button>
              </Link>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-600 mb-4">Belum ada produk</p>
                <Link href="/dashboard/products/create">
                  <Button>Tambah Produk Pertama</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Link key={product.id} href={`/dashboard/products/${product.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                          <img 
                            src={`https://drive.google.com/thumbnail?id=${product.images[0]}&sz=w200`}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-600">Rp {product.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isAvailable ? 'Aktif' : 'Nonaktif'}
                        </span>
                        {product.stock === 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                            Stok Habis
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">🏪 {store.name}</h3>
                <p className="text-gray-600 mb-4">
                  Toko Anda: <a href={`/toko/${store.slug}`} target="_blank" className="text-purple-600 hover:underline font-medium">
                    dibeli.my.id/toko/{store.slug}
                  </a>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    store.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {store.isPublished ? '✅ Published' : '⏸️ Draft'}
                  </span>
                  {store.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
              <Link href="/dashboard/store">
                <Button variant="outline">Kelola Toko</Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Belum Punya Toko
            </h2>
            <p className="text-gray-600 mb-6">
              Mari buat toko online pertama Anda! Proses setup hanya 10 menit.
            </p>
            <Link href="/dashboard/store/create">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                🚀 Buat Toko Sekarang
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
