#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';

const nodeFiles = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));

let fixed = 0;
let errors = 0;

nodeFiles.forEach(file => {
  const filePath = `src/data/nodes/${file}`;
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix missing commas after description
    if (content.includes('default: {},description:')) {
      content = content.replace(/default: {},description:/g, 'default: {},\n      description:');
      modified = true;
    }
    
    // Fix duplicate required properties
    const requiredMatches = [...content.matchAll(/required:\s*(true|false),.*?required:\s*(true|false),/gs)];
    if (requiredMatches.length > 0) {
      content = content.replace(/(\s+required:\s*(true|false),)\s*([^}]*?)\s*required:\s*(true|false),/g, '$1$3');
      modified = true;
    }
    
    // Fix duplicate default properties  
    const defaultMatches = [...content.matchAll(/default:\s*[^,]*,.*?default:\s*[^,]*,/gs)];
    if (defaultMatches.length > 0) {
      content = content.replace(/(\s+default:\s*[^,]*,)\s*([^}]*?)\s*default:\s*[^,]*,/g, '$1$2');
      modified = true;
    }
    
    // Fix broken property structures
    content = content.replace(/(\w+):\s*'={{[^}]*}}'(\s*description:)/g, '$1: \'={{...}}\',\n      $2');
    
    if (modified) {
      writeFileSync(filePath, content);
      fixed++;
      console.log(`✓ Fixed ${file}`);
    }
  } catch (error) {
    errors++;
    console.error(`✗ Error in ${file}:`, error.message);
  }
});

console.log(`\nFixed ${fixed} files, ${errors} errors`);