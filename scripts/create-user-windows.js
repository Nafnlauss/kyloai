const bcrypt = require('bcryptjs');

// Gerar hash da senha
const password = 'Test123!@#';
const hash = bcrypt.hashSync(password, 10);

console.log('🔑 Credenciais para criar usuário:');
console.log('===============================');
console.log('Email: test@example.com');
console.log('Senha: Test123!@#');
console.log('Hash: ' + hash);
console.log('\n📋 SQL para executar no Supabase:');
console.log('=================================\n');
console.log(`-- Criar usuário de teste
INSERT INTO "User" (
  id, email, name, password, role, credits, 
  "emailVerified", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test User',
  '${hash}',
  'USER',
  300,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  credits = 300;

-- Criar usuário admin
INSERT INTO "User" (
  id, email, name, password, role, credits,
  "emailVerified", "createdAt", "updatedAt"  
) VALUES (
  gen_random_uuid(),
  'admin@example.com',
  'Admin User',
  '${hash}',
  'ADMIN',
  9999,
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  credits = 9999;

-- Verificar usuários criados
SELECT email, name, role, credits FROM "User" ORDER BY email;`);

console.log('\n\n✅ Instruções:');
console.log('==============');
console.log('1. Acesse: https://app.supabase.com/project/snfxczgjpnydysccigps/sql');
console.log('2. Cole o SQL acima no SQL Editor');
console.log('3. Execute o SQL');
console.log('4. Teste o login com as credenciais acima');