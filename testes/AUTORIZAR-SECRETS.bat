@echo off
echo ===================================
echo  ABRINDO LINKS PARA AUTORIZAR
echo ===================================
echo.

echo Abrindo 3 links no navegador...
echo Em cada um, clique em "Allow secret"
echo.

start https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2ylPEH23d6zoamnlC7pTcQSq3zJ
timeout /t 2 >nul
start https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2ylPEHXQ5kPTS3PksuW5MyUSB9a
timeout /t 2 >nul
start https://github.com/Nafnlauss/kyloai/security/secret-scanning/unblock-secret/2ylPEJSlPBJBXXFHrRG3Mju0ufj

echo.
echo Depois de autorizar TODOS os 3 secrets, pressione qualquer tecla...
pause >nul

cd ..
echo.
echo Tentando push novamente...
git push origin main

echo.
echo Se funcionou, agora execute: vercel --prod
echo.
pause