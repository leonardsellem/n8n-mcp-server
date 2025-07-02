#!/usr/bin/env node
/**
 * Debug test for n8n_update_partial_workflow
 * Tests the actual update path to identify the issue
 */

import { config } from 'dotenv';
import { logger } from '../utils/logger';
import { isN8nApiConfigured } from '../config/n8n-api';
import { handleUpdatePartialWorkflow } from '../mcp/handlers-workflow-diff';
import { getN8nApiClient } from '../mcp/handlers-n8n-manager';

// Load environment variables
config();

async function testUpdatePartialDebug() {
  logger.info('Debug test for n8n_update_partial_workflow...');
  
  // Check if API is configured
  if (!isN8nApiConfigured()) {
    logger.warn('n8n API not configured. This test requires a real n8n instance.');
    logger.info('Set N8N_API_URL and N8N_API_KEY to test.');
    return;
  }
  
  const client = getN8nApiClient();
  if (!client) {
    logger.error('Failed to create n8n API client');
    return;
  }
  
  try {
    // First, create a test workflow
    logger.info('\n=== Creating test workflow ===');
    
    const testWorkflow = {
      name: `Test Partial Update ${Date.now()}`,
      nodes: [
        {
          id: '1',
          name: 'Start',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [250, 300] as [number, number],
          parameters: {}
        },
        {
          id: '2',
          name: 'Set',
          type: 'n8n-nodes-base.set',
          typeVersion: 3,
          position: [450, 300] as [number, number],
          parameters: {
            mode: 'manual',
            fields: {
              values: [
                { name: 'message', value: 'Initial value' }
              ]
            }
          }
        }
      ],
      connections: {
        'Start': {
          main: [[{ node: 'Set', type: 'main', index: 0 }]]
        }
      },
      settings: {
        executionOrder: 'v1' as 'v1'
      }
    };
    
    const createdWorkflow = await client.createWorkflow(testWorkflow);
    logger.info('Created workflow:', {
      id: createdWorkflow.id,
      name: createdWorkflow.name
    });
    
    // Now test partial update WITHOUT validateOnly
    logger.info('\n=== Testing partial update (NO validateOnly) ===');
    
    const updateRequest = {
      id: createdWorkflow.id!,
      operations: [
        {
          type: 'updateName',
          name: 'Updated via Partial Update'
        }
      ]
      // Note: NO validateOnly flag
    };
    
    logger.info('Update request:', JSON.stringify(updateRequest, null, 2));
    
    const result = await handleUpdatePartialWorkflow(updateRequest);
    logger.info('Update result:', JSON.stringify(result, null, 2));
    
    // Cleanup - delete test workflow
    if (createdWorkflow.id) {
      logger.info('\n=== Cleanup ===');
      await client.deleteWorkflow(createdWorkflow.id);
      logger.info('Deleted test workflow');
    }
    
  } catch (error) {
    logger.error('Test failed:', error);
  }
}

// Run test
testUpdatePartialDebug().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});