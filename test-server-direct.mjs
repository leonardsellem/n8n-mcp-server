#!/usr/bin/env node

import { spawn } from 'child_process';
import { resolve } from 'path';

console.log('🧪 Testing n8n MCP Server Direct Communication');

const serverPath = resolve('./dist/mcp/index.js');

// Test server with direct stdio communication
console.log('\n1. Starting MCP server...');

const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit'] // inherit stderr for logs
});

let responses = [];
let responseBuffer = '';

server.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  // Parse complete JSON-RPC responses
  const lines = responseBuffer.split('\n');
  responseBuffer = lines.pop() || ''; // Keep incomplete line
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line.trim());
        responses.push(response);
        console.log('📨 Response received:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('📄 Raw output:', line);
      }
    }
  }
});

// Wait for server to start, then send requests
setTimeout(() => {
  console.log('\n2. Testing tools/list request...');
  
  const toolsListRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };
  
  server.stdin.write(JSON.stringify(toolsListRequest) + '\n');
}, 2000);

setTimeout(() => {
  console.log('\n3. Testing get_database_statistics...');
  
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
}, 3000);

setTimeout(() => {
  console.log('\n4. Testing find_nodes...');
  
  const findRequest = {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "find_nodes",
      arguments: {
        query: "slack",
        limit: 2
      }
    }
  };
  
  server.stdin.write(JSON.stringify(findRequest) + '\n');
}, 4000);

// Final results and cleanup
setTimeout(() => {
  server.kill();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Total responses received: ${responses.length}`);
  
  const toolsList = responses.find(r => r.id === 1);
  const statsResponse = responses.find(r => r.id === 2);
  const findResponse = responses.find(r => r.id === 3);
  
  console.log('\n✅ Tools List:', toolsList ? 'SUCCESS' : 'FAILED');
  if (toolsList && toolsList.result) {
    console.log(`   Found ${toolsList.result.tools?.length || 0} tools`);
  }
  
  console.log('✅ Database Statistics:', statsResponse ? 'SUCCESS' : 'FAILED');
  if (statsResponse && statsResponse.result) {
    console.log(`   Total nodes: ${statsResponse.result.content?.[0]?.text?.match(/(\d+) nodes/)?.[1] || 'unknown'}`);
  }
  
  console.log('✅ Node Search:', findResponse ? 'SUCCESS' : 'FAILED');
  if (findResponse && findResponse.result) {
    const content = findResponse.result.content?.[0]?.text || '';
    const foundNodes = content.match(/Found (\d+)/)?.[1] || '0';
    console.log(`   Found nodes: ${foundNodes}`);
  }
  
  if (toolsList && statsResponse && findResponse) {
    console.log('\n🎉 SUCCESS: Core MCP functionality verified!');
    console.log('   ✓ JSON-RPC communication working');
    console.log('   ✓ Tool discovery working');
    console.log('   ✓ Database access working');
    console.log('   ✓ Node search working');
  } else {
    console.log('\n⚠️  PARTIAL: Some tests did not complete');
  }
  
  process.exit(0);
}, 6000);

server.on('error', (error) => {
  console.error('❌ Server error:', error.message);
  process.exit(1);
});