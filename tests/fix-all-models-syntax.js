// Script para corrigir erros de sintaxe em all-models-config.ts
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

// Corrigir arrays de voices que não estão fechados corretamente
content = content.replace(/voices: \[\s*([^}]+?)\s*(?=],)/g, (match, voices) => {
  // Garantir que o array termina com ]
  const cleanedVoices = voices.trim();
  if (!cleanedVoices.endsWith(']')) {
    return `voices: [\n${cleanedVoices}\n    ]`;
  }
  return match;
});

// Corrigir arrays de languages que não estão fechados
content = content.replace(/languages: \[\s*([^}]+?)\s*(?=],)/g, (match, languages) => {
  const cleanedLanguages = languages.trim();
  if (!cleanedLanguages.endsWith(']')) {
    return `languages: [\n${cleanedLanguages}\n    ]`;
  }
  return match;
});

// Corrigir arrays de formats que não estão fechados
content = content.replace(/formats: \[\s*([^}]+?)\s*(?=])/g, (match, formats) => {
  const cleanedFormats = formats.trim();
  if (!cleanedFormats.endsWith(']')) {
    return `formats: [\n${cleanedFormats}\n    ]`;
  }
  return match;
});

// Garantir que não há "No newline at end of file"
content = content.replace(/\n*$/, '\n');

// Remover linha "No newline at end of file" se existir
content = content.replace(/^\s*\d+→\s*No newline at end of file\s*$/gm, '');

// Corrigir fechamento dos arrays em AUDIO_CAPABILITIES
// Encontrar blocos mal formatados e corrigir
const audioCapLines = content.split('\n');
let inAudioCap = false;
let inArray = false;
let arrayDepth = 0;
let fixedLines = [];

for (let i = 0; i < audioCapLines.length; i++) {
  let line = audioCapLines[i];
  
  // Detectar início de AUDIO_CAPABILITIES
  if (line.includes('export const AUDIO_CAPABILITIES = {')) {
    inAudioCap = true;
  }
  
  if (inAudioCap) {
    // Contar abertura/fechamento de arrays
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    arrayDepth += openBrackets - closeBrackets;
    
    // Se temos um array aberto sem fechamento adequado
    if (arrayDepth > 0 && line.trim() === '],') {
      arrayDepth--;
    } else if (arrayDepth > 0 && !line.includes(']') && (audioCapLines[i + 1] && audioCapLines[i + 1].trim().startsWith('languages:') || audioCapLines[i + 1] && audioCapLines[i + 1].trim().startsWith('formats:'))) {
      // Adicionar fechamento de array
      fixedLines.push(line);
      fixedLines.push('    ]');
      arrayDepth--;
      continue;
    }
  }
  
  // Terminar processamento de AUDIO_CAPABILITIES
  if (inAudioCap && line.includes('} as const')) {
    inAudioCap = false;
  }
  
  fixedLines.push(line);
}

content = fixedLines.join('\n');

// Salvar o arquivo
fs.writeFileSync(configPath, content);

console.log('✅ Sintaxe corrigida');