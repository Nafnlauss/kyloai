// Script para verificar usuários no banco de dados
// Execute com: npx tsx tests/verificar-usuarios.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarUsuarios() {
  console.log('🔍 Verificando usuários no banco de dados...\n');

  try {
    // Contar total de usuários
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total de usuários: ${totalUsers}\n`);

    // Listar últimos 5 usuários cadastrados
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        createdAt: true,
        emailVerified: true,
        _count: {
          select: {
            accounts: true,
            videos: true
          }
        }
      }
    });

    console.log('👥 Últimos 5 usuários cadastrados:');
    console.log('================================\n');

    recentUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Nome: ${user.name || 'Não informado'}`);
      console.log(`   Créditos: ${user.credits}`);
      console.log(`   Cadastrado em: ${user.createdAt.toLocaleString('pt-BR')}`);
      console.log(`   Email verificado: ${user.emailVerified ? 'Sim' : 'Não'}`);
      console.log(`   Contas vinculadas: ${user._count.accounts}`);
      console.log(`   Vídeos criados: ${user._count.videos}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });

    // Verificar usuários com Google OAuth
    const googleUsers = await prisma.user.findMany({
      where: {
        accounts: {
          some: {
            provider: 'google'
          }
        }
      },
      select: {
        email: true,
        name: true,
        credits: true
      }
    });

    console.log(`\n🔵 Usuários que fizeram login com Google: ${googleUsers.length}`);
    if (googleUsers.length > 0) {
      console.log('====================================');
      googleUsers.forEach(user => {
        console.log(`- ${user.email} (${user.credits} créditos)`);
      });
    }

    // Verificar últimos logs de registro
    const recentRegistrations = await prisma.auditLog.findMany({
      where: { action: 'USER_REGISTERED' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true }
        }
      }
    });

    console.log('\n📝 Últimos registros (AuditLog):');
    console.log('===============================');
    recentRegistrations.forEach(log => {
      console.log(`- ${log.user.email} em ${log.createdAt.toLocaleString('pt-BR')}`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
verificarUsuarios();