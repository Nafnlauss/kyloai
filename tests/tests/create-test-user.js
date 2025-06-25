require('dotenv').config({ path: '../.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  console.log('🔧 Criando usuário de teste...\n');

  const testEmail = 'test@example.com';
  const testPassword = 'Test123!@#';
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123!@#';

  try {
    // 1. Verificar se as tabelas existem
    console.log('1. Verificando estrutura do banco...');
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Tabela User existe! Usuários cadastrados: ${userCount}`);
    } catch (error) {
      console.log('❌ Tabela User não existe!');
      console.log('\n💡 Execute primeiro:');
      console.log('   cd /mnt/f/site-ia/ai-video-hub');
      console.log('   pnpm prisma migrate deploy');
      return;
    }

    // 2. Criar usuário de teste
    console.log('\n2. Criando usuário de teste...');
    const testUserExists = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    if (!testUserExists) {
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      const testUser = await prisma.user.create({
        data: {
          email: testEmail,
          name: 'Test User',
          passwordHash: hashedPassword,
          emailVerified: new Date(),
          credits: 300,
          role: 'USER'
        }
      });
      console.log(`✅ Usuário de teste criado: ${testUser.email}`);
    } else {
      console.log(`✅ Usuário de teste já existe: ${testEmail}`);
    }

    // 3. Criar usuário admin
    console.log('\n3. Criando usuário admin...');
    const adminUserExists = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!adminUserExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Admin User',
          passwordHash: hashedPassword,
          emailVerified: new Date(),
          credits: 9999,
          role: 'ADMIN'
        }
      });
      console.log(`✅ Usuário admin criado: ${adminUser.email}`);
    } else {
      console.log(`✅ Usuário admin já existe: ${adminEmail}`);
    }

    // 4. Listar todos os usuários
    console.log('\n4. Usuários cadastrados:');
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        credits: true,
        createdAt: true
      }
    });

    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ${user.credits} créditos`);
    });

    // 5. Instruções de login
    console.log('\n🔑 CREDENCIAIS DE TESTE:');
    console.log('========================');
    console.log('Usuário normal:');
    console.log(`  Email: ${testEmail}`);
    console.log(`  Senha: ${testPassword}`);
    console.log('\nUsuário admin:');
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Senha: ${adminPassword}`);
    console.log('\n💡 Para testar o login:');
    console.log('1. Inicie o servidor: pnpm dev');
    console.log('2. Acesse: http://localhost:3000/login');
    console.log('3. Use uma das credenciais acima');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (error.code === 'P2002') {
      console.log('\n⚠️  Usuário já existe com esse email.');
    } else if (error.code === 'P2003') {
      console.log('\n⚠️  Erro de chave estrangeira. Verifique as dependências.');
    } else if (error.code === 'P2021') {
      console.log('\n⚠️  Tabela não existe no banco de dados.');
      console.log('Execute: pnpm prisma migrate deploy');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
createTestUser();