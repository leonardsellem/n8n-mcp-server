#!/usr/bin/env node

/**
 * Test MCP Server extraction functionality
 * Simulates an MCP client calling the get_node_source_code tool
 */

const { spawn } = require('child_process');
const path = require('path');

// MCP request to get AI Agent node source code
const mcpRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'get_node_source_code',
    arguments: {
      nodeType: '@n8n/n8n-nodes-langchain.Agent',
      includeCredentials: true
    }
  }
};

async function testMCPExtraction() {
  console.log('=== MCP Server Node Extraction Test ===\n');
  console.log('Starting MCP server...');
  
  // Start the MCP server
  const serverPath = path.join(__dirname, '../dist/index.js');
  const server = spawn('node', [serverPath], {
    env: {
      ...process.env,
      MCP_SERVER_PORT: '3000',
      MCP_SERVER_HOST: '0.0.0.0',
      N8N_API_URL: 'http://n8n:5678',
      N8N_API_KEY: 'test-api-key',
      MCP_AUTH_TOKEN: 'test-token',
      LOG_LEVEL: 'info'
    },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let responseBuffer = '';
  let errorBuffer = '';

  server.stdout.on('data', (data) => {
    responseBuffer += data.toString();
  });

  server.stderr.on('data', (data) => {
    errorBuffer += data.toString();
  });

  // Give server time to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Sending MCP request...');
  console.log(JSON.stringify(mcpRequest, null, 2));
  
  // Send the request via stdin (MCP uses stdio transport)
  server.stdin.write(JSON.stringify(mcpRequest) + '\n');
  
  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Kill the server
  server.kill();
  
  console.log('\n=== Server Output ===');
  console.log(responseBuffer);
  
  if (errorBuffer) {
    console.log('\n=== Server Errors ===');
    console.log(errorBuffer);
  }
  
  // Try to parse any JSON responses
  const lines = responseBuffer.split('\n').filter(line => line.trim());
  for (const line of lines) {
    try {
      const data = JSON.parse(line);
      if (data.id === 1 && data.result) {
        console.log('\n✅ MCP Response received!');
        console.log(`Node type: ${data.result.nodeType}`);
        console.log(`Source code length: ${data.result.sourceCode ? data.result.sourceCode.length : 0} characters`);
        console.log(`Location: ${data.result.location}`);
        console.log(`Has credentials: ${data.result.credentialCode ? 'Yes' : 'No'}`);
        console.log(`Has package info: ${data.result.packageInfo ? 'Yes' : 'No'}`);
        
        if (data.result.sourceCode) {
          console.log('\nFirst 300 characters of extracted code:');
          console.log('='.repeat(60));
          console.log(data.result.sourceCode.substring(0, 300) + '...');
          console.log('='.repeat(60));
        }
      }
    } catch (e) {
      // Not JSON, skip
    }
  }
}

testMCPExtraction().catch(console.error);