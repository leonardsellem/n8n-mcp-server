#!/usr/bin/env node

/**
 * Test workflow validation on actual n8n templates from the database
 */

import { existsSync } from 'fs';
import path from 'path';
import { NodeRepository } from '../database/node-repository';
import { createDatabaseAdapter } from '../database/database-adapter';
import { WorkflowValidator } from '../services/workflow-validator';
import { EnhancedConfigValidator } from '../services/enhanced-config-validator';
import { TemplateRepository } from '../templates/template-repository';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[test-template-validation]' });

async function testTemplateValidation() {
  logger.info('Starting template validation tests...\n');

  // Initialize database
  const dbPath = path.join(process.cwd(), 'data', 'nodes.db');
  if (!existsSync(dbPath)) {
    logger.error('Database not found. Run npm run rebuild first.');
    process.exit(1);
  }

  const db = await createDatabaseAdapter(dbPath);
  const repository = new NodeRepository(db);
  const templateRepository = new TemplateRepository(db);
  const validator = new WorkflowValidator(
    repository,
    EnhancedConfigValidator
  );

  try {
    // Get some templates to test
    const templates = await templateRepository.getAllTemplates(20);
    
    if (templates.length === 0) {
      logger.warn('No templates found in database. Run npm run fetch:templates first.');
      process.exit(0);
    }

    logger.info(`Found ${templates.length} templates to validate\n`);

    const results = {
      total: templates.length,
      valid: 0,
      invalid: 0,
      withErrors: 0,
      withWarnings: 0,
      errorTypes: new Map<string, number>(),
      warningTypes: new Map<string, number>()
    };

    // Validate each template
    for (const template of templates) {
      logger.info(`\n${'='.repeat(80)}`);
      logger.info(`Validating: ${template.name} (ID: ${template.id})`);
      logger.info(`Author: ${template.author_name} (@${template.author_username})`);
      logger.info(`Views: ${template.views}`);
      logger.info(`${'='.repeat(80)}\n`);

      try {
        const workflow = JSON.parse(template.workflow_json);
        
        // Log workflow summary
        logger.info(`Workflow summary:`);
        logger.info(`- Nodes: ${workflow.nodes?.length || 0}`);
        logger.info(`- Connections: ${Object.keys(workflow.connections || {}).length}`);
        
        // Validate the workflow
        const validationResult = await validator.validateWorkflow(workflow);
        
        // Update statistics
        if (validationResult.valid) {
          results.valid++;
          console.log('✅ VALID');
        } else {
          results.invalid++;
          console.log('❌ INVALID');
        }

        if (validationResult.errors.length > 0) {
          results.withErrors++;
          console.log('\nErrors:');
          validationResult.errors.forEach((error: any) => {
            const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
            const errorKey = errorMsg.substring(0, 50);
            results.errorTypes.set(errorKey, (results.errorTypes.get(errorKey) || 0) + 1);
            console.log(`  - ${error.nodeName || 'workflow'}: ${errorMsg}`);
          });
        }

        if (validationResult.warnings.length > 0) {
          results.withWarnings++;
          console.log('\nWarnings:');
          validationResult.warnings.forEach((warning: any) => {
            const warningKey = typeof warning.message === 'string' 
              ? warning.message.substring(0, 50) 
              : JSON.stringify(warning.message).substring(0, 50);
            results.warningTypes.set(warningKey, (results.warningTypes.get(warningKey) || 0) + 1);
            console.log(`  - ${warning.nodeName || 'workflow'}: ${
              typeof warning.message === 'string' ? warning.message : JSON.stringify(warning.message)
            }`);
          });
        }

        if (validationResult.suggestions?.length > 0) {
          console.log('\nSuggestions:');
          validationResult.suggestions.forEach((suggestion: string) => {
            console.log(`  - ${suggestion}`);
          });
        }

        console.log('\nStatistics:');
        console.log(`  - Total nodes: ${validationResult.statistics.totalNodes}`);
        console.log(`  - Enabled nodes: ${validationResult.statistics.enabledNodes}`);
        console.log(`  - Trigger nodes: ${validationResult.statistics.triggerNodes}`);
        console.log(`  - Valid connections: ${validationResult.statistics.validConnections}`);
        console.log(`  - Invalid connections: ${validationResult.statistics.invalidConnections}`);
        console.log(`  - Expressions validated: ${validationResult.statistics.expressionsValidated}`);

      } catch (error) {
        logger.error(`Failed to validate template ${template.id}:`, error);
        results.invalid++;
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total templates tested: ${results.total}`);
    console.log(`Valid workflows: ${results.valid} (${((results.valid / results.total) * 100).toFixed(1)}%)`);
    console.log(`Invalid workflows: ${results.invalid} (${((results.invalid / results.total) * 100).toFixed(1)}%)`);
    console.log(`Workflows with errors: ${results.withErrors}`);
    console.log(`Workflows with warnings: ${results.withWarnings}`);

    if (results.errorTypes.size > 0) {
      console.log('\nMost common errors:');
      const sortedErrors = Array.from(results.errorTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      sortedErrors.forEach(([error, count]) => {
        console.log(`  - "${error}..." (${count} times)`);
      });
    }

    if (results.warningTypes.size > 0) {
      console.log('\nMost common warnings:');
      const sortedWarnings = Array.from(results.warningTypes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      sortedWarnings.forEach(([warning, count]) => {
        console.log(`  - "${warning}..." (${count} times)`);
      });
    }

  } catch (error) {
    logger.error('Failed to run template validation:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run tests
testTemplateValidation().catch(error => {
  logger.error('Test failed:', error);
  process.exit(1);
});