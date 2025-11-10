'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminTemplateFormProps {
  mode: 'create' | 'edit'
  templateId?: string
  initialData?: TemplateFormData
}

interface TemplateFormData {
  id: string
  name: string
  description: string
  thumbnail: string
  tier: 'FREE' | 'PREMIUM' | 'UNLIMITED'
  config: {
    nav?: string
    hero?: string
    productCard: string
    footer?: string
    background?: string
  }
}

export default function AdminTemplateForm({ mode, templateId, initialData }: AdminTemplateFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // API Keys
  const [hasGeminiKey, setHasGeminiKey] = useState(false)
  const [hasGroqKey, setHasGroqKey] = useState(false)

  // Form data
  const [formData, setFormData] = useState<TemplateFormData>(initialData || {
    id: '',
    name: '',
    description: '',
    thumbnail: '',
    tier: 'FREE',
    config: {
      nav: '',
      hero: '',
      productCard: '',
      footer: '',
      background: '',
    }
  })

  // AI prompt
  const [aiPrompt, setAiPrompt] = useState('')

  useEffect(() => {
    checkApiKeys()
  }, [])

  const checkApiKeys = async () => {
    try {
      const res = await fetch('/api/user/check-api-keys')
      if (res.ok) {
        const data = await res.json()
        setHasGeminiKey(data.hasGeminiKey)
        setHasGroqKey(data.hasGroqKey)
      }
    } catch (error) {
      console.error('Failed to check API keys:', error)
    }
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setMessage({ type: 'error', text: 'Please enter a description for AI generation' })
      return
    }

    if (!hasGeminiKey && !hasGroqKey) {
      setMessage({ 
        type: 'error', 
        text: 'No API keys found! Please save API keys in Admin Settings first.' 
      })
      return
    }

    setAiGenerating(true)
    setMessage(null)

    try {
      const res = await fetch('/api/ai/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          tier: formData.tier,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setFormData({
          ...formData,
          name: data.name || formData.name,
          description: data.description || formData.description,
          thumbnail: data.thumbnail || formData.thumbnail,
          config: {
            nav: data.config?.nav || formData.config.nav,
            hero: data.config?.hero || formData.config.hero,
            productCard: data.config?.productCard || formData.config.productCard,
            footer: data.config?.footer || formData.config.footer,
            background: data.config?.background || formData.config.background,
          }
        })
        setMessage({ type: 'success', text: '✅ AI generated template data!' })
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to generate' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error generating template' })
    } finally {
      setAiGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const url = mode === 'create' 
        ? '/api/admin/templates/create' 
        : `/api/admin/templates/${templateId}/update`
      
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setMessage({ 
          type: 'success', 
          text: mode === 'create' ? '✅ Template created!' : '✅ Template updated!' 
        })
        setTimeout(() => router.push('/dashboard/admin/templates'), 1500)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save template' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving template' })
    } finally {
      setSaving(false)
    }
  }

  const hasApiKeys = hasGeminiKey || hasGroqKey

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* API Keys Status */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">🔑 API Keys Status</h3>
            <p className="text-sm text-gray-600">
              {hasApiKeys ? (
                <>✅ Keys available: {hasGeminiKey && 'Gemini'} {hasGroqKey && 'Groq'}</>
              ) : (
                <>❌ No API keys found!</>
              )}
            </p>
          </div>
          {!hasApiKeys && (
            <a 
              href="/dashboard/admin/settings"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Add Keys
            </a>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* AI Generation Section */}
      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 AI Template Generator</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your template
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Modern e-commerce template with gradient hero, card hover effects, and premium footer. Suitable for fashion stores."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={aiGenerating || !hasApiKeys}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {aiGenerating ? '⏳ Generating...' : '✨ Generate with AI'}
          </button>
        </div>
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Template Details</h3>

        {/* Template ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template ID *
          </label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="modern-luxury"
            required
            disabled={mode === 'edit'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">Lowercase, use hyphens. Cannot be changed after creation.</p>
        </div>

        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Modern Luxury"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Premium gradient hero + luxury nav + overlay cards"
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail URL *
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            placeholder="https://images.unsplash.com/photo-..."
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <img src={formData.thumbnail} alt="Preview" className="w-32 h-24 object-cover rounded" />
            </div>
          )}
        </div>

        {/* Tier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tier *
          </label>
          <select
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="FREE">FREE</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="UNLIMITED">UNLIMITED</option>
          </select>
        </div>

        {/* Config Section */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900">Template Configuration</h4>

          {/* Nav */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Navigation Component
            </label>
            <input
              type="text"
              value={formData.config.nav || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                config: { ...formData.config, nav: e.target.value }
              })}
              placeholder="premium-nav"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Hero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Component
            </label>
            <input
              type="text"
              value={formData.config.hero || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                config: { ...formData.config, hero: e.target.value }
              })}
              placeholder="gradient-hero"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Product Card */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Card Component *
            </label>
            <input
              type="text"
              value={formData.config.productCard}
              onChange={(e) => setFormData({ 
                ...formData, 
                config: { ...formData.config, productCard: e.target.value }
              })}
              placeholder="card-hover-overlay"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Footer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer Component
            </label>
            <input
              type="text"
              value={formData.config.footer || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                config: { ...formData.config, footer: e.target.value }
              })}
              placeholder="ultimate-footer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background
            </label>
            <input
              type="text"
              value={formData.config.background || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                config: { ...formData.config, background: e.target.value }
              })}
              placeholder="gradient-bg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Update Template'}
          </button>
        </div>
      </form>
    </div>
  )
}
