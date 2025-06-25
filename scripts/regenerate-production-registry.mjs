#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';

console.log('🔧 Regenerating production registry with correct imports...\n');

// Get all node files
const nodeFiles = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));
console.log(`📋 Processing ${nodeFiles.length} node files...\n`);

const imports = [];
const exports = [];
let processedCount = 0;

// Process each node file to get the correct export name
for (const file of nodeFiles) {
  const filePath = `src/data/nodes/${file}`;
  
  try {
    // Read the node file to find the actual export name
    const nodeContent = readFileSync(filePath, 'utf8');
    
    // Find export statement like "export const someNode: NodeTypeInfo = {"
    const exportMatch = nodeContent.match(/export const (\w+): NodeTypeInfo/);
    
    if (exportMatch) {
      const actualExportName = exportMatch[1];
      const importStatement = `import { ${actualExportName} } from './nodes/${file.replace('.ts', '.js')}';`;
      
      imports.push(importStatement);
      exports.push(actualExportName);
      processedCount++;
      
      if (processedCount % 50 === 0) {
        console.log(`✅ Processed ${processedCount}/${nodeFiles.length} files...`);
      }
    } else {
      console.warn(`⚠️  ${file}: Could not find export statement`);
    }
    
  } catch (error) {
    console.warn(`❌ ${file}: Error reading file - ${error.message}`);
  }
}

// Generate the new production registry content
const registryContent = `/**
 * Complete Production-Ready Node Registry
 * Auto-generated from ${processedCount} verified nodes
 */

import { NodeTypeInfo } from './node-types.js';

// Import all verified nodes
${imports.join('\n')}

/**
 * All production-ready nodes in a single array
 */
export const ALL_PRODUCTION_NODES: NodeTypeInfo[] = [
${exports.map(name => `  ${name},`).join('\n')}
];

/**
 * Get all production nodes
 */
export function getAllProductionNodes(): NodeTypeInfo[] {
  return ALL_PRODUCTION_NODES;
}

/**
 * Export count for verification
 */
export const PRODUCTION_NODE_COUNT = ${processedCount};

export default ALL_PRODUCTION_NODES;
`;

// Write the new registry
writeFileSync('src/data/production-node-registry.ts', registryContent);

console.log(`\n📊 Registry Generation Complete:`);
console.log(`  ✅ Processed: ${processedCount} nodes`);
console.log(`  ✅ Generated: ${imports.length} imports`);
console.log(`  ✅ Registry: src/data/production-node-registry.ts`);

console.log(`\n🎯 Production registry regenerated successfully!`);