/**
 * Workflow Best Practices Tool
 * 
 * Tool for getting best practice recommendations and suggestions.
 */

import { DocumentationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface BestPracticesArgs {
  workflowId?: string;
  category?: 'performance' | 'security' | 'maintainability' | 'reliability' | 'all';
  includeExamples?: boolean;
}

export class WorkflowBestPracticesHandler extends DocumentationBaseHandler {
  async execute(args: BestPracticesArgs): Promise<ToolCallResult> {
    try {
      const { workflowId, category = 'all', includeExamples = true } = args;

      let recommendations: any;

      if (workflowId) {
        const workflow = await this.getWorkflow(workflowId);
        if (!workflow) {
          return this.formatError(`Workflow ${workflowId} not found`);
        }
        recommendations = this.analyzeWorkflowPractices(workflow, category, includeExamples);
      } else {
        recommendations = this.getGeneralBestPractices(category, includeExamples);
      }

      return this.formatDocumentationResponse(
        { category, recommendations, workflowSpecific: !!workflowId },
        `Generated best practices recommendations for ${category} category`
      );

    } catch (error) {
      return this.handleDocumentationError(error, 'workflow best practices');
    }
  }

  private async getWorkflow(workflowId: string): Promise<any> {
    // Mock workflow data
    return {
      id: workflowId,
      name: 'Sample Workflow',
      nodes: [
        { name: 'Start', type: 'n8n-nodes-base.webhook' },
        { name: 'Process', type: 'n8n-nodes-base.function' }
      ]
    };
  }

  private analyzeWorkflowPractices(workflow: any, category: string, includeExamples: boolean): any {
    const analysis: any = {
      workflowName: workflow.name,
      currentIssues: this.identifyIssues(workflow),
      recommendations: this.getWorkflowSpecificRecommendations(workflow, category),
      score: this.calculatePracticeScore(workflow)
    };

    if (includeExamples) {
      analysis.examples = this.getImplementationExamples(category);
    }

    return analysis;
  }

  private identifyIssues(workflow: any): string[] {
    const issues = [];
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      issues.push('Workflow has no nodes');
    }

    if (workflow.nodes?.some((n: any) => !n.name || n.name.trim() === '')) {
      issues.push('Some nodes have missing or empty names');
    }

    return issues;
  }

  private getWorkflowSpecificRecommendations(workflow: any, category: string): any[] {
    const recommendations = [];

    if (category === 'all' || category === 'maintainability') {
      recommendations.push({
        category: 'maintainability',
        title: 'Use descriptive node names',
        description: 'Ensure all nodes have clear, descriptive names',
        priority: 'high',
        effort: 'low'
      });
    }

    if (category === 'all' || category === 'performance') {
      recommendations.push({
        category: 'performance',
        title: 'Optimize HTTP requests',
        description: 'Use batch operations where possible',
        priority: 'medium',
        effort: 'medium'
      });
    }

    return recommendations;
  }

  private calculatePracticeScore(workflow: any): number {
    let score = 100;
    
    // Deduct points for issues
    if (!workflow.nodes || workflow.nodes.length === 0) score -= 50;
    if (workflow.nodes?.some((n: any) => !n.name)) score -= 20;
    
    return Math.max(0, score);
  }

  private getGeneralBestPractices(category: string, includeExamples: boolean): any {
    const practices = {
      performance: [
        'Use Set nodes instead of Function nodes for simple data transformations',
        'Implement caching for repeated API calls',
        'Use batch operations for multiple HTTP requests'
      ],
      security: [
        'Store sensitive data in credentials, not in node parameters',
        'Validate input data before processing',
        'Use HTTPS endpoints whenever possible'
      ],
      maintainability: [
        'Use descriptive names for workflows and nodes',
        'Add comments to complex logic',
        'Group related workflows in folders'
      ],
      reliability: [
        'Implement error handling for external API calls',
        'Use retry logic for transient failures',
        'Set appropriate timeouts for HTTP requests'
      ]
    };

    const selectedPractices = category === 'all' 
      ? Object.values(practices).flat()
      : practices[category as keyof typeof practices] || [];

    const result: any = {
      category,
      practices: selectedPractices.map(practice => ({
        title: practice,
        category: this.categorizePractice(practice)
      }))
    };

    if (includeExamples) {
      result.examples = this.getImplementationExamples(category);
    }

    return result;
  }

  private categorizePractice(practice: string): string {
    if (practice.includes('security') || practice.includes('credentials')) return 'security';
    if (practice.includes('performance') || practice.includes('cache')) return 'performance';
    if (practice.includes('error') || practice.includes('retry')) return 'reliability';
    return 'maintainability';
  }

  private getImplementationExamples(category: string): any[] {
    const examples = {
      performance: [
        {
          title: 'HTTP Request Batching',
          description: 'Combine multiple API calls into a single batch request',
          code: '// Use HTTP Request node with batch parameters'
        }
      ],
      security: [
        {
          title: 'Credential Management',
          description: 'Store API keys in n8n credentials instead of hardcoding',
          code: '// Reference credentials in HTTP Request node'
        }
      ]
    };

    return examples[category as keyof typeof examples] || [];
  }
}

export function getWorkflowBestPracticesToolDefinition(): ToolDefinition {
  return {
    name: 'workflow_best_practices',
    description: 'Get best practice recommendations and suggestions for workflow development',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of specific workflow to analyze'
        },
        category: {
          type: 'string',
          enum: ['performance', 'security', 'maintainability', 'reliability', 'all'],
          description: 'Category of best practices to focus on (default: all)',
          default: 'all'
        },
        includeExamples: {
          type: 'boolean',
          description: 'Include implementation examples',
          default: true
        }
      },
      required: []
    }
  };
}