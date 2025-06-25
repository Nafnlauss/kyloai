# Teste direto da API de registro
Write-Host "Testando API de registro..." -ForegroundColor Yellow

$body = @{
    name = "Teste User"
    email = "teste@example.com"
    password = "Teste123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "SUCESSO:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "ERRO:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $result = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($result)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Detalhes:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}