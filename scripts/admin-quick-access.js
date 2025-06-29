#!/usr/bin/env node

/**
 * Script de Acesso Rápido ao Admin Dashboard
 * Uso: node scripts/admin-quick-access.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@123456'; // Senha padrão segura

async function setupAdminAccess() {
  console.log('\n🛡️  CONFIGURANDO ACESSO ADMIN...\n');

  try {
    // 1. Verificar se o usuário admin existe
    let adminUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (adminUser) {
      console.log('✅ Usuário admin já existe');
      
      // Atualizar para garantir que é admin
      if (adminUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email: ADMIN_EMAIL },
          data: { role: 'ADMIN' }
        });
        console.log('✅ Role atualizada para ADMIN');
      }

      // Atualizar senha se necessário
      if (!adminUser.passwordHash) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await prisma.user.update({
          where: { email: ADMIN_EMAIL },
          data: { passwordHash: hashedPassword }
        });
        console.log('✅ Senha configurada');
      }
    } else {
      // Criar novo usuário admin
      console.log('📝 Criando novo usuário admin...');
      
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      adminUser = await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          name: 'Admin User',
          passwordHash: hashedPassword,
          role: 'ADMIN',
          credits: 9999,
          emailVerified: new Date(),
          isActive: true
        }
      });
      
      console.log('✅ Usuário admin criado com sucesso!');
    }

    // 2. Mostrar informações de acesso
    console.log('\n' + '='.repeat(50));
    console.log('🎯 ACESSO AO DASHBOARD ADMINISTRATIVO');
    console.log('='.repeat(50));
    console.log('\n📍 URLs de Acesso:');
    console.log('   Local: http://localhost:3000/admin/overview');
    console.log('   Produção: https://kylo.video/admin/overview');
    
    console.log('\n🔑 Credenciais:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Senha: ${ADMIN_PASSWORD}`);
    
    console.log('\n📊 Funcionalidades Disponíveis:');
    console.log('   ✓ Dashboard com métricas e KPIs');
    console.log('   ✓ Gestão completa de usuários');
    console.log('   ✓ Histórico de transações');
    console.log('   ✓ Monitoramento de APIs');
    console.log('   ✓ Sistema de alertas');
    console.log('   ✓ Logs de auditoria');
    
    console.log('\n⚠️  Notas Importantes:');
    console.log('   - Modo Demo está ATIVO (read-only)');
    console.log('   - Para modo produção, remova NEXT_PUBLIC_DEMO_MODE');
    console.log('   - Todas as ações são registradas no audit log');
    
    console.log('\n🚀 Para iniciar o servidor:');
    console.log('   cd ai-video-hub && pnpm dev');
    console.log('\n' + '='.repeat(50) + '\n');

    // 3. Verificar outras configurações
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' }});
    
    console.log('📈 Estatísticas do Sistema:');
    console.log(`   - Total de usuários: ${totalUsers}`);
    console.log(`   - Total de admins: ${totalAdmins}`);
    
    // 4. Listar todos os admins
    if (totalAdmins > 0) {
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true, name: true, credits: true }
      });
      
      console.log('\n👥 Admins no sistema:');
      admins.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.name || 'Sem nome'}) - ${admin.credits} créditos`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
setupAdminAccess();