// Script para gerar Prisma com DATABASE_URL temporária
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/db';

const { execSync } = require('child_process');

try {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma Client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma Client:', error);
  process.exit(1);
}
