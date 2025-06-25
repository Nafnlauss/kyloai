import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // 1. Verificar sessão atual
    const session = await auth()
    
    // 2. Verificar cookies
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('authjs.session-token') || 
                        cookieStore.get('__Secure-authjs.session-token')
    
    // 3. Se há sessão, verificar dados do usuário no banco
    let dbUser = null
    let googleAccounts = []
    
    if (session?.user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          accounts: {
            where: { provider: 'google' }
          }
        }
      })
      
      // Verificar também por email
      if (!dbUser && session.user.email) {
        dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            accounts: {
              where: { provider: 'google' }
            }
          }
        })
      }
    }
    
    // 4. Verificar último login por email
    let recentLogins = []
    if (session?.user?.email) {
      const recentUsers = await prisma.user.findMany({
        where: {
          OR: [
            { email: session.user.email },
            { email: { contains: session.user.email.split('@')[0] } }
          ]
        },
        orderBy: { lastLoginAt: 'desc' },
        take: 5
      })
      
      recentLogins = recentUsers.map(u => ({
        id: u.id,
        email: u.email,
        lastLogin: u.lastLoginAt,
        hasGoogleAccount: false // será preenchido abaixo
      }))
      
      // Verificar quais têm conta Google
      for (const user of recentLogins) {
        const hasGoogle = await prisma.account.count({
          where: {
            userId: user.id,
            provider: 'google'
          }
        })
        user.hasGoogleAccount = hasGoogle > 0
      }
    }
    
    // 5. Construir resposta diagnóstica
    const diagnosis = {
      authenticated: !!session,
      hasSessionCookie: !!sessionToken,
      session: session ? {
        userId: session.user?.id,
        email: session.user?.email,
        name: session.user?.name,
        expires: session.expires
      } : null,
      databaseUser: dbUser ? {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        credits: dbUser.credits,
        googleAccounts: dbUser.accounts.map(a => ({
          id: a.id,
          googleId: a.providerAccountId
        }))
      } : null,
      recentLogins,
      issues: []
    }
    
    // Identificar problemas
    if (session && !dbUser) {
      diagnosis.issues.push({
        type: 'USER_NOT_FOUND',
        message: 'Sessão existe mas usuário não foi encontrado no banco',
        suggestion: 'Pode haver problema de sincronização entre sessão e banco'
      })
    }
    
    if (session && dbUser && session.user?.email !== dbUser.email) {
      diagnosis.issues.push({
        type: 'EMAIL_MISMATCH',
        message: `Email da sessão (${session.user?.email}) não corresponde ao banco (${dbUser.email})`,
        suggestion: 'Execute o script de correção de emails'
      })
    }
    
    if (!session && sessionToken) {
      diagnosis.issues.push({
        type: 'INVALID_SESSION',
        message: 'Cookie de sessão existe mas sessão não é válida',
        suggestion: 'Tente fazer logout e login novamente'
      })
    }
    
    // Adicionar recomendações
    if (diagnosis.issues.length > 0) {
      diagnosis.recommendations = [
        'Execute: node tests/clean-google-accounts.js --fix',
        'Faça logout e login novamente',
        'Verifique os logs do Railway para erros'
      ]
    }
    
    return NextResponse.json({
      success: diagnosis.authenticated && diagnosis.issues.length === 0,
      diagnosis,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}