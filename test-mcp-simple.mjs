#!/usr/bin/env node

import { spawn } from 'child_process';
import { resolve } from 'path';

console.log('🧪 Testing n8n MCP Server Basic Functionality');

const serverPath = resolve('./dist/index.js');

// Test 1: Check if server starts
console.log('\n1. Testing server startup...');

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverOutput = '';
let serverError = '';

server.stdout.on('data', (data) => {
  serverOutput += data.toString();
});

server.stderr.on('data', (data) => {
  serverError += data.toString();
});

// Test 2: Send MCP tools/list request
console.log('2. Testing tools/list request...');

const toolsListRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {}
};

setTimeout(() => {
  server.stdin.write(JSON.stringify(toolsListRequest) + '\n');
}, 1000);

// Test 3: Send get_database_statistics request
console.log('3. Testing get_database_statistics...');

setTimeout(() => {
  const statsRequest = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "get_database_statistics",
      arguments: {}
    }
  };
  server.stdin.write(JSON.stringify(statsRequest) + '\n');
}, 2000);

// Test 4: Send find_nodes request
console.log('4. Testing find_nodes with "webhook" query...');

setTimeout(() => {
  const findRequest = {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "find_nodes",
      arguments: {
        query: "webhook",
        limit: 3
      }
    }
  };
  server.stdin.write(JSON.stringify(findRequest) + '\n');
}, 3000);

// Cleanup and report results
setTimeout(() => {
  server.kill();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  
  if (serverError) {
    console.log('❌ Server Errors:');
    console.log(serverError);
  }
  
  if (serverOutput) {
    console.log('✅ Server Output:');
    console.log(serverOutput);
    
    // Check for expected responses
    const hasToolsList = serverOutput.includes('"method":"tools/list"') || 
                        serverOutput.includes('get_database_statistics');
    const hasStats = serverOutput.includes('totalNodes') || 
                    serverOutput.includes('nodes');
    const hasNodes = serverOutput.includes('webhook') || 
                    serverOutput.includes('Webhook');
    
    console.log('\n🔍 Response Analysis:');
    console.log(`Tools list response: ${hasToolsList ? '✅' : '❌'}`);
    console.log(`Statistics response: ${hasStats ? '✅' : '❌'}`);
    console.log(`Node search response: ${hasNodes ? '✅' : '❌'}`);
    
    if (hasToolsList && hasStats && hasNodes) {
      console.log('\n🎉 SUCCESS: All core MCP functionality is working!');
    } else {
      console.log('\n⚠️  PARTIAL: Some functionality may need attention');
    }
  } else {
    console.log('❌ No server output received');
  }
  
  process.exit(0);
}, 5000);

server.on('error', (error) => {
  console.error('❌ Server startup error:', error.message);
  process.exit(1);
});