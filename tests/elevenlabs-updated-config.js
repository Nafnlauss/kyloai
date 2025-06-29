/**
 * Configuração atualizada do ElevenLabs com todos os 29 idiomas suportados
 * Baseado na documentação oficial do ElevenLabs multilingual v2
 */

// Lista completa de idiomas suportados pelo eleven_multilingual_v2
const ELEVENLABS_MULTILINGUAL_V2_LANGUAGES = [
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
];

// Atualização para AUDIO_CAPABILITIES
const UPDATED_AUDIO_CAPABILITIES = {
  // ElevenLabs models
  'elevenlabs-turbo-v2': {
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
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'pl', label: 'Polish' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'fr', label: 'French' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'hi', label: 'Hindi' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-multilingual-v2': {
    voices: [
      // Vozes padrão disponíveis
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
      { value: 'george', label: 'George' },
      { value: 'callum', label: 'Callum' },
      { value: 'charlotte', label: 'Charlotte' },
      { value: 'alice', label: 'Alice' },
      { value: 'matilda', label: 'Matilda' },
      { value: 'will', label: 'Will' },
      { value: 'jessica', label: 'Jessica' },
      { value: 'eric', label: 'Eric' },
      { value: 'chris', label: 'Chris' },
      { value: 'brian', label: 'Brian' }
    ],
    languages: ELEVENLABS_MULTILINGUAL_V2_LANGUAGES,
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_22050', label: 'PCM (22kHz)' },
      { value: 'pcm_24000', label: 'PCM (24kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
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
      { value: 'sam', label: 'Sam' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ja', label: 'Japanese' },
      { value: 'zh', label: 'Chinese' },
      { value: 'de', label: 'German' },
      { value: 'hi', label: 'Hindi' },
      { value: 'fr', label: 'French' },
      { value: 'ko', label: 'Korean' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'it', label: 'Italian' },
      { value: 'es', label: 'Spanish' },
      { value: 'id', label: 'Indonesian' },
      { value: 'nl', label: 'Dutch' },
      { value: 'tr', label: 'Turkish' },
      { value: 'pl', label: 'Polish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'fil', label: 'Filipino' },
      { value: 'ms', label: 'Malay' },
      { value: 'ro', label: 'Romanian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-v3': {
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
    languages: ELEVENLABS_MULTILINGUAL_V2_LANGUAGES, // V3 suporta os mesmos idiomas que multilingual v2
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-english-v1': {
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
      { value: 'en', label: 'English' } // Apenas inglês
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-turbo-v2.5': {
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
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'pl', label: 'Polish' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'fr', label: 'French' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'hi', label: 'Hindi' },
      { value: 'ar', label: 'Arabic' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-flash': {
    voices: [
      { value: 'rachel', label: 'Rachel' },
      { value: 'domi', label: 'Domi' },
      { value: 'bella', label: 'Bella' },
      { value: 'antoni', label: 'Antoni' },
      { value: 'elli', label: 'Elli' }
    ],
    languages: [
      { value: 'en', label: 'English' } // Flash é apenas inglês
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  },
  'elevenlabs-flash-v2.5': {
    voices: [
      { value: 'rachel', label: 'Rachel' },
      { value: 'domi', label: 'Domi' },
      { value: 'bella', label: 'Bella' },
      { value: 'antoni', label: 'Antoni' },
      { value: 'elli', label: 'Elli' }
    ],
    languages: [
      { value: 'en', label: 'English' } // Flash v2.5 também é apenas inglês
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  }
};

// Exportar configuração
module.exports = {
  ELEVENLABS_MULTILINGUAL_V2_LANGUAGES,
  UPDATED_AUDIO_CAPABILITIES
};

// Imprimir resumo
console.log('=== Configuração Atualizada do ElevenLabs ===\n');
console.log('Multilingual V2: 29 idiomas suportados');
console.log('V3: 29 idiomas suportados (mesmo que multilingual v2)');
console.log('Multilingual V1: 18 idiomas');
console.log('Turbo V2.5: 9 idiomas (inclui árabe)');
console.log('Turbo V2: 8 idiomas');
console.log('English V1: Apenas inglês');
console.log('Flash & Flash V2.5: Apenas inglês\n');

console.log('Idiomas adicionados ao Multilingual V2:');
console.log('- Arabic, Bulgarian, Croatian, Czech, Danish');
console.log('- Finnish, Greek, Russian, Slovak, Tamil, Ukrainian\n');

console.log('Para aplicar a atualização, substitua a seção AUDIO_CAPABILITIES no arquivo all-models-config.ts');