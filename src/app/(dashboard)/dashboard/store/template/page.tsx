import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import TemplateSelector from './TemplateSelector'

export default async function StoreTemplatePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
  })

  if (!store) {
    redirect('/dashboard/store/create')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Pilih Template Toko</h1>
        <p className="text-gray-600">
          Pilih desain tampilan untuk toko online Anda. Template berbeda tersedia berdasarkan tier akun Anda.
        </p>
      </div>

      <TemplateSelector 
        currentTemplateId={store.templateId}
        storeSlug={store.slug}
        userTier={session.user.tier}
      />
    </div>
  )
}
