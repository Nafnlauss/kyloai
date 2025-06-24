const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Deletar usuário se existir
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' }
    });
    
    // Criar novo usuário
    const hashedPassword = await bcrypt.hash('Test1234!', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: hashedPassword,
        emailVerified: new Date(),
        credits: 300,
        creditsLastReset: new Date(),
        role: 'USER',
        isActive: true
      }
    });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Senha: Test1234!');
    console.log('🆔 ID:', user.id);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();