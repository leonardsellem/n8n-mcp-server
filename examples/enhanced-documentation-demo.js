#!/usr/bin/env node

const { DocumentationFetcher } = require('../dist/utils/documentation-fetcher');

async function demonstrateEnhancedDocumentation() {
  console.log('🎯 Enhanced Documentation Demo\n');
  
  const fetcher = new DocumentationFetcher();
  const nodeType = 'n8n-nodes-base.slack';
  
  console.log(`Fetching enhanced documentation for: ${nodeType}\n`);
  
  try {
    const doc = await fetcher.getEnhancedNodeDocumentation(nodeType);
    
    if (!doc) {
      console.log('No documentation found for this node.');
      return;
    }
    
    // Display title and description
    console.log('📄 Basic Information:');
    console.log(`Title: ${doc.title || 'N/A'}`);
    console.log(`URL: ${doc.url}`);
    console.log(`Description: ${doc.description || 'See documentation for details'}\n`);
    
    // Display operations
    if (doc.operations && doc.operations.length > 0) {
      console.log('⚙️  Available Operations:');
      // Group by resource
      const resourceMap = new Map();
      doc.operations.forEach(op => {
        if (!resourceMap.has(op.resource)) {
          resourceMap.set(op.resource, []);
        }
        resourceMap.get(op.resource).push(op);
      });
      
      resourceMap.forEach((ops, resource) => {
        console.log(`\n  ${resource}:`);
        ops.forEach(op => {
          console.log(`    - ${op.operation}: ${op.description}`);
        });
      });
      console.log('');
    }
    
    // Display API methods
    if (doc.apiMethods && doc.apiMethods.length > 0) {
      console.log('🔌 API Method Mappings (first 5):');
      doc.apiMethods.slice(0, 5).forEach(method => {
        console.log(`  ${method.resource}.${method.operation} → ${method.apiMethod}`);
        if (method.apiUrl) {
          console.log(`    Documentation: ${method.apiUrl}`);
        }
      });
      console.log(`  ... and ${Math.max(0, doc.apiMethods.length - 5)} more\n`);
    }
    
    // Display templates
    if (doc.templates && doc.templates.length > 0) {
      console.log('📋 Available Templates:');
      doc.templates.forEach(template => {
        console.log(`  - ${template.name}`);
        if (template.description) {
          console.log(`    ${template.description}`);
        }
      });
      console.log('');
    }
    
    // Display related resources
    if (doc.relatedResources && doc.relatedResources.length > 0) {
      console.log('🔗 Related Resources:');
      doc.relatedResources.forEach(resource => {
        console.log(`  - ${resource.title} (${resource.type})`);
        console.log(`    ${resource.url}`);
      });
      console.log('');
    }
    
    // Display required scopes
    if (doc.requiredScopes && doc.requiredScopes.length > 0) {
      console.log('🔐 Required Scopes:');
      doc.requiredScopes.forEach(scope => {
        console.log(`  - ${scope}`);
      });
      console.log('');
    }
    
    // Display summary
    console.log('📊 Summary:');
    console.log(`  - Total operations: ${doc.operations?.length || 0}`);
    console.log(`  - Total API methods: ${doc.apiMethods?.length || 0}`);
    console.log(`  - Code examples: ${doc.examples?.length || 0}`);
    console.log(`  - Templates: ${doc.templates?.length || 0}`);
    console.log(`  - Related resources: ${doc.relatedResources?.length || 0}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await fetcher.cleanup();
  }
}

// Run demo
demonstrateEnhancedDocumentation().catch(console.error);