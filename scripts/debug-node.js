#!/usr/bin/env node
/**
 * Debug script to check node data structure
 */

const { N8NDocumentationMCPServer } = require('../dist/mcp/server');

async function debugNode() {
  console.log('🔍 Debugging node data\n');
  
  try {
    // Initialize server
    const server = new N8NDocumentationMCPServer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get node info directly
    const nodeType = 'nodes-base.httpRequest';
    console.log(`Checking node: ${nodeType}\n`);
    
    try {
      const nodeInfo = await server.executeTool('get_node_info', { nodeType });
      
      console.log('Node info retrieved successfully');
      console.log('Node type:', nodeInfo.nodeType);
      console.log('Has properties:', !!nodeInfo.properties);
      console.log('Properties count:', nodeInfo.properties?.length || 0);
      console.log('Has operations:', !!nodeInfo.operations);
      console.log('Operations:', nodeInfo.operations);
      console.log('Operations type:', typeof nodeInfo.operations);
      console.log('Operations length:', nodeInfo.operations?.length);
      
      // Check raw data
      console.log('\n📊 Raw data check:');
      console.log('properties_schema type:', typeof nodeInfo.properties_schema);
      console.log('operations type:', typeof nodeInfo.operations);
      
      // Check if operations is a string that needs parsing
      if (typeof nodeInfo.operations === 'string') {
        console.log('\nOperations is a string, trying to parse:');
        console.log('Operations string:', nodeInfo.operations);
        console.log('Operations length:', nodeInfo.operations.length);
        console.log('First 100 chars:', nodeInfo.operations.substring(0, 100));
      }
      
    } catch (error) {
      console.error('Error getting node info:', error);
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
  
  process.exit(0);
}

debugNode().catch(console.error);