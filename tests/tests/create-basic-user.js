const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Configurar Supabase
const supabaseUrl = 'https://snfxczgjpnydysccigps.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NjY2OSwiZXhwIjoyMDY1OTUyNjY5fQ.LTFYGslmETIOeaIzfR4NV9cWQyXfkvesLNEeJEdvsHw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  try {
    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash('Test1234!', 10);
    
    // Deletar usuário se existir
    await supabase
      .from('User')
      .delete()
      .eq('email', 'test@example.com');
    
    // Criar novo usuário
    const { data, error } = await supabase
      .from('User')
      .insert({
        id: crypto.randomUUID(),
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: hashedPassword,
        emailVerified: new Date().toISOString(),
        credits: 300,
        creditsLastReset: new Date().toISOString(),
        role: 'USER',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        failedLoginAttempts: 0,
        twoFactorEnabled: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message);
      console.error('Detalhes:', error);
    } else {
      console.log('✅ Usuário criado com sucesso!');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Senha: Test1234!');
      console.log('🆔 ID:', data.id);
    }
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createUser();