#!/usr/bin/env node

const { DocumentationFetcher } = require('../dist/utils/documentation-fetcher');
const { NodeDocumentationService } = require('../dist/services/node-documentation-service');

async function testEnhancedIntegration() {
  console.log('🧪 Testing Enhanced Documentation Integration...\n');

  // Test 1: DocumentationFetcher backward compatibility
  console.log('1️⃣ Testing DocumentationFetcher backward compatibility...');
  const docFetcher = new DocumentationFetcher();
  
  try {
    // Test getNodeDocumentation (backward compatible method)
    const simpleDoc = await docFetcher.getNodeDocumentation('n8n-nodes-base.slack');
    if (simpleDoc) {
      console.log('   ✅ Simple documentation format works');
      console.log(`   - Has markdown: ${!!simpleDoc.markdown}`);
      console.log(`   - Has URL: ${!!simpleDoc.url}`);
      console.log(`   - Has examples: ${simpleDoc.examples?.length || 0}`);
    }

    // Test getEnhancedNodeDocumentation (new method)
    const enhancedDoc = await docFetcher.getEnhancedNodeDocumentation('n8n-nodes-base.slack');
    if (enhancedDoc) {
      console.log('   ✅ Enhanced documentation format works');
      console.log(`   - Title: ${enhancedDoc.title || 'N/A'}`);
      console.log(`   - Operations: ${enhancedDoc.operations?.length || 0}`);
      console.log(`   - API Methods: ${enhancedDoc.apiMethods?.length || 0}`);
      console.log(`   - Examples: ${enhancedDoc.examples?.length || 0}`);
      console.log(`   - Templates: ${enhancedDoc.templates?.length || 0}`);
      console.log(`   - Related Resources: ${enhancedDoc.relatedResources?.length || 0}`);
    }
  } catch (error) {
    console.error('   ❌ DocumentationFetcher test failed:', error.message);
  }

  // Test 2: NodeDocumentationService with enhanced fields
  console.log('\n2️⃣ Testing NodeDocumentationService enhanced schema...');
  const docService = new NodeDocumentationService('data/test-enhanced-docs.db');
  
  try {
    // Store a test node with enhanced documentation
    const testNode = {
      nodeType: 'test.enhanced-node',
      name: 'enhanced-node',
      displayName: 'Enhanced Test Node',
      description: 'A test node with enhanced documentation',
      sourceCode: 'const testCode = "example";',
      packageName: 'test-package',
      documentation: '# Test Documentation',
      documentationUrl: 'https://example.com/docs',
      documentationTitle: 'Enhanced Test Node Documentation',
      operations: [
        {
          resource: 'Message',
          operation: 'Send',
          description: 'Send a message'
        }
      ],
      apiMethods: [
        {
          resource: 'Message',
          operation: 'Send',
          apiMethod: 'chat.postMessage',
          apiUrl: 'https://api.slack.com/methods/chat.postMessage'
        }
      ],
      documentationExamples: [
        {
          title: 'Send Message Example',
          type: 'json',
          code: '{"text": "Hello World"}'
        }
      ],
      templates: [
        {
          name: 'Basic Message Template',
          description: 'Simple message sending template'
        }
      ],
      relatedResources: [
        {
          title: 'API Documentation',
          url: 'https://api.slack.com',
          type: 'api'
        }
      ],
      requiredScopes: ['chat:write'],
      hasCredentials: true,
      isTrigger: false,
      isWebhook: false
    };

    await docService.storeNode(testNode);
    console.log('   ✅ Stored node with enhanced documentation');

    // Retrieve and verify
    const retrieved = await docService.getNodeInfo('test.enhanced-node');
    if (retrieved) {
      console.log('   ✅ Retrieved node with enhanced fields:');
      console.log(`   - Has operations: ${!!retrieved.operations}`);
      console.log(`   - Has API methods: ${!!retrieved.apiMethods}`);
      console.log(`   - Has documentation examples: ${!!retrieved.documentationExamples}`);
      console.log(`   - Has templates: ${!!retrieved.templates}`);
      console.log(`   - Has related resources: ${!!retrieved.relatedResources}`);
      console.log(`   - Has required scopes: ${!!retrieved.requiredScopes}`);
    }

    // Test search
    const searchResults = await docService.searchNodes({ query: 'enhanced' });
    console.log(`   ✅ Search found ${searchResults.length} results`);

  } catch (error) {
    console.error('   ❌ NodeDocumentationService test failed:', error.message);
  } finally {
    docService.close();
  }

  // Test 3: MCP Server integration
  console.log('\n3️⃣ Testing MCP Server integration...');
  try {
    const { N8NMCPServer } = require('../dist/mcp/server');
    console.log('   ✅ MCP Server loads with enhanced documentation support');
    
    // Check if new tools are available
    const { n8nTools } = require('../dist/mcp/tools');
    const enhancedTools = [
      'get_node_documentation',
      'search_node_documentation',
      'get_node_operations',
      'get_node_examples'
    ];
    
    const hasAllTools = enhancedTools.every(toolName => 
      n8nTools.some(tool => tool.name === toolName)
    );
    
    if (hasAllTools) {
      console.log('   ✅ All enhanced documentation tools are available');
      enhancedTools.forEach(toolName => {
        const tool = n8nTools.find(t => t.name === toolName);
        console.log(`   - ${toolName}: ${tool.description}`);
      });
    } else {
      console.log('   ⚠️  Some enhanced tools are missing');
    }
    
  } catch (error) {
    console.error('   ❌ MCP Server integration test failed:', error.message);
  }

  console.log('\n✨ Enhanced documentation integration tests completed!');
  
  // Cleanup
  await docFetcher.cleanup();
}

// Run tests
testEnhancedIntegration().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});