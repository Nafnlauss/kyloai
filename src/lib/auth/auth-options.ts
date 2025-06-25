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

// Debug: Log quando auth-options é carregado
console.log('🔧 Loading auth-options...');

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (mais seguro)
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login?error=true',
    verifyRequest: '/login?verify=true',
  },
  trustHost: true, // Important for production deployments behind proxies
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
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
      console.log('🔵 SignIn attempt:', { 
        provider: account?.provider,
        email: user.email,
        userId: user.id,
        profileEmail: profile?.email
      });
      
      if (account?.provider === 'google') {
        try {
          // IMPORTANTE: Usar o email do perfil do Google, não o do usuário
          const googleEmail = profile?.email || user.email;
          console.log('🔵 Using Google profile email:', googleEmail);
          
          // Primeiro, verificar se esta conta Google já está vinculada a algum usuário
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: 'google',
              providerAccountId: account.providerAccountId
            },
            include: { user: true }
          });
          
          if (existingAccount) {
            console.log('🔵 Google account already linked to:', existingAccount.user.email);
            // Usar o usuário já vinculado
            user.id = existingAccount.user.id;
            user.email = existingAccount.user.email;
            user.name = existingAccount.user.name || user.name;
            user.image = existingAccount.user.image || user.image;
            
            // Atualizar informações do usuário se necessário
            if (user.name !== existingAccount.user.name || user.image !== existingAccount.user.image) {
              await prisma.user.update({
                where: { id: existingAccount.user.id },
                data: {
                  name: user.name,
                  image: user.image
                }
              });
            }
            
            return true;
          }
          
          // Se não existe conta vinculada, procurar usuário pelo email
          const existingUser = await prisma.user.findUnique({
            where: { email: googleEmail! },
          });
          
          console.log('🔵 Existing user check:', existingUser ? 'found' : 'not found');
          
          if (!existingUser) {
            console.log('🔵 Creating new user for:', googleEmail);
            const newUser = await prisma.user.create({
              data: {
                email: googleEmail!,
                name: user.name,
                image: user.image,
                emailVerified: new Date(),
                credits: 300, // Créditos iniciais para novos usuários Google
                creditsLastReset: new Date(),
              },
            });
            console.log('✅ New user created successfully with ID:', newUser.id);
            
            // Set the correct user ID
            user.id = newUser.id;
            user.email = newUser.email;
          } else {
            // Update the user object to match the database
            user.id = existingUser.id;
            user.email = existingUser.email;
            user.name = existingUser.name || user.name;
            user.image = existingUser.image || user.image;
            console.log('🔵 Using existing user ID:', existingUser.id);
          }
        } catch (error) {
          console.error('🔴 Error in signIn:', error);
          throw error;
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
  debug: true, // Temporário para debug
  logger: {
    error(code, metadata) {
      console.error('🔴 NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('🟡 NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('🔵 NextAuth Debug:', code, metadata)
    }
  },
}