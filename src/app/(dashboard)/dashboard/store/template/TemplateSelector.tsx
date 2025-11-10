'use client'

import { useState } from 'react'
import { TEMPLATE_INFO, canAccessTemplate } from '@/components/store-templates/registry'
import type { StoreTemplateId } from '@/components/store-templates/registry'
import Link from 'next/link'

interface TemplateSelectorProps {
  currentTemplateId: string
  storeSlug: string
  userTier: string
}

export default function TemplateSelector({ currentTemplateId, storeSlug, userTier }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(currentTemplateId || 'simple-classic')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSelectTemplate = async (templateId: string) => {
    const template = TEMPLATE_INFO[templateId as StoreTemplateId]
    
    if (!canAccessTemplate(userTier, template.tier)) {
      setMessage({
        type: 'error',
        text: `Template ini membutuhkan tier ${template.tier}. Upgrade akun Anda untuk mengakses template ini.`
      })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/store/template', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update template')
      }

      setSelectedTemplate(templateId)
      setMessage({
        type: 'success',
        text: 'Template berhasil diupdate! Refresh halaman toko Anda untuk melihat perubahan.'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Gagal mengupdate template. Silakan coba lagi.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tierOrder = { FREE: 0, PREMIUM: 1, UNLIMITED: 2 }
  const groupedTemplates = {
    FREE: Object.entries(TEMPLATE_INFO).filter(([_, t]) => t.tier === 'FREE'),
    PREMIUM: Object.entries(TEMPLATE_INFO).filter(([_, t]) => t.tier === 'PREMIUM'),
    UNLIMITED: Object.entries(TEMPLATE_INFO).filter(([_, t]) => t.tier === 'UNLIMITED'),
  }

  return (
    <div className="space-y-8">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-medium">{message.text}</p>
          {message.type === 'success' && (
            <Link 
              href={`/toko/${storeSlug}`} 
              target="_blank"
              className="text-sm underline mt-2 inline-block"
            >
              Lihat Toko →
            </Link>
          )}
        </div>
      )}

      {/* Current Template */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">✨ Template Aktif</h3>
            <p className="text-2xl font-black text-indigo-600">
              {TEMPLATE_INFO[selectedTemplate as StoreTemplateId]?.name || 'Simple Classic'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {TEMPLATE_INFO[selectedTemplate as StoreTemplateId]?.description}
            </p>
          </div>
          <Link
            href={`/toko/${storeSlug}`}
            target="_blank"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Preview →
          </Link>
        </div>
      </div>

      {/* User Tier Badge */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
        <div>
          <p className="text-sm text-gray-600">Tier Akun Anda:</p>
          <p className={`text-lg font-bold ${
            userTier === 'UNLIMITED' ? 'text-purple-600' :
            userTier === 'PREMIUM' ? 'text-blue-600' :
            'text-gray-600'
          }`}>
            {userTier === 'UNLIMITED' ? '👑' : userTier === 'PREMIUM' ? '💎' : '🆓'} {userTier}
          </p>
        </div>
        {userTier !== 'UNLIMITED' && (
          <Link
            href="/dashboard/settings"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Upgrade Akun
          </Link>
        )}
      </div>

      {/* Template Grid by Tier */}
      {Object.entries(groupedTemplates).map(([tier, templates]) => (
        <div key={tier} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className={`text-2xl font-black ${
              tier === 'UNLIMITED' ? 'text-purple-600' :
              tier === 'PREMIUM' ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {tier === 'UNLIMITED' ? '👑' : tier === 'PREMIUM' ? '💎' : '🆓'} {tier} TEMPLATES
            </h2>
            {!canAccessTemplate(userTier, tier) && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                🔒 Upgrade Required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(([id, template]) => {
              const isSelected = selectedTemplate === id
              const canAccess = canAccessTemplate(userTier, template.tier)
              
              return (
                <div
                  key={id}
                  className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all ${
                    isSelected 
                      ? 'border-indigo-500 shadow-lg' 
                      : canAccess
                      ? 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      : 'border-gray-200 opacity-60'
                  }`}
                >
                  {/* Lock Overlay */}
                  {!canAccess && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🔒</div>
                        <p className="font-bold text-gray-700">Upgrade to {template.tier}</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold z-20">
                      ✓ Active
                    </div>
                  )}

                  {/* Template Preview Placeholder */}
                  <div className={`h-48 bg-gradient-to-br ${
                    tier === 'UNLIMITED' 
                      ? 'from-purple-100 to-pink-100' 
                      : tier === 'PREMIUM'
                      ? 'from-blue-100 to-indigo-100'
                      : 'from-gray-100 to-gray-200'
                  } flex items-center justify-center`}>
                    <div className="text-6xl opacity-50">
                      {tier === 'UNLIMITED' ? '👑' : tier === 'PREMIUM' ? '💎' : '📄'}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                    {/* Features */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Features:</p>
                      <ul className="space-y-1">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-indigo-600">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                        {template.features.length > 3 && (
                          <li className="text-xs text-gray-500">
                            +{template.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Action Button */}
                    {canAccess && (
                      <button
                        onClick={() => handleSelectTemplate(id)}
                        disabled={isLoading || isSelected}
                        className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                          isSelected
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isSelected ? 'Currently Active' : 'Select Template'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
