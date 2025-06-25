@echo off
echo Resetando Prisma e conexoes...
echo.

cd ..

echo 1. Parando processos Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo 2. Limpando cache do Prisma...
rmdir /s /q node_modules\.prisma 2>nul
del /q node_modules\@prisma\client\*.node 2>nul

echo.
echo 3. Regenerando Prisma Client...
call npx prisma generate

echo.
echo 4. Tentando db push novamente...
call npx prisma db push --force-reset --accept-data-loss

echo.
echo Processo concluido!
echo.
echo Agora reinicie o servidor com: npm run dev
pause