'use client'

import { useState } from 'react'

interface CustomColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

interface ColorPickerProps {
  storeId: string
  currentColors: CustomColors | null
  userTier: string
  canCustomize: boolean
  canCustomizeFull: boolean
}

const DEFAULT_COLORS: CustomColors = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#111827',
}

export default function ColorPicker({ storeId, currentColors, userTier, canCustomize, canCustomizeFull }: ColorPickerProps) {
  const [colors, setColors] = useState<CustomColors>(currentColors || DEFAULT_COLORS)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    // Check if this field is allowed for user's tier
    if (!canCustomize) return
    if (!canCustomizeFull && (key === 'accent' || key === 'background' || key === 'text')) return

    setColors({ ...colors, [key]: value })
  }

  const handleSave = async () => {
    if (!canCustomize) {
      setMessage({ type: 'error', text: 'Upgrade ke PREMIUM untuk customize colors!' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/store/colors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customColors: colors }),
      })

      if (!response.ok) throw new Error('Failed to save')

      setMessage({ type: 'success', text: 'Colors berhasil disimpan! Cek toko Anda untuk melihat perubahan.' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menyimpan colors. Silakan coba lagi.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setColors(DEFAULT_COLORS)
    setMessage(null)
  }

  const colorFields: Array<{ key: keyof CustomColors, label: string, description: string, restricted: boolean }> = [
    { key: 'primary', label: 'Primary Color', description: 'Warna utama brand (buttons, links)', restricted: false },
    { key: 'secondary', label: 'Secondary Color', description: 'Warna sekunder (accents, borders)', restricted: false },
    { key: 'accent', label: 'Accent Color', description: 'Warna highlight (badges, tags)', restricted: !canCustomizeFull },
    { key: 'background', label: 'Background Color', description: 'Warna background utama', restricted: !canCustomizeFull },
    { key: 'text', label: 'Text Color', description: 'Warna teks utama', restricted: !canCustomizeFull },
  ]

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Color Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎨 Preview</h3>
        <div 
          className="h-48 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: colors.background }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
          }}></div>
          <div className="relative z-10 text-center space-y-4">
            <h4 className="text-2xl font-bold" style={{ color: colors.text }}>
              Preview Toko
            </h4>
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-3 rounded-lg font-semibold shadow-lg"
                style={{ backgroundColor: colors.primary, color: '#ffffff' }}
              >
                Primary Button
              </button>
              <button
                className="px-6 py-3 rounded-lg font-semibold shadow-lg"
                style={{ backgroundColor: colors.secondary, color: '#ffffff' }}
              >
                Secondary
              </button>
            </div>
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: colors.accent, color: '#ffffff' }}
            >
              Accent Badge
            </span>
          </div>
        </div>
      </div>

      {/* Color Inputs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">🎨 Customize Colors</h3>
        <div className="space-y-5">
          {colorFields.map(({ key, label, description, restricted }) => (
            <div key={key} className={`relative ${restricted && !canCustomize ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Color Picker */}
                <div className="relative">
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    disabled={!canCustomize || restricted}
                    className={`h-14 w-20 cursor-pointer rounded-lg border-2 border-gray-300 ${
                      (!canCustomize || restricted) ? 'cursor-not-allowed' : 'hover:border-gray-400'
                    }`}
                  />
                  {restricted && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <span className="text-white text-2xl">🔒</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="font-semibold text-gray-900">{label}</label>
                    {restricted && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-bold">
                        UNLIMITED Only
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{description}</p>
                  <input
                    type="text"
                    value={colors[key]}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        handleColorChange(key, e.target.value)
                      }
                    }}
                    disabled={!canCustomize || restricted}
                    className={`mt-2 px-3 py-2 border rounded-lg font-mono text-sm w-32 ${
                      (!canCustomize || restricted) 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={!canCustomize || isSaving}
          className={`flex-1 py-4 rounded-lg font-bold text-lg transition-all ${
            canCustomize
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSaving ? 'Menyimpan...' : '💾 Simpan Colors'}
        </button>
        <button
          onClick={handleReset}
          disabled={!canCustomize}
          className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-bold text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄 Reset
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2">ℹ️ Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Pilih warna yang sesuai dengan brand identity Anda</li>
          <li>• Pastikan kontras text & background cukup baik (WCAG AA)</li>
          <li>• Custom colors akan diterapkan ke template toko Anda</li>
          <li>• Upgrade ke UNLIMITED untuk full customization</li>
        </ul>
      </div>
    </div>
  )
}
