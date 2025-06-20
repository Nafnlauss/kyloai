# 🚀 Instruções Rápidas - Deploy Vercel

## ⚠️ NOVO: Erro de Componentes UI
Se aparecer erro "Module not found: Can't resolve '@/components/ui/..."

### Solução Rápida:
```bash
.\instalar-componentes.bat
```

Ou para instalar TODOS os componentes de uma vez:
```bash
.\0-fix-todos-componentes.bat
```

---

## Problema Original
O Vercel não consegue fazer build porque faltam as variáveis de ambiente.

## Solução Completa

### Passo 0: Se der erro de componentes
```bash
.\0-fix-todos-componentes.bat
```

### Opção 1: Fazer tudo de uma vez
```bash
.\RESOLVER-TUDO.bat
```

### Opção 2: Passo a passo
1. **Testar localmente**: `.\1-testar-build-local.bat`
2. **Commit e Push**: `.\2-commit-e-push.bat`
3. **Adicionar variáveis**: `.\3-adicionar-variaveis-vercel.bat`
4. **Deploy**: `.\4-deploy-vercel.bat`

### Se der erro
- Execute: `.\5-verificar-logs-erro.bat`

## Arquivos na pasta testes/
- `0-fix-todos-componentes.bat` - **NOVO!** Instala componentes UI faltando
- `instalar-componentes.bat` - Instala os 5 componentes que deram erro
- `fix-componentes-ui.bat` - Alternativa para verificar e instalar
- `SOLUCAO.md` - Explicação detalhada
- `VARIAVEIS-VERCEL.md` - Variáveis prontas para copiar
- Scripts numerados de 1 a 5 para cada etapa
- `RESOLVER-TUDO.bat` - Faz tudo automaticamente

## Dica Principal
1. Primeiro resolva erros de componentes faltando
2. Depois adicione as variáveis de ambiente no Vercel!
