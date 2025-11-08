import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get available templates from database
  const templates = await prisma.template.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get user's store
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Template Marketplace</h1>
        <p className="mt-2 text-gray-600">
          Pilih template toko yang sesuai dengan brand Anda
        </p>
        {/* User Tier Info */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-sm text-gray-600">Your Plan:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            session.user.tier === 'TRIAL' ? 'bg-blue-100 text-blue-800' :
            session.user.tier === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          }`}>
            {session.user.tier}
          </span>
          {session.user.tier === 'TRIAL' && (
            <span className="text-xs text-gray-500">→ Upgrade untuk akses semua template</span>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.length === 0 ? (
          <>
            {/* Placeholder Templates - Coming Soon */}
            {[
              {
                name: 'Modern Minimal',
                description: 'Template clean dan modern untuk produk fashion',
                price: 0,
                preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
                badge: 'Gratis',
              },
              {
                name: 'Elegant Store',
                description: 'Template elegan untuk produk premium',
                price: 99000,
                preview: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop',
                badge: 'Premium',
              },
              {
                name: 'Fresh Market',
                description: 'Template fresh untuk produk F&B',
                price: 0,
                preview: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop',
                badge: 'Gratis',
              },
              {
                name: 'Tech Store',
                description: 'Template modern untuk produk elektronik',
                price: 149000,
                preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
                badge: 'Premium',
              },
              {
                name: 'Handmade Craft',
                description: 'Template hangat untuk produk handmade',
                price: 0,
                preview: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop',
                badge: 'Gratis',
              },
              {
                name: 'Beauty Boutique',
                description: 'Template cantik untuk produk kecantikan',
                price: 99000,
                preview: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
                badge: 'Premium',
              },
            ].map((template, index) => {
              // Check if user can use this template
              const canUse = template.price === 0 || 
                            (template.price === 99000 && (session.user.tier === 'PREMIUM' || session.user.tier === 'UNLIMITED')) ||
                            (template.price === 149000 && session.user.tier === 'UNLIMITED')
              
              return (
              <div
                key={index}
                className={`bg-white rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                  canUse ? 'border-gray-200 hover:border-blue-500 hover:shadow-lg' : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Preview Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      template.price === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {template.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>

                  {/* Tier Requirement & CTA */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        {template.price === 0 ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                            ✓ GRATIS - Semua User
                          </span>
                        ) : template.price === 99000 ? (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                            💎 PREMIUM+
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                            👑 UNLIMITED
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <a
                      href={`/dashboard/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}/preview`}
                      className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold hover:bg-gray-200 transition-colors mb-2"
                    >
                      👁️ Preview
                    </a>
                    
                    {canUse ? (
                      <form action="/api/templates/apply" method="POST" className="w-full">
                        <input type="hidden" name="templateSlug" value={template.name.toLowerCase().replace(/\s+/g, '-')} />
                        <input type="hidden" name="storeId" value={store?.id || ''} />
                        <button
                          type="submit"
                          disabled={!store}
                          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                            store
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {store ? '✨ Gunakan Template' : 'Buat Toko Dulu'}
                        </button>
                      </form>
                    ) : (
                      <a
                        href="/dashboard/settings"
                        className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
                      >
                        🔒 Upgrade untuk Pakai
                      </a>
                    )}
                  </div>
                </div>
              </div>
              )
            })}
          </>
        ) : (
          templates.map((template) => {
            const canUse = !template.isPremium || 
                          (template.isPremium && (session.user.tier === 'PREMIUM' || session.user.tier === 'UNLIMITED'))
            
            return (
            <div
              key={template.id}
              className={`bg-white rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                canUse ? 'border-gray-200 hover:border-blue-500 hover:shadow-lg' : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Preview Image */}
              <div className="relative h-48 bg-gray-100">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Preview
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    template.price === 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {template.price === 0 ? 'Gratis' : 'Premium'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <span>⭐ {template.rating || 0}/5</span>
                </div>

                {/* Tier Requirement & CTA */}
                <div className="space-y-2">
                  {!template.isPremium ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      ✓ GRATIS - Semua User
                    </span>
                  ) : template.price === 99000 ? (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                      💎 PREMIUM+
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      👑 UNLIMITED
                    </span>
                  )}
                  
                  <div className="flex gap-2">
                    <a
                      href={`/dashboard/templates/${template.slug}/preview`}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-center text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      👁️ Preview
                    </a>
                    
                    {canUse ? (
                      <form action="/api/templates/apply" method="POST" className="flex-1">
                        <input type="hidden" name="templateId" value={template.id} />
                        <input type="hidden" name="storeId" value={store?.id || ''} />
                        <button
                          type="submit"
                          disabled={!store}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            store
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {store ? 'Gunakan' : 'Buat Toko'}
                        </button>
                      </form>
                    ) : (
                      <a
                        href="/dashboard/settings"
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-center text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
                      >
                        🔒 Upgrade
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* Info Banner */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🎨</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Template Marketplace Segera Hadir!
            </h3>
            <p className="text-gray-600 mb-4">
              Kami sedang mempersiapkan koleksi template profesional untuk toko online Anda. 
              Template gratis dan premium akan tersedia dengan fitur:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Desain responsive mobile-friendly</li>
              <li>✓ Customizable colors & fonts</li>
              <li>✓ Fast loading & SEO optimized</li>
              <li>✓ WhatsApp checkout integration</li>
              <li>✓ Regular updates & support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
