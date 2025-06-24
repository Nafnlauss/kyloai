# Script para corrigir o banco de dados
Write-Host "Corrigindo banco de dados..." -ForegroundColor Yellow
Write-Host ""

# Navega para o diretorio do projeto
cd ..

Write-Host "1. Gerando cliente Prisma..." -ForegroundColor Cyan
npx prisma generate

Write-Host ""
Write-Host "2. Criando migracao..." -ForegroundColor Cyan
npx prisma migrate dev --name add_missing_columns --skip-seed

Write-Host ""
Write-Host "3. Status do banco:" -ForegroundColor Green
npx prisma migrate status

Write-Host ""
Write-Host "Banco de dados corrigido!" -ForegroundColor Green
Write-Host "Tente registrar novamente em: http://localhost:3000/test-auth.html" -ForegroundColor Yellow