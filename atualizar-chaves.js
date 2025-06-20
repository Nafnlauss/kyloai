const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Gerar chaves únicas
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
const sessionSecret = crypto.randomBytes(32).toString('base64');
const encryptionKey = crypto.randomBytes(32).toString('base64');

// Ler o arquivo .env atual
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Substituir as chaves
envContent = envContent.replace(
  /NEXTAUTH_SECRET=.*/,
  `NEXTAUTH_SECRET=${nextAuthSecret}`
);
envContent = envContent.replace(
  /SESSION_SECRET=.*/,
  `SESSION_SECRET=${sessionSecret}`
);
envContent = envContent.replace(
  /ENCRYPTION_KEY=.*/,
  `ENCRYPTION_KEY=${encryptionKey}`
);

// Salvar o arquivo
fs.writeFileSync(envPath, envContent);

console.log('✅ Chaves de segurança geradas e atualizadas no .env!');
console.log('\nChaves geradas:');
console.log('NEXTAUTH_SECRET:', nextAuthSecret);
console.log('SESSION_SECRET:', sessionSecret);
console.log('ENCRYPTION_KEY:', encryptionKey);
