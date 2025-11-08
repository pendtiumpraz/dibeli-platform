// Quick script to upgrade owner email to SuperAdmin
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixOwner() {
  try {
    console.log('🔧 Updating owner account...')
    
    const result = await prisma.user.update({
      where: {
        email: 'dibeli.my.id@gmail.com',
      },
      data: {
        isSuperAdmin: true,
        tier: 'UNLIMITED',
      },
    })
    
    console.log('✅ Owner account updated successfully!')
    console.log('📧 Email:', result.email)
    console.log('👑 SuperAdmin:', result.isSuperAdmin)
    console.log('🚀 Tier:', result.tier)
    console.log('\n💡 Now logout and login again to apply changes!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixOwner()
