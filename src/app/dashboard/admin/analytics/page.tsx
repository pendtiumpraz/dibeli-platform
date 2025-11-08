import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get comprehensive stats
  const [
    totalUsers,
    trialUsers,
    premiumUsers,
    unlimitedUsers,
    totalStores,
    publishedStores,
    totalProducts,
    totalTemplates,
    publishedTemplates,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { tier: 'TRIAL' } }),
    prisma.user.count({ where: { tier: 'PREMIUM' } }),
    prisma.user.count({ where: { tier: 'UNLIMITED' } }),
    prisma.store.count(),
    prisma.store.count({ where: { isPublished: true } }),
    prisma.product.count(),
    prisma.template.count(),
    prisma.template.count({ where: { status: 'PUBLISHED' } }),
  ])

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      name: true,
      email: true,
      tier: true,
      createdAt: true,
    },
  })

  // Get top stores
  const topStores = await prisma.store.findMany({
    take: 5,
    orderBy: { productCount: 'desc' },
    select: {
      name: true,
      slug: true,
      productCount: true,
      viewCount: true,
    },
  })

  // Calculate conversion rates
  const conversionRate = totalUsers > 0 ? ((publishedStores / totalUsers) * 100).toFixed(1) : 0
  const premiumRate = totalUsers > 0 ? (((premiumUsers + unlimitedUsers) / totalUsers) * 100).toFixed(1) : 0

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
          <h1 className="text-3xl font-bold text-gray-900">📈 Platform Analytics</h1>
          <p className="mt-2 text-gray-600">
            Comprehensive platform statistics and insights
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Users</div>
              <div className="text-3xl">👥</div>
            </div>
            <div className="text-4xl font-bold">{totalUsers}</div>
            <div className="text-sm opacity-75 mt-2">
              {premiumRate}% premium users
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Stores</div>
              <div className="text-3xl">🏪</div>
            </div>
            <div className="text-4xl font-bold">{totalStores}</div>
            <div className="text-sm opacity-75 mt-2">
              {publishedStores} published
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Total Products</div>
              <div className="text-3xl">📦</div>
            </div>
            <div className="text-4xl font-bold">{totalProducts}</div>
            <div className="text-sm opacity-75 mt-2">
              Across all stores
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">Templates</div>
              <div className="text-3xl">🎨</div>
            </div>
            <div className="text-4xl font-bold">{totalTemplates}</div>
            <div className="text-sm opacity-75 mt-2">
              {publishedTemplates} published
            </div>
          </div>
        </div>

        {/* User Tiers Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🆓 Trial Users</h3>
              <div className="text-3xl font-bold text-blue-600">{trialUsers}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(trialUsers / totalUsers) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {((trialUsers / totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">💎 Premium Users</h3>
              <div className="text-3xl font-bold text-purple-600">{premiumUsers}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(premiumUsers / totalUsers) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {((premiumUsers / totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">🚀 Unlimited Users</h3>
              <div className="text-3xl font-bold text-green-600">{unlimitedUsers}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(unlimitedUsers / totalUsers) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {((unlimitedUsers / totalUsers) * 100).toFixed(1)}% of total users
            </p>
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Conversion Rate</h3>
            <div className="text-5xl font-bold text-green-600 mb-2">{conversionRate}%</div>
            <p className="text-gray-600">
              Users who published their store
            </p>
            <div className="mt-4 flex gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div>
                <div className="text-2xl font-bold text-green-600">{publishedStores}</div>
                <div className="text-sm text-gray-600">Published Stores</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Premium Conversion</h3>
            <div className="text-5xl font-bold text-purple-600 mb-2">{premiumRate}%</div>
            <p className="text-gray-600">
              Users upgraded to Premium/Unlimited
            </p>
            <div className="mt-4 flex gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{premiumUsers + unlimitedUsers}</div>
                <div className="text-sm text-gray-600">Premium Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">👤 Recent Users</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.tier === 'TRIAL'
                            ? 'bg-blue-100 text-blue-800'
                            : user.tier === 'PREMIUM'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.tier}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Stores */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">🏆 Top Stores</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topStores.map((store, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      <div>
                        <a
                          href={`/${store.slug}`}
                          target="_blank"
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {store.name}
                        </a>
                        <div className="text-sm text-gray-500">
                          {store.productCount} products
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-900">
                        👁️ {store.viewCount} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
