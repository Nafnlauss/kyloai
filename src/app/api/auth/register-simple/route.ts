import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()
    
    // Validação básica
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está registrado' },
        { status: 409 }
      )
    }
    
    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12)
    
    // Cria usuário com campos mínimos
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        credits: 300,
        emailVerified: new Date(), // Marca como verificado para testes
      },
    })
    
    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Faça login.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
    
  } catch (error) {
    console.error('Erro no registro:', error)
    
    // Log do erro específico do Prisma
    if (error instanceof Error) {
      console.error('Mensagem:', error.message)
      if ('code' in error) {
        console.error('Código Prisma:', error.code)
      }
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar conta. Verifique o console.' },
      { status: 500 }
    )
  }
}