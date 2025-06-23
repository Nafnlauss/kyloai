# Dados Armazenados no Supabase - Kylo

## 📊 Estrutura de Dados

### 1. Tabela `User` (Usuários)
```
- id: identificador único
- email: email do usuário
- passwordHash: senha criptografada
- credits: saldo de créditos atual
- role: USER ou ADMIN
- createdAt: data de cadastro
```

### 2. Tabela `Subscription` (Assinaturas)
```
- userId: quem é o assinante
- planId: qual plano (Free, Lite, Creator, Pro)
- status: ACTIVE, CANCELED, PAST_DUE
- currentPeriodEnd: quando expira
- stripeSubscriptionId: ID do Stripe
```

### 3. Tabela `Video` (Vídeos Gerados)
```
- userId: quem criou
- prompt: texto usado para gerar
- provider: LUMA ou KLING
- status: QUEUED, PROCESSING, COMPLETED, FAILED
- videoUrl: link do vídeo pronto
- creditsUsed: quantos créditos gastou
- createdAt: quando foi criado
```

### 4. Tabela `Transaction` (Pagamentos)
```
- userId: quem pagou
- type: CREDIT_PURCHASE ou SUBSCRIPTION_PAYMENT
- amount: valor em USD
- credits: quantos créditos comprou
- status: COMPLETED, FAILED, REFUNDED
- stripePaymentIntentId: ID do pagamento
```

### 5. Tabela `Plan` (Planos Disponíveis)
```
- name: free, lite, creator, professional
- credits: créditos por mês
- priceMonthly: preço mensal
- priceYearly: preço anual
- features: lista de recursos
```

### 6. Tabela `AuditLog` (Auditoria)
```
- userId: quem fez a ação
- action: tipo de ação (LOGIN, LOGOUT, VIDEO_CREATED, etc)
- ipAddress: IP do usuário
- metadata: detalhes extras
- createdAt: quando aconteceu
```

## 🔑 O que é crítico manter no Supabase:

1. **Autenticação**: Tudo relacionado a login/senha
2. **Créditos**: Saldo e histórico de uso
3. **Pagamentos**: Todas as transações financeiras
4. **Vídeos**: Registro de todos os vídeos gerados
5. **Auditoria**: Para segurança e compliance

## 📈 Dados que podem ficar em cache/local:

- Configurações da UI (tema escuro/claro)
- Preferências do usuário
- Rascunhos de prompts
- Histórico de buscas

## 🚀 Próximos Passos:

1. Execute o SQL no Supabase Dashboard
2. Configure as políticas de segurança (RLS)
3. Crie índices para performance
4. Configure backups automáticos