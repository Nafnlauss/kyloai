import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerAccountId = searchParams.get('id') || '116263823895872739325';
  
  try {
    // Buscar a conta específica
    const account = await prisma.account.findFirst({
      where: {
        provider: 'google',
        providerAccountId: providerAccountId
      },
      include: {
        user: true
      }
    });
    
    // Buscar todos os usuários com emails relacionados
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['slimc215@gmail.com', 'leonardo_guimaraes@hotmail.com']
        }
      }
    });
    
    return NextResponse.json({
      googleAccountId: providerAccountId,
      linkedTo: account ? {
        userId: account.userId,
        userEmail: account.user.email,
        userName: account.user.name
      } : null,
      allUsers: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name
      })),
      problem: account && account.user.email !== 'slimc215@gmail.com' 
        ? `This Google account is linked to ${account.user.email} but you're trying to login as slimc215@gmail.com`
        : 'No conflict detected'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}