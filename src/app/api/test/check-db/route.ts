import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Tentar buscar um usuário para ver a estrutura
    const users = await prisma.user.findMany({
      take: 1
    })
    
    // Verificar se consegue conectar
    const result = await prisma.$queryRaw`SELECT 1+1 as result`
    
    return NextResponse.json({
      connected: true,
      result,
      userCount: users.length,
      sampleUser: users[0] || 'Nenhum usuário encontrado',
      message: 'Conexão com banco de dados OK!'
    })
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
      code: error.code,
      meta: error.meta
    }, { status: 500 })
  }
}