const { createClient } = require('@supabase/supabase-js');
const pg = require('pg');

// Configuração direta do PostgreSQL
const connectionString = process.env.DIRECT_URL || 'postgresql://postgres:m3b1%23D%5E7%26W9*ypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres';

async function checkDatabase() {
  console.log('🔍 Verificando estado do banco de dados...\n');

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!\n');

    // 1. Listar todas as tabelas
    console.log('📋 Tabelas existentes:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ Nenhuma tabela encontrada!');
      console.log('\n💡 Execute as migrações do Prisma:');
      console.log('   cd /mnt/f/site-ia/ai-video-hub');
      console.log('   pnpm prisma migrate dev --name init');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    // 2. Verificar se tabela User existe
    const userTableExists = tablesResult.rows.some(row => row.table_name === 'User');
    
    if (userTableExists) {
      console.log('\n✅ Tabela User existe!');
      
      // Contar usuários
      const userCount = await client.query('SELECT COUNT(*) FROM "User"');
      console.log(`   Total de usuários: ${userCount.rows[0].count}`);
      
      // Listar usuários
      const users = await client.query('SELECT id, email, name, role FROM "User" LIMIT 5');
      if (users.rows.length > 0) {
        console.log('\n👥 Usuários cadastrados:');
        users.rows.forEach(user => {
          console.log(`   - ${user.email} (${user.role})`);
        });
      }
    } else {
      console.log('\n❌ Tabela User não existe!');
    }

    // 3. Verificar configuração de autenticação
    console.log('\n🔐 Configuração de Autenticação:');
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅' : '❌'}`);
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || '❌ Não definido'}`);
    console.log(`   Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅' : '❌'}`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();