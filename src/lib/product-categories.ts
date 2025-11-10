/**
 * Product Categories & Template Presets
 * Pre-configured AI prompts for different business types
 */

export const PRODUCT_CATEGORIES = {
  ecommerce: {
    id: 'ecommerce',
    name: '🛍️ E-commerce',
    description: 'Fashion, Electronics, Accessories',
    examples: 'Baju, Sepatu, Gadget, Jam Tangan',
    promptContext: `Produk ini adalah barang fisik yang dijual secara online. 
    Fokus pada kualitas material, spesifikasi produk, variasi warna/ukuran.
    Gunakan urgency untuk stok terbatas dan diskon.
    Target audience: Online shoppers yang mencari value for money.`,
    benefits: [
      'Kualitas premium dengan harga terjangkau',
      'Gratis ongkir ke seluruh Indonesia',
      'Garansi 100% uang kembali jika tidak puas',
      'Tersedia berbagai pilihan warna dan ukuran',
      'Fast response customer service via WhatsApp',
    ],
    ctaExamples: ['BELI SEKARANG!', 'PESAN LANGSUNG!', 'ORDER VIA WA!'],
  },
  
  services: {
    id: 'services',
    name: '💼 Services',
    description: 'Jasa Professional',
    examples: 'Konsultan, Cleaning Service, Repair, Marketing',
    promptContext: `Ini adalah layanan jasa profesional.
    Fokus pada expertise, pengalaman, portfolio, dan hasil yang terukur.
    Highlight sertifikasi, testimonial client, dan case studies.
    Target audience: Bisnis atau individu yang butuh solusi professional.`,
    benefits: [
      'Tim profesional berpengalaman 5+ tahun',
      'Hasil kerja berkualitas dan tepat waktu',
      'Harga kompetitif dengan kualitas premium',
      'Konsultasi gratis sebelum project dimulai',
      'Garansi kepuasan 100%',
    ],
    ctaExamples: ['KONSULTASI GRATIS!', 'HUBUNGI SEKARANG!', 'JADWALKAN MEETING!'],
  },
  
  digital: {
    id: 'digital',
    name: '📱 Digital Products',
    description: 'Course, Ebook, Software, SaaS',
    examples: 'Online Course, Ebook, Template, Plugin',
    promptContext: `Produk digital yang langsung bisa diakses setelah pembelian.
    Fokus pada knowledge/skill yang didapat, transformasi hasil belajar.
    Highlight: Akses selamanya, update gratis, bonus eksklusif.
    Target audience: Pembelajar, profesional yang ingin upgrade skill.`,
    benefits: [
      'Akses selamanya tanpa batas waktu',
      'Update konten gratis setiap ada materi baru',
      'Dapat sertifikat setelah selesai',
      'Bonus eksklusif senilai jutaan rupiah',
      'Komunitas private dengan sesama member',
    ],
    ctaExamples: ['DAFTAR SEKARANG!', 'AKSES LANGSUNG!', 'MULAI BELAJAR!'],
  },
  
  fnb: {
    id: 'fnb',
    name: '🍔 F&B',
    description: 'Food & Beverage',
    examples: 'Cafe, Restaurant, Catering, Cake, Snack',
    promptContext: `Produk makanan/minuman yang fokus pada rasa, kualitas bahan.
    Highlight: Fresh ingredients, hygiene, rasa authentic.
    Gunakan sensory description (aroma, tekstur, rasa).
    Target audience: Food lovers, event organizers, daily consumers.`,
    benefits: [
      'Bahan berkualitas dan fresh setiap hari',
      'Proses pembuatan hygiene dengan standar tinggi',
      'Rasa authentic dan bumbu special homemade',
      'Packaging menarik dan food grade',
      'Bisa untuk acara & pre-order dalam jumlah besar',
    ],
    ctaExamples: ['PESAN SEKARANG!', 'ORDER VIA WA!', 'BOOKING SEKARANG!'],
  },
  
  homeLiving: {
    id: 'homeLiving',
    name: '🏠 Home & Living',
    description: 'Furniture, Decor, Appliances',
    examples: 'Sofa, Lampu, Rak, Peralatan Dapur',
    promptContext: `Produk untuk rumah tangga dan dekorasi.
    Fokus pada fungsi, estetika, durabilitas, dan kenyamanan.
    Highlight: Design modern, material berkualitas, space-saving.
    Target audience: Homeowners, newlyweds, apartment dwellers.`,
    benefits: [
      'Design modern dan minimalis',
      'Material berkualitas tinggi dan tahan lama',
      'Mudah dibersihkan dan dirawat',
      'Hemat space dengan fungsi maksimal',
      'Gratis konsultasi desain interior',
    ],
    ctaExamples: ['BELI SEKARANG!', 'PESAN FURNITURE!', 'TANYA STOK!'],
  },
  
  beauty: {
    id: 'beauty',
    name: '💄 Beauty & Health',
    description: 'Skincare, Makeup, Supplements',
    examples: 'Serum, Lipstick, Vitamin, Suplemen',
    promptContext: `Produk kecantikan dan kesehatan.
    Fokus pada ingredients, hasil yang terlihat, safety (BPOM).
    Highlight: Natural ingredients, dermatologically tested, before-after.
    Target audience: Beauty enthusiasts, health-conscious consumers.`,
    benefits: [
      'Ingredients natural dan aman untuk kulit',
      'Sudah tersertifikasi BPOM dan halal',
      'Hasil terlihat dalam 2-4 minggu pemakaian',
      'Cocok untuk semua jenis kulit',
      'Money back guarantee jika alergi',
    ],
    ctaExamples: ['BELI SEKARANG!', 'COBA GRATIS!', 'KONSULTASI SKIN!'],
  },
  
  entertainment: {
    id: 'entertainment',
    name: '🎮 Entertainment',
    description: 'Games, Toys, Hobbies',
    examples: 'Board Games, Action Figures, Gaming Gear',
    promptContext: `Produk entertainment dan hobby.
    Fokus pada fun factor, collectibility, community.
    Highlight: Original product, limited edition, high quality.
    Target audience: Gamers, collectors, hobby enthusiasts.`,
    benefits: [
      'Produk original 100% bergaransi',
      'Kualitas premium untuk durability',
      'Perfect untuk koleksi atau hadiah',
      'Join komunitas ekslusif enthusiast',
      'Pre-order item limited edition',
    ],
    ctaExamples: ['ORDER NOW!', 'PRE-ORDER!', 'GET YOURS!'],
  },
  
  education: {
    id: 'education',
    name: '📚 Education',
    description: 'Books, Courses, Training',
    examples: 'Buku, Kursus, Workshop, Coaching',
    promptContext: `Produk pendidikan dan pembelajaran.
    Fokus pada skill yang didapat, instructor expertise, learning outcome.
    Highlight: Certified instructors, hands-on practice, career impact.
    Target audience: Students, professionals, lifelong learners.`,
    benefits: [
      'Pengajar berpengalaman dan tersertifikasi',
      'Materi up-to-date sesuai industri terkini',
      'Praktek langsung dengan real case study',
      'Sertifikat resmi setelah completion',
      'Career support & job placement assistance',
    ],
    ctaExamples: ['DAFTAR SEKARANG!', 'ENROLL NOW!', 'MULAI BELAJAR!'],
  },
} as const

