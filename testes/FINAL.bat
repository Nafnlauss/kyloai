@echo off
cd ..
npx shadcn@latest add avatar --yes
npm install nodemailer @types/nodemailer
npm run build
pause