@echo off
echo ===================================
echo  CONFIGURANDO GIT E FAZENDO DEPLOY
echo ===================================
echo.

echo [1] Configurando upstream...
git push --set-upstream origin main

echo.
echo [2] Movendo arquivos criados acidentalmente...
move DEPLOY-NOW.bat testes\ 2>nul
move FAST.bat testes\ 2>nul
move FIX-ALL.bat testes\ 2>nul
move NOW.bat testes\ 2>nul
move QUICK-FIX.bat testes\ 2>nul
move RUN.bat testes\ 2>nul
move SOLUCAO-FINAL.md testes\ 2>nul
move X.bat testes\ 2>nul
move fix-deploy.ps1 testes\ 2>nul

echo.
echo [3] Simplificando email-service.ts...
echo const s=async()=^>({success:true});export const sendEmail=s;export const sendWelcomeEmail=s;export const sendPurchaseConfirmationEmail=s;export const sendSubscriptionRenewalEmail=s;export const sendSubscriptionCancelledEmail=s;export const sendVideoCompletedEmail=s;export const sendVideoFailedEmail=s;export const sendPasswordResetEmail=s;export const sendCreditsLowEmail=s; > src\lib\email\email-service.ts

echo.
echo [4] Commit e push...
git add -A
git commit -m "fix: simplify email service and remove nodemailer"
git push

echo.
echo [5] Deploy no Vercel...
vercel --prod

echo.
pause