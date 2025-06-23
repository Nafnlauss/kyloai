# Script PowerShell para testar conexão e executar migrações

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "TESTANDO CONEXAO COM BANCO DE DADOS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Testando conexão..." -ForegroundColor White
node test-db-connection.js

Write-Host ""
Write-Host "======================================" -ForegroundColor Yellow
Write-Host "2. EXECUTANDO MIGRACOES DO PRISMA..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow
Write-Host ""

npx prisma migrate deploy

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "3. GERANDO CLIENTE PRISMA..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

npx prisma generate

Write-Host ""
Write-Host "======================================" -ForegroundColor Magenta
Write-Host "PROCESSO CONCLUIDO!" -ForegroundColor Magenta
Write-Host "======================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Para iniciar o servidor, execute: npm run dev" -ForegroundColor Cyan
Write-Host ""

# Pausa para ver os resultados
Read-Host -Prompt "Pressione Enter para continuar"
