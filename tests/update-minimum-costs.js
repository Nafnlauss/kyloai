/**
 * Script para atualizar custos mínimos de modelos
 * Identifica modelos com custo base < 30 e gera as atualizações necessárias
 */

const fs = require('fs');
const path = require('path');

// Ler o arquivo de configuração
const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
const configContent = fs.readFileSync(configPath, 'utf8');

// Parse manual para encontrar modelos com custo < 30
const lines = configContent.split('\n');
const modelsToUpdate = [];
let currentModel = null;
let inCredits = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detectar início de um modelo
  if (line.includes("id: '") && line.includes("',")) {
    const match = line.match(/id:\s*'([^']+)'/);
    if (match) {
      currentModel = {
        id: match[1],
        lineNumber: i + 1,
        baseCost: null
      };
    }
  }
  
  // Detectar início da seção credits
  if (line.includes('credits: {')) {
    inCredits = true;
  }
  
  // Detectar custo base
  if (inCredits && line.includes('base:') && currentModel) {
    const match = line.match(/base:\s*(\d+)/);
    if (match) {
      currentModel.baseCost = parseInt(match[1]);
      currentModel.baseCostLine = i + 1;
      
      // Se o custo for menor que 30, adicionar à lista
      if (currentModel.baseCost < 30) {
        modelsToUpdate.push({...currentModel});
      }
      
      inCredits = false;
      currentModel = null;
    }
  }
}

console.log('=== Modelos com custo < 30 créditos ===\n');
console.log(`Total encontrados: ${modelsToUpdate.length}\n`);

// Agrupar por custo atual
const byCost = {};
modelsToUpdate.forEach(model => {
  if (!byCost[model.baseCost]) {
    byCost[model.baseCost] = [];
  }
  byCost[model.baseCost].push(model);
});

// Mostrar modelos agrupados por custo
Object.keys(byCost).sort((a, b) => a - b).forEach(cost => {
  console.log(`\nModelos com ${cost} créditos (serão atualizados para 30):`);
  byCost[cost].forEach(model => {
    console.log(`  - ${model.id} (linha ${model.baseCostLine})`);
  });
});

// Gerar script de atualização
console.log('\n\n=== Comandos para atualizar ===\n');
console.log('// Copie e cole no terminal para atualizar todos os modelos:\n');

modelsToUpdate.forEach(model => {
  console.log(`sed -i '${model.baseCostLine}s/base: ${model.baseCost}/base: 30/' "${configPath}"`);
});

console.log('\n// Ou use este comando único para atualizar todos de uma vez:');
console.log(`\nnode -e "
const fs = require('fs');
const content = fs.readFileSync('${configPath}', 'utf8');
const updated = content${modelsToUpdate.map(m => `.replace(/base: ${m.baseCost}(?=[^0-9])/g, 'base: 30')`).join('')};
fs.writeFileSync('${configPath}', updated);
console.log('Arquivo atualizado com sucesso!');
"`);

// Mostrar resumo
console.log('\n\n=== Resumo das mudanças ===');
console.log(`\nModelos que serão atualizados: ${modelsToUpdate.length}`);
console.log('Novo custo mínimo: 30 créditos');

const totalCostIncrease = modelsToUpdate.reduce((sum, model) => sum + (30 - model.baseCost), 0);
console.log(`Aumento total de custos: ${totalCostIncrease} créditos`);

// Listar IDs para referência
console.log('\nIDs dos modelos afetados:');
modelsToUpdate.forEach(model => {
  console.log(`- ${model.id}`);
});