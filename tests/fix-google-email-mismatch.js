// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixEmailMismatch() {
  console.log('🔧 Corrigindo discrepância de emails do Google OAuth...\n');
  
  try {
    // 1. Buscar a conta Google específica
    const googleAccountId = '112331654460903776771';
    const googleEmail = 'leonardovyguimaraes@gmail.com';
    const currentEmail = 'leonardo_guimaraes@hotmail.com';
    
    console.log('📋 Situação atual:');
    console.log(`Google Account ID: ${googleAccountId}`);
    console.log(`Email do Google: ${googleEmail}`);
    console.log(`Email vinculado: ${currentEmail}`);
    console.log('');
    
    // 2. Buscar a conta Google
    const account = await prisma.account.findFirst({
      where: {
        provider: 'google',
        providerAccountId: googleAccountId
      },
      include: { user: true }
    });
    
    if (!account) {
      console.log('❌ Conta Google não encontrada');
      return;
    }
    
    console.log('✅ Conta encontrada:');
    console.log(`- Vinculada ao usuário: ${account.user?.email}`);
    console.log(`- User ID: ${account.userId}`);
    console.log('');
    
    // 3. Verificar se já existe um usuário com o email do Google
    const googleUser = await prisma.user.findUnique({
      where: { email: googleEmail }
    });
    
    if (googleUser) {
      console.log('📌 Já existe um usuário com o email do Google:');
      console.log(`- ID: ${googleUser.id}`);
      console.log(`- Nome: ${googleUser.name}`);
      
      // Atualizar a conta para vincular ao usuário correto
      console.log('\n🔄 Atualizando vinculação...');
      await prisma.account.update({
        where: { id: account.id },
        data: { userId: googleUser.id }
      });
      
      console.log('✅ Conta Google agora está vinculada a:', googleEmail);
    } else {
      console.log('❌ Não existe usuário com o email:', googleEmail);
      console.log('\n🤔 Opções:');
      console.log('1. Criar novo usuário com o email do Google');
      console.log('2. Atualizar o email do usuário existente');
      
      // Perguntar o que fazer
      console.log('\n💡 Recomendação: Atualizar o email do usuário existente');
      console.log('Execute: node tests/fix-google-email-mismatch.js --update-email');
    }
    
    // 4. Verificar outras contas com problemas similares
    console.log('\n🔍 Procurando outros casos similares...');
    
    const allGoogleAccounts = await prisma.account.findMany({
      where: { provider: 'google' },
      include: { user: true }
    });
    
    const mismatches = [];
    for (const acc of allGoogleAccounts) {
      // Aqui você poderia verificar se o email do usuário corresponde ao esperado
      // Por enquanto, vamos apenas listar
      if (acc.user) {
        console.log(`- ${acc.providerAccountId} → ${acc.user.email}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Verificar argumentos
const args = process.argv.slice(2);
const shouldUpdateEmail = args.includes('--update-email');

if (shouldUpdateEmail) {
  console.log('🚀 Modo de atualização de email ativado\n');
  
  async function updateUserEmail() {
    try {
      const userId = 'cmc83vzlt0007syis8l0vngjl';
      const newEmail = 'leonardovyguimaraes@gmail.com';
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { email: newEmail }
      });
      
      console.log('✅ Email atualizado com sucesso!');
      console.log(`Usuário ${user.id} agora tem o email: ${user.email}`);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar email:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  updateUserEmail();
} else {
  fixEmailMismatch();
}