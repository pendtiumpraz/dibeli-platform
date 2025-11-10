import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - SuperAdmin only' },
        { status: 403 }
      )
    }

    const { prompt, tier } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get user's saved API keys
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        geminiApiKey: true,
        groqApiKey: true,
      },
    })

    if (!user?.geminiApiKey && !user?.groqApiKey) {
      return NextResponse.json(
        { error: 'No API keys found. Please save API keys in Admin Settings first.' },
        { status: 400 }
      )
    }

    // Prefer Groq (faster)
    const useGroq = !!user.groqApiKey
    const apiKey = useGroq ? user.groqApiKey : user.geminiApiKey

    console.log('🤖 AI Template Generation:', {
      provider: useGroq ? 'Groq' : 'Gemini',
      tier,
      promptLength: prompt.length,
    })

    // Build AI prompt
    const systemPrompt = `You are a template configuration generator for an e-commerce platform.
Given a description, generate a JSON template configuration.

Available components:
- Nav: "premium-nav", "luxury-nav", "modern-nav"
- Hero: "gradient-hero", "ultimate-hero", "minimal-hero"
- Product Card: "card-hover-overlay", "card-zoom-hover", "card-flip-3d", "card-image-slider"
- Footer: "ultimate-footer", "premium-footer", "modern-footer"
- Background: "gradient-bg", "minimal-bg"

TIER: ${tier}
- FREE: Use basic/minimal components
- PREMIUM: Use premium/modern components  
- UNLIMITED: Use ultimate/luxury components

USER REQUEST: ${prompt}

Generate ONLY valid JSON (no markdown, no extra text):
{
  "name": "Template Name",
  "description": "Short description with emojis",
  "thumbnail": "https://images.unsplash.com/photo-[relevant]?w=400&h=300&fit=crop",
  "config": {
    "nav": "component-name",
    "hero": "component-name",
    "productCard": "component-name",
    "footer": "component-name",
    "background": "component-name"
  }
}`

    // Call AI API
    let aiResponse
    if (useGroq) {
      // Groq API
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Groq API error:', errorText)
        return NextResponse.json(
          { error: 'Groq API request failed' },
          { status: response.status }
        )
      }

      const data = await response.json()
      aiResponse = data.choices[0]?.message?.content || ''
    } else {
      // Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: systemPrompt + '\n\n' + prompt }],
              },
            ],
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error:', errorText)
        return NextResponse.json(
          { error: 'Gemini API request failed' },
          { status: response.status }
        )
      }

      const data = await response.json()
      aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }

    console.log('✅ AI Response received:', aiResponse.substring(0, 100))

    // Clean up response
    let cleanJson = aiResponse.trim()
    // Remove markdown code blocks
    cleanJson = cleanJson.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
    // Remove BOM
    cleanJson = cleanJson.replace(/^\uFEFF/, '')
    // Extract JSON if wrapped
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanJson = jsonMatch[0]
    }

    const templateData = JSON.parse(cleanJson)

    return NextResponse.json(templateData)
  } catch (error: any) {
    console.error('❌ AI Generation Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate template' },
      { status: 500 }
    )
  }
}
