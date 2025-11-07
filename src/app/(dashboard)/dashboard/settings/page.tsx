import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pengaturan</h1>

      <div className="space-y-6">
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

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upgrade Plan
          </h2>
          <p className="text-gray-600 mb-4">
            Tingkatkan ke Premium atau Unlimited untuk fitur lebih lengkap
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </ul>
            </div>
            <div className="border-2 border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-yellow-600 mb-2">
                👑 Unlimited
              </h3>
              <p className="text-3xl font-bold mb-2">Rp 149.000</p>
              <p className="text-sm text-gray-600 mb-4">per bulan</p>
              <ul className="space-y-2 text-sm mb-4">
                <li>✓ Semua fitur Premium</li>
                <li>✓ 3 toko</li>
                <li>✓ Custom domain</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Hubungi admin untuk upgrade akun Anda
          </p>
        </div>
      </div>
    </div>
  )
}
