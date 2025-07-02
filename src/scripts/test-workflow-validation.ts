#!/usr/bin/env node

/**
 * Test script for workflow validation features
 * Tests the new workflow validation tools with various scenarios
 */

import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { NodeRepository } from '../database/node-repository';
import { createDatabaseAdapter } from '../database/database-adapter';
import { WorkflowValidator } from '../services/workflow-validator';
import { EnhancedConfigValidator } from '../services/enhanced-config-validator';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[test-workflow-validation]' });

// Test workflows
const VALID_WORKFLOW = {
  name: 'Test Valid Workflow',
  nodes: [
    {
      id: '1',
      name: 'Schedule Trigger',
      type: 'nodes-base.scheduleTrigger',
      position: [250, 300] as [number, number],
      parameters: {
        rule: {
          interval: [{ field: 'hours', hoursInterval: 1 }]
        }
      }
    },
    {
      id: '2',
      name: 'HTTP Request',
      type: 'nodes-base.httpRequest',
      position: [450, 300] as [number, number],
      parameters: {
        url: 'https://api.example.com/data',
        method: 'GET'
      }
    },
    {
      id: '3',
      name: 'Set',
      type: 'nodes-base.set',
      position: [650, 300] as [number, number],
      parameters: {
        values: {
          string: [
            {
              name: 'status',
              value: '={{ $json.status }}'
            }
          ]
        }
      }
    }
  ],
  connections: {
    'Schedule Trigger': {
      main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]]
    },
    'HTTP Request': {
      main: [[{ node: 'Set', type: 'main', index: 0 }]]
    }
  }
};

const WORKFLOW_WITH_CYCLE = {
  name: 'Workflow with Cycle',
  nodes: [
    {
      id: '1',
      name: 'Start',
      type: 'nodes-base.start',
      position: [250, 300] as [number, number],
      parameters: {}
    },
    {
      id: '2',
      name: 'Node A',
      type: 'nodes-base.set',
      position: [450, 300] as [number, number],
      parameters: { values: { string: [] } }
    },
    {
      id: '3',
      name: 'Node B',
      type: 'nodes-base.set',
      position: [650, 300] as [number, number],
      parameters: { values: { string: [] } }
    }
  ],
  connections: {
    'Start': {
      main: [[{ node: 'Node A', type: 'main', index: 0 }]]
    },
    'Node A': {
      main: [[{ node: 'Node B', type: 'main', index: 0 }]]
    },
    'Node B': {
      main: [[{ node: 'Node A', type: 'main', index: 0 }]]  // Creates cycle
    }
  }
};

const WORKFLOW_WITH_INVALID_EXPRESSION = {
  name: 'Workflow with Invalid Expression',
  nodes: [
    {
      id: '1',
      name: 'Webhook',
      type: 'nodes-base.webhook',
      position: [250, 300] as [number, number],
      parameters: {
        path: 'test-webhook'
      }
    },
    {
      id: '2',
      name: 'Set Data',
      type: 'nodes-base.set',
      position: [450, 300] as [number, number],
      parameters: {
        values: {
          string: [
            {
              name: 'invalidExpression',
              value: '={{ json.field }}'  // Missing $ prefix
            },
            {
              name: 'nestedExpression',
              value: '={{ {{ $json.field }} }}'  // Nested expressions not allowed
            },
            {
              name: 'nodeReference',
              value: '={{ $node["Non Existent Node"].json.data }}'
            }
          ]
        }
      }
    }
  ],
  connections: {
    'Webhook': {
      main: [[{ node: 'Set Data', type: 'main', index: 0 }]]
    }
  }
};

const WORKFLOW_WITH_ORPHANED_NODE = {
  name: 'Workflow with Orphaned Node',
  nodes: [
    {
      id: '1',
      name: 'Schedule Trigger',
      type: 'nodes-base.scheduleTrigger',
      position: [250, 300] as [number, number],
      parameters: {
        rule: { interval: [{ field: 'hours', hoursInterval: 1 }] }
      }
    },
    {
      id: '2',
      name: 'HTTP Request',
      type: 'nodes-base.httpRequest',
      position: [450, 300] as [number, number],
      parameters: {
        url: 'https://api.example.com',
        method: 'GET'
      }
    },
    {
      id: '3',
      name: 'Orphaned Node',
      type: 'nodes-base.set',
      position: [450, 500] as [number, number],
      parameters: {
        values: { string: [] }
      }
    }
  ],
  connections: {
    'Schedule Trigger': {
      main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]]
    }
    // Orphaned Node has no connections
  }
};

async function testWorkflowValidation() {
  logger.info('Starting workflow validation tests...\n');

  // Initialize database
  const dbPath = path.join(process.cwd(), 'data', 'nodes.db');
  if (!existsSync(dbPath)) {
    logger.error('Database not found. Run npm run rebuild first.');
    process.exit(1);
  }

  const db = await createDatabaseAdapter(dbPath);
  const repository = new NodeRepository(db);
  const validator = new WorkflowValidator(
    repository,
    EnhancedConfigValidator
  );

  // Test 1: Valid workflow
  logger.info('Test 1: Validating a valid workflow');
  const validResult = await validator.validateWorkflow(VALID_WORKFLOW);
  console.log('Valid workflow result:', JSON.stringify(validResult, null, 2));
  console.log('---\n');

  // Test 2: Workflow with cycle
  logger.info('Test 2: Validating workflow with cycle');
  const cycleResult = await validator.validateWorkflow(WORKFLOW_WITH_CYCLE);
  console.log('Cycle workflow result:', JSON.stringify(cycleResult, null, 2));
  console.log('---\n');

  // Test 3: Workflow with invalid expressions
  logger.info('Test 3: Validating workflow with invalid expressions');
  const expressionResult = await validator.validateWorkflow(WORKFLOW_WITH_INVALID_EXPRESSION);
  console.log('Invalid expression result:', JSON.stringify(expressionResult, null, 2));
  console.log('---\n');

  // Test 4: Workflow with orphaned node
  logger.info('Test 4: Validating workflow with orphaned node');
  const orphanedResult = await validator.validateWorkflow(WORKFLOW_WITH_ORPHANED_NODE);
  console.log('Orphaned node result:', JSON.stringify(orphanedResult, null, 2));
  console.log('---\n');

  // Test 5: Connection-only validation
  logger.info('Test 5: Testing connection-only validation');
  const connectionOnlyResult = await validator.validateWorkflow(WORKFLOW_WITH_CYCLE, {
    validateNodes: false,
    validateConnections: true,
    validateExpressions: false
  });
  console.log('Connection-only result:', JSON.stringify(connectionOnlyResult, null, 2));
  console.log('---\n');

  // Test 6: Expression-only validation
  logger.info('Test 6: Testing expression-only validation');
  const expressionOnlyResult = await validator.validateWorkflow(WORKFLOW_WITH_INVALID_EXPRESSION, {
    validateNodes: false,
    validateConnections: false,
    validateExpressions: true
  });
  console.log('Expression-only result:', JSON.stringify(expressionOnlyResult, null, 2));
  console.log('---\n');

  // Test summary
  logger.info('Test Summary:');
  console.log('✓ Valid workflow:', validResult.valid ? 'PASSED' : 'FAILED');
  console.log('✓ Cycle detection:', !cycleResult.valid ? 'PASSED' : 'FAILED');
  console.log('✓ Expression validation:', !expressionResult.valid ? 'PASSED' : 'FAILED');
  console.log('✓ Orphaned node detection:', orphanedResult.warnings.length > 0 ? 'PASSED' : 'FAILED');
  console.log('✓ Connection-only validation:', connectionOnlyResult.errors.length > 0 ? 'PASSED' : 'FAILED');
  console.log('✓ Expression-only validation:', expressionOnlyResult.errors.length > 0 ? 'PASSED' : 'FAILED');

  // Close database
  db.close();
}

// Run tests
testWorkflowValidation().catch(error => {
  logger.error('Test failed:', error);
  process.exit(1);
});