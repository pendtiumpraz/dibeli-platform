import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ColorPicker from './ColorPicker'

export default async function StoreColorsPage() {
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

  // Check tier access - only PREMIUM and UNLIMITED can customize colors
  const canCustomize = session.user.tier === 'PREMIUM' || session.user.tier === 'UNLIMITED'
  const canCustomizeFull = session.user.tier === 'UNLIMITED'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Custom Brand Colors</h1>
        <p className="text-gray-600">
          Personalisasi warna brand Anda untuk template toko.
        </p>
      </div>

      {/* Tier Badge */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        canCustomizeFull 
          ? 'bg-purple-50 border-purple-200' 
          : canCustomize 
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tier Akun Anda:</p>
            <p className={`text-xl font-bold ${
              canCustomizeFull ? 'text-purple-600' :
              canCustomize ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {session.user.tier === 'UNLIMITED' ? '👑' : session.user.tier === 'PREMIUM' ? '💎' : '🆓'} {session.user.tier}
            </p>
          </div>
          {!canCustomize && (
            <a
              href="/dashboard/settings"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Upgrade ke PREMIUM
            </a>
          )}
        </div>
        
        {!canCustomize && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Custom colors tersedia untuk tier PREMIUM dan UNLIMITED. Upgrade untuk unlock fitur ini!
            </p>
          </div>
        )}

        {canCustomize && !canCustomizeFull && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              💎 PREMIUM: Bisa customize Primary & Secondary colors
            </p>
          </div>
        )}

        {canCustomizeFull && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
            <p className="text-sm text-purple-800">
              👑 UNLIMITED: Full color customization + gradients!
            </p>
          </div>
        )}
      </div>

      <ColorPicker 
        storeId={store.id}
        currentColors={store.customColors as any}
        userTier={session.user.tier}
        canCustomize={canCustomize}
        canCustomizeFull={canCustomizeFull}
      />
    </div>
  )
}
