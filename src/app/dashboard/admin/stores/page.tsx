import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'

export default async function AdminStoresPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get all stores with owner info
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          tier: true,
        },
      },
      products: {
        select: { id: true },
      },
    },
  })

  // Stats
  const totalStores = stores.length
  const publishedStores = stores.filter(s => s.isPublished).length
  const publicStores = stores.filter(s => s.isPubliclyListed).length
  const featuredStores = stores.filter(s => s.isFeatured).length

  return (
    <AdminLayout user={session.user}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard/admin"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Admin Panel
          </a>
          <h1 className="text-3xl font-bold text-gray-900">🏪 Store Management</h1>
          <p className="mt-2 text-gray-600">
            View and moderate all stores
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Total Stores</div>
            <div className="text-2xl font-bold text-gray-900">{totalStores}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Published</div>
            <div className="text-2xl font-bold text-green-600">{publishedStores}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Public</div>
            <div className="text-2xl font-bold text-blue-600">{publicStores}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Featured</div>
            <div className="text-2xl font-bold text-purple-600">{featuredStores}</div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stores.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold mr-3">
                          {store.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {store.name}
                          </div>
                          <a
                            href={`/${store.slug}`}
                            target="_blank"
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            /{store.slug}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{store.user.name}</div>
                      <div className="text-xs text-gray-500">{store.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          store.user.tier === 'TRIAL'
                            ? 'bg-blue-100 text-blue-800'
                            : store.user.tier === 'PREMIUM'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {store.user.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {store.products.length} products
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {store.isPublished && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        )}
                        {store.isPubliclyListed && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Public
                          </span>
                        )}
                        {store.isFeatured && (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(store.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a
                        href={`/${store.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </a>
                      <form
                        action="/api/admin/stores/toggle-featured"
                        method="POST"
                        className="inline"
                      >
                        <input type="hidden" name="storeId" value={store.id} />
                        <input type="hidden" name="isFeatured" value={(!store.isFeatured).toString()} />
                        <button
                          type="submit"
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {store.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                      </form>
                      <form
                        action="/api/admin/stores/toggle-public"
                        method="POST"
                        className="inline"
                      >
                        <input type="hidden" name="storeId" value={store.id} />
                        <input type="hidden" name="isPubliclyListed" value={(!store.isPubliclyListed).toString()} />
                        <button
                          type="submit"
                          className={store.isPubliclyListed ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {store.isPubliclyListed ? 'Hide' : 'Show'}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
