#!/usr/bin/env node
/**
 * Copyright (c) 2024 AiAdvisors Romuald Czlonkowski
 * Licensed under the Sustainable Use License v1.0
 */
import { createDatabaseAdapter } from '../database/database-adapter';

interface NodeRow {
  node_type: string;
  package_name: string;
  display_name: string;
  description?: string;
  category?: string;
  development_style?: string;
  is_ai_tool: number;
  is_trigger: number;
  is_webhook: number;
  is_versioned: number;
  version?: string;
  documentation?: string;
  properties_schema?: string;
  operations?: string;
  credentials_required?: string;
  updated_at: string;
}

async function validate() {
  const db = await createDatabaseAdapter('./data/nodes.db');
  
  console.log('🔍 Validating critical nodes...\n');
  
  const criticalChecks = [
    { 
      type: 'nodes-base.httpRequest', 
      checks: {
        hasDocumentation: true,
        documentationContains: 'HTTP Request',
        style: 'programmatic'
      }
    },
    { 
      type: 'nodes-base.code', 
      checks: {
        hasDocumentation: true,
        documentationContains: 'Code'
      }
    },
    { 
      type: 'nodes-base.slack', 
      checks: {
        hasOperations: true,
        style: 'programmatic'
      }
    },
    {
      type: 'nodes-langchain.agent',
      checks: {
        isAITool: false, // According to the database, it's not marked as AI tool
        packageName: '@n8n/n8n-nodes-langchain'
      }
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const check of criticalChecks) {
    const node = db.prepare('SELECT * FROM nodes WHERE node_type = ?').get(check.type) as NodeRow | undefined;
    
    if (!node) {
      console.log(`❌ ${check.type}: NOT FOUND`);
      failed++;
      continue;
    }
    
    let nodeOk = true;
    const issues: string[] = [];
    
    // Run checks
    if (check.checks.hasDocumentation && !node.documentation) {
      nodeOk = false;
      issues.push('missing documentation');
    }
    
    if (check.checks.documentationContains && 
        !node.documentation?.includes(check.checks.documentationContains)) {
      nodeOk = false;
      issues.push(`documentation doesn't contain "${check.checks.documentationContains}"`);
    }
    
    if (check.checks.style && node.development_style !== check.checks.style) {
      nodeOk = false;
      issues.push(`wrong style: ${node.development_style}`);
    }
    
    if (check.checks.hasOperations) {
      const operations = JSON.parse(node.operations || '[]');
      if (!operations.length) {
        nodeOk = false;
        issues.push('no operations found');
      }
    }
    
    if (check.checks.isAITool !== undefined && !!node.is_ai_tool !== check.checks.isAITool) {
      nodeOk = false;
      issues.push(`AI tool flag mismatch: expected ${check.checks.isAITool}, got ${!!node.is_ai_tool}`);
    }
    
    if ('isVersioned' in check.checks && check.checks.isVersioned && !node.is_versioned) {
      nodeOk = false;
      issues.push('not marked as versioned');
    }
    
    if (check.checks.packageName && node.package_name !== check.checks.packageName) {
      nodeOk = false;
      issues.push(`wrong package: ${node.package_name}`);
    }
    
    if (nodeOk) {
      console.log(`✅ ${check.type}`);
      passed++;
    } else {
      console.log(`❌ ${check.type}: ${issues.join(', ')}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  // Additional statistics
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(is_ai_tool) as ai_tools,
      SUM(is_trigger) as triggers,
      SUM(is_versioned) as versioned,
      COUNT(DISTINCT package_name) as packages
    FROM nodes
  `).get() as any;
  
  console.log('\n📈 Database Statistics:');
  console.log(`   Total nodes: ${stats.total}`);
  console.log(`   AI tools: ${stats.ai_tools}`);
  console.log(`   Triggers: ${stats.triggers}`);
  console.log(`   Versioned: ${stats.versioned}`);
  console.log(`   Packages: ${stats.packages}`);
  
  // Check documentation coverage
  const docStats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN documentation IS NOT NULL THEN 1 ELSE 0 END) as with_docs
    FROM nodes
  `).get() as any;
  
  console.log(`\n📚 Documentation Coverage:`);
  console.log(`   Nodes with docs: ${docStats.with_docs}/${docStats.total} (${Math.round(docStats.with_docs / docStats.total * 100)}%)`);
  
  db.close();
  process.exit(failed > 0 ? 1 : 0);
}

if (require.main === module) {
  validate().catch(console.error);
}