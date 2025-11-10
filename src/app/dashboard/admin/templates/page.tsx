import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/AdminLayout'
import { TEMPLATE_INFO } from '@/components/store-templates/registry'
import type { StoreTemplateId } from '@/components/store-templates/registry'
import Link from 'next/link'

export default async function AdminTemplatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get ACTUAL store templates being used (not database templates)
  const templates = Object.entries(TEMPLATE_INFO).map(([templateId, info]) => ({
    templateId,
    ...info,
  }))

  // Stats based on ACTUAL templates
  const totalTemplates = templates.length
  const freeTemplates = templates.filter(t => t.tier === 'FREE').length
  const premiumTemplates = templates.filter(t => t.tier === 'PREMIUM').length
  const unlimitedTemplates = templates.filter(t => t.tier === 'UNLIMITED').length

  return (
    <AdminLayout user={session.user}>
      <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <a
            href="/dashboard/admin"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Admin Panel
          </a>
          <h1 className="text-3xl font-bold text-gray-900">🎨 Template Management</h1>
          <p className="mt-2 text-gray-600">
            Manage, approve, and publish templates
          </p>
        </div>
        <a
          href="/dashboard/admin/templates/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          + Create Template
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Templates</div>
          <div className="text-2xl font-bold text-gray-900">{totalTemplates}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">FREE Tier</div>
          <div className="text-2xl font-bold text-blue-600">{freeTemplates}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">PREMIUM Tier</div>
          <div className="text-2xl font-bold text-purple-600">{premiumTemplates}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">UNLIMITED Tier</div>
          <div className="text-2xl font-bold text-pink-600">{unlimitedTemplates}</div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.templateId} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden hover:border-blue-400 transition-all">
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100">
              {template.thumbnail ? (
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                </div>
              )}
              
              {/* Tier Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  template.tier === 'FREE' ? 'bg-blue-100 text-blue-800' :
                  template.tier === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                  'bg-pink-100 text-pink-800'
                }`}>
                  {template.tier}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="text-xs text-gray-500">+{template.features.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/store/template`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Preview
                </Link>
                <Link
                  href={`/dashboard/store/template`}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Apply
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Note:</strong> These are the ACTUAL store templates being used in production. 
          To change templates, go to <Link href="/dashboard/store/template" className="underline font-semibold">Store Settings → Template</Link>.
        </p>
      </div>
      </div>
    </AdminLayout>
  )
}
