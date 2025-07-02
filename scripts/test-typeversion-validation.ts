#!/usr/bin/env ts-node

/**
 * Test script for typeVersion validation in workflow validator
 */

import { NodeRepository } from '../src/database/node-repository';
import { createDatabaseAdapter } from '../src/database/database-adapter';
import { WorkflowValidator } from '../src/services/workflow-validator';
import { EnhancedConfigValidator } from '../src/services/enhanced-config-validator';
import { Logger } from '../src/utils/logger';

const logger = new Logger({ prefix: '[test-typeversion]' });

// Test workflows with various typeVersion scenarios
const testWorkflows = {
  // Workflow with missing typeVersion on versioned nodes
  missingTypeVersion: {
    name: 'Missing typeVersion Test',
    nodes: [
      {
        id: 'webhook_1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        parameters: {
          path: '/test',
          httpMethod: 'POST'
        }
        // Missing typeVersion - should error
      },
      {
        id: 'execute_1',
        name: 'Execute Command',
        type: 'n8n-nodes-base.executeCommand',
        position: [450, 300],
        parameters: {
          command: 'echo "test"'
        }
        // Missing typeVersion - should error
      }
    ],
    connections: {
      'Webhook': {
        main: [[{ node: 'Execute Command', type: 'main', index: 0 }]]
      }
    }
  },

  // Workflow with outdated typeVersion
  outdatedTypeVersion: {
    name: 'Outdated typeVersion Test',
    nodes: [
      {
        id: 'http_1',
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 1, // Outdated - latest is likely 4+
        position: [250, 300],
        parameters: {
          url: 'https://example.com',
          method: 'GET'
        }
      },
      {
        id: 'code_1',
        name: 'Code',
        type: 'n8n-nodes-base.code',
        typeVersion: 1, // Outdated - latest is likely 2
        position: [450, 300],
        parameters: {
          jsCode: 'return items;'
        }
      }
    ],
    connections: {
      'HTTP Request': {
        main: [[{ node: 'Code', type: 'main', index: 0 }]]
      }
    }
  },

  // Workflow with correct typeVersion
  correctTypeVersion: {
    name: 'Correct typeVersion Test',
    nodes: [
      {
        id: 'webhook_1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 2,
        position: [250, 300],
        parameters: {
          path: '/test',
          httpMethod: 'POST'
        }
      },
      {
        id: 'http_1',
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4,
        position: [450, 300],
        parameters: {
          url: 'https://example.com',
          method: 'GET'
        }
      }
    ],
    connections: {
      'Webhook': {
        main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]]
      }
    }
  },

  // Workflow with invalid typeVersion
  invalidTypeVersion: {
    name: 'Invalid typeVersion Test',
    nodes: [
      {
        id: 'webhook_1',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 0, // Invalid - must be positive
        position: [250, 300],
        parameters: {
          path: '/test'
        }
      },
      {
        id: 'http_1',
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 999, // Too high - exceeds maximum
        position: [450, 300],
        parameters: {
          url: 'https://example.com'
        }
      }
    ],
    connections: {
      'Webhook': {
        main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]]
      }
    }
  }
};

async function testTypeVersionValidation() {
  const dbAdapter = await createDatabaseAdapter('./data/nodes.db');
  const repository = new NodeRepository(dbAdapter);
  const validator = new WorkflowValidator(repository, EnhancedConfigValidator);

  console.log('\n====================================');
  console.log('Testing typeVersion Validation');
  console.log('====================================\n');

  // Check some versioned nodes to show their versions
  console.log('📊 Checking versioned nodes in database:');
  const versionedNodes = ['nodes-base.webhook', 'nodes-base.httpRequest', 'nodes-base.code', 'nodes-base.executeCommand'];
  
  for (const nodeType of versionedNodes) {
    const nodeInfo = repository.getNode(nodeType);
    if (nodeInfo) {
      console.log(`- ${nodeType}: isVersioned=${nodeInfo.isVersioned}, maxVersion=${nodeInfo.version || 'N/A'}`);
    }
  }

  console.log('\n');

  // Test each workflow
  for (const [testName, workflow] of Object.entries(testWorkflows)) {
    console.log(`\n🧪 Testing: ${testName}`);
    console.log('─'.repeat(50));
    
    const result = await validator.validateWorkflow(workflow as any);
    
    console.log(`\n✅ Valid: ${result.valid}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => {
        console.log(`  - [${error.nodeName || 'Workflow'}] ${error.message}`);
      });
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.log(`  - [${warning.nodeName || 'Workflow'}] ${warning.message}`);
      });
    }
    
    if (result.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      result.suggestions.forEach(suggestion => {
        console.log(`  - ${suggestion}`);
      });
    }
  }

  console.log('\n\n✅ typeVersion validation test completed!');
}

// Run the test
testTypeVersionValidation().catch(console.error);