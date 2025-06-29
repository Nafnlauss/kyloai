#!/bin/bash

echo "🚀 Running Database and Auth Tests"
echo "================================="
echo ""

# Change to the ai-video-hub directory
cd /mnt/f/site-ia/ai-video-hub

# Test 1: Database Connection
echo "📊 Test 1: Database Connection"
echo "------------------------------"
npx tsx tests/test-database-connection.ts
echo ""
echo ""

# Test 2: Authentication Flow
echo "🔐 Test 2: Authentication Flow"
echo "------------------------------"
npx tsx tests/test-auth-flow.ts
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "📝 Summary:"
echo "- Check if database connection is working"
echo "- Verify if tables are created"
echo "- Test user registration flow"
echo "- Test Google OAuth configuration"
echo "- Check for any data inconsistencies"