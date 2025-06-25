#!/bin/bash

echo "🚀 Iniciando servidor de desenvolvimento..."
echo ""
echo "📌 Endereços para acessar:"
echo "   http://localhost:3001"
echo "   http://172.17.171.32:3001"
echo ""
echo "💡 Se não funcionar no Windows:"
echo "   1. Execute no PowerShell como Admin:"
echo "      netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=172.17.171.32"
echo ""
echo "   2. Ou desative temporariamente o Windows Defender Firewall"
echo ""
echo "   3. Ou execute o projeto diretamente no Windows (não no WSL)"
echo ""

# Start the development server
NEXTAUTH_URL=http://localhost:3001 npm run dev:3001