'use client'

import { useState } from 'react'
import { TemplatePackage } from '@/lib/template-combiner'
import Image from 'next/image'

interface TemplateMarketplaceProps {
  templates: TemplatePackage[]
  userTier: string
  storeId: string
  storeSlug: string
  currentTemplateId: string
}

export default function TemplateMarketplace({
  templates,
  userTier,
  storeId,
  storeSlug,
  currentTemplateId,
}: TemplateMarketplaceProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'FREE' | 'PREMIUM' | 'UNLIMITED'>('ALL')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeTemplateId, setActiveTemplateId] = useState(currentTemplateId)

  const filteredTemplates = templates.filter((template) => {
    if (filter === 'ALL') return true
    return template.tier === filter
  })

  const canUseTemplate = (template: TemplatePackage) => {
    if (template.tier === 'FREE') return true
    if (template.tier === 'PREMIUM') return userTier === 'PREMIUM' || userTier === 'UNLIMITED'
    if (template.tier === 'UNLIMITED') return userTier === 'UNLIMITED'
    return false
  }

  const handlePreview = (templateId: string) => {
    setPreviewUrl(`/api/template-render-test?templateId=${templateId}`)
  }

  const handleApplyTemplate = async (templateId: string) => {
    if (!canUseTemplate(templates.find((t) => t.id === templateId)!)) {
      alert('Upgrade to PREMIUM to use this template!')
      return
    }

    try {
      const response = await fetch(`/api/stores/${storeId}/template`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
      })

      if (response.ok) {
        setActiveTemplateId(templateId)
        alert('Template applied successfully! Visit your store to see the changes.')
        // Optionally redirect or just update UI
      } else {
        alert('Failed to apply template')
      }
    } catch (error) {
      console.error('Error applying template:', error)
      alert('Error applying template')
    }
  }

  return (
    <div>
      {/* Current Active Template */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <i className="fas fa-check-circle text-blue-600 text-2xl"></i>
          <div>
            <p className="font-semibold text-blue-900">Currently Active Template</p>
            <p className="text-blue-700">
              {templates.find(t => t.id === activeTemplateId)?.name || 'Modern Minimal'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'ALL'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({templates.length})
        </button>
        <button
          onClick={() => setFilter('FREE')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'FREE'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Free ({templates.filter(t => t.tier === 'FREE').length})
        </button>
        <button
          onClick={() => setFilter('PREMIUM')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'PREMIUM'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Premium ({templates.filter(t => t.tier === 'PREMIUM').length})
        </button>
        <button
          onClick={() => setFilter('UNLIMITED')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'UNLIMITED'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Unlimited ({templates.filter(t => t.tier === 'UNLIMITED').length})
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isLocked = !canUseTemplate(template)
          const isActive = template.id === activeTemplateId

          return (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                isActive ? 'ring-4 ring-green-500' : ''
              } ${isLocked ? 'opacity-75' : ''}`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
                {isActive && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <i className="fas fa-check"></i> ACTIVE
                  </div>
                )}
                {template.tier === 'PREMIUM' && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </div>
                )}
                {template.tier === 'UNLIMITED' && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                    UNLIMITED
                  </div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-lock text-white text-4xl mb-2"></i>
                      <p className="text-white font-semibold">
                        {template.tier === 'UNLIMITED' ? 'Upgrade to Unlimited' : 'Upgrade to Premium'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(template.id)}
                    className="flex-1 px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleApplyTemplate(template.id)}
                    disabled={isLocked || isActive}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isActive
                        ? 'bg-green-500 text-white cursor-default'
                        : isLocked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-green-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isActive ? 'Active' : isLocked ? 'Locked' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Template Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full"
                title="Template Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {userTier === 'GRATIS' && (
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Unlock All Premium Templates
          </h2>
          <p className="text-lg mb-6 opacity-95">
            Upgrade to Premium dan dapatkan akses ke semua template professional!
          </p>
          <button className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:shadow-2xl transition-all">
            Upgrade Now - Rp 99.000/bulan
          </button>
        </div>
      )}
    </div>
  )
}
