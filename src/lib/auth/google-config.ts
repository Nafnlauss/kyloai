// Google OAuth configuration with fallback values
// Este arquivo garante que as configurações do Google OAuth estejam sempre disponíveis

export const GOOGLE_CONFIG = {
  // OAuth credentials must be set in environment variables
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  // URLs de redirect válidas configuradas no Google Console
  validRedirectUris: [
    'https://kylo.video/api/auth/callback/google',
    'http://localhost:3000/api/auth/callback/google',
    'http://localhost:3001/api/auth/callback/google'
  ]
};

// Função para verificar se as configurações estão disponíveis
export function checkGoogleConfig() {
  const hasClientId = !!GOOGLE_CONFIG.clientId;
  const hasClientSecret = !!GOOGLE_CONFIG.clientSecret;
  
  if (!hasClientId || !hasClientSecret) {
    console.error('⚠️ Google OAuth configuration missing!');
    console.error('Client ID:', hasClientId ? '✓' : '✗');
    console.error('Client Secret:', hasClientSecret ? '✓' : '✗');
  } else {
    console.log('✅ Google OAuth configuration loaded');
  }
  
  return hasClientId && hasClientSecret;
}

// Verificar na inicialização
checkGoogleConfig();