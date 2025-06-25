# Instruções para Resolver Problema de Conexão

## Problema Identificado
O banco de dados Supabase não está acessível devido a:
1. Resolução DNS preferindo IPv6 (que está bloqueado)
2. Possível problema com a senha do banco

## Soluções Disponíveis

### Opção 1: Resetar Senha no Supabase (RECOMENDADO)
1. Acesse: https://app.supabase.com/project/snfxczgjpnydysccigps
2. Vá em **Settings** > **Database**
3. Clique em **Reset database password**
4. Use uma senha simples como: `Kylo2024!`
5. Aguarde alguns minutos para propagar
6. Atualize o arquivo `.env` com a nova senha (sem caracteres especiais problemáticos)

### Opção 2: Desabilitar IPv6 Temporariamente
1. Execute como **Administrador**:
   ```
   tests\fix-ipv6-windows.bat
   ```
2. Teste a conexão:
   ```
   node tests\test-connection.js
   ```
3. Para restaurar IPv6 depois:
   ```
   tests\fix-ipv6-restore.bat
   ```

### Opção 3: Adicionar Entradas no Hosts
1. Execute como **Administrador**:
   ```
   tests\add-supabase-hosts.bat
   ```
2. Teste a conexão

### Opção 4: Usar Conexão Local
Se nenhuma opção funcionar, considere:
1. Instalar PostgreSQL localmente
2. Usar Docker: `docker-compose up -d`
3. Atualizar `.env` para usar localhost

## Verificar Status do Projeto
1. Acesse o dashboard: https://app.supabase.com/project/snfxczgjpnydysccigps
2. Verifique se o projeto está **Active** (não pausado)
3. Se estiver pausado, clique em **Restore project**

## Após Resolver a Conexão
1. Execute para verificar:
   ```
   node tests\verify-setup.js
   ```
2. Execute as migrações se necessário:
   ```
   pnpm prisma migrate dev
   ```
3. Inicie o servidor:
   ```
   pnpm dev
   ```

## Credenciais de Teste
- Email: `test@example.com`
- Senha: `Test123!@#`