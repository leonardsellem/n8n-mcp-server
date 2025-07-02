#!/usr/bin/env node

import { GitHubNodeDiscovery } from './build/loaders/github-node-discovery.js';

async function testDiscovery() {
  console.log('🔄 Starting GitHub node discovery...');
  
  try {
    const discovery = new GitHubNodeDiscovery();
    const nodes = await discovery.forceRefresh();
    console.log(`✅ Discovered ${nodes.length} nodes from GitHub`);
    
    // Group by category
    const categories = {};
    for (const node of nodes) {
      if (!categories[node.category]) {
        categories[node.category] = [];
      }
      categories[node.category].push(node);
    }
    
    console.log('\n📊 Nodes by Category:');
    for (const [category, nodeList] of Object.entries(categories)) {
      console.log(`  ${category}: ${nodeList.length} nodes`);
    }
    
    console.log('\n🔍 Sample nodes from each category:');
    for (const [category, nodeList] of Object.entries(categories)) {
      console.log(`\n--- ${category} ---`);
      const sample = nodeList.slice(0, 5);
      for (const node of sample) {
        console.log(`  • ${node.displayName || node.name} - ${node.description}`);
      }
      if (nodeList.length > 5) {
        console.log(`  ... and ${nodeList.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDiscovery();
