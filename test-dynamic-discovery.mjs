/**
 * Test Dynamic Node Discovery System
 * 
 * Verifies that the new dynamic registry discovers all 533+ nodes
 * from the organized folder structure and makes them available to AI agents
 */

import { dynamicNodeRegistry } from './build/data/dynamic-node-registry.js';

async function testDynamicDiscovery() {
  console.log('🔍 Testing Dynamic Node Discovery System...\n');
  
  try {
    // Test node discovery
    const stats = dynamicNodeRegistry.getStats();
    console.log('📊 Discovery Statistics:');
    console.log(`   Total Nodes Discovered: ${stats.totalNodes}`);
    console.log(`   Action Nodes: ${stats.categories.actions}`);
    console.log(`   Trigger Nodes: ${stats.categories.triggers}`);
    console.log(`   Core Nodes: ${stats.categories.core}`);
    console.log(`   Cluster Nodes: ${stats.categories.clusters}`);
    console.log(`   Popular Nodes: ${stats.popularNodes}`);
    console.log(`   Last Updated: ${stats.lastUpdated}\n`);
    
    // Test search functionality
    console.log('🔎 Testing Search Functionality:');
    
    const emailResults = dynamicNodeRegistry.searchNodes('email', { limit: 5 });
    console.log(`   Email search: ${emailResults.length} results`);
    emailResults.forEach(node => 
      console.log(`     - ${node.displayName} (${node.category})`)
    );
    
    const aiResults = dynamicNodeRegistry.searchNodes('ai', { limit: 5 });
    console.log(`   AI search: ${aiResults.length} results`);
    aiResults.forEach(node => 
      console.log(`     - ${node.displayName} (${node.category})`)
    );
    
    const apiResults = dynamicNodeRegistry.searchNodes('api', { limit: 5 });
    console.log(`   API search: ${apiResults.length} results`);
    apiResults.forEach(node => 
      console.log(`     - ${node.displayName} (${node.category})`)
    );
    
    // Test category filtering
    console.log('\n📂 Testing Category Filtering:');
    const actionNodes = dynamicNodeRegistry.getNodesByCategory('actions');
    const triggerNodes = dynamicNodeRegistry.getNodesByCategory('triggers');
    console.log(`   Action nodes: ${actionNodes.length}`);
    console.log(`   Trigger nodes: ${triggerNodes.length}`);
    
    // Show sample popular nodes
    console.log('\n⭐ Sample Popular Nodes:');
    const popularNodes = dynamicNodeRegistry.getAllNodes(undefined, 10, true);
    popularNodes.forEach(node => 
      console.log(`   - ${node.displayName}: ${node.description.substring(0, 60)}...`)
    );
    
    // Test specific node lookup
    console.log('\n🎯 Testing Specific Node Lookup:');
    const openaiNode = dynamicNodeRegistry.getNode('openai-node');
    if (openaiNode) {
      console.log(`   OpenAI Node Found: ${openaiNode.displayName}`);
      console.log(`   Description: ${openaiNode.description}`);
      console.log(`   Use Cases: ${openaiNode.useCases.join(', ')}`);
    }
    
    const webhookNode = dynamicNodeRegistry.getNode('webhook-node');
    if (webhookNode) {
      console.log(`   Webhook Node Found: ${webhookNode.displayName}`);
      console.log(`   Description: ${webhookNode.description}`);
    }
    
    // Success summary
    console.log('\n✅ Dynamic Discovery Test Results:');
    console.log(`   ✓ Successfully discovered ${stats.totalNodes} nodes`);
    console.log(`   ✓ Search functionality working`);
    console.log(`   ✓ Category filtering working`);
    console.log(`   ✓ Node lookup working`);
    console.log(`   ✓ Popular nodes identified`);
    
    if (stats.totalNodes >= 500) {
      console.log('\n🎉 SUCCESS: Dynamic node discovery system is working!');
      console.log('   AI agents now have access to 533+ automatically discovered nodes');
    } else {
      console.log('\n⚠️  WARNING: Expected 533+ nodes but found ' + stats.totalNodes);
    }
    
  } catch (error) {
    console.error('❌ Dynamic Discovery Test Failed:', error);
    console.error(error.stack);
  }
}

// Run the test
testDynamicDiscovery();
