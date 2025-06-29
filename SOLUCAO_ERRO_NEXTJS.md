# 🚨 SOLUÇÃO PARA O ERRO DO NEXT.JS

## Erro Encontrado:
```
Error: Module not found: Error: Can't resolve 'next-flight-client-entry-loader'
```

## 🛠️ SOLUÇÕES DISPONÍVEIS:

### Opção 1 - Script Automático (Windows):
```bash
# Execute no PowerShell ou Command Prompt:
cd ai-video-hub
tests\fix-nextjs-error.bat
```

### Opção 2 - Script Automático (Linux/WSL):
```bash
cd ai-video-hub
./tests/fix-nextjs-error.sh
```

### Opção 3 - Correção Manual:
```bash
# 1. Pare todos os processos Node.js
pkill -f "node" || taskkill /F /IM node.exe

# 2. Limpe o cache
rm -rf .next
rm -rf node_modules/.cache

# 3. Reinstale as dependências
rm -rf node_modules
pnpm install

# 4. Gere o cliente Prisma
pnpm prisma generate

# 5. Inicie o servidor novamente
pnpm dev
```

### Opção 4 - Reinstalação Completa:
```bash
# 1. Delete tudo e reinstale
rm -rf node_modules package-lock.json pnpm-lock.yaml .next
pnpm install --force
pnpm prisma generate
pnpm dev
```

## 📋 CHECKLIST DE VERIFICAÇÃO:

- [ ] O servidor foi completamente parado
- [ ] O cache foi limpo (.next e node_modules/.cache)
- [ ] As dependências foram reinstaladas
- [ ] O cliente Prisma foi gerado
- [ ] O servidor iniciou sem erros

## 🎯 RESULTADO ESPERADO:

Após seguir uma das opções acima, o servidor deve iniciar normalmente em:
- http://localhost:3000

E o painel admin estará acessível em:
- http://localhost:3000/admin

## ⚠️ SE O ERRO PERSISTIR:

1. Verifique a versão do Node.js:
   ```bash
   node --version  # Deve ser v18+ ou v20+
   ```

2. Use uma versão LTS do Node.js:
   ```bash
   nvm use 20  # ou nvm use 18
   ```

3. Tente com npm ao invés de pnpm:
   ```bash
   npm install
   npm run dev
   ```

## 💡 DICA IMPORTANTE:

Este erro geralmente ocorre quando:
- O cache do Next.js fica corrompido
- As dependências não foram instaladas corretamente
- Há conflito entre versões de pacotes

A solução mais eficaz é sempre limpar o cache e reinstalar as dependências!