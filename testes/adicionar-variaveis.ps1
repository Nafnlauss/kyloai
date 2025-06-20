# Script para adicionar variáveis faltantes no Vercel
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " VARIAVEIS FALTANTES NO VERCEL" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Variáveis essenciais que faltam
$variaveis = @"
DATABASE_URL=postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
NEXTAUTH_SECRET=xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi=
NEXTAUTH_URL=https://kyloai.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://snfxczgjpnydysccigps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzY2NjksImV4cCI6MjA2NTk1MjY2OX0.OY-wNhs-K9HJks1mCbWYHDXvVIICHgCsaGnSk3Jx6Rw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NjY2OSwiZXhwIjoyMDY1OTUyNjY5fQ.LTFYGslmETIOeaIzfR4NV9cWQyXfkvesLNEeJEdvsHw
SESSION_SECRET=Lm7Np9QrStUv2Wx4Ya6Bc8DeGh0Jk2Mn4Pq6Rs8TvWx0Y=
ENCRYPTION_KEY=Fg8HjKmNpQrStVwXyZaBcDeFgHiJkLmNoPqRsTuVwXyZ1=
GOOGLE_CLIENT_ID=591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
"@

# Copiar para área de transferência
$variaveis | Set-Clipboard

Write-Host "[OK] Variaveis copiadas para area de transferencia!" -ForegroundColor Green
Write-Host ""
Write-Host "Variaveis ESSENCIAIS copiadas:" -ForegroundColor Yellow
Write-Host "- DATABASE_URL" -ForegroundColor Gray
Write-Host "- DIRECT_URL" -ForegroundColor Gray
Write-Host "- NEXTAUTH_SECRET" -ForegroundColor Gray
Write-Host "- NEXTAUTH_URL" -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Gray
Write-Host "- NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "- SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Gray
Write-Host "- SESSION_SECRET" -ForegroundColor Gray
Write-Host "- ENCRYPTION_KEY" -ForegroundColor Gray
Write-Host "- GOOGLE_CLIENT_ID" -ForegroundColor Gray
Write-Host "- GOOGLE_CLIENT_SECRET" -ForegroundColor Gray
Write-Host ""

# Abrir Vercel
Write-Host "Abrindo painel do Vercel..." -ForegroundColor Yellow
Start-Process "https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables"

Write-Host ""
Write-Host "INSTRUCOES:" -ForegroundColor Cyan
Write-Host "1. No Vercel, clique em 'Add Multiple' ou adicione uma por uma" -ForegroundColor White
Write-Host "2. COLE (Ctrl+V) as variaveis" -ForegroundColor White
Write-Host "3. Clique em 'Save'" -ForegroundColor White
Write-Host ""

Read-Host "Pressione ENTER depois de adicionar todas as variaveis..."

# Deploy
Write-Host ""
Write-Host "Fazendo deploy..." -ForegroundColor Yellow
Set-Location ..
vercel --prod

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " PROCESSO COMPLETO!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan