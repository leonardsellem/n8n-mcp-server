#!/usr/bin/env tsx

/**
 * Test script for node type validation
 * Tests the improvements to catch invalid node types like "nodes-base.webhook"
 */

import { WorkflowValidator } from '../src/services/workflow-validator';
import { EnhancedConfigValidator } from '../src/services/enhanced-config-validator';
import { NodeRepository } from '../src/database/node-repository';
import { createDatabaseAdapter } from '../src/database/database-adapter';
import { validateWorkflowStructure } from '../src/services/n8n-validation';
import { Logger } from '../src/utils/logger';

const logger = new Logger({ prefix: '[TestNodeTypeValidation]' });

async function testValidation() {
  const adapter = await createDatabaseAdapter('./data/nodes.db');
  const repository = new NodeRepository(adapter);
  const validator = new WorkflowValidator(repository, EnhancedConfigValidator);

  logger.info('Testing node type validation...\n');

  // Test 1: The exact broken workflow from Claude Desktop
  const brokenWorkflowFromLogs = {
    "nodes": [
      {
        "parameters": {},
        "id": "webhook_node",
        "name": "Webhook",
        "type": "nodes-base.webhook", // WRONG! Missing n8n- prefix
        "typeVersion": 2,
        "position": [260, 300] as [number, number]
      }
    ],
    "connections": {},
    "pinData": {},
    "meta": {
      "instanceId": "74e11c77e266f2c77f6408eb6c88e3fec63c9a5d8c4a3a2ea4c135c542012d6b"
    }
  };

  logger.info('Test 1: Invalid node type "nodes-base.webhook" (missing n8n- prefix)');
  const result1 = await validator.validateWorkflow(brokenWorkflowFromLogs as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result1.valid}`);
  logger.info(`Errors: ${result1.errors.length}`);
  result1.errors.forEach(err => {
    if (typeof err === 'string') {
      logger.error(`  - ${err}`);
    } else if (err && typeof err === 'object' && 'message' in err) {
      logger.error(`  - ${err.message}`);
    }
  });
  
  // Check if the specific error about nodes-base.webhook was caught
  const hasNodeBaseError = result1.errors.some(err => 
    err && typeof err === 'object' && 'message' in err && 
    err.message.includes('nodes-base.webhook') && 
    err.message.includes('n8n-nodes-base.webhook')
  );
  logger.info(`Caught nodes-base.webhook error: ${hasNodeBaseError ? 'YES ✅' : 'NO ❌'}`);

  // Test 2: Node type without any prefix
  const noPrefixWorkflow = {
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "webhook-1",
        "name": "My Webhook",
        "type": "webhook", // WRONG! No package prefix
        "typeVersion": 2,
        "position": [250, 300] as [number, number],
        "parameters": {}
      },
      {
        "id": "set-1",
        "name": "Set Data",
        "type": "set", // WRONG! No package prefix
        "typeVersion": 3.4,
        "position": [450, 300] as [number, number],
        "parameters": {}
      }
    ],
    "connections": {
      "My Webhook": {
        "main": [[{
          "node": "Set Data",
          "type": "main",
          "index": 0
        }]]
      }
    }
  };

  logger.info('\nTest 2: Node types without package prefix ("webhook", "set")');
  const result2 = await validator.validateWorkflow(noPrefixWorkflow as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result2.valid}`);
  logger.info(`Errors: ${result2.errors.length}`);
  result2.errors.forEach(err => {
    if (typeof err === 'string') {
      logger.error(`  - ${err}`);
    } else if (err && typeof err === 'object' && 'message' in err) {
      logger.error(`  - ${err.message}`);
    }
  });

  // Test 3: Completely invalid node type
  const invalidNodeWorkflow = {
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "fake-1",
        "name": "Fake Node",
        "type": "n8n-nodes-base.fakeNodeThatDoesNotExist",
        "typeVersion": 1,
        "position": [250, 300] as [number, number],
        "parameters": {}
      }
    ],
    "connections": {}
  };

  logger.info('\nTest 3: Completely invalid node type');
  const result3 = await validator.validateWorkflow(invalidNodeWorkflow as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result3.valid}`);
  logger.info(`Errors: ${result3.errors.length}`);
  result3.errors.forEach(err => {
    if (typeof err === 'string') {
      logger.error(`  - ${err}`);
    } else if (err && typeof err === 'object' && 'message' in err) {
      logger.error(`  - ${err.message}`);
    }
  });

  // Test 4: Using n8n-validation.ts function
  logger.info('\nTest 4: Testing n8n-validation.ts with invalid node types');
  
  const errors = validateWorkflowStructure(brokenWorkflowFromLogs as any);
  logger.info('Validation errors:');
  errors.forEach(err => logger.error(`  - ${err}`));

  // Test 5: Valid workflow (should pass)
  const validWorkflow = {
    "name": "Valid Webhook Workflow",
    "nodes": [
      {
        "id": "webhook-1",
        "name": "Webhook",
        "type": "n8n-nodes-base.webhook", // CORRECT!
        "typeVersion": 2,
        "position": [250, 300] as [number, number],
        "parameters": {
          "path": "my-webhook",
          "responseMode": "onReceived",
          "responseData": "allEntries"
        }
      }
    ],
    "connections": {}
  };

  logger.info('\nTest 5: Valid workflow with correct node type');
  const result5 = await validator.validateWorkflow(validWorkflow as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result5.valid}`);
  logger.info(`Errors: ${result5.errors.length}`);
  logger.info(`Warnings: ${result5.warnings.length}`);
  result5.warnings.forEach(warn => {
    if (warn && typeof warn === 'object' && 'message' in warn) {
      logger.warn(`  - ${warn.message}`);
    }
  });
  
  adapter.close();
}

testValidation().catch(err => {
  logger.error('Test failed:', err);
  process.exit(1);
});