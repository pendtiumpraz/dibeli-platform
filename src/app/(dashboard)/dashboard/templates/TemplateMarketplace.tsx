'use client'

import { useState } from 'react'
import { TemplatePackage } from '@/lib/template-combiner'
import Image from 'next/image'

interface TemplateMarketplaceProps {
  templates: TemplatePackage[]
  userTier: string
  storeId: string
  storeSlug: string
}

export default function TemplateMarketplace({
  templates,
  userTier,
  storeId,
  storeSlug,
}: TemplateMarketplaceProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const filteredTemplates = templates.filter((template) => {
    if (filter === 'ALL') return true
    return template.tier === filter
  })

  const canUseTemplate = (template: TemplatePackage) => {
    if (template.tier === 'FREE') return true
    return userTier === 'PREMIUM' || userTier === 'UNLIMITED'
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
        alert('Template applied successfully!')
        window.location.href = `/toko/${storeSlug}`
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
      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'ALL'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Templates
        </button>
        <button
          onClick={() => setFilter('FREE')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'FREE'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Free
        </button>
        <button
          onClick={() => setFilter('PREMIUM')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            filter === 'PREMIUM'
              ? 'bg-gradient-to-r from-purple-600 to-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Premium
        </button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isLocked = !canUseTemplate(template)

          return (
            <div
              key={template.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl ${
                selectedTemplate === template.id ? 'ring-4 ring-purple-500' : ''
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
                {template.tier !== 'FREE' && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </div>
                )}
                {isLocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-lock text-white text-4xl mb-2"></i>
                      <p className="text-white font-semibold">Upgrade to Premium</p>
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
                    disabled={isLocked}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isLocked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-green-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {isLocked ? 'Locked' : 'Apply'}
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
