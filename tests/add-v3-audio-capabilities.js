/**
 * Script para adicionar AUDIO_CAPABILITIES do elevenlabs-v3
 * O modelo v3 suporta os mesmos 29 idiomas que o multilingual v2
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
const content = fs.readFileSync(configPath, 'utf8');

// Configuração do elevenlabs-v3 para adicionar
const v3Config = `  'elevenlabs-v3': {
    voices: [
      { value: 'rachel', label: 'Rachel' },
      { value: 'domi', label: 'Domi' },
      { value: 'bella', label: 'Bella' },
      { value: 'antoni', label: 'Antoni' },
      { value: 'elli', label: 'Elli' },
      { value: 'josh', label: 'Josh' },
      { value: 'arnold', label: 'Arnold' },
      { value: 'adam', label: 'Adam' },
      { value: 'sam', label: 'Sam' },
      { value: 'sarah', label: 'Sarah' },
      { value: 'laura', label: 'Laura' },
      { value: 'charlie', label: 'Charlie' },
      { value: 'george', label: 'George' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'zh', label: 'Chinese' },
      { value: 'hr', label: 'Croatian' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'nl', label: 'Dutch' },
      { value: 'fil', label: 'Filipino' },
      { value: 'fi', label: 'Finnish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'el', label: 'Greek' },
      { value: 'hi', label: 'Hindi' },
      { value: 'id', label: 'Indonesian' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'ms', label: 'Malay' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ro', label: 'Romanian' },
      { value: 'ru', label: 'Russian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'es', label: 'Spanish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'ta', label: 'Tamil' },
      { value: 'tr', label: 'Turkish' },
      { value: 'uk', label: 'Ukrainian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },`;

// Encontrar onde inserir a configuração do v3
const audioCapabilitiesIndex = content.indexOf('export const AUDIO_CAPABILITIES = {');
const elevenLabsModelsIndex = content.indexOf("  // ElevenLabs models", audioCapabilitiesIndex);
const turboV2Index = content.indexOf("  'elevenlabs-turbo-v2': {", elevenLabsModelsIndex);

if (audioCapabilitiesIndex === -1 || elevenLabsModelsIndex === -1 || turboV2Index === -1) {
  console.error('Não foi possível encontrar a seção AUDIO_CAPABILITIES');
  process.exit(1);
}

// Verificar se já existe configuração para v3
if (content.includes("'elevenlabs-v3': {")) {
  console.log('Configuração para elevenlabs-v3 já existe em AUDIO_CAPABILITIES');
  process.exit(0);
}

// Inserir antes do elevenlabs-turbo-v2
const beforeTurbo = content.substring(0, turboV2Index);
const fromTurbo = content.substring(turboV2Index);

const updatedContent = beforeTurbo + v3Config + '\n' + fromTurbo;

// Salvar o arquivo
fs.writeFileSync(configPath, updatedContent);

console.log('✅ Configuração do elevenlabs-v3 adicionada com sucesso!');
console.log('   - 13 vozes disponíveis');
console.log('   - 29 idiomas suportados (mesmo que multilingual v2)');
console.log('   - 2 formatos de áudio (MP3 128kbps e 192kbps)');