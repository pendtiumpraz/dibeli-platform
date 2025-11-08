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
    const storeId = formData.get('storeId') as string
    const isPubliclyListed = formData.get('isPubliclyListed') === 'true'

    await prisma.store.update({
      where: { id: storeId },
      data: { isPubliclyListed },
    })

    return NextResponse.redirect(new URL('/dashboard/admin/stores?success=updated', request.url))
  } catch (error) {
    console.error('Toggle public error:', error)
    return NextResponse.redirect(new URL('/dashboard/admin/stores?error=failed', request.url))
  }
}
