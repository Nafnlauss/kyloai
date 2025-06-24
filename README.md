# 🎬 Kylo AI Video Hub

> Plataforma moderna de geração de vídeos com IA usando Luma Dream Machine e Kling AI

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🚀 Funcionalidades

- **🤖 Geração de Vídeos com IA**: Crie vídeos a partir de prompts usando Luma e Kling
- **💳 Sistema de Créditos**: Planos mensais/anuais e compra avulsa
- **🔐 Autenticação Segura**: Login com Google OAuth e credenciais
- **💰 Pagamentos**: Integração com Stripe e Asaas (PIX/Boleto)
- **📊 Painel Admin**: Gestão completa de usuários e conteúdo
- **📧 Notificações**: Emails automáticos para eventos importantes
- **🔄 Tempo Real**: Atualizações ao vivo do status de processamento
- **🛡️ Segurança**: Conformidade OWASP e múltiplas camadas de proteção

## 📋 Pré-requisitos

- Node.js 18+ e pnpm
- PostgreSQL (produção) ou SQLite (desenvolvimento)
- Redis para filas de processamento
- Contas: Stripe, Google Cloud, Supabase

## 🔧 Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ai-video-hub.git
cd ai-video-hub

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute as migrações
pnpm prisma migrate dev

# Inicie o servidor de desenvolvimento
pnpm dev
```

## 🚀 Deploy

### Deploy Rápido (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/ai-video-hub)

**Passo a passo completo**: Veja [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

### Comandos Importantes

```bash
# Verificação de segurança antes do deploy
npm run security-check

# Verificação completa (segurança + lint + build)
npm run deploy-check

# Teste de OAuth
npm run test-oauth            # Local
npm run test-oauth-prod       # Produção
```

## 🏗️ Arquitetura

```
ai-video-hub/
├── src/
│   ├── app/          # App Router (Next.js 15)
│   ├── components/   # Componentes React
│   ├── lib/          # Lógica de negócio
│   │   ├── video-providers/  # Integrações Luma/Kling
│   │   ├── payments/         # Stripe/Asaas
│   │   └── security/         # Middleware de segurança
│   └── types/        # TypeScript types
├── prisma/           # Schema do banco
├── tests/            # Scripts de teste e docs
└── public/           # Assets estáticos
```

## 🔐 Segurança

- ✅ Proteção OWASP Top 10
- ✅ Rate limiting em todas APIs
- ✅ Validação com Zod
- ✅ CSRF Protection
- ✅ Headers de segurança (Helmet)
- ✅ Auditoria completa
- ✅ 2FA opcional

## 📚 Documentação

- [Guia de Deploy](DEPLOY_GUIDE.md) - Deploy completo passo a passo
- [Configuração de Email](docs/EMAIL-SETUP.md) - SPF, DKIM, DMARC
- [Documentação Completa](tests/docs/) - Guias adicionais

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Prisma ORM, NextAuth.js
- **Database**: PostgreSQL (Supabase)
- **Pagamentos**: Stripe, Asaas
- **Queue**: BullMQ + Redis
- **Deploy**: Vercel/Railway

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: Nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: support@kyloai.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/ai-video-hub/issues)
- 📖 Docs: [Wiki](https://github.com/seu-usuario/ai-video-hub/wiki)

---

Feito com ❤️ pela equipe Kylo