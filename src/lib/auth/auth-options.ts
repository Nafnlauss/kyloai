import { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login?error=true',
    verifyRequest: '/login?verify=true',
  },
  trustHost: true, // Important for production deployments behind proxies
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)
          
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })
          
          if (!user || !user.passwordHash) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return null
          }
          
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error('Account locked. Please try again later.')
          }
          
          // Check if email is verified for non-Google accounts
          if (!user.emailVerified) {
            throw new Error('Please verify your email before signing in.')
          }
          
          const isValid = await bcrypt.compare(password, user.passwordHash)
          
          if (!isValid) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: { increment: 1 },
                lockedUntil: user.failedLoginAttempts >= 4 
                  ? new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
                  : null,
              },
            })
            return null
          }
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
              lastLoginIp: '', // Will be updated in session callback
            },
          })
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      
      if (account) {
        token.provider = account.provider
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              credits: 300, // Créditos iniciais para novos usuários Google
              creditsLastReset: new Date(),
            },
          })
        }
      }
      
      return true
    },
  },
  events: {
    async signIn({ user }) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'AUTH_LOGIN',
          resource: 'USER',
          resourceId: user.id,
        },
      })
    },
    async signOut({ token }) {
      if (token?.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id as string,
            action: 'AUTH_LOGOUT',
            resource: 'USER',
            resourceId: token.id as string,
          },
        })
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
}