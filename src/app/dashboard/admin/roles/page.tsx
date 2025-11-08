import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'
import { RemoveAdminButton } from '@/components/RemoveAdminButton'
import { PromoteUserButton } from '@/components/PromoteUserButton'

export default async function AdminRolesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get all SuperAdmins
  const superAdmins = await prisma.user.findMany({
    where: { isSuperAdmin: true },
    orderBy: { createdAt: 'asc' },
    include: {
      store: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  })

  // Get regular users for potential promotion
  const regularUsers = await prisma.user.findMany({
    where: { isSuperAdmin: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      name: true,
      email: true,
      tier: true,
      createdAt: true,
    },
  })

  const maxSuperAdmins = 3
  const currentSuperAdmins = superAdmins.length
  const canAddMore = currentSuperAdmins < maxSuperAdmins

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
          <h1 className="text-3xl font-bold text-gray-900">👑 Role Management</h1>
          <p className="mt-2 text-gray-600">
            Manage SuperAdmin roles (Max {maxSuperAdmins})
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                SuperAdmin Slots
              </h2>
              <p className="text-gray-600">
                <span className="text-2xl font-bold text-yellow-600">{currentSuperAdmins}</span> / {maxSuperAdmins} slots used
              </p>
            </div>
            <div className="text-6xl">
              {canAddMore ? '✅' : '🚫'}
            </div>
          </div>
          {!canAddMore && (
            <p className="mt-4 text-sm text-red-600 font-semibold">
              ⚠️ Maximum SuperAdmin limit reached. Remove one to add another.
            </p>
          )}
        </div>

        {/* Current SuperAdmins */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Current SuperAdmins</h2>
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
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {superAdmins.map((admin) => {
                  const isOwner = admin.email === 'dibeli.my.id@gmail.com'
                  return (
                    <tr key={admin.id} className={isOwner ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {admin.image && (
                            <img
                              src={admin.image}
                              alt={admin.name || 'User'}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {admin.name}
                              {isOwner && (
                                <span className="ml-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full font-semibold">
                                  OWNER
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.store ? (
                          <a
                            href={`/${admin.store.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {admin.store.name}
                          </a>
                        ) : (
                          'No store'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {admin.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {isOwner ? (
                          <span className="text-gray-400">Cannot remove owner</span>
                        ) : (
                          <RemoveAdminButton userId={admin.id} userName={admin.name || 'User'} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add SuperAdmin */}
        {canAddMore && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Add New SuperAdmin</h2>
              <p className="text-sm text-gray-600 mt-1">
                Promote a user to SuperAdmin (max {maxSuperAdmins} total)
              </p>
            </div>
            <div className="p-6">
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
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {regularUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
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
                          {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <PromoteUserButton userId={user.id} userName={user.name || 'User'} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
