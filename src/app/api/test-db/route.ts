import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    
    return NextResponse.json({
      status: 'SUCCESS',
      database: 'Connected ✅',
      tables: {
        User: `${userCount} records`,
        Account: `${accountCount} records`,
        Session: `${sessionCount} records`,
      },
      message: 'Database connection working!',
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      database: 'Connection Failed ❌',
      error: error.message,
      code: error.code,
      details: 'Database might not be initialized or connection string is wrong',
    }, { status: 500 })
  }
}
