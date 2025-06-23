# PowerShell script to fix Next.js installation issues
Write-Host "Fixing Next.js installation on Windows..." -ForegroundColor Green
Write-Host ""

# Step 1: Clean up
Write-Host "Step 1: Cleaning old files..." -ForegroundColor Yellow
$foldersToRemove = @("node_modules", ".next", ".pnpm-store")
$filesToRemove = @("pnpm-lock.yaml", "package-lock.json", "yarn.lock")

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Write-Host "Removing $folder..."
        Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "Removing $file..."
        Remove-Item -Path $file -Force -ErrorAction SilentlyContinue
    }
}

# Step 2: Clear npm cache
Write-Host ""
Write-Host "Step 2: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Step 3: Install dependencies
Write-Host ""
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Step 4: Generate Prisma client
Write-Host ""
Write-Host "Step 4: Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Step 5: Run dev server
Write-Host ""
Write-Host "Step 5: Starting development server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server"
npm run dev