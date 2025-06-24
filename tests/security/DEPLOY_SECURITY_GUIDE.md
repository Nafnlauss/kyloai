# 🚀 GUIA DE DEPLOY SEGURO - KYLO.VIDEO

## ✅ **PRÉ-REQUISITOS DE SEGURANÇA**

Antes de fazer deploy, execute:

```bash
npm run security-check
```

Este comando verifica se todas as configurações de segurança estão aplicadas.

## 🔐 **CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE**

### **1. Copiar arquivo de exemplo**
```bash
cp .env.example .env.local
```

### **2. Gerar secrets seguros**
```bash
# Para NEXTAUTH_SECRET
openssl rand -base64 32

# Para SESSION_SECRET  
openssl rand -base64 32

# Para ENCRYPTION_KEY
openssl rand -base64 32
```

### **3. Configurar variáveis obrigatórias**

#### **🗄️ Banco de Dados**
```env
DATABASE_URL="postgresql://username:password@host:5432/database"
DIRECT_URL="postgresql://username:password@host:5432/database"
```

#### **🔑 Autenticação**
```env
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"
NEXTAUTH_URL="https://kylo.video"
SESSION_SECRET="outro-secret-para-sessoes"
ENCRYPTION_KEY="chave-de-32-caracteres-aqui"
```

#### **🌐 Google OAuth**
```env
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

#### **💳 Stripe**
```env
STRIPE_SECRET_KEY="sk_live_seu-stripe-secret"
STRIPE_PUBLISHABLE_KEY="pk_live_seu-stripe-publishable"
STRIPE_WEBHOOK_SECRET="whsec_seu-webhook-secret"
```

## 🛡️ **CHECKLIST DE SEGURANÇA PRÉ-DEPLOY**

### **Configurações Críticas**
- [ ] `allowDangerousEmailAccountLinking: false` no Google OAuth
- [ ] Sessões com duração máxima de 7 dias
- [ ] CSRF protection sempre ativo
- [ ] Headers de segurança configurados
- [ ] Rate limiting ativo
- [ ] Endpoint de debug removido
- [ ] Validação de upload com magic bytes
- [ ] Build errors não ignorados

### **Variáveis de Ambiente**
- [ ] Todos os secrets gerados com `openssl rand -base64 32`
- [ ] URLs de produção configuradas
- [ ] Credenciais de banco seguras
- [ ] API keys válidas
- [ ] Webhooks configurados

### **Infraestrutura**
- [ ] HTTPS configurado
- [ ] Certificado SSL válido
- [ ] Firewall configurado
- [ ] Backup automático do banco
- [ ] Monitoramento ativo

## 🚀 **PROCESSO DE DEPLOY**

### **1. Verificação Local**
```bash
# Verificar segurança
npm run security-check

# Verificar lint
npm run lint

# Build de teste
npm run build
```

### **2. Deploy para Staging**
```bash
# Deploy completo com verificações
npm run deploy-check
```

### **3. Testes de Segurança em Staging**
```bash
# Testar CSRF protection
curl -X POST https://staging.kylo.video/api/user/profile
# Deve retornar 403

# Testar rate limiting
for i in {1..15}; do curl -X POST https://staging.kylo.video/api/auth/login; done
# Deve retornar 429 após 10 tentativas

# Verificar headers de segurança
curl -I https://staging.kylo.video
# Deve incluir todos os security headers
```

### **4. Deploy para Produção**
Apenas após todos os testes passarem em staging.

## 🔍 **MONITORAMENTO PÓS-DEPLOY**

### **Logs de Segurança**
- Tentativas de login falhadas
- Ataques de rate limiting
- Uploads rejeitados
- Erros de CSRF

### **Alertas Configurados**
- Múltiplas tentativas de login
- Uploads suspeitos
- Erros de autenticação
- Picos de tráfego anômalos

### **Métricas de Segurança**
- Taxa de bloqueio por rate limiting
- Tentativas de CSRF
- Uploads rejeitados por validação
- Sessões expiradas

## ⚠️ **PROCEDIMENTOS DE EMERGÊNCIA**

### **Em caso de ataque**
1. Ativar rate limiting mais restritivo
2. Bloquear IPs suspeitos no firewall
3. Invalidar todas as sessões ativas
4. Verificar logs de auditoria
5. Notificar usuários se necessário

### **Em caso de vazamento**
1. Revogar todas as API keys
2. Gerar novos secrets
3. Forçar reset de senhas
4. Auditar logs de acesso
5. Notificar autoridades se necessário

## 📞 **CONTATOS DE EMERGÊNCIA**

- **DevOps**: [seu-email@kylo.video]
- **Segurança**: [security@kylo.video]
- **Suporte**: [support@kylo.video]

## 📚 **RECURSOS ADICIONAIS**

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management)

---

**⚠️ IMPORTANTE**: Nunca faça deploy sem executar `npm run security-check` e verificar que todas as configurações estão corretas!
