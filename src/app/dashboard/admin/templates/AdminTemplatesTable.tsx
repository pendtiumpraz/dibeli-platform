'use client'

import { useState } from 'react'
import { TEMPLATE_INFO } from '@/components/store-templates/registry'
import type { StoreTemplateId } from '@/components/store-templates/registry'

interface AdminTemplatesTableProps {}

export default function AdminTemplatesTable({}: AdminTemplatesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<'ALL' | 'FREE' | 'PREMIUM' | 'UNLIMITED'>('ALL')
  const [previewTemplate, setPreviewTemplate] = useState<{ id: string, name: string } | null>(null)
  const allTemplates = Object.entries(TEMPLATE_INFO)
  
  // Filter templates
  const filteredTemplates = allTemplates.filter(([id, template]) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === 'ALL' || template.tier === filterTier
    return matchesSearch && matchesTier
  })

  const totalTemplates = allTemplates.length
  const freeCount = allTemplates.filter(([_, t]) => t.tier === 'FREE').length
  const premiumCount = allTemplates.filter(([_, t]) => t.tier === 'PREMIUM').length
  const unlimitedCount = allTemplates.filter(([_, t]) => t.tier === 'UNLIMITED').length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Templates</div>
          <div className="text-2xl font-bold text-gray-900">{totalTemplates}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">FREE Tier</div>
          <div className="text-2xl font-bold text-gray-600">{freeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">PREMIUM Tier</div>
          <div className="text-2xl font-bold text-blue-600">{premiumCount}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">UNLIMITED Tier</div>
          <div className="text-2xl font-bold text-purple-600">{unlimitedCount}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates by name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter by Tier */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTier('ALL')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterTier === 'ALL'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({totalTemplates})
            </button>
            <button
              onClick={() => setFilterTier('FREE')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterTier === 'FREE'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Free ({freeCount})
            </button>
            <button
              onClick={() => setFilterTier('PREMIUM')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterTier === 'PREMIUM'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Premium ({premiumCount})
            </button>
            <button
              onClick={() => setFilterTier('UNLIMITED')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                filterTier === 'UNLIMITED'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unlimited ({unlimitedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No templates found
                  </td>
                </tr>
              ) : (
                filteredTemplates.map(([id, template]) => (
                  <tr key={id} className="hover:bg-gray-50">
                    {/* Preview Thumbnail */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-20 h-14 object-cover rounded shadow-sm"
                      />
                    </td>

                    {/* Template Info */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-bold text-gray-900">{template.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{template.description}</div>
                      </div>
                    </td>

                    {/* Template ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{id}</code>
                    </td>

                    {/* Tier Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        template.tier === 'FREE' ? 'bg-gray-100 text-gray-800' :
                        template.tier === 'PREMIUM' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {template.tier}
                      </span>
                    </td>

                    {/* Features Count */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.features.length} features
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setPreviewTemplate({ id, name: template.name })}
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      >
                        View
                      </button>
                      <a
                        href={`/dashboard/admin/templates/${id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => {
                          if (confirm(`Delete template "${template.name}"?`)) {
                            alert('Delete functionality coming soon!')
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Admin CRUD:</strong> These are the store templates from registry (TEMPLATE_INFO).
          Showing {filteredTemplates.length} of {totalTemplates} templates.
          Same templates used in <a href="/dashboard/store/template" className="underline font-semibold">Store → Template Selector</a>.
        </p>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  👁️ Template Preview
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {previewTemplate.name} - ID: <code className="bg-gray-200 px-2 py-1 rounded text-xs">{previewTemplate.id}</code>
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                title="Close preview"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - iframe */}
            <div className="flex-1 overflow-hidden relative bg-gray-100">
              <iframe
                src={`/toko/demo?template=${previewTemplate.id}`}
                className="w-full h-full border-0"
                title={`Preview ${previewTemplate.name}`}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Preview dengan demo data
                </span>
              </p>
              <div className="flex gap-2">
                <a
                  href={`/toko/demo?template=${previewTemplate.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Open in New Tab
                </a>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
