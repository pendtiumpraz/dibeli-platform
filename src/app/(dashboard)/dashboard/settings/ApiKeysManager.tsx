'use client'

import { useState } from 'react'

interface ApiKeysManagerProps {
  initialGeminiKey: string
  initialGroqKey: string
}

export default function ApiKeysManager({ initialGeminiKey, initialGroqKey }: ApiKeysManagerProps) {
  const [geminiApiKey, setGeminiApiKey] = useState(initialGeminiKey)
  const [groqApiKey, setGroqApiKey] = useState(initialGroqKey)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey,
          groqApiKey,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      setMessage({ type: 'success', text: '✅ API keys berhasil disimpan! Sekarang tinggal 1-click generate!' })
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Gagal menyimpan API keys' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-300 text-green-800' 
            : 'bg-red-100 border border-red-300 text-red-800'
        }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Gemini API Key */}
      <div className="bg-white rounded-lg p-5 border-2 border-purple-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 text-3xl">✨</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Google Gemini 2.0 API Key</h3>
            <p className="text-sm text-gray-600 mb-3">
              Gratis! Dapatkan di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" className="text-purple-600 hover:underline font-semibold">Google AI Studio</a>
            </p>
          </div>
        </div>
        
        <div className="relative">
          <input
            type={showGeminiKey ? 'text' : 'password'}
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full px-4 py-3 pr-24 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            placeholder="AIzaSy..."
          />
          <button
            type="button"
            onClick={() => setShowGeminiKey(!showGeminiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showGeminiKey ? '🙈 Hide' : '👁️ Show'}
          </button>
        </div>

        {geminiApiKey && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-green-600 font-semibold">✓ Tersimpan</span>
            <button
              type="button"
              onClick={() => setGeminiApiKey('')}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Groq API Key */}
      <div className="bg-white rounded-lg p-5 border-2 border-purple-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 text-3xl">⚡</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Groq (Llama 3.1) API Key</h3>
            <p className="text-sm text-gray-600 mb-3">
              Super cepat! Dapatkan di <a href="https://console.groq.com/keys" target="_blank" rel="noopener" className="text-purple-600 hover:underline font-semibold">Groq Console</a>
            </p>
          </div>
        </div>
        
        <div className="relative">
          <input
            type={showGroqKey ? 'text' : 'password'}
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            className="w-full px-4 py-3 pr-24 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            placeholder="gsk_..."
          />
          <button
            type="button"
            onClick={() => setShowGroqKey(!showGroqKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showGroqKey ? '🙈 Hide' : '👁️ Show'}
          </button>
        </div>

        {groqApiKey && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-green-600 font-semibold">✓ Tersimpan</span>
            <button
              type="button"
              onClick={() => setGroqApiKey('')}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving || (!geminiApiKey && !groqApiKey)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {saving ? '💾 Menyimpan...' : '💾 Simpan API Keys'}
      </button>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2">ℹ️ Informasi Penting</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• API keys tersimpan secara AMAN di database (encrypted)</li>
          <li>• Hanya Anda yang bisa akses keys Anda</li>
          <li>• Setelah simpan, tinggal 1-CLICK untuk generate produk</li>
          <li>• Gemini: Gratis 1500 requests/hari</li>
          <li>• Groq: Gratis 30 requests/menit (super cepat!)</li>
        </ul>
      </div>
    </div>
  )
}
