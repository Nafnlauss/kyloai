/**
 * Script para reverter os custos originais dos modelos
 * Desfaz a alteração do custo mínimo de 30 créditos
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
const content = fs.readFileSync(configPath, 'utf8');

// Custos originais antes da alteração
const originalCosts = {
  'bfl-flux-schnell': 5,
  'bfl-flux-redux': 6,
  'bfl-flux-fill': 8,
  'bfl-flux-dev': 9,
  'bfl-flux-depth': 10,
  'bfl-flux-canny': 10,
  'newport-remove-background': 10,
  'bfl-flux-raw': 12,
  'bfl-flux-1.1-pro': 15,
  'newport-clothing-matting': 15,
  'newport-human-matting': 15,
  'bfl-flux-1.0-pro': 18,
  'piapi-gpt-image-1': 20,
  'piapi-f5-tts': 20,
  'newport-replace-background': 20,
  'newport-colorize': 20,
  'newport-restore-face': 20,
  'newport-do-tts-common': 20,
  'elevenlabs-flash': 25,
  'newport-enhance': 25
};

console.log('Revertendo custos originais...\n');

let updatedContent = content;
let totalReverted = 0;

// Para cada modelo, encontrar e substituir base: 30 pelo valor original
Object.entries(originalCosts).forEach(([modelId, originalCost]) => {
  // Criar regex para encontrar o modelo e seu custo
  const modelRegex = new RegExp(`(id:\\s*'${modelId}'[\\s\\S]*?credits:\\s*\\{\\s*base:\\s*)30`, 'g');
  
  const matches = updatedContent.match(modelRegex);
  if (matches) {
    updatedContent = updatedContent.replace(modelRegex, `$1${originalCost}`);
    totalReverted++;
    console.log(`✓ Revertendo ${modelId}: 30 → ${originalCost} créditos`);
  }
});

// Salvar o arquivo
fs.writeFileSync(configPath, updatedContent);

console.log(`\n✅ Arquivo atualizado com sucesso!`);
console.log(`   Total de modelos revertidos: ${totalReverted}`);
console.log(`   Custos originais restaurados`);

// Verificar se todos foram revertidos
if (totalReverted < Object.keys(originalCosts).length) {
  console.log(`\n⚠️  AVISO: Esperava reverter ${Object.keys(originalCosts).length} modelos, mas apenas ${totalReverted} foram encontrados`);
}