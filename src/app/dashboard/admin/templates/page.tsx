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
        <div className="mb-8">
          <a
            href="/dashboard/admin"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Admin Panel
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Template Gallery</h1>
          <p className="text-gray-600">
            View all available store templates (Read-only)
          </p>
        </div>

        <AdminTemplatesTable />
      </div>
    </AdminLayout>
  )
}
