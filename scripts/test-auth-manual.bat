@echo off
echo ========================================
echo TESTE DE CADASTRO E LOGIN - AI VIDEO HUB
echo ========================================
echo.

echo IMPORTANTE: Execute este teste com o servidor rodando (pnpm dev)
echo.
pause

echo.
echo 1. TESTANDO CADASTRO
echo -------------------
echo.
echo Abra seu navegador e acesse: http://localhost:3000/register
echo.
echo Preencha o formulário com:
echo - Email: teste@example.com
echo - Senha: Teste123!
echo - Marque "Aceito os termos"
echo - Clique em "Criar conta"
echo.
echo Você deve ser redirecionado para /studio/video após o cadastro
echo.
pause

echo.
echo 2. VERIFICANDO NO BANCO DE DADOS
echo --------------------------------
echo.
echo Execute no terminal:
echo   cd ai-video-hub
echo   npx prisma studio
echo.
echo Isso abrirá o Prisma Studio no navegador
echo Verifique na tabela "User" se o usuário foi criado com:
echo - Email correto
echo - Credits: 300
echo - emailVerified: null (ainda não verificado)
echo.
pause

echo.
echo 3. TESTANDO LOGIN COM EMAIL/SENHA
echo ---------------------------------
echo.
echo Faça logout (se estiver logado)
echo Acesse: http://localhost:3000/login
echo.
echo Use as credenciais:
echo - Email: teste@example.com
echo - Senha: Teste123!
echo.
echo Você deve ser redirecionado para /studio/video
echo.
pause

echo.
echo 4. TESTANDO LOGIN COM GOOGLE
echo ----------------------------
echo.
echo Faça logout novamente
echo Acesse: http://localhost:3000/login
echo.
echo Clique em "Entrar com Google"
echo Faça login com sua conta Google
echo.
echo IMPORTANTE: Para funcionar corretamente:
echo 1. Configure no Google Cloud Console:
echo    - Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
echo    - Authorized JavaScript origins: http://localhost:3000
echo.
echo 2. Verifique no .env.local:
echo    - GOOGLE_CLIENT_ID está correto
echo    - GOOGLE_CLIENT_SECRET está correto
echo.
pause

echo.
echo 5. VERIFICANDO USUÁRIO GOOGLE NO BANCO
echo --------------------------------------
echo.
echo Volte ao Prisma Studio
echo Verifique se foi criado:
echo - Um novo User com seu email do Google
echo - Uma Account vinculada ao User
echo - Provider: google
echo.
pause

echo.
echo RELATÓRIO DE PROBLEMAS COMUNS:
echo ------------------------------
echo.
echo [ ] Erro "Invalid email or password" = Email ou senha incorretos
echo [ ] Erro "User already exists" = Email já cadastrado
echo [ ] Google OAuth não funciona = Verificar configurações no Google Cloud Console
echo [ ] Página em branco = Verificar console do navegador (F12)
echo [ ] Erro 500 = Verificar logs do servidor no terminal
echo.
echo Teste concluído!
pause