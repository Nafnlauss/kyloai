# 🚀 INSTRUÇÕES FINAIS - DEPLOY VERCEL

## Erro Atual
```
Error: Command "pnpm install" exited with 1
```

## Solução em 1 Comando

No PowerShell, execute:
```powershell
cd F:\site-ia\ai-video-hub
.\deploy.bat
```

Isso vai:
1. Mudar para usar NPM ao invés de PNPM
2. Fazer commit automático
3. Executar o deploy

## Se Precisar Ver os Logs

```powershell
.\ver-logs.bat
```

## Scripts Disponíveis

| Script | Função |
|--------|--------|
| `deploy.bat` | Deploy rápido com NPM |
| `deploy-npm.bat` | Deploy com mais opções |
| `deploy-smart.ps1` | Deploy inteligente com verificações |
| `ver-logs.bat` | Ver logs do Vercel |
| `fix-deploy.bat` | Corrigir e tentar novamente |

## Comandos Manuais

Se preferir fazer manualmente:

```bash
# 1. Criar vercel.json para NPM
echo {"framework":"nextjs","installCommand":"npm install","buildCommand":"npm run build"} > vercel.json

# 2. Commit
git add vercel.json
git commit -m "Fix: use npm"

# 3. Deploy
vercel --prod
```

## Links Úteis

- Projeto: https://vercel.com/nafnlaus-projects/kyloai
- Variáveis: https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
- Logs: https://vercel.com/nafnlaus-projects/kyloai/logs

---
Execute `.\deploy.bat` agora para resolver! 🎯
