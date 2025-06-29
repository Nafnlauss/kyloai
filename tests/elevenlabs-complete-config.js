/**
 * Configuração completa do ElevenLabs com todas as vozes disponíveis
 * Baseado na API oficial do ElevenLabs
 */

// Todas as vozes disponíveis no ElevenLabs com IDs reais
const ELEVENLABS_ALL_VOICES = [
  // Vozes principais (disponíveis em todos os planos)
  { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
  { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
  { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
  { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
  { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
  { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
  { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
  { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
  { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
  { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
  { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
  { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
  { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
  { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
  { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
  { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
  { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
  { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
  { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
  { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
  { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
  { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
  { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
  { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
  { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
  { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
  { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
  { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
  { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
  { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
  { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
  { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
  { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
  { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
  { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
  { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
  { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
  { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
  { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
  { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
  { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
  { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
  { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
];

// Configurações por modelo
const AUDIO_CAPABILITIES_CONFIG = {
  // Modelo V3 - Suporta todos os 29 idiomas como multilingual v2
  'elevenlabs-v3': {
    voices: ELEVENLABS_ALL_VOICES,
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
  },

  // English V1 - Apenas inglês
  'elevenlabs-english-v1': {
    voices: ELEVENLABS_ALL_VOICES,
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },

  // Multilingual V1 - 18 idiomas
  'elevenlabs-multilingual-v1': {
    voices: ELEVENLABS_ALL_VOICES,
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

  // Multilingual V2 - 29 idiomas
  'elevenlabs-multilingual-v2': {
    voices: ELEVENLABS_ALL_VOICES,
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
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_22050', label: 'PCM (22kHz)' },
      { value: 'pcm_24000', label: 'PCM (24kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
    ]
  },

  // Turbo V2 - 8 idiomas
  'elevenlabs-turbo-v2': {
    voices: ELEVENLABS_ALL_VOICES,
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

  // Turbo V2.5 - 9 idiomas (inclui árabe)
  'elevenlabs-turbo-v2.5': {
    voices: ELEVENLABS_ALL_VOICES,
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

  // Flash - Apenas inglês
  'elevenlabs-flash': {
    voices: ELEVENLABS_ALL_VOICES.slice(0, 10), // Flash tem menos vozes disponíveis
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  },

  // Flash V2.5 - Apenas inglês
  'elevenlabs-flash-v2.5': {
    voices: ELEVENLABS_ALL_VOICES.slice(0, 10), // Flash tem menos vozes disponíveis
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  }
};

// Exportar configuração
module.exports = {
  ELEVENLABS_ALL_VOICES,
  AUDIO_CAPABILITIES_CONFIG
};

// Imprimir resumo
console.log('=== Configuração Completa do ElevenLabs ===\n');
console.log(`Total de vozes disponíveis: ${ELEVENLABS_ALL_VOICES.length}`);
console.log('\nModelos e idiomas suportados:');
console.log('- V3: 29 idiomas (multilingual completo)');
console.log('- Multilingual V2: 29 idiomas');
console.log('- Multilingual V1: 18 idiomas');
console.log('- Turbo V2.5: 9 idiomas (inclui árabe)');
console.log('- Turbo V2: 8 idiomas');
console.log('- English V1: Apenas inglês');
console.log('- Flash & Flash V2.5: Apenas inglês');
console.log('\nVozes disponíveis para todos os modelos (exceto Flash que tem limitação)');