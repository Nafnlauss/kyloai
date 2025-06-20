# ADICIONAR VARIAVEIS NO VERCEL VIA CLI

Write-Host "===================================`n ADICIONANDO VARIAVEIS VIA CLI`n===================================" -ForegroundColor Cyan

cd ..

# Lista de variaveis essenciais
$vars = @{
    "DATABASE_URL" = "postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@db.snfxczgjpnydscclgps.supabase.co:5432/postgres"
    "DIRECT_URL" = "postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@db.snfxczgjpnydscclgps.supabase.co:5432/postgres"
    "NEXTAUTH_SECRET" = "xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi="
    "NEXTAUTH_URL" = "https://kyloai.vercel.app"
    "NEXT_PUBLIC_APP_URL" = "https://kyloai.vercel.app"
}

# Adicionar cada variavel
foreach ($key in $vars.Keys) {
    Write-Host "`nAdicionando $key..." -ForegroundColor Yellow
    $value = $vars[$key]
    
    # Criar arquivo temporario
    $value | Out-File -FilePath "temp.txt" -Encoding ASCII -NoNewline
    
    # Adicionar variavel
    & vercel env add $key production < temp.txt
    
    # Remover arquivo temporario
    Remove-Item "temp.txt"
}

Write-Host "`n[OK] Variaveis adicionadas!" -ForegroundColor Green
Write-Host "`nFazendo deploy..." -ForegroundColor Cyan

# Deploy
vercel --prod

pause