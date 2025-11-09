import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTemplatePackage } from '@/lib/template-combiner'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { templateId } = await request.json()

    if (!templateId) {
      return new NextResponse('Template ID required', { status: 400 })
    }

    // Verify template exists
    const template = getTemplatePackage(templateId)
    if (!template) {
      return new NextResponse('Template not found', { status: 404 })
    }

    // Verify store ownership
    const store = await prisma.store.findUnique({
      where: { id: params.id },
      include: { user: true },
    })

    if (!store || store.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Check if user can use this template
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true },
    })

    if (template.tier !== 'FREE' && user?.tier !== 'PREMIUM' && user?.tier !== 'UNLIMITED') {
      return new NextResponse('Upgrade to Premium required', { status: 403 })
    }

    // Update store template
    // TODO: Add templateId field to Store model first
    // For now, return success
    return NextResponse.json({
      success: true,
      templateId,
      message: 'Template will be applied (pending DB migration)',
    })
  } catch (error) {
    console.error('Template update error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
