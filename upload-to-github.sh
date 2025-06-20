#!/bin/bash

# Script para fazer upload do projeto KyloAI para o GitHub

echo "🚀 Uploading KyloAI to GitHub..."

# Verifica se já tem remote configurado
if git remote | grep -q "origin"; then
    echo "Remote origin já existe, removendo..."
    git remote remove origin
fi

# Adiciona o remote
git remote add origin https://github.com/Nafnlauss/kyloai.git

# Faz o push
echo "📤 Fazendo push para o GitHub..."
git push -u origin main

echo "✅ Upload concluído!"
echo "🔗 Acesse seu projeto em: https://github.com/Nafnlauss/kyloai"