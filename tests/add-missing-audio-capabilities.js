// Script para adicionar capabilities faltantes para modelos de áudio
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Adicionando capabilities para modelos de áudio faltantes...');

// Encontrar onde termina AUDIO_CAPABILITIES
const audioCapEndMatch = content.match(/export const AUDIO_CAPABILITIES = \{[\s\S]*?\n\} as const/);
if (!audioCapEndMatch) {
  console.error('❌ Não foi possível encontrar AUDIO_CAPABILITIES');
  process.exit(1);
}

// Capabilities para adicionar
const missingCapabilities = `  'elevenlabs-english-v1': {
    voices: [
      { value: 'rachel', label: 'Rachel' },
      { value: 'domi', label: 'Domi' },
      { value: 'bella', label: 'Bella' },
      { value: 'antoni', label: 'Antoni' },
      { value: 'elli', label: 'Elli' },
      { value: 'josh', label: 'Josh' },
      { value: 'arnold', label: 'Arnold' },
      { value: 'adam', label: 'Adam' },
      { value: 'sam', label: 'Sam' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-multilingual-v1': {
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
      { value: 'laura', label: 'Laura' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ru', label: 'Russian' },
      { value: 'nl', label: 'Dutch' },
      { value: 'tr', label: 'Turkish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'id', label: 'Indonesian' },
      { value: 'fil', label: 'Filipino' },
      { value: 'ja', label: 'Japanese' },
      { value: 'uk', label: 'Ukrainian' },
      { value: 'el', label: 'Greek' },
      { value: 'cs', label: 'Czech' },
      { value: 'fi', label: 'Finnish' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-v3': {
    voices: [
      { value: 'alice', label: 'Alice' },
      { value: 'brian', label: 'Brian' },
      { value: 'charlotte', label: 'Charlotte' },
      { value: 'daniel', label: 'Daniel' },
      { value: 'emma', label: 'Emma' },
      { value: 'frank', label: 'Frank' },
      { value: 'grace', label: 'Grace' },
      { value: 'henry', label: 'Henry' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
    ]
  },
  'elevenlabs-flash': {
    voices: [
      { value: 'emily', label: 'Emily' },
      { value: 'james', label: 'James' },
      { value: 'olivia', label: 'Olivia' },
      { value: 'william', label: 'William' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  },
  'elevenlabs-flash-v2.5': {
    voices: [
      { value: 'emily', label: 'Emily' },
      { value: 'james', label: 'James' },
      { value: 'olivia', label: 'Olivia' },
      { value: 'william', label: 'William' },
      { value: 'sophia', label: 'Sophia' },
      { value: 'michael', label: 'Michael' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },`;

// Inserir antes do fechamento de AUDIO_CAPABILITIES
const insertPosition = audioCapEndMatch.index + audioCapEndMatch[0].length - '} as const'.length;
const beforeInsert = content.substring(0, insertPosition);
const afterInsert = content.substring(insertPosition);

// Verificar se já tem vírgula antes
const needsComma = !beforeInsert.trim().endsWith(',');

content = beforeInsert + (needsComma ? ',\n' : '\n') + missingCapabilities + '\n' + afterInsert;

// Salvar
fs.writeFileSync(configPath, content);

console.log('✅ Adicionadas capabilities para modelos ElevenLabs faltantes');