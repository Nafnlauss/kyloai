// Script para corrigir a estrutura do arquivo de configuração
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

// Remover linhas em branco extras dentro de capabilities
content = content.replace(/imageRef: true\n\n\s*}/g, 'imageRef: true\n      }');
content = content.replace(/audioRef: true\n\n\s*}/g, 'audioRef: true\n      }');

// Garantir que arrays de modelos estejam fechados corretamente
content = content.replace(/}\n\s*]\s*,/g, '}\n  ],');

// Remover vírgulas duplas
content = content.replace(/,\s*,/g, ',');

// Remover vírgulas antes de ]
content = content.replace(/,\s*]/g, ']');

// Remover vírgulas antes de }
content = content.replace(/,\s*}/g, '}');

// Salvar o arquivo
fs.writeFileSync(configPath, content);

console.log('✅ Estrutura do arquivo corrigida');

// Verificar se há erros de sintaxe
try {
  // Tentar carregar o arquivo como módulo para verificar erros
  const testContent = content.replace(/export\s+/g, '');
  eval(testContent);
  console.log('✅ Arquivo sem erros de sintaxe');
} catch (error) {
  console.error('❌ Erro de sintaxe encontrado:', error.message);
  console.log('Linha aproximada:', error.stack);
}