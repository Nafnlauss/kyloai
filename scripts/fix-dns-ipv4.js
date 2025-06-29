const dns = require('dns');
const { Client } = require('pg');

// Forçar resolução DNS para IPv4
dns.setDefaultResultOrder('ipv4first');

async function testWithIPv4DNS() {
  console.log('🔧 Forçando resolução DNS para IPv4...\n');

  // Resolver IPs manualmente
  const hosts = [
    'db.snfxczgjpnydysccigps.supabase.co',
    'aws-0-sa-east-1.pooler.supabase.com'
  ];

  console.log('📍 Resolvendo endereços IP:');
  for (const host of hosts) {
    try {
      const addresses = await new Promise((resolve, reject) => {
        dns.resolve4(host, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });
      console.log(`   ${host} → ${addresses[0]}`);
    } catch (err) {
      console.log(`   ${host} → Erro: ${err.message}`);
    }
  }

  // Testar conexões com IPv4
  console.log('\n🔌 Testando conexões:');
  
  const configs = [
    {
      name: 'Conexão Direta (5432)',
      connectionString: 'postgresql://postgres:Lk6289asqwa@db.snfxczgjpnydysccigps.supabase.co:5432/postgres?sslmode=require'
    },
    {
      name: 'Pooler (6543)',
      connectionString: 'postgresql://postgres:Lk6289asqwa@db.snfxczgjpnydysccigps.supabase.co:6543/postgres?pgbouncer=true&sslmode=require'
    }
  ];

  for (const config of configs) {
    console.log(`\nTestando ${config.name}...`);
    const client = new Client({
      connectionString: config.connectionString,
      connectionTimeoutMillis: 10000
    });

    try {
      await client.connect();
      const result = await client.query('SELECT NOW()');
      console.log(`✅ Conectado! Hora: ${result.rows[0].now}`);
      
      // Testar se as tabelas existem
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('User', 'Account', 'Session')
        ORDER BY table_name
      `);
      
      if (tablesResult.rows.length > 0) {
        console.log('📋 Tabelas encontradas:');
        tablesResult.rows.forEach(row => {
          console.log(`   - ${row.table_name}`);
        });
      } else {
        console.log('⚠️  Nenhuma tabela de autenticação encontrada!');
      }
      
      await client.end();
      break; // Se conectou, não precisa testar outros
    } catch (err) {
      console.log(`❌ Erro: ${err.message}`);
    }
  }

  console.log('\n💡 DICA: Se o erro persistir, tente:');
  console.log('1. Desabilitar IPv6 temporariamente no Windows');
  console.log('2. Usar um VPN ou proxy');
  console.log('3. Resetar a senha no Supabase Dashboard');
}

testWithIPv4DNS();