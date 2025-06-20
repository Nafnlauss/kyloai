@echo off
echo ===================================
echo  REMOVER ERD GENERATOR (OPCIONAL)
echo ===================================
echo.

cd ..

echo O ERD generator pode causar problemas no Vercel.
echo Este script vai remove-lo temporariamente.
echo.

echo Criando backup do schema...
copy prisma\schema.prisma prisma\schema.prisma.backup

echo.
echo Removendo ERD generator...
powershell -Command "(Get-Content prisma\schema.prisma) | Where-Object {$_ -notmatch 'generator erd' -and $_ -notmatch 'provider.*prisma-erd-generator' -and $_ -notmatch 'output.*database-erd.svg'} | Set-Content prisma\schema.prisma"

echo.
echo [OK] ERD generator removido!
echo.
echo Para restaurar o backup depois:
echo copy prisma\schema.prisma.backup prisma\schema.prisma
echo.
pause