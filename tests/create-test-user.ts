import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  const email = 'test@example.com'
  const password = 'Test1234!' // Senha que atende aos requisitos
  
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('Usuário de teste já existe!')
      return
    }
    
    // Criar hash da senha
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Test User',
        passwordHash,
        emailVerified: new Date(),
        credits: 1000, // Dar mais créditos para testes
      }
    })
    
    console.log('Usuário de teste criado com sucesso!')
    console.log('Email:', email)
    console.log('Senha:', password)
    console.log('ID:', user.id)
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()