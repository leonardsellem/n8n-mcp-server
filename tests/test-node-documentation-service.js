#!/usr/bin/env node

const { NodeDocumentationService } = require('../dist/services/node-documentation-service');

async function testService() {
  console.log('=== Testing Node Documentation Service ===\n');
  
  // Use a separate database for v2
  const service = new NodeDocumentationService('./data/nodes-v2.db');
  
  try {
    // Test 1: List nodes
    console.log('1️⃣ Testing list nodes...');
    const nodes = await service.listNodes();
    console.log(`   Found ${nodes.length} nodes in database`);
    
    if (nodes.length === 0) {
      console.log('\n⚠️  No nodes found. Running rebuild...');
      const stats = await service.rebuildDatabase();
      console.log(`   Rebuild complete: ${stats.successful} nodes stored`);
    }
    
    // Test 2: Get specific node info (IF node)
    console.log('\n2️⃣ Testing get node info for "If" node...');
    const ifNode = await service.getNodeInfo('n8n-nodes-base.if');
    
    if (ifNode) {
      console.log('   ✅ Found IF node:');
      console.log(`      Name: ${ifNode.displayName}`);
      console.log(`      Description: ${ifNode.description}`);
      console.log(`      Has source code: ${!!ifNode.sourceCode}`);
      console.log(`      Source code length: ${ifNode.sourceCode?.length || 0} bytes`);
      console.log(`      Has documentation: ${!!ifNode.documentation}`);
      console.log(`      Has example: ${!!ifNode.exampleWorkflow}`);
      
      if (ifNode.exampleWorkflow) {
        console.log('\n   📋 Example workflow:');
        console.log(JSON.stringify(ifNode.exampleWorkflow, null, 2).substring(0, 500) + '...');
      }
    } else {
      console.log('   ❌ IF node not found');
    }
    
    // Test 3: Search nodes
    console.log('\n3️⃣ Testing search functionality...');
    
    // Search for webhook nodes
    const webhookNodes = await service.searchNodes({ query: 'webhook' });
    console.log(`\n   🔍 Search for "webhook": ${webhookNodes.length} results`);
    webhookNodes.slice(0, 3).forEach(node => {
      console.log(`      - ${node.displayName} (${node.nodeType})`);
    });
    
    // Search for HTTP nodes
    const httpNodes = await service.searchNodes({ query: 'http' });
    console.log(`\n   🔍 Search for "http": ${httpNodes.length} results`);
    httpNodes.slice(0, 3).forEach(node => {
      console.log(`      - ${node.displayName} (${node.nodeType})`);
    });
    
    // Test 4: Get statistics
    console.log('\n4️⃣ Testing database statistics...');
    const stats = service.getStatistics();
    console.log('   📊 Database stats:');
    console.log(`      Total nodes: ${stats.totalNodes}`);
    console.log(`      Nodes with docs: ${stats.nodesWithDocs}`);
    console.log(`      Nodes with examples: ${stats.nodesWithExamples}`);
    console.log(`      Trigger nodes: ${stats.triggerNodes}`);
    console.log(`      Webhook nodes: ${stats.webhookNodes}`);
    console.log(`      Total packages: ${stats.totalPackages}`);
    
    // Test 5: Category filtering
    console.log('\n5️⃣ Testing category filtering...');
    const coreNodes = await service.searchNodes({ category: 'Core Nodes' });
    console.log(`   Found ${coreNodes.length} core nodes`);
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    service.close();
  }
}

// Run tests
testService().catch(console.error);