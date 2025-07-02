#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the NodeSourceExtractor
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');

async function testExtraction() {
  console.log('=== Direct Node Extraction Test ===\n');
  
  const extractor = new NodeSourceExtractor();
  
  // Test extraction of AI Agent node
  const nodeType = '@n8n/n8n-nodes-langchain.Agent';
  
  console.log(`Testing extraction of: ${nodeType}`);
  
  // First, let's debug what paths are being searched
  console.log('\nSearching in paths:');
  const searchPaths = [
    '/usr/local/lib/node_modules/n8n/node_modules',
    '/app/node_modules',
    '/home/node/.n8n/custom/nodes',
    './node_modules'
  ];
  
  for (const basePath of searchPaths) {
    console.log(`- ${basePath}`);
    try {
      const exists = fs.existsSync(basePath);
      console.log(`  Exists: ${exists}`);
      if (exists) {
        const items = fs.readdirSync(basePath).slice(0, 5);
        console.log(`  Sample items: ${items.join(', ')}...`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  }
  
  try {
    const result = await extractor.extractNodeSource(nodeType, true);
    
    console.log('\n✅ Extraction successful!');
    console.log(`Source file: ${result.location}`);
    console.log(`Code length: ${result.sourceCode.length} characters`);
    console.log(`Credential code found: ${result.credentialCode ? 'Yes' : 'No'}`);
    console.log(`Package.json found: ${result.packageInfo ? 'Yes' : 'No'}`);
    
    // Show first 500 characters of the code
    console.log('\nFirst 500 characters of code:');
    console.log('=' .repeat(60));
    console.log(result.sourceCode.substring(0, 500) + '...');
    console.log('=' .repeat(60));
    
    // Show credential code if found
    if (result.credentialCode) {
      console.log('\nCredential code found!');
      console.log('First 200 characters of credential code:');
      console.log(result.credentialCode.substring(0, 200) + '...');
    }
    
    // Check if we can find it in Docker volume
    const dockerPath = '/usr/local/lib/node_modules/n8n/node_modules/.pnpm/@n8n+n8n-nodes-langchain@file+packages+@n8n+nodes-langchain_f35e7d377a7fe4d08dc2766706b5dbff/node_modules/@n8n/n8n-nodes-langchain/dist/nodes/agents/Agent/Agent.node.js';
    
    if (fs.existsSync(dockerPath)) {
      console.log('\n✅ File also found in expected Docker path');
      const dockerContent = fs.readFileSync(dockerPath, 'utf8');
      console.log(`Docker file size: ${dockerContent.length} bytes`);
    }
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testExtraction().catch(console.error);