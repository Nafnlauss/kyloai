# Script PowerShell para corrigir problemas de rede do WSL
# Execute como administrador no PowerShell do Windows

Write-Host "Corrigindo problemas de rede do WSL..." -ForegroundColor Yellow

# Reinicia o WSL
Write-Host "1. Reiniciando WSL..." -ForegroundColor Cyan
wsl --shutdown

Start-Sleep -Seconds 2

# Limpa cache DNS do Windows
Write-Host "2. Limpando cache DNS..." -ForegroundColor Cyan
ipconfig /flushdns

# Reinicia o serviço de rede
Write-Host "3. Reiniciando serviços de rede..." -ForegroundColor Cyan
netsh winsock reset
netsh int ip reset

Write-Host "`nConcluído! Tente acessar o WSL novamente." -ForegroundColor Green
Write-Host "Se o problema persistir, execute:" -ForegroundColor Yellow
Write-Host "  1. No WSL: sudo nano /etc/resolv.conf"
Write-Host "  2. Adicione: nameserver 8.8.8.8"
Write-Host "  3. Salve e teste novamente"