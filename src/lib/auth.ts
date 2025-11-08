import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { calculateTrialEndDate } from './utils'
import { Adapter } from 'next-auth/adapters'
import { sendWelcomeEmail } from './email'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/drive.file',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // PrismaAdapter handles User and Account creation automatically
      // We just need to set initial tier and trial dates for new users
      
      if (!user.email) return false

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        // For new users, update with trial info after adapter creates them
        if (!existingUser) {
          const trialStart = new Date()
          const trialEnd = calculateTrialEndDate(trialStart)
          
          // Let adapter create user first, then we'll update in session callback
          // Store trial dates in a way that won't conflict
          if (account) {
            // Just allow signin, we'll set trial info in session callback
            return true
          }
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
          })

          if (dbUser) {
            // Check if user should be SuperAdmin
            const isSuperAdmin = session.user.email === 'dibeli.my.id@gmail.com' || dbUser.isSuperAdmin
            
            // Update SuperAdmin status if needed
            if (isSuperAdmin && !dbUser.isSuperAdmin) {
              await prisma.user.update({
                where: { id: token.sub },
                data: { isSuperAdmin: true },
              })
            }
            
            // User exists, use their data
            session.user.id = dbUser.id
            session.user.tier = dbUser.tier
            session.user.isSuperAdmin = isSuperAdmin
            session.user.trialEndDate = dbUser.trialEndDate
          } else {
            // New user created by adapter, set trial info
            const trialStart = new Date()
            const trialEnd = calculateTrialEndDate(trialStart)
            const isSuperAdmin = session.user.email === 'dibeli.my.id@gmail.com'
            
            const updatedUser = await prisma.user.update({
              where: { id: token.sub },
              data: {
                tier: isSuperAdmin ? 'UNLIMITED' : 'TRIAL',
                trialStartDate: trialStart,
                trialEndDate: trialEnd,
                isSuperAdmin,
              },
            })
            
            session.user.id = updatedUser.id
            session.user.tier = updatedUser.tier
            session.user.isSuperAdmin = updatedUser.isSuperAdmin
            session.user.trialEndDate = updatedUser.trialEndDate
            
            // Send welcome email for new users (async, don't wait)
            if (!isSuperAdmin) {
              sendWelcomeEmail(
                session.user.email || '',
                session.user.name || 'Sobat Seller',
                trialEnd
              ).catch(console.error)
            }
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}
