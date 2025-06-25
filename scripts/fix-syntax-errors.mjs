#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const files = [
  'src/data/nodes/if-node.ts',
  'src/data/nodes/set-node-real.ts', 
  'src/data/nodes/set-node.ts',
  'src/data/nodes/switch-node.ts',
  'src/data/nodes/intercom-node.ts'
];

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    
    // Fix common syntax issues from batch processing
    content = content
      // Fix unterminated template literals
      .replace(/placeholder: '={{[^}]*\n\s*}}'/, (match) => {
        return match.replace(/\n\s*/, '');
      })
      // Fix broken object properties  
      .replace(/(\w+): '={{[^}]*\n\s*}}'/, (match, prop) => {
        return match.replace(/\n\s*/, '');
      })
      // Fix duplicate required properties
      .replace(/(\s+required: false,)\s*typeOptions: {\s*[^}]*\s*},\s*required: false,/g, '$1\n      typeOptions: {\n        multipleValues: true\n      },')
      // Fix malformed object endings
      .replace(/(\s+)(\w+): '={{[^}]*}}'(\s*description: [^}]*)\s*}\s*}/g, '$1$2: \'={{$3}}\',\n$1$3\n$1}')
      // Fix broken option arrays
      .replace(/{ name: '([^']+)', value: '([^']+)'\s*}/g, '{ name: \'$1\', value: \'$2\' }')
      // Fix nested property indentation
      .replace(/(\s+)name: '(\w+)',\n(\s+)displayName:/g, '$1name: \'$2\',\n$1displayName:')
      // Fix broken defaults
      .replace(/default: {\s*}/g, 'default: {}');

    writeFileSync(file, content);
    console.log(`Fixed syntax errors in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Syntax error fixes completed');