import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/AdminLayout'
import AdminApiKeysManager from './AdminApiKeysManager'

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

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
          <h1 className="text-3xl font-bold text-gray-900">⚙️ Admin Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage API keys and system settings
          </p>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔑 AI API Keys</h2>
          <p className="text-sm text-gray-600 mb-6">
            API keys untuk AI template generation (Create & Edit templates)
          </p>
          <AdminApiKeysManager />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Note:</strong> API keys ini akan digunakan untuk fitur AI generation di create/edit template.
            Simpan sekali, pakai berkali-kali!
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
