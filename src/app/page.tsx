import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function HomePage() {
  const stores = await prisma.store.findMany({
    where: {
      isPublished: true,
      isPubliclyListed: true,
    },
    take: 12,
    orderBy: [
      { viewCountWeek: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  const stats = {
    totalStores: await prisma.store.count({ where: { isPublished: true } }),
    totalProducts: await prisma.product.count(),
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              dibeli.my.id
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-semibold mb-4">
              Buat Toko Online dalam 10 Menit
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Platform toko online terbaik di Indonesia. Template profesional, Google Drive storage, dan WhatsApp integration.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="text-lg px-8 bg-white text-purple-600 hover:bg-gray-100">
                  Mulai Gratis - 14 Hari
                </Button>
              </Link>
              <Link href="#stores">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                  Lihat Toko
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex justify-center gap-12 text-white">
              <div>
                <p className="text-3xl font-bold">{stats.totalStores}+</p>
                <p className="text-sm opacity-80">Toko Aktif</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats.totalProducts}+</p>
                <p className="text-sm opacity-80">Produk</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm opacity-80">Gratis Trial</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Directory */}
      <div id="stores" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🏪 Toko Populer
          </h2>
          <p className="text-gray-600">
            Jelajahi toko-toko yang menggunakan dibeli.my.id
          </p>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada toko. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((store) => (
              <Link key={store.id} href={`/toko/${store.slug}`}>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {store.heroImage && (
                    <div className="h-48 relative">
                      <Image
                        src={store.heroImage}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {store.logoUrl && (
                        <Image
                          src={store.logoUrl}
                          alt={store.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {store.name}
                        </h3>
                        {store.tagline && (
                          <p className="text-sm text-gray-600 truncate">
                            {store.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>📦 {store._count.products} produk</span>
                      <span>👁️ {store.viewCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Siap Membuat Toko Online Anda?
          </h2>
          <p className="text-gray-600 mb-8">
            Gratis 14 hari trial. Tidak perlu kartu kredit.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-12">
              Buat Toko Sekarang
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 dibeli.my.id - Platform Toko Online Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
}
