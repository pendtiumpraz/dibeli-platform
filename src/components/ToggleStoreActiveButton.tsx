'use client'

export function ToggleStoreActiveButton({ 
  storeId, 
  storeName, 
  isPublished 
}: { 
  storeId: string
  storeName: string
  isPublished: boolean 
}) {
  const handleSubmit = (e: React.FormEvent) => {
    const action = isPublished ? 'menonaktifkan' : 'mengaktifkan'
    if (!confirm(`${action} toko "${storeName}"?`)) {
      e.preventDefault()
    }
  }

  return (
    <form
      action="/api/admin/stores/toggle-active"
      method="POST"
      className="inline"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="storeId" value={storeId} />
      <input type="hidden" name="isPublished" value={(!isPublished).toString()} />
      <button
        type="submit"
        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
          isPublished
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isPublished ? '❌ Nonaktifkan' : '✅ Aktifkan'}
      </button>
    </form>
  )
}
