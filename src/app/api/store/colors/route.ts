import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/store/colors
 * Update store custom colors
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check tier access
    const canCustomize = session.user.tier === 'PREMIUM' || session.user.tier === 'UNLIMITED'
    if (!canCustomize) {
      return NextResponse.json(
        { error: 'Custom colors require PREMIUM or UNLIMITED tier' },
        { status: 403 }
      )
    }

    const { customColors } = await request.json()

    if (!customColors) {
      return NextResponse.json(
        { error: 'Custom colors data is required' },
        { status: 400 }
      )
    }

    // Validate hex colors
    const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color)
    const colors = customColors as { primary?: string, secondary?: string, accent?: string, background?: string, text?: string }

    if (colors.primary && !isValidHex(colors.primary)) {
      return NextResponse.json({ error: 'Invalid primary color format' }, { status: 400 })
    }
    if (colors.secondary && !isValidHex(colors.secondary)) {
      return NextResponse.json({ error: 'Invalid secondary color format' }, { status: 400 })
    }

    // Get user's store
    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Update colors
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: { customColors },
    })

    return NextResponse.json({
      success: true,
      message: 'Custom colors updated successfully',
      customColors: updatedStore.customColors,
    })
  } catch (error) {
    console.error('Store colors update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/store/colors
 * Get current store custom colors
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      select: { customColors: true },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      customColors: store.customColors,
    })
  } catch (error) {
    console.error('Store colors fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
