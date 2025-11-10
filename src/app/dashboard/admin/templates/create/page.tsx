import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/AdminLayout'
import AdminTemplateForm from '../AdminTemplateForm'

export default async function AdminCreateTemplatePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  return (
    <AdminLayout user={session.user}>
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard/admin/templates"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Templates
          </a>
          <h1 className="text-3xl font-bold text-gray-900">✨ Create New Template</h1>
          <p className="mt-2 text-gray-600">
            Create custom template configuration with AI assistance
          </p>
        </div>

        {/* Form */}
        <AdminTemplateForm mode="create" />
      </div>
    </AdminLayout>
  )
}
