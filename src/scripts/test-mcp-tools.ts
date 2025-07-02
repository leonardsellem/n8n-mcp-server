#!/usr/bin/env node
/**
 * Test MCP tools directly
 */
import { createDatabaseAdapter } from '../database/database-adapter';
import { NodeRepository } from '../database/node-repository';
import { N8NDocumentationMCPServer } from '../mcp/server';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[TestMCPTools]' });

async function testTool(server: any, toolName: string, args: any) {
  try {
    console.log(`\n🔧 Testing: ${toolName}`);
    console.log('Args:', JSON.stringify(args, null, 2));
    console.log('-'.repeat(60));
    
    const result = await server[toolName].call(server, args);
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }
}

async function main() {
  console.log('🤖 Testing MCP Tools\n');
  
  // Create server instance and wait for initialization
  const server = new N8NDocumentationMCPServer();
  
  // Give it time to initialize
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Test get_node_as_tool_info
  console.log('\n=== Testing get_node_as_tool_info ===');
  await testTool(server, 'getNodeAsToolInfo', 'nodes-base.slack');
  await testTool(server, 'getNodeAsToolInfo', 'nodes-base.googleSheets');
  
  // Test enhanced get_node_info with aiToolCapabilities
  console.log('\n\n=== Testing get_node_info (with aiToolCapabilities) ===');
  await testTool(server, 'getNodeInfo', 'nodes-base.httpRequest');
  
  // Test list_ai_tools with enhanced response
  console.log('\n\n=== Testing list_ai_tools (enhanced) ===');
  await testTool(server, 'listAITools', {});
  
  console.log('\n✅ All tests completed!');
  process.exit(0);
}

if (require.main === module) {
  main().catch(console.error);
}