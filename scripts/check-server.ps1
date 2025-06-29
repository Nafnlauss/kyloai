# Script para verificar se o servidor está rodando corretamente
Write-Host "Verificando servidor Kylo..." -ForegroundColor Yellow
Write-Host ""

# Testa a porta 3000
$testConnection = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue

if ($testConnection.TcpTestSucceeded) {
    Write-Host "Porta 3000: OK - Servidor está rodando" -ForegroundColor Green
    
    # Testa a rota de health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "API Health: OK" -ForegroundColor Green
        } else {
            Write-Host "API Health: Erro - Status $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "API Health: Erro - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Porta 3000: FECHADA - Servidor não está rodando" -ForegroundColor Red
    Write-Host ""
    Write-Host "Execute o comando abaixo para iniciar:" -ForegroundColor Yellow
    Write-Host "npm run dev" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Testando acesso ao arquivo HTML..." -ForegroundColor Yellow
$htmlPath = "F:\site-ia\ai-video-hub\tests\test-auth-complete.html"
if (Test-Path $htmlPath) {
    Write-Host "Arquivo de teste: OK" -ForegroundColor Green
    Write-Host "Caminho: $htmlPath" -ForegroundColor Gray
} else {
    Write-Host "Arquivo de teste: NAO ENCONTRADO" -ForegroundColor Red
}