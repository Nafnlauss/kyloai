/**
 * Script para aplicar custo mínimo de 30 créditos
 * Atualiza todos os modelos com custo base < 30
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
const content = fs.readFileSync(configPath, 'utf8');

// Modelos identificados com custo < 30
const modelsToUpdate = {
  5: ['bfl-flux-schnell'],
  6: ['bfl-flux-redux'],
  8: ['bfl-flux-fill'],
  9: ['bfl-flux-dev'],
  10: ['bfl-flux-depth', 'bfl-flux-canny', 'newport-remove-background'],
  12: ['bfl-flux-raw'],
  15: ['bfl-flux-1.1-pro', 'newport-clothing-matting', 'newport-human-matting'],
  18: ['bfl-flux-1.0-pro'],
  20: ['piapi-gpt-image-1', 'piapi-f5-tts', 'newport-replace-background', 'newport-colorize', 'newport-restore-face', 'newport-do-tts-common'],
  25: ['elevenlabs-flash', 'newport-enhance']
};

console.log('Atualizando custos mínimos para 30 créditos...\n');

let updatedContent = content;
let totalUpdates = 0;

// Atualizar cada valor de custo
Object.entries(modelsToUpdate).forEach(([cost, models]) => {
  const regex = new RegExp(`base:\\s*${cost}(?!\\d)`, 'g');
  const matches = updatedContent.match(regex);
  
  if (matches) {
    updatedContent = updatedContent.replace(regex, 'base: 30');
    totalUpdates += matches.length;
    console.log(`✓ Atualizando ${matches.length} ocorrências de "base: ${cost}" para "base: 30"`);
    console.log(`  Modelos: ${models.join(', ')}`);
  }
});

// Salvar o arquivo atualizado
fs.writeFileSync(configPath, updatedContent);

console.log(`\n✅ Arquivo atualizado com sucesso!`);
console.log(`   Total de atualizações: ${totalUpdates}`);
console.log(`   Novo custo mínimo: 30 créditos`);

// Verificar se há algum modelo ainda com custo < 30
const remainingLowCost = updatedContent.match(/base:\s*([1-9]|1\d|2\d)(?!\d)/g);
if (remainingLowCost) {
  console.log(`\n⚠️  AVISO: Ainda existem ${remainingLowCost.length} modelos com custo < 30:`);
  remainingLowCost.forEach(match => console.log(`   - ${match}`));
} else {
  console.log('\n✅ Todos os modelos agora têm custo mínimo de 30 créditos!');
}