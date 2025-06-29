// Script para verificar se as configurações OAuth estão corretas

console.log('🔍 Verificando configurações OAuth...\n');

// Expected format (not actual values for security)
const expectedFormat = {
  GOOGLE_CLIENT_ID: 'Should end with .apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: 'Should start with GOCSPX-'
};

console.log('✅ Formato esperado:');
console.log('GOOGLE_CLIENT_ID:', expectedFormat.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', expectedFormat.GOOGLE_CLIENT_SECRET);

console.log('\n📋 Configurações atuais do ambiente:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || 'NÃO DEFINIDO');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET || 'NÃO DEFINIDO');

console.log('\n🔗 URLs de callback autorizadas no Google Console:');
console.log('- https://kylo.video/api/auth/callback/google');
console.log('- http://localhost:3000/api/auth/callback/google');
console.log('- http://localhost:3001/api/auth/callback/google');

console.log('\n⚙️  Outras configurações importantes:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NÃO DEFINIDO');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NÃO DEFINIDO');

// Verificar se as configurações têm o formato correto
const clientId = process.env.GOOGLE_CLIENT_ID || '';
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

const hasCorrectFormat = 
  clientId.endsWith('.apps.googleusercontent.com') &&
  clientSecret.startsWith('GOCSPX-');

if (hasCorrectFormat) {
  console.log('\n✅ Configurações OAuth têm formato CORRETO!');
} else {
  console.log('\n❌ Configurações OAuth têm formato INCORRETO!');
  console.log('\n📝 Verifique:');
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    console.log('- GOOGLE_CLIENT_ID deve terminar com .apps.googleusercontent.com');
  }
  if (!clientSecret.startsWith('GOCSPX-')) {
    console.log('- GOOGLE_CLIENT_SECRET deve começar com GOCSPX-');
  }
}