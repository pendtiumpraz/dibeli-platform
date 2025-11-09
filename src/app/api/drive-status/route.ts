import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'Not logged in' 
      })
    }

    // Check account in database
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
      select: {
        access_token: true,
        refresh_token: true,
        scope: true,
        expires_at: true,
      }
    })

    if (!account) {
      return NextResponse.json({
        authenticated: true,
        hasAccount: false,
        error: 'No Google account linked',
        fix: 'Logout and login again with Google',
        user: session.user.email,
      })
    }

    const now = Date.now() / 1000
    const tokenExpired = account.expires_at && account.expires_at < now

    const hasDriveScope = account.scope?.includes('drive.file') || false

    return NextResponse.json({
      authenticated: true,
      hasAccount: true,
      hasAccessToken: !!account.access_token,
      hasRefreshToken: !!account.refresh_token,
      tokenExpired,
      scope: account.scope,
      hasDriveScope,
      expiresAt: account.expires_at,
      user: session.user.email,
      status: hasDriveScope && account.access_token && !tokenExpired ? 'READY' : 'NEEDS_REAUTH',
      message: hasDriveScope && account.access_token && !tokenExpired 
        ? '✅ Drive ready to use' 
        : tokenExpired 
        ? '⚠️ Token expired - Logout and login again'
        : !hasDriveScope 
        ? '❌ Missing Drive scope - Logout and login again' 
        : '❌ No access token - Logout and login again',
    })
  } catch (error) {
    console.error('Drive status check error:', error)
    return NextResponse.json({ 
      error: 'Failed to check status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
