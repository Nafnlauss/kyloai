@echo off
echo ========================================
echo TESTE DE ENVIO DE EMAILS - KYLO
echo ========================================
echo.

echo VERIFICANDO CONFIGURACAO DE EMAIL
echo ---------------------------------
echo.
echo Configuracoes necessarias no .env.local:
echo - ZOHO_MAIL_USER=leonardo@kylo.video
echo - ZOHO_MAIL_PASSWORD=(sua senha)
echo - EMAIL_FROM="Kylo" ^<noreply@kylo.video^>
echo - SMTP_HOST=smtppro.zoho.com
echo - SMTP_PORT=587
echo.
pause

echo.
echo TESTE 1: Email de Boas-Vindas (300 creditos)
echo --------------------------------------------
echo.
echo 1. Crie uma nova conta em http://localhost:3000/register
echo 2. Use um email real para receber o teste
echo 3. Apos criar a conta, verifique sua caixa de entrada
echo.
echo O email deve conter:
echo - Assunto: "Welcome to Kylo! 🎬"
echo - Mensagem sobre os 300 creditos gratuitos
echo - Botao para criar primeiro video
echo.
pause

echo.
echo TESTE 2: Email de Confirmacao de Compra
echo ---------------------------------------
echo.
echo Para testar email de compra:
echo 1. Faca login com sua conta
echo 2. Va para /pricing ou /dashboard/billing
echo 3. Faca uma compra de creditos ou assinatura
echo 4. Verifique o email de confirmacao
echo.
echo O email deve conter:
echo - Detalhes da compra
echo - Valor pago
echo - Quantidade de creditos
echo.
pause

echo.
echo VERIFICANDO LOGS DO SERVIDOR
echo ----------------------------
echo.
echo No terminal onde o servidor esta rodando, procure por:
echo.
echo SE EMAIL ESTA CONFIGURADO:
echo - "Sending email to: ..."
echo - "Email sent successfully"
echo.
echo SE EMAIL NAO ESTA CONFIGURADO:
echo - "Email would be sent: ..."
echo - "Welcome email would be sent: ..."
echo.
echo Isso indica que o sistema esta em modo mock (desenvolvimento)
echo.
pause

echo.
echo PROBLEMAS COMUNS
echo ----------------
echo.
echo [ ] "Email would be sent" = Email em modo mock (desenvolvimento)
echo [ ] Erro de autenticacao = Verificar senha do Zoho Mail
echo [ ] Timeout = Verificar firewall/antivirus
echo [ ] Email nao chega = Verificar pasta de spam
echo.
echo Para ativar emails reais:
echo 1. Configure ZOHO_MAIL_USER e ZOHO_MAIL_PASSWORD corretos
echo 2. Reinicie o servidor (pnpm dev)
echo.
pause