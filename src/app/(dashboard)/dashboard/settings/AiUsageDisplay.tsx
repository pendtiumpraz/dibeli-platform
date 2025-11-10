'use client'

import { useState, useEffect } from 'react'

interface UsageStats {
  tier: string
  quota: number
  used: number
  remaining: number
  percentage: number
  totalLifetime: number
  lastGeneratedAt: string | null
  nextResetDate: string | null
  isOverQuota: boolean
}

export default function AiUsageDisplay() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      const res = await fetch('/api/user/ai-usage')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const getProgressColor = () => {
    if (stats.tier === 'UNLIMITED') return 'from-purple-500 to-pink-500'
    if (stats.percentage >= 90) return 'from-red-500 to-red-600'
    if (stats.percentage >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-emerald-500'
  }

  const getTierBadge = () => {
    const badges = {
      TRIAL: { emoji: '🆓', color: 'bg-blue-100 text-blue-800', label: 'TRIAL' },
      FREE: { emoji: '🆓', color: 'bg-gray-100 text-gray-800', label: 'FREE' },
      PREMIUM: { emoji: '💎', color: 'bg-purple-100 text-purple-800', label: 'PREMIUM' },
      UNLIMITED: { emoji: '👑', color: 'bg-yellow-100 text-yellow-800', label: 'UNLIMITED' },
    }
    return badges[stats.tier as keyof typeof badges] || badges.FREE
  }

  const badge = getTierBadge()
  const isUnlimited = stats.tier === 'UNLIMITED'

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">📊 AI Generation Usage</h3>
          <p className="text-sm text-gray-600">Track your monthly AI generations</p>
        </div>
        <span className={`${badge.color} px-4 py-2 rounded-full text-sm font-bold`}>
          {badge.emoji} {badge.label}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Used This Month</p>
          <p className="text-2xl font-black text-blue-600">{stats.used}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Remaining</p>
          <p className="text-2xl font-black text-green-600">
            {isUnlimited ? '∞' : stats.remaining}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Monthly Quota</p>
          <p className="text-2xl font-black text-purple-600">
            {isUnlimited ? '∞' : stats.quota}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Lifetime</p>
          <p className="text-2xl font-black text-orange-600">{stats.totalLifetime}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {!isUnlimited && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className={`font-bold ${stats.isOverQuota ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.percentage}%
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${Math.min(100, stats.percentage)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Over Quota Warning */}
      {stats.isOverQuota && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-red-900 mb-1">Quota Exceeded!</p>
              <p className="text-sm text-red-800">
                You've reached your monthly limit of {stats.quota} generations. 
                {stats.nextResetDate && ` Quota resets on ${new Date(stats.nextResetDate).toLocaleDateString('id-ID', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.lastGeneratedAt && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Last Generation</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(stats.lastGeneratedAt).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
        
        {stats.nextResetDate && !isUnlimited && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Next Reset</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(stats.nextResetDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Prompt */}
      {!isUnlimited && stats.percentage >= 70 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-purple-900 mb-1">Running low on quota?</p>
              <p className="text-sm text-purple-700">
                Upgrade to {stats.tier === 'TRIAL' ? 'PREMIUM' : 'UNLIMITED'} for {stats.tier === 'TRIAL' ? '50' : 'unlimited'} generations/month!
              </p>
            </div>
            <a
              href="#upgrade"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      )}

      {/* Unlimited Badge */}
      {isUnlimited && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg text-center">
          <p className="text-2xl mb-2">👑</p>
          <p className="font-black text-yellow-900 text-lg">UNLIMITED POWER!</p>
          <p className="text-sm text-yellow-700">Generate as many products as you want!</p>
        </div>
      )}
    </div>
  )
}
