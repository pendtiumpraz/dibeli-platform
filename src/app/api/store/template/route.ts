import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { TEMPLATE_INFO, canAccessTemplate } from '@/components/store-templates/registry'
import type { StoreTemplateId } from '@/components/store-templates/registry'

/**
 * PUT /api/store/template
 * Update store template
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

    const { templateId } = await request.json()

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Validate template exists
    const templateInfo = TEMPLATE_INFO[templateId as StoreTemplateId]
    if (!templateInfo) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    // Check tier access
    if (!canAccessTemplate(session.user.tier, templateInfo.tier)) {
      return NextResponse.json(
        { error: `This template requires ${templateInfo.tier} tier. Please upgrade your account.` },
        { status: 403 }
      )
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

    // Update template
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: { templateId },
    })

    return NextResponse.json({
      success: true,
      message: 'Template updated successfully',
      templateId: updatedStore.templateId,
      templateName: templateInfo.name,
    })
  } catch (error) {
    console.error('Store template update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/store/template
 * Get current store template
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
      select: { templateId: true },
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    const templateId = store.templateId || 'simple-classic'
    const templateInfo = TEMPLATE_INFO[templateId as StoreTemplateId]

    return NextResponse.json({
      templateId,
      templateInfo,
    })
  } catch (error) {
    console.error('Store template fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
