'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserTier } from '@prisma/client'
import { isTrialExpired } from '@/lib/utils'
import { useState } from 'react'
import Link from 'next/link'

interface DashboardHeaderProps {
  user: {
    name?: string | null
    email?: string
    image?: string | null
    tier: UserTier
    trialEndDate: Date
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isExpired = isTrialExpired(user.trialEndDate)
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  )

  const getTierBadge = () => {
    if (user.tier === 'TRIAL' && !isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          Trial: {daysLeft} hari
        </span>
      )
    }
    if (user.tier === 'TRIAL' && isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Trial Expired
        </span>
      )
    }
    if (user.tier === 'PREMIUM') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Premium
        </span>
      )
    }
    if (user.tier === 'UNLIMITED') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
          Unlimited
        </span>
      )
    }
    return null
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user.name || 'User'}
              </p>
              <div className="flex items-center gap-2">
                {getTierBadge()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {(user.tier === 'TRIAL' || user.tier === 'FREE') && (
              <Link href="/pricing" className="hidden sm:block">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Upgrade
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut()} className="hidden sm:flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="space-y-1">
              <Link href="/dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
                Dashboard
              </Link>
              <Link href="/dashboard/store" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
                Toko Saya
              </Link>
              <Link href="/dashboard/products" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
                Produk
              </Link>
              <Link href="/dashboard/templates" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
                Template
              </Link>
              <Link href="/dashboard/settings" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
                Pengaturan
              </Link>
              {(user.tier === 'TRIAL' || user.tier === 'FREE') && (
                <Link href="/pricing" className="block px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-center">
                  Upgrade Premium
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
