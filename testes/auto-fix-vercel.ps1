# Auto-fix script for Vercel deployment
Set-Location ..

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " AUTO-FIX VERCEL DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Get error logs
Write-Host "[1] Fetching error logs..." -ForegroundColor Yellow
$errorLog = vercel logs kyloai-bvhpktubn-nafnlaus-projects.vercel.app 2>&1 | Out-String

# 2. Check if build logs are available
if ($errorLog -like "*not ready*" -or $errorLog -like "*Error*") {
    Write-Host "[!] Build logs not ready, checking build output directly..." -ForegroundColor Red
    
    # Open Vercel dashboard to check logs
    Write-Host "Opening Vercel dashboard..." -ForegroundColor Yellow
    Start-Process "https://kyloai-bvhpktubn-nafnlaus-projects.vercel.app/_logs"
    
    Write-Host ""
    Write-Host "Common issues and solutions:" -ForegroundColor Cyan
    Write-Host "1. Missing environment variables" -ForegroundColor White
    Write-Host "2. Import errors (next-auth)" -ForegroundColor White
    Write-Host "3. TypeScript errors" -ForegroundColor White
    Write-Host ""
    
    # Check if environment variables are set
    Write-Host "[2] Listing required environment variables..." -ForegroundColor Yellow
    Write-Host "You need these in Vercel:" -ForegroundColor Green
    Write-Host "- DATABASE_URL" -ForegroundColor White
    Write-Host "- DIRECT_URL" -ForegroundColor White
    Write-Host "- NEXTAUTH_SECRET" -ForegroundColor White
    Write-Host "- NEXTAUTH_URL (set to: https://kyloai.vercel.app)" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_APP_URL (set to: https://kyloai.vercel.app)" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor White
    Write-Host "- NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor White
    Write-Host "- SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
    Write-Host ""
    
    $addVars = Read-Host "Do you need to add environment variables? (y/n)"
    if ($addVars -eq 'y') {
        Start-Process "https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables"
        Read-Host "Press ENTER after adding all variables..."
    }
}

# 3. Fix common issues
Write-Host "[3] Applying common fixes..." -ForegroundColor Yellow

# Fix next-auth imports
Write-Host "- Fixing next-auth imports..." -ForegroundColor Gray
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "from 'next-auth'") {
        $content -replace "from 'next-auth'", "from 'next-auth/next'" | Set-Content $_.FullName -NoNewline
        Write-Host "  Fixed: $($_.Name)" -ForegroundColor Green
    }
}

# Check if changes were made
$status = git status --porcelain
if ($status) {
    Write-Host "- Committing fixes..." -ForegroundColor Gray
    git add -A
    git commit -m "fix: auto-fix for Vercel deployment"
    git push
}

# 4. Retry deployment
Write-Host ""
Write-Host "[4] Retrying deployment..." -ForegroundColor Yellow
vercel --prod --yes

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host " AUTO-FIX COMPLETE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan