const fs = require('fs');
const path = require('path');

// Função para encontrar todos os arquivos TypeScript/JavaScript
function findFiles(dir, pattern, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    // Ignorar node_modules e .next
    if (item === 'node_modules' || item === '.next' || item === '.git' || item === 'testes') {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findFiles(fullPath, pattern, files);
    } else if (pattern.test(fullPath)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Função para corrigir imports em um arquivo
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Corrigir getServerSession
    const newContent1 = content.replace(
      /import\s+{\s*getServerSession\s*}\s+from\s+['"]next-auth['"]/g,
      "import { getServerSession } from 'next-auth/next'"
    );
    
    if (newContent1 !== content) {
      content = newContent1;
      modified = true;
    }
    
    // Corrigir outros imports do next-auth que precisam ser de next-auth/react
    const patterns = [
      {
        pattern: /import\s+{\s*useSession\s*}\s+from\s+['"]next-auth['"]/g,
        replacement: "import { useSession } from 'next-auth/react'"
      },
      {
        pattern: /import\s+{\s*signIn\s*}\s+from\s+['"]next-auth['"]/g,
        replacement: "import { signIn } from 'next-auth/react'"
      },
      {
        pattern: /import\s+{\s*signOut\s*}\s+from\s+['"]next-auth['"]/g,
        replacement: "import { signOut } from 'next-auth/react'"
      }
    ];
    
    for (const { pattern, replacement } of patterns) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Buscar todos os arquivos TypeScript e JavaScript
console.log('🔍 Searching for files...\n');
const files = findFiles('./src', /\.(ts|tsx|js|jsx)$/);
console.log(`Found ${files.length} files to check\n`);

// Corrigir todos os arquivos
let fixedCount = 0;
for (const file of files) {
  if (fixImportsInFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✨ Done! Fixed ${fixedCount} files.`);
