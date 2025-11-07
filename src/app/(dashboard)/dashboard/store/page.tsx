import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function StorePage() {
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Toko Saya</h1>
        <Link href={`/toko/${store.slug}`} target="_blank">
          <Button variant="outline">👁️ Lihat Toko</Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Toko
          </label>
          <p className="text-lg font-semibold text-gray-900">{store.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Toko
          </label>
          <p className="text-gray-900">
            <a 
              href={`/toko/${store.slug}`}
              target="_blank"
              className="text-purple-600 hover:underline"
            >
              dibeli.my.id/toko/{store.slug}
            </a>
          </p>
        </div>

        {store.tagline && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <p className="text-gray-900">{store.tagline}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp
          </label>
          <p className="text-gray-900">{store.whatsappNumber}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            store.isPublished 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {store.isPublished ? '✅ Published' : '⏸️ Draft'}
          </span>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Statistik
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {store.viewCount}
              </p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {store.viewCountWeek}
              </p>
              <p className="text-sm text-gray-600">Views (7 hari)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {store.viewCountMonth}
              </p>
              <p className="text-sm text-gray-600">Views (30 hari)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
