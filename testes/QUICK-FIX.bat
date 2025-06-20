@echo off
cd ..

REM Instala os componentes que ja sabemos que estao faltando
npx shadcn@latest add checkbox badge table dropdown-menu scroll-area skeleton progress alert-dialog --yes

REM Testa o build
npm run build

pause