export type CategoryId = keyof typeof PRODUCT_CATEGORIES

export function getCategoryById(id: string): typeof PRODUCT_CATEGORIES[CategoryId] | null {
  return PRODUCT_CATEGORIES[id as CategoryId] || null
}

export function getAllCategories() {
  return Object.values(PRODUCT_CATEGORIES)
}

export function buildCategoryPrompt(
  categoryId: string,
  productName: string,
  price: string | number,
  description?: string
): string {
  const category = getCategoryById(categoryId)
  
  if (!category) {
    // Fallback to generic prompt
    return `Kamu adalah copywriter expert untuk e-commerce Indonesia.`
  }

  return `Kamu adalah copywriter expert untuk e-commerce Indonesia, spesialisasi di kategori ${category.name}.

CONTEXT KATEGORI:
${category.promptContext}

CONTOH PRODUK KATEGORI INI:
${category.examples}

PRODUK YANG AKAN DIBUAT:
- Nama: ${productName}
- Harga: Rp ${typeof price === 'string' ? price : price.toLocaleString('id-ID')}
${description ? `- Deskripsi: ${description}` : ''}

TUGAS:
Generate konten landing page yang persuasif untuk kategori ${category.name}.
Benefits harus relevan dengan karakteristik kategori ini.
CTA harus sesuai dengan behavior customer kategori ini.
Testimonial harus realistis untuk jenis produk ini.

Gunakan tone of voice yang sesuai dengan target audience kategori ${category.name}.`
}
