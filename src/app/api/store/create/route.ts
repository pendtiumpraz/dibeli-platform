import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    console.log('=== STORE CREATION START ===')
    const session = await getServerSession(authOptions)
    
    console.log('Session user:', session?.user?.email, 'ID:', session?.user?.id)
    
    if (!session?.user) {
      console.error('No session user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.id) {
      console.error('Session user has no ID')
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // CRITICAL: Verify user exists in database
    console.log('Verifying user exists in database:', session.user.id)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!userExists) {
      console.error('User not found in database! ID:', session.user.id)
      return NextResponse.json({ 
        error: 'User not found. Please logout and login again.' 
      }, { status: 400 })
    }

    console.log('User verified:', userExists.email)
    console.log('Checking for existing store for user:', session.user.id)
    
    const existingStore = await prisma.store.findUnique({
      where: { userId: session.user.id },
    })

    if (existingStore) {
      console.log('Store already exists:', existingStore.id)
      return NextResponse.json({ error: 'Store already exists' }, { status: 400 })
    }

    const body = await req.json()
    const { name, slug, tagline, whatsappNumber } = body

    console.log('Store data:', { name, slug, tagline, whatsappNumber })

    // Validate required fields
    if (!name || !slug || !whatsappNumber) {
      console.error('Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('Checking if slug exists:', slug)
    
    const slugExists = await prisma.store.findUnique({
      where: { slug },
    })

    if (slugExists) {
      console.log('Slug already taken:', slug)
      return NextResponse.json({ error: 'Slug already taken' }, { status: 400 })
    }

    console.log('Creating store for user:', session.user.id)

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
        isPublished: true, // Auto-publish new stores
        isPubliclyListed: true, // Show in marketplace
      },
    })

    console.log('Store created successfully:', store.id)

    // Get first available free template
    const defaultTemplate = await prisma.template.findFirst({
      where: { isPremium: false },
      orderBy: { createdAt: 'asc' },
    })

    if (defaultTemplate) {
      // Auto-apply default template to new store
      console.log('Applying default template to store...')
      try {
        await prisma.storeTemplate.create({
          data: {
            storeId: store.id,
            templateId: defaultTemplate.id,
            category: 'full_page',
            isActive: true,
          },
        })
        console.log('Default template applied successfully')
      } catch (templateError) {
        console.error('Failed to apply template:', templateError)
        // Continue even if template application fails
      }
    } else {
      console.log('No default template found, store created without template')
    }
    console.log('=== STORE CREATION END ===')

    return NextResponse.json(store)
  } catch (error) {
    console.error('Store creation error:', error)
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Detailed error:', errorMessage)
    
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 })
  }
}
