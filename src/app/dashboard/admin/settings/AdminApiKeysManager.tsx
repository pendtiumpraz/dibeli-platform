'use client'

import { useState, useEffect } from 'react'

export default function AdminApiKeysManager() {
  const [geminiApiKey, setGeminiApiKey] = useState('')
  const [groqApiKey, setGroqApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [hasGeminiKey, setHasGeminiKey] = useState(false)
  const [hasGroqKey, setHasGroqKey] = useState(false)

  useEffect(() => {
    checkExistingKeys()
  }, [])

  const checkExistingKeys = async () => {
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

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: geminiApiKey || undefined,
          groqApiKey: groqApiKey || undefined,
        }),
      })

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ API keys berhasil disimpan!' })
        setGeminiApiKey('')
        setGroqApiKey('')
        // Recheck keys
        setTimeout(checkExistingKeys, 500)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Gagal menyimpan API keys' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving API keys' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border-2 ${hasGeminiKey ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Gemini API Key</span>
            <span className={`text-2xl ${hasGeminiKey ? 'text-green-600' : 'text-gray-400'}`}>
              {hasGeminiKey ? '✅' : '❌'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {hasGeminiKey ? 'Tersimpan di database' : 'Belum disimpan'}
          </p>
        </div>

        <div className={`p-4 rounded-lg border-2 ${hasGroqKey ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">Groq API Key</span>
            <span className={`text-2xl ${hasGroqKey ? 'text-green-600' : 'text-gray-400'}`}>
              {hasGroqKey ? '✅' : '❌'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {hasGroqKey ? 'Tersimpan di database' : 'Belum disimpan'}
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Gemini API Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🔵 Gemini API Key (Google)
        </label>
        <input
          type="password"
          value={geminiApiKey}
          onChange={(e) => setGeminiApiKey(e.target.value)}
          placeholder={hasGeminiKey ? '••••••••••••••••••••••••••••••• (sudah disimpan)' : 'AIzaSy...'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-2 text-sm text-gray-600">
          Gratis! Dapatkan di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" className="text-blue-600 hover:underline font-semibold">Google AI Studio</a>
        </p>
      </div>

      {/* Groq API Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🟢 Groq API Key (Recommended - Faster!)
        </label>
        <input
          type="password"
          value={groqApiKey}
          onChange={(e) => setGroqApiKey(e.target.value)}
          placeholder={hasGroqKey ? '••••••••••••••••••••••••••••••• (sudah disimpan)' : 'gsk_...'}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="mt-2 text-sm text-gray-600">
          Gratis! Dapatkan di <a href="https://console.groq.com/keys" target="_blank" rel="noopener" className="text-green-600 hover:underline font-semibold">Groq Console</a>
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || (!geminiApiKey && !groqApiKey)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? 'Menyimpan...' : 'Simpan API Keys'}
      </button>

      {/* Info Box */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Cara Pakai:</h3>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Save API key di sini (cukup sekali)</li>
          <li>Go to Create/Edit Template</li>
          <li>Click "AI Generate" → No need input API key!</li>
          <li>API key auto-loaded dari database</li>
        </ol>
      </div>
    </div>
  )
}
