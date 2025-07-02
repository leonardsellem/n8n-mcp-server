#!/usr/bin/env node

/**
 * Test SQLite database search functionality
 */

const { SQLiteStorageService } = require('../dist/services/sqlite-storage-service');
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');

async function testDatabaseSearch() {
  console.log('=== SQLite Database Search Test ===\n');
  
  const storage = new SQLiteStorageService();
  const extractor = new NodeSourceExtractor();
  
  // First, ensure we have some data
  console.log('1️⃣ Checking database status...');
  let stats = await storage.getStatistics();
  
  if (stats.totalNodes === 0) {
    console.log('   Database is empty. Adding some test nodes...\n');
    
    const testNodes = [
      'n8n-nodes-base.Function',
      'n8n-nodes-base.Webhook',
      'n8n-nodes-base.HttpRequest',
      'n8n-nodes-base.If',
      'n8n-nodes-base.Slack',
      'n8n-nodes-base.Discord'
    ];
    
    for (const nodeType of testNodes) {
      try {
        const nodeInfo = await extractor.extractNodeSource(nodeType);
        await storage.storeNode(nodeInfo);
        console.log(`   ✅ Stored ${nodeType}`);
      } catch (error) {
        console.log(`   ❌ Failed to store ${nodeType}: ${error.message}`);
      }
    }
    
    stats = await storage.getStatistics();
  }
  
  console.log(`\n   Total nodes in database: ${stats.totalNodes}`);
  console.log(`   Total packages: ${stats.totalPackages}`);
  console.log(`   Database size: ${(stats.totalCodeSize / 1024).toFixed(2)} KB\n`);
  
  // Test different search scenarios
  console.log('2️⃣ Testing search functionality...\n');
  
  const searchTests = [
    {
      name: 'Search by partial name (func)',
      query: { query: 'func' }
    },
    {
      name: 'Search by partial name (web)',
      query: { query: 'web' }
    },
    {
      name: 'Search for HTTP',
      query: { query: 'http' }
    },
    {
      name: 'Search for multiple terms',
      query: { query: 'slack discord' }
    },
    {
      name: 'Filter by package',
      query: { packageName: 'n8n-nodes-base' }
    },
    {
      name: 'Search with package filter',
      query: { query: 'func', packageName: 'n8n-nodes-base' }
    },
    {
      name: 'Search by node type',
      query: { nodeType: 'Webhook' }
    },
    {
      name: 'Limit results',
      query: { query: 'node', limit: 3 }
    }
  ];
  
  for (const test of searchTests) {
    console.log(`   📍 ${test.name}:`);
    console.log(`      Query: ${JSON.stringify(test.query)}`);
    
    try {
      const results = await storage.searchNodes(test.query);
      console.log(`      Results: ${results.length} nodes found`);
      
      if (results.length > 0) {
        console.log('      Matches:');
        results.slice(0, 3).forEach(node => {
          console.log(`        - ${node.nodeType} (${node.displayName || node.name})`);
        });
        if (results.length > 3) {
          console.log(`        ... and ${results.length - 3} more`);
        }
      }
    } catch (error) {
      console.log(`      ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Test specific node retrieval
  console.log('3️⃣ Testing specific node retrieval...\n');
  
  const specificNode = await storage.getNode('n8n-nodes-base.Function');
  if (specificNode) {
    console.log(`   ✅ Found node: ${specificNode.nodeType}`);
    console.log(`      Display name: ${specificNode.displayName}`);
    console.log(`      Code size: ${specificNode.codeLength} bytes`);
    console.log(`      Has credentials: ${specificNode.hasCredentials}`);
  } else {
    console.log('   ❌ Node not found');
  }
  
  // Test package listing
  console.log('\n4️⃣ Testing package listing...\n');
  
  const packages = await storage.getPackages();
  console.log(`   Found ${packages.length} packages:`);
  packages.forEach(pkg => {
    console.log(`     - ${pkg.name}: ${pkg.nodeCount} nodes`);
  });
  
  // Close database
  storage.close();
  
  console.log('\n✅ Search functionality test completed!');
}

// Run the test
testDatabaseSearch().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});