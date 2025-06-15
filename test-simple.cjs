#!/usr/bin/env node

/**
 * Simple test script to isolate MCP communication issues
 */

const { spawn } = require('child_process');
const path = require('path');

async function testMCPCommunication() {
  console.log('🧪 Testing MCP Communication');
  console.log('============================\n');

  return new Promise((resolve) => {
    const serverProcess = spawn('node', ['build/index.js'], {
      cwd: path.join(__dirname),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('STDOUT:', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.log('STDERR:', data.toString());
    });

    // Send a simple MCP request
    const initRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "test-client",
          version: "1.0.0"
        }
      }
    };

    console.log('Sending initialize request...');
    serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');

    setTimeout(() => {
      // Send list tools request
      const listToolsRequest = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
      };

      console.log('Sending list tools request...');
      serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
    }, 1000);

    setTimeout(() => {
      console.log('\n📊 Test Results:');
      console.log('STDOUT Output:', output);
      console.log('STDERR Output:', errorOutput);
      
      serverProcess.kill();
      resolve({
        stdout: output,
        stderr: errorOutput
      });
    }, 5000);
  });
}

testMCPCommunication().catch(console.error);
