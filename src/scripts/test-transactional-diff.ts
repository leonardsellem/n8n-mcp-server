/**
 * Test script for transactional workflow diff operations
 * Tests the two-pass processing approach
 */

import { WorkflowDiffEngine } from '../services/workflow-diff-engine';
import { Workflow, WorkflowNode } from '../types/n8n-api';
import { WorkflowDiffRequest } from '../types/workflow-diff';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[TestTransactionalDiff]' });

// Create a test workflow
const testWorkflow: Workflow = {
  id: 'test-workflow-123',
  name: 'Test Workflow',
  active: false,
  nodes: [
    {
      id: '1',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [200, 300],
      parameters: {
        path: '/test',
        method: 'GET'
      }
    }
  ],
  connections: {},
  settings: {
    executionOrder: 'v1'
  },
  tags: []
};

async function testAddNodesAndConnect() {
  logger.info('Test 1: Add two nodes and connect them in one operation');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: testWorkflow.id!,
    operations: [
      // Add connections first (would fail in old implementation)
      {
        type: 'addConnection',
        source: 'Webhook',
        target: 'Process Data'
      },
      {
        type: 'addConnection',
        source: 'Process Data',
        target: 'Send Email'
      },
      // Then add the nodes (two-pass will process these first)
      {
        type: 'addNode',
        node: {
          id: '2',
          name: 'Process Data',
          type: 'n8n-nodes-base.set',
          typeVersion: 3,
          position: [400, 300],
          parameters: {
            mode: 'manual',
            fields: []
          }
        }
      },
      {
        type: 'addNode',
        node: {
          id: '3',
          name: 'Send Email',
          type: 'n8n-nodes-base.emailSend',
          typeVersion: 2.1,
          position: [600, 300],
          parameters: {
            to: 'test@example.com',
            subject: 'Test'
          }
        }
      }
    ]
  };

  const result = await engine.applyDiff(testWorkflow, request);
  
  if (result.success) {
    logger.info('✅ Test passed! Operations applied successfully');
    logger.info(`Message: ${result.message}`);
    
    // Verify nodes were added
    const workflow = result.workflow!;
    const hasProcessData = workflow.nodes.some((n: WorkflowNode) => n.name === 'Process Data');
    const hasSendEmail = workflow.nodes.some((n: WorkflowNode) => n.name === 'Send Email');
    
    if (hasProcessData && hasSendEmail) {
      logger.info('✅ Both nodes were added');
    } else {
      logger.error('❌ Nodes were not added correctly');
    }
    
    // Verify connections were made
    const webhookConnections = workflow.connections['Webhook'];
    const processConnections = workflow.connections['Process Data'];
    
    if (webhookConnections && processConnections) {
      logger.info('✅ Connections were established');
    } else {
      logger.error('❌ Connections were not established correctly');
    }
  } else {
    logger.error('❌ Test failed!');
    logger.error('Errors:', result.errors);
  }
}

async function testOperationLimit() {
  logger.info('\nTest 2: Operation limit (max 5)');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: testWorkflow.id!,
    operations: [
      { type: 'addNode', node: { id: '101', name: 'Node1', type: 'n8n-nodes-base.set', typeVersion: 1, position: [400, 100], parameters: {} } },
      { type: 'addNode', node: { id: '102', name: 'Node2', type: 'n8n-nodes-base.set', typeVersion: 1, position: [400, 200], parameters: {} } },
      { type: 'addNode', node: { id: '103', name: 'Node3', type: 'n8n-nodes-base.set', typeVersion: 1, position: [400, 300], parameters: {} } },
      { type: 'addNode', node: { id: '104', name: 'Node4', type: 'n8n-nodes-base.set', typeVersion: 1, position: [400, 400], parameters: {} } },
      { type: 'addNode', node: { id: '105', name: 'Node5', type: 'n8n-nodes-base.set', typeVersion: 1, position: [400, 500], parameters: {} } },
      { type: 'addNode', node: { id: '106', name: 'Node6', type: 'n8n-nodes-base.set', typeVersion: 1, position: [400, 600], parameters: {} } }
    ]
  };

  const result = await engine.applyDiff(testWorkflow, request);
  
  if (!result.success && result.errors?.[0]?.message.includes('Too many operations')) {
    logger.info('✅ Operation limit enforced correctly');
  } else {
    logger.error('❌ Operation limit not enforced');
  }
}

async function testValidateOnly() {
  logger.info('\nTest 3: Validate only mode');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: testWorkflow.id!,
    operations: [
      // Test with connection first - two-pass should handle this
      {
        type: 'addConnection',
        source: 'Webhook',
        target: 'HTTP Request'
      },
      {
        type: 'addNode',
        node: {
          id: '4',
          name: 'HTTP Request',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.2,
          position: [400, 300],
          parameters: {
            method: 'GET',
            url: 'https://api.example.com'
          }
        }
      },
      {
        type: 'updateSettings',
        settings: {
          saveDataErrorExecution: 'all'
        }
      }
    ],
    validateOnly: true
  };

  const result = await engine.applyDiff(testWorkflow, request);
  
  if (result.success) {
    logger.info('✅ Validate-only mode works correctly');
    logger.info(`Validation message: ${result.message}`);
    
    // Verify original workflow wasn't modified
    if (testWorkflow.nodes.length === 1) {
      logger.info('✅ Original workflow unchanged');
    } else {
      logger.error('❌ Original workflow was modified in validate-only mode');
    }
  } else {
    logger.error('❌ Validate-only mode failed');
    logger.error('Errors:', result.errors);
  }
}

async function testMixedOperations() {
  logger.info('\nTest 4: Mixed operations (update existing, add new, connect)');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: testWorkflow.id!,
    operations: [
      // Update existing node
      {
        type: 'updateNode',
        nodeName: 'Webhook',
        changes: {
          'parameters.path': '/updated-path'
        }
      },
      // Add new node
      {
        type: 'addNode',
        node: {
          id: '5',
          name: 'Logger',
          type: 'n8n-nodes-base.n8n',
          typeVersion: 1,
          position: [400, 300],
          parameters: {
            operation: 'log',
            level: 'info'
          }
        }
      },
      // Connect them
      {
        type: 'addConnection',
        source: 'Webhook',
        target: 'Logger'
      },
      // Update workflow settings
      {
        type: 'updateSettings',
        settings: {
          saveDataErrorExecution: 'all'
        }
      }
    ]
  };

  const result = await engine.applyDiff(testWorkflow, request);
  
  if (result.success) {
    logger.info('✅ Mixed operations applied successfully');
    logger.info(`Message: ${result.message}`);
  } else {
    logger.error('❌ Mixed operations failed');
    logger.error('Errors:', result.errors);
  }
}

// Run all tests
async function runTests() {
  logger.info('Starting transactional diff tests...\n');
  
  try {
    await testAddNodesAndConnect();
    await testOperationLimit();
    await testValidateOnly();
    await testMixedOperations();
    
    logger.info('\n✅ All tests completed!');
  } catch (error) {
    logger.error('Test suite failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}