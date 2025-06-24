#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

console.log('🔧 Fixing duplicate imports in registries...\n');

function fixDuplicatesInFile(filePath, fileDescription) {
  console.log(`📋 Processing ${fileDescription}...`);
  
  let content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const imports = new Map();
  const exports = new Set();
  let inImportSection = false;
  let inExportSection = false;
  let cleanedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we're in import section
    if (line.startsWith('import {') && line.includes('from \'../data/nodes/')) {
      inImportSection = true;
      const match = line.match(/import \{ (\w+) \} from '([^']+)'/);
      if (match) {
        const [, importName, importPath] = match;
        if (!imports.has(importName)) {
          imports.set(importName, importPath);
          cleanedLines.push(line);
        } else {
          console.log(`  🔄 Skipping duplicate import: ${importName}`);
        }
      } else {
        cleanedLines.push(line);
      }
    }
    // Check if we're in export section (array of nodes)
    else if (line.trim().endsWith(',') && inExportSection) {
      const exportName = line.trim().replace(',', '').trim();
      if (!exports.has(exportName)) {
        exports.add(exportName);
        cleanedLines.push(line);
      } else {
        console.log(`  🔄 Skipping duplicate export: ${exportName}`);
      }
    }
    // Check for start of export section
    else if (line.includes('export const') && line.includes('NodeTypeInfo[] = [')) {
      inImportSection = false;
      inExportSection = true;
      cleanedLines.push(line);
    }
    // Check for end of export section
    else if (line.trim() === '];' && inExportSection) {
      inExportSection = false;
      cleanedLines.push(line);
    }
    // All other lines
    else {
      cleanedLines.push(line);
    }
  }
  
  // Write cleaned content
  const cleanedContent = cleanedLines.join('\n');
  writeFileSync(filePath, cleanedContent);
  
  console.log(`  ✅ Removed duplicates from ${fileDescription}`);
  console.log(`  📊 Unique imports: ${imports.size}, Unique exports: ${exports.size}`);
}

// Fix both files
fixDuplicatesInFile('src/data/production-node-registry.ts', 'Production Node Registry');
fixDuplicatesInFile('src/discovery/enhanced-discovery.ts', 'Enhanced Discovery System');

console.log('\n🎯 Duplicate import cleanup complete!');