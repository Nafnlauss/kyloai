import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'leonardo_guimaraes@hotmail.com';
  
  try {
    // Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true
      }
    });
    
    // Buscar todas as contas Google
    const googleAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: {
        user: true
      }
    });
    
    return NextResponse.json({
      userFound: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        accountsCount: user.accounts.length,
        accounts: user.accounts.map(acc => ({
          provider: acc.provider,
          providerAccountId: acc.providerAccountId
        }))
      } : null,
      googleAccountsCount: googleAccounts.length,
      googleAccounts: googleAccounts.map(acc => ({
        userId: acc.userId,
        userEmail: acc.user.email,
        providerAccountId: acc.providerAccountId
      }))
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}