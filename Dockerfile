# Simple Dockerfile for Railway
FROM node:20-alpine

# Install OpenSSL 1.1 for Prisma compatibility
RUN apk add --no-cache openssl1.1-compat

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
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV NEXTAUTH_SECRET="build-time-secret"
ENV NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="example-key"

RUN npm run build

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application with Next.js
CMD ["node_modules/.bin/next", "start"]