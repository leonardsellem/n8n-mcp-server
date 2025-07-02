/**
 * MCP Handler for Partial Workflow Updates
 * Handles diff-based workflow modifications
 */

import { z } from 'zod';
import { McpToolResponse } from '../types/n8n-api';
import { WorkflowDiffRequest, WorkflowDiffOperation } from '../types/workflow-diff';
import { WorkflowDiffEngine } from '../services/workflow-diff-engine';
import { getN8nApiClient } from './handlers-n8n-manager';
import { N8nApiError, getUserFriendlyErrorMessage } from '../utils/n8n-errors';
import { logger } from '../utils/logger';

// Zod schema for the diff request
const workflowDiffSchema = z.object({
  id: z.string(),
  operations: z.array(z.object({
    type: z.string(),
    description: z.string().optional(),
    // Node operations
    node: z.any().optional(),
    nodeId: z.string().optional(),
    nodeName: z.string().optional(),
    changes: z.any().optional(),
    position: z.tuple([z.number(), z.number()]).optional(),
    // Connection operations
    source: z.string().optional(),
    target: z.string().optional(),
    sourceOutput: z.string().optional(),
    targetInput: z.string().optional(),
    sourceIndex: z.number().optional(),
    targetIndex: z.number().optional(),
    // Metadata operations
    settings: z.any().optional(),
    name: z.string().optional(),
    tag: z.string().optional(),
  })),
  validateOnly: z.boolean().optional(),
});

export async function handleUpdatePartialWorkflow(args: unknown): Promise<McpToolResponse> {
  try {
    // Debug logging (only in debug mode)
    if (process.env.DEBUG_MCP === 'true') {
      logger.debug('Workflow diff request received', {
        argsType: typeof args,
        hasWorkflowId: args && typeof args === 'object' && 'workflowId' in args,
        operationCount: args && typeof args === 'object' && 'operations' in args ? 
          (args as any).operations?.length : 0
      });
    }
    
    // Validate input
    const input = workflowDiffSchema.parse(args);
    
    // Get API client
    const client = getN8nApiClient();
    if (!client) {
      return {
        success: false,
        error: 'n8n API not configured. Please set N8N_API_URL and N8N_API_KEY environment variables.'
      };
    }
    
    // Fetch current workflow
    let workflow;
    try {
      workflow = await client.getWorkflow(input.id);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return {
          success: false,
          error: getUserFriendlyErrorMessage(error),
          code: error.code
        };
      }
      throw error;
    }
    
    // Apply diff operations
    const diffEngine = new WorkflowDiffEngine();
    const diffResult = await diffEngine.applyDiff(workflow, input as WorkflowDiffRequest);
    
    if (!diffResult.success) {
      return {
        success: false,
        error: 'Failed to apply diff operations',
        details: {
          errors: diffResult.errors,
          operationsApplied: diffResult.operationsApplied
        }
      };
    }
    
    // If validateOnly, return validation result
    if (input.validateOnly) {
      return {
        success: true,
        message: diffResult.message,
        data: {
          valid: true,
          operationsToApply: input.operations.length
        }
      };
    }
    
    // Update workflow via API
    try {
      const updatedWorkflow = await client.updateWorkflow(input.id, diffResult.workflow!);
      
      return {
        success: true,
        data: updatedWorkflow,
        message: `Workflow "${updatedWorkflow.name}" updated successfully. Applied ${diffResult.operationsApplied} operations.`,
        details: {
          operationsApplied: diffResult.operationsApplied,
          workflowId: updatedWorkflow.id,
          workflowName: updatedWorkflow.name
        }
      };
    } catch (error) {
      if (error instanceof N8nApiError) {
        return {
          success: false,
          error: getUserFriendlyErrorMessage(error),
          code: error.code,
          details: error.details as Record<string, unknown> | undefined
        };
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input',
        details: { errors: error.errors }
      };
    }
    
    logger.error('Failed to update partial workflow', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

