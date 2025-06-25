import { PrismaClient } from '@prisma/client'

// Clean DATABASE_URL to remove any invalid characters
function cleanDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  
  // Remove any newlines, carriage returns, tabs, and trim spaces
  return url
    .replace(/[\r\n\t]/g, '')
    .trim();
}

// Apply the fix before creating PrismaClient
if (process.env.DATABASE_URL) {
  const cleaned = cleanDatabaseUrl(process.env.DATABASE_URL);
  if (cleaned !== process.env.DATABASE_URL) {
    console.log('🔧 DATABASE_URL cleaned - removed invalid characters');
    process.env.DATABASE_URL = cleaned;
  }
}

if (process.env.DIRECT_URL) {
  process.env.DIRECT_URL = cleanDatabaseUrl(process.env.DIRECT_URL);
}

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Removido 'query' para evitar vazamento de dados sensíveis nos logs
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma