import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import { calculateTrialEndDate } from './utils'
import { Adapter } from 'next-auth/adapters'
import { sendWelcomeEmail } from './email'

export const authOptions: NextAuthOptions = {
  // Note: Using JWT sessions, so no adapter needed
  // adapter: PrismaAdapter(prisma) as Adapter,
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
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        // Create user if doesn't exist
        if (!dbUser && account) {
          const trialStart = new Date()
          const trialEnd = calculateTrialEndDate(trialStart)
          const isSuperAdmin = user.email === 'dibeli.my.id@gmail.com'
          
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              tier: isSuperAdmin ? 'UNLIMITED' : 'TRIAL',
              trialStartDate: trialStart,
              trialEndDate: trialEnd,
              isSuperAdmin,
            },
          })

          // Create OAuth account link
          await prisma.account.create({
            data: {
              userId: dbUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })

          // Send welcome email for new users
          if (!isSuperAdmin) {
            sendWelcomeEmail(
              user.email,
              user.name || 'Sobat Seller',
              trialEnd
            ).catch(console.error)
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
              try {
                await prisma.user.update({
                  where: { id: dbUser.id },
                  data: { isSuperAdmin: true },
                })
              } catch (updateError) {
                console.error('Failed to update SuperAdmin status:', updateError)
              }
            }
            
            // User exists, use their data
            session.user.id = dbUser.id
            session.user.tier = dbUser.tier
            session.user.isSuperAdmin = isSuperAdmin
            session.user.trialEndDate = dbUser.trialEndDate
          } else {
            // User doesn't exist yet (race condition with PrismaAdapter)
            // Set defaults for session, adapter will create user
            const isSuperAdmin = session.user.email === 'dibeli.my.id@gmail.com'
            
            const trialEnd = calculateTrialEndDate(new Date())
            
            session.user.id = token.sub
            session.user.tier = isSuperAdmin ? 'UNLIMITED' : 'TRIAL'
            session.user.isSuperAdmin = isSuperAdmin
            session.user.trialEndDate = trialEnd
            
            // User doesn't exist yet, skip update
            // The signIn callback will handle user creation and trial setup
            console.log('User not found in session callback, likely being created')
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
