import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const storeId = params.id

    // Verify store ownership
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (store.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to edit this store' }, { status: 403 })
    }

    const body = await request.json()

    // Update store with all fields
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name: body.name,
        description: body.description || null,
        // Contact
        email: body.email || null,
        phone: body.phone || null,
        whatsappNumber: body.whatsappNumber,
        // Address
        address: body.address || null,
        city: body.city || null,
        province: body.province || null,
        country: body.country || null,
        postalCode: body.postalCode || null,
        googleMapsEmbed: body.googleMapsEmbed || null,
        // Social Media
        facebookUrl: body.facebookUrl || null,
        instagramUrl: body.instagramUrl || null,
        twitterUrl: body.twitterUrl || null,
        youtubeUrl: body.youtubeUrl || null,
        linkedinUrl: body.linkedinUrl || null,
        tiktokUrl: body.tiktokUrl || null,
      },
    })

    return NextResponse.json(updatedStore)
  } catch (error) {
    console.error('Store update error:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const storeId = params.id

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (store.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Store fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    )
  }
}
