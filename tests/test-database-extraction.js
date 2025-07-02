#!/usr/bin/env node

/**
 * Test node extraction for database storage
 * Focus on extracting known nodes with proper structure for DB storage
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Import our extractor
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');

// Known n8n nodes to test
const KNOWN_NODES = [
  // Core nodes
  { type: 'n8n-nodes-base.Function', package: 'n8n-nodes-base', name: 'Function' },
  { type: 'n8n-nodes-base.Webhook', package: 'n8n-nodes-base', name: 'Webhook' },
  { type: 'n8n-nodes-base.HttpRequest', package: 'n8n-nodes-base', name: 'HttpRequest' },
  { type: 'n8n-nodes-base.If', package: 'n8n-nodes-base', name: 'If' },
  { type: 'n8n-nodes-base.SplitInBatches', package: 'n8n-nodes-base', name: 'SplitInBatches' },
  
  // AI nodes
  { type: '@n8n/n8n-nodes-langchain.Agent', package: '@n8n/n8n-nodes-langchain', name: 'Agent' },
  { type: '@n8n/n8n-nodes-langchain.OpenAiAssistant', package: '@n8n/n8n-nodes-langchain', name: 'OpenAiAssistant' },
  { type: '@n8n/n8n-nodes-langchain.ChainLlm', package: '@n8n/n8n-nodes-langchain', name: 'ChainLlm' },
  
  // Integration nodes
  { type: 'n8n-nodes-base.Airtable', package: 'n8n-nodes-base', name: 'Airtable' },
  { type: 'n8n-nodes-base.GoogleSheets', package: 'n8n-nodes-base', name: 'GoogleSheets' },
  { type: 'n8n-nodes-base.Slack', package: 'n8n-nodes-base', name: 'Slack' },
  { type: 'n8n-nodes-base.Discord', package: 'n8n-nodes-base', name: 'Discord' },
];

// Database schema for storing nodes
const DB_SCHEMA = `
-- Main nodes table
CREATE TABLE IF NOT EXISTS nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  description TEXT,
  version VARCHAR(50),
  code_hash VARCHAR(64) NOT NULL,
  code_length INTEGER NOT NULL,
  source_location TEXT NOT NULL,
  has_credentials BOOLEAN DEFAULT FALSE,
  extracted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT idx_node_type UNIQUE (node_type),
  INDEX idx_package_name (package_name),
  INDEX idx_code_hash (code_hash)
);

-- Source code storage
CREATE TABLE IF NOT EXISTS node_source_code (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  source_code TEXT NOT NULL,
  minified_code TEXT,
  source_map TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT idx_node_source UNIQUE (node_id)
);

-- Credentials definitions
CREATE TABLE IF NOT EXISTS node_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  credential_type VARCHAR(255) NOT NULL,
  credential_code TEXT NOT NULL,
  required_fields JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  INDEX idx_node_credentials (node_id)
);

-- Package metadata
CREATE TABLE IF NOT EXISTS node_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name VARCHAR(255) UNIQUE NOT NULL,
  version VARCHAR(50),
  description TEXT,
  author VARCHAR(255),
  license VARCHAR(50),
  repository_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Node dependencies
CREATE TABLE IF NOT EXISTS node_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  depends_on_node_id UUID NOT NULL REFERENCES nodes(id),
  dependency_type VARCHAR(50), -- 'extends', 'imports', 'requires'
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_dependency UNIQUE (node_id, depends_on_node_id)
);
`;

async function main() {
  console.log('=== n8n Node Extraction for Database Storage Test ===\n');
  
  const extractor = new NodeSourceExtractor();
  const results = {
    tested: 0,
    extracted: 0,
    failed: 0,
    nodes: [],
    errors: [],
    totalSize: 0
  };
  
  // Create output directory
  const outputDir = path.join(__dirname, 'extracted-nodes-db');
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log(`Testing extraction of ${KNOWN_NODES.length} known nodes...\n`);
  
  // Extract each node
  for (const nodeConfig of KNOWN_NODES) {
    console.log(`📦 Extracting: ${nodeConfig.type}`);
    results.tested++;
    
    try {
      const startTime = Date.now();
      const nodeInfo = await extractor.extractNodeSource(nodeConfig.type);
      const extractTime = Date.now() - startTime;
      
      // Calculate hash for deduplication
      const codeHash = crypto.createHash('sha256').update(nodeInfo.sourceCode).digest('hex');
      
      // Prepare database record
      const dbRecord = {
        // Primary data
        node_type: nodeConfig.type,
        name: nodeConfig.name,
        package_name: nodeConfig.package,
        code_hash: codeHash,
        code_length: nodeInfo.sourceCode.length,
        source_location: nodeInfo.location,
        has_credentials: !!nodeInfo.credentialCode,
        
        // Source code (separate table in real DB)
        source_code: nodeInfo.sourceCode,
        credential_code: nodeInfo.credentialCode,
        
        // Package info
        package_info: nodeInfo.packageInfo,
        
        // Metadata
        extraction_time_ms: extractTime,
        extracted_at: new Date().toISOString()
      };
      
      results.nodes.push(dbRecord);
      results.extracted++;
      results.totalSize += nodeInfo.sourceCode.length;
      
      console.log(`  ✅ Success: ${nodeInfo.sourceCode.length} bytes (${extractTime}ms)`);
      console.log(`  📍 Location: ${nodeInfo.location}`);
      console.log(`  🔑 Hash: ${codeHash.substring(0, 12)}...`);
      
      if (nodeInfo.credentialCode) {
        console.log(`  🔐 Has credentials: ${nodeInfo.credentialCode.length} bytes`);
      }
      
      // Save individual node data
      const nodeFile = path.join(outputDir, `${nodeConfig.package}__${nodeConfig.name}.json`);
      await fs.writeFile(nodeFile, JSON.stringify(dbRecord, null, 2));
      
    } catch (error) {
      results.failed++;
      results.errors.push({
        node: nodeConfig.type,
        error: error.message
      });
      console.log(`  ❌ Failed: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Generate summary report
  const successRate = ((results.extracted / results.tested) * 100).toFixed(1);
  
  console.log('='.repeat(60));
  console.log('EXTRACTION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total nodes tested: ${results.tested}`);
  console.log(`Successfully extracted: ${results.extracted} (${successRate}%)`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Total code size: ${(results.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Average node size: ${(results.totalSize / results.extracted / 1024).toFixed(2)} KB`);
  
  // Test database insertion simulation
  console.log('\n📊 Database Storage Simulation:');
  console.log('--------------------------------');
  
  if (results.extracted > 0) {
    // Group by package
    const packages = {};
    results.nodes.forEach(node => {
      if (!packages[node.package_name]) {
        packages[node.package_name] = {
          name: node.package_name,
          nodes: [],
          totalSize: 0
        };
      }
      packages[node.package_name].nodes.push(node.name);
      packages[node.package_name].totalSize += node.code_length;
    });
    
    console.log('\nPackages:');
    Object.values(packages).forEach(pkg => {
      console.log(`  📦 ${pkg.name}`);
      console.log(`     Nodes: ${pkg.nodes.length}`);
      console.log(`     Total size: ${(pkg.totalSize / 1024).toFixed(2)} KB`);
      console.log(`     Nodes: ${pkg.nodes.join(', ')}`);
    });
    
    // Save database-ready JSON
    const dbData = {
      schema: DB_SCHEMA,
      extracted_at: new Date().toISOString(),
      statistics: {
        total_nodes: results.extracted,
        total_size_bytes: results.totalSize,
        packages: Object.keys(packages).length,
        success_rate: successRate
      },
      nodes: results.nodes
    };
    
    const dbFile = path.join(outputDir, 'database-import.json');
    await fs.writeFile(dbFile, JSON.stringify(dbData, null, 2));
    console.log(`\n💾 Database import file saved: ${dbFile}`);
    
    // Create SQL insert statements
    const sqlFile = path.join(outputDir, 'insert-nodes.sql');
    let sql = '-- Auto-generated SQL for n8n nodes\n\n';
    
    results.nodes.forEach(node => {
      sql += `-- Node: ${node.node_type}\n`;
      sql += `INSERT INTO nodes (node_type, name, package_name, code_hash, code_length, source_location, has_credentials)\n`;
      sql += `VALUES ('${node.node_type}', '${node.name}', '${node.package_name}', '${node.code_hash}', ${node.code_length}, '${node.source_location}', ${node.has_credentials});\n\n`;
    });
    
    await fs.writeFile(sqlFile, sql);
    console.log(`📝 SQL insert file saved: ${sqlFile}`);
  }
  
  // Save full report
  const reportFile = path.join(outputDir, 'extraction-report.json');
  await fs.writeFile(reportFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full report saved: ${reportFile}`);
  
  // Show any errors
  if (results.errors.length > 0) {
    console.log('\n⚠️  Extraction Errors:');
    results.errors.forEach(err => {
      console.log(`  - ${err.node}: ${err.error}`);
    });
  }
  
  console.log('\n✨ Database extraction test completed!');
  console.log(`📁 Results saved in: ${outputDir}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the test
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});