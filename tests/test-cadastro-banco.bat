@echo off
echo ===============================================
echo TESTE DE CADASTRO - VERIFICACAO BANCO DE DADOS
echo ===============================================
echo.

echo PASSO 1: Abrir Prisma Studio
echo -----------------------------
echo Execute em um terminal:
echo   cd ai-video-hub
echo   npx prisma studio
echo.
echo Isso abrira o Prisma Studio em http://localhost:5555
echo.
pause

echo.
echo PASSO 2: Verificar tabela User antes do cadastro
echo ------------------------------------------------
echo No Prisma Studio:
echo 1. Clique na tabela "User"
echo 2. Anote quantos usuarios existem atualmente
echo 3. Verifique se ja existe algum usuario com email: novo@teste.com
echo.
pause

echo.
echo PASSO 3: Fazer novo cadastro
echo ----------------------------
echo 1. Abra http://localhost:3000/register
echo 2. Preencha o formulario:
echo    - Email: novo@teste.com
echo    - Senha: NovoTeste123!
echo    - Marque "Aceito os termos"
echo 3. Clique em "Criar conta"
echo.
echo Voce deve ser redirecionado para /studio/video
echo.
pause

echo.
echo PASSO 4: Verificar no banco de dados
echo ------------------------------------
echo Volte ao Prisma Studio e atualize a pagina (F5)
echo.
echo Verifique se foi criado um novo usuario com:
echo - email: novo@teste.com
echo - credits: 300
echo - passwordHash: (deve ter um hash, nao a senha em texto)
echo - emailVerified: null
echo - creditsLastReset: data/hora atual
echo.
pause

echo.
echo PASSO 5: Verificar tabela AuditLog
echo ----------------------------------
echo No Prisma Studio:
echo 1. Clique na tabela "AuditLog"
echo 2. Verifique se foi criado um registro com:
echo    - action: USER_REGISTERED
echo    - userId: ID do novo usuario
echo    - resource: USER
echo.
pause

echo.
echo PASSO 6: Teste de email duplicado
echo ---------------------------------
echo Tente cadastrar novamente com o mesmo email:
echo 1. Faca logout (se estiver logado)
echo 2. Va para http://localhost:3000/register
echo 3. Use o mesmo email: novo@teste.com
echo 4. Tente criar conta
echo.
echo Deve aparecer erro: "User already exists"
echo.
pause

echo.
echo RESULTADO DO TESTE
echo ==================
echo [ ] Usuario foi criado no banco? (tabela User)
echo [ ] Credits = 300?
echo [ ] Password esta com hash?
echo [ ] AuditLog foi criado?
echo [ ] Email duplicado foi bloqueado?
echo [ ] Redirecionou para /studio/video apos cadastro?
echo.
echo Se todos estiverem marcados, o cadastro esta funcionando!
echo.
pause