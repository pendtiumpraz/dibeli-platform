import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/AdminLayout'
import AdminTemplatesTable from './AdminTemplatesTable'

export default async function AdminTemplatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  return (
    <AdminLayout user={session.user}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <a
              href="/dashboard/admin"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to Admin Panel
            </a>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Template Management</h1>
            <p className="text-gray-600">
              Manage all store templates (CRUD operations)
            </p>
          </div>
          <a
            href="/dashboard/admin/templates/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Create Template
          </a>
        </div>

        <AdminTemplatesTable />
      </div>
    </AdminLayout>
  )
}
