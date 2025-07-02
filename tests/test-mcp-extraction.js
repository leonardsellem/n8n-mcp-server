#!/usr/bin/env node

/**
 * Standalone test for MCP AI Agent node extraction
 * This demonstrates how an MCP client would request and receive the AI Agent code
 */

const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runMCPTest() {
  log('\n=== MCP AI Agent Extraction Test ===\n', 'blue');
  
  // Start the MCP server as a subprocess
  const serverPath = path.join(__dirname, '../dist/index.js');
  const mcp = spawn('node', [serverPath], {
    env: {
      ...process.env,
      N8N_API_URL: 'http://localhost:5678',
      N8N_API_KEY: 'test-key',
      LOG_LEVEL: 'info'
    }
  });

  let buffer = '';
  
  // Handle server output
  mcp.stderr.on('data', (data) => {
    const output = data.toString();
    if (output.includes('MCP server started')) {
      log('✓ MCP Server started successfully', 'green');
      sendRequest();
    }
  });

  mcp.stdout.on('data', (data) => {
    buffer += data.toString();
    
    // Try to parse complete JSON-RPC messages
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          handleResponse(response);
        } catch (e) {
          // Not a complete JSON message yet
        }
      }
    }
  });

  mcp.on('close', (code) => {
    log(`\nMCP server exited with code ${code}`, code === 0 ? 'green' : 'red');
  });

  // Send test requests
  let requestId = 1;
  
  function sendRequest() {
    // Step 1: Initialize
    log('\n1. Initializing MCP connection...', 'yellow');
    sendMessage({
      jsonrpc: '2.0',
      id: requestId++,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    });
  }

  function sendMessage(message) {
    const json = JSON.stringify(message);
    mcp.stdin.write(json + '\n');
  }

  function handleResponse(response) {
    if (response.error) {
      log(`✗ Error: ${response.error.message}`, 'red');
      return;
    }

    // Handle different response types
    if (response.id === 1) {
      // Initialize response
      log('✓ Initialized successfully', 'green');
      log(`  Server: ${response.result.serverInfo.name} v${response.result.serverInfo.version}`, 'green');
      
      // Step 2: List tools
      log('\n2. Listing available tools...', 'yellow');
      sendMessage({
        jsonrpc: '2.0',
        id: requestId++,
        method: 'tools/list',
        params: {}
      });
    } else if (response.id === 2) {
      // Tools list response
      const tools = response.result.tools;
      log(`✓ Found ${tools.length} tools`, 'green');
      
      const nodeSourceTool = tools.find(t => t.name === 'get_node_source_code');
      if (nodeSourceTool) {
        log('✓ Node source extraction tool available', 'green');
        
        // Step 3: Call the tool to get AI Agent code
        log('\n3. Requesting AI Agent node source code...', 'yellow');
        sendMessage({
          jsonrpc: '2.0',
          id: requestId++,
          method: 'tools/call',
          params: {
            name: 'get_node_source_code',
            arguments: {
              nodeType: '@n8n/n8n-nodes-langchain.Agent',
              includeCredentials: true
            }
          }
        });
      }
    } else if (response.id === 3) {
      // Tool call response
      try {
        const content = response.result.content[0];
        if (content.type === 'text') {
          const result = JSON.parse(content.text);
          
          log('\n✓ Successfully extracted AI Agent node!', 'green');
          log('\n=== Extraction Results ===', 'blue');
          log(`Node Type: ${result.nodeType}`);
          log(`Location: ${result.location}`);
          log(`Source Code Size: ${result.sourceCode.length} bytes`);
          
          if (result.packageInfo) {
            log(`Package: ${result.packageInfo.name} v${result.packageInfo.version}`);
          }
          
          if (result.credentialCode) {
            log(`Credential Code: Available (${result.credentialCode.length} bytes)`);
          }
          
          // Show code preview
          log('\n=== Code Preview ===', 'blue');
          const preview = result.sourceCode.substring(0, 400);
          console.log(preview + '...\n');
          
          log('✓ Test completed successfully!', 'green');
        }
      } catch (e) {
        log(`✗ Failed to parse response: ${e.message}`, 'red');
      }
      
      // Close the connection
      process.exit(0);
    }
  }

  // Handle errors
  process.on('SIGINT', () => {
    log('\nInterrupted, closing MCP server...', 'yellow');
    mcp.kill();
    process.exit(0);
  });
}

// Run the test
log('Starting MCP AI Agent extraction test...', 'blue');
log('This test will:', 'blue');
log('1. Start an MCP server', 'blue');
log('2. Request the AI Agent node source code', 'blue');
log('3. Display the extracted code\n', 'blue');

runMCPTest().catch(error => {
  log(`\nTest failed: ${error.message}`, 'red');
  process.exit(1);
});