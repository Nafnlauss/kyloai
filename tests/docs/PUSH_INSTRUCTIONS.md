# Instruções para Push com Proteção de Secrets

## Problema
O GitHub está bloqueando o push porque detectou o Google OAuth Client Secret no commit.

## Solução

### Opção 1: Permitir o secret temporariamente
1. Acesse o link fornecido pelo GitHub:
   https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2yvDDqntlo6s6UV2AxRkuXNN00v

2. Clique em "Allow secret" temporariamente

3. Faça o push novamente:
   ```bash
   git push origin main
   ```

### Opção 2: Resetar o histórico (mais seguro)
```bash
# Voltar ao commit anterior
git reset --hard HEAD~1

# Fazer push forçado dos outros commits
git push origin main --force
```

## Importante

Após o push, IMEDIATAMENTE:
1. Vá ao Railway
2. Atualize `GOOGLE_CLIENT_SECRET` com a nova chave
3. Remova os arquivos .env do repositório se estiverem lá

## Prevenção Futura

Nunca commite arquivos com secrets. Sempre use:
- Variáveis de ambiente no servidor
- Arquivos .env locais (não commitados)
- Secrets do GitHub Actions quando necessário