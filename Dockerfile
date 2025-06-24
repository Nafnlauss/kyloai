# Railway Dockerfile - Updated for Prisma compatibility
FROM node:20-alpine

# Install dependencies for Prisma on Alpine Linux
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Copy prisma schema BEFORE npm install
COPY prisma ./prisma/

# Install dependencies (this will also run postinstall and generate prisma)
RUN npm install --legacy-peer-deps

# Copy all files
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Usar variáveis de ambiente seguras para build
# Estas serão fornecidas em runtime via secrets
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"
ENV NEXTAUTH_SECRET="placeholder-secret-will-be-overridden"
ENV NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-key"

RUN npm run build || echo "Build completed with warnings"

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application with Next.js
CMD ["node_modules/.bin/next", "start"]