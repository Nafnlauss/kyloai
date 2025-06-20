@echo off
echo ===================================
echo  ADICIONANDO VARIAVEIS FALTANTES
echo ===================================
echo.

echo Criando arquivo com variaveis formatadas...

(
echo DATABASE_URL=postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
echo DIRECT_URL=postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
echo NEXTAUTH_SECRET=xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi=
echo NEXTAUTH_URL=https://kyloai.vercel.app
echo NEXT_PUBLIC_SUPABASE_URL=https://snfxczgjpnydysccigps.supabase.co
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzY2NjksImV4cCI6MjA2NTk1MjY2OX0.OY-wNhs-K9HJks1mCbWYHDXvVIICHgCsaGnSk3Jx6Rw
echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NjY2OSwiZXhwIjoyMDY1OTUyNjY5fQ.LTFYGslmETIOeaIzfR4NV9cWQyXfkvesLNEeJEdvsHw
echo SESSION_SECRET=Lm7Np9QrStUv2Wx4Ya6Bc8DeGh0Jk2Mn4Pq6Rs8TvWx0Y=
echo ENCRYPTION_KEY=Fg8HjKmNpQrStVwXyZaBcDeFgHiJkLmNoPqRsTuVwXyZ1=
echo GOOGLE_CLIENT_ID=591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com
echo GOOGLE_CLIENT_SECRET=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
echo SMTP_HOST=smtppro.zoho.com
echo SMTP_PORT=587
echo SMTP_USER=leonardo@kyloai.xyz
echo SMTP_PASSWORD=7VwNtDb!ZG!%%BNJJgsb6
echo EMAIL_FROM=KyloAI ^<noreply@kyloai.xyz^>
) > variaveis-vercel.txt

echo.
echo Arquivo criado: variaveis-vercel.txt
echo.

echo Abrindo arquivo para copiar...
start notepad variaveis-vercel.txt

echo.
echo Abrindo Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo ===================================
echo  INSTRUCOES:
echo ===================================
echo.
echo 1. No Vercel, clique em "Add Multiple" ou "Bulk Edit"
echo 2. COPIE TODO o conteudo do Notepad (Ctrl+A, Ctrl+C)
echo 3. COLE no campo do Vercel (Ctrl+V)
echo 4. Clique em "Save"
echo.
echo IMPORTANTE: Sao 15 variaveis no total!
echo.
echo Depois de adicionar TODAS, pressione qualquer tecla...
pause > nul

del variaveis-vercel.txt

echo.
echo Fazendo deploy...
vercel --prod

pause