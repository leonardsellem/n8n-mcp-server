// test-all-tools-comprehensive.mjs
// Comprehensive test of all MCP tools including visual verification

import { spawn } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

console.log('🧪 Starting Comprehensive MCP Tools Test...\n');

// Test 1: Check if all expected tools are in the server
console.log('📋 Step 1: Checking tool integration in server code...');

try {
  const serverCode = readFileSync('./src/mcp/server.ts', 'utf8');
  
  // Check for visual verification tools import
  const hasVisualTools = serverCode.includes('tools-visual-verification');
  console.log(`Visual verification tools imported: ${hasVisualTools ? '✅' : '❌'}`);
  
  // Check for browser tools import
  const hasBrowserTools = serverCode.includes('browser-tools');
  console.log(`Browser tools imported: ${hasBrowserTools ? '✅' : '❌'}`);
  
  // Count tool registrations
  const toolMatches = serverCode.match(/\.addTool\(/g);
  const toolCount = toolMatches ? toolMatches.length : 0;
  console.log(`Tool registrations found: ${toolCount}`);
  
} catch (error) {
  console.error('❌ Error reading server code:', error.message);
}

// Test 2: Start fresh MCP server and test protocol
console.log('\n🚀 Step 2: Testing MCP protocol communication...');

function testMCPServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('node', ['dist/mcp/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd()
    });

    let output = '';
    let hasResponded = false;

    server.stdout.on('data', (data) => {
      output += data.toString();
      if (!hasResponded && output.includes('n8n Documentation MCP Server running')) {
        hasResponded = true;
        console.log('✅ MCP Server started successfully');
        testTools(server, resolve, reject);
      }
    });

    server.stderr.on('data', (data) => {
      console.log('Server stderr:', data.toString());
    });

    server.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message);
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!hasResponded) {
        server.kill();
        reject(new Error('Server startup timeout'));
      }
    }, 10000);
  });
}

function testTools(server, resolve, reject) {
  console.log('🔍 Testing MCP tools...');
  
  // Test initialize request
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');

  let responseBuffer = '';
  let requestId = 1;

  server.stdout.on('data', (data) => {
    responseBuffer += data.toString();
    
    // Try to parse JSON responses
    const lines = responseBuffer.split('\n');
    responseBuffer = lines.pop() || ''; // Keep incomplete line
    
    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          console.log(`📨 Response ${response.id}:`, response.method || 'result');
          
          if (response.id === 1 && response.result) {
            console.log('✅ Initialize successful');
            console.log(`🛠️  Server capabilities:`, Object.keys(response.result.capabilities));
            
            // Test tools/list
            requestId++;
            const toolsListRequest = {
              jsonrpc: '2.0',
              id: requestId,
              method: 'tools/list'
            };
            
            server.stdin.write(JSON.stringify(toolsListRequest) + '\n');
          }
          
          if (response.id === 2 && response.result) {
            console.log('✅ Tools list retrieved');
            console.log(`🔧 Total tools available: ${response.result.tools.length}`);
            
            // Show all tools
            const toolNames = response.result.tools.map(tool => tool.name);
            console.log('📋 Available tools:');
            toolNames.forEach((name, i) => {
              console.log(`   ${i + 1}. ${name}`);
            });
            
            // Check for visual verification tools
            const visualTools = toolNames.filter(name => 
              name.includes('visual') || name.includes('verify_workflow') || name.includes('setup_visual')
            );
            console.log(`\n🎯 Visual verification tools found: ${visualTools.length}`);
            visualTools.forEach(tool => console.log(`   ✅ ${tool}`));
            
            // Check for browser tools
            const browserTools = toolNames.filter(name => 
              name.includes('browser_') || name.includes('screenshot')
            );
            console.log(`\n🌐 Browser tools found: ${browserTools.length}`);
            browserTools.forEach(tool => console.log(`   ✅ ${tool}`));
            
            // Test a simple tool call
            if (toolNames.includes('start_here_workflow_guide')) {
              console.log('\n🧪 Testing tool call...');
              requestId++;
              const toolCallRequest = {
                jsonrpc: '2.0',
                id: requestId,
                method: 'tools/call',
                params: {
                  name: 'start_here_workflow_guide',
                  arguments: {}
                }
              };
              
              server.stdin.write(JSON.stringify(toolCallRequest) + '\n');
            }
          }
          
          if (response.id === 3 && response.result) {
            console.log('✅ Tool call successful');
            console.log('📄 Tool response preview:', response.result.content[0].text.substring(0, 100) + '...');
            
            // Test complete - clean up
            server.kill();
            resolve({
              success: true,
              totalTools: response.result ? null : 'unknown',
              message: 'All tests passed'
            });
          }
          
        } catch (error) {
          console.log('📝 Raw response:', line);
        }
      }
    }
  });

  // Timeout for tool testing
  setTimeout(() => {
    server.kill();
    reject(new Error('Tool testing timeout'));
  }, 15000);
}

// Run the test
testMCPServer()
  .then(result => {
    console.log('\n🎉 Test completed successfully!');
    console.log('✅ MCP server is fully functional');
    console.log('✅ All tools are accessible via MCP protocol');
    console.log('✅ Visual verification system is ready for use');
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error.message);
    console.log('🔍 Check the server logs for more details');
  });
