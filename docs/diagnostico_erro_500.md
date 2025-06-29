# Diagnóstico do Erro 500

## Problema Identificado
- **Erro**: 500 Internal Server Error
- **Sintoma**: O servidor não consegue processar requisições

## Possíveis Causas e Soluções

### 1. Problema com Prisma Client
**Erro encontrado**: Permissão negada ao gerar Prisma Client

**Solução**:
```bash
# No terminal do Windows (como admin):
cd ai-video-hub
rmdir /s /q node_modules\.prisma
npm run postinstall
```

### 2. Variáveis de Ambiente
Verifique se todas as variáveis necessárias estão no `.env.local`:
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### 3. Problemas de Banco de Dados
Execute para verificar conexão:
```bash
npx prisma db pull
```

### 4. Limpar Cache do Next.js
```bash
# No terminal:
rmdir /s /q .next
npm run dev
```

### 5. Verificar Logs do Servidor
No terminal onde está rodando `pnpm dev`, procure por:
- Erros de conexão com banco
- Erros de importação de módulos
- Erros de variáveis de ambiente

## Ações Recomendadas

1. **Pare o servidor** (Ctrl+C)

2. **Execute no Windows PowerShell como Admin**:
```powershell
cd C:\seu\caminho\ai-video-hub
Remove-Item -Recurse -Force node_modules\.prisma
Remove-Item -Recurse -Force .next
npm install
npm run postinstall
npm run dev
```

3. **Se ainda der erro**, verifique o log completo do terminal

## Teste Alternativo
Tente acessar uma rota de API simples:
- http://localhost:3000/api/health

Se esta rota funcionar, o problema é específico das páginas.