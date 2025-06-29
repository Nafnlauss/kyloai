#!/bin/bash

echo "🔄 Parando processos Node.js existentes..."
pkill -f "next dev" || true
pkill -f "node" || true

echo "⏳ Aguardando 2 segundos..."
sleep 2

echo "🚀 Iniciando servidor de desenvolvimento..."
cd /mnt/f/site-ia/ai-video-hub
pnpm dev