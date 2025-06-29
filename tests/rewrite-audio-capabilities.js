// Script para reescrever completamente AUDIO_CAPABILITIES
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Reescrevendo AUDIO_CAPABILITIES...');

// Nova estrutura correta de AUDIO_CAPABILITIES
const newAudioCapabilities = `// Audio capabilities por modelo específico
export const AUDIO_CAPABILITIES = {
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
      { value: 'ro', label: 'Romanian' },
      { value: 'uk', label: 'Ukrainian' },
      { value: 'el', label: 'Greek' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'fi', label: 'Finnish' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'hr', label: 'Croatian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'ta', label: 'Tamil' }
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
      { value: 'en', label: 'English' }
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
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  },
  // PiAPI models
  'piapi-suno-v3': {
    voices: [
      { value: 'male-pop', label: 'Male Pop' },
      { value: 'female-pop', label: 'Female Pop' },
      { value: 'male-rock', label: 'Male Rock' },
      { value: 'female-rock', label: 'Female Rock' },
      { value: 'male-jazz', label: 'Male Jazz' },
      { value: 'female-jazz', label: 'Female Jazz' },
      { value: 'choir', label: 'Choir' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'zh', label: 'Chinese' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ru', label: 'Russian' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-diffrhythm': {
    voices: [
      { value: 'instrumental', label: 'Instrumental Only' }
    ],
    languages: [
      { value: 'none', label: 'No Language (Instrumental)' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-udio': {
    voices: [
      { value: 'auto', label: 'Auto-Select' },
      { value: 'male-vocal', label: 'Male Vocal' },
      { value: 'female-vocal', label: 'Female Vocal' },
      { value: 'duet', label: 'Duet' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-moshi': {
    voices: [
      { value: 'sarah', label: 'Sarah' },
      { value: 'michael', label: 'Michael' },
      { value: 'emily', label: 'Emily' },
      { value: 'kevin', label: 'Kevin' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' }
    ]
  },
  'piapi-f5-tts': {
    voices: [
      { value: 'voice1', label: 'Voice 1' },
      { value: 'voice2', label: 'Voice 2' },
      { value: 'voice3', label: 'Voice 3' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'zh', label: 'Chinese' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-mmaudio': {
    voices: [
      { value: 'descriptive', label: 'Descriptive Audio' }
    ],
    languages: [
      { value: 'none', label: 'No Language (Sound Effects)' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-ace-step-ai': {
    voices: [
      { value: 'instrumental', label: 'Instrumental' }
    ],
    languages: [
      { value: 'none', label: 'No Language (Music)' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' }
    ]
  },
  // Newport models
  'newport-do-tts-common': {
    voices: [
      { value: 'pt-BR-Francisca', label: 'Francisca' },
      { value: 'pt-BR-AntonioNeural', label: 'Antonio' },
      { value: 'pt-BR-BrendaNeural', label: 'Brenda' },
      { value: 'pt-BR-DonatoNeural', label: 'Donato' },
      { value: 'pt-BR-ElzaNeural', label: 'Elza' },
      { value: 'pt-BR-FabioNeural', label: 'Fabio' },
      { value: 'pt-BR-GiovannaNeural', label: 'Giovanna' },
      { value: 'pt-BR-HumbertoNeural', label: 'Humberto' },
      { value: 'pt-BR-JulioNeural', label: 'Julio' },
      { value: 'pt-BR-LeilaNeural', label: 'Leila' },
      { value: 'pt-BR-LeticiaNeural', label: 'Leticia' },
      { value: 'pt-BR-ManuelaNeural', label: 'Manuela' },
      { value: 'pt-BR-NicolauNeural', label: 'Nicolau' },
      { value: 'pt-BR-ThalitaNeural', label: 'Thalita' },
      { value: 'pt-BR-ValerioNeural', label: 'Valerio' },
      { value: 'pt-BR-YaraNeural', label: 'Yara' }
    ],
    languages: [
      { value: 'pt-BR', label: 'Portuguese (Brazil)' },
      { value: 'en-US', label: 'English (US)' },
      { value: 'es-ES', label: 'Spanish (Spain)' },
      { value: 'fr-FR', label: 'French' },
      { value: 'de-DE', label: 'German' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' }
    ]
  },
  'newport-do-tts-pro': {
    voices: [
      { value: 'pt-BR-Francisca', label: 'Francisca' },
      { value: 'pt-BR-AntonioNeural', label: 'Antonio' },
      { value: 'pt-BR-BrendaNeural', label: 'Brenda' },
      { value: 'pt-BR-DonatoNeural', label: 'Donato' },
      { value: 'pt-BR-ElzaNeural', label: 'Elza' },
      { value: 'pt-BR-FabioNeural', label: 'Fabio' },
      { value: 'pt-BR-GiovannaNeural', label: 'Giovanna' },
      { value: 'pt-BR-HumbertoNeural', label: 'Humberto' },
      { value: 'pt-BR-JulioNeural', label: 'Julio' },
      { value: 'pt-BR-LeilaNeural', label: 'Leila' },
      { value: 'pt-BR-LeticiaNeural', label: 'Leticia' },
      { value: 'pt-BR-ManuelaNeural', label: 'Manuela' },
      { value: 'pt-BR-NicolauNeural', label: 'Nicolau' },
      { value: 'pt-BR-ThalitaNeural', label: 'Thalita' },
      { value: 'pt-BR-ValerioNeural', label: 'Valerio' },
      { value: 'pt-BR-YaraNeural', label: 'Yara' },
      { value: 'en-US-JennyNeural', label: 'Jenny (US)' },
      { value: 'en-US-GuyNeural', label: 'Guy (US)' },
      { value: 'en-US-AriaNeural', label: 'Aria (US)' },
      { value: 'en-US-DavisNeural', label: 'Davis (US)' },
      { value: 'es-ES-ElviraNeural', label: 'Elvira (Spain)' },
      { value: 'es-ES-AlvaroNeural', label: 'Alvaro (Spain)' }
    ],
    languages: [
      { value: 'pt-BR', label: 'Portuguese (Brazil)' },
      { value: 'en-US', label: 'English (US)' },
      { value: 'en-GB', label: 'English (UK)' },
      { value: 'es-ES', label: 'Spanish (Spain)' },
      { value: 'es-MX', label: 'Spanish (Mexico)' },
      { value: 'fr-FR', label: 'French' },
      { value: 'de-DE', label: 'German' },
      { value: 'it-IT', label: 'Italian' },
      { value: 'zh-CN', label: 'Chinese (Simplified)' },
      { value: 'ja-JP', label: 'Japanese' },
      { value: 'ko-KR', label: 'Korean' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  }
} as const`;

// Encontrar e substituir AUDIO_CAPABILITIES
const audioCapStart = content.indexOf('// Audio capabilities por modelo específico');
if (audioCapStart === -1) {
  console.error('❌ Não foi possível encontrar o início de AUDIO_CAPABILITIES');
  process.exit(1);
}

const audioCapEnd = content.indexOf('} as const', audioCapStart) + '} as const'.length;

// Substituir a seção
content = content.substring(0, audioCapStart) + newAudioCapabilities + content.substring(audioCapEnd);

// Salvar
fs.writeFileSync(configPath, content);

console.log('✅ AUDIO_CAPABILITIES reescrito com sucesso!');