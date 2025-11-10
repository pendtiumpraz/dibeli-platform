/**
 * Convert benefits and features columns from text[] to jsonb
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Converting database columns from text[] to jsonb...\n')

  try {
    // Convert benefits column
    console.log('📝 Converting benefits column...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Product" 
      ALTER COLUMN "benefits" TYPE jsonb 
      USING (
        CASE 
          WHEN "benefits" IS NULL THEN NULL
          ELSE (
            SELECT jsonb_agg(jsonb_build_object('text', elem))
            FROM unnest("benefits") AS elem
          )
        END
      );
    `)
    console.log('✅ Benefits column converted to jsonb\n')

    // Convert features column
    console.log('📝 Converting features column...')
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Product" 
      ALTER COLUMN "features" TYPE jsonb 
      USING (
        CASE 
          WHEN "features" IS NULL THEN NULL
          ELSE (
            SELECT jsonb_agg(jsonb_build_object('text', elem))
            FROM unnest("features") AS elem
          )
        END
      );
    `)
    console.log('✅ Features column converted to jsonb\n')

    console.log('🎉 Migration complete! Columns are now jsonb type.')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
