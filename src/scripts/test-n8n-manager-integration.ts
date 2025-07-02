#!/usr/bin/env node

import { config } from 'dotenv';
import { logger } from '../utils/logger';
import { isN8nApiConfigured, getN8nApiConfig } from '../config/n8n-api';
import { getN8nApiClient } from '../mcp/handlers-n8n-manager';
import { N8nApiClient } from '../services/n8n-api-client';
import { Workflow, ExecutionStatus } from '../types/n8n-api';

// Load environment variables
config();

async function testN8nManagerIntegration() {
  logger.info('Testing n8n Manager Integration...');
  
  // Check if API is configured
  if (!isN8nApiConfigured()) {
    logger.warn('n8n API not configured. Set N8N_API_URL and N8N_API_KEY to test.');
    logger.info('Example:');
    logger.info('  N8N_API_URL=https://your-n8n.com N8N_API_KEY=your-key npm run test:n8n-manager');
    return;
  }
  
  const apiConfig = getN8nApiConfig();
  logger.info('n8n API Configuration:', {
    url: apiConfig!.baseUrl,
    timeout: apiConfig!.timeout,
    maxRetries: apiConfig!.maxRetries
  });
  
  const client = getN8nApiClient();
  if (!client) {
    logger.error('Failed to create n8n API client');
    return;
  }
  
  try {
    // Test 1: Health Check
    logger.info('\n=== Test 1: Health Check ===');
    const health = await client.healthCheck();
    logger.info('Health check passed:', health);
    
    // Test 2: List Workflows
    logger.info('\n=== Test 2: List Workflows ===');
    const workflows = await client.listWorkflows({ limit: 5 });
    logger.info(`Found ${workflows.data.length} workflows`);
    workflows.data.forEach(wf => {
      logger.info(`- ${wf.name} (ID: ${wf.id}, Active: ${wf.active})`);
    });
    
    // Test 3: Create a Test Workflow
    logger.info('\n=== Test 3: Create Test Workflow ===');
    const testWorkflow: Partial<Workflow> = {
      name: `Test Workflow - MCP Integration ${Date.now()}`,
      nodes: [
        {
          id: '1',
          name: 'Start',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [250, 300],
          parameters: {}
        },
        {
          id: '2',
          name: 'Set',
          type: 'n8n-nodes-base.set',
          typeVersion: 1,
          position: [450, 300],
          parameters: {
            values: {
              string: [
                {
                  name: 'message',
                  value: 'Hello from MCP!'
                }
              ]
            }
          }
        }
      ],
      connections: {
        '1': {
          main: [[{ node: '2', type: 'main', index: 0 }]]
        }
      },
      settings: {
        executionOrder: 'v1',
        saveDataErrorExecution: 'all',
        saveDataSuccessExecution: 'all',
        saveManualExecutions: true,
        saveExecutionProgress: true
      }
    };
    
    const createdWorkflow = await client.createWorkflow(testWorkflow);
    logger.info('Created workflow:', {
      id: createdWorkflow.id,
      name: createdWorkflow.name,
      active: createdWorkflow.active
    });
    
    // Test 4: Get Workflow Details
    logger.info('\n=== Test 4: Get Workflow Details ===');
    const workflowDetails = await client.getWorkflow(createdWorkflow.id!);
    logger.info('Retrieved workflow:', {
      id: workflowDetails.id,
      name: workflowDetails.name,
      nodeCount: workflowDetails.nodes.length
    });
    
    // Test 5: Update Workflow
    logger.info('\n=== Test 5: Update Workflow ===');
    // n8n API requires full workflow structure for updates
    const updatedWorkflow = await client.updateWorkflow(createdWorkflow.id!, {
      name: `${createdWorkflow.name} - Updated`,
      nodes: workflowDetails.nodes,
      connections: workflowDetails.connections,
      settings: workflowDetails.settings
    });
    logger.info('Updated workflow name:', updatedWorkflow.name);
    
    // Test 6: List Executions
    logger.info('\n=== Test 6: List Recent Executions ===');
    const executions = await client.listExecutions({ limit: 5 });
    logger.info(`Found ${executions.data.length} recent executions`);
    executions.data.forEach(exec => {
      logger.info(`- Workflow: ${exec.workflowName || exec.workflowId}, Status: ${exec.status}, Started: ${exec.startedAt}`);
    });
    
    // Test 7: Cleanup - Delete Test Workflow
    logger.info('\n=== Test 7: Cleanup ===');
    await client.deleteWorkflow(createdWorkflow.id!);
    logger.info('Deleted test workflow');
    
    logger.info('\n✅ All tests passed successfully!');
    
  } catch (error) {
    logger.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testN8nManagerIntegration().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});