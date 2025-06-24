#!/usr/bin/env node
/**
 * Simple Node Verification Check
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const nodesDir = path.join(projectRoot, 'src', 'data', 'nodes');

console.log('🔍 Simple Node Check Starting...');
console.log(`Project Root: ${projectRoot}`);
console.log(`Nodes Directory: ${nodesDir}`);
console.log(`Directory exists: ${fs.existsSync(nodesDir)}`);

if (fs.existsSync(nodesDir)) {
  const files = fs.readdirSync(nodesDir);
  console.log(`Total files: ${files.length}`);
  
  const tsFiles = files.filter(f => f.endsWith('.ts'));
  console.log(`TypeScript files: ${tsFiles.length}`);
  
  // Check first few files for basic structure
  console.log('\n📋 Checking first 5 files:');
  
  for (let i = 0; i < Math.min(5, tsFiles.length); i++) {
    const file = tsFiles[i];
    const filePath = path.join(nodesDir, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasNodeTypeInfo = content.includes('NodeTypeInfo');
      const hasExport = content.includes('export const');
      const hasName = content.includes('name:');
      const hasDisplayName = content.includes('displayName:');
      
      console.log(`  ${file}:`);
      console.log(`    ✅ NodeTypeInfo: ${hasNodeTypeInfo}`);
      console.log(`    ✅ Export: ${hasExport}`);
      console.log(`    ✅ Name: ${hasName}`);
      console.log(`    ✅ DisplayName: ${hasDisplayName}`);
      
    } catch (error) {
      console.log(`  ${file}: ❌ Error reading file - ${error.message}`);
    }
  }
  
} else {
  console.log('❌ Nodes directory not found!');
}

console.log('\n✅ Simple check completed.');