@echo off
echo ========================================
echo Clean Installation Script for Kylo
echo ========================================
echo.

echo [1/5] Cleaning old files...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist .next (
    echo Removing .next...
    rmdir /s /q .next 2>nul
)
if exist pnpm-lock.yaml del /f pnpm-lock.yaml 2>nul
if exist package-lock.json del /f package-lock.json 2>nul
if exist yarn.lock del /f yarn.lock 2>nul

echo.
echo [2/5] Clearing npm cache...
call npm cache clean --force

echo.
echo [3/5] Installing dependencies (this may take a few minutes)...
call npm install --legacy-peer-deps

echo.
echo [4/5] Generating Prisma client...
call npx prisma generate

echo.
echo [5/5] Installation complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo If you still have issues:
echo   1. Make sure you're using Node.js 18 or later
echo   2. Try running this script as Administrator
echo   3. Check the FIX_NEXT_ERROR.md file for more solutions
echo.
pause