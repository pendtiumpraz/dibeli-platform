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
        <div className="flex gap-2">
          <Link href="/dashboard/store/edit">
            <Button>✏️ Edit Profil Toko</Button>
          </Link>
          <Link href={`/toko/${store.slug}`} target="_blank">
            <Button variant="outline">👁️ Lihat Toko</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Informasi Dasar</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Toko
              </label>
              <p className="text-lg font-semibold text-gray-900">{store.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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

            {store.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <p className="text-gray-900">{store.description}</p>
              </div>
            )}

            {store.tagline && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <p className="text-gray-900">{store.tagline}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📞 Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {store.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{store.email}</p>
              </div>
            )}
            {store.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telepon
                </label>
                <p className="text-gray-900">{store.phone}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <p className="text-gray-900">{store.whatsappNumber}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        {(store.address || store.city || store.province || store.googleMapsEmbed) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Alamat</h2>
            <div className="space-y-4">
              {store.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <p className="text-gray-900">{store.address}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {store.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kota
                    </label>
                    <p className="text-gray-900">{store.city}</p>
                  </div>
                )}
                {store.province && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provinsi
                    </label>
                    <p className="text-gray-900">{store.province}</p>
                  </div>
                )}
                {store.postalCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Pos
                    </label>
                    <p className="text-gray-900">{store.postalCode}</p>
                  </div>
                )}
                {store.country && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Negara
                    </label>
                    <p className="text-gray-900">{store.country}</p>
                  </div>
                )}
              </div>
              {store.googleMapsEmbed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Peta
                  </label>
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <iframe
                      src={store.googleMapsEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media */}
        {(store.facebookUrl || store.instagramUrl || store.twitterUrl || store.tiktokUrl || store.youtubeUrl || store.linkedinUrl) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🌐 Media Sosial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store.facebookUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Facebook</label>
                    <a href={store.facebookUrl} target="_blank" className="text-blue-600 hover:underline text-sm">
                      Lihat Profil →
                    </a>
                  </div>
                </div>
              )}
              {store.instagramUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Instagram</label>
                    <a href={store.instagramUrl} target="_blank" className="text-pink-600 hover:underline text-sm">
                      Lihat Profil →
                    </a>
                  </div>
                </div>
              )}
              {store.twitterUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Twitter</label>
                    <a href={store.twitterUrl} target="_blank" className="text-sky-600 hover:underline text-sm">
                      Lihat Profil →
                    </a>
                  </div>
                </div>
              )}
              {store.tiktokUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">TikTok</label>
                    <a href={store.tiktokUrl} target="_blank" className="text-gray-900 hover:underline text-sm">
                      Lihat Profil →
                    </a>
                  </div>
                </div>
              )}
              {store.youtubeUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">YouTube</label>
                    <a href={store.youtubeUrl} target="_blank" className="text-red-600 hover:underline text-sm">
                      Lihat Channel →
                    </a>
                  </div>
                </div>
              )}
              {store.linkedinUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">LinkedIn</label>
                    <a href={store.linkedinUrl} target="_blank" className="text-blue-700 hover:underline text-sm">
                      Lihat Profil →
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Statistik</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {store.viewCount}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Views</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {store.viewCountWeek}
              </p>
              <p className="text-sm text-gray-600 mt-1">Views (7 hari)</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {store.viewCountMonth}
              </p>
              <p className="text-sm text-gray-600 mt-1">Views (30 hari)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
