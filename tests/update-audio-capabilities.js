/**
 * Script para atualizar AUDIO_CAPABILITIES com configurações corretas
 * - Modelos só inglês mostram apenas inglês
 * - Todas as vozes disponíveis para cada modelo
 */

const fs = require('fs');
const path = require('path');
const { ELEVENLABS_ALL_VOICES, AUDIO_CAPABILITIES_CONFIG } = require('./elevenlabs-complete-config');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

// Encontrar a seção AUDIO_CAPABILITIES
const startIndex = content.indexOf('export const AUDIO_CAPABILITIES = {');
const endIndex = content.indexOf('} as const', startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error('Não foi possível encontrar AUDIO_CAPABILITIES');
  process.exit(1);
}

// Gerar nova seção AUDIO_CAPABILITIES
let newAudioCapabilities = 'export const AUDIO_CAPABILITIES = {\n';

// Adicionar configurações do ElevenLabs
Object.entries(AUDIO_CAPABILITIES_CONFIG).forEach(([modelId, config]) => {
  newAudioCapabilities += `  '${modelId}': {\n`;
  
  // Vozes
  newAudioCapabilities += `    voices: [\n`;
  config.voices.forEach((voice, index) => {
    newAudioCapabilities += `      { value: '${voice.value}', label: '${voice.label}' }`;
    if (index < config.voices.length - 1) newAudioCapabilities += ',';
    newAudioCapabilities += '\n';
  });
  newAudioCapabilities += '    ],\n';
  
  // Idiomas
  newAudioCapabilities += '    languages: [\n';
  config.languages.forEach((lang, index) => {
    newAudioCapabilities += `      { value: '${lang.value}', label: '${lang.label}' }`;
    if (index < config.languages.length - 1) newAudioCapabilities += ',';
    newAudioCapabilities += '\n';
  });
  newAudioCapabilities += '    ],\n';
  
  // Formatos
  newAudioCapabilities += '    formats: [\n';
  config.formats.forEach((format, index) => {
    newAudioCapabilities += `      { value: '${format.value}', label: '${format.label}' }`;
    if (index < config.formats.length - 1) newAudioCapabilities += ',';
    newAudioCapabilities += '\n';
  });
  newAudioCapabilities += '    ]\n';
  newAudioCapabilities += '  },\n';
});

// Adicionar os modelos que faltam (multilingual-v2, turbo-v2, turbo-v2.5)
newAudioCapabilities += `  'elevenlabs-multilingual-v2': {
    voices: [
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
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_22050', label: 'PCM (22kHz)' },
      { value: 'pcm_24000', label: 'PCM (24kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
    ]
  },
  'elevenlabs-turbo-v2': {
    voices: [
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
  'elevenlabs-turbo-v2.5': {
    voices: [
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
`;

newAudioCapabilities += '} as const';

// Substituir no conteúdo
const newContent = content.substring(0, startIndex) + newAudioCapabilities + content.substring(endIndex + 9);

// Salvar arquivo
fs.writeFileSync(configPath, newContent);

console.log('✅ AUDIO_CAPABILITIES atualizado com sucesso!');
console.log('\nResumo das alterações:');
console.log('- Todos os modelos ElevenLabs agora têm todas as vozes disponíveis');
console.log('- Modelos só inglês (Flash, English V1) mostram apenas inglês');
console.log('- Multilingual V2 e V3: 29 idiomas');
console.log('- Multilingual V1: 18 idiomas');
console.log('- Turbo V2: 8 idiomas');
console.log('- Turbo V2.5: 9 idiomas (inclui árabe)');