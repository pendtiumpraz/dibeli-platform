import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - SuperAdmin only' },
        { status: 403 }
      )
    }

    const templateData = await req.json()

    // Validate required fields
    if (!templateData.id || !templateData.name || !templateData.config?.productCard) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, config.productCard' },
        { status: 400 }
      )
    }

    console.log('📝 Creating template:', templateData.id)

    // Read existing template-combiner.ts
    const combinerPath = path.join(process.cwd(), 'src', 'lib', 'template-combiner.ts')
    let combinerContent = fs.readFileSync(combinerPath, 'utf-8')

    // Check if template ID already exists
    if (combinerContent.includes(`id: '${templateData.id}'`)) {
      return NextResponse.json(
        { error: `Template ID '${templateData.id}' already exists` },
        { status: 400 }
      )
    }

    // Find the TEMPLATE_PACKAGES array
    const packagesStart = combinerContent.indexOf('export const TEMPLATE_PACKAGES: TemplatePackage[] = [')
    const packagesEnd = combinerContent.indexOf(']', packagesStart) + 1

    if (packagesStart === -1) {
      throw new Error('Could not find TEMPLATE_PACKAGES in template-combiner.ts')
    }

    // Build new template entry
    const newTemplate = `  {
    id: '${templateData.id}',
    name: '${templateData.name}',
    description: '${templateData.description}',
    thumbnail: '${templateData.thumbnail}',
    config: {
      ${templateData.config.nav ? `nav: '${templateData.config.nav}',` : ''}
      ${templateData.config.hero ? `hero: '${templateData.config.hero}',` : ''}
      productCard: '${templateData.config.productCard}',
      ${templateData.config.footer ? `footer: '${templateData.config.footer}',` : ''}
      ${templateData.config.background ? `background: '${templateData.config.background}',` : ''}
    },
    tier: '${templateData.tier}',
  },`

    // Insert new template at the end of array (before closing bracket)
    const beforeClosing = combinerContent.substring(0, packagesEnd - 1)
    const afterClosing = combinerContent.substring(packagesEnd - 1)
    const updatedContent = beforeClosing + newTemplate + '\n' + afterClosing

    // Write back to file
    fs.writeFileSync(combinerPath, updatedContent, 'utf-8')

    console.log('✅ Template created successfully:', templateData.id)

    return NextResponse.json({ 
      success: true,
      message: 'Template created successfully',
      templateId: templateData.id
    })
  } catch (error: any) {
    console.error('❌ Create Template Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    )
  }
}
