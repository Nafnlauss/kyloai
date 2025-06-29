# 🧪 PASTA DE TESTES - KYLO.VIDEO

Esta pasta contém todos os arquivos de teste, scripts de diagnóstico e utilitários para o projeto Kylo.video.

## 📁 **ESTRUTURA ORGANIZADA**

### **🛡️ /security/**
- `security-check.js` - Script de verificação de segurança
- `SECURITY_FIXES_APPLIED.md` - Relatório de correções aplicadas
- `DEPLOY_SECURITY_GUIDE.md` - Guia de deploy seguro

### **🔐 /oauth/**
- `test-oauth.js` - Script de teste do Google OAuth
- `debug-endpoint.ts` - Endpoint de debug temporário
- `GOOGLE_OAUTH_401_FIX.md` - Guia de correção OAuth

### **📧 /email/**
- Scripts de teste de email
- Testes de templates
- Validação de configurações SMTP

### **🗄️ /database/**
- Scripts de teste de conexão
- Migrações de teste
- Validação de schema

## 🚀 **COMANDOS DISPONÍVEIS**

### **Verificação de Segurança**
```bash
npm run security-check
```

### **Teste OAuth**
```bash
npm run test-oauth          # Local
npm run test-oauth-prod     # Produção
```

### **Deploy Check Completo**
```bash
npm run deploy-check
```

## 📋 **COMO USAR**

### **1. Antes do Deploy**
```bash
npm run security-check
```

### **2. Problemas com OAuth**
```bash
npm run test-oauth-prod
```

### **3. Debug Temporário**
1. Copie `oauth/debug-endpoint.ts` para `src/app/api/debug/oauth-temp/route.ts`
2. Acesse `/api/debug/oauth-temp` em produção
3. **REMOVA** após resolver

## ⚠️ **IMPORTANTE**

- ✅ Todos os arquivos de teste estão organizados aqui
- ✅ Não poluem o código principal
- ✅ Fácil manutenção e localização
- ✅ Scripts podem ser executados da raiz do projeto

## 📖 **DOCUMENTAÇÃO**

Consulte os arquivos `.md` em cada pasta para instruções específicas de cada tipo de teste.

## Structure (Legacy)

```
tests/
├── email/          # Email testing scripts
├── api/            # API endpoint tests
├── integration/    # Integration tests
└── scripts/        # Utility test scripts
```

## Email Tests

Located in `tests/email/`:
- `test-email-simple.js` - Basic email sending test
- `test-email-welcome.js` - Welcome email template test
- `test-email-english.js` - English email templates test
- `test-email-noreply.js` - Noreply address configuration test
- `test-email-antispam.js` - Anti-spam optimized email test
- `test-purchase-optimized.js` - Purchase confirmation email test

### Running Email Tests

```bash
cd tests/email
node test-email-antispam.js
```

## Note

These test files are for development and debugging purposes only. They are not included in the production build.