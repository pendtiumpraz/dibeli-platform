import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Template categories and subcategories
const templateData = [
  // FASHION Templates
  { category: 'FASHION', subcategory: 'Fashion Premium', name: 'Elegant Fashion', description: 'Template modern dan elegan untuk fashion store', price: 99000, rating: 4.8 },
  { category: 'FASHION', subcategory: 'Fashion Premium', name: 'Luxury Boutique', description: 'Template mewah untuk butik premium', price: 149000, rating: 4.9 },
  { category: 'FASHION', subcategory: 'Fashion Minimal', name: 'Minimal Chic', description: 'Template minimalis untuk brand fashion modern', price: 0, rating: 4.5 },
  { category: 'FASHION', subcategory: 'Fashion Minimal', name: 'Simple Fashion', description: 'Template sederhana dan clean', price: 0, rating: 4.3 },
  { category: 'FASHION', subcategory: 'Fashion Streetwear', name: 'Urban Style', description: 'Template untuk streetwear dan urban fashion', price: 79000, rating: 4.6 },
  { category: 'FASHION', subcategory: 'Fashion Vintage', name: 'Retro Fashion', description: 'Template dengan sentuhan vintage', price: 89000, rating: 4.7 },
  
  // FOOD & BEVERAGE Templates
  { category: 'FOOD_BEVERAGE', subcategory: 'Restaurant', name: 'Modern Restaurant', description: 'Template untuk restoran modern', price: 0, rating: 4.4 },
  { category: 'FOOD_BEVERAGE', subcategory: 'Restaurant', name: 'Fine Dining', description: 'Template elegan untuk fine dining', price: 129000, rating: 4.8 },
  { category: 'FOOD_BEVERAGE', subcategory: 'Cafe', name: 'Cozy Cafe', description: 'Template hangat untuk cafe', price: 0, rating: 4.5 },
  { category: 'FOOD_BEVERAGE', subcategory: 'Cafe', name: 'Coffee Shop', description: 'Template modern untuk coffee shop', price: 69000, rating: 4.6 },
  { category: 'FOOD_BEVERAGE', subcategory: 'Bakery', name: 'Sweet Bakery', description: 'Template manis untuk toko roti', price: 0, rating: 4.3 },
  { category: 'FOOD_BEVERAGE', subcategory: 'Fast Food', name: 'Quick Bites', description: 'Template untuk fast food', price: 59000, rating: 4.4 },
  
  // ELECTRONICS Templates
  { category: 'ELECTRONICS', subcategory: 'Electronics Store', name: 'Tech Store', description: 'Template modern untuk toko elektronik', price: 99000, rating: 4.7 },
  { category: 'ELECTRONICS', subcategory: 'Electronics Store', name: 'Gadget Shop', description: 'Template untuk toko gadget', price: 0, rating: 4.5 },
  { category: 'ELECTRONICS', subcategory: 'Computer & Laptop', name: 'PC Hardware', description: 'Template untuk toko komputer', price: 79000, rating: 4.6 },
  { category: 'ELECTRONICS', subcategory: 'Smartphone', name: 'Mobile Store', description: 'Template untuk toko smartphone', price: 0, rating: 4.4 },
  
  // BEAUTY & COSMETICS Templates
  { category: 'BEAUTY_COSMETICS', subcategory: 'Skincare', name: 'Beauty Glow', description: 'Template cantik untuk skincare', price: 89000, rating: 4.8 },
  { category: 'BEAUTY_COSMETICS', subcategory: 'Skincare', name: 'Natural Skin', description: 'Template natural untuk skincare organik', price: 0, rating: 4.6 },
  { category: 'BEAUTY_COSMETICS', subcategory: 'Makeup', name: 'Glam Makeup', description: 'Template glamor untuk makeup', price: 99000, rating: 4.7 },
  { category: 'BEAUTY_COSMETICS', subcategory: 'Makeup', name: 'Beauty Essentials', description: 'Template untuk produk makeup', price: 0, rating: 4.5 },
  { category: 'BEAUTY_COSMETICS', subcategory: 'Haircare', name: 'Hair Beauty', description: 'Template untuk produk perawatan rambut', price: 69000, rating: 4.6 },
  
  // HOME & LIVING Templates
  { category: 'HOME_LIVING', subcategory: 'Furniture', name: 'Modern Furniture', description: 'Template untuk toko furniture modern', price: 119000, rating: 4.8 },
  { category: 'HOME_LIVING', subcategory: 'Furniture', name: 'Home Comfort', description: 'Template nyaman untuk furniture', price: 0, rating: 4.5 },
  { category: 'HOME_LIVING', subcategory: 'Home Decor', name: 'Decor Studio', description: 'Template untuk dekorasi rumah', price: 79000, rating: 4.6 },
  { category: 'HOME_LIVING', subcategory: 'Kitchen', name: 'Kitchen Essentials', description: 'Template untuk peralatan dapur', price: 0, rating: 4.4 },
  
  // HANDMADE & CRAFT Templates
  { category: 'HANDMADE_CRAFT', subcategory: 'Handmade Products', name: 'Artisan Craft', description: 'Template hangat untuk produk handmade', price: 0, rating: 4.7 },
  { category: 'HANDMADE_CRAFT', subcategory: 'Handmade Products', name: 'Handmade Store', description: 'Template untuk kerajinan tangan', price: 69000, rating: 4.6 },
  { category: 'HANDMADE_CRAFT', subcategory: 'Art & Craft', name: 'Creative Art', description: 'Template untuk seni dan craft', price: 0, rating: 4.5 },
  { category: 'HANDMADE_CRAFT', subcategory: 'DIY Products', name: 'DIY Store', description: 'Template untuk produk DIY', price: 59000, rating: 4.4 },
  
  // SPORTS & FITNESS Templates
  { category: 'SPORTS_FITNESS', subcategory: 'Sports Equipment', name: 'Active Sports', description: 'Template energik untuk peralatan olahraga', price: 89000, rating: 4.7 },
  { category: 'SPORTS_FITNESS', subcategory: 'Sports Equipment', name: 'Fitness Store', description: 'Template untuk toko fitness', price: 0, rating: 4.5 },
  { category: 'SPORTS_FITNESS', subcategory: 'Sportswear', name: 'Athletic Wear', description: 'Template untuk pakaian olahraga', price: 79000, rating: 4.6 },
  { category: 'SPORTS_FITNESS', subcategory: 'Gym Equipment', name: 'Gym Essentials', description: 'Template untuk peralatan gym', price: 0, rating: 4.4 },
  
  // BOOKS & EDUCATION Templates
  { category: 'BOOKS_EDUCATION', subcategory: 'Books', name: 'Book Store', description: 'Template klasik untuk toko buku', price: 0, rating: 4.6 },
  { category: 'BOOKS_EDUCATION', subcategory: 'Books', name: 'Literary Shop', description: 'Template elegan untuk buku', price: 69000, rating: 4.7 },
  { category: 'BOOKS_EDUCATION', subcategory: 'Online Courses', name: 'Course Platform', description: 'Template untuk kursus online', price: 149000, rating: 4.8 },
  { category: 'BOOKS_EDUCATION', subcategory: 'Stationery', name: 'Stationery Store', description: 'Template untuk alat tulis', price: 0, rating: 4.4 },
  
  // KIDS & BABY Templates
  { category: 'KIDS_BABY', subcategory: 'Baby Products', name: 'Baby Care', description: 'Template lembut untuk produk bayi', price: 79000, rating: 4.7 },
  { category: 'KIDS_BABY', subcategory: 'Baby Products', name: 'Little Angels', description: 'Template manis untuk baby shop', price: 0, rating: 4.6 },
  { category: 'KIDS_BABY', subcategory: 'Kids Fashion', name: 'Kids Style', description: 'Template ceria untuk fashion anak', price: 69000, rating: 4.5 },
  { category: 'KIDS_BABY', subcategory: 'Toys', name: 'Toy Kingdom', description: 'Template playful untuk mainan', price: 0, rating: 4.4 },
  
  // JEWELRY & ACCESSORIES Templates
  { category: 'JEWELRY_ACCESSORIES', subcategory: 'Jewelry', name: 'Elegant Jewelry', description: 'Template mewah untuk perhiasan', price: 129000, rating: 4.9 },
  { category: 'JEWELRY_ACCESSORIES', subcategory: 'Jewelry', name: 'Jewelry Shop', description: 'Template cantik untuk toko perhiasan', price: 0, rating: 4.6 },
  { category: 'JEWELRY_ACCESSORIES', subcategory: 'Watches', name: 'Time Pieces', description: 'Template elegan untuk jam tangan', price: 99000, rating: 4.7 },
  { category: 'JEWELRY_ACCESSORIES', subcategory: 'Bags', name: 'Bag Collection', description: 'Template untuk koleksi tas', price: 0, rating: 4.5 },
]

// Color schemes
const colorSchemes = [
  { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' }, // Blue
  { primary: '#EF4444', secondary: '#B91C1C', accent: '#F87171' }, // Red
  { primary: '#10B981', secondary: '#047857', accent: '#34D399' }, // Green
  { primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA' }, // Purple
  { primary: '#F59E0B', secondary: '#D97706', accent: '#FCD34D' }, // Orange
  { primary: '#EC4899', secondary: '#BE185D', accent: '#F472B6' }, // Pink
  { primary: '#14B8A6', secondary: '#0F766E', accent: '#5EEAD4' }, // Teal
  { primary: '#F97316', secondary: '#C2410C', accent: '#FB923C' }, // Orange-Red
]

// Preview images from Unsplash
const previewImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create templates
  for (const template of templateData) {
    const colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
    const preview = previewImages[Math.floor(Math.random() * previewImages.length)]
    
    const slug = template.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .hero { background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: white; padding: 60px 20px; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    .products { padding: 40px 20px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .product-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .product-image { width: 100%; height: 200px; background: #f3f4f6; }
    .product-info { padding: 15px; }
    .product-name { font-weight: bold; margin-bottom: 8px; }
    .product-price { color: ${colors.primary}; font-size: 1.2rem; font-weight: bold; }
    .btn { background: ${colors.primary}; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
    .btn:hover { background: ${colors.secondary}; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>{{store_name}}</h1>
    <p>{{store_description}}</p>
  </div>
  <div class="products" id="products">
    <!-- Products will be inserted here -->
  </div>
</body>
</html>`

    // Need a dummy user as creator - use first user or create one
    let creatorId = 'system'
    try {
      const firstUser = await prisma.user.findFirst()
      if (firstUser) {
        creatorId = firstUser.id
      }
    } catch (e) {
      console.log('No users found, using system as creator')
    }

    await prisma.template.create({
      data: {
        name: template.name,
        slug,
        description: template.description,
        category: template.category,
        subcategory: template.subcategory,
        htmlContent,
        cssContent: '',
        previewImage: preview,
        thumbnailImage: preview,
        colorVars: {
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
        },
        price: template.price,
        rating: template.rating,
        status: 'PUBLISHED',
        reviewCount: Math.floor(Math.random() * 100) + 10,
        tags: [template.category.toLowerCase(), template.subcategory?.toLowerCase() || ''],
        features: {
          responsive: true,
          whatsappIntegration: true,
          seoOptimized: true,
          fastLoading: true,
        },
        customizable: {
          colors: template.price > 0,
          fonts: template.price > 0,
          layout: template.price > 0,
        },
        browserSupport: {
          chrome: true,
          firefox: true,
          safari: true,
          edge: true,
        },
        creatorId,
        creatorType: 'SUPERADMIN',
        isApproved: true,
        isPremium: template.price > 0,
        isForSale: true,
        salePrice: template.price > 0 ? template.price : null,
        publishedAt: new Date(),
      },
    })
    
    console.log(`✅ Created template: ${template.name}`)
  }

  console.log(`\n🎉 Seed completed! Created ${templateData.length} templates.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
