import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is SuperAdmin
    if (!session?.user?.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const formData = await request.formData()
    const userId = formData.get('userId') as string

    // Check current SuperAdmin count
    const currentSuperAdmins = await prisma.user.count({
      where: { isSuperAdmin: true },
    })

    if (currentSuperAdmins >= 3) {
      return NextResponse.redirect(new URL('/dashboard/admin/roles?error=max_superadmins', request.url))
    }

    // Promote user to SuperAdmin
    await prisma.user.update({
      where: { id: userId },
      data: {
        isSuperAdmin: true,
        tier: 'UNLIMITED', // SuperAdmins get unlimited access
      },
    })

    return NextResponse.redirect(new URL('/dashboard/admin/roles?success=promoted', request.url))
  } catch (error) {
    console.error('Promote user error:', error)
    return NextResponse.redirect(new URL('/dashboard/admin/roles?error=failed', request.url))
  }
}
