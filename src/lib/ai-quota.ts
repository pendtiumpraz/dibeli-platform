/**
 * AI Generation Quota System
 * Manages monthly quotas per user tier
 */

export const AI_QUOTA = {
  TRIAL: 5,
  FREE: 10,
  PREMIUM: 50,
  UNLIMITED: 999999, // Effectively unlimited
} as const

export type UserTier = keyof typeof AI_QUOTA

export function getQuotaForTier(tier: string): number {
  return AI_QUOTA[tier as UserTier] || AI_QUOTA.FREE
}

export function isOverQuota(currentUsage: number, tier: string): boolean {
  const quota = getQuotaForTier(tier)
  return currentUsage >= quota
}

export function getRemainingQuota(currentUsage: number, tier: string): number {
  const quota = getQuotaForTier(tier)
  const remaining = quota - currentUsage
  return Math.max(0, remaining)
}

export function getQuotaPercentage(currentUsage: number, tier: string): number {
  const quota = getQuotaForTier(tier)
  if (tier === 'UNLIMITED') return 0 // Never show limit for unlimited
  return Math.min(100, Math.round((currentUsage / quota) * 100))
}

export function shouldResetMonthlyQuota(lastResetDate: Date): boolean {
  const now = new Date()
  const nextReset = new Date(lastResetDate)
  nextReset.setMonth(nextReset.getMonth() + 1)
  return now >= nextReset
}

export function getNextResetDate(currentResetDate: Date): Date {
  const nextReset = new Date(currentResetDate)
  nextReset.setMonth(nextReset.getMonth() + 1)
  return nextReset
}
