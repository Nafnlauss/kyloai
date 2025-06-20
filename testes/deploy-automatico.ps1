# PowerShell script para automatizar deploy no Vercel
Set-Location ..

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " DEPLOY AUTOMATICO VERCEL" -ForegroundColor Cyan  
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Ler variáveis do .env
Write-Host "[1] Lendo variaveis do arquivo .env..." -ForegroundColor Yellow
$envContent = Get-Content .env

# 2. Preparar variáveis para o Vercel
$vercelVars = @()

# Variáveis importantes do .env
$importantVars = @(
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SESSION_SECRET",
    "ENCRYPTION_KEY",
    "REDIS_URL"
)

foreach ($line in $envContent) {
    if ($line -match "^($($importantVars -join '|'))=(.*)$") {
        $vercelVars += "$($matches[1])=$($matches[2])"
    }
}

# Adicionar variáveis específicas do Vercel
$vercelVars += "NEXTAUTH_URL=https://kyloai.vercel.app"
$vercelVars += "NEXT_PUBLIC_APP_URL=https://kyloai.vercel.app"

# 3. Copiar para clipboard
Write-Host "[2] Copiando variaveis para area de transferencia..." -ForegroundColor Yellow
$vercelVars -join "`n" | Set-Clipboard

Write-Host ""
Write-Host "VARIAVEIS COPIADAS!" -ForegroundColor Green
Write-Host "Total: $($vercelVars.Count) variaveis" -ForegroundColor Gray
Write-Host ""

# 4. Abrir Vercel
Write-Host "[3] Abrindo painel do Vercel..." -ForegroundColor Yellow
Start-Process "https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables"

Write-Host ""
Write-Host "INSTRUCOES:" -ForegroundColor Cyan
Write-Host "1. No Vercel, role ate 'Environment Variables'" -ForegroundColor White
Write-Host "2. Delete todas as variaveis existentes (se houver)" -ForegroundColor White
Write-Host "3. Cole (Ctrl+V) no campo de texto grande" -ForegroundColor White
Write-Host "4. Clique em 'Save'" -ForegroundColor White
Write-Host ""

Read-Host "Pressione ENTER depois de salvar as variaveis..."

# 5. Deploy
Write-Host ""
Write-Host "[4] Iniciando deploy..." -ForegroundColor Yellow
vercel --prod --yes

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " PROCESSO COMPLETO!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan