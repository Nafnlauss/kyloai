import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Teste 1: Conexão básica
    const dbTime = await prisma.$queryRaw`SELECT NOW() as current_time`
    
    // Teste 2: Contar usuários
    const userCount = await prisma.user.count()
    
    // Teste 3: Contar contas Google
    const googleAccountCount = await prisma.account.count({
      where: { provider: 'google' }
    })
    
    // Teste 4: Verificar estrutura da tabela Account
    const sampleAccount = await prisma.account.findFirst({
      where: { provider: 'google' },
      select: {
        id: true,
        userId: true,
        provider: true,
        providerAccountId: true,
        createdAt: true
      }
    })
    
    // Teste 5: Verificar DATABASE_URL
    const dbUrl = process.env.DATABASE_URL
    const urlParts = dbUrl ? new URL(dbUrl.replace('postgresql://', 'http://')) : null
    
    return NextResponse.json({
      connected: true,
      message: 'Banco de dados conectado com sucesso',
      stats: {
        userCount,
        googleAccountCount,
        dbTime
      },
      sampleAccount: sampleAccount || 'Nenhuma conta Google encontrada',
      databaseInfo: {
        host: urlParts?.hostname,
        port: urlParts?.port,
        database: urlParts?.pathname?.substring(1),
        hasPooler: dbUrl?.includes('pgbouncer=true')
      }
    })
  } catch (error: any) {
    console.error('Database check error:', error)
    
    return NextResponse.json({
      connected: false,
      message: 'Erro ao conectar com banco de dados',
      error: error.message,
      errorCode: error.code,
      suggestion: getDatabaseErrorSuggestion(error)
    }, { status: 500 })
  }
}

function getDatabaseErrorSuggestion(error: any): string {
  if (error.code === 'P1001') {
    return 'Não foi possível conectar ao banco. Verifique se o DATABASE_URL está correto.'
  }
  if (error.code === 'P1002') {
    return 'Timeout ao conectar. O servidor do banco pode estar inacessível.'
  }
  if (error.code === 'P1003') {
    return 'Banco de dados não encontrado. Verifique se o banco existe.'
  }
  if (error.message?.includes('invalid')) {
    return 'URL do banco inválida. Verifique espaços ou caracteres especiais.'
  }
  return 'Verifique as configurações do banco de dados.'
}