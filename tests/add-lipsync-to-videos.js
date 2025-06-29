// Script para adicionar lipSyncAvailable a todos os modelos de vídeo
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

// Regex para encontrar modelos de vídeo
const videoModelRegex = /mediaType:\s*'video'/g;

// Função para adicionar lipSyncAvailable após imageRef
function addLipSyncAvailable(content) {
  // Padrão 1: imageRef: true seguido de }
  content = content.replace(
    /(imageRef:\s*true)(\s*\})/g,
    '$1,\n        lipSyncAvailable: true$2'
  );
  
  // Padrão 2: quando já tem lipSync: true, adicionar lipSyncAvailable: true
  content = content.replace(
    /(lipSync:\s*true)(\s*\})/g,
    '$1,\n        lipSyncAvailable: true$2'
  );
  
  // Padrão 3: quando não tem imageRef mas tem outras capabilities
  content = content.replace(
    /(durations:\s*\[[^\]]+\])(\s*\},\s*credits)/g,
    function(match, p1, p2) {
      if (!match.includes('imageRef') && !match.includes('lipSyncAvailable')) {
        return p1 + ',\n        lipSyncAvailable: true' + p2;
      }
      return match;
    }
  );
  
  return content;
}

// Adicionar summary para alguns modelos principais
function addSummaries(content) {
  const summaries = {
    'luma-ray2-flash': 'Fast and affordable video generation with basic quality',
    'luma-ray2': 'Premium quality video generation with 4K support and advanced features',
    'luma-ray-1.6': 'Stable legacy model with proven results',
    'kling-1.0': 'Affordable video generation with good quality and natural motion',
    'kling-1.0-pro': 'Professional video generation with HD quality and extended durations',
    'kling-1.0-standard': 'Standard quality video generation for everyday use',
    'piapi-hailuo': 'Versatile video generation with good balance of quality and speed',
    'piapi-hunyuan': 'Tencent\'s advanced video model with excellent motion understanding',
    'piapi-omnihuman': 'Specialized in human video generation with lip-sync support',
    'newport-text-to-video': 'Convert text descriptions into engaging video content',
    'newport-image-to-video': 'Animate static images into dynamic videos',
    'bfl-flux1-pro': 'Professional image generation with ultra-high quality',
    'bfl-flux1-dev': 'Development-friendly image generation model',
    'elevenlabs-multilingual-v2': 'Advanced multilingual text-to-speech with natural voices',
    'piapi-suno-v3': 'Generate complete songs with vocals and instrumentals',
    'newport-do-tts-pro': 'Professional text-to-speech with multiple voice options'
  };
  
  for (const [modelId, summary] of Object.entries(summaries)) {
    const regex = new RegExp(`(id:\\s*'${modelId}'[^}]+credits:\\s*{[^}]+})`, 'g');
    content = content.replace(regex, (match) => {
      if (!match.includes('summary:')) {
        return match + `,\n      summary: '${summary}'`;
      }
      return match;
    });
  }
  
  return content;
}

// Aplicar transformações
content = addLipSyncAvailable(content);
content = addSummaries(content);

// Salvar o arquivo
fs.writeFileSync(configPath, content);

console.log('✅ Adicionado lipSyncAvailable a todos os modelos de vídeo');
console.log('✅ Adicionado summaries aos modelos principais');