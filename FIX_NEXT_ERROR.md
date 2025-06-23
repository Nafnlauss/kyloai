# Fix for "next-flight-client-entry-loader" Error

This error occurs when Next.js isn't properly installed or there's a version mismatch.

## Quick Fix (Windows)

### Option 1: Use the fix script
1. Open PowerShell as Administrator
2. Navigate to project: `cd F:\site-ia\ai-video-hub`
3. Run: `.\fix-windows.ps1`

If you get execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\fix-windows.ps1
```

### Option 2: Manual fix
1. Open Command Prompt as Administrator
2. Navigate to project: `cd F:\site-ia\ai-video-hub`
3. Run these commands:
```cmd
rmdir /s /q node_modules
rmdir /s /q .next
del pnpm-lock.yaml
npm cache clean --force
npm install --legacy-peer-deps
npm run dev
```

## For WSL Users

If you're using WSL and getting this error, switch to Windows:
1. Close WSL terminal
2. Open Windows PowerShell or Command Prompt
3. Navigate to the Windows path: `cd F:\site-ia\ai-video-hub`
4. Run the fix script or manual commands above

## Alternative Solutions

### Use Yarn
```bash
rm -rf node_modules pnpm-lock.yaml
yarn install
yarn dev
```

### Downgrade Next.js
Edit `package.json` and change:
```json
"next": "15.3.4" → "next": "14.2.5"
```
Then reinstall.

## Deploy to Railway

The good news is that this is a local development issue. Railway deployment should work fine because:
1. Railway uses a clean Linux environment
2. Dependencies are installed fresh
3. No WSL permission issues

Just push your code and Railway will handle the build correctly.

## Still Having Issues?

1. Make sure you're using Node.js 18+ or 20+
2. Disable Windows Defender temporarily during installation
3. Run everything as Administrator
4. Consider using Docker for development