import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function HomePage() {
  // Safely query database, handle case when tables don't exist yet
  let stores: any[] = []
  let stats = {
    totalStores: 0,
    totalProducts: 0,
  }

  try {
    stores = await prisma.store.findMany({
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

    stats = {
      totalStores: await prisma.store.count({ where: { isPublished: true } }),
      totalProducts: await prisma.product.count(),
    }
  } catch (error) {
    // Database not initialized yet, use default values
    console.log('Database not initialized yet, using default values')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1920&q=80"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
              dibeli.my.id
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-semibold mb-4">
              Buat Toko Online dalam 10 Menit
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Platform toko online terbaik di Indonesia. Template profesional, Google Drive storage, dan WhatsApp integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signin">
                <Button size="lg" className="text-lg px-8 bg-white text-purple-600 hover:bg-gray-100 shadow-xl">
                  🚀 Mulai Gratis - 14 Hari
                </Button>
              </Link>
              <Link href="#stores">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white backdrop-blur-sm">
                  👀 Lihat Toko
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <p className="text-4xl font-bold">{stats.totalStores}+</p>
                <p className="text-sm opacity-80">Toko Aktif</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <p className="text-4xl font-bold">{stats.totalProducts}+</p>
                <p className="text-sm opacity-80">Produk</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
                <p className="text-4xl font-bold">100%</p>
                <p className="text-sm opacity-80">Gratis Trial</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Pilih dibeli.my.id?
            </h2>
            <p className="text-xl text-gray-600">
              Platform terlengkap untuk jualan online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80"
                  alt="Setup Cepat"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Setup 10 Menit
                </h3>
                <p className="text-gray-600">
                  Buat toko online profesional tanpa coding. Pilih template, upload produk, dan langsung jualan!
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                  alt="Template Profesional"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Template Profesional
                </h3>
                <p className="text-gray-600">
                  30+ template premium siap pakai. Customize warna dan layout sesuai brand Anda.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80"
                  alt="WhatsApp Integration"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  WhatsApp Otomatis
                </h3>
                <p className="text-gray-600">
                  Customer langsung chat WhatsApp dengan detail produk. Tingkatkan konversi penjualan!
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80"
                  alt="Google Drive Storage"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">☁️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Storage Gratis
                </h3>
                <p className="text-gray-600">
                  Upload foto produk ke Google Drive Anda sendiri. Zero biaya hosting!
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80"
                  alt="Analytics"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Analytics Real-time
                </h3>
                <p className="text-gray-600">
                  Monitor views, produk populer, dan performa toko. Data-driven decisions!
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 relative">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
                  alt="Mobile Responsive"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mobile Friendly
                </h3>
                <p className="text-gray-600">
                  Semua template otomatis responsive. Perfect di smartphone, tablet, dan desktop!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Directory */}
      <div id="stores" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🏪 Toko Populer
          </h2>
          <p className="text-xl text-gray-600">
            Jelajahi toko-toko yang menggunakan dibeli.my.id
          </p>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                alt="Empty store"
                fill
                className="object-cover rounded-lg opacity-50"
              />
            </div>
            <p className="text-xl text-gray-500 mb-4">Belum ada toko. Jadilah yang pertama!</p>
            <Link href="/auth/signin">
              <Button size="lg">Buat Toko Sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stores.map((store, index) => {
              // Placeholder images for stores without hero
              const placeholderImages = [
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80",
                "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&q=80",
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
              ];
              
              return (
                <Link key={store.id} href={`/toko/${store.slug}`}>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="h-48 relative bg-gradient-to-br from-purple-100 to-pink-100">
                      <Image
                        src={store.heroImage || placeholderImages[index % placeholderImages.length]}
                        alt={store.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-purple-600">
                          ⭐ Top
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {store.logoUrl ? (
                          <Image
                            src={store.logoUrl}
                            alt={store.name}
                            width={40}
                            height={40}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {store.name.charAt(0).toUpperCase()}
                          </div>
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
                        <span className="flex items-center gap-1">
                          📦 {store._count.products} produk
                        </span>
                        <span className="flex items-center gap-1">
                          👁️ {store.viewCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Testimonial Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-xl text-gray-600">
              Ribuan seller sudah sukses jualan online
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">Siti Nurhaliza</p>
                  <p className="text-sm text-gray-600">Fashion Store</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600">
                "Setup toko cuma 5 menit! Sekarang omzet meningkat 300% berkat WhatsApp integration."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">Budi Santoso</p>
                  <p className="text-sm text-gray-600">Electronics</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600">
                "Gak perlu bayar hosting mahal. Semua foto di Google Drive saya sendiri. Mantap!"
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">Rina Wijaya</p>
                  <p className="text-sm text-gray-600">Food & Beverage</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-600">
                "Template-nya keren banget! Customer saya kira ini toko besar. Padahal baru 2 bulan 😂"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Membuat Toko Online Anda?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Gratis 14 hari trial. Tidak perlu kartu kredit. Setup dalam 10 menit!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="text-lg px-12 bg-white text-purple-600 hover:bg-gray-100 shadow-xl">
                🚀 Mulai Sekarang - GRATIS
              </Button>
            </Link>
            <Link href="#stores">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white backdrop-blur-sm">
                Lihat Demo Toko
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-white/80 text-sm">
            ✓ Tanpa kartu kredit  ✓ Setup 10 menit  ✓ Cancel kapan saja
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">dibeli.my.id</h3>
              <p className="text-gray-400 text-sm mb-4">
                Platform toko online terbaik di Indonesia. Buat toko profesional dalam 10 menit!
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Fitur</a></li>
                <li><a href="#" className="hover:text-white">Harga</a></li>
                <li><a href="#" className="hover:text-white">Template</a></li>
                <li><a href="#" className="hover:text-white">Marketplace</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Tutorial</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Karir</a></li>
                <li><a href="#" className="hover:text-white">Partnership</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 dibeli.my.id - Platform Toko Online Indonesia
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
