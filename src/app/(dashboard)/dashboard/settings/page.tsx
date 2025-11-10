import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ApiKeysManager from './ApiKeysManager'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Fetch user's API keys
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      geminiApiKey: true,
      groqApiKey: true,
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pengaturan</h1>

      <div className="space-y-6">
        {/* AI API Keys Section (UNLIMITED Only) */}
        {session.user.tier === 'UNLIMITED' && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 shadow rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 text-4xl">🤖</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-purple-900 mb-2">
                  AI API Keys
                </h2>
                <p className="text-sm text-gray-700">
                  Simpan API keys sekali, lalu 1-click generate dengan AI! Digunakan untuk fitur Auto-Generate produk.
                </p>
              </div>
            </div>
            
            <ApiKeysManager 
              initialGeminiKey={user?.geminiApiKey || ''}
              initialGroqKey={user?.groqApiKey || ''}
            />
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informasi Akun
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama
              </label>
              <p className="mt-1 text-gray-900">{session.user.name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-gray-900">{session.user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tier
              </label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  session.user.tier === 'TRIAL' ? 'bg-blue-100 text-blue-800' :
                  session.user.tier === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                  session.user.tier === 'UNLIMITED' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {session.user.tier}
                </span>
              </p>
            </div>
          </div>
        </div>

        {session.user.tier !== 'UNLIMITED' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              💎 Upgrade Plan
            </h2>
            <p className="text-gray-600 mb-4">
              Tingkatkan ke Premium atau Unlimited untuk fitur lebih lengkap
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border-2 border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-lg text-purple-600 mb-2">
                  💎 Premium
                </h3>
                <p className="text-3xl font-bold mb-2">Rp 49.000</p>
                <p className="text-sm text-gray-600 mb-4">per bulan</p>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ Unlimited produk</li>
                  <li>✓ Semua template</li>
                  <li>✓ Custom warna</li>
                  <li>✓ Tanpa branding</li>
                  <li>✓ WhatsApp integration</li>
                </ul>
              </div>
              <div className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-yellow-600">
                    👑 Unlimited
                  </h3>
                  <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                    POPULAR
                  </span>
                </div>
                <p className="text-3xl font-bold mb-2">Rp 149.000</p>
                <p className="text-sm text-gray-600 mb-4">per bulan</p>
                <ul className="space-y-2 text-sm mb-4">
                  <li>✓ Semua fitur Premium</li>
                  <li>✓ Multiple stores (3 toko)</li>
                  <li>✓ Custom domain</li>
                  <li>✓ Priority support</li>
                  <li>✓ Analytics advanced</li>
                </ul>
              </div>
            </div>
            
            {/* WhatsApp Buttons - Separate for Premium & Unlimited */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Premium Button */}
              <a
                href={`https://wa.me/6281319504441?text=${encodeURIComponent(`Halo Galih, saya ingin upgrade ke PREMIUM (Rp 49k/bulan).\n\nEmail: ${session.user.email}\nNama: ${session.user.name || '-'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-semibold text-center shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="text-sm">💎 Upgrade ke PREMIUM</span>
                  <span className="text-xs opacity-90">Rp 49k/bulan</span>
                </div>
              </a>

              {/* Unlimited Button */}
              <a
                href={`https://wa.me/6281319504441?text=${encodeURIComponent(`Halo Galih, saya ingin upgrade ke UNLIMITED (Rp 149k/bulan).\n\nEmail: ${session.user.email}\nNama: ${session.user.name || '-'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-semibold text-center shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span className="text-sm">👑 Upgrade ke UNLIMITED</span>
                  <span className="text-xs opacity-90">Rp 149k/bulan</span>
                </div>
              </a>
            </div>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              📱 Klik salah satu untuk chat <strong>Galih</strong> di WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
