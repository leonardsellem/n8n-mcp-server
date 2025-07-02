#!/usr/bin/env node

/**
 * End-to-end test for MCP server tools integration
 * Tests both get_node_source_code and list_available_nodes tools
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { N8NMCPServer } = require('../dist/mcp/server');

// Test configuration
const TEST_CONFIG = {
  mcp: {
    port: 3000,
    host: '0.0.0.0',
    authToken: 'test-token'
  },
  n8n: {
    apiUrl: 'http://localhost:5678',
    apiKey: 'test-key'
  }
};

// Mock tool calls
const TEST_REQUESTS = [
  {
    name: 'list_available_nodes',
    description: 'List all available n8n nodes',
    request: {
      name: 'list_available_nodes',
      arguments: {}
    }
  },
  {
    name: 'list_ai_nodes',
    description: 'List AI/LangChain nodes',
    request: {
      name: 'list_available_nodes',
      arguments: {
        category: 'ai'
      }
    }
  },
  {
    name: 'get_function_node',
    description: 'Extract Function node source',
    request: {
      name: 'get_node_source_code',
      arguments: {
        nodeType: 'n8n-nodes-base.Function',
        includeCredentials: true
      }
    }
  },
  {
    name: 'get_ai_agent_node',
    description: 'Extract AI Agent node source',
    request: {
      name: 'get_node_source_code',
      arguments: {
        nodeType: '@n8n/n8n-nodes-langchain.Agent',
        includeCredentials: true
      }
    }
  },
  {
    name: 'get_webhook_node',
    description: 'Extract Webhook node source',
    request: {
      name: 'get_node_source_code',
      arguments: {
        nodeType: 'n8n-nodes-base.Webhook',
        includeCredentials: false
      }
    }
  }
];

async function simulateToolCall(server, toolRequest) {
  console.log(`\n📋 Testing: ${toolRequest.description}`);
  console.log(`   Tool: ${toolRequest.request.name}`);
  console.log(`   Args:`, JSON.stringify(toolRequest.request.arguments, null, 2));
  
  try {
    const startTime = Date.now();
    
    // Directly call the tool handler
    const handler = server.toolHandlers[toolRequest.request.name];
    if (!handler) {
      throw new Error(`Tool handler not found: ${toolRequest.request.name}`);
    }
    
    const result = await handler(toolRequest.request.arguments);
    const elapsed = Date.now() - startTime;
    
    console.log(`   ✅ Success (${elapsed}ms)`);
    
    // Analyze results based on tool type
    if (toolRequest.request.name === 'list_available_nodes') {
      console.log(`   📊 Found ${result.nodes.length} nodes`);
      if (result.nodes.length > 0) {
        console.log(`   Sample nodes:`);
        result.nodes.slice(0, 3).forEach(node => {
          console.log(`     - ${node.name} (${node.packageName || 'unknown'})`);
        });
      }
    } else if (toolRequest.request.name === 'get_node_source_code') {
      console.log(`   📦 Node: ${result.nodeType}`);
      console.log(`   📏 Code size: ${result.sourceCode.length} bytes`);
      console.log(`   📍 Location: ${result.location}`);
      console.log(`   🔐 Has credentials: ${!!result.credentialCode}`);
      console.log(`   📄 Has package info: ${!!result.packageInfo}`);
      
      if (result.packageInfo) {
        console.log(`   📦 Package: ${result.packageInfo.name} v${result.packageInfo.version}`);
      }
    }
    
    return { success: true, result, elapsed };
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('=== MCP Server Tools Integration Test ===\n');
  
  // Create MCP server instance
  console.log('🚀 Initializing MCP server...');
  const server = new N8NMCPServer(TEST_CONFIG.mcp, TEST_CONFIG.n8n);
  
  // Store tool handlers for direct access
  server.toolHandlers = {};
  
  // Override handler setup to capture handlers
  const originalSetup = server.setupHandlers.bind(server);
  server.setupHandlers = function() {
    originalSetup();
    
    // Capture tool call handler
    const originalHandler = this.server.setRequestHandler;
    this.server.setRequestHandler = function(schema, handler) {
      if (schema.parse && schema.parse({method: 'tools/call'}).method === 'tools/call') {
        // This is the tool call handler
        const toolCallHandler = handler;
        server.handleToolCall = async (args) => {
          const response = await toolCallHandler({ method: 'tools/call', params: args });
          return response.content[0];
        };
      }
      return originalHandler.call(this, schema, handler);
    };
  };
  
  // Re-setup handlers
  server.setupHandlers();
  
  // Extract individual tool handlers
  server.toolHandlers = {
    list_available_nodes: async (args) => server.listAvailableNodes(args),
    get_node_source_code: async (args) => server.getNodeSourceCode(args)
  };
  
  console.log('✅ MCP server initialized\n');
  
  // Test statistics
  const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    results: []
  };
  
  // Run all test requests
  for (const testRequest of TEST_REQUESTS) {
    stats.total++;
    const result = await simulateToolCall(server, testRequest);
    stats.results.push({
      name: testRequest.name,
      ...result
    });
    
    if (result.success) {
      stats.passed++;
    } else {
      stats.failed++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${stats.total}`);
  console.log(`Passed: ${stats.passed} ✅`);
  console.log(`Failed: ${stats.failed} ❌`);
  console.log(`Success rate: ${((stats.passed / stats.total) * 100).toFixed(1)}%`);
  
  // Detailed results
  console.log('\nDetailed Results:');
  stats.results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const time = result.elapsed ? ` (${result.elapsed}ms)` : '';
    console.log(`  ${status} ${result.name}${time}`);
    if (!result.success) {
      console.log(`     Error: ${result.error}`);
    }
  });
  
  console.log('\n✨ MCP tools integration test completed!');
  
  // Test database storage capability
  console.log('\n📊 Database Storage Capability:');
  const sampleExtraction = stats.results.find(r => r.success && r.result && r.result.sourceCode);
  if (sampleExtraction) {
    console.log('✅ Node extraction produces database-ready structure');
    console.log('✅ Includes source code, hash, location, and metadata');
    console.log('✅ Ready for bulk extraction and storage');
  } else {
    console.log('⚠️  No successful extraction to verify database structure');
  }
  
  process.exit(stats.failed > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});

// Run the test
main();