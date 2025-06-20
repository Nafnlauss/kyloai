@echo off
cd ..
echo Verificando logs do Vercel...
vercel logs kyloai-bvhpktubn-nafnlaus-projects.vercel.app > vercel-error.log 2>&1
type vercel-error.log
pause