// Script para corrigir especificamente a estrutura de AUDIO_CAPABILITIES
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Corrigindo estrutura de AUDIO_CAPABILITIES...');

// Encontrar a seção AUDIO_CAPABILITIES
const audioCapStart = content.indexOf('export const AUDIO_CAPABILITIES = {');
const audioCapEnd = content.indexOf('} as const', audioCapStart) + '} as const'.length;

if (audioCapStart === -1 || audioCapEnd === -1) {
  console.error('❌ Não foi possível encontrar AUDIO_CAPABILITIES');
  process.exit(1);
}

// Extrair a seção AUDIO_CAPABILITIES
let audioCapSection = content.substring(audioCapStart, audioCapEnd);

// Função para corrigir estrutura de cada modelo
function fixModelStructure(modelSection) {
  // Remover fechamentos extras de arrays
  modelSection = modelSection.replace(/\]\s*\]/g, ']');
  
  // Garantir que cada array está corretamente fechado
  const lines = modelSection.split('\n');
  const fixedLines = [];
  let inVoices = false;
  let inLanguages = false;
  let inFormats = false;
  let bracketCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Detectar início das seções
    if (line.includes('voices:')) inVoices = true;
    if (line.includes('languages:')) {
      inVoices = false;
      inLanguages = true;
    }
    if (line.includes('formats:')) {
      inLanguages = false;
      inFormats = true;
    }
    
    // Contar brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    bracketCount += openBrackets - closeBrackets;
    
    // Se estamos no final de uma seção e há brackets abertos
    if (bracketCount > 0 && i < lines.length - 1) {
      const nextLine = lines[i + 1];
      if (nextLine && (nextLine.includes('languages:') || nextLine.includes('formats:') || nextLine.includes('},') || nextLine.includes("':"))) {
        // Adicionar fechamento do array
        fixedLines.push(line);
        fixedLines.push('    ],');
        bracketCount--;
        continue;
      }
    }
    
    fixedLines.push(line);
  }
  
  return fixedLines.join('\n');
}

// Processar cada modelo individualmente
const modelPattern = /'[^']+': \{[\s\S]*?\},?/g;
let fixedAudioCap = audioCapSection.replace(modelPattern, (match) => {
  return fixModelStructure(match);
});

// Garantir estrutura correta
fixedAudioCap = fixedAudioCap.replace(/,\s*,/g, ',');
fixedAudioCap = fixedAudioCap.replace(/,\s*\}/g, '}');
fixedAudioCap = fixedAudioCap.replace(/\]\s*\]/g, ']');

// Substituir no conteúdo original
content = content.substring(0, audioCapStart) + fixedAudioCap + content.substring(audioCapEnd);

// Salvar
fs.writeFileSync(configPath, content);

console.log('✅ Estrutura de AUDIO_CAPABILITIES corrigida!');