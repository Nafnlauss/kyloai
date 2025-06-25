// Configuração hardcoded temporária até resolver o problema do Railway
export const DATABASE_CONFIG = {
  url: 'postgresql://postgres.snfxczgjpnydysccigps:Lk6289asqwa@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true',
  direct: 'postgresql://postgres.snfxczgjpnydysccigps:Lk6289asqwa@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
};

// Override das variáveis de ambiente
process.env.DATABASE_URL = DATABASE_CONFIG.url;
process.env.DIRECT_URL = DATABASE_CONFIG.direct;

console.log('📦 Database config loaded from hardcoded values');
console.log('📏 URL length:', DATABASE_CONFIG.url.length);