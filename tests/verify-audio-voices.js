/**
 * Script para verificar se as vozes foram configuradas corretamente
 */

const { AUDIO_CAPABILITIES } = require('../src/config/all-models-config');

console.log('=== Verificando Vozes dos Modelos de Áudio ===\n');

// Modelos ElevenLabs
const elevenLabsModels = [
  'elevenlabs-v3',
  'elevenlabs-english-v1',
  'elevenlabs-multilingual-v1',
  'elevenlabs-multilingual-v2',
  'elevenlabs-turbo-v2',
  'elevenlabs-turbo-v2.5',
  'elevenlabs-flash',
  'elevenlabs-flash-v2.5'
];

elevenLabsModels.forEach(modelId => {
  const capabilities = AUDIO_CAPABILITIES[modelId];
  if (capabilities) {
    console.log(`\n📢 ${modelId}:`);
    console.log(`   Vozes: ${capabilities.voices.length} vozes disponíveis`);
    console.log(`   Idiomas: ${capabilities.languages.length} idiomas`);
    
    // Verificar se modelos só inglês têm apenas inglês
    if (modelId.includes('english') || modelId.includes('flash')) {
      if (capabilities.languages.length === 1 && capabilities.languages[0].value === 'en') {
        console.log('   ✅ Correto: Modelo apenas inglês');
      } else {
        console.log('   ❌ ERRO: Modelo deveria ter apenas inglês!');
      }
    }
    
    // Listar primeiras 5 vozes
    console.log('   Primeiras vozes:');
    capabilities.voices.slice(0, 5).forEach(voice => {
      console.log(`     - ${voice.label} (${voice.value})`);
    });
  }
});

// Verificar outros modelos de áudio (PiAPI, NewportAI)
console.log('\n\n📢 Outros Modelos de Áudio:');

const otherAudioModels = Object.keys(AUDIO_CAPABILITIES).filter(
  key => !elevenLabsModels.includes(key)
);

otherAudioModels.forEach(modelId => {
  const capabilities = AUDIO_CAPABILITIES[modelId];
  console.log(`\n${modelId}:`);
  console.log(`   Vozes: ${capabilities.voices?.length || 0} vozes`);
  console.log(`   Idiomas: ${capabilities.languages?.length || 0} idiomas`);
});

console.log('\n✅ Verificação concluída!');