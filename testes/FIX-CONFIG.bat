@echo off
echo ===================================
echo  VERIFICANDO CONFIGURACAO VERCEL
echo ===================================
echo.
cd ..

echo [1] Criando vercel.json otimizado...
echo {^
  "buildCommand": "npm run build",^
  "outputDirectory": ".next",^
  "framework": "nextjs",^
  "installCommand": "npm install",^
  "env": {^
    "SKIP_ENV_VALIDATION": "true"^
  }^
} > vercel.json

echo.
echo [2] Fazendo deploy com nova config...
echo.
vercel --prod

echo.
pause