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
    const tier = formData.get('tier') as 'TRIAL' | 'PREMIUM' | 'UNLIMITED'
    const isSuperAdmin = formData.get('isSuperAdmin') === 'on'

    // Get user to check
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent removing SuperAdmin from owner email
    if (user.email === 'dibeli.my.id@gmail.com') {
      // Owner always stays SuperAdmin with UNLIMITED
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier: 'UNLIMITED',
          isSuperAdmin: true,
        },
      })
    } else {
      // Check SuperAdmin limit (max 3 total)
      if (isSuperAdmin && !user.isSuperAdmin) {
        const currentSuperAdmins = await prisma.user.count({
          where: { isSuperAdmin: true },
        })

        if (currentSuperAdmins >= 3) {
          return NextResponse.redirect(
            new URL('/dashboard/admin?error=max_superadmins', request.url)
          )
        }
      }

      // Update user
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier,
          isSuperAdmin,
        },
      })
    }

    // Redirect back to admin panel with success message
    return NextResponse.redirect(new URL('/dashboard/admin?success=user_updated', request.url))
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
