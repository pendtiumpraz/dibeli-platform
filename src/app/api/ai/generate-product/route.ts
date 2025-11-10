import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    
    const { provider, apiKey, productName, price, description } = await request.json()
    
    if (!provider || !productName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get API key from request OR from user's saved keys
    let finalApiKey = apiKey
    
    if (!finalApiKey) {
      // Try to get from database
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          geminiApiKey: true,
          groqApiKey: true,
        },
      })
      
      if (provider === 'gemini' && user?.geminiApiKey) {
        finalApiKey = user.geminiApiKey
      } else if (provider === 'groq' && user?.groqApiKey) {
        finalApiKey = user.groqApiKey
      }
    }
    
    if (!finalApiKey) {
      return NextResponse.json({ 
        error: 'API key not found. Please provide API key or save it in settings.' 
      }, { status: 400 })
    }
    
    let generatedText = ''
    
    const prompt = `Kamu adalah copywriter expert untuk e-commerce Indonesia. Generate konten lengkap untuk landing page produk berikut:

Produk: ${productName}
Harga: Rp ${price || '0'}
Deskripsi singkat: ${description || 'Tidak ada deskripsi'}

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
      // Call Google Gemini API - Using latest model: gemini-2.0-flash
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${finalApiKey}`, {
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
        return NextResponse.json({ 
          error: 'Gemini API failed. Check your API key and ensure Gemini API is enabled in Google Cloud Console.',
          details: error
        }, { status: 500 })
      }
      
      const geminiData = await geminiRes.json()
      generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
    } else if (provider === 'groq') {
      // Call Groq API
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
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
        return NextResponse.json({ error: 'Groq API failed. Check your API key.' }, { status: 500 })
      }
      
      const groqData = await groqRes.json()
      generatedText = groqData.choices?.[0]?.message?.content || ''
    } else {
      return NextResponse.json({ error: 'Invalid provider. Use "gemini" or "groq"' }, { status: 400 })
    }
    
    if (!generatedText) {
      return NextResponse.json({ error: 'AI returned empty response' }, { status: 500 })
    }
    
    // Parse JSON response - handle markdown code blocks
    const cleanText = generatedText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()
    
    let generated
    try {
      generated = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', cleanText)
      return NextResponse.json({ error: 'AI returned invalid JSON format' }, { status: 500 })
    }
    
    return NextResponse.json(generated)
    
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'AI generation failed' },
      { status: 500 }
    )
  }
}
