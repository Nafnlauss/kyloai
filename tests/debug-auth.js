// Script para debugar problemas de autenticação
const https = require('https');

console.log('=== Debug de Autenticação ===\n');

// Verificar variáveis de ambiente
console.log('1. Verificando variáveis de ambiente:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NÃO DEFINIDO');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Definido' : '✗ NÃO DEFINIDO');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Definido' : '✗ NÃO DEFINIDO');

// Verificar se o servidor está rodando
console.log('\n2. Verificando servidor local:');
const http = require('http');

http.get('http://localhost:3000', (res) => {
  console.log('Servidor local:', res.statusCode === 200 ? '✓ Rodando' : `✗ Status ${res.statusCode}`);
}).on('error', (err) => {
  console.log('Servidor local: ✗ Não está rodando');
  console.log('Execute: npm run dev');
});

// Instruções para corrigir o erro do Google
console.log('\n3. Para corrigir o erro "invalid_client" do Google:');
console.log('   a) Acesse: https://console.cloud.google.com/');
console.log('   b) Vá em APIs & Services > Credentials');
console.log('   c) Adicione estas origens JavaScript:');
console.log('      - http://localhost:3000');
console.log('      - http://localhost:3001');
console.log('      - https://kylo.video');
console.log('   d) Adicione estes URIs de redirecionamento:');
console.log('      - http://localhost:3000/api/auth/callback/google');
console.log('      - https://kylo.video/api/auth/callback/google');
console.log('   e) Salve e aguarde 5 minutos');

console.log('\n4. Arquivo de configuração local:');
console.log('   Crie um arquivo .env.local com:');
console.log('   NEXTAUTH_URL=http://localhost:3000');