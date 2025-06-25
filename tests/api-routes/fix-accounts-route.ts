import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  try {
    // Listar todas as contas Google e seus usuários
    const accounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true }
    });
    
    // Agrupar por providerAccountId
    const grouped = accounts.reduce((acc, account) => {
      const key = account.providerAccountId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(account);
      return acc;
    }, {} as Record<string, typeof accounts>);
    
    // Encontrar duplicatas
    const duplicates = Object.entries(grouped)
      .filter(([_, accounts]) => accounts.length > 1)
      .map(([providerAccountId, accounts]) => ({
        providerAccountId,
        accounts: accounts.map(a => ({
          id: a.id,
          userId: a.userId,
          userEmail: a.user.email,
          userName: a.user.name
        }))
      }));
    
    if (action === 'fix') {
      // Remover duplicatas mantendo apenas a primeira
      for (const dup of duplicates) {
        const [keep, ...remove] = dup.accounts;
        
        for (const acc of remove) {
          await prisma.account.deleteMany({
            where: {
              userId: acc.userId,
              provider: 'google',
              providerAccountId: dup.providerAccountId
            }
          });
        }
      }
      
      return NextResponse.json({
        message: 'Duplicates removed',
        removed: duplicates.map(d => d.accounts.slice(1)).flat()
      });
    }
    
    // Verificar usuários específicos
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['slimc215@gmail.com', 'leonardo_guimaraes@hotmail.com']
        }
      },
      include: {
        accounts: {
          where: { provider: 'google' }
        }
      }
    });
    
    return NextResponse.json({
      duplicates,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        googleAccounts: u.accounts.map(a => ({
          providerAccountId: a.providerAccountId
        }))
      })),
      totalAccounts: accounts.length,
      suggestion: duplicates.length > 0 
        ? 'Found duplicate accounts. Add ?action=fix to remove them'
        : 'No duplicates found'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}