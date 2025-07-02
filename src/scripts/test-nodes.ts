#!/usr/bin/env node
/**
 * Copyright (c) 2024 AiAdvisors Romuald Czlonkowski
 * Licensed under the Sustainable Use License v1.0
 */
import { createDatabaseAdapter } from '../database/database-adapter';
import { NodeRepository } from '../database/node-repository';

const TEST_CASES = [
  {
    nodeType: 'nodes-base.httpRequest',
    checks: {
      hasProperties: true,
      minProperties: 5,
      hasDocumentation: true,
      isVersioned: true
    }
  },
  {
    nodeType: 'nodes-base.slack',
    checks: {
      hasOperations: true,
      minOperations: 10,
      style: 'declarative'
    }
  },
  {
    nodeType: 'nodes-base.code',
    checks: {
      hasProperties: true,
      properties: ['mode', 'language', 'jsCode']
    }
  }
];

async function runTests() {
  const db = await createDatabaseAdapter('./data/nodes.db');
  const repository = new NodeRepository(db);
  
  console.log('🧪 Running node tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TEST_CASES) {
    console.log(`Testing ${testCase.nodeType}...`);
    
    try {
      const node = repository.getNode(testCase.nodeType);
      
      if (!node) {
        throw new Error('Node not found');
      }
      
      // Run checks
      for (const [check, expected] of Object.entries(testCase.checks)) {
        switch (check) {
          case 'hasProperties':
            if (expected && node.properties.length === 0) {
              throw new Error('No properties found');
            }
            break;
            
          case 'minProperties':
            if (node.properties.length < expected) {
              throw new Error(`Expected at least ${expected} properties, got ${node.properties.length}`);
            }
            break;
            
          case 'hasOperations':
            if (expected && node.operations.length === 0) {
              throw new Error('No operations found');
            }
            break;
            
          case 'minOperations':
            if (node.operations.length < expected) {
              throw new Error(`Expected at least ${expected} operations, got ${node.operations.length}`);
            }
            break;
            
          case 'properties':
            const propNames = node.properties.map((p: any) => p.name);
            for (const prop of expected as string[]) {
              if (!propNames.includes(prop)) {
                throw new Error(`Missing property: ${prop}`);
              }
            }
            break;
        }
      }
      
      console.log(`✅ ${testCase.nodeType} passed all checks\n`);
      passed++;
    } catch (error) {
      console.error(`❌ ${testCase.nodeType} failed: ${(error as Error).message}\n`);
      failed++;
    }
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  db.close();
}

if (require.main === module) {
  runTests().catch(console.error);
}