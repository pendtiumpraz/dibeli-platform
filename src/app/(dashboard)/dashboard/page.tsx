import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) return null

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    include: {
      products: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { products: true },
      },
    },
  })

  const hasStore = !!store

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Selamat datang di dashboard Anda
        </p>
      </div>

      {!hasStore ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Belum Punya Toko?
          </h2>
          <p className="text-gray-600 mb-6">
            Buat toko online pertama Anda dalam hitungan menit!
          </p>
          <Link href="/dashboard/store/create">
            <Button size="lg">
              Buat Toko Sekarang
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">📦</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Produk
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {store._count.products}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">👁️</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Views
                      </dt>
                      <dd className="text-3xl font-semibold text-gray-900">
                        {store.viewCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">🔗</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Status
                      </dt>
                      <dd className="text-xl font-semibold text-gray-900">
                        {store.isPublished ? '✅ Published' : '⏸️ Draft'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">🏪</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Link Toko
                      </dt>
                      <dd className="text-sm font-semibold text-purple-600 truncate">
                        /{store.slug}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Produk Terbaru
              </h3>
            </div>
            <div className="px-6 py-4">
              {store.products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada produk. 
                  <Link href="/dashboard/products/create" className="text-purple-600 ml-1">
                    Tambah produk pertama
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {store.products.map((product) => (
                    <li key={product.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isAvailable ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
