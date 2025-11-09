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
        id: true,
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

    const now = Math.floor(Date.now() / 1000)
    let tokenExpired = account.expires_at && account.expires_at < now

    const hasDriveScope = account.scope?.includes('drive.file') || false

    // Try to auto-refresh if expired
    if (tokenExpired && account.refresh_token) {
      console.log('Token expired, attempting auto-refresh...')
      try {
        const { google } = await import('googleapis')
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.NEXTAUTH_URL + '/api/auth/callback/google'
        )

        oauth2Client.setCredentials({
          access_token: account.access_token,
          refresh_token: account.refresh_token,
        })

        const { credentials } = await oauth2Client.refreshAccessToken()
        console.log('Token refreshed successfully in status check')
        
        // Update account with new token
        await prisma.account.update({
          where: { id: account.id },
          data: {
            access_token: credentials.access_token,
            expires_at: credentials.expiry_date ? Math.floor(credentials.expiry_date / 1000) : null,
            refresh_token: credentials.refresh_token || account.refresh_token,
          },
        })
        
        tokenExpired = false
        account.expires_at = credentials.expiry_date ? Math.floor(credentials.expiry_date / 1000) : null
      } catch (refreshError) {
        console.error('Auto-refresh failed in status check:', refreshError)
      }
    }

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
      currentTime: now,
      status: hasDriveScope && account.access_token && !tokenExpired ? 'READY' : 'NEEDS_REAUTH',
      message: hasDriveScope && account.access_token && !tokenExpired 
        ? '✅ Drive ready to use' 
        : tokenExpired 
        ? '⚠️ Token expired - Will auto-refresh on upload'
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
