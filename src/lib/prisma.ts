import { PrismaClient } from '@prisma/client'

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