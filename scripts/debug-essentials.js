#!/usr/bin/env node
/**
 * Debug the essentials implementation
 */

const { N8NDocumentationMCPServer } = require('../dist/mcp/server');
const { PropertyFilter } = require('../dist/services/property-filter');
const { ExampleGenerator } = require('../dist/services/example-generator');

async function debugEssentials() {
  console.log('🔍 Debugging essentials implementation\n');
  
  try {
    // Initialize server
    const server = new N8NDocumentationMCPServer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nodeType = 'nodes-base.httpRequest';
    
    // Step 1: Get raw node info
    console.log('Step 1: Getting raw node info...');
    const nodeInfo = await server.executeTool('get_node_info', { nodeType });
    console.log('✅ Got node info');
    console.log('   Node type:', nodeInfo.nodeType);
    console.log('   Display name:', nodeInfo.displayName);
    console.log('   Properties count:', nodeInfo.properties?.length);
    console.log('   Properties type:', typeof nodeInfo.properties);
    console.log('   First property:', nodeInfo.properties?.[0]?.name);
    
    // Step 2: Test PropertyFilter directly
    console.log('\nStep 2: Testing PropertyFilter...');
    const properties = nodeInfo.properties || [];
    console.log('   Input properties count:', properties.length);
    
    const essentials = PropertyFilter.getEssentials(properties, nodeType);
    console.log('   Essential results:');
    console.log('   - Required:', essentials.required?.length || 0);
    console.log('   - Common:', essentials.common?.length || 0);
    console.log('   - Required names:', essentials.required?.map(p => p.name).join(', ') || 'none');
    console.log('   - Common names:', essentials.common?.map(p => p.name).join(', ') || 'none');
    
    // Step 3: Test ExampleGenerator
    console.log('\nStep 3: Testing ExampleGenerator...');
    const examples = ExampleGenerator.getExamples(nodeType, essentials);
    console.log('   Example keys:', Object.keys(examples));
    console.log('   Minimal example:', JSON.stringify(examples.minimal || {}, null, 2));
    
    // Step 4: Test the full tool
    console.log('\nStep 4: Testing get_node_essentials tool...');
    const essentialsResult = await server.executeTool('get_node_essentials', { nodeType });
    console.log('✅ Tool executed');
    console.log('   Result keys:', Object.keys(essentialsResult));
    console.log('   Node type from result:', essentialsResult.nodeType);
    console.log('   Required props:', essentialsResult.requiredProperties?.length || 0);
    console.log('   Common props:', essentialsResult.commonProperties?.length || 0);
    
    // Compare property counts
    console.log('\n📊 Summary:');
    console.log('   Full properties:', nodeInfo.properties?.length || 0);
    console.log('   Essential properties:', 
      (essentialsResult.requiredProperties?.length || 0) + 
      (essentialsResult.commonProperties?.length || 0)
    );
    console.log('   Reduction:', 
      Math.round((1 - ((essentialsResult.requiredProperties?.length || 0) + 
      (essentialsResult.commonProperties?.length || 0)) / 
      (nodeInfo.properties?.length || 1)) * 100) + '%'
    );
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    console.error('Stack:', error.stack);
  }
  
  process.exit(0);
}

debugEssentials().catch(console.error);