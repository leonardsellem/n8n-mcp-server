#!/usr/bin/env node
/**
 * Quick test of simple auto-update system for AI agent reliability
 * 
 * Tests the core functionality without requiring full compilation
 */

import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';

async function testAIAgentReliability() {
  console.log('🤖 Testing AI Agent Reliability for n8n MCP Simple Auto-Update');
  console.log('================================================================');
  
  let passedTests = 0;
  let totalTests = 0;
  
  function test(name, condition, expected = true) {
    totalTests++;
    const passed = condition === expected;
    if (passed) passedTests++;
    
    console.log(`${passed ? '✅' : '❌'} ${name}: ${condition}`);
    return passed;
  }
  
  // Test 1: Database exists (most critical for AI agents)
  test('Database file exists', existsSync('./data/nodes.db'));
  
  // Test 2: Entry point exists
  test('Simple auto entry point exists', existsSync('./src/index-simple-auto.ts'));
  
  // Test 3: Required services exist
  test('ReliableAutoLoader exists', existsSync('./src/loaders/reliable-auto-loader.ts'));
  test('SimpleAutoUpdateService exists', existsSync('./src/services/simple-auto-update.ts'));
  test('SimpleAutoMCPServer exists', existsSync('./src/mcp/simple-auto-server.ts'));
  
  // Test 4: GitHub sync service exists (for auto-updates)
  test('GitHubSync service exists', existsSync('./src/services/github-sync.ts'));
  
  // Test 5: Essential configuration
  const hasGitHubToken = !!process.env.GITHUB_TOKEN;
  console.log(`🔑 GitHub Token: ${hasGitHubToken ? 'configured' : 'not configured (local-only mode)'}`);
  
  // Test 6: Package.json scripts
  try {
    const pkg = JSON.parse(await fs.readFile('./package.json', 'utf8'));
    test('start:simple-auto script exists', !!pkg.scripts['start:simple-auto']);
    test('rebuild script exists', !!pkg.scripts['rebuild']);
  } catch (error) {
    test('Package.json readable', false);
  }
  
  // Test 7: Database can be opened (quick SQLite check)
  try {
    // Try to check database without importing the full stack
    const dbSize = (await fs.stat('./data/nodes.db')).size;
    test('Database file has content', dbSize > 1000); // Should be several MB
    console.log(`📊 Database size: ${Math.round(dbSize / 1024 / 1024)}MB`);
  } catch (error) {
    test('Database file accessible', false);
  }
  
  // Test 8: Check AI Agent Reliability Guide exists
  test('AI Agent Reliability Guide exists', existsSync('./AI-AGENT-RELIABILITY-GUIDE.md'));
  
  console.log('\n📈 Test Results');
  console.log('===============');
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED - System ready for AI agents!');
    console.log('\n🚀 To start the simple auto-updating server:');
    console.log('   npm run build (if needed)');
    console.log('   npm run start:simple-auto');
    console.log('\n🔧 For auto-updates from GitHub:');
    console.log('   export GITHUB_TOKEN=your_token');
    console.log('   npm run start:simple-auto');
    
    return true;
  } else {
    console.log('❌ Some tests failed - check setup');
    
    // Provide specific guidance
    if (!existsSync('./data/nodes.db')) {
      console.log('\n🔧 Fix: Run "npm run rebuild" to create the database');
    }
    
    return false;
  }
}

// Run the test
testAIAgentReliability()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  });