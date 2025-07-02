#!/usr/bin/env node
import { createDatabaseAdapter } from '../database/database-adapter';
import { TemplateService } from '../templates/template-service';
import * as fs from 'fs';
import * as path from 'path';

async function testTemplates() {
  console.log('🧪 Testing template functionality...\n');
  
  // Initialize database
  const db = await createDatabaseAdapter('./data/nodes.db');
  
  // Apply schema if needed
  const schema = fs.readFileSync(path.join(__dirname, '../../src/database/schema.sql'), 'utf8');
  db.exec(schema);
  
  // Create service
  const service = new TemplateService(db);
  
  try {
    // Get statistics
    const stats = await service.getTemplateStats();
    console.log('📊 Template Database Stats:');
    console.log(`   Total templates: ${stats.totalTemplates}`);
    
    if (stats.totalTemplates === 0) {
      console.log('\n⚠️  No templates found in database!');
      console.log('   Run "npm run fetch:templates" to populate the database.\n');
      return;
    }
    
    console.log(`   Average views: ${stats.averageViews}`);
    console.log('\n🔝 Most used nodes in templates:');
    stats.topUsedNodes.forEach((node: any, i: number) => {
      console.log(`   ${i + 1}. ${node.node} (${node.count} templates)`);
    });
    
    // Test search
    console.log('\n🔍 Testing search for "webhook":');
    const searchResults = await service.searchTemplates('webhook', 3);
    searchResults.forEach((t: any) => {
      console.log(`   - ${t.name} (${t.views} views)`);
    });
    
    // Test node-based search
    console.log('\n🔍 Testing templates with HTTP Request node:');
    const httpTemplates = await service.listNodeTemplates(['n8n-nodes-base.httpRequest'], 3);
    httpTemplates.forEach((t: any) => {
      console.log(`   - ${t.name} (${t.nodes.length} nodes)`);
    });
    
    // Test task-based search
    console.log('\n🔍 Testing AI automation templates:');
    const aiTemplates = await service.getTemplatesForTask('ai_automation');
    aiTemplates.forEach((t: any) => {
      console.log(`   - ${t.name} by @${t.author.username}`);
    });
    
    // Get a specific template
    if (searchResults.length > 0) {
      const templateId = searchResults[0].id;
      console.log(`\n📄 Getting template ${templateId} details...`);
      const template = await service.getTemplate(templateId);
      if (template) {
        console.log(`   Name: ${template.name}`);
        console.log(`   Nodes: ${template.nodes.join(', ')}`);
        console.log(`   Workflow has ${template.workflow.nodes.length} nodes`);
      }
    }
    
    console.log('\n✅ All template tests passed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
  
  // Close database
  if ('close' in db && typeof db.close === 'function') {
    db.close();
  }
}

// Run if called directly
if (require.main === module) {
  testTemplates().catch(console.error);
}

export { testTemplates };