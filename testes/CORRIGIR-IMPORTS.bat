@echo off
cd ..

echo Corrigindo imports do next-auth...
echo.

REM Corrige cada arquivo individualmente
powershell -Command "(Get-Content 'src/app/api/admin/videos/[videoId]/reprocess/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/admin/videos/[videoId]/reprocess/route.ts'"
powershell -Command "(Get-Content 'src/app/api/admin/videos/[videoId]/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/admin/videos/[videoId]/route.ts'"
powershell -Command "(Get-Content 'src/app/api/admin/videos/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/admin/videos/route.ts'"
powershell -Command "(Get-Content 'src/app/api/admin/videos/stats/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/admin/videos/stats/route.ts'"
powershell -Command "(Get-Content 'src/app/api/stripe/checkout-credits/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/stripe/checkout-credits/route.ts'"
powershell -Command "(Get-Content 'src/app/api/stripe/checkout/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/stripe/checkout/route.ts'"
powershell -Command "(Get-Content 'src/app/api/stripe/portal/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/stripe/portal/route.ts'"
powershell -Command "(Get-Content 'src/app/api/user/dashboard/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/user/dashboard/route.ts'"
powershell -Command "(Get-Content 'src/app/api/videos/[id]/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/videos/[id]/route.ts'"
powershell -Command "(Get-Content 'src/app/api/videos/[id]/status/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/videos/[id]/status/route.ts'"
powershell -Command "(Get-Content 'src/app/api/videos/generate/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/videos/generate/route.ts'"
powershell -Command "(Get-Content 'src/app/api/videos/route.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/app/api/videos/route.ts'"
powershell -Command "(Get-Content 'src/lib/auth/admin-guard.ts' -Raw) -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content 'src/lib/auth/admin-guard.ts'"

echo.
echo [OK] Imports corrigidos!
echo.
echo Testando build...
npm run build

pause