@echo off
echo ===================================
echo  ALTERNATIVA: AUTORIZAR SECRETS
echo ===================================
echo.
echo O GitHub detectou secrets e bloqueou o push.
echo Voce tem 2 opcoes:
echo.
echo 1. AUTORIZAR os secrets (mais rapido)
echo 2. LIMPAR o historico (mais seguro)
echo.
set /p opcao="Escolha (1 ou 2): "

if "%opcao%"=="1" (
    echo.
    echo Abra estes links no navegador e clique em "Allow secret":
    echo.
    echo Google OAuth:
    start https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2ylPEH23d6zoamnlC7pTcQSq3zJ
    start https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2ylPEHXQ5kPTS3PksuW5MyUSB9a
    echo.
    echo Stripe:
    start https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2ylPEJSlPBJBXXFHrRG3Mju0ufj
    echo.
    echo Depois de autorizar TODOS, execute:
    echo git push origin main
    echo.
    echo E depois: vercel --prod
)

if "%opcao%"=="2" (
    echo.
    echo Executando limpeza do historico...
    call LIMPAR-HISTORICO.bat
)

pause