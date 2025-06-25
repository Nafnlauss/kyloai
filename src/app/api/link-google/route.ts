import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, providerAccountId } = await request.json();
    
    if (!email || !providerAccountId) {
      return NextResponse.json({
        error: 'Missing email or providerAccountId'
      }, { status: 400 });
    }
    
    // Encontrar o usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Remover vinculação anterior se existir
    await prisma.account.deleteMany({
      where: {
        provider: 'google',
        providerAccountId: providerAccountId
      }
    });
    
    // Criar nova vinculação
    const account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oidc',
        provider: 'google',
        providerAccountId: providerAccountId,
        access_token: 'temp',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'Bearer',
        scope: 'openid email profile',
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Google account ${providerAccountId} linked to ${email}`,
      account: {
        id: account.id,
        userId: account.userId
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}