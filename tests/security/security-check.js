#!/usr/bin/env node

/**
 * 🛡️ SCRIPT DE VALIDAÇÃO DE SEGURANÇA - KYLO.VIDEO
 * 
 * Este script verifica se todas as configurações de segurança
 * estão aplicadas corretamente antes do deploy.
 */

const fs = require('fs')
const path = require('path')

console.log('🛡️  INICIANDO VERIFICAÇÃO DE SEGURANÇA...\n')

let errors = []
let warnings = []
let passed = 0

// Navegar para o diretório raiz do projeto
const projectRoot = path.join(__dirname, '../../')
process.chdir(projectRoot)

// 1. Verificar next.config.js
console.log('📋 Verificando next.config.js...')
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8')
  
  // Verificar se não permite todos os hostnames
  if (nextConfig.includes('hostname: \'**\'')) {
    errors.push('❌ next.config.js ainda permite todos os hostnames (hostname: "**")')
  } else {
    passed++
    console.log('✅ Configuração de imagens segura')
  }
  
  // Verificar se build errors não são ignorados
  if (nextConfig.includes('ignoreBuildErrors: true')) {
    errors.push('❌ next.config.js ignora erros de build (inseguro)')
  } else {
    passed++
    console.log('✅ Build errors não são ignorados')
  }
  
  // Verificar se eslint errors não são ignorados
  if (nextConfig.includes('ignoreDuringBuilds: true')) {
    errors.push('❌ next.config.js ignora erros de ESLint (inseguro)')
  } else {
    passed++
    console.log('✅ ESLint errors não são ignorados')
  }
  
} catch (error) {
  errors.push('❌ Erro ao ler next.config.js')
}

// 2. Verificar auth-options.ts
console.log('\n📋 Verificando configuração de autenticação...')
try {
  const authOptions = fs.readFileSync('src/lib/auth/auth-options.ts', 'utf8')
  
  if (authOptions.includes('allowDangerousEmailAccountLinking: true')) {
    errors.push('❌ Google OAuth permite account linking perigoso')
  } else {
    passed++
    console.log('✅ Google OAuth configurado com segurança')
  }
  
  if (authOptions.includes('30 * 24 * 60 * 60')) {
    warnings.push('⚠️  Sessões ainda duram 30 dias (considere reduzir)')
  } else {
    passed++
    console.log('✅ Duração de sessão segura')
  }
  
} catch (error) {
  errors.push('❌ Erro ao ler auth-options.ts')
}

// 3. Verificar middleware.ts
console.log('\n📋 Verificando middleware de segurança...')
try {
  const middleware = fs.readFileSync('src/middleware.ts', 'utf8')
  
  if (middleware.includes('process.env.ENABLE_CSRF_PROTECTION === \'true\'')) {
    errors.push('❌ CSRF protection ainda é condicional')
  } else {
    passed++
    console.log('✅ CSRF protection sempre ativo')
  }
  
} catch (error) {
  errors.push('❌ Erro ao ler middleware.ts')
}

// 4. Verificar se endpoint de debug foi removido
console.log('\n📋 Verificando endpoints perigosos...')
if (fs.existsSync('src/app/api/debug/oauth/route.ts')) {
  errors.push('❌ Endpoint de debug ainda existe (src/app/api/debug/oauth/route.ts)')
} else {
  passed++
  console.log('✅ Endpoint de debug removido')
}

// 5. Verificar Dockerfile
console.log('\n📋 Verificando Dockerfile...')
try {
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8')
  
  if (dockerfile.includes('postgresql://user:pass@localhost') && 
      !dockerfile.includes('placeholder')) {
    errors.push('❌ Dockerfile contém credenciais hardcoded')
  } else {
    passed++
    console.log('✅ Dockerfile não contém credenciais hardcoded')
  }
  
} catch (error) {
  warnings.push('⚠️  Não foi possível verificar Dockerfile')
}

// 6. Verificar .env.example
console.log('\n📋 Verificando .env.example...')
if (fs.existsSync('.env.example')) {
  passed++
  console.log('✅ Arquivo .env.example existe')
} else {
  warnings.push('⚠️  Arquivo .env.example não encontrado')
}

// 7. Verificar se .env não está commitado
console.log('\n📋 Verificando arquivos sensíveis...')
if (fs.existsSync('.env') || fs.existsSync('.env.local')) {
  warnings.push('⚠️  Arquivos .env encontrados - certifique-se de que não estão no git')
} else {
  passed++
  console.log('✅ Nenhum arquivo .env encontrado no diretório')
}

// 8. Verificar headers de segurança
console.log('\n📋 Verificando headers de segurança...')
try {
  const headers = fs.readFileSync('src/lib/security/headers.ts', 'utf8')
  
  if (headers.includes('Content-Security-Policy') && 
      headers.includes('X-Frame-Options') &&
      headers.includes('Strict-Transport-Security')) {
    passed++
    console.log('✅ Headers de segurança configurados')
  } else {
    errors.push('❌ Headers de segurança incompletos')
  }
  
} catch (error) {
  errors.push('❌ Arquivo de headers de segurança não encontrado')
}

// Resultado final
console.log('\n' + '='.repeat(50))
console.log('📊 RESULTADO DA VERIFICAÇÃO DE SEGURANÇA')
console.log('='.repeat(50))

console.log(`✅ Verificações aprovadas: ${passed}`)
console.log(`⚠️  Avisos: ${warnings.length}`)
console.log(`❌ Erros críticos: ${errors.length}`)

if (warnings.length > 0) {
  console.log('\n⚠️  AVISOS:')
  warnings.forEach(warning => console.log(`   ${warning}`))
}

if (errors.length > 0) {
  console.log('\n❌ ERROS CRÍTICOS:')
  errors.forEach(error => console.log(`   ${error}`))
  console.log('\n🚨 DEPLOY NÃO RECOMENDADO até corrigir os erros críticos!')
  process.exit(1)
} else {
  console.log('\n🎉 TODAS AS VERIFICAÇÕES DE SEGURANÇA PASSARAM!')
  console.log('✅ Sistema pronto para deploy seguro')
  process.exit(0)
}
