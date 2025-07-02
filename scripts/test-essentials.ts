#!/usr/bin/env ts-node
/**
 * Test script for validating the get_node_essentials tool
 * 
 * This script:
 * 1. Compares get_node_essentials vs get_node_info response sizes
 * 2. Validates that essential properties are correctly extracted
 * 3. Checks that examples are properly generated
 * 4. Tests the property search functionality
 */

import { N8NDocumentationMCPServer } from '../src/mcp/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(2) + ' MB';
}

async function testNodeEssentials(server: N8NDocumentationMCPServer, nodeType: string) {
  logSection(`Testing ${nodeType}`);
  
  try {
    // Get full node info
    const startFull = Date.now();
    const fullInfo = await server.executeTool('get_node_info', { nodeType });
    const fullTime = Date.now() - startFull;
    const fullSize = JSON.stringify(fullInfo).length;
    
    // Get essential info
    const startEssential = Date.now();
    const essentialInfo = await server.executeTool('get_node_essentials', { nodeType });
    const essentialTime = Date.now() - startEssential;
    const essentialSize = JSON.stringify(essentialInfo).length;
    
    // Calculate metrics
    const sizeReduction = ((fullSize - essentialSize) / fullSize * 100).toFixed(1);
    const speedImprovement = ((fullTime - essentialTime) / fullTime * 100).toFixed(1);
    
    // Display results
    log(`\n📊 Size Comparison:`, colors.bright);
    log(`   Full response:      ${formatBytes(fullSize)}`, colors.yellow);
    log(`   Essential response: ${formatBytes(essentialSize)}`, colors.green);
    log(`   Size reduction:     ${sizeReduction}% ✨`, colors.bright + colors.green);
    
    log(`\n⚡ Performance:`, colors.bright);
    log(`   Full response time:      ${fullTime}ms`);
    log(`   Essential response time: ${essentialTime}ms`);
    log(`   Speed improvement:       ${speedImprovement}%`, colors.green);
    
    log(`\n📋 Property Count:`, colors.bright);
    const fullPropCount = fullInfo.properties?.length || 0;
    const essentialPropCount = (essentialInfo.requiredProperties?.length || 0) + 
                               (essentialInfo.commonProperties?.length || 0);
    log(`   Full properties:      ${fullPropCount}`);
    log(`   Essential properties: ${essentialPropCount}`);
    log(`   Properties removed:   ${fullPropCount - essentialPropCount} (${((fullPropCount - essentialPropCount) / fullPropCount * 100).toFixed(1)}%)`, colors.green);
    
    log(`\n🔧 Essential Properties:`, colors.bright);
    log(`   Required: ${essentialInfo.requiredProperties?.map((p: any) => p.name).join(', ') || 'None'}`);
    log(`   Common:   ${essentialInfo.commonProperties?.map((p: any) => p.name).join(', ') || 'None'}`);
    
    log(`\n📚 Examples:`, colors.bright);
    const examples = Object.keys(essentialInfo.examples || {});
    log(`   Available examples: ${examples.join(', ') || 'None'}`);
    
    if (essentialInfo.examples?.minimal) {
      log(`   Minimal example properties: ${Object.keys(essentialInfo.examples.minimal).join(', ')}`);
    }
    
    log(`\n📊 Metadata:`, colors.bright);
    log(`   Total properties available: ${essentialInfo.metadata?.totalProperties || 0}`);
    log(`   Is AI Tool: ${essentialInfo.metadata?.isAITool ? 'Yes' : 'No'}`);
    log(`   Is Trigger: ${essentialInfo.metadata?.isTrigger ? 'Yes' : 'No'}`);
    log(`   Has Credentials: ${essentialInfo.metadata?.hasCredentials ? 'Yes' : 'No'}`);
    
    // Test property search
    const searchTerms = ['auth', 'header', 'body', 'json'];
    log(`\n🔍 Property Search Test:`, colors.bright);
    
    for (const term of searchTerms) {
      try {
        const searchResult = await server.executeTool('search_node_properties', {
          nodeType,
          query: term,
          maxResults: 5
        });
        log(`   "${term}": Found ${searchResult.totalMatches} properties`);
      } catch (error) {
        log(`   "${term}": Search failed`, colors.red);
      }
    }
    
    return {
      nodeType,
      fullSize,
      essentialSize,
      sizeReduction: parseFloat(sizeReduction),
      fullPropCount,
      essentialPropCount,
      success: true
    };
    
  } catch (error) {
    log(`❌ Error testing ${nodeType}: ${error}`, colors.red);
    return {
      nodeType,
      fullSize: 0,
      essentialSize: 0,
      sizeReduction: 0,
      fullPropCount: 0,
      essentialPropCount: 0,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function main() {
  logSection('n8n MCP Essentials Tool Test Suite');
  
  try {
    // Initialize server
    log('\n🚀 Initializing MCP server...', colors.cyan);
    const server = new N8NDocumentationMCPServer();
    
    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test nodes
    const testNodes = [
      'nodes-base.httpRequest',
      'nodes-base.webhook',
      'nodes-base.code',
      'nodes-base.set',
      'nodes-base.if',
      'nodes-base.postgres',
      'nodes-base.openAi',
      'nodes-base.googleSheets',
      'nodes-base.slack',
      'nodes-base.merge'
    ];
    
    const results = [];
    
    for (const nodeType of testNodes) {
      const result = await testNodeEssentials(server, nodeType);
      results.push(result);
    }
    
    // Summary
    logSection('Test Summary');
    
    const successful = results.filter(r => r.success);
    const totalFullSize = successful.reduce((sum, r) => sum + r.fullSize, 0);
    const totalEssentialSize = successful.reduce((sum, r) => sum + r.essentialSize, 0);
    const avgReduction = successful.reduce((sum, r) => sum + r.sizeReduction, 0) / successful.length;
    
    log(`\n✅ Successful tests: ${successful.length}/${results.length}`, colors.green);
    
    if (successful.length > 0) {
      log(`\n📊 Overall Statistics:`, colors.bright);
      log(`   Total full size:      ${formatBytes(totalFullSize)}`);
      log(`   Total essential size: ${formatBytes(totalEssentialSize)}`);
      log(`   Average reduction:    ${avgReduction.toFixed(1)}%`, colors.bright + colors.green);
      
      log(`\n🏆 Best Performers:`, colors.bright);
      const sorted = successful.sort((a, b) => b.sizeReduction - a.sizeReduction);
      sorted.slice(0, 3).forEach((r, i) => {
        log(`   ${i + 1}. ${r.nodeType}: ${r.sizeReduction}% reduction (${formatBytes(r.fullSize)} → ${formatBytes(r.essentialSize)})`);
      });
    }
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      log(`\n❌ Failed tests:`, colors.red);
      failed.forEach(r => {
        log(`   - ${r.nodeType}: ${r.error}`, colors.red);
      });
    }
    
    // Save detailed results
    const reportPath = join(process.cwd(), 'test-results-essentials.json');
    writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: results.length,
        successful: successful.length,
        failed: failed.length,
        averageReduction: avgReduction,
        totalFullSize,
        totalEssentialSize
      },
      results
    }, null, 2));
    
    log(`\n📄 Detailed results saved to: ${reportPath}`, colors.cyan);
    
    // Recommendations
    logSection('Recommendations');
    
    if (avgReduction > 90) {
      log('✨ Excellent! The essentials tool is achieving >90% size reduction.', colors.green);
    } else if (avgReduction > 80) {
      log('👍 Good! The essentials tool is achieving 80-90% size reduction.', colors.yellow);
      log('   Consider reviewing nodes with lower reduction rates.');
    } else {
      log('⚠️  The average size reduction is below 80%.', colors.yellow);
      log('   Review the essential property lists for optimization.');
    }
    
    // Test specific functionality
    logSection('Testing Advanced Features');
    
    // Test error handling
    log('\n🧪 Testing error handling...', colors.cyan);
    try {
      await server.executeTool('get_node_essentials', { nodeType: 'non-existent-node' });
      log('   ❌ Error handling failed - should have thrown error', colors.red);
    } catch (error) {
      log('   ✅ Error handling works correctly', colors.green);
    }
    
    // Test alternative node type formats
    log('\n🧪 Testing alternative node type formats...', colors.cyan);
    const alternativeFormats = [
      { input: 'httpRequest', expected: 'nodes-base.httpRequest' },
      { input: 'nodes-base.httpRequest', expected: 'nodes-base.httpRequest' },
      { input: 'HTTPREQUEST', expected: 'nodes-base.httpRequest' }
    ];
    
    for (const format of alternativeFormats) {
      try {
        const result = await server.executeTool('get_node_essentials', { nodeType: format.input });
        if (result.nodeType === format.expected) {
          log(`   ✅ "${format.input}" → "${format.expected}"`, colors.green);
        } else {
          log(`   ❌ "${format.input}" → "${result.nodeType}" (expected "${format.expected}")`, colors.red);
        }
      } catch (error) {
        log(`   ❌ "${format.input}" → Error: ${error}`, colors.red);
      }
    }
    
    log('\n✨ Test suite completed!', colors.bright + colors.green);
    
  } catch (error) {
    log(`\n❌ Fatal error: ${error}`, colors.red);
    process.exit(1);
  }
}

// Run the test
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});