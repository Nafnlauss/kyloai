const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixOAuthAccounts() {
  console.log('🔧 Starting OAuth accounts cleanup...\n');
  
  try {
    // 1. Remover contas Google órfãs (sem userId)
    const orphanResult = await prisma.account.deleteMany({
      where: {
        provider: 'google',
        userId: null
      }
    });
    console.log(`✅ Removed ${orphanResult.count} orphan Google accounts\n`);
    
    // 2. Listar todas as contas Google
    const googleAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total Google accounts: ${googleAccounts.length}`);
    
    // 3. Encontrar e remover duplicatas (mesmo providerAccountId)
    const accountsByProviderId = {};
    googleAccounts.forEach(account => {
      const key = account.providerAccountId;
      if (!accountsByProviderId[key]) {
        accountsByProviderId[key] = [];
      }
      accountsByProviderId[key].push(account);
    });
    
    let duplicatesRemoved = 0;
    for (const [providerId, accounts] of Object.entries(accountsByProviderId)) {
      if (accounts.length > 1) {
        console.log(`\n⚠️  Found ${accounts.length} accounts for Google ID: ${providerId}`);
        
        // Ordenar por data de criação (manter a mais recente)
        accounts.sort((a, b) => b.createdAt - a.createdAt);
        const [keep, ...toRemove] = accounts;
        
        console.log(`   Keeping: ${keep.user?.email || 'NO USER'} (created: ${keep.createdAt})`);
        
        for (const account of toRemove) {
          console.log(`   Removing: ${account.user?.email || 'NO USER'} (created: ${account.createdAt})`);
          await prisma.account.delete({
            where: { id: account.id }
          });
          duplicatesRemoved++;
        }
      }
    }
    
    console.log(`\n✅ Removed ${duplicatesRemoved} duplicate accounts`);
    
    // 4. Listar usuários e suas contas Google
    const users = await prisma.user.findMany({
      include: {
        accounts: {
          where: { provider: 'google' }
        }
      },
      orderBy: { email: 'asc' }
    });
    
    console.log('\n📋 Users and their Google accounts:');
    console.log('────────────────────────────────────');
    
    users.forEach(user => {
      console.log(`\n👤 ${user.email} (ID: ${user.id})`);
      if (user.accounts.length === 0) {
        console.log('   ❌ No Google account linked');
      } else {
        user.accounts.forEach(account => {
          console.log(`   ✅ Google ID: ${account.providerAccountId}`);
        });
      }
    });
    
    // 5. Estatísticas finais
    const finalGoogleAccounts = await prisma.account.count({
      where: { provider: 'google' }
    });
    
    const usersWithGoogle = await prisma.user.count({
      where: {
        accounts: {
          some: { provider: 'google' }
        }
      }
    });
    
    console.log('\n📊 Final Statistics:');
    console.log('────────────────────');
    console.log(`Total users: ${users.length}`);
    console.log(`Total Google accounts: ${finalGoogleAccounts}`);
    console.log(`Users with Google login: ${usersWithGoogle}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
fixOAuthAccounts();