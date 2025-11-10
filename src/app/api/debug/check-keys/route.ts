import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * DEBUG ENDPOINT - Check if API keys are actually saved
 * GET /api/debug/check-keys
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        tier: true,
        geminiApiKey: true,
        groqApiKey: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Return info about keys (masked for security)
    return NextResponse.json({
      userId: user.id,
      email: user.email,
      tier: user.tier,
      geminiApiKey: {
        exists: !!user.geminiApiKey,
        length: user.geminiApiKey?.length || 0,
        preview: user.geminiApiKey ? user.geminiApiKey.substring(0, 10) + '...' : null,
      },
      groqApiKey: {
        exists: !!user.groqApiKey,
        length: user.groqApiKey?.length || 0,
        preview: user.groqApiKey ? user.groqApiKey.substring(0, 10) + '...' : null,
      },
    })
  } catch (error) {
    console.error('Debug check keys error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
