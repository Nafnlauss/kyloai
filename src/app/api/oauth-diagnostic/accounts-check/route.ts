import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Buscar todas as contas Google
    const googleAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // 2. Agrupar por providerAccountId para encontrar duplicatas
    const accountsByProviderId: Record<string, typeof googleAccounts> = {}
    googleAccounts.forEach(account => {
      const key = account.providerAccountId
      if (!accountsByProviderId[key]) {
        accountsByProviderId[key] = []
      }
      accountsByProviderId[key].push(account)
    })
    
    // 3. Identificar problemas
    const duplicates = Object.entries(accountsByProviderId)
      .filter(([_, accounts]) => accounts.length > 1)
      .map(([providerId, accounts]) => ({
        providerAccountId: providerId,
        count: accounts.length,
        accounts: accounts.map(a => ({
          id: a.id,
          userId: a.userId,
          userEmail: a.user?.email || 'NO USER',
          userName: a.user?.name,
          createdAt: a.createdAt
        }))
      }))
    
    // 4. Contas órfãs (sem usuário)
    const orphanAccounts = googleAccounts.filter(a => !a.user)
    
    // 5. Usuários com múltiplas contas Google
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          where: { provider: 'google' }
        }
      }
    })
    
    const usersWithMultipleAccounts = users
      .filter(u => u.accounts.length > 1)
      .map(u => ({
        userId: u.id,
        email: u.email,
        accountCount: u.accounts.length,
        accounts: u.accounts.map(a => ({
          id: a.id,
          providerAccountId: a.providerAccountId
        }))
      }))
    
    // 6. Estatísticas gerais
    const stats = {
      totalGoogleAccounts: googleAccounts.length,
      totalUsers: users.length,
      usersWithGoogle: users.filter(u => u.accounts.length > 0).length,
      usersWithoutGoogle: users.filter(u => u.accounts.length === 0).length
    }
    
    const hasIssues = duplicates.length > 0 || orphanAccounts.length > 0 || usersWithMultipleAccounts.length > 0
    
    return NextResponse.json({
      hasIssues,
      message: hasIssues ? 'Problemas encontrados nas contas' : 'Todas as contas estão corretas',
      stats,
      issues: {
        duplicates: {
          count: duplicates.length,
          details: duplicates
        },
        orphanAccounts: {
          count: orphanAccounts.length,
          details: orphanAccounts.map(a => ({
            id: a.id,
            providerAccountId: a.providerAccountId,
            createdAt: a.createdAt
          }))
        },
        usersWithMultipleAccounts: {
          count: usersWithMultipleAccounts.length,
          details: usersWithMultipleAccounts
        }
      },
      recommendations: getRecommendations(duplicates, orphanAccounts, usersWithMultipleAccounts)
    })
  } catch (error: any) {
    return NextResponse.json({
      hasIssues: true,
      message: 'Erro ao verificar contas',
      error: error.message
    }, { status: 500 })
  }
}

function getRecommendations(duplicates: any[], orphans: any[], multipleAccounts: any[]) {
  const recommendations = []
  
  if (duplicates.length > 0) {
    recommendations.push({
      issue: 'Contas Google duplicadas',
      action: 'Execute o script de limpeza: node tests/fix-oauth-accounts.js',
      severity: 'high'
    })
  }
  
  if (orphans.length > 0) {
    recommendations.push({
      issue: 'Contas órfãs sem usuário',
      action: 'Remova contas órfãs do banco de dados',
      severity: 'medium'
    })
  }
  
  if (multipleAccounts.length > 0) {
    recommendations.push({
      issue: 'Usuários com múltiplas contas Google',
      action: 'Isso pode ser intencional, mas verifique se não há duplicatas',
      severity: 'low'
    })
  }
  
  return recommendations
}