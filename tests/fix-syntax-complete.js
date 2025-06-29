// Script completo para corrigir todos os erros de sintaxe em all-models-config.ts
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Iniciando correção completa de sintaxe...');

// 1. Remover linha "No newline at end of file" se existir
content = content.replace(/^\s*\d+→\s*No newline at end of file\s*$/gm, '');
content = content.replace(/No newline at end of file/g, '');

// 2. Corrigir arrays mal fechados em AUDIO_CAPABILITIES
// Procurar por arrays de languages que não têm ] antes de ],
content = content.replace(/(languages:\s*\[[^\]]+?)(\s*],)/gs, (match, p1, p2) => {
  // Se não termina com ], adicionar
  if (!p1.trim().endsWith(']')) {
    return p1 + '\n    ]' + p2;
  }
  return match;
});

// 3. Corrigir array incompleto específico
content = content.replace(/languages: \[\s*\]\]/g, 'languages: []');

// 4. Corrigir estrutura dos arrays de voices que podem estar mal formatados
content = content.replace(/(voices:\s*\[[^\]]+?)(\s*],)/gs, (match, p1, p2) => {
  if (!p1.trim().endsWith(']')) {
    return p1 + '\n    ]' + p2;
  }
  return match;
});

// 5. Corrigir estrutura dos arrays de formats
content = content.replace(/(formats:\s*\[[^\]]+?)(\s*]\s*})/gs, (match, p1, p2) => {
  if (!p1.trim().endsWith(']')) {
    return p1 + '\n    ]' + p2;
  }
  return match;
});

// 6. Remover vírgulas duplas
content = content.replace(/,\s*,/g, ',');

// 7. Remover vírgulas antes de ]
content = content.replace(/,\s*]/g, ']');

// 8. Remover vírgulas antes de }
content = content.replace(/,\s*}/g, '}');

// 9. Garantir nova linha no final do arquivo
if (!content.endsWith('\n')) {
  content += '\n';
}

// 10. Corrigir problema específico na linha com languages vazio
content = content.replace(/languages: \[\s*\]\]/g, 'languages: []');

// Salvar o arquivo
fs.writeFileSync(configPath, content);

console.log('✅ Sintaxe corrigida com sucesso!');

// Tentar fazer parse básico para verificar
try {
  // Remover exports para teste
  const testContent = content
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+interface\s+/g, 'interface ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/as\s+const/g, '');
  
  // Verificar se há erros óbvios de sintaxe
  const hasUnclosedBrackets = (testContent.match(/\[/g) || []).length !== (testContent.match(/\]/g) || []).length;
  const hasUnclosedBraces = (testContent.match(/\{/g) || []).length !== (testContent.match(/\}/g) || []).length;
  
  if (hasUnclosedBrackets) {
    console.warn('⚠️  Aviso: Pode haver colchetes não fechados');
  }
  if (hasUnclosedBraces) {
    console.warn('⚠️  Aviso: Pode haver chaves não fechadas');
  }
  
  if (!hasUnclosedBrackets && !hasUnclosedBraces) {
    console.log('✅ Estrutura de brackets e braces está balanceada');
  }
  
} catch (error) {
  console.error('❌ Erro ao verificar sintaxe:', error.message);
}