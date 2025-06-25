import { NextResponse } from 'next/server'

export async function GET() {
  // Lista TODAS as variáveis de ambiente
  const allEnvVars = Object.keys(process.env).sort();
  
  // Filtra variáveis sensíveis mas mostra se existem
  const filteredVars = allEnvVars.map(key => {
    const value = process.env[key] || '';
    
    // Mostra apenas parte do valor para variáveis sensíveis
    if (key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')) {
      return {
        key,
        exists: !!value,
        length: value.length,
        preview: value.substring(0, 5) + '...'
      };
    }
    
    // Para NEXTAUTH_URL e GOOGLE vars, mostra completo
    if (key.includes('NEXTAUTH_URL') || key.includes('GOOGLE')) {
      return {
        key,
        value: value || 'NOT SET',
        exists: !!value,
        length: value.length
      };
    }
    
    // Outras vars importantes
    if (key.includes('RAILWAY') || key.includes('NODE_ENV') || key.includes('PORT')) {
      return {
        key,
        value: value,
        exists: !!value
      };
    }
    
    // Resto apenas indica se existe
    return {
      key,
      exists: !!value
    };
  });
  
  // Procura especificamente por variações do NEXTAUTH_URL
  const urlVariations = [
    'NEXTAUTH_URL',
    'NEXT_AUTH_URL', 
    'NEXTAUTHURL',
    'AUTH_URL',
    'APP_URL',
    'PUBLIC_URL',
    'SITE_URL',
    'URL'
  ];
  
  const urlSearch = urlVariations.map(v => ({
    name: v,
    value: process.env[v] || 'not found',
    exists: !!process.env[v]
  }));
  
  return NextResponse.json({
    railway: {
      environment: process.env.RAILWAY_ENVIRONMENT || 'not set',
      projectId: process.env.RAILWAY_PROJECT_ID || 'not set',
      service: process.env.RAILWAY_SERVICE || 'not set',
      deployment: process.env.RAILWAY_DEPLOYMENT_ID || 'not set'
    },
    totalVars: allEnvVars.length,
    urlSearch,
    allVars: filteredVars,
    debug: {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      execPath: process.execPath
    }
  });
}