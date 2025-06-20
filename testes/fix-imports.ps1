# Script PowerShell para corrigir imports do next-auth

Write-Host "Corrigindo imports do next-auth..." -ForegroundColor Yellow
Write-Host ""

$files = @(
    "src/app/api/admin/videos/[videoId]/reprocess/route.ts",
    "src/app/api/admin/videos/[videoId]/route.ts",
    "src/app/api/admin/videos/route.ts",
    "src/app/api/admin/videos/stats/route.ts",
    "src/app/api/stripe/checkout-credits/route.ts",
    "src/app/api/stripe/checkout/route.ts",
    "src/app/api/stripe/portal/route.ts",
    "src/app/api/user/dashboard/route.ts",
    "src/app/api/videos/[id]/route.ts",
    "src/app/api/videos/[id]/status/route.ts",
    "src/app/api/videos/generate/route.ts",
    "src/app/api/videos/route.ts",
    "src/lib/auth/admin-guard.ts"
)

Set-Location ..

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "import { getServerSession } from 'next-auth'") {
            $content -replace "import { getServerSession } from 'next-auth'", "import { getServerSession } from 'next-auth/next'" | Set-Content $file -NoNewline
            Write-Host "[OK] $file" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Imports corrigidos! Testando build..." -ForegroundColor Cyan
Write-Host ""

npm run build