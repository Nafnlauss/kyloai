const crypto = require('crypto');

console.log('=== CHAVES DE SEGURANÇA PARA AI VIDEO HUB ===\n');

// Gerar NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET:');
console.log(nextAuthSecret);
console.log('\n');

// Gerar SESSION_SECRET
const sessionSecret = crypto.randomBytes(32).toString('base64');
console.log('SESSION_SECRET:');
console.log(sessionSecret);
console.log('\n');

// Gerar ENCRYPTION_KEY
const encryptionKey = crypto.randomBytes(32).toString('base64');
console.log('ENCRYPTION_KEY:');
console.log(encryptionKey);

console.log('\n=== Copie as chaves acima para seu arquivo .env ===');
