const bcrypt = require('bcryptjs');

async function generatePasswordHashes() {
  console.log('🔐 Gerando hashes de senha...\n');

  const passwords = [
    { email: 'test@example.com', password: 'Test123!@#' },
    { email: 'admin@example.com', password: 'Admin123!@#' },
    { email: 'custom', password: 'SuaSenhaAqui123!' } // Adicione sua senha customizada aqui
  ];

  for (const user of passwords) {
    const hash = await bcrypt.hash(user.password, 12);
    console.log(`${user.email}:`);
    console.log(`Senha: ${user.password}`);
    console.log(`Hash: ${hash}`);
    console.log('---');
  }

  // Verificar se os hashes funcionam
  console.log('\n✅ Verificando hashes...');
  for (const user of passwords) {
    const hash = await bcrypt.hash(user.password, 12);
    const isValid = await bcrypt.compare(user.password, hash);
    console.log(`${user.email}: ${isValid ? '✅ OK' : '❌ ERRO'}`);
  }
}

generatePasswordHashes();