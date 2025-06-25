import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers();
  
  // Converte headers para objeto
  const headersObj: Record<string, string> = {};
  headersList.forEach((value, key) => {
    headersObj[key] = value;
  });
  
  return NextResponse.json({
    hosting: {
      // Verifica plataformas comuns
      vercel: !!process.env.VERCEL,
      railway: !!process.env.RAILWAY_ENVIRONMENT,
      render: !!process.env.RENDER,
      heroku: !!process.env.DYNO,
      netlify: !!process.env.NETLIFY,
      aws: !!process.env.AWS_REGION,
      googleCloud: !!process.env.K_SERVICE,
      azure: !!process.env.WEBSITE_INSTANCE_ID,
      digitalOcean: !!process.env.DO_APP_ID,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT || '3000',
      host: process.env.HOST || 'unknown',
      pwd: process.env.PWD,
    },
    headers: {
      host: headersObj.host || 'unknown',
      xForwardedHost: headersObj['x-forwarded-host'] || 'none',
      xForwardedFor: headersObj['x-forwarded-for'] || 'none',
      xRealIp: headersObj['x-real-ip'] || 'none',
      userAgent: headersObj['user-agent'] || 'none',
      // Procura por headers específicos de plataformas
      cfRay: headersObj['cf-ray'] || 'none', // Cloudflare
      flyRequestId: headersObj['fly-request-id'] || 'none', // Fly.io
    },
    envCount: Object.keys(process.env).length,
    // Lista variáveis que contém URL, HOST, ou DOMAIN
    urlRelatedVars: Object.keys(process.env)
      .filter(key => 
        key.includes('URL') || 
        key.includes('HOST') || 
        key.includes('DOMAIN') ||
        key.includes('SITE') ||
        key.includes('APP')
      )
      .map(key => ({
        key,
        value: key.includes('SECRET') || key.includes('KEY') 
          ? '***' 
          : process.env[key]
      }))
  });
}