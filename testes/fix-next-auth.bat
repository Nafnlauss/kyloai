@echo off
cd ..

echo ===================================
echo  CORRIGINDO IMPORTS DO NEXT-AUTH
echo ===================================
echo.

echo O problema: getServerSession deve ser importado de 'next-auth/next' ao inves de 'next-auth'
echo.

echo Criando script para corrigir...
echo const fs = require('fs'); > fix-imports.js
echo const path = require('path'); >> fix-imports.js
echo. >> fix-imports.js
echo function fixImports(dir) { >> fix-imports.js
echo   const files = fs.readdirSync(dir); >> fix-imports.js
echo   files.forEach(file =^> { >> fix-imports.js
echo     const filePath = path.join(dir, file); >> fix-imports.js
echo     const stat = fs.statSync(filePath); >> fix-imports.js
echo     if (stat.isDirectory() ^&^& !filePath.includes('node_modules') ^&^& !filePath.includes('.next')) { >> fix-imports.js
echo       fixImports(filePath); >> fix-imports.js
echo     } else if (file.endsWith('.ts') ^|^| file.endsWith('.tsx')) { >> fix-imports.js
echo       let content = fs.readFileSync(filePath, 'utf8'); >> fix-imports.js
echo       const oldImport = "import { getServerSession } from 'next-auth'"; >> fix-imports.js
echo       const newImport = "import { getServerSession } from 'next-auth/next'"; >> fix-imports.js
echo       if (content.includes(oldImport)) { >> fix-imports.js
echo         content = content.replace(oldImport, newImport); >> fix-imports.js
echo         fs.writeFileSync(filePath, content); >> fix-imports.js
echo         console.log(`Fixed: ${filePath}`); >> fix-imports.js
echo       } >> fix-imports.js
echo     } >> fix-imports.js
echo   }); >> fix-imports.js
echo } >> fix-imports.js
echo. >> fix-imports.js
echo fixImports('./src'); >> fix-imports.js

echo.
echo Executando correcao...
node fix-imports.js

echo.
echo Removendo script temporario...
del fix-imports.js

echo.
echo [2] Testando build novamente...
npm run build

pause