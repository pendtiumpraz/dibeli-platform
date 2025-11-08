import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const formData = await request.formData()
    const templateId = formData.get('templateId') as string
    const storeId = formData.get('storeId') as string

    if (!storeId) {
      return NextResponse.redirect(new URL('/dashboard/store?error=no_store', request.url))
    }

    // Get template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.redirect(new URL('/dashboard/templates?error=template_not_found', request.url))
    }

    // Check if user has permission to use this template
    const canUse = !template.isPremium || 
                   (template.isPremium && (session.user.tier === 'PREMIUM' || session.user.tier === 'UNLIMITED'))

    if (!canUse) {
      return NextResponse.redirect(new URL('/dashboard/settings?error=upgrade_required', request.url))
    }

    // Verify store belongs to user
    const store = await prisma.store.findUnique({
      where: { id: storeId, userId: session.user.id },
    })

    if (!store) {
      return NextResponse.redirect(new URL('/dashboard/templates?error=unauthorized', request.url))
    }

    // Apply template to store (use "full_page" category for main template)
    await prisma.storeTemplate.upsert({
      where: {
        storeId_category: {
          storeId: store.id,
          category: 'full_page',
        },
      },
      create: {
        storeId: store.id,
        templateId: template.id,
        category: 'full_page',
        isActive: true,
      },
      update: {
        templateId: template.id,
        isActive: true,
      },
    })

    // Update template usage count
    await prisma.template.update({
      where: { id: template.id },
      data: {
        useCount: {
          increment: 1,
        },
      },
    })

    // Redirect back to store with success
    return NextResponse.redirect(new URL(`/dashboard/store?success=template_applied&template=${template.name}`, request.url))
  } catch (error) {
    console.error('Apply template error:', error)
    return NextResponse.redirect(new URL('/dashboard/templates?error=apply_failed', request.url))
  }
}
