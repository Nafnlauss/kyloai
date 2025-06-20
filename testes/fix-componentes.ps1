# Script PowerShell para instalar componentes faltando

Write-Host "===================================" -ForegroundColor Cyan
Write-Host " INSTALANDO COMPONENTES SHADCN/UI" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Voltar para o diretório raiz
Set-Location ..

# Lista de componentes que estão faltando
$componentes = @("checkbox", "badge", "table", "dropdown-menu", "scroll-area")

Write-Host "Instalando componentes faltando..." -ForegroundColor Yellow
Write-Host ""

foreach ($comp in $componentes) {
    Write-Host "[$($componentes.IndexOf($comp) + 1)/$($componentes.Count)] Instalando $comp..." -ForegroundColor Green
    npx shadcn@latest add $comp --yes
    Write-Host ""
}

Write-Host "===================================" -ForegroundColor Cyan
Write-Host " COMPONENTES INSTALADOS!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Build funcionou!" -ForegroundColor Green
    Write-Host "Execute agora: .\2-commit-e-push.bat" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[ERRO] Ainda há erros no build." -ForegroundColor Red
    Write-Host "Verifique os erros acima." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")