# Script PowerShell para diagnosticar e resolver problemas com Git/Vercel
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Diagnóstico e Solução Git/Vercel" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
Set-Location "F:\site-ia\ai-video-hub"
Write-Host "📁 Diretório: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git instalado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não está instalado ou não está no PATH" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Verificar configuração do usuário Git
Write-Host "👤 Configuração do usuário Git:" -ForegroundColor Yellow
$gitName = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrWhiteSpace($gitName)) {
    Write-Host "⚠️  Nome não configurado. Configurando..." -ForegroundColor Yellow
    git config user.name "Seu Nome"
    Write-Host "   Use: git config user.name 'Seu Nome Real'" -ForegroundColor Cyan
} else {
    Write-Host "   Nome: $gitName" -ForegroundColor Green
}

if ([string]::IsNullOrWhiteSpace($gitEmail)) {
    Write-Host "⚠️  Email não configurado. Configurando..." -ForegroundColor Yellow
    git config user.email "seu-email@example.com"
    Write-Host "   Use: git config user.email 'seu-email-real@example.com'" -ForegroundColor Cyan
} else {
    Write-Host "   Email: $gitEmail" -ForegroundColor Green
}
Write-Host ""

# Status do repositório
Write-Host "📊 Status do repositório:" -ForegroundColor Yellow
git status
Write-Host ""

# Verificar branch atual
$currentBranch = git branch --show-current
Write-Host "🌿 Branch atual: $currentBranch" -ForegroundColor Yellow
Write-Host ""

# Verificar remotes
Write-Host "🔗 Remotes configurados:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Adicionar arquivos
Write-Host "➕ Adicionando arquivos..." -ForegroundColor Yellow
git add .
$addStatus = $LASTEXITCODE
if ($addStatus -eq 0) {
    Write-Host "✅ Arquivos adicionados com sucesso" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao adicionar arquivos" -ForegroundColor Red
}
Write-Host ""

# Verificar se há mudanças para commit
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "⚠️  Não há mudanças para commit" -ForegroundColor Yellow
    Write-Host "   Opções:" -ForegroundColor Cyan
    Write-Host "   1. Faça alguma alteração no código" -ForegroundColor White
    Write-Host "   2. Use: git commit --allow-empty -m 'Deploy para Vercel'" -ForegroundColor White
} else {
    Write-Host "📝 Mudanças detectadas. Tentando commit..." -ForegroundColor Yellow
    git commit -m "Update: deploy para Vercel $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Commit realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erro ao fazer commit" -ForegroundColor Red
    }
}
Write-Host ""

# Verificar arquivos grandes
Write-Host "📦 Verificando arquivos grandes (>10MB):" -ForegroundColor Yellow
$largeFiles = @()
git ls-files | ForEach-Object {
    if (Test-Path $_) {
        $size = (Get-Item $_).Length / 1MB
        if ($size -gt 10) {
            $largeFiles += [PSCustomObject]@{
                File = $_
                SizeMB = [math]::Round($size, 2)
            }
        }
    }
}

if ($largeFiles.Count -gt 0) {
    Write-Host "⚠️  Arquivos grandes encontrados:" -ForegroundColor Yellow
    $largeFiles | Format-Table -AutoSize
    Write-Host "   Considere adicionar ao .gitignore ou usar Git LFS" -ForegroundColor Cyan
} else {
    Write-Host "✅ Nenhum arquivo grande encontrado" -ForegroundColor Green
}
Write-Host ""

# Verificar configuração Vercel
Write-Host "🚀 Verificando configuração Vercel:" -ForegroundColor Yellow
if (Test-Path ".vercel\project.json") {
    Write-Host "✅ Projeto Vercel configurado" -ForegroundColor Green
    $vercelConfig = Get-Content ".vercel\project.json" | ConvertFrom-Json
    Write-Host "   Project ID: $($vercelConfig.projectId)" -ForegroundColor White
    Write-Host "   Org ID: $($vercelConfig.orgId)" -ForegroundColor White
} else {
    Write-Host "⚠️  Projeto Vercel não configurado localmente" -ForegroundColor Yellow
    Write-Host "   Execute: vercel" -ForegroundColor Cyan
}
Write-Host ""

# Comandos úteis
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Comandos Úteis" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Para configurar Git:" -ForegroundColor Yellow
Write-Host "   git config user.name 'Seu Nome'" -ForegroundColor White
Write-Host "   git config user.email 'seu-email@example.com'" -ForegroundColor White
Write-Host ""
Write-Host "📤 Para fazer push:" -ForegroundColor Yellow
Write-Host "   git push origin $currentBranch" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Para deploy no Vercel:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host "   vercel --force" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Para sincronizar com Vercel:" -ForegroundColor Yellow
Write-Host "   git pull origin $currentBranch" -ForegroundColor White
Write-Host "   git push origin $currentBranch" -ForegroundColor White
Write-Host ""

# Aguardar entrada do usuário
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
