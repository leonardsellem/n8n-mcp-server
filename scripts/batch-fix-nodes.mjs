#!/usr/bin/env node
/**
 * Batch Fix Script - Process nodes in smaller batches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const nodesDir = path.join(projectRoot, 'src', 'data', 'nodes');

console.log('🔧 Batch Node Fix Starting...');

const nodeFiles = fs.readdirSync(nodesDir).filter(f => f.endsWith('.ts'));
console.log(`Found ${nodeFiles.length} node files`);

// Process in smaller batches to avoid timeout
const BATCH_SIZE = 50;
let processed = 0;
let fixed = 0;

for (let i = 0; i < nodeFiles.length; i += BATCH_SIZE) {
  const batch = nodeFiles.slice(i, i + BATCH_SIZE);
  console.log(`\\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(nodeFiles.length/BATCH_SIZE)} (${batch.length} files)...`);
  
  for (const fileName of batch) {
    const filePath = path.join(nodesDir, fileName);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Fix 1: Missing required properties
      const originalContent = content;
      content = content.replace(
        /{\s*name:\s*['"`]([^'"`]+)['"`],\s*displayName:\s*['"`]([^'"`]+)['"`],\s*type:\s*['"`]([^'"`]+)['"`],\s*(?!required:)([^}]*)\s*}/g,
        (match, name, displayName, type, rest) => {
          if (!rest.includes('required:')) {
            return `{
      name: '${name}',
      displayName: '${displayName}',
      type: '${type}',
      required: false,
      ${rest.trim()}
    }`;
          }
          return match;
        }
      );
      
      // Fix 2: Missing descriptions in properties
      content = content.replace(
        /{\s*name:\s*['"`]([^'"`]+)['"`],\s*displayName:\s*['"`]([^'"`]+)['"`],\s*type:\s*['"`]([^'"`]+)['"`],\s*required:\s*(true|false),\s*default:\s*([^,}]+)(?:\\s*,\\s*description:\\s*['"`]([^'"`]*)['"`])?\\s*}/g,
        (match, name, displayName, type, required, defaultValue, description) => {
          if (!description || description.trim() === '') {
            const generatedDesc = `Configure ${displayName.toLowerCase()} for the operation`;
            return `{
      name: '${name}',
      displayName: '${displayName}',
      type: '${type}',
      required: ${required},
      default: ${defaultValue},
      description: '${generatedDesc}'
    }`;
          }
          return match;
        }
      );
      
      // Fix 3: Invalid typeOptions
      content = content.replace(/typeOptions:\\s*{\\s*editor:\\s*['"`][^'"`]*['"`]\\s*,?\\s*}/g, 'typeOptions: {}');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modified = true;
        fixed++;
      }
      
      processed++;
      
    } catch (error) {
      console.log(`❌ Error processing ${fileName}: ${error.message}`);
    }
  }
  
  console.log(`  Processed: ${Math.min(i + BATCH_SIZE, nodeFiles.length)}/${nodeFiles.length}`);
}

console.log(`\\n✅ Batch processing complete!`);
console.log(`  Total processed: ${processed}`);
console.log(`  Files modified: ${fixed}`);
console.log(`  Success rate: ${(processed/nodeFiles.length*100).toFixed(1)}%`);

// Test build after fixes
console.log(`\\n🏗️  Testing TypeScript compilation...`);
try {
  const { execSync } = await import('child_process');
  execSync('npm run build', { stdio: 'pipe', cwd: projectRoot });
  console.log(`✅ Build successful! All nodes compile correctly.`);
} catch (error) {
  console.log(`❌ Build failed. Some issues remain.`);
  console.log(error.stdout?.toString() || error.message);
}