#!/usr/bin/env ts-node

/**
 * Test script for the n8n_validate_workflow tool
 * 
 * This script tests the new tool that fetches a workflow from n8n
 * and validates it using the existing validation logic.
 */

import { config } from 'dotenv';
import { handleValidateWorkflow } from '../mcp/handlers-n8n-manager';
import { NodeRepository } from '../database/node-repository';
import { createDatabaseAdapter } from '../database/database-adapter';
import { Logger } from '../utils/logger';
import * as path from 'path';

// Load environment variables
config();

const logger = new Logger({ prefix: '[TestN8nValidateWorkflow]' });

async function testN8nValidateWorkflow() {
  try {
    // Check if n8n API is configured
    if (!process.env.N8N_API_URL || !process.env.N8N_API_KEY) {
      logger.error('N8N_API_URL and N8N_API_KEY must be set in environment variables');
      process.exit(1);
    }

    logger.info('n8n API Configuration:', {
      url: process.env.N8N_API_URL,
      hasApiKey: !!process.env.N8N_API_KEY
    });

    // Initialize database
    const dbPath = path.join(process.cwd(), 'data', 'nodes.db');
    const db = await createDatabaseAdapter(dbPath);
    const repository = new NodeRepository(db);

    // Test cases
    const testCases = [
      {
        name: 'Validate existing workflow with all options',
        args: {
          id: '1', // Replace with an actual workflow ID from your n8n instance
          options: {
            validateNodes: true,
            validateConnections: true,
            validateExpressions: true,
            profile: 'runtime'
          }
        }
      },
      {
        name: 'Validate with minimal profile',
        args: {
          id: '1', // Replace with an actual workflow ID
          options: {
            profile: 'minimal'
          }
        }
      },
      {
        name: 'Validate connections only',
        args: {
          id: '1', // Replace with an actual workflow ID
          options: {
            validateNodes: false,
            validateConnections: true,
            validateExpressions: false
          }
        }
      }
    ];

    // Run test cases
    for (const testCase of testCases) {
      logger.info(`\nRunning test: ${testCase.name}`);
      logger.info('Input:', JSON.stringify(testCase.args, null, 2));

      try {
        const result = await handleValidateWorkflow(testCase.args, repository);
        
        if (result.success) {
          logger.info('✅ Validation completed successfully');
          logger.info('Result:', JSON.stringify(result.data, null, 2));
        } else {
          logger.error('❌ Validation failed');
          logger.error('Error:', result.error);
          if (result.details) {
            logger.error('Details:', JSON.stringify(result.details, null, 2));
          }
        }
      } catch (error) {
        logger.error('❌ Test case failed with exception:', error);
      }

      logger.info('-'.repeat(80));
    }

    logger.info('\n✅ All tests completed');

  } catch (error) {
    logger.error('Test script failed:', error);
    process.exit(1);
  }
}

// Run the test
testN8nValidateWorkflow().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});