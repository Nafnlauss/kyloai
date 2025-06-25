import { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { GOOGLE_CONFIG } from './google-config'

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
    error: '/login', // Removido ?error=true para evitar confusão
    verifyRequest: '/login?verify=true',
  },
  trustHost: true, // Important for production deployments behind proxies
  useSecureCookies: process.env.NODE_ENV === 'production',
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CONFIG.clientId,
      clientSecret: GOOGLE_CONFIG.clientSecret,
      allowDangerousEmailAccountLinking: false,
      authorization: {
        params: {
          prompt: "select_account", // Sempre mostrar seleção de conta
          access_type: "offline",
          response_type: "code"
        }
      }
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
    async redirect({ url, baseUrl }) {
      // Sempre redirecionar para o dashboard após login bem-sucedido
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + '/studio/video';
    },
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
        profileEmail: profile?.email,
        providerAccountId: account?.providerAccountId
      });
      
      if (account?.provider === 'google') {
        try {
          const googleEmail = profile?.email || user.email;
          console.log('🔵 Processing Google login for:', googleEmail);
          
          // 1. Limpar qualquer conta Google órfã (sem usuário)
          await prisma.account.deleteMany({
            where: {
              provider: 'google',
              providerAccountId: account.providerAccountId,
              userId: null
            }
          });
          
          // 2. Verificar se esta conta Google já está vinculada
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: 'google',
              providerAccountId: account.providerAccountId
            },
            include: { user: true }
          });
          
          if (existingAccount && existingAccount.user) {
            console.log('🔵 Google account already linked to:', existingAccount.user.email);
            
            // Verificar se o email mudou (usuário fez login com conta Google diferente)
            if (existingAccount.user.email !== googleEmail) {
              console.log('⚠️  Email mismatch detected!');
              console.log('   Account email:', existingAccount.user.email);
              console.log('   Google email:', googleEmail);
              
              // Verificar se o email do Google já pertence a outro usuário
              const googleEmailUser = await prisma.user.findUnique({
                where: { email: googleEmail! }
              });
              
              if (googleEmailUser) {
                // Email já existe, atualizar a vinculação
                console.log('🔄 Updating account link to correct user...');
                await prisma.account.update({
                  where: { id: existingAccount.id },
                  data: { userId: googleEmailUser.id }
                });
                
                user.id = googleEmailUser.id;
                user.email = googleEmailUser.email;
                user.name = user.name || googleEmailUser.name;
                user.image = user.image || googleEmailUser.image;
              } else {
                // Atualizar o email do usuário existente para corresponder ao Google
                console.log('🔄 Updating user email to match Google account...');
                await prisma.user.update({
                  where: { id: existingAccount.user.id },
                  data: { 
                    email: googleEmail!,
                    emailVerified: new Date() // Google emails são sempre verificados
                  }
                });
                
                user.id = existingAccount.user.id;
                user.email = googleEmail!;
                user.name = user.name || existingAccount.user.name;
                user.image = user.image || existingAccount.user.image;
              }
            } else {
              // Emails correspondem, usar dados existentes
              user.id = existingAccount.user.id;
              user.email = existingAccount.user.email;
              user.name = user.name || existingAccount.user.name;
              user.image = user.image || existingAccount.user.image;
            }
            
            // Sempre atualizar dados do perfil
            await prisma.user.update({
              where: { id: user.id },
              data: {
                name: user.name,
                image: user.image,
                lastLoginAt: new Date()
              }
            });
            
            return true;
          }
          
          // 3. Se não há conta vinculada, verificar se o usuário existe pelo email
          let dbUser = await prisma.user.findUnique({
            where: { email: googleEmail! }
          });
          
          if (!dbUser) {
            console.log('🔵 Creating new user for:', googleEmail);
            dbUser = await prisma.user.create({
              data: {
                email: googleEmail!,
                name: user.name || googleEmail!.split('@')[0],
                image: user.image,
                emailVerified: new Date(),
                credits: 300,
                creditsLastReset: new Date(),
              }
            });
            console.log('✅ New user created with ID:', dbUser.id);
          } else {
            console.log('🔵 Found existing user:', dbUser.email);
          }
          
          // 4. IMPORTANTE: Definir o ID correto do usuário
          user.id = dbUser.id;
          user.email = dbUser.email;
          user.name = user.name || dbUser.name;
          user.image = user.image || dbUser.image;
          
          console.log('🔵 Final user object:', {
            id: user.id,
            email: user.email,
            name: user.name
          });
          
          // 5. NextAuth criará automaticamente o registro na tabela Account
          return true;
          
        } catch (error) {
          console.error('🔴 Error in Google signIn:', error);
          // Não lançar erro, apenas logar e retornar false
          return false;
        }
      }
      
      // Para outros providers
      return true;
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