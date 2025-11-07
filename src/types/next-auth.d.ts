import { UserTier } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      tier: UserTier
      isSuperAdmin: boolean
      trialEndDate: Date
    }
  }

  interface User {
    id: string
    tier: UserTier
    isSuperAdmin: boolean
    trialEndDate: Date
  }
}
