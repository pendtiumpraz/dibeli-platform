import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkPermission } from '@/lib/permissions'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = await prisma.store.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (!checkPermission(session.user.tier, 'unlimited_products')) {
      if (store._count.products >= 3) {
        return NextResponse.json(
          { error: 'Product limit reached. Upgrade to Premium for unlimited products.' },
          { status: 403 }
        )
      }
    }

    const body = await req.json()
    const { name, description, price, stock, isAvailable } = body

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        price,
        stock,
        isAvailable: isAvailable !== false,
        images: [],
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
