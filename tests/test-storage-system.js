#!/usr/bin/env node

/**
 * Test the node storage and search system
 */

const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');
const { NodeStorageService } = require('../dist/services/node-storage-service');

async function testStorageSystem() {
  console.log('=== Node Storage System Test ===\n');
  
  const extractor = new NodeSourceExtractor();
  const storage = new NodeStorageService();
  
  // 1. Extract and store some nodes
  console.log('1. Extracting and storing nodes...\n');
  
  const testNodes = [
    'n8n-nodes-base.Function',
    'n8n-nodes-base.Webhook',
    'n8n-nodes-base.HttpRequest',
    '@n8n/n8n-nodes-langchain.Agent'
  ];
  
  let stored = 0;
  for (const nodeType of testNodes) {
    try {
      console.log(`  Extracting ${nodeType}...`);
      const nodeInfo = await extractor.extractNodeSource(nodeType);
      await storage.storeNode(nodeInfo);
      stored++;
      console.log(`  ✅ Stored successfully`);
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
    }
  }
  
  console.log(`\n  Total stored: ${stored}/${testNodes.length}\n`);
  
  // 2. Test search functionality
  console.log('2. Testing search functionality...\n');
  
  const searchTests = [
    { query: 'function', desc: 'Search for "function"' },
    { query: 'webhook', desc: 'Search for "webhook"' },
    { packageName: 'n8n-nodes-base', desc: 'Filter by package' },
    { hasCredentials: false, desc: 'Nodes without credentials' }
  ];
  
  for (const test of searchTests) {
    console.log(`  ${test.desc}:`);
    const results = await storage.searchNodes(test);
    console.log(`    Found ${results.length} nodes`);
    if (results.length > 0) {
      console.log(`    First result: ${results[0].nodeType}`);
    }
  }
  
  // 3. Get statistics
  console.log('\n3. Storage statistics:\n');
  
  const stats = await storage.getStatistics();
  console.log(`  Total nodes: ${stats.totalNodes}`);
  console.log(`  Total packages: ${stats.totalPackages}`);
  console.log(`  Total code size: ${(stats.totalCodeSize / 1024).toFixed(2)} KB`);
  console.log(`  Average node size: ${(stats.averageNodeSize / 1024).toFixed(2)} KB`);
  console.log(`  Nodes with credentials: ${stats.nodesWithCredentials}`);
  
  console.log('\n  Package distribution:');
  stats.packageDistribution.forEach(pkg => {
    console.log(`    ${pkg.package}: ${pkg.count} nodes`);
  });
  
  // 4. Test bulk extraction
  console.log('\n4. Testing bulk extraction (first 10 nodes)...\n');
  
  const allNodes = await extractor.listAvailableNodes();
  const nodesToExtract = allNodes.slice(0, 10);
  
  const nodeInfos = [];
  for (const node of nodesToExtract) {
    try {
      const nodeType = node.packageName ? `${node.packageName}.${node.name}` : node.name;
      const nodeInfo = await extractor.extractNodeSource(nodeType);
      nodeInfos.push(nodeInfo);
    } catch (error) {
      // Skip failed extractions
    }
  }
  
  if (nodeInfos.length > 0) {
    const bulkResult = await storage.bulkStoreNodes(nodeInfos);
    console.log(`  Bulk stored: ${bulkResult.stored}`);
    console.log(`  Failed: ${bulkResult.failed}`);
  }
  
  // 5. Export for database
  console.log('\n5. Exporting for database...\n');
  
  const dbExport = await storage.exportForDatabase();
  console.log(`  Exported ${dbExport.nodes.length} nodes`);
  console.log(`  Total packages: ${dbExport.metadata.totalPackages}`);
  console.log(`  Export timestamp: ${dbExport.metadata.exportedAt}`);
  
  // Save export to file
  const fs = require('fs').promises;
  const exportFile = path.join(__dirname, 'node-storage-export.json');
  await fs.writeFile(exportFile, JSON.stringify(dbExport, null, 2));
  console.log(`  Saved to: ${exportFile}`);
  
  console.log('\n✅ Storage system test completed!');
}

const path = require('path');
testStorageSystem().catch(console.error);