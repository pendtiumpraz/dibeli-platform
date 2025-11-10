/**
 * Migration Script: Convert benefits/features from String[] to Json (object[])
 * 
 * Old format: ["benefit 1", "benefit 2"]
 * New format: [{"text": "benefit 1"}, {"text": "benefit 2"}]
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Starting migration: benefits/features String[] -> Json...\n')

  // Get all products
  const products = await prisma.$queryRaw<any[]>`
    SELECT id, name, benefits, features, testimonials, bonuses, faqs
    FROM "Product"
  `

  console.log(`📦 Found ${products.length} products to check\n`)

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const product of products) {
    try {
      const updates: any = {}
      let needsUpdate = false

      // Convert benefits if it's an array of strings
      if (product.benefits) {
        if (Array.isArray(product.benefits)) {
          // Old format: string[]
          updates.benefits = product.benefits.map((b: string) => ({ text: b }))
          needsUpdate = true
          console.log(`  ✓ Converting benefits for: ${product.name}`)
        } else if (typeof product.benefits === 'object') {
          // Already JSON, check if it needs conversion
          const benefitsArray = Array.isArray(product.benefits) 
            ? product.benefits 
            : JSON.parse(product.benefits as string)
          
          if (benefitsArray.length > 0 && typeof benefitsArray[0] === 'string') {
            updates.benefits = benefitsArray.map((b: string) => ({ text: b }))
            needsUpdate = true
            console.log(`  ✓ Converting benefits (JSON string) for: ${product.name}`)
          }
        }
      }

      // Convert features if it's an array of strings
      if (product.features) {
        if (Array.isArray(product.features)) {
          // Old format: string[]
          updates.features = product.features.map((f: string) => ({ text: f }))
          needsUpdate = true
          console.log(`  ✓ Converting features for: ${product.name}`)
        } else if (typeof product.features === 'object') {
          // Already JSON, check if it needs conversion
          const featuresArray = Array.isArray(product.features)
            ? product.features
            : JSON.parse(product.features as string)
          
          if (featuresArray.length > 0 && typeof featuresArray[0] === 'string') {
            updates.features = featuresArray.map((f: string) => ({ text: f }))
            needsUpdate = true
            console.log(`  ✓ Converting features (JSON string) for: ${product.name}`)
          }
        }
      }

      // Update product if needed
      if (needsUpdate) {
        await prisma.$executeRaw`
          UPDATE "Product"
          SET 
            benefits = ${JSON.stringify(updates.benefits || product.benefits)}::jsonb,
            features = ${JSON.stringify(updates.features || product.features)}::jsonb
          WHERE id = ${product.id}
        `
        updated++
        console.log(`  ✅ Updated: ${product.name}\n`)
      } else {
        skipped++
      }
    } catch (error) {
      errors++
      console.error(`  ❌ Error updating ${product.name}:`, error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary:')
  console.log(`  ✅ Updated: ${updated} products`)
  console.log(`  ⏭️  Skipped: ${skipped} products (already correct format)`)
  console.log(`  ❌ Errors: ${errors} products`)
  console.log('='.repeat(50))
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
