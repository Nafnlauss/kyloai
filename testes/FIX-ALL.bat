@echo off
echo ===================================
echo  CORRIGINDO IMPORTS E NODEMAILER
echo ===================================
echo.

echo [1] Corrigindo imports do next-auth...
powershell -Command "Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match 'from ''next-auth''.*getServerSession') { $newContent = $content -replace 'from ''next-auth''', 'from ''next-auth/next'''; Set-Content -Path $_.FullName -Value $newContent -NoNewline; Write-Host 'Fixed: ' $_.Name } }"

echo.
echo [2] Corrigindo nodemailer...
echo import nodemailer from 'nodemailer'; > src\lib\email\email-service-temp.ts
echo. >> src\lib\email\email-service-temp.ts
echo const transporter = nodemailer.createTransporter({ >> src\lib\email\email-service-temp.ts
echo   host: process.env.SMTP_HOST ^|^| 'smtp.gmail.com', >> src\lib\email\email-service-temp.ts
echo   port: parseInt(process.env.SMTP_PORT ^|^| '587'), >> src\lib\email\email-service-temp.ts
echo   secure: false, >> src\lib\email\email-service-temp.ts
echo   auth: { >> src\lib\email\email-service-temp.ts
echo     user: process.env.SMTP_USER, >> src\lib\email\email-service-temp.ts
echo     pass: process.env.SMTP_PASSWORD, >> src\lib\email\email-service-temp.ts
echo   }, >> src\lib\email\email-service-temp.ts
echo }); >> src\lib\email\email-service-temp.ts
echo. >> src\lib\email\email-service-temp.ts
echo export async function sendEmail(to: string, subject: string, html: string) { >> src\lib\email\email-service-temp.ts
echo   try { >> src\lib\email\email-service-temp.ts
echo     await transporter.sendMail({ >> src\lib\email\email-service-temp.ts
echo       from: process.env.EMAIL_FROM ^|^| 'noreply@example.com', >> src\lib\email\email-service-temp.ts
echo       to, >> src\lib\email\email-service-temp.ts
echo       subject, >> src\lib\email\email-service-temp.ts
echo       html, >> src\lib\email\email-service-temp.ts
echo     }); >> src\lib\email\email-service-temp.ts
echo   } catch (error) { >> src\lib\email\email-service-temp.ts
echo     console.error('Email error:', error); >> src\lib\email\email-service-temp.ts
echo   } >> src\lib\email\email-service-temp.ts
echo } >> src\lib\email\email-service-temp.ts

move /y src\lib\email\email-service-temp.ts src\lib\email\email-service.ts

echo.
echo [3] Commit e push...
git add -A
git commit -m "fix: next-auth imports and nodemailer"
git push origin main

echo.
echo [4] Deploy...
vercel --prod --yes

echo.
pause