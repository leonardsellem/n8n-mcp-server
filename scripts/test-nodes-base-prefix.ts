#!/usr/bin/env tsx

/**
 * Specific test for nodes-base. prefix validation
 */

import { WorkflowValidator } from '../src/services/workflow-validator';
import { EnhancedConfigValidator } from '../src/services/enhanced-config-validator';
import { NodeRepository } from '../src/database/node-repository';
import { createDatabaseAdapter } from '../src/database/database-adapter';
import { Logger } from '../src/utils/logger';

const logger = new Logger({ prefix: '[TestNodesBasePrefix]' });

async function testValidation() {
  const adapter = await createDatabaseAdapter('./data/nodes.db');
  const repository = new NodeRepository(adapter);
  const validator = new WorkflowValidator(repository, EnhancedConfigValidator);

  logger.info('Testing nodes-base. prefix validation...\n');

  // Test various nodes-base. prefixed types
  const testCases = [
    { type: 'nodes-base.webhook', expected: 'n8n-nodes-base.webhook' },
    { type: 'nodes-base.httpRequest', expected: 'n8n-nodes-base.httpRequest' },
    { type: 'nodes-base.set', expected: 'n8n-nodes-base.set' },
    { type: 'nodes-base.code', expected: 'n8n-nodes-base.code' },
    { type: 'nodes-base.slack', expected: 'n8n-nodes-base.slack' },
  ];

  for (const testCase of testCases) {
    const workflow = {
      name: `Test ${testCase.type}`,
      nodes: [{
        id: 'test-node',
        name: 'Test Node',
        type: testCase.type,
        typeVersion: 1,
        position: [100, 100] as [number, number],
        parameters: {}
      }],
      connections: {}
    };

    logger.info(`Testing: "${testCase.type}"`);
    const result = await validator.validateWorkflow(workflow as any);
    
    const nodeTypeError = result.errors.find(err => 
      err && typeof err === 'object' && 'message' in err && 
      err.message.includes(testCase.type) && 
      err.message.includes(testCase.expected)
    );

    if (nodeTypeError) {
      logger.info(`✅ Caught and suggested: "${testCase.expected}"`);
    } else {
      logger.error(`❌ Failed to catch invalid type: "${testCase.type}"`);
      result.errors.forEach(err => {
        if (err && typeof err === 'object' && 'message' in err) {
          logger.error(`   Error: ${err.message}`);
        }
      });
    }
  }

  // Test that n8n-nodes-base. prefix still works
  const validWorkflow = {
    name: 'Valid Workflow',
    nodes: [{
      id: 'webhook',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [100, 100] as [number, number],
      parameters: {}
    }],
    connections: {}
  };

  logger.info('\nTesting valid n8n-nodes-base.webhook:');
  const validResult = await validator.validateWorkflow(validWorkflow as any);
  
  const hasNodeTypeError = validResult.errors.some(err => 
    err && typeof err === 'object' && 'message' in err && 
    err.message.includes('node type')
  );

  if (!hasNodeTypeError) {
    logger.info('✅ Correctly accepted n8n-nodes-base.webhook');
  } else {
    logger.error('❌ Incorrectly rejected valid n8n-nodes-base.webhook');
  }

  adapter.close();
}

testValidation().catch(err => {
  logger.error('Test failed:', err);
  process.exit(1);
});