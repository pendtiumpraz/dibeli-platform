import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      store: {
        select: {
          name: true,
          slug: true,
          isPublished: true,
        },
      },
    },
  })

  // Count superadmins
  const superAdminCount = users.filter(u => u.isSuperAdmin).length

  // Stats
  const totalUsers = users.length
  const trialUsers = users.filter(u => u.tier === 'TRIAL').length
  const premiumUsers = users.filter(u => u.tier === 'PREMIUM').length
  const unlimitedUsers = users.filter(u => u.tier === 'UNLIMITED').length

  return (
    <AdminLayout user={session.user}>
      <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🔐 SuperAdmin Panel</h1>
        <p className="mt-2 text-gray-600">
          Manage users, roles, and platform settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trial Users</p>
              <p className="text-3xl font-bold text-blue-600">{trialUsers}</p>
            </div>
            <div className="text-4xl">🆓</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Premium Users</p>
              <p className="text-3xl font-bold text-purple-600">{premiumUsers}</p>
            </div>
            <div className="text-4xl">💎</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unlimited</p>
              <p className="text-3xl font-bold text-green-600">{unlimitedUsers}</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>
      </div>

      {/* SuperAdmin Management */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">👑 SuperAdmin Roles</h2>
        <p className="text-gray-600 mb-4">
          Current SuperAdmins: <span className="font-bold">{superAdminCount}</span> / 3 max
        </p>
        <div className="flex gap-2">
          <a
            href="/dashboard/admin/roles"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Manage Roles
          </a>
          {superAdminCount < 3 && (
            <a
              href="/dashboard/admin/add-admin"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add SuperAdmin
            </a>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.image && (
                        <img
                          src={user.image}
                          alt={user.name || 'User'}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No Name'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.tier === 'TRIAL'
                          ? 'bg-blue-100 text-blue-800'
                          : user.tier === 'PREMIUM'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.store ? (
                      <a
                        href={`/toko/${user.store.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {user.store.name}
                      </a>
                    ) : (
                      <span className="text-gray-400">No store</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isSuperAdmin ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        👑 SuperAdmin
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={`/dashboard/admin/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/admin/templates"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">🎨</div>
            <div className="font-semibold">Manage Templates</div>
            <div className="text-sm text-gray-600">Add, edit, approve templates</div>
          </a>
          
          <a
            href="/dashboard/admin/stores"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">🏪</div>
            <div className="font-semibold">Manage Stores</div>
            <div className="text-sm text-gray-600">View and moderate stores</div>
          </a>
          
          <a
            href="/dashboard/admin/analytics"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold">Analytics</div>
            <div className="text-sm text-gray-600">Platform statistics</div>
          </a>

          <a
            href="/dashboard/admin/settings"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-semibold">Settings</div>
            <div className="text-sm text-gray-600">API keys & configuration</div>
          </a>
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}
