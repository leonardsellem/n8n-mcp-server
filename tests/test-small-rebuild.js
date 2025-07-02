#!/usr/bin/env node

const { NodeDocumentationService } = require('../dist/services/node-documentation-service');

async function testSmallRebuild() {
  console.log('Testing small rebuild...\n');
  
  const service = new NodeDocumentationService('./data/nodes-v2-test.db');
  
  try {
    // First, let's just try the IF node specifically
    const extractor = service.extractor;
    console.log('1️⃣ Testing extraction of IF node...');
    
    try {
      const ifNodeData = await extractor.extractNodeSource('n8n-nodes-base.If');
      console.log('   ✅ Successfully extracted IF node');
      console.log('   Source code length:', ifNodeData.sourceCode.length);
      console.log('   Has credentials:', !!ifNodeData.credentialCode);
    } catch (error) {
      console.log('   ❌ Failed to extract IF node:', error.message);
    }
    
    // Try the Webhook node
    console.log('\n2️⃣ Testing extraction of Webhook node...');
    try {
      const webhookNodeData = await extractor.extractNodeSource('n8n-nodes-base.Webhook');
      console.log('   ✅ Successfully extracted Webhook node');
      console.log('   Source code length:', webhookNodeData.sourceCode.length);
    } catch (error) {
      console.log('   ❌ Failed to extract Webhook node:', error.message);
    }
    
    // Now try storing just these nodes
    console.log('\n3️⃣ Testing storage of a single node...');
    const nodeInfo = {
      nodeType: 'n8n-nodes-base.If',
      name: 'If',
      displayName: 'If',
      description: 'Route items based on comparison operations',
      sourceCode: 'test source code',
      packageName: 'n8n-nodes-base',
      hasCredentials: false,
      isTrigger: false,
      isWebhook: false
    };
    
    await service.storeNode(nodeInfo);
    console.log('   ✅ Successfully stored test node');
    
    // Check if it was stored
    const retrievedNode = await service.getNodeInfo('n8n-nodes-base.If');
    console.log('   Retrieved node:', retrievedNode ? 'Found' : 'Not found');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    service.close();
  }
}

testSmallRebuild();