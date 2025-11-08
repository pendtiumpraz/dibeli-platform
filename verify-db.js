const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('🔍 Verifying Production Database...\n')
  
  try {
    // Test 1: Check if User table exists and is accessible
    const userCount = await prisma.user.count()
    console.log('✅ User table exists - Count:', userCount)
    
    // Test 2: Check if Store table exists
    const storeCount = await prisma.store.count()
    console.log('✅ Store table exists - Count:', storeCount)
    
    // Test 3: Check if Product table exists
    const productCount = await prisma.product.count()
    console.log('✅ Product table exists - Count:', productCount)
    
    // Test 4: Check if Template table exists
    const templateCount = await prisma.template.count()
    console.log('✅ Template table exists - Count:', templateCount)
    
    // Test 5: Check Account table (for OAuth)
    const accountCount = await prisma.account.count()
    console.log('✅ Account table exists - Count:', accountCount)
    
    // Test 6: Check Session table
    const sessionCount = await prisma.session.count()
    console.log('✅ Session table exists - Count:', sessionCount)
    
    console.log('\n🎉 ALL TABLES VERIFIED SUCCESSFULLY!')
    console.log('✅ Database is ready for production use!')
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message)
    console.error('\nThis means tables might not exist yet.')
    console.error('Run: npx prisma db push')
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()
