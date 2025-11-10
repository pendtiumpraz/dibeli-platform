import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isOverQuota, getQuotaForTier, getRemainingQuota, shouldResetMonthlyQuota, getNextResetDate } from '@/lib/ai-quota'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check UNLIMITED tier
    if (session.user.tier !== 'UNLIMITED') {
      return NextResponse.json({ error: 'Feature ini hanya untuk UNLIMITED users' }, { status: 403 })
    }
    
    // Get user's current usage AND API keys in one query
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        tier: true,
        aiGenerationsThisMonth: true,
        aiMonthlyResetDate: true,
        geminiApiKey: true,
        groqApiKey: true,
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Check if need to reset monthly counter
    let currentUsage = user.aiGenerationsThisMonth
    if (user.aiMonthlyResetDate && shouldResetMonthlyQuota(user.aiMonthlyResetDate)) {
      // Reset counter
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          aiGenerationsThisMonth: 0,
          aiMonthlyResetDate: getNextResetDate(user.aiMonthlyResetDate),
        },
      })
      currentUsage = 0
    }
    
    // Check quota
    if (isOverQuota(currentUsage, user.tier)) {
      const quota = getQuotaForTier(user.tier)
      const nextReset = user.aiMonthlyResetDate ? getNextResetDate(user.aiMonthlyResetDate) : new Date()
      return NextResponse.json({ 
        error: `Quota AI generation habis! Limit: ${quota} generations/bulan. Reset: ${nextReset.toLocaleDateString('id-ID')}`,
        quotaExceeded: true,
        quota,
        used: currentUsage,
        nextReset,
      }, { status: 429 })
    }
    
    const body = await request.json()
    const { provider, apiKey, productName, price, description, category } = body
    
    if (!provider || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get API key from request OR from user's saved keys (already fetched above)
    let finalApiKey = apiKey
    
    if (!finalApiKey) {
      // Use saved API key from database
      if (provider === 'gemini' && user.geminiApiKey) {
        finalApiKey = user.geminiApiKey
        console.log('✅ Using saved Gemini API key from database')
      } else if (provider === 'groq' && user.groqApiKey) {
        finalApiKey = user.groqApiKey
        console.log('✅ Using saved Groq API key from database')
      }
    }
    
    if (!finalApiKey) {
      return NextResponse.json({ 
        error: `${provider === 'gemini' ? 'Gemini' : 'Groq'} API key not found. Please save your API key in Settings first.`,
        missingKey: true,
      }, { status: 400 })
    }
    
    console.log(`🤖 AI Generation starting with ${provider}...`)
    
    let generatedText = ''
    
    // Import category utilities
    const { buildCategoryPrompt } = await import('@/lib/product-categories')
    
    // Build context-aware prompt based on category
    const baseContext = category 
      ? buildCategoryPrompt(category, productName, price || '0', description)
      : `Kamu adalah copywriter expert untuk e-commerce Indonesia. Generate konten lengkap untuk landing page produk berikut:

Produk: ${productName}
Harga: Rp ${price || '0'}
Deskripsi singkat: ${description || 'Tidak ada deskripsi'}`
    
    const prompt = baseContext + `

Buatkan dalam format JSON dengan struktur:
{
  "headline": "Headline menarik (max 60 karakter)",
  "subheadline": "Subheadline persuasif (max 120 karakter)",
  "description": "Deskripsi lengkap produk (3-4 paragraf)",
  "benefits": [
    {"text": "Manfaat 1"},
    {"text": "Manfaat 2"},
    {"text": "Manfaat 3"},
    {"text": "Manfaat 4"},
    {"text": "Manfaat 5"}
  ],
  "features": [
    {"text": "Spesifikasi 1"},
    {"text": "Spesifikasi 2"},
    {"text": "Spesifikasi 3"},
    {"text": "Spesifikasi 4"},
    {"text": "Spesifikasi 5"}
  ],
  "testimonials": [
    {"name": "Nama 1", "rating": 5, "text": "Testimoni positif", "role": "Pembeli Verified"},
    {"name": "Nama 2", "rating": 5, "text": "Testimoni positif", "role": "Pembeli Verified"},
    {"name": "Nama 3", "rating": 5, "text": "Testimoni positif", "role": "Pembeli Verified"}
  ],
  "bonuses": [
    {"title": "Bonus 1", "description": "Deskripsi bonus", "value": "Rp 50.000"},
    {"title": "Bonus 2", "description": "Deskripsi bonus", "value": "Rp 30.000"}
  ],
  "faqs": [
    {"question": "Pertanyaan 1?", "answer": "Jawaban 1"},
    {"question": "Pertanyaan 2?", "answer": "Jawaban 2"},
    {"question": "Pertanyaan 3?", "answer": "Jawaban 3"},
    {"question": "Pertanyaan 4?", "answer": "Jawaban 4"},
    {"question": "Pertanyaan 5?", "answer": "Jawaban 5"}
  ],
  "guarantee": "Text garansi yang meyakinkan (2-3 kalimat)",
  "socialProof": "Bukti sosial (contoh: '1000+ Pelanggan Puas di Seluruh Indonesia')",
  "urgencyText": "Text urgency yang membuat FOMO",
  "ctaText": "Text CTA yang action-oriented (contoh: 'PESAN SEKARANG JUGA!')"
}

PENTING:
- Gunakan Bahasa Indonesia yang persuasif dan natural
- Buat testimonials yang realistic dan beragam
- Benefits harus spesifik dan relevan dengan produk
- FAQs harus menjawab kekhawatiran umum pembeli
- Guarantee harus membuat customer merasa aman
- Urgency text harus menciptakan FOMO tanpa berlebihan
- Return HANYA JSON, tanpa markdown atau teks tambahan`
    
    if (provider === 'gemini') {
      // Call Google Gemini API - Using STABLE model: gemini-2.0-flash
      // TESTED WORKING: gemini-2.0-flash, gemini-2.5-flash, gemini-2.5-pro
      // FREE tier = 15 req/min, 32K tokens/min. Use Groq for better limits!
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${finalApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      })
      
      if (!geminiRes.ok) {
        const error = await geminiRes.text()
        console.error('Gemini API error:', error)
        console.error('API Key used:', finalApiKey.substring(0, 10) + '...')
        
        // Parse error untuk detect rate limit
        try {
          const errorData = JSON.parse(error)
          if (errorData.error?.code === 429 || errorData.error?.status === 'RESOURCE_EXHAUSTED') {
            return NextResponse.json({ 
              error: '⚠️ Gemini Quota Habis! FREE tier = 15 req/menit.\n\n💡 SOLUSI:\n1. Tunggu 1 menit, lalu retry\n2. Switch ke Groq (30 req/menit, lebih cepat!)\n3. Upgrade Gemini ke paid plan',
              rateLimitExceeded: true,
              retryAfter: errorData.error?.details?.find((d: any) => d.retryDelay)?.retryDelay || '60s',
              provider: 'gemini',
            }, { status: 429 })
          }
        } catch (parseError) {
          // Fallback jika error bukan JSON
        }
        
        return NextResponse.json({ 
          error: 'Gemini API failed. Check your API key and ensure Gemini API is enabled in Google Cloud Console.',
          details: error
        }, { status: 500 })
      }
      
      const geminiData = await geminiRes.json()
      generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
    } else if (provider === 'groq') {
      // Call Groq API - FREE tier = 30 req/min, 14,400 req/day (VERY GENEROUS!)
      // Using llama-3.1-8b-instant - FASTEST model (134ms avg)!
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Updated to working model
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7,
          max_tokens: 2000,
        })
      })
      
      if (!groqRes.ok) {
        const error = await groqRes.text()
        console.error('Groq API error:', error)
        console.error('API Key used:', finalApiKey.substring(0, 10) + '...')
        
        // Check for rate limit
        if (groqRes.status === 429) {
          return NextResponse.json({ 
            error: '⚠️ Groq Rate Limit!\n\nFREE tier = 30 req/menit.\nTunggu sebentar lalu retry.',
            rateLimitExceeded: true,
            retryAfter: groqRes.headers.get('retry-after') || '60s',
            provider: 'groq',
          }, { status: 429 })
        }
        
        return NextResponse.json({ 
          error: 'Groq API failed. Check your API key at https://console.groq.com/keys',
          details: error
        }, { status: 500 })
      }
      
      const groqData = await groqRes.json()
      generatedText = groqData.choices?.[0]?.message?.content || ''
    } else {
      return NextResponse.json({ error: 'Invalid provider. Use "gemini" or "groq"' }, { status: 400 })
    }
    
    if (!generatedText) {
      return NextResponse.json({ error: 'AI returned empty response' }, { status: 500 })
    }
    
    // Parse JSON response - ROBUST cleanup for various AI response formats
    let cleanText = generatedText.trim()
    
    // Remove markdown code blocks
    cleanText = cleanText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
    
    // Try to extract JSON if text before/after
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanText = jsonMatch[0]
    }
    
    // Remove any BOM or zero-width characters
    cleanText = cleanText.replace(/^\uFEFF/, '').replace(/\u200B/g, '')
    
    let generated
    try {
      generated = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('AI Provider:', provider)
      console.error('Raw response (first 500 chars):', generatedText.substring(0, 500))
      console.error('Cleaned text (first 500 chars):', cleanText.substring(0, 500))
      return NextResponse.json({ 
        error: 'AI returned invalid JSON format',
        details: 'Response could not be parsed. Try again or switch provider.',
        preview: cleanText.substring(0, 200)
      }, { status: 500 })
    }
    
    // Increment usage counters (only on success)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        aiGenerationsTotal: { increment: 1 },
        aiGenerationsThisMonth: { increment: 1 },
        lastAiGenerationAt: new Date(),
      },
    })
    
    // Add usage info to response
    const newUsage = currentUsage + 1
    const quota = getQuotaForTier(user.tier)
    const remaining = getRemainingQuota(newUsage, user.tier)
    
    return NextResponse.json({
      ...generated,
      _usage: {
        used: newUsage,
        quota,
        remaining,
      },
    })
    
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'AI generation failed' },
      { status: 500 }
    )
  }
}
