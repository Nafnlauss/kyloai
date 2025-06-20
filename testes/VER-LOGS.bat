@echo off
echo ===================================
echo  VERIFICANDO LOGS DE ERRO
echo ===================================
echo.
cd ..
vercel logs kyloai-os4wau169-nafnlaus-projects.vercel.app --output raw -n 100
echo.
echo ===================================
echo.
echo Se o erro for sobre componentes faltando:
echo   Execute: .\instalar-mais-componentes.bat
echo.
echo Se o erro for sobre variaveis:
echo   Verifique no Vercel se todas estao configuradas
echo.
echo Se o erro for sobre TypeScript:
echo   Execute: .\fix-typescript.bat
echo.
pause