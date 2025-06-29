@echo off
echo Fixing Prisma Windows DLL issue...

:: Kill any Node processes that might be using the DLL
taskkill /F /IM node.exe 2>nul

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Try to delete the problematic file
del /f /q "node_modules\.prisma\client\query_engine-windows.dll.node" 2>nul

:: Remove the entire .prisma folder
rmdir /s /q "node_modules\.prisma" 2>nul

:: Remove node_modules if needed
echo Do you want to remove entire node_modules? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    rmdir /s /q node_modules
    echo Installing dependencies...
    npm install
) else (
    echo Regenerating Prisma client...
    npx prisma generate
)

echo Done! Try running 'pnpm dev' again.
pause