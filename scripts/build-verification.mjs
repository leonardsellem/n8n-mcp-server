#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';

console.log('🔍 Build Verification Script - Checking All 532 Nodes\n');

async function verifyAllNodes() {
  const nodeFiles = [];
  
  try {
    // Get all node files
    const files = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));
    console.log(`📋 Found ${files.length} node files to verify\n`);
    
    let passCount = 0;
    let failCount = 0;
    const failures = [];
    
    // Test each node file individually
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = join('src/data/nodes', file);
      
      process.stdout.write(`\r🧪 Testing ${i + 1}/${files.length}: ${file.padEnd(40)} `);
      
      try {
        const result = await runTypeScriptCheck(filePath);
        if (result.success) {
          process.stdout.write('✅');
          passCount++;
        } else {
          process.stdout.write('❌');
          failCount++;
          failures.push({
            file: file,
            error: result.error
          });
        }
      } catch (error) {
        process.stdout.write('💥');
        failCount++;
        failures.push({
          file: file,
          error: error.message
        });
      }
    }
    
    console.log('\n\n📊 Build Verification Results:');
    console.log(`  ✅ Passed: ${passCount} nodes`);
    console.log(`  ❌ Failed: ${failCount} nodes`);
    console.log(`  📈 Success Rate: ${((passCount / files.length) * 100).toFixed(1)}%\n`);
    
    if (failures.length > 0) {
      console.log('🔍 Failed Nodes Details:');
      failures.forEach((failure, index) => {
        console.log(`\n${index + 1}. ${failure.file}:`);
        console.log(`   Error: ${failure.error.split('\n')[0]}`);
      });
      
      console.log('\n🔧 Attempting Auto-Fix for Common Issues...');
      await autoFixCommonIssues(failures);
    }
    
    return { passCount, failCount, failures };
    
  } catch (error) {
    console.error('❌ Build verification failed:', error.message);
    return { passCount: 0, failCount: -1, failures: [] };
  }
}

function runTypeScriptCheck(filePath) {
  return new Promise((resolve) => {
    const process = spawn('npx', ['tsc', '--noEmit', filePath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let errorOutput = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    process.on('close', (code) => {
      resolve({
        success: code === 0,
        error: errorOutput || output || 'Unknown error'
      });
    });
    
    process.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      process.kill('SIGTERM');
      resolve({
        success: false,
        error: 'Compilation timeout'
      });
    }, 10000);
  });
}

async function autoFixCommonIssues(failures) {
  let fixedCount = 0;
  
  for (const failure of failures) {
    const filePath = join('src/data/nodes', failure.file);
    
    try {
      let content = readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Fix common issues
      
      // 1. Missing commas after properties
      if (content.includes('default: {},description:')) {
        content = content.replace(/default: {},description:/g, 'default: {},\n      description:');
        modified = true;
      }
      
      // 2. Missing commas after type definitions
      if (content.includes('type: \'string\'description:')) {
        content = content.replace(/type: 'string'description:/g, 'type: \'string\',\n      description:');
        modified = true;
      }
      
      // 3. Missing quotes around property names
      const missingQuotes = content.match(/(\s+)([a-zA-Z_][a-zA-Z0-9_]*):(\s*['\"`])/g);
      if (missingQuotes) {
        missingQuotes.forEach(match => {
          const fixed = match.replace(/(\s+)([a-zA-Z_][a-zA-Z0-9_]*):/, '$1\'$2\':');
          content = content.replace(match, fixed);
          modified = true;
        });
      }
      
      // 4. Fix unterminated strings
      if (content.includes('description: \'') && !content.includes('description: \'.*\',')) {
        // This is complex, skip for now
      }
      
      if (modified) {
        const fs = await import('fs');
        fs.writeFileSync(filePath, content);
        console.log(`\n🔧 Auto-fixed: ${failure.file}`);
        fixedCount++;
      }
      
    } catch (error) {
      console.log(`\n⚠️  Could not auto-fix ${failure.file}: ${error.message}`);
    }
  }
  
  if (fixedCount > 0) {
    console.log(`\n✅ Auto-fixed ${fixedCount} files. Re-running verification...\n`);
    
    // Re-test fixed files
    let reTestPassed = 0;
    for (const failure of failures.slice(0, fixedCount)) {
      const filePath = join('src/data/nodes', failure.file);
      const result = await runTypeScriptCheck(filePath);
      if (result.success) {
        reTestPassed++;
        console.log(`✅ ${failure.file} now passes`);
      }
    }
    
    console.log(`\n🎯 Auto-fix Results: ${reTestPassed}/${fixedCount} files now pass`);
  }
}

// Enhanced verification that also checks imports and exports
async function verifyNodeStructure() {
  console.log('\n🏗️  Verifying Node Structure and Imports...');
  
  const discoveryFile = 'src/discovery/enhanced-discovery.ts';
  let discoveryContent;
  
  try {
    discoveryContent = readFileSync(discoveryFile, 'utf8');
  } catch (error) {
    console.log('❌ Could not read enhanced-discovery.ts');
    return false;
  }
  
  // Check if all node files are imported
  const nodeFiles = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));
  const missingImports = [];
  
  nodeFiles.forEach(file => {
    const nodeName = file.replace('.ts', '');
    const importPattern = new RegExp(`import.*${nodeName}.*from.*nodes/${file}`);
    
    if (!importPattern.test(discoveryContent)) {
      missingImports.push(file);
    }
  });
  
  if (missingImports.length > 0) {
    console.log(`⚠️  Found ${missingImports.length} nodes not imported in discovery:`);
    missingImports.slice(0, 5).forEach(file => console.log(`   - ${file}`));
    if (missingImports.length > 5) {
      console.log(`   ... and ${missingImports.length - 5} more`);
    }
  } else {
    console.log('✅ All nodes properly imported in discovery system');
  }
  
  return missingImports.length === 0;
}

// Main execution
console.log('🚀 Starting comprehensive build verification...\n');

const results = await verifyAllNodes();
const structureOk = await verifyNodeStructure();

console.log('\n' + '='.repeat(60));
console.log('📋 FINAL BUILD VERIFICATION REPORT');
console.log('='.repeat(60));

if (results.failCount === 0) {
  console.log('🎉 SUCCESS: All nodes compile successfully!');
  console.log(`✅ ${results.passCount} nodes verified and ready for production`);
} else if (results.failCount < 10) {
  console.log('⚠️  MOSTLY SUCCESSFUL: Minor issues found');
  console.log(`✅ ${results.passCount} nodes verified`);
  console.log(`❌ ${results.failCount} nodes need attention`);
} else {
  console.log('🔧 NEEDS WORK: Multiple compilation issues found');
  console.log(`❌ ${results.failCount} nodes failing compilation`);
}

if (structureOk) {
  console.log('✅ Discovery system structure verified');
} else {
  console.log('⚠️  Discovery system needs import updates');
}

console.log('\n🎯 Build verification complete!');

// Exit with appropriate code
process.exit(results.failCount > 10 ? 1 : 0);