import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * DEBUG: Test Gemini API directly with full error details
 * GET /api/debug/test-gemini-direct
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { geminiApiKey: true },
    })

    if (!user?.geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key not found' }, { status: 400 })
    }

    const apiKey = user.geminiApiKey
    const testPrompt = `Generate a simple product description in JSON format:
{
  "headline": "Amazing Product",
  "subheadline": "Best product ever",
  "description": "This is great"
}`

    console.log('🧪 Testing Gemini API...')
    console.log('Model: gemini-2.0-flash')
    console.log('API Key:', apiKey.substring(0, 15) + '...')

    const startTime = Date.now()
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: testPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    )

    const responseTime = Date.now() - startTime
    const responseText = await response.text()

    console.log('Response Status:', response.status)
    console.log('Response Time:', responseTime + 'ms')
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))

    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { raw: responseText }
    }

    if (!response.ok) {
      console.error('❌ Gemini API Error:', responseData)
      
      return NextResponse.json({
        success: false,
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries()),
        error: responseData,
        rawResponse: responseText.substring(0, 1000),
      })
    }

    const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    console.log('✅ Gemini API Success!')
    console.log('Generated text length:', generatedText.length)

    return NextResponse.json({
      success: true,
      status: response.status,
      responseTime: `${responseTime}ms`,
      model: responseData.modelVersion,
      tokensUsed: responseData.usageMetadata?.totalTokenCount,
      generatedText: generatedText.substring(0, 500),
      fullResponse: responseData,
    })

  } catch (error: any) {
    console.error('❌ Test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
