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

    // Get user to check
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/dashboard/admin/roles?error=user_not_found', request.url))
    }

    // Prevent removing owner
    if (user.email === 'dibeli.my.id@gmail.com') {
      return NextResponse.redirect(new URL('/dashboard/admin/roles?error=cannot_remove_owner', request.url))
    }

    // Remove SuperAdmin role
    await prisma.user.update({
      where: { id: userId },
      data: {
        isSuperAdmin: false,
      },
    })

    return NextResponse.redirect(new URL('/dashboard/admin/roles?success=removed', request.url))
  } catch (error) {
    console.error('Remove SuperAdmin error:', error)
    return NextResponse.redirect(new URL('/dashboard/admin/roles?error=failed', request.url))
  }
}
