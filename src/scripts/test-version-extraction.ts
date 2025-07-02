import { NodeParser } from '../parsers/node-parser';

// Test script to verify version extraction from different node types

async function testVersionExtraction() {
  console.log('Testing version extraction from different node types...\n');
  
  const parser = new NodeParser();
  
  // Test cases
  const testCases = [
    {
      name: 'Gmail Trigger (version array)',
      nodeType: 'nodes-base.gmailTrigger',
      expectedVersion: '1.2',
      expectedVersioned: true
    },
    {
      name: 'HTTP Request (VersionedNodeType)',
      nodeType: 'nodes-base.httpRequest',
      expectedVersion: '4.2',
      expectedVersioned: true
    },
    {
      name: 'Code (version array)',
      nodeType: 'nodes-base.code',
      expectedVersion: '2',
      expectedVersioned: true
    }
  ];
  
  // Load nodes from packages
  const basePackagePath = process.cwd() + '/node_modules/n8n/node_modules/n8n-nodes-base';
  
  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.name}`);
    console.log(`Node Type: ${testCase.nodeType}`);
    
    try {
      // Find the node file
      const nodeName = testCase.nodeType.split('.')[1];
      
      // Try different paths
      const possiblePaths = [
        `${basePackagePath}/dist/nodes/${nodeName}.node.js`,
        `${basePackagePath}/dist/nodes/Google/Gmail/GmailTrigger.node.js`,
        `${basePackagePath}/dist/nodes/HttpRequest/HttpRequest.node.js`,
        `${basePackagePath}/dist/nodes/Code/Code.node.js`
      ];
      
      let nodeClass = null;
      for (const path of possiblePaths) {
        try {
          const module = require(path);
          nodeClass = module[Object.keys(module)[0]];
          if (nodeClass) break;
        } catch (e) {
          // Try next path
        }
      }
      
      if (!nodeClass) {
        console.log('❌ Could not load node');
        continue;
      }
      
      // Parse the node
      const parsed = parser.parse(nodeClass, 'n8n-nodes-base');
      
      console.log(`Loaded node: ${parsed.displayName} (${parsed.nodeType})`);
      console.log(`Extracted version: ${parsed.version}`);
      console.log(`Is versioned: ${parsed.isVersioned}`);
      console.log(`Expected version: ${testCase.expectedVersion}`);
      console.log(`Expected versioned: ${testCase.expectedVersioned}`);
      
      if (parsed.version === testCase.expectedVersion && 
          parsed.isVersioned === testCase.expectedVersioned) {
        console.log('✅ PASS');
      } else {
        console.log('❌ FAIL');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Run the test
testVersionExtraction().catch(console.error);