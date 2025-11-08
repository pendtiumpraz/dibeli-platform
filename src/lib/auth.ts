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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existingUser && account) {
        const trialStart = new Date()
        const trialEnd = calculateTrialEndDate(trialStart)

        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            tier: 'TRIAL',
            trialStartDate: trialStart,
            trialEndDate: trialEnd,
          },
        })

        // Send welcome email (don't wait for it)
        sendWelcomeEmail(user.email, user.name || 'Sobat Seller', trialEnd).catch((error) => {
          console.error('Failed to send welcome email:', error)
        })
      } else if (existingUser && account) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
          },
        })
      }

      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.tier = dbUser.tier
          session.user.isSuperAdmin = dbUser.isSuperAdmin
          session.user.trialEndDate = dbUser.trialEndDate
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
