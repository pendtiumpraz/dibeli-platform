import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * DEBUG ENDPOINT - Test ALL Gemini & Groq models
 * GET /api/debug/test-all-ai-models
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { geminiApiKey: true, groqApiKey: true },
    })

    const geminiApiKey = user?.geminiApiKey
    const groqApiKey = user?.groqApiKey
    const testPrompt = 'Say OK'
    
    const geminiResults: any[] = []
    const groqResults: any[] = []

    // ==================== GEMINI MODELS ====================
    if (geminiApiKey) {
      const geminiModels = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.5-pro-latest',
        'gemini-pro',
        'gemini-2.0-flash-exp',
      ]

      for (const model of geminiModels) {
        try {
          const start = Date.now()
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: testPrompt }] }],
                generationConfig: { maxOutputTokens: 50 }
              })
            }
          )

          const time = Date.now() - start

          if (res.ok) {
            const data = await res.json()
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
            geminiResults.push({
              model,
              status: 'SUCCESS ✅',
              time: `${time}ms`,
              response: text,
            })
          } else {
            const error = await res.text()
            geminiResults.push({
              model,
              status: `FAILED (${res.status})`,
              time: `${time}ms`,
              error: error.substring(0, 200),
            })
          }
        } catch (error: any) {
          geminiResults.push({
            model,
            status: 'ERROR ❌',
            error: error.message,
          })
        }
        await new Promise(r => setTimeout(r, 500))
      }
    }

    // ==================== GROQ MODELS ====================
    if (groqApiKey) {
      const groqModels = [
        'llama-3.3-70b-versatile',
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
      ]

      for (const model of groqModels) {
        try {
          const start = Date.now()
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: testPrompt }],
              max_tokens: 50,
            })
          })

          const time = Date.now() - start

          if (res.ok) {
            const data = await res.json()
            const text = data.choices?.[0]?.message?.content || ''
            groqResults.push({
              model,
              status: 'SUCCESS ✅',
              time: `${time}ms`,
              response: text,
            })
          } else {
            const error = await res.text()
            groqResults.push({
              model,
              status: `FAILED (${res.status})`,
              time: `${time}ms`,
              error: error.substring(0, 200),
            })
          }
        } catch (error: any) {
          groqResults.push({
            model,
            status: 'ERROR ❌',
            error: error.message,
          })
        }
        await new Promise(r => setTimeout(r, 500))
      }
    }

    // Summary
    const allWorking = [
      ...geminiResults.filter(r => r.status.includes('SUCCESS')),
      ...groqResults.filter(r => r.status.includes('SUCCESS'))
    ]

    const fastest = allWorking.length > 0
      ? allWorking.reduce((prev, curr) => 
          parseInt(prev.time) < parseInt(curr.time) ? prev : curr
        )
      : null

    return NextResponse.json({
      summary: {
        geminiTested: geminiResults.length,
        geminiWorking: geminiResults.filter(r => r.status.includes('SUCCESS')).length,
        groqTested: groqResults.length,
        groqWorking: groqResults.filter(r => r.status.includes('SUCCESS')).length,
        fastest: fastest?.model || 'None',
        fastestTime: fastest?.time || 'N/A',
      },
      gemini: geminiResults,
      groq: groqResults,
      recommendation: fastest 
        ? `Use: ${fastest.model} (${fastest.time})` 
        : 'No working models found',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
