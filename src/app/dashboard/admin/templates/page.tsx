import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminLayout from '@/components/AdminLayout'
import { TEMPLATE_PACKAGES, type TemplatePackage } from '@/lib/template-combiner'
import Image from 'next/image'

export default async function AdminTemplatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.isSuperAdmin) {
    redirect('/dashboard')
  }

  // Get ACTUAL templates (same as user dashboard/templates)
  const templates: TemplatePackage[] = TEMPLATE_PACKAGES

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
          <div key={template.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl border-2 border-gray-200 hover:border-blue-400">
            {/* Thumbnail */}
            <div className="relative h-48 bg-gray-200">
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover"
              />
              
              {/* Tier Badge */}
              <div className="absolute top-3 right-3">
                {template.tier === 'PREMIUM' && (
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </div>
                )}
                {template.tier === 'UNLIMITED' && (
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                    UNLIMITED
                  </div>
                )}
                {template.tier === 'FREE' && (
                  <div className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    FREE
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {template.description}
              </p>

              {/* Template ID */}
              <p className="text-xs text-gray-500 mb-4">
                ID: <code className="bg-gray-100 px-2 py-1 rounded">{template.id}</code>
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <a
                  href={`/api/template-render-test?templateId=${template.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all text-center"
                >
                  👁️ Preview
                </a>
                <a
                  href="/dashboard/templates"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-center"
                >
                  📋 Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Note:</strong> These are the ACTUAL store templates from template-combiner system. 
          Same templates shown in user <a href="/dashboard/templates" className="underline font-semibold">Dashboard → Templates</a>.
          Total: {totalTemplates} templates ({freeTemplates} FREE, {premiumTemplates} PREMIUM, {unlimitedTemplates} UNLIMITED)
        </p>
      </div>
      </div>
    </AdminLayout>
  )
}
