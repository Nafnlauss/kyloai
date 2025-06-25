#!/bin/sh

# Railway Start Script
# This ensures environment variables are properly loaded

echo "Starting Kylo application..."
echo "NODE_ENV: $NODE_ENV"
echo "NEXTAUTH_URL configured: $([ -z "$NEXTAUTH_URL" ] && echo "NO" || echo "YES")"
echo "GOOGLE_CLIENT_ID configured: $([ -z "$GOOGLE_CLIENT_ID" ] && echo "NO" || echo "YES")"
echo "GOOGLE_CLIENT_SECRET configured: $([ -z "$GOOGLE_CLIENT_SECRET" ] && echo "NO" || echo "YES")"

# Export all Railway variables
export NEXTAUTH_URL="${NEXTAUTH_URL}"
export GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}"
export GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}"

# Start Next.js
exec node_modules/.bin/next start