import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function UserEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      store: true,
    },
  })

  if (!user) {
    redirect('/dashboard/admin')
  }

  // Form untuk update user tier & role
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard/admin"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Admin Panel
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || 'User'}
                className="w-20 h-20 rounded-full mr-4"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">User ID:</span>
              <p className="font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Created:</span>
              <p>{new Date(user.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
            {user.store && (
              <>
                <div>
                  <span className="text-gray-600">Store:</span>
                  <p className="font-semibold">{user.store.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Store URL:</span>
                  <a
                    href={`/${user.store.slug}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    /{user.store.slug}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <form action="/api/admin/update-user" method="POST" className="space-y-6">
          <input type="hidden" name="userId" value={user.id} />
          
          {/* Tier Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Subscription Tier
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tier"
                  value="TRIAL"
                  defaultChecked={user.tier === 'TRIAL'}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">🆓 Trial (14 Days)</div>
                  <div className="text-sm text-gray-600">Limited features, 14 days trial</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tier"
                  value="PREMIUM"
                  defaultChecked={user.tier === 'PREMIUM'}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">💎 Premium</div>
                  <div className="text-sm text-gray-600">Full features, custom colors</div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tier"
                  value="UNLIMITED"
                  defaultChecked={user.tier === 'UNLIMITED'}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">🚀 Unlimited</div>
                  <div className="text-sm text-gray-600">All features, unlimited access</div>
                </div>
              </label>
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              User Role
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  name="isSuperAdmin"
                  defaultChecked={user.isSuperAdmin}
                  disabled={user.email === 'dibeli.my.id@gmail.com'}
                  className="mr-3"
                />
                <div>
                  <div className="font-semibold">👑 SuperAdmin</div>
                  <div className="text-sm text-gray-600">
                    Full platform access & user management
                    {user.email === 'dibeli.my.id@gmail.com' && (
                      <span className="ml-2 text-purple-600">(Owner - Cannot be changed)</span>
                    )}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Save Changes
            </button>
            <a
              href="/dashboard/admin"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
