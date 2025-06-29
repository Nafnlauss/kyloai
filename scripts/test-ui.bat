@echo off
echo Testing AI Video Hub UI...
echo.

echo Starting server on port 3000...
start /b cmd /c "cd .. && pnpm dev"

echo Waiting for server to start...
timeout /t 15 /nobreak > nul

echo.
echo Opening browser at http://localhost:3000
start http://localhost:3000

echo.
echo Server is running. Press any key to stop...
pause > nul

echo.
echo Stopping server...
taskkill /f /im node.exe > nul 2>&1

echo Test completed.
pause