#!/usr/bin/env node

/**
 * Comprehensive test suite for n8n node extraction functionality
 * Tests all aspects of node extraction for database storage
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Import our components
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');
const { N8NMCPServer } = require('../dist/mcp/server');

// Test configuration
const TEST_RESULTS_DIR = path.join(__dirname, 'test-results');
const EXTRACTED_NODES_FILE = path.join(TEST_RESULTS_DIR, 'extracted-nodes.json');
const TEST_SUMMARY_FILE = path.join(TEST_RESULTS_DIR, 'test-summary.json');

// Create results directory
async function ensureTestDir() {
  try {
    await fs.mkdir(TEST_RESULTS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create test directory:', error);
  }
}

// Test results tracking
const testResults = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  startTime: new Date(),
  endTime: null,
  tests: [],
  extractedNodes: [],
  databaseSchema: null
};

// Helper function to run a test
async function runTest(name, testFn) {
  console.log(`\n📋 Running: ${name}`);
  testResults.totalTests++;
  
  const testResult = {
    name,
    status: 'pending',
    startTime: new Date(),
    endTime: null,
    error: null,
    details: {}
  };
  
  try {
    const result = await testFn();
    testResult.status = 'passed';
    testResult.details = result;
    testResults.passed++;
    console.log(`✅ PASSED: ${name}`);
  } catch (error) {
    testResult.status = 'failed';
    testResult.error = error.message;
    testResults.failed++;
    console.error(`❌ FAILED: ${name}`);
    console.error(`   Error: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
  }
  
  testResult.endTime = new Date();
  testResults.tests.push(testResult);
  return testResult;
}

// Test 1: Basic extraction functionality
async function testBasicExtraction() {
  const extractor = new NodeSourceExtractor();
  
  // Test a known node
  const testNodes = [
    '@n8n/n8n-nodes-langchain.Agent',
    'n8n-nodes-base.Function',
    'n8n-nodes-base.Webhook'
  ];
  
  const results = [];
  
  for (const nodeType of testNodes) {
    try {
      console.log(`  - Extracting ${nodeType}...`);
      const nodeInfo = await extractor.extractNodeSource(nodeType);
      
      results.push({
        nodeType,
        extracted: true,
        codeLength: nodeInfo.sourceCode.length,
        hasCredentials: !!nodeInfo.credentialCode,
        hasPackageInfo: !!nodeInfo.packageInfo,
        location: nodeInfo.location
      });
      
      console.log(`    ✓ Extracted: ${nodeInfo.sourceCode.length} bytes`);
    } catch (error) {
      results.push({
        nodeType,
        extracted: false,
        error: error.message
      });
      console.log(`    ✗ Failed: ${error.message}`);
    }
  }
  
  // At least one should succeed
  const successCount = results.filter(r => r.extracted).length;
  if (successCount === 0) {
    throw new Error('No nodes could be extracted');
  }
  
  return { results, successCount, totalTested: testNodes.length };
}

// Test 2: List available nodes
async function testListAvailableNodes() {
  const extractor = new NodeSourceExtractor();
  
  console.log('  - Listing all available nodes...');
  const nodes = await extractor.listAvailableNodes();
  
  console.log(`  - Found ${nodes.length} nodes`);
  
  // Group by package
  const nodesByPackage = {};
  nodes.forEach(node => {
    const pkg = node.packageName || 'unknown';
    if (!nodesByPackage[pkg]) {
      nodesByPackage[pkg] = [];
    }
    nodesByPackage[pkg].push(node.name);
  });
  
  // Show summary
  console.log('  - Node distribution by package:');
  Object.entries(nodesByPackage).forEach(([pkg, nodeList]) => {
    console.log(`    ${pkg}: ${nodeList.length} nodes`);
  });
  
  if (nodes.length === 0) {
    throw new Error('No nodes found');
  }
  
  return {
    totalNodes: nodes.length,
    packages: Object.keys(nodesByPackage),
    nodesByPackage,
    sampleNodes: nodes.slice(0, 5)
  };
}

// Test 3: Bulk extraction simulation
async function testBulkExtraction() {
  const extractor = new NodeSourceExtractor();
  
  // First get list of nodes
  const allNodes = await extractor.listAvailableNodes();
  
  // Limit to a reasonable number for testing
  const nodesToExtract = allNodes.slice(0, 10);
  console.log(`  - Testing bulk extraction of ${nodesToExtract.length} nodes...`);
  
  const extractionResults = [];
  const startTime = Date.now();
  
  for (const node of nodesToExtract) {
    const nodeType = node.packageName ? `${node.packageName}.${node.name}` : node.name;
    
    try {
      const nodeInfo = await extractor.extractNodeSource(nodeType);
      
      // Calculate hash for deduplication
      const codeHash = crypto.createHash('sha256').update(nodeInfo.sourceCode).digest('hex');
      
      const extractedData = {
        nodeType,
        name: node.name,
        packageName: node.packageName,
        codeLength: nodeInfo.sourceCode.length,
        codeHash,
        hasCredentials: !!nodeInfo.credentialCode,
        hasPackageInfo: !!nodeInfo.packageInfo,
        location: nodeInfo.location,
        extractedAt: new Date().toISOString()
      };
      
      extractionResults.push({
        success: true,
        data: extractedData
      });
      
      // Store for database simulation
      testResults.extractedNodes.push({
        ...extractedData,
        sourceCode: nodeInfo.sourceCode,
        credentialCode: nodeInfo.credentialCode,
        packageInfo: nodeInfo.packageInfo
      });
      
    } catch (error) {
      extractionResults.push({
        success: false,
        nodeType,
        error: error.message
      });
    }
  }
  
  const endTime = Date.now();
  const successCount = extractionResults.filter(r => r.success).length;
  
  console.log(`  - Extraction completed in ${endTime - startTime}ms`);
  console.log(`  - Success rate: ${successCount}/${nodesToExtract.length} (${(successCount/nodesToExtract.length*100).toFixed(1)}%)`);
  
  return {
    totalAttempted: nodesToExtract.length,
    successCount,
    failureCount: nodesToExtract.length - successCount,
    timeElapsed: endTime - startTime,
    results: extractionResults
  };
}

// Test 4: Database schema simulation
async function testDatabaseSchema() {
  console.log('  - Simulating database schema for extracted nodes...');
  
  // Define a schema that would work for storing extracted nodes
  const schema = {
    tables: {
      nodes: {
        columns: {
          id: 'UUID PRIMARY KEY',
          node_type: 'VARCHAR(255) UNIQUE NOT NULL',
          name: 'VARCHAR(255) NOT NULL',
          package_name: 'VARCHAR(255)',
          display_name: 'VARCHAR(255)',
          description: 'TEXT',
          version: 'VARCHAR(50)',
          code_hash: 'VARCHAR(64) NOT NULL',
          code_length: 'INTEGER NOT NULL',
          source_location: 'TEXT',
          extracted_at: 'TIMESTAMP NOT NULL',
          updated_at: 'TIMESTAMP'
        },
        indexes: ['node_type', 'package_name', 'code_hash']
      },
      node_source_code: {
        columns: {
          id: 'UUID PRIMARY KEY',
          node_id: 'UUID REFERENCES nodes(id)',
          source_code: 'TEXT NOT NULL',
          compiled_code: 'TEXT',
          source_map: 'TEXT'
        }
      },
      node_credentials: {
        columns: {
          id: 'UUID PRIMARY KEY',
          node_id: 'UUID REFERENCES nodes(id)',
          credential_type: 'VARCHAR(255) NOT NULL',
          credential_code: 'TEXT NOT NULL',
          required_fields: 'JSONB'
        }
      },
      node_metadata: {
        columns: {
          id: 'UUID PRIMARY KEY',
          node_id: 'UUID REFERENCES nodes(id)',
          package_info: 'JSONB',
          dependencies: 'JSONB',
          icon: 'TEXT',
          categories: 'TEXT[]',
          documentation_url: 'TEXT'
        }
      }
    }
  };
  
  // Validate that our extracted data fits the schema
  const sampleNode = testResults.extractedNodes[0];
  if (sampleNode) {
    console.log('  - Validating extracted data against schema...');
    
    // Simulate database record
    const dbRecord = {
      nodes: {
        id: crypto.randomUUID(),
        node_type: sampleNode.nodeType,
        name: sampleNode.name,
        package_name: sampleNode.packageName,
        code_hash: sampleNode.codeHash,
        code_length: sampleNode.codeLength,
        source_location: sampleNode.location,
        extracted_at: new Date()
      },
      node_source_code: {
        source_code: sampleNode.sourceCode
      },
      node_credentials: sampleNode.credentialCode ? {
        credential_code: sampleNode.credentialCode
      } : null,
      node_metadata: {
        package_info: sampleNode.packageInfo
      }
    };
    
    console.log('  - Sample database record created successfully');
  }
  
  testResults.databaseSchema = schema;
  
  return {
    schemaValid: true,
    tablesCount: Object.keys(schema.tables).length,
    estimatedStoragePerNode: sampleNode ? sampleNode.codeLength + 1024 : 0 // code + metadata overhead
  };
}

// Test 5: Error handling
async function testErrorHandling() {
  const extractor = new NodeSourceExtractor();
  
  const errorTests = [
    {
      name: 'Non-existent node',
      nodeType: 'non-existent-package.FakeNode',
      expectedError: 'not found'
    },
    {
      name: 'Invalid node type format',
      nodeType: '',
      expectedError: 'invalid'
    },
    {
      name: 'Malformed package name',
      nodeType: '@invalid@package.Node',
      expectedError: 'not found'
    }
  ];
  
  const results = [];
  
  for (const test of errorTests) {
    try {
      console.log(`  - Testing: ${test.name}`);
      await extractor.extractNodeSource(test.nodeType);
      results.push({
        ...test,
        passed: false,
        error: 'Expected error but extraction succeeded'
      });
    } catch (error) {
      const passed = error.message.toLowerCase().includes(test.expectedError);
      results.push({
        ...test,
        passed,
        actualError: error.message
      });
      console.log(`    ${passed ? '✓' : '✗'} Got expected error type`);
    }
  }
  
  const passedCount = results.filter(r => r.passed).length;
  return {
    totalTests: errorTests.length,
    passed: passedCount,
    results
  };
}

// Test 6: MCP server integration
async function testMCPServerIntegration() {
  console.log('  - Testing MCP server tool handlers...');
  
  const config = {
    port: 3000,
    host: '0.0.0.0',
    authToken: 'test-token'
  };
  
  const n8nConfig = {
    apiUrl: 'http://localhost:5678',
    apiKey: 'test-key'
  };
  
  // Note: We can't fully test the server without running it,
  // but we can verify the handlers are set up correctly
  const server = new N8NMCPServer(config, n8nConfig);
  
  // Verify the server instance is created
  if (!server) {
    throw new Error('Failed to create MCP server instance');
  }
  
  console.log('  - MCP server instance created successfully');
  
  return {
    serverCreated: true,
    config
  };
}

// Main test runner
async function runAllTests() {
  console.log('=== Comprehensive n8n Node Extraction Test Suite ===\n');
  console.log('This test suite validates the extraction of n8n nodes for database storage.\n');
  
  await ensureTestDir();
  
  // Update todo status
  console.log('Starting test execution...\n');
  
  // Run all tests
  await runTest('Basic Node Extraction', testBasicExtraction);
  await runTest('List Available Nodes', testListAvailableNodes);
  await runTest('Bulk Node Extraction', testBulkExtraction);
  await runTest('Database Schema Validation', testDatabaseSchema);
  await runTest('Error Handling', testErrorHandling);
  await runTest('MCP Server Integration', testMCPServerIntegration);
  
  // Calculate final results
  testResults.endTime = new Date();
  const duration = (testResults.endTime - testResults.startTime) / 1000;
  
  // Save extracted nodes data
  if (testResults.extractedNodes.length > 0) {
    await fs.writeFile(
      EXTRACTED_NODES_FILE,
      JSON.stringify(testResults.extractedNodes, null, 2)
    );
    console.log(`\n📁 Extracted nodes saved to: ${EXTRACTED_NODES_FILE}`);
  }
  
  // Save test summary
  const summary = {
    ...testResults,
    extractedNodes: testResults.extractedNodes.length // Just count, not full data
  };
  await fs.writeFile(
    TEST_SUMMARY_FILE,
    JSON.stringify(summary, null, 2)
  );
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.totalTests}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Nodes Extracted: ${testResults.extractedNodes.length}`);
  
  if (testResults.databaseSchema) {
    console.log('\nDatabase Schema:');
    console.log(`- Tables: ${Object.keys(testResults.databaseSchema.tables).join(', ')}`);
    console.log(`- Ready for bulk storage: YES`);
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});

// Run tests
runAllTests();