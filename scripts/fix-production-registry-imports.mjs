#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';

console.log('🔧 Fixing production registry import names...\n');

// Read the production registry file
const registryPath = 'src/data/production-node-registry.ts';
let registryContent = readFileSync(registryPath, 'utf8');

// Get all node files to determine correct export names
const nodeFiles = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));

let fixedImports = 0;
let fixedExports = 0;

console.log(`📋 Processing ${nodeFiles.length} node files...\n`);

// Process each node file
for (const file of nodeFiles) {
  const nodeName = file.replace('.ts', '');
  const filePath = `src/data/nodes/${file}`;
  
  try {
    // Read the node file to find the actual export name
    const nodeContent = readFileSync(filePath, 'utf8');
    
    // Find export statement like "export const someNode: NodeTypeInfo = {"
    const exportMatch = nodeContent.match(/export const (\w+): NodeTypeInfo/);
    
    if (exportMatch) {
      const actualExportName = exportMatch[1];
      
      // Fix the import name in the registry
      const incorrectImportName = `${nodeName.replace(/-/g, '')}nodeNode`;
      const correctImportName = actualExportName;
      
      // Replace in import statements
      const oldImport = `import { ${incorrectImportName} } from './nodes/${file.replace('.ts', '.js')}';`;
      const newImport = `import { ${correctImportName} } from './nodes/${file.replace('.ts', '.js')}';`;
      
      if (registryContent.includes(oldImport)) {
        registryContent = registryContent.replace(oldImport, newImport);
        fixedImports++;
      }
      
      // Replace in export array
      if (registryContent.includes(incorrectImportName)) {
        registryContent = registryContent.replace(new RegExp(incorrectImportName, 'g'), correctImportName);
        fixedExports++;
      }
      
      console.log(`✅ ${file}: ${incorrectImportName} → ${correctImportName}`);
    } else {
      console.warn(`⚠️  ${file}: Could not find export statement`);
    }
    
  } catch (error) {
    console.warn(`❌ ${file}: Error reading file - ${error.message}`);
  }
}

// Write the fixed registry
writeFileSync(registryPath, registryContent);

console.log(`\n📊 Fixes Applied:`);
console.log(`  ✅ Fixed imports: ${fixedImports}`);
console.log(`  ✅ Fixed exports: ${fixedExports}`);
console.log(`\n🎯 Production registry import names fixed!`);