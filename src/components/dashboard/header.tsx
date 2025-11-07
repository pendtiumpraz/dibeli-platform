'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserTier } from '@prisma/client'
import { isTrialExpired } from '@/lib/utils'

interface DashboardHeaderProps {
  user: {
    name?: string | null
    email?: string
    tier: UserTier
    trialEndDate: Date
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const isExpired = isTrialExpired(user.trialEndDate)
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Halo, {user.name || 'User'}!
          </h2>
          {user.tier === 'TRIAL' && !isExpired && (
            <p className="text-sm text-gray-600">
              🎉 Trial: {daysLeft} hari tersisa
            </p>
          )}
          {user.tier === 'TRIAL' && isExpired && (
            <p className="text-sm text-red-600">
              ⚠️ Trial expired - Upgrade to Premium
            </p>
          )}
          {user.tier === 'PREMIUM' && (
            <p className="text-sm text-purple-600">
              💎 Premium Member
            </p>
          )}
          {user.tier === 'UNLIMITED' && (
            <p className="text-sm text-purple-600">
              👑 Unlimited Member
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {(user.tier === 'TRIAL' || user.tier === 'FREE') && (
            <Button variant="default" size="sm">
              ⬆️ Upgrade to Premium
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
