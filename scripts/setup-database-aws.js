const { Client } = require('pg');

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados via AWS Pooler...\n');

  // Usar o pooler AWS que conseguiu resolver para IPv4
  const connectionString = 'postgresql://postgres.snfxczgjpnydysccigps:Lk6289asqwa@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require';

  // Ignorar SSL temporariamente
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 30000,
    ssl: true
  });

  try {
    console.log('Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conectado ao banco via AWS Pooler!\n');

    // Verificar tabelas existentes
    console.log('Verificando tabelas existentes...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Account', 'Session', 'Subscription', 'Video')
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('📋 Tabelas encontradas:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  Nenhuma tabela encontrada. Criando estrutura...\n');
      
      // Executar criação das tabelas principais
      console.log('Criando tabela User...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "email" TEXT NOT NULL UNIQUE,
          "name" TEXT,
          "password" TEXT,
          "role" TEXT DEFAULT 'USER',
          "credits" INTEGER DEFAULT 10,
          "emailVerified" TIMESTAMP(3),
          "image" TEXT,
          "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabela User criada!');

      console.log('Criando tabela Account...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Account" (
          "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "userId" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "provider" TEXT NOT NULL,
          "providerAccountId" TEXT NOT NULL,
          "refresh_token" TEXT,
          "access_token" TEXT,
          "expires_at" INTEGER,
          "token_type" TEXT,
          "scope" TEXT,
          "id_token" TEXT,
          "session_state" TEXT,
          CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
          UNIQUE("provider", "providerAccountId")
        )
      `);
      console.log('✅ Tabela Account criada!');

      console.log('Criando tabela Session...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Session" (
          "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "sessionToken" TEXT NOT NULL UNIQUE,
          "userId" TEXT NOT NULL,
          "expires" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
        )
      `);
      console.log('✅ Tabela Session criada!');
    }

    // Verificar usuários
    console.log('\nVerificando usuários...');
    const usersResult = await client.query('SELECT email, role, credits FROM "User" ORDER BY email');
    
    if (usersResult.rows.length > 0) {
      console.log('👥 Usuários encontrados:');
      usersResult.rows.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - ${user.credits} créditos`);
      });
    } else {
      console.log('Criando usuário de teste...');
      
      // Criar usuário de teste com senha hash
      await client.query(`
        INSERT INTO "User" (email, name, password, role, credits)
        VALUES (
          'test@example.com',
          'Usuário Teste',
          '$2b$10$YKwH7Ls3vKpDRkJxPNkFi.qouBLcI6xJqKhfz1PqunPhXxXVCNMZu',
          'USER',
          50
        )
        ON CONFLICT (email) DO NOTHING
      `);
      console.log('✅ Usuário de teste criado!');
      console.log('   Email: test@example.com');
      console.log('   Senha: Test123!@#');
    }

    await client.end();
    console.log('\n✅ Configuração concluída com sucesso!');
    
    // Atualizar o .env com a connection string que funciona
    console.log('\n📝 Atualize seu .env com estas configurações:');
    console.log('DATABASE_URL="postgresql://postgres.snfxczgjpnydysccigps:m3b1%23D%5E7%26W9*ypgzGhCv@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"');
    console.log('DIRECT_URL="postgresql://postgres.snfxczgjpnydysccigps:m3b1%23D%5E7%26W9*ypgzGhCv@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require"');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.message.includes('SCRAM')) {
      console.log('\nℹ️  Erro de autenticação SCRAM. Possíveis soluções:');
      console.log('1. Resete a senha no Supabase Dashboard');
      console.log('2. Use uma senha mais simples como: Kylo2024!');
      console.log('3. Verifique se o projeto está ativo');
    }
  }
}

setupDatabase();