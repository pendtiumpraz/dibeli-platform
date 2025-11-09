import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingStore = await prisma.store.findUnique({
      where: { userId: session.user.id },
    })

    if (existingStore) {
      return NextResponse.json({ error: 'Store already exists' }, { status: 400 })
    }

    const body = await req.json()
    const { name, slug, tagline, whatsappNumber } = body

    // Validate required fields
    if (!name || !slug || !whatsappNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slugExists = await prisma.store.findUnique({
      where: { slug },
    })

    if (slugExists) {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 400 })
    }

    const store = await prisma.store.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        tagline,
        description: tagline || `Selamat datang di ${name}`,
        whatsappNumber,
        categories: [],
        keywords: [],
        address: '',
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error('Store creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
