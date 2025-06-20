@echo off
echo ===================================
echo  TENTANDO DEPLOY NOVAMENTE
echo ===================================
echo.
echo [1] Limpando cache do Vercel...
rmdir /s /q .vercel
echo.
echo [2] Criando novo vercel.json...
echo {^
  "buildCommand": "npm install && npx prisma generate && npm run build",^
  "outputDirectory": ".next",^
  "framework": "nextjs",^
  "installCommand": "npm install --legacy-peer-deps",^
  "env": {^
    "SKIP_ENV_VALIDATION": "true",^
    "NODE_ENV": "production"^
  }^
} > vercel.json
echo.
echo [3] Fazendo novo deploy...
vercel --prod --yes
echo.
pause