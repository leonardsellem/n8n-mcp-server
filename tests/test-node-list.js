#!/usr/bin/env node

const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');

async function testNodeList() {
  console.log('Testing node list...\n');
  
  const extractor = new NodeSourceExtractor();
  
  try {
    const nodes = await extractor.listAvailableNodes();
    
    console.log(`Total nodes found: ${nodes.length}`);
    
    // Show first 5 nodes
    console.log('\nFirst 5 nodes:');
    nodes.slice(0, 5).forEach((node, index) => {
      console.log(`${index + 1}. Node:`, JSON.stringify(node, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testNodeList();