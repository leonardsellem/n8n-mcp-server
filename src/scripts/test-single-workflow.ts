#!/usr/bin/env node

/**
 * Test validation of a single workflow
 */

import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { NodeRepository } from '../database/node-repository';
import { createDatabaseAdapter } from '../database/database-adapter';
import { WorkflowValidator } from '../services/workflow-validator';
import { EnhancedConfigValidator } from '../services/enhanced-config-validator';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[test-single-workflow]' });

async function testSingleWorkflow() {
  // Read the workflow file
  const workflowPath = process.argv[2];
  if (!workflowPath) {
    logger.error('Please provide a workflow file path');
    process.exit(1);
  }

  if (!existsSync(workflowPath)) {
    logger.error(`Workflow file not found: ${workflowPath}`);
    process.exit(1);
  }

  logger.info(`Testing workflow: ${workflowPath}\n`);

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

  try {
    // Read and parse workflow
    const workflowJson = JSON.parse(readFileSync(workflowPath, 'utf8'));
    
    logger.info(`Workflow: ${workflowJson.name || 'Unnamed'}`);
    logger.info(`Nodes: ${workflowJson.nodes?.length || 0}`);
    logger.info(`Connections: ${Object.keys(workflowJson.connections || {}).length}`);
    
    // List all node types in the workflow
    logger.info('\nNode types in workflow:');
    workflowJson.nodes?.forEach((node: any) => {
      logger.info(`  - ${node.name}: ${node.type}`);
    });

    // Check what these node types are in our database
    logger.info('\nChecking node types in database:');
    for (const node of workflowJson.nodes || []) {
      const dbNode = repository.getNode(node.type);
      if (dbNode) {
        logger.info(`  ✓ ${node.type} found in database`);
      } else {
        // Try normalization patterns
        let shortType = node.type;
        if (node.type.startsWith('n8n-nodes-base.')) {
          shortType = node.type.replace('n8n-nodes-base.', 'nodes-base.');
        } else if (node.type.startsWith('@n8n/n8n-nodes-langchain.')) {
          shortType = node.type.replace('@n8n/n8n-nodes-langchain.', 'nodes-langchain.');
        }
        
        const dbNodeShort = repository.getNode(shortType);
        if (dbNodeShort) {
          logger.info(`  ✓ ${shortType} found in database (normalized)`);
        } else {
          logger.error(`  ✗ ${node.type} NOT found in database`);
        }
      }
    }

    logger.info('\n' + '='.repeat(80));
    logger.info('VALIDATION RESULTS');
    logger.info('='.repeat(80) + '\n');

    // Validate the workflow
    const result = await validator.validateWorkflow(workflowJson);
    
    console.log(`Valid: ${result.valid ? '✅ YES' : '❌ NO'}`);
    
    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach((error: any) => {
        console.log(`  - ${error.nodeName || 'workflow'}: ${error.message}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((warning: any) => {
        const msg = typeof warning.message === 'string' 
          ? warning.message 
          : JSON.stringify(warning.message);
        console.log(`  - ${warning.nodeName || 'workflow'}: ${msg}`);
      });
    }

    if (result.suggestions?.length > 0) {
      console.log('\nSuggestions:');
      result.suggestions.forEach((suggestion: string) => {
        console.log(`  - ${suggestion}`);
      });
    }

    console.log('\nStatistics:');
    console.log(`  - Total nodes: ${result.statistics.totalNodes}`);
    console.log(`  - Enabled nodes: ${result.statistics.enabledNodes}`);
    console.log(`  - Trigger nodes: ${result.statistics.triggerNodes}`);
    console.log(`  - Valid connections: ${result.statistics.validConnections}`);
    console.log(`  - Invalid connections: ${result.statistics.invalidConnections}`);
    console.log(`  - Expressions validated: ${result.statistics.expressionsValidated}`);

  } catch (error) {
    logger.error('Failed to validate workflow:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run test
testSingleWorkflow().catch(error => {
  logger.error('Test failed:', error);
  process.exit(1);
});