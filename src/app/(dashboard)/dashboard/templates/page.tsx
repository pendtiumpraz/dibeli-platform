import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TEMPLATE_PACKAGES } from '@/lib/template-combiner'
import TemplateMarketplace from './TemplateMarketplace'

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      tier: true,
    },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      templateId: true,
    },
  })

  if (!store) {
    redirect('/dashboard/stores/new')
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Template Marketplace
        </h1>
        <p className="text-gray-600">
          Pilih template yang sesuai dengan brand toko Anda
        </p>
      </div>

      <TemplateMarketplace 
        templates={TEMPLATE_PACKAGES} 
        userTier={user.tier}
        storeId={store.id}
        storeSlug={store.slug}
        currentTemplateId={store.templateId}
      />
    </div>
  )
}
