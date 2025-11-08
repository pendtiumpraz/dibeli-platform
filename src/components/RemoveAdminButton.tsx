'use client'

export function RemoveAdminButton({ userId, userName }: { userId: string, userName: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm(`Remove ${userName} as SuperAdmin?`)) {
      e.preventDefault()
    }
  }

  return (
    <form
      action="/api/admin/roles/remove"
      method="POST"
      className="inline"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-900"
      >
        Remove Role
      </button>
    </form>
  )
}
