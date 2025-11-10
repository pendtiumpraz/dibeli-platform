import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/user/api-keys
 * Get user's saved API keys
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
        geminiApiKey: true,
        groqApiKey: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      geminiApiKey: user.geminiApiKey || null,
      groqApiKey: user.groqApiKey || null,
      hasGeminiKey: !!user.geminiApiKey,
      hasGroqKey: !!user.groqApiKey,
    })
  } catch (error) {
    console.error('API keys fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/api-keys
 * Save user's API keys
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { geminiApiKey, groqApiKey } = await request.json()

    // Update user's API keys
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        geminiApiKey: geminiApiKey || null,
        groqApiKey: groqApiKey || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'API keys saved successfully',
      hasGeminiKey: !!updatedUser.geminiApiKey,
      hasGroqKey: !!updatedUser.groqApiKey,
    })
  } catch (error) {
    console.error('API keys save error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user/api-keys
 * Delete user's API keys
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { provider } = await request.json()

    if (provider === 'gemini') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { geminiApiKey: null },
      })
    } else if (provider === 'groq') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { groqApiKey: null },
      })
    } else if (provider === 'all') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          geminiApiKey: null,
          groqApiKey: null,
        },
      })
    } else {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'API key(s) deleted successfully',
    })
  } catch (error) {
    console.error('API keys delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
