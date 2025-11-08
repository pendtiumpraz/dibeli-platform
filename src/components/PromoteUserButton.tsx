'use client'

export function PromoteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm(`Promote ${userName} to SuperAdmin?`)) {
      e.preventDefault()
    }
  }

  return (
    <form
      action="/api/admin/roles/promote"
      method="POST"
      className="inline"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
      >
        👑 Promote to SuperAdmin
      </button>
    </form>
  )
}
