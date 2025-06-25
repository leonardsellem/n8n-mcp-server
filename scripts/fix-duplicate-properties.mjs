#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

const files = [
  'src/data/nodes/bigcommerce-node.ts',
  'src/data/nodes/convertkit-node.ts', 
  'src/data/nodes/intercom-node.ts',
  'src/data/nodes/quickbooks-node.ts',
  'src/data/nodes/zendesk-node.ts'
];

files.forEach(file => {
  try {
    let content = readFileSync(file, 'utf8');
    
    // Fix duplicate required properties
    content = content.replace(/(\s+required: false,)\s*([^}]*?)\s*required: (false|true),/g, '$1$2');
    content = content.replace(/(\s+required: true,)\s*([^}]*?)\s*required: (false|true),/g, '$1$2');
    
    // Fix duplicate typeOptions
    content = content.replace(/(\s+typeOptions: \{[^}]*\},)\s*([^}]*?)\s*typeOptions: \{[^}]*\},/g, '$1$2');
    
    // Fix duplicate default properties
    content = content.replace(/(\s+default: [^,]*,)\s*([^}]*?)\s*default: [^,]*,/g, '$1$2');
    
    writeFileSync(file, content);
    console.log(`Fixed duplicate properties in ${file}`);
  } catch (error) {
    console.error(`Error fixing ${file}:`, error.message);
  }
});

console.log('Duplicate property fixes completed');