import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    const templateId = formData.get('templateId') as string

    // Delete template
    await prisma.template.delete({
      where: { id: templateId },
    })

    return NextResponse.redirect(new URL('/dashboard/admin/templates?success=deleted', request.url))
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.redirect(new URL('/dashboard/admin/templates?error=failed', request.url))
  }
}
