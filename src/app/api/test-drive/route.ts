import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('Testing Drive access for:', session.user.email)

    // Get user's OAuth tokens
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    })

    if (!account) {
      return NextResponse.json({ 
        error: 'No Google account found',
        message: 'Please logout and login again with Google'
      }, { status: 400 })
    }

    if (!account.access_token) {
      return NextResponse.json({ 
        error: 'No access token',
        message: 'Please logout and login again with Google',
        scope: account.scope
      }, { status: 400 })
    }

    console.log('OAuth Scope:', account.scope)

    // Check if drive.file scope is present
    const hasDriverScope = account.scope?.includes('drive.file')
    
    if (!hasDriverScope) {
      return NextResponse.json({ 
        error: 'Missing Drive scope',
        message: 'OAuth scope does not include drive.file. Please logout and login again.',
        currentScope: account.scope,
        requiredScope: 'https://www.googleapis.com/auth/drive.file'
      }, { status: 400 })
    }

    // Try to create Drive client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL + '/api/auth/callback/google'
    )

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Test Drive access by listing files
    const response = await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    })

    return NextResponse.json({
      success: true,
      message: 'Drive access working!',
      scope: account.scope,
      hasDriveScope: hasDriverScope,
      canAccessDrive: true,
      testResult: response.data.files || [],
    })
  } catch (error) {
    console.error('Drive test error:', error)
    return NextResponse.json({ 
      error: 'Drive test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  }
}
