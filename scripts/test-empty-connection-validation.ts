#!/usr/bin/env tsx

/**
 * Test script for empty connection validation
 * Tests the improvements to prevent broken workflows like the one in the logs
 */

import { WorkflowValidator } from '../src/services/workflow-validator';
import { EnhancedConfigValidator } from '../src/services/enhanced-config-validator';
import { NodeRepository } from '../src/database/node-repository';
import { createDatabaseAdapter } from '../src/database/database-adapter';
import { validateWorkflowStructure, getWorkflowFixSuggestions, getWorkflowStructureExample } from '../src/services/n8n-validation';
import { Logger } from '../src/utils/logger';

const logger = new Logger({ prefix: '[TestEmptyConnectionValidation]' });

async function testValidation() {
  const adapter = await createDatabaseAdapter('./data/nodes.db');
  const repository = new NodeRepository(adapter);
  const validator = new WorkflowValidator(repository, EnhancedConfigValidator);

  logger.info('Testing empty connection validation...\n');

  // Test 1: The broken workflow from the logs
  const brokenWorkflow = {
    "nodes": [
      {
        "parameters": {},
        "id": "webhook_node",
        "name": "Webhook",
        "type": "nodes-base.webhook",
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

  logger.info('Test 1: Broken single-node workflow with empty connections');
  const result1 = await validator.validateWorkflow(brokenWorkflow as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result1.valid}`);
  logger.info(`Errors: ${result1.errors.length}`);
  result1.errors.forEach(err => {
    if (typeof err === 'string') {
      logger.error(`  - ${err}`);
    } else if (err && typeof err === 'object' && 'message' in err) {
      logger.error(`  - ${err.message}`);
    } else {
      logger.error(`  - ${JSON.stringify(err)}`);
    }
  });
  logger.info(`Warnings: ${result1.warnings.length}`);
  result1.warnings.forEach(warn => logger.warn(`  - ${warn.message || JSON.stringify(warn)}`));
  logger.info(`Suggestions: ${result1.suggestions.length}`);
  result1.suggestions.forEach(sug => logger.info(`  - ${sug}`));

  // Test 2: Multi-node workflow with no connections
  const multiNodeNoConnections = {
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "manual-1",
        "name": "Manual Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [250, 300] as [number, number],
        "parameters": {}
      },
      {
        "id": "set-1",
        "name": "Set",
        "type": "n8n-nodes-base.set",
        "typeVersion": 3.4,
        "position": [450, 300] as [number, number],
        "parameters": {}
      }
    ],
    "connections": {}
  };

  logger.info('\nTest 2: Multi-node workflow with empty connections');
  const result2 = await validator.validateWorkflow(multiNodeNoConnections as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result2.valid}`);
  logger.info(`Errors: ${result2.errors.length}`);
  result2.errors.forEach(err => logger.error(`  - ${err.message || JSON.stringify(err)}`));
  logger.info(`Suggestions: ${result2.suggestions.length}`);
  result2.suggestions.forEach(sug => logger.info(`  - ${sug}`));

  // Test 3: Using n8n-validation functions
  logger.info('\nTest 3: Testing n8n-validation.ts functions');
  
  const errors = validateWorkflowStructure(brokenWorkflow as any);
  logger.info('Validation errors:');
  errors.forEach(err => logger.error(`  - ${err}`));
  
  const suggestions = getWorkflowFixSuggestions(errors);
  logger.info('Fix suggestions:');
  suggestions.forEach(sug => logger.info(`  - ${sug}`));
  
  logger.info('\nExample of proper workflow structure:');
  logger.info(getWorkflowStructureExample());

  // Test 4: Workflow using IDs instead of names in connections
  const workflowWithIdConnections = {
    "name": "Test Workflow",
    "nodes": [
      {
        "id": "manual-1",
        "name": "Manual Trigger",
        "type": "n8n-nodes-base.manualTrigger",
        "typeVersion": 1,
        "position": [250, 300] as [number, number],
        "parameters": {}
      },
      {
        "id": "set-1",
        "name": "Set Data",
        "type": "n8n-nodes-base.set",
        "typeVersion": 3.4,
        "position": [450, 300] as [number, number],
        "parameters": {}
      }
    ],
    "connections": {
      "manual-1": {  // Using ID instead of name!
        "main": [[{
          "node": "set-1",  // Using ID instead of name!
          "type": "main",
          "index": 0
        }]]
      }
    }
  };

  logger.info('\nTest 4: Workflow using IDs instead of names in connections');
  const result4 = await validator.validateWorkflow(workflowWithIdConnections as any);
  
  logger.info('Validation result:');
  logger.info(`Valid: ${result4.valid}`);
  logger.info(`Errors: ${result4.errors.length}`);
  result4.errors.forEach(err => logger.error(`  - ${err.message || JSON.stringify(err)}`));
  
  adapter.close();
}

testValidation().catch(err => {
  logger.error('Test failed:', err);
  process.exit(1);
});