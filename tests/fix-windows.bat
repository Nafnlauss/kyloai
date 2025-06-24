@echo off
echo Fixing Next.js installation on Windows...
echo.

echo Step 1: Cleaning old files...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

echo.
echo Step 2: Installing dependencies with npm...
call npm install

echo.
echo Step 3: Running development server...
call npm run dev

echo.
echo If you still have issues, try:
echo 1. Run this script as Administrator
echo 2. Disable antivirus temporarily
echo 3. Use npm instead of pnpm
pause