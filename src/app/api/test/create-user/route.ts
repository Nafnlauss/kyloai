import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Deletar usuário se existir
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    })
    
    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('Test1234!', 10)
    
    // Criar novo usuário com apenas campos essenciais
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
        credits: 300,
        creditsLastReset: new Date(),
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Usuário de teste criado!',
      credentials: {
        email: 'test@example.com',
        password: 'Test1234!'
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits
      }
    })
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 })
  }
}