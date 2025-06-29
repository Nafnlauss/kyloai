// Script para corrigir custos de imageRef e durações máximas
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/config/all-models-config.ts');

// Ler o arquivo
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remover todos os custos de imageRef (definir como 0)
console.log('🔧 Removendo custos de imageRef...');
content = content.replace(/imageRef:\s*\d+/g, 'imageRef: 0');

// 2. Corrigir durações máximas (máximo 120 segundos = 2 minutos)
console.log('🔧 Corrigindo durações máximas...');

// Encontrar e substituir durações incorretas
const durationPatterns = [
  // Duração de 60 segundos está OK, mas vamos garantir que não haja valores maiores que 120
  { 
    pattern: /durations:\s*\[[^\]]*\]/g,
    fix: (match) => {
      // Extrair os números
      const numbers = match.match(/\d+/g);
      if (numbers) {
        // Filtrar números maiores que 120
        const validNumbers = numbers.filter(n => parseInt(n) <= 120);
        // Reconstruir o array
        return `durations: [${validNumbers.join(', ')}]`;
      }
      return match;
    }
  }
];

durationPatterns.forEach(({ pattern, fix }) => {
  content = content.replace(pattern, fix);
});

// 3. Adicionar comentários explicativos
console.log('🔧 Adicionando comentários explicativos...');

// Adicionar comentário sobre imageRef na interface
content = content.replace(
  'imageRef?: number',
  'imageRef?: number // Custo adicional por referência de imagem (0 = grátis)'
);

// Salvar o arquivo
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Correções aplicadas com sucesso!');

// Verificar as mudanças
console.log('\n📊 Verificando mudanças:');
const updatedContent = fs.readFileSync(filePath, 'utf8');

// Contar imageRef: 0
const imageRefZeroCount = (updatedContent.match(/imageRef:\s*0/g) || []).length;
console.log(`   - imageRef definidos como 0: ${imageRefZeroCount}`);

// Verificar durações
const durationMatches = updatedContent.match(/durations:\s*\[[^\]]+\]/g) || [];
let maxDuration = 0;
durationMatches.forEach(match => {
  const numbers = match.match(/\d+/g) || [];
  numbers.forEach(n => {
    const num = parseInt(n);
    if (num > maxDuration) maxDuration = num;
  });
});
console.log(`   - Duração máxima encontrada: ${maxDuration}s`);