import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const accountCount = await prisma.account.count()
    const userCount = await prisma.user.count()
    
    // Get sample account to check structure
    const sampleAccount = await prisma.account.findFirst()
    const sampleUser = await prisma.user.findFirst()
    
    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      counts: {
        accounts: accountCount,
        users: userCount,
      },
      sampleStructures: {
        account: sampleAccount ? Object.keys(sampleAccount) : 'No accounts yet',
        user: sampleUser ? Object.keys(sampleUser) : 'No users yet',
      },
      prismaClientVersion: '5.22.0',
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5),
    }, { status: 500 })
  }
}
