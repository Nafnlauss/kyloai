// Script final para corrigir os últimos erros de sintaxe
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Aplicando correções finais...');

// 1. Remover colchetes duplos
content = content.replace(/\]\s*\]/g, ']');

// 2. Corrigir problema no getAudioCapabilities
content = content.replace(
  `return AUDIO_CAPABILITIES[modelId as keyof typeof AUDIO_CAPABILITIES] || {
    voices: [

    ]],
    languages: [],
    formats: []
  }`,
  `return AUDIO_CAPABILITIES[modelId as keyof typeof AUDIO_CAPABILITIES] || {
    voices: [],
    languages: [],
    formats: []
  }`
);

// 3. Garantir que não há vírgulas antes de fechamentos
content = content.replace(/,\s*]/g, ']');
content = content.replace(/,\s*}/g, '}');

// 4. Garantir nova linha no final
if (!content.endsWith('\n')) {
  content += '\n';
}

// Salvar
fs.writeFileSync(configPath, content);

console.log('✅ Correções aplicadas!');

// Verificar novamente
const openBrackets = (content.match(/\[/g) || []).length;
const closeBrackets = (content.match(/\]/g) || []).length;
const openBraces = (content.match(/\{/g) || []).length;
const closeBraces = (content.match(/\}/g) || []).length;

console.log(`\nVerificação final:`);
console.log(`Colchetes: [ ${openBrackets} ] ${closeBrackets} ${openBrackets === closeBrackets ? '✅' : '❌'}`);
console.log(`Chaves: { ${openBraces} } ${closeBraces} ${openBraces === closeBraces ? '✅' : '❌'}`);