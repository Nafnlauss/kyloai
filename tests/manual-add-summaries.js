// Script manual para adicionar summaries
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/all-models-config.ts');
let content = fs.readFileSync(configPath, 'utf8');

console.log('🔧 Adicionando summaries manualmente...');

// Substituições manuais
const replacements = [
  // Luma Labs
  {
    find: `      credits: { base: 50, imageRef: 10 }
    },`,
    replace: `      credits: { base: 50, imageRef: 10 },
      summary: 'Fast and affordable video generation with basic quality'
    },`
  },
  {
    find: `      credits: { base: 253, perSecond: true, imageRef: 20 }
    },`,
    replace: `      credits: { base: 253, perSecond: true, imageRef: 20 },
      summary: 'Premium quality video generation with 4K support and advanced features'
    },`
  },
  {
    find: `      credits: { base: 200, perSecond: true, imageRef: 15 }
    },`,
    replace: `      credits: { base: 200, perSecond: true, imageRef: 15 },
      summary: 'Stable legacy model with proven results'
    },`
  }
];

// Aplicar substituições
let replacedCount = 0;
for (const { find, replace } of replacements) {
  if (content.includes(find)) {
    content = content.replace(find, replace);
    replacedCount++;
  }
}

// Salvar
fs.writeFileSync(configPath, content);

console.log(`✅ Adicionado ${replacedCount} summaries`);

// Verificar se ainda há modelos sem summary
const lines = content.split('\n');
let modelsWithoutSummary = 0;
let inModel = false;
let hasCredits = false;
let hasSummary = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.includes('id:') && line.includes("'")) {
    inModel = true;
    hasCredits = false;
    hasSummary = false;
  }
  
  if (inModel && line.includes('credits:')) {
    hasCredits = true;
  }
  
  if (inModel && line.includes('summary:')) {
    hasSummary = true;
  }
  
  if (inModel && line === '},') {
    if (hasCredits && !hasSummary) {
      modelsWithoutSummary++;
    }
    inModel = false;
  }
}

console.log(`⚠️  Ainda há ${modelsWithoutSummary} modelos sem summary`);