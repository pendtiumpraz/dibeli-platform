'use client'

export function DeleteTemplateButton({ templateId, templateName }: { templateId: string, templateName: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm(`Delete template "${templateName}"?`)) {
      e.preventDefault()
    }
  }

  return (
    <form
      action="/api/admin/templates/delete"
      method="POST"
      className="inline"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="templateId" value={templateId} />
      <button
        type="submit"
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>
    </form>
  )
}
