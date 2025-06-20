@echo off
cd ..

echo ===================================
echo  DIAGNOSTICO DO PROBLEMA
echo ===================================
echo.

echo Problema: getServerSession esta sendo importado do lugar errado
echo.
echo Deve ser:
echo   import { getServerSession } from 'next-auth/next'
echo.
echo Ao inves de:
echo   import { getServerSession } from 'next-auth'
echo.

echo Arquivos afetados:
echo - src/app/api/admin/videos/[videoId]/reprocess/route.ts
echo - src/app/api/admin/videos/[videoId]/route.ts
echo - src/app/api/admin/videos/route.ts
echo - src/app/api/admin/videos/stats/route.ts
echo - src/app/api/stripe/checkout-credits/route.ts
echo - src/app/api/stripe/checkout/route.ts
echo - src/app/api/stripe/portal/route.ts
echo - src/app/api/user/dashboard/route.ts
echo - src/app/api/videos/[id]/route.ts
echo - src/app/api/videos/[id]/status/route.ts
echo - src/app/api/videos/generate/route.ts
echo - src/app/api/videos/route.ts
echo - src/lib/auth/admin-guard.ts
echo.

echo Opcoes:
echo 1. Corrigir automaticamente todos os arquivos
echo 2. Ver instrucoes para corrigir manualmente
echo 3. Pular e tentar build mesmo assim
echo.

set /p opcao="Escolha uma opcao (1-3): "

if "%opcao%"=="1" (
    echo.
    echo Corrigindo automaticamente...
    powershell -Command "$files = @('src/app/api/admin/videos/[videoId]/reprocess/route.ts','src/app/api/admin/videos/[videoId]/route.ts','src/app/api/admin/videos/route.ts','src/app/api/admin/videos/stats/route.ts','src/app/api/stripe/checkout-credits/route.ts','src/app/api/stripe/checkout/route.ts','src/app/api/stripe/portal/route.ts','src/app/api/user/dashboard/route.ts','src/app/api/videos/[id]/route.ts','src/app/api/videos/[id]/status/route.ts','src/app/api/videos/generate/route.ts','src/app/api/videos/route.ts','src/lib/auth/admin-guard.ts'); foreach ($file in $files) { if (Test-Path $file) { (Get-Content $file -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content $file; Write-Host \"Fixed: $file\" } }"
)

if "%opcao%"=="2" (
    echo.
    echo Para corrigir manualmente:
    echo 1. Abra cada arquivo listado acima
    echo 2. Encontre: import { getServerSession } from 'next-auth'
    echo 3. Substitua por: import { getServerSession } from 'next-auth/next'
    echo.
    pause
)

echo.
echo Testando build...
npm run build

pause