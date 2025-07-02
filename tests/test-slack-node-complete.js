#!/usr/bin/env node

const { NodeDocumentationService } = require('../dist/services/node-documentation-service');
const { EnhancedDocumentationFetcher } = require('../dist/utils/documentation-fetcher');
const { NodeSourceExtractor } = require('../dist/utils/node-source-extractor');
const path = require('path');

async function testSlackNode() {
  console.log('🧪 Testing Slack Node Complete Information Extraction\n');
  
  const dbPath = path.join(__dirname, '../data/test-slack.db');
  const service = new NodeDocumentationService(dbPath);
  const fetcher = new EnhancedDocumentationFetcher();
  const extractor = new NodeSourceExtractor();
  
  try {
    console.log('📚 Fetching Slack node documentation...');
    const docs = await fetcher.getEnhancedNodeDocumentation('n8n-nodes-base.Slack');
    
    console.log('\n✅ Documentation Structure:');
    console.log(`- Title: ${docs.title}`);
    console.log(`- Has markdown: ${docs.markdown?.length > 0 ? 'Yes' : 'No'} (${docs.markdown?.length || 0} chars)`);
    console.log(`- Operations: ${docs.operations?.length || 0}`);
    console.log(`- API Methods: ${docs.apiMethods?.length || 0}`);
    console.log(`- Examples: ${docs.examples?.length || 0}`);
    console.log(`- Templates: ${docs.templates?.length || 0}`);
    console.log(`- Related Resources: ${docs.relatedResources?.length || 0}`);
    console.log(`- Required Scopes: ${docs.requiredScopes?.length || 0}`);
    
    console.log('\n📋 Operations by Resource:');
    const resourceMap = new Map();
    if (docs.operations) {
      docs.operations.forEach(op => {
        if (!resourceMap.has(op.resource)) {
          resourceMap.set(op.resource, []);
        }
        resourceMap.get(op.resource).push(op);
      });
    }
    
    for (const [resource, ops] of resourceMap) {
      console.log(`\n  ${resource}:`);
      ops.forEach(op => {
        console.log(`    - ${op.operation}: ${op.description}`);
      });
    }
    
    console.log('\n🔌 Sample API Methods:');
    if (docs.apiMethods) {
      docs.apiMethods.slice(0, 5).forEach(method => {
        console.log(`  - ${method.operation} → ${method.apiMethod}`);
      });
    }
    
    console.log('\n💻 Extracting Slack node source code...');
    const sourceInfo = await extractor.extractNodeSource('n8n-nodes-base.Slack');
    
    console.log('\n✅ Source Code Extraction:');
    console.log(`- Has source code: ${sourceInfo.sourceCode ? 'Yes' : 'No'} (${sourceInfo.sourceCode?.length || 0} chars)`);
    console.log(`- Has credential code: ${sourceInfo.credentialCode ? 'Yes' : 'No'} (${sourceInfo.credentialCode?.length || 0} chars)`);
    console.log(`- Package name: ${sourceInfo.packageInfo?.name}`);
    console.log(`- Package version: ${sourceInfo.packageInfo?.version}`);
    
    // Store in database
    console.log('\n💾 Storing in database...');
    await service.storeNode({
      nodeType: 'n8n-nodes-base.Slack',
      name: 'Slack',
      displayName: 'Slack',
      description: 'Send and receive messages, manage channels, and more',
      category: 'Communication',
      documentationUrl: docs?.url || 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.slack/',
      documentationMarkdown: docs?.markdown,
      documentationTitle: docs?.title,
      operations: docs?.operations,
      apiMethods: docs?.apiMethods,
      documentationExamples: docs?.examples,
      templates: docs?.templates,
      relatedResources: docs?.relatedResources,
      requiredScopes: docs?.requiredScopes,
      sourceCode: sourceInfo.sourceCode || '',
      credentialCode: sourceInfo.credentialCode,
      packageName: sourceInfo.packageInfo?.name || 'n8n-nodes-base',
      version: sourceInfo.packageInfo?.version,
      hasCredentials: true,
      isTrigger: false,
      isWebhook: false
    });
    
    // Retrieve and verify
    console.log('\n🔍 Retrieving from database...');
    const storedNode = await service.getNodeInfo('n8n-nodes-base.Slack');
    
    console.log('\n✅ Verification Results:');
    console.log(`- Node found: ${storedNode ? 'Yes' : 'No'}`);
    if (storedNode) {
      console.log(`- Has operations: ${storedNode.operations?.length > 0 ? 'Yes' : 'No'} (${storedNode.operations?.length || 0})`);
      console.log(`- Has API methods: ${storedNode.apiMethods?.length > 0 ? 'Yes' : 'No'} (${storedNode.apiMethods?.length || 0})`);
      console.log(`- Has examples: ${storedNode.documentationExamples?.length > 0 ? 'Yes' : 'No'} (${storedNode.documentationExamples?.length || 0})`);
      console.log(`- Has source code: ${storedNode.sourceCode ? 'Yes' : 'No'}`);
      console.log(`- Has credential code: ${storedNode.credentialCode ? 'Yes' : 'No'}`);
    }
    
    // Test search
    console.log('\n🔍 Testing search...');
    const searchResults = await service.searchNodes('message send');
    const slackInResults = searchResults.some(r => r.nodeType === 'n8n-nodes-base.Slack');
    console.log(`- Slack found in search results: ${slackInResults ? 'Yes' : 'No'}`);
    
    console.log('\n✅ Complete Information Test Summary:');
    const hasCompleteInfo = 
      storedNode &&
      storedNode.operations?.length > 0 &&
      storedNode.apiMethods?.length > 0 &&
      storedNode.sourceCode &&
      storedNode.documentationMarkdown;
    
    console.log(`- Has complete information: ${hasCompleteInfo ? '✅ YES' : '❌ NO'}`);
    
    if (!hasCompleteInfo) {
      console.log('\n❌ Missing Information:');
      if (!storedNode) console.log('  - Node not stored properly');
      if (!storedNode?.operations?.length) console.log('  - No operations extracted');
      if (!storedNode?.apiMethods?.length) console.log('  - No API methods extracted');
      if (!storedNode?.sourceCode) console.log('  - No source code extracted');
      if (!storedNode?.documentationMarkdown) console.log('  - No documentation extracted');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await service.close();
  }
}

// Run the test
testSlackNode().catch(console.error);