import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getQuotaForTier, getRemainingQuota, getQuotaPercentage, shouldResetMonthlyQuota, getNextResetDate } from '@/lib/ai-quota'

/**
 * GET /api/user/ai-usage
 * Get user's AI generation usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        tier: true,
        aiGenerationsTotal: true,
        aiGenerationsThisMonth: true,
        lastAiGenerationAt: true,
        aiMonthlyResetDate: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if we need to reset monthly counter
    if (user.aiMonthlyResetDate && shouldResetMonthlyQuota(user.aiMonthlyResetDate)) {
      // Reset monthly counter
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          aiGenerationsThisMonth: 0,
          aiMonthlyResetDate: getNextResetDate(user.aiMonthlyResetDate),
        },
      })
      
      // Return reset values
      const quota = getQuotaForTier(user.tier)
      const nextReset = getNextResetDate(user.aiMonthlyResetDate)
      
      return NextResponse.json({
        tier: user.tier,
        quota,
        used: 0,
        remaining: quota,
        percentage: 0,
        totalLifetime: user.aiGenerationsTotal,
        lastGeneratedAt: user.lastAiGenerationAt,
        nextResetDate: nextReset,
        isOverQuota: false,
      })
    }

    // Calculate current stats
    const quota = getQuotaForTier(user.tier)
    const used = user.aiGenerationsThisMonth
    const remaining = getRemainingQuota(used, user.tier)
    const percentage = getQuotaPercentage(used, user.tier)
    const isOverQuota = used >= quota && user.tier !== 'UNLIMITED'
    const nextReset = user.aiMonthlyResetDate ? getNextResetDate(user.aiMonthlyResetDate) : null

    return NextResponse.json({
      tier: user.tier,
      quota,
      used,
      remaining,
      percentage,
      totalLifetime: user.aiGenerationsTotal,
      lastGeneratedAt: user.lastAiGenerationAt,
      nextResetDate: nextReset,
      isOverQuota,
    })
  } catch (error) {
    console.error('AI usage fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
