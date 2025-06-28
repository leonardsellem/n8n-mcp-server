/**
 * Fix Node Import Paths
 * 
 * Updates all import paths in organized node files to use correct relative paths
 */

import fs from 'fs';
import path from 'path';

function fixImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the node-types import path - change ../node-types.js to ../../node-types.js
    const fixedContent = content.replace(
      /import { NodeTypeInfo } from '\.\.\/node-types\.js';/g,
      "import { NodeTypeInfo } from '../../node-types.js';"
    );
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✓ Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function fixAllNodeImports() {
  console.log('🔧 Fixing node import paths...\n');
  
  let fixedCount = 0;
  const categories = ['actions', 'triggers', 'core', 'clusters'];
  
  for (const category of categories) {
    const categoryDir = `src/data/nodes/${category}`;
    
    if (!fs.existsSync(categoryDir)) {
      continue;
    }
    
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.ts') && file !== 'index.md');
    
    console.log(`📂 Fixing ${category} nodes (${files.length} files):`);
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      if (fixImportsInFile(filePath)) {
        fixedCount++;
      }
    }
    
    console.log();
  }
  
  console.log(`✅ Fixed import paths in ${fixedCount} node files`);
}

// Run the fix
fixAllNodeImports();
