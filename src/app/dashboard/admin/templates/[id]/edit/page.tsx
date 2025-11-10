import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/AdminLayout'
import AdminTemplateForm from '../../AdminTemplateForm'
import { TEMPLATE_INFO } from '@/components/store-templates/registry'
import type { StoreTemplateId } from '@/components/store-templates/registry'

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminEditTemplatePage({ params }: PageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get template data from registry
  const templateId = params.id as StoreTemplateId
  const template = TEMPLATE_INFO[templateId]

  if (!template) {
    redirect('/dashboard/admin/templates')
  }

  // Convert to form data format
  const initialData = {
    id: templateId,
    name: template.name,
    description: template.description,
    thumbnail: template.thumbnail || '',
    tier: template.tier,
    config: {
      nav: '',
      hero: '',
      productCard: '',
      footer: '',
      background: '',
    }
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
          <h1 className="text-3xl font-bold text-gray-900">✏️ Edit Template</h1>
          <p className="mt-2 text-gray-600">
            Edit template: <strong>{template.name}</strong> (ID: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{templateId}</code>)
          </p>
        </div>

        {/* Alert */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-yellow-800">Read-Only Mode</p>
              <p className="text-sm text-yellow-700 mt-1">
                Templates dari registry (TEMPLATE_INFO) bersifat read-only. 
                Edit hanya untuk preview - tidak akan tersimpan ke file system.
                Untuk template baru, gunakan <a href="/dashboard/admin/templates/create" className="underline font-semibold">Create Template</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <AdminTemplateForm 
          mode="edit" 
          templateId={templateId}
          initialData={initialData}
        />
      </div>
    </AdminLayout>
  )
}
