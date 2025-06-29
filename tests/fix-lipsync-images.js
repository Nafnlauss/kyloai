// Script para remover lipSyncAvailable de modelos de imagem
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

// Função para remover lipSyncAvailable de modelos de imagem
function removeLipSyncFromImages(content) {
  // Encontrar blocos de modelos de imagem
  const lines = content.split('\n');
  let inImageModel = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detectar início de modelo de imagem
    if (line.includes("mediaType: 'image'")) {
      inImageModel = true;
      braceCount = 0;
      // Encontrar o início do bloco capabilities
      for (let j = i - 10; j < i + 10 && j < lines.length; j++) {
        if (lines[j].includes('capabilities: {')) {
          braceCount = 1;
          break;
        }
      }
    }
    
    // Se estamos em um modelo de imagem
    if (inImageModel) {
      // Contar chaves
      for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      
      // Remover lipSyncAvailable
      if (line.includes('lipSyncAvailable: true')) {
        lines[i] = ''; // Remover a linha
        // Se a linha anterior termina com vírgula, remover
        if (i > 0 && lines[i-1].trim().endsWith(',')) {
          lines[i-1] = lines[i-1].replace(/,\s*$/, '');
        }
      }
      
      // Fim do modelo
      if (braceCount === 0 && line.includes('}')) {
        inImageModel = false;
      }
    }
  }
  
  // Reconstruir o conteúdo removendo linhas vazias extras
  return lines.filter((line, i, arr) => {
    // Manter a linha se não for vazia ou se for importante para formatação
    return line !== '' || (i > 0 && arr[i-1].trim() !== '');
  }).join('\n');
}

// Aplicar correção
content = removeLipSyncFromImages(content);

// Salvar o arquivo
fs.writeFileSync(configPath, content);

console.log('✅ Removido lipSyncAvailable de modelos de imagem');