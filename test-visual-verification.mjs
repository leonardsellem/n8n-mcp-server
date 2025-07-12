// test-visual-verification.mjs
// Quick test of the visual verification system

import { readFileSync } from 'fs';

console.log('🧪 Testing Visual Verification System Integration...\n');

// Test 1: Check if visual verification tools are registered in MCP server
try {
  const serverFile = readFileSync('./src/mcp/server.ts', 'utf8');
  
  if (serverFile.includes('tools-visual-verification')) {
    console.log('✅ Visual verification tools integrated into MCP server');
  } else {
    console.log('❌ Visual verification tools NOT integrated');
  }

  // Check for new tool names
  const expectedTools = [
    'setup_visual_verification',
    'verify_workflow_visually', 
    'compare_workflow_states',
    'check_workflow_health',
    'get_workflow_visual_summary',
    'cleanup_visual_verification'
  ];

  let toolsFound = 0;
  expectedTools.forEach(tool => {
    if (serverFile.includes(tool)) {
      console.log(`✅ Tool registered: ${tool}`);
      toolsFound++;
    } else {
      console.log(`❌ Tool missing: ${tool}`);
    }
  });

  console.log(`\n📊 Tools Integration: ${toolsFound}/${expectedTools.length} tools registered\n`);

} catch (error) {
  console.error('❌ Error reading server file:', error.message);
}

// Test 2: Check if all new service files exist
console.log('🔍 Checking service files...');

const serviceFiles = [
  './src/services/visual-verification.ts',
  './src/services/github-sync.ts', 
  './src/services/node-parser.ts',
  './src/types/visual-types.ts',
  './src/utils/error-handler.ts',
  './src/mcp/tools-visual-verification.ts'
];

serviceFiles.forEach(file => {
  try {
    readFileSync(file, 'utf8');
    console.log(`✅ Service exists: ${file}`);
  } catch (error) {
    console.log(`❌ Service missing: ${file}`);
  }
});

// Test 3: Check package.json for new dependencies
console.log('\n📦 Checking dependencies...');

try {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  const requiredDeps = ['sharp', 'canvas', 'node-cron', '@octokit/rest'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ Dependency installed: ${dep}`);
    } else {
      console.log(`❌ Dependency missing: ${dep}`);
    }
  });

} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

console.log('\n🎉 Visual Verification System Test Complete!');
console.log('\n📝 Next Steps:');
console.log('   1. npm install (if dependencies are missing)');
console.log('   2. npm run build');
console.log('   3. Start MCP server to test visual verification tools');
console.log('   4. Use setup_visual_verification() to initialize system');
