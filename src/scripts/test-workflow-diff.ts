#!/usr/bin/env node
/**
 * Test script for workflow diff engine
 * Tests various diff operations and edge cases
 */

import { WorkflowDiffEngine } from '../services/workflow-diff-engine';
import { WorkflowDiffRequest } from '../types/workflow-diff';
import { Workflow } from '../types/n8n-api';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[test-workflow-diff]' });

// Sample workflow for testing
const sampleWorkflow: Workflow = {
  id: 'test-workflow-123',
  name: 'Test Workflow',
  nodes: [
    {
      id: 'webhook_1',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1.1,
      position: [200, 200],
      parameters: {
        path: 'test-webhook',
        method: 'GET'
      }
    },
    {
      id: 'set_1',
      name: 'Set',
      type: 'n8n-nodes-base.set',
      typeVersion: 3,
      position: [400, 200],
      parameters: {
        mode: 'manual',
        fields: {
          values: [
            { name: 'message', value: 'Hello World' }
          ]
        }
      }
    }
  ],
  connections: {
    'Webhook': {
      main: [[{ node: 'Set', type: 'main', index: 0 }]]
    }
  },
  settings: {
    executionOrder: 'v1',
    saveDataSuccessExecution: 'all'
  },
  tags: ['test', 'demo']
};

async function testAddNode() {
  console.log('\n=== Testing Add Node Operation ===');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'addNode',
        description: 'Add HTTP Request node',
        node: {
          name: 'HTTP Request',
          type: 'n8n-nodes-base.httpRequest',
          position: [600, 200],
          parameters: {
            url: 'https://api.example.com/data',
            method: 'GET'
          }
        }
      }
    ]
  };
  
  const result = await engine.applyDiff(sampleWorkflow, request);
  
  if (result.success) {
    console.log('✅ Add node successful');
    console.log(`   - Nodes count: ${result.workflow!.nodes.length}`);
    console.log(`   - New node: ${result.workflow!.nodes[2].name}`);
  } else {
    console.error('❌ Add node failed:', result.errors);
  }
}

async function testRemoveNode() {
  console.log('\n=== Testing Remove Node Operation ===');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'removeNode',
        description: 'Remove Set node',
        nodeName: 'Set'
      }
    ]
  };
  
  const result = await engine.applyDiff(sampleWorkflow, request);
  
  if (result.success) {
    console.log('✅ Remove node successful');
    console.log(`   - Nodes count: ${result.workflow!.nodes.length}`);
    console.log(`   - Connections cleaned: ${Object.keys(result.workflow!.connections).length}`);
  } else {
    console.error('❌ Remove node failed:', result.errors);
  }
}

async function testUpdateNode() {
  console.log('\n=== Testing Update Node Operation ===');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'updateNode',
        description: 'Update webhook path',
        nodeName: 'Webhook',
        changes: {
          'parameters.path': 'new-webhook-path',
          'parameters.method': 'POST'
        }
      }
    ]
  };
  
  const result = await engine.applyDiff(sampleWorkflow, request);
  
  if (result.success) {
    console.log('✅ Update node successful');
    const updatedNode = result.workflow!.nodes.find((n: any) => n.name === 'Webhook');
    console.log(`   - New path: ${updatedNode!.parameters.path}`);
    console.log(`   - New method: ${updatedNode!.parameters.method}`);
  } else {
    console.error('❌ Update node failed:', result.errors);
  }
}

async function testAddConnection() {
  console.log('\n=== Testing Add Connection Operation ===');
  
  // First add a node to connect to
  const workflowWithExtraNode = JSON.parse(JSON.stringify(sampleWorkflow));
  workflowWithExtraNode.nodes.push({
    id: 'email_1',
    name: 'Send Email',
    type: 'n8n-nodes-base.emailSend',
    typeVersion: 2,
    position: [600, 200],
    parameters: {}
  });
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'addConnection',
        description: 'Connect Set to Send Email',
        source: 'Set',
        target: 'Send Email'
      }
    ]
  };
  
  const result = await engine.applyDiff(workflowWithExtraNode, request);
  
  if (result.success) {
    console.log('✅ Add connection successful');
    const setConnections = result.workflow!.connections['Set'];
    console.log(`   - Connection added: ${JSON.stringify(setConnections)}`);
  } else {
    console.error('❌ Add connection failed:', result.errors);
  }
}

async function testMultipleOperations() {
  console.log('\n=== Testing Multiple Operations ===');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'updateName',
        name: 'Updated Test Workflow'
      },
      {
        type: 'addNode',
        node: {
          name: 'If',
          type: 'n8n-nodes-base.if',
          position: [400, 400],
          parameters: {}
        }
      },
      {
        type: 'disableNode',
        nodeName: 'Set'
      },
      {
        type: 'addTag',
        tag: 'updated'
      }
    ]
  };
  
  const result = await engine.applyDiff(sampleWorkflow, request);
  
  if (result.success) {
    console.log('✅ Multiple operations successful');
    console.log(`   - New name: ${result.workflow!.name}`);
    console.log(`   - Operations applied: ${result.operationsApplied}`);
    console.log(`   - Node count: ${result.workflow!.nodes.length}`);
    console.log(`   - Tags: ${result.workflow!.tags?.join(', ')}`);
  } else {
    console.error('❌ Multiple operations failed:', result.errors);
  }
}

async function testValidationOnly() {
  console.log('\n=== Testing Validation Only ===');
  
  const engine = new WorkflowDiffEngine();
  const request: WorkflowDiffRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'addNode',
        node: {
          name: 'Webhook', // Duplicate name - should fail validation
          type: 'n8n-nodes-base.webhook',
          position: [600, 400]
        }
      }
    ],
    validateOnly: true
  };
  
  const result = await engine.applyDiff(sampleWorkflow, request);
  
  console.log(`   - Validation result: ${result.success ? '✅ Valid' : '❌ Invalid'}`);
  if (!result.success) {
    console.log(`   - Error: ${result.errors![0].message}`);
  } else {
    console.log(`   - Message: ${result.message}`);
  }
}

async function testInvalidOperations() {
  console.log('\n=== Testing Invalid Operations ===');
  
  const engine = new WorkflowDiffEngine();
  
  // Test 1: Invalid node type
  console.log('\n1. Testing invalid node type:');
  let result = await engine.applyDiff(sampleWorkflow, {
    id: 'test-workflow-123',
    operations: [{
      type: 'addNode',
      node: {
        name: 'Bad Node',
        type: 'webhook', // Missing package prefix
        position: [600, 400]
      }
    }]
  });
  console.log(`   - Result: ${result.success ? '✅' : '❌'} ${result.errors?.[0]?.message || 'Success'}`);
  
  // Test 2: Remove non-existent node
  console.log('\n2. Testing remove non-existent node:');
  result = await engine.applyDiff(sampleWorkflow, {
    id: 'test-workflow-123',
    operations: [{
      type: 'removeNode',
      nodeName: 'Non Existent Node'
    }]
  });
  console.log(`   - Result: ${result.success ? '✅' : '❌'} ${result.errors?.[0]?.message || 'Success'}`);
  
  // Test 3: Invalid connection
  console.log('\n3. Testing invalid connection:');
  result = await engine.applyDiff(sampleWorkflow, {
    id: 'test-workflow-123',
    operations: [{
      type: 'addConnection',
      source: 'Webhook',
      target: 'Non Existent Node'
    }]
  });
  console.log(`   - Result: ${result.success ? '✅' : '❌'} ${result.errors?.[0]?.message || 'Success'}`);
}

async function testNodeReferenceByIdAndName() {
  console.log('\n=== Testing Node Reference by ID and Name ===');
  
  const engine = new WorkflowDiffEngine();
  
  // Test update by ID
  console.log('\n1. Update node by ID:');
  let result = await engine.applyDiff(sampleWorkflow, {
    id: 'test-workflow-123',
    operations: [{
      type: 'updateNode',
      nodeId: 'webhook_1',
      changes: {
        'parameters.path': 'updated-by-id'
      }
    }]
  });
  
  if (result.success) {
    const node = result.workflow!.nodes.find((n: any) => n.id === 'webhook_1');
    console.log(`   - ✅ Success: path = ${node!.parameters.path}`);
  } else {
    console.log(`   - ❌ Failed: ${result.errors![0].message}`);
  }
  
  // Test update by name
  console.log('\n2. Update node by name:');
  result = await engine.applyDiff(sampleWorkflow, {
    id: 'test-workflow-123',
    operations: [{
      type: 'updateNode',
      nodeName: 'Webhook',
      changes: {
        'parameters.path': 'updated-by-name'
      }
    }]
  });
  
  if (result.success) {
    const node = result.workflow!.nodes.find((n: any) => n.name === 'Webhook');
    console.log(`   - ✅ Success: path = ${node!.parameters.path}`);
  } else {
    console.log(`   - ❌ Failed: ${result.errors![0].message}`);
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('🧪 Running Workflow Diff Engine Tests...\n');
    
    await testAddNode();
    await testRemoveNode();
    await testUpdateNode();
    await testAddConnection();
    await testMultipleOperations();
    await testValidationOnly();
    await testInvalidOperations();
    await testNodeReferenceByIdAndName();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run tests if this is the main module
if (require.main === module) {
  runTests();
}