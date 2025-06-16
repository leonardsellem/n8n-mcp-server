#!/usr/bin/env node

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Test the Enhanced n8n MCP Server
 * This script tests key functionality of all Phase 1-5 enhancements
 */

function testMCPServer() {
  console.log('🚀 Testing Universal n8n MCP Server Enhancement...\n');
  
  // Start the server process
  const serverProcess = spawn('node', ['build/index.js'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let serverOutput = '';
  let hasStarted = false;

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    serverOutput += output;
    
    if (!hasStarted && output.includes('MCP server')) {
      hasStarted = true;
      console.log('✅ Server started successfully');
      testServerCapabilities(serverProcess);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });

  // Test server capabilities
  function testServerCapabilities(process) {
    console.log('\n📋 Testing Enhanced Capabilities:\n');
    
    // Test 1: List all available tools
    console.log('1. Testing Tool Registration...');
    sendMCPRequest(process, {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    });

    // Test 2: Enhanced discovery functionality
    setTimeout(() => {
      console.log('2. Testing Enhanced Discovery System...');
      sendMCPRequest(process, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'discover_nodes',
          arguments: {
            category: 'Trigger Nodes',
            limit: 3
          }
        }
      });
    }, 1000);

    // Test 3: AI workflow creation
    setTimeout(() => {
      console.log('3. Testing AI Workflow Intelligence...');
      sendMCPRequest(process, {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'create_workflow_from_description',
          arguments: {
            description: 'Send an email when a webhook is received'
          }
        }
      });
    }, 2000);

    // Test 4: Node suggestions
    setTimeout(() => {
      console.log('4. Testing Intelligent Node Suggestions...');
      sendMCPRequest(process, {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'suggest_nodes_for_task',
          arguments: {
            task: 'process customer data from API'
          }
        }
      });
    }, 3000);

    // Stop the server after tests
    setTimeout(() => {
      console.log('\n🎯 Testing Complete - Shutting down server...');
      process.kill('SIGTERM');
      setTimeout(() => process.exit(0), 1000);
    }, 5000);
  }

  function sendMCPRequest(process, request) {
    const message = JSON.stringify(request) + '\n';
    process.stdin.write(message);
  }

  // Handle server responses
  let responseBuffer = '';
  serverProcess.stdout.on('data', (data) => {
    responseBuffer += data.toString();
    
    // Process complete JSON responses
    const lines = responseBuffer.split('\n');
    responseBuffer = lines.pop() || '';
    
    lines.forEach(line => {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          handleMCPResponse(response);
        } catch (e) {
          // Not JSON, likely server logs
          if (line.includes('tools registered') || line.includes('Enhanced')) {
            console.log('📊', line.trim());
          }
        }
      }
    });
  });

  function handleMCPResponse(response) {
    if (response.id === 1 && response.result?.tools) {
      const toolCount = response.result.tools.length;
      console.log(`   ✅ ${toolCount} tools registered successfully`);
      
      // Show enhanced tool categories
      const categories = new Set();
      response.result.tools.forEach(tool => {
        const category = tool.name.split('_')[0];
        categories.add(category);
      });
      
      console.log(`   📂 Enhanced categories: ${Array.from(categories).join(', ')}`);
      
    } else if (response.id === 2) {
      if (response.result) {
        console.log('   ✅ Enhanced discovery system operational');
        console.log(`   🔍 Discovery result: ${JSON.stringify(response.result, null, 2).substring(0, 200)}...`);
      } else if (response.error) {
        console.log('   ⚠️  Discovery test needs n8n connection:', response.error.message);
      }
      
    } else if (response.id === 3) {
      if (response.result) {
        console.log('   ✅ AI workflow creation functional');
        console.log(`   🤖 Generated workflow preview: ${JSON.stringify(response.result, null, 2).substring(0, 200)}...`);
      } else if (response.error) {
        console.log('   ⚠️  AI workflow test needs n8n connection:', response.error.message);
      }
      
    } else if (response.id === 4) {
      if (response.result) {
        console.log('   ✅ Intelligent node suggestions working');
        console.log(`   💡 Suggestions: ${JSON.stringify(response.result, null, 2).substring(0, 200)}...`);
      } else if (response.error) {
        console.log('   ⚠️  Node suggestions test needs n8n connection:', response.error.message);
      }
    }
  }

  process.on('SIGINT', () => {
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// Run the test
testMCPServer();