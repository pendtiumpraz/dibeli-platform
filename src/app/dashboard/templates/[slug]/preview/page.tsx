import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function TemplatePreviewPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get template
  const template = await prisma.template.findUnique({
    where: { slug: params.slug },
  })

  if (!template) {
    redirect('/dashboard/templates')
  }

  // Get user's store
  const store = await prisma.store.findUnique({
    where: { userId: session.user.id },
    include: {
      products: {
        take: 6,
      },
    },
  })

  // Check if user can use this template
  const canUse = !template.isPremium || 
                 (template.isPremium && template.price === 99000 && (session.user.tier === 'PREMIUM' || session.user.tier === 'UNLIMITED')) ||
                 (template.isPremium && template.price === 149000 && session.user.tier === 'UNLIMITED')

  // Replace template variables with actual data
  let previewHtml = template.htmlContent
    .replace(/{{store_name}}/g, store?.name || 'Toko Anda')
    .replace(/{{store_description}}/g, store?.description || 'Deskripsi toko Anda')

  // Inject products into template
  const productsHtml = store?.products.map(product => {
    const images = typeof product.images === 'object' && product.images !== null && Array.isArray(product.images) 
      ? product.images as string[] 
      : []
    const firstImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/200'
    
    return `
    <div class="product-card">
      <div class="product-image" style="background-image: url('${firstImage}')"></div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
        <button class="btn">Beli via WhatsApp</button>
      </div>
    </div>
    `
  }).join('') || '<p style="text-align: center; color: #999;">Belum ada produk</p>'

  previewHtml = previewHtml.replace('<!-- Products will be inserted here -->', productsHtml)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/dashboard/templates"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </a>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Tier Badge */}
            {template.isPremium ? (
              template.price === 99000 ? (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  💎 PREMIUM+
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  👑 UNLIMITED
                </span>
              )
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✓ GRATIS
              </span>
            )}
            
            {/* Apply Button */}
            {canUse ? (
              <form action="/api/templates/apply" method="POST">
                <input type="hidden" name="templateId" value={template.id} />
                <input type="hidden" name="storeId" value={store?.id || ''} />
                <button
                  type="submit"
                  disabled={!store}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    store
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {store ? '✨ Terapkan Template' : 'Buat Toko Dulu'}
                </button>
              </form>
            ) : (
              <a
                href="/dashboard/settings"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                🔒 Upgrade untuk Pakai
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center text-sm text-gray-400">
              Preview - {template.name}
            </div>
          </div>
          
          <iframe
            srcDoc={previewHtml}
            className="w-full h-[800px] border-0"
            sandbox="allow-scripts"
            title="Template Preview"
          />
        </div>

        {/* Template Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">📊 Template Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{template.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">⭐ {template.rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reviews:</span>
                <span className="font-medium">{template.reviewCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">✨ Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Responsive mobile-friendly</li>
              <li>✓ WhatsApp integration</li>
              <li>✓ SEO optimized</li>
              <li>✓ Fast loading</li>
              {template.isPremium && <li>✓ Custom colors</li>}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">🎨 Customization</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {typeof template.customizable === 'object' && template.customizable !== null ? (
                <>
                  {(template.customizable as any).colors && <li>✓ Colors</li>}
                  {(template.customizable as any).fonts && <li>✓ Fonts</li>}
                  {(template.customizable as any).layout && <li>✓ Layout</li>}
                </>
              ) : (
                <li>No customization</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
