@echo off
cd ..

echo ===================================
echo  RESOLVENDO ULTIMOS PROBLEMAS
echo ===================================
echo.

echo [1] Instalando componente avatar...
npx shadcn@latest add avatar --yes

echo.
echo [2] Instalando nodemailer...
npm install nodemailer
npm install --save-dev @types/nodemailer

echo.
echo [3] Testando build final...
npm run build

pause