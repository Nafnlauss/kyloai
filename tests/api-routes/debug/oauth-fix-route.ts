import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const email = searchParams.get('email');
  
  try {
    // 1. Listar todas as contas Google
    const googleAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // 2. Listar todos os usuários
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        accounts: {
          where: { provider: 'google' }
        }
      }
    });
    
    // 3. Encontrar problemas
    const problems = [];
    
    // Contas Google sem usuário válido
    const orphanAccounts = googleAccounts.filter(acc => !acc.user);
    if (orphanAccounts.length > 0) {
      problems.push({
        type: 'orphan_accounts',
        description: 'Google accounts without valid user',
        accounts: orphanAccounts
      });
    }
    
    // Usuários com múltiplas contas Google do mesmo ID
    const duplicateAccounts = [];
    const accountsByProviderId = googleAccounts.reduce((acc, account) => {
      const key = account.providerAccountId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(account);
      return acc;
    }, {} as Record<string, typeof googleAccounts>);
    
    Object.entries(accountsByProviderId).forEach(([providerId, accounts]) => {
      if (accounts.length > 1) {
        duplicateAccounts.push({
          providerAccountId: providerId,
          accounts: accounts.map(a => ({
            id: a.id,
            userId: a.userId,
            userEmail: a.user?.email || 'NO USER',
            createdAt: a.createdAt
          }))
        });
      }
    });
    
    if (duplicateAccounts.length > 0) {
      problems.push({
        type: 'duplicate_accounts',
        description: 'Same Google account linked to multiple users',
        duplicates: duplicateAccounts
      });
    }
    
    // 4. Ações de correção
    if (action === 'clean-duplicates') {
      let cleaned = 0;
      
      for (const dup of duplicateAccounts) {
        // Manter apenas a conta mais recente
        const [keep, ...remove] = dup.accounts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        for (const acc of remove) {
          await prisma.account.delete({
            where: { id: acc.id }
          });
          cleaned++;
        }
      }
      
      return NextResponse.json({
        message: `Cleaned ${cleaned} duplicate accounts`,
        cleaned
      });
    }
    
    if (action === 'clean-orphans') {
      const deleted = await prisma.account.deleteMany({
        where: {
          provider: 'google',
          userId: null
        }
      });
      
      return NextResponse.json({
        message: `Deleted ${deleted.count} orphan accounts`,
        deleted: deleted.count
      });
    }
    
    if (action === 'unlink' && email) {
      // Desvincular conta Google de um email específico
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      const deleted = await prisma.account.deleteMany({
        where: {
          userId: user.id,
          provider: 'google'
        }
      });
      
      return NextResponse.json({
        message: `Unlinked ${deleted.count} Google accounts from ${email}`,
        deleted: deleted.count
      });
    }
    
    // 5. Relatório completo
    return NextResponse.json({
      summary: {
        totalUsers: users.length,
        totalGoogleAccounts: googleAccounts.length,
        usersWithGoogle: users.filter(u => u.accounts.length > 0).length,
        problems: problems.length
      },
      problems,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt,
        googleAccounts: u.accounts.map(a => ({
          id: a.id,
          providerAccountId: a.providerAccountId,
          createdAt: a.createdAt
        }))
      })),
      actions: {
        cleanDuplicates: '/api/debug/oauth-fix?action=clean-duplicates',
        cleanOrphans: '/api/debug/oauth-fix?action=clean-orphans',
        unlinkSpecific: '/api/debug/oauth-fix?action=unlink&email=USER_EMAIL'
      }
    });
    
  } catch (error: any) {
    console.error('OAuth fix error:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, googleAccountId } = await request.json();
    
    if (!email || !googleAccountId) {
      return NextResponse.json({
        error: 'Email and googleAccountId are required'
      }, { status: 400 });
    }
    
    // 1. Verificar se o usuário existe
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Criar novo usuário
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          emailVerified: new Date(),
          credits: 300,
          creditsLastReset: new Date()
        }
      });
    }
    
    // 2. Remover qualquer vinculação anterior deste Google Account
    await prisma.account.deleteMany({
      where: {
        provider: 'google',
        providerAccountId: googleAccountId
      }
    });
    
    // 3. Criar nova vinculação
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oidc',
        provider: 'google',
        providerAccountId: googleAccountId,
        access_token: 'manual-link',
        expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 dias
        token_type: 'Bearer',
        scope: 'openid email profile'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Successfully linked Google account ${googleAccountId} to ${email}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      account: {
        id: account.id,
        providerAccountId: account.providerAccountId
      }
    });
    
  } catch (error: any) {
    console.error('OAuth manual link error:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}