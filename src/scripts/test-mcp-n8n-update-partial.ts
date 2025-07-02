#!/usr/bin/env node
/**
 * Integration test for n8n_update_partial_workflow MCP tool
 * Tests that the tool can be called successfully via MCP protocol
 */

import { config } from 'dotenv';
import { logger } from '../utils/logger';
import { isN8nApiConfigured } from '../config/n8n-api';
import { handleUpdatePartialWorkflow } from '../mcp/handlers-workflow-diff';

// Load environment variables
config();

async function testMcpUpdatePartialWorkflow() {
  logger.info('Testing n8n_update_partial_workflow MCP tool...');
  
  // Check if API is configured
  if (!isN8nApiConfigured()) {
    logger.warn('n8n API not configured. Set N8N_API_URL and N8N_API_KEY to test.');
    logger.info('Example:');
    logger.info('  N8N_API_URL=https://your-n8n.com N8N_API_KEY=your-key npm run test:mcp:update-partial');
    return;
  }
  
  // Test 1: Validate only - should work without actual workflow
  logger.info('\n=== Test 1: Validate Only (no actual workflow needed) ===');
  
  const validateOnlyRequest = {
    id: 'test-workflow-123',
    operations: [
      {
        type: 'addNode',
        description: 'Add HTTP Request node',
        node: {
          name: 'HTTP Request',
          type: 'n8n-nodes-base.httpRequest',
          position: [400, 300],
          parameters: {
            url: 'https://api.example.com/data',
            method: 'GET'
          }
        }
      },
      {
        type: 'addConnection',
        source: 'Start',
        target: 'HTTP Request'
      }
    ],
    validateOnly: true
  };
  
  try {
    const result = await handleUpdatePartialWorkflow(validateOnlyRequest);
    logger.info('Validation result:', JSON.stringify(result, null, 2));
  } catch (error) {
    logger.error('Validation test failed:', error);
  }
  
  // Test 2: Test with missing required fields
  logger.info('\n=== Test 2: Missing Required Fields ===');
  
  const invalidRequest = {
    operations: [{
      type: 'addNode'
      // Missing node property
    }]
    // Missing id
  };
  
  try {
    const result = await handleUpdatePartialWorkflow(invalidRequest);
    logger.info('Should fail with validation error:', JSON.stringify(result, null, 2));
  } catch (error) {
    logger.info('Expected validation error:', error instanceof Error ? error.message : String(error));
  }
  
  // Test 3: Test with complex operations array
  logger.info('\n=== Test 3: Complex Operations Array ===');
  
  const complexRequest = {
    id: 'workflow-456',
    operations: [
      {
        type: 'updateNode',
        nodeName: 'Webhook',
        changes: {
          'parameters.path': 'new-webhook-path',
          'parameters.method': 'POST'
        }
      },
      {
        type: 'addNode',
        node: {
          name: 'Set',
          type: 'n8n-nodes-base.set',
          typeVersion: 3,
          position: [600, 300],
          parameters: {
            mode: 'manual',
            fields: {
              values: [
                { name: 'status', value: 'processed' }
              ]
            }
          }
        }
      },
      {
        type: 'addConnection',
        source: 'Webhook',
        target: 'Set'
      },
      {
        type: 'updateName',
        name: 'Updated Workflow Name'
      },
      {
        type: 'addTag',
        tag: 'production'
      }
    ],
    validateOnly: true
  };
  
  try {
    const result = await handleUpdatePartialWorkflow(complexRequest);
    logger.info('Complex operations result:', JSON.stringify(result, null, 2));
  } catch (error) {
    logger.error('Complex operations test failed:', error);
  }
  
  // Test 4: Test operation type validation
  logger.info('\n=== Test 4: Invalid Operation Type ===');
  
  const invalidTypeRequest = {
    id: 'workflow-789',
    operations: [{
      type: 'invalidOperation',
      something: 'else'
    }],
    validateOnly: true
  };
  
  try {
    const result = await handleUpdatePartialWorkflow(invalidTypeRequest);
    logger.info('Invalid type result:', JSON.stringify(result, null, 2));
  } catch (error) {
    logger.info('Expected error for invalid type:', error instanceof Error ? error.message : String(error));
  }
  
  logger.info('\n✅ MCP tool integration tests completed!');
  logger.info('\nNOTE: These tests verify the MCP tool can be called without errors.');
  logger.info('To test with real workflows, ensure N8N_API_URL and N8N_API_KEY are set.');
}

// Run tests
testMcpUpdatePartialWorkflow().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});