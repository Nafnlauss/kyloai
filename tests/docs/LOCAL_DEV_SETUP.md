# 🚀 Configuração para Desenvolvimento Local

## Para trabalhar localmente:

1. **Salve o .env.local atual** (produção):
   ```bash
   cp .env.local .env.local.prod
   ```

2. **Use o .env.local de desenvolvimento**:
   ```bash
   cp .env.local.dev .env.local
   ```

3. **Inicie o servidor**:
   ```bash
   npm run dev
   ```

## Para fazer deploy em produção:

1. **Restaure o .env.local de produção**:
   ```bash
   cp .env.local.prod .env.local
   ```

2. **Faça commit e push**:
   ```bash
   git add .
   git commit -m "sua mensagem"
   git push origin main
   ```

## ⚠️ IMPORTANTE:
- **NUNCA** faça commit do .env.local.dev
- **SEMPRE** use .env.local.prod antes de fazer push
- O .env.local.dev tem NEXTAUTH_URL=http://localhost:3000
- O .env.local.prod tem NEXTAUTH_URL=https://kylo.video

## Arquivos ignorados no git:
- .env.local
- .env.local.dev
- .env.local.prod