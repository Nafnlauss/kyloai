@echo off
echo ===================================
echo  DESABILITANDO EMAIL TEMPORARIAMENTE
echo ===================================
echo.

echo [1] Criando email-service simplificado...
echo // Temporary email service to fix build > src\lib\email\email-service.ts
echo export async function sendEmail(to: string, subject: string, html: string) { >> src\lib\email\email-service.ts
echo   console.log('Email disabled:', { to, subject }); >> src\lib\email\email-service.ts
echo   return Promise.resolve(); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts
echo. >> src\lib\email\email-service.ts
echo export async function sendWelcomeEmail(email: string, name: string) { >> src\lib\email\email-service.ts
echo   return sendEmail(email, 'Welcome', 'Welcome ' + name); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts
echo. >> src\lib\email\email-service.ts
echo export async function sendPasswordResetEmail(email: string, token: string) { >> src\lib\email\email-service.ts
echo   return sendEmail(email, 'Reset Password', 'Token: ' + token); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts
echo. >> src\lib\email\email-service.ts
echo export async function sendVideoCompletedEmail(email: string, title: string, url: string) { >> src\lib\email\email-service.ts
echo   return sendEmail(email, 'Video Ready', 'Your video is ready'); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts
echo. >> src\lib\email\email-service.ts
echo export async function sendPurchaseConfirmationEmail(email: string, plan: string) { >> src\lib\email\email-service.ts
echo   return sendEmail(email, 'Purchase Confirmation', 'Plan: ' + plan); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts
echo. >> src\lib\email\email-service.ts
echo export async function sendCreditsLowEmail(email: string, credits: number) { >> src\lib\email\email-service.ts
echo   return sendEmail(email, 'Low Credits', 'Credits: ' + credits); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts
echo. >> src\lib\email\email-service.ts
echo export async function sendSubscriptionRenewalEmail(email: string) { >> src\lib\email\email-service.ts
echo   return sendEmail(email, 'Subscription Renewed', 'Your subscription was renewed'); >> src\lib\email\email-service.ts
echo } >> src\lib\email\email-service.ts

echo.
echo [2] Corrigindo imports next-auth com PowerShell...
powershell -Command ^
"Get-ChildItem -Path . -Include *.ts,*.tsx -Recurse | Where-Object { $_.FullName -notlike '*node_modules*' } | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match \"from 'next-auth'.*getServerSession\") { $newContent = $content -replace \"from 'next-auth'\", \"from 'next-auth/next'\"; Set-Content -Path $_.FullName -Value $newContent -NoNewline; Write-Host \"Fixed: $($_.Name)\" } }"

echo.
echo [3] Commit e push...
git add -A
git commit -m "fix: disable email temporarily and fix imports"
git push origin main

echo.
echo [4] Deploy...
vercel --prod --yes

pause