#!/usr/bin/env ts-node
/**
 * Quick test script to validate the essentials implementation
 */

import { spawn } from 'child_process';
import { join } from 'path';

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

async function runMCPCommand(toolName: string, args: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      },
      id: 1
    };
    
    const mcp = spawn('npm', ['start'], {
      cwd: join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let error = '';
    
    mcp.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    mcp.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    mcp.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}: ${error}`));
        return;
      }
      
      try {
        // Parse JSON-RPC response
        const lines = output.split('\n');
        for (const line of lines) {
          if (line.trim() && line.includes('"jsonrpc"')) {
            const response = JSON.parse(line);
            if (response.result) {
              resolve(JSON.parse(response.result.content[0].text));
              return;
            } else if (response.error) {
              reject(new Error(response.error.message));
              return;
            }
          }
        }
        reject(new Error('No valid response found'));
      } catch (err) {
        reject(err);
      }
    });
    
    // Send request
    mcp.stdin.write(JSON.stringify(request) + '\n');
    mcp.stdin.end();
  });
}

async function quickTest() {
  log('\n🚀 Quick Test - n8n MCP Essentials', colors.bright + colors.cyan);
  
  try {
    // Test 1: Get essentials for HTTP Request
    log('\n1️⃣  Testing get_node_essentials for HTTP Request...', colors.yellow);
    const essentials = await runMCPCommand('get_node_essentials', {
      nodeType: 'nodes-base.httpRequest'
    });
    
    log('✅ Success! Got essentials:', colors.green);
    log(`   Required properties: ${essentials.requiredProperties?.map((p: any) => p.name).join(', ') || 'None'}`);
    log(`   Common properties: ${essentials.commonProperties?.map((p: any) => p.name).join(', ') || 'None'}`);
    log(`   Examples: ${Object.keys(essentials.examples || {}).join(', ')}`);
    log(`   Response size: ${JSON.stringify(essentials).length} bytes`, colors.green);
    
    // Test 2: Search properties
    log('\n2️⃣  Testing search_node_properties...', colors.yellow);
    const searchResults = await runMCPCommand('search_node_properties', {
      nodeType: 'nodes-base.httpRequest',
      query: 'auth'
    });
    
    log('✅ Success! Found properties:', colors.green);
    log(`   Matches: ${searchResults.totalMatches}`);
    searchResults.matches?.slice(0, 3).forEach((match: any) => {
      log(`   - ${match.name}: ${match.description}`);
    });
    
    // Test 3: Compare sizes
    log('\n3️⃣  Comparing response sizes...', colors.yellow);
    const fullInfo = await runMCPCommand('get_node_info', {
      nodeType: 'nodes-base.httpRequest'
    });
    
    const fullSize = JSON.stringify(fullInfo).length;
    const essentialSize = JSON.stringify(essentials).length;
    const reduction = ((fullSize - essentialSize) / fullSize * 100).toFixed(1);
    
    log(`✅ Size comparison:`, colors.green);
    log(`   Full response: ${(fullSize / 1024).toFixed(1)} KB`);
    log(`   Essential response: ${(essentialSize / 1024).toFixed(1)} KB`);
    log(`   Size reduction: ${reduction}% 🎉`, colors.bright + colors.green);
    
    log('\n✨ All tests passed!', colors.bright + colors.green);
    
  } catch (error) {
    log(`\n❌ Test failed: ${error}`, colors.red);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  quickTest().catch(console.error);
}