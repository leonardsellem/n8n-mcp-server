#!/usr/bin/env node
/**
 * Test get_node_info to diagnose timeout issues
 */

const { N8NDocumentationMCPServer } = require('../dist/mcp/server');

async function testNodeInfo() {
  console.log('🔍 Testing get_node_info...\n');
  
  try {
    const server = new N8NDocumentationMCPServer();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nodes = [
      'nodes-base.httpRequest',
      'nodes-base.webhook',
      'nodes-langchain.agent'
    ];
    
    for (const nodeType of nodes) {
      console.log(`Testing ${nodeType}...`);
      const start = Date.now();
      
      try {
        const result = await server.executeTool('get_node_info', { nodeType });
        const elapsed = Date.now() - start;
        const size = JSON.stringify(result).length;
        
        console.log(`✅ Success in ${elapsed}ms`);
        console.log(`   Size: ${(size / 1024).toFixed(1)}KB`);
        console.log(`   Properties: ${result.properties?.length || 0}`);
        console.log(`   Operations: ${result.operations?.length || 0}`);
        
        // Check for issues
        if (size > 50000) {
          console.log(`   ⚠️  WARNING: Response over 50KB!`);
        }
        
        // Check property quality
        const propsWithoutDesc = result.properties?.filter(p => !p.description && !p.displayName).length || 0;
        if (propsWithoutDesc > 0) {
          console.log(`   ⚠️  ${propsWithoutDesc} properties without descriptions`);
        }
        
      } catch (error) {
        const elapsed = Date.now() - start;
        console.log(`❌ Failed after ${elapsed}ms: ${error.message}`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

testNodeInfo().catch(console.error);