// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanGoogleAccounts() {
  console.log('🧹 Limpeza e Organização de Contas Google\n');
  
  try {
    // 1. Listar todas as contas Google com seus usuários
    const googleAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total de contas Google: ${googleAccounts.length}\n`);
    
    // 2. Agrupar por email para identificar problemas
    const accountsByEmail = {};
    const problems = [];
    
    googleAccounts.forEach(account => {
      const userEmail = account.user?.email || 'NO_USER';
      const googleId = account.providerAccountId;
      
      if (!accountsByEmail[userEmail]) {
        accountsByEmail[userEmail] = [];
      }
      accountsByEmail[userEmail].push({
        accountId: account.id,
        googleId: googleId,
        userId: account.userId,
        createdAt: account.createdAt
      });
    });
    
    // 3. Identificar e corrigir problemas
    console.log('🔍 Analisando contas...\n');
    
    for (const [email, accounts] of Object.entries(accountsByEmail)) {
      if (email === 'NO_USER') {
        console.log('❌ Contas órfãs (sem usuário):');
        for (const acc of accounts) {
          console.log(`   - Google ID: ${acc.googleId}`);
          problems.push({ type: 'orphan', account: acc });
        }
      } else if (accounts.length > 1) {
        console.log(`⚠️  Múltiplas contas Google para ${email}:`);
        for (const acc of accounts) {
          console.log(`   - Google ID: ${acc.googleId} (criado: ${acc.createdAt})`);
        }
        problems.push({ type: 'duplicate', email, accounts });
      }
    }
    
    if (problems.length === 0) {
      console.log('✅ Todas as contas estão corretas!\n');
      return;
    }
    
    // 4. Perguntar se deve corrigir
    console.log(`\n🛠️  Encontrados ${problems.length} problemas.`);
    console.log('Para corrigir automaticamente, execute:');
    console.log('node tests/clean-google-accounts.js --fix\n');
    
    // Se --fix foi passado, corrigir
    if (process.argv.includes('--fix')) {
      console.log('🔧 Corrigindo problemas...\n');
      
      for (const problem of problems) {
        if (problem.type === 'orphan') {
          console.log(`Removendo conta órfã: ${problem.account.googleId}`);
          await prisma.account.delete({
            where: { id: problem.account.accountId }
          });
        } else if (problem.type === 'duplicate') {
          // Manter apenas a conta mais recente
          const sorted = problem.accounts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          const [keep, ...remove] = sorted;
          
          console.log(`Mantendo conta mais recente para ${problem.email}`);
          for (const acc of remove) {
            console.log(`  Removendo: ${acc.googleId}`);
            await prisma.account.delete({
              where: { id: acc.accountId }
            });
          }
        }
      }
      
      console.log('\n✅ Problemas corrigidos!');
    }
    
    // 5. Mostrar estado final
    console.log('\n📋 Estado atual das contas:');
    
    const finalAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true }
    });
    
    const userMap = {};
    finalAccounts.forEach(acc => {
      const email = acc.user?.email || 'NO_USER';
      if (!userMap[email]) {
        userMap[email] = {
          userId: acc.user?.id,
          accounts: []
        };
      }
      userMap[email].accounts.push(acc.providerAccountId);
    });
    
    for (const [email, data] of Object.entries(userMap)) {
      console.log(`\n👤 ${email}`);
      console.log(`   User ID: ${data.userId || 'N/A'}`);
      console.log(`   Google IDs: ${data.accounts.join(', ')}`);
    }
    
  } catch (error) {
    console.error('\n❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
cleanGoogleAccounts();