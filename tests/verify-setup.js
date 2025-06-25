const { PrismaClient } = require('@prisma/client');

async function verifySetup() {
  console.log('🔍 Verificando configuração do projeto...\n');

  const checks = {
    prisma: false,
    database: false,
    tables: false,
    users: false
  };

  try {
    // 1. Verificar Prisma
    console.log('1. Verificando Prisma Client...');
    const prisma = new PrismaClient();
    checks.prisma = true;
    console.log('✅ Prisma Client carregado!\n');

    // 2. Verificar conexão com banco
    console.log('2. Testando conexão com banco de dados...');
    await prisma.$connect();
    checks.database = true;
    console.log('✅ Conectado ao banco de dados!\n');

    // 3. Verificar tabelas
    console.log('3. Verificando tabelas...');
    try {
      const userCount = await prisma.user.count();
      checks.tables = true;
      console.log(`✅ Tabela User existe! (${userCount} usuários)\n`);

      // 4. Verificar usuários de teste
      if (userCount > 0) {
        console.log('4. Listando usuários cadastrados:');
        const users = await prisma.user.findMany({
          select: { email: true, name: true, role: true, credits: true }
        });
        
        users.forEach(user => {
          console.log(`   - ${user.email} (${user.role}) - ${user.credits} créditos`);
        });
        checks.users = users.length > 0;
      }
    } catch (error) {
      console.log('❌ Tabelas não encontradas. Execute o script SQL no Supabase.');
    }

    await prisma.$disconnect();

    // Resumo
    console.log('\n📊 RESUMO DA VERIFICAÇÃO:');
    console.log('========================');
    console.log(`Prisma Client: ${checks.prisma ? '✅' : '❌'}`);
    console.log(`Conexão BD: ${checks.database ? '✅' : '❌'}`);
    console.log(`Tabelas: ${checks.tables ? '✅' : '❌'}`);
    console.log(`Usuários: ${checks.users ? '✅' : '❌'}`);

    if (!checks.tables) {
      console.log('\n⚠️  AÇÃO NECESSÁRIA:');
      console.log('1. Acesse: https://app.supabase.com/project/snfxczgjpnydysccigps');
      console.log('2. Vá em SQL Editor');
      console.log('3. Execute o script: tests/fix-auth-final.sql');
    }

    console.log('\n💡 Para iniciar o servidor:');
    console.log('   pnpm dev');
    console.log('\n🔑 Credenciais de teste:');
    console.log('   Email: test@example.com');
    console.log('   Senha: Test123!@#');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verifySetup();