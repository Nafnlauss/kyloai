@echo off
echo Fixing Prisma permissions on Windows...

REM Kill any Node processes that might be using the files
taskkill /F /IM node.exe 2>nul

REM Try to remove the .prisma folder
rmdir /S /Q node_modules\.prisma 2>nul

REM If that fails, try to take ownership and remove
takeown /F node_modules\.prisma /R /D Y 2>nul
icacls node_modules\.prisma /grant %USERNAME%:F /T 2>nul
rmdir /S /Q node_modules\.prisma 2>nul

echo Done! Now try running: pnpm prisma generate