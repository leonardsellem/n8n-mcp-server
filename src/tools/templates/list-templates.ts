/**
 * List Workflow Templates Tool
 *
 * This module provides functionality to browse pre-built workflow templates.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseTemplateToolHandler } from './base-handler.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Handler for listing workflow templates
 */
export class ListWorkflowTemplatesHandler extends BaseTemplateToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { category, search, tags } = args;

      try {
        // Get only built-in templates from n8n.io
        let allTemplates = this.getBuiltInTemplates();

        // Apply filters
        if (category) {
          allTemplates = allTemplates.filter(template => 
            template.category?.toLowerCase() === category.toLowerCase()
          );
        }

        if (search) {
          const searchLower = search.toLowerCase();
          allTemplates = allTemplates.filter(template =>
            template.name?.toLowerCase().includes(searchLower) ||
            template.description?.toLowerCase().includes(searchLower)
          );
        }

        if (tags && Array.isArray(tags)) {
          allTemplates = allTemplates.filter(template =>
            template.tags && tags.some(tag => template.tags.includes(tag))
          );
        }

        // Sort by category and name
        allTemplates.sort((a, b) => {
          if (a.category !== b.category) {
            return (a.category || '').localeCompare(b.category || '');
          }
          return (a.name || '').localeCompare(b.name || '');
        });

        const summary = {
          total: allTemplates.length,
          categories: [...new Set(allTemplates.map(t => t.category).filter(Boolean))],
          templates: allTemplates.map(template => ({
            id: template.id,
            name: template.name,
            description: template.description,
            category: template.category,
            tags: template.tags,
            version: template.version,
            author: template.author,
            createdAt: template.createdAt,
            parametersCount: template.parameters?.length || 0
          }))
        };

        return this.formatSuccess(summary, 'Available workflow templates');
      } catch (error) {
        throw new Error(`Failed to list templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

}

/**
 * Get the tool definition for listing workflow templates
 */
export function getListWorkflowTemplatesToolDefinition(): ToolDefinition {
  return {
    name: 'list_workflow_templates',
    description: 'Browse pre-built workflow templates by category, tags, or search terms',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter templates by category (e.g., "communication", "integration", "data-processing")'
        },
        search: {
          type: 'string',
          description: 'Search templates by name or description'
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter templates by tags'
        }
      }
    }
  };
}