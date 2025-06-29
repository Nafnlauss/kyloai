// Script para adicionar créditos iniciais para usuários Google
// Execute com: npx tsx tests/fix-google-oauth-credits.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixGoogleUsersCredits() {
  console.log('🔧 Corrigindo créditos para usuários do Google...\n');

  try {
    // Buscar usuários que fizeram login com Google mas não têm créditos
    const googleUsers = await prisma.user.findMany({
      where: {
        credits: 0,
        accounts: {
          some: {
            provider: 'google'
          }
        }
      },
      include: {
        accounts: true
      }
    });

    console.log(`📊 Encontrados ${googleUsers.length} usuários Google sem créditos\n`);

    for (const user of googleUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: 300,
          creditsLastReset: new Date()
        }
      });
      console.log(`✅ Adicionados 300 créditos para: ${user.email}`);
    }

    console.log('\n✨ Correção concluída!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
fixGoogleUsersCredits();