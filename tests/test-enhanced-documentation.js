#!/usr/bin/env node

const { EnhancedDocumentationFetcher } = require('../dist/utils/enhanced-documentation-fetcher');
const { EnhancedSQLiteStorageService } = require('../dist/services/enhanced-sqlite-storage-service');
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');

async function testEnhancedDocumentation() {
  console.log('=== Testing Enhanced Documentation Fetcher ===\n');

  const fetcher = new EnhancedDocumentationFetcher();
  const storage = new EnhancedSQLiteStorageService('./data/test-enhanced.db');
  const extractor = new NodeSourceExtractor();

  try {
    // Test 1: Fetch and parse Slack node documentation
    console.log('1. Testing Slack node documentation parsing...');
    const slackDoc = await fetcher.getEnhancedNodeDocumentation('n8n-nodes-base.slack');
    
    if (slackDoc) {
      console.log('\n✓ Slack Documentation Found:');
      console.log(`  - Title: ${slackDoc.title}`);
      console.log(`  - Description: ${slackDoc.description}`);
      console.log(`  - URL: ${slackDoc.url}`);
      console.log(`  - Operations: ${slackDoc.operations?.length || 0} found`);
      console.log(`  - API Methods: ${slackDoc.apiMethods?.length || 0} found`);
      console.log(`  - Examples: ${slackDoc.examples?.length || 0} found`);
      console.log(`  - Required Scopes: ${slackDoc.requiredScopes?.length || 0} found`);
      
      // Show sample operations
      if (slackDoc.operations && slackDoc.operations.length > 0) {
        console.log('\n  Sample Operations:');
        slackDoc.operations.slice(0, 5).forEach(op => {
          console.log(`    - ${op.resource}.${op.operation}: ${op.description}`);
        });
      }
      
      // Show sample API mappings
      if (slackDoc.apiMethods && slackDoc.apiMethods.length > 0) {
        console.log('\n  Sample API Mappings:');
        slackDoc.apiMethods.slice(0, 5).forEach(api => {
          console.log(`    - ${api.resource}.${api.operation} → ${api.apiMethod}`);
        });
      }
    } else {
      console.log('✗ Slack documentation not found');
    }

    // Test 2: Test with If node (core node)
    console.log('\n\n2. Testing If node documentation parsing...');
    const ifDoc = await fetcher.getEnhancedNodeDocumentation('n8n-nodes-base.if');
    
    if (ifDoc) {
      console.log('\n✓ If Documentation Found:');
      console.log(`  - Title: ${ifDoc.title}`);
      console.log(`  - Description: ${ifDoc.description}`);
      console.log(`  - Examples: ${ifDoc.examples?.length || 0} found`);
      console.log(`  - Related Resources: ${ifDoc.relatedResources?.length || 0} found`);
    }

    // Test 3: Store node with documentation
    console.log('\n\n3. Testing node storage with documentation...');
    
    // Extract a node
    const nodeInfo = await extractor.extractNodeSource('n8n-nodes-base.slack');
    if (nodeInfo) {
      const storedNode = await storage.storeNodeWithDocumentation(nodeInfo);
      
      console.log('\n✓ Node stored successfully:');
      console.log(`  - Node Type: ${storedNode.nodeType}`);
      console.log(`  - Has Documentation: ${!!storedNode.documentationMarkdown}`);
      console.log(`  - Operations: ${storedNode.operationCount}`);
      console.log(`  - API Methods: ${storedNode.apiMethodCount}`);
      console.log(`  - Examples: ${storedNode.exampleCount}`);
      console.log(`  - Resources: ${storedNode.resourceCount}`);
      console.log(`  - Scopes: ${storedNode.scopeCount}`);
      
      // Get detailed operations
      const operations = await storage.getNodeOperations(storedNode.id);
      if (operations.length > 0) {
        console.log('\n  Stored Operations (first 5):');
        operations.slice(0, 5).forEach(op => {
          console.log(`    - ${op.resource}.${op.operation}: ${op.description}`);
        });
      }
      
      // Get examples
      const examples = await storage.getNodeExamples(storedNode.id);
      if (examples.length > 0) {
        console.log('\n  Stored Examples:');
        examples.forEach(ex => {
          console.log(`    - ${ex.title || 'Untitled'} (${ex.type}): ${ex.code.length} chars`);
        });
      }
    }

    // Test 4: Search with enhanced FTS
    console.log('\n\n4. Testing enhanced search...');
    
    const searchResults = await storage.searchNodes({ query: 'slack message' });
    console.log(`\n✓ Search Results for "slack message": ${searchResults.length} nodes found`);
    
    if (searchResults.length > 0) {
      console.log('  First result:');
      const result = searchResults[0];
      console.log(`    - ${result.displayName || result.name} (${result.nodeType})`);
      console.log(`    - Documentation: ${result.documentationTitle || 'No title'}`);
    }

    // Test 5: Get statistics
    console.log('\n\n5. Getting enhanced statistics...');
    const stats = await storage.getEnhancedStatistics();
    
    console.log('\n✓ Enhanced Statistics:');
    console.log(`  - Total Nodes: ${stats.totalNodes}`);
    console.log(`  - Nodes with Documentation: ${stats.nodesWithDocumentation}`);
    console.log(`  - Documentation Coverage: ${stats.documentationCoverage}%`);
    console.log(`  - Total Operations: ${stats.totalOperations}`);
    console.log(`  - Total API Methods: ${stats.totalApiMethods}`);
    console.log(`  - Total Examples: ${stats.totalExamples}`);
    console.log(`  - Total Resources: ${stats.totalResources}`);
    console.log(`  - Total Scopes: ${stats.totalScopes}`);
    
    if (stats.topDocumentedNodes && stats.topDocumentedNodes.length > 0) {
      console.log('\n  Top Documented Nodes:');
      stats.topDocumentedNodes.slice(0, 3).forEach(node => {
        console.log(`    - ${node.display_name || node.name}: ${node.operation_count} operations, ${node.example_count} examples`);
      });
    }

  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    // Cleanup
    storage.close();
    await fetcher.cleanup();
    console.log('\n\n✓ Test completed and cleaned up');
  }
}

// Run the test
testEnhancedDocumentation().catch(console.error);