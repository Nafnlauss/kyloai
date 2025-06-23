# Installation Fix for WSL/Windows Issues

## Problem
The project is experiencing issues with Next.js module resolution and file permissions in WSL.

## Solution

### Option 1: Clean Install on Windows (Recommended)
1. Open PowerShell or Command Prompt as Administrator
2. Navigate to your project: `cd F:\site-ia\ai-video-hub`
3. Delete node_modules and lock file:
   ```
   rmdir /s /q node_modules
   del pnpm-lock.yaml
   ```
4. Install dependencies:
   ```
   pnpm install
   ```
5. Run the development server:
   ```
   pnpm dev
   ```

### Option 2: Use npm instead of pnpm
1. Delete node_modules and lock files:
   ```bash
   rm -rf node_modules pnpm-lock.yaml package-lock.json yarn.lock
   ```
2. Install with npm:
   ```bash
   npm install
   ```
3. Run with npm:
   ```bash
   npm run dev
   ```

### Option 3: Docker Development
1. Create a `docker-compose.dev.yml`:
   ```yaml
   version: '3.8'
   services:
     app:
       image: node:20-alpine
       working_dir: /app
       volumes:
         - .:/app
       ports:
         - "3000:3000"
       command: sh -c "npm install && npm run dev"
   ```
2. Run: `docker-compose -f docker-compose.dev.yml up`

## Common Issues

### "next-flight-client-entry-loader" Error
This is typically caused by:
- Corrupted node_modules
- Version mismatch between Next.js and React
- File permission issues in WSL

### Binary file errors (.dll, .node)
These are Windows-specific binaries that may have permission issues in WSL.

## Deployment to Railway

The project should deploy correctly to Railway as it uses a Linux environment. Make sure:
1. All dependencies are in package.json
2. The build command is: `npm run build` or `pnpm build`
3. The start command is: `npm run start` or `pnpm start`

## Required Environment Variables
Ensure these are set in Railway:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- All other variables from .env.example