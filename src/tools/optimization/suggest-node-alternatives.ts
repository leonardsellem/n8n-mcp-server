/**
 * Suggest Node Alternatives Tool
 * 
 * Tool for recommending better node alternatives based on usage patterns.
 */

import { OptimizationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface SuggestAlternativesArgs {
  workflowId?: string;
  nodeId?: string;
  optimizationGoal?: 'performance' | 'reliability' | 'functionality' | 'cost' | 'all';
  includeExperimental?: boolean;
  includeThirdParty?: boolean;
  minConfidence?: number;
}

interface NodeAlternative {
  currentNode: {
    id: string;
    name: string;
    type: string;
    description: string;
  };
  alternatives: Array<{
    nodeType: string;
    name: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    migrationDifficulty: 'easy' | 'medium' | 'hard';
    confidenceScore: number;
    category: 'official' | 'community' | 'experimental';
    estimatedImprovement: {
      performance: string;
      reliability: string;
      functionality: string;
      cost: string;
    };
    migrationSteps: string[];
    requiredCredentials?: string[];
    compatibilityNotes?: string[];
  }>;
  recommendedAlternative?: string;
  reasoning: string;
}

interface SuggestionResult {
  workflowId?: string;
  totalNodes: number;
  analyzedNodes: number;
  suggestions: NodeAlternative[];
  summary: {
    totalSuggestions: number;
    highConfidenceSuggestions: number;
    easyMigrations: number;
    potentialImprovements: string[];
  };
  migrationPlan?: {
    phases: Array<{
      phase: number;
      nodes: string[];
      estimatedEffort: string;
      dependencies: string[];
    }>;
    totalEstimatedTime: string;
    riskAssessment: string;
  };
}

export class SuggestNodeAlternativesHandler extends OptimizationBaseHandler {
  async execute(args: SuggestAlternativesArgs): Promise<ToolCallResult> {
    try {
      const {
        workflowId,
        nodeId,
        optimizationGoal = 'all',
        includeExperimental = false,
        includeThirdParty = true,
        minConfidence = 0.7
      } = args;

      let nodesToAnalyze: any[] = [];

      if (nodeId && workflowId) {
        // Analyze specific node in specific workflow
        const workflow = await this.getWorkflow(workflowId);
        const node = workflow?.nodes?.find((n: any) => n.id === nodeId || n.name === nodeId);
        if (!node) {
          return this.formatError(`Node ${nodeId} not found in workflow ${workflowId}`);
        }
        nodesToAnalyze = [{ ...node, workflowId }];
      } else if (workflowId) {
        // Analyze all nodes in specific workflow
        const workflow = await this.getWorkflow(workflowId);
        if (!workflow) {
          return this.formatError(`Workflow ${workflowId} not found`);
        }
        nodesToAnalyze = workflow.nodes?.map((n: any) => ({ ...n, workflowId })) || [];
      } else {
        // Analyze nodes across all workflows that could benefit from alternatives
        nodesToAnalyze = await this.getNodesNeedingAlternatives();
      }

      const suggestions: NodeAlternative[] = [];

      for (const node of nodesToAnalyze) {
        const suggestion = await this.analyzeNodeForAlternatives(
          node,
          optimizationGoal,
          includeExperimental,
          includeThirdParty,
          minConfidence
        );

        if (suggestion && suggestion.alternatives.length > 0) {
          suggestions.push(suggestion);
        }
      }

      // Filter by confidence
      const filteredSuggestions = suggestions.filter(s => 
        s.alternatives.some(alt => alt.confidenceScore >= minConfidence)
      );

      const result: SuggestionResult = {
        workflowId,
        totalNodes: nodesToAnalyze.length,
        analyzedNodes: suggestions.length,
        suggestions: filteredSuggestions,
        summary: this.generateSuggestionSummary(filteredSuggestions),
        migrationPlan: filteredSuggestions.length > 0 ? this.generateMigrationPlan(filteredSuggestions) : undefined
      };

      return this.formatOptimizationResponse(
        result,
        `Generated ${filteredSuggestions.length} node alternative suggestions`
      );

    } catch (error) {
      return this.handleOptimizationError(error, 'suggest node alternatives');
    }
  }

  private async getWorkflow(workflowId: string): Promise<any> {
    // Mock workflow data
    return {
      id: workflowId,
      name: 'Sample Workflow',
      nodes: [
        { 
          id: 'node1', 
          name: 'HTTP Request', 
          type: 'n8n-nodes-base.httpRequest',
          parameters: { method: 'GET', url: 'https://api.example.com' }
        },
        { 
          id: 'node2', 
          name: 'Code', 
          type: 'n8n-nodes-base.code',
          parameters: { language: 'javascript' }
        },
        { 
          id: 'node3', 
          name: 'Spreadsheet File', 
          type: 'n8n-nodes-base.spreadsheetFile',
          parameters: { operation: 'read' }
        }
      ]
    };
  }

  private async getNodesNeedingAlternatives(): Promise<any[]> {
    // Mock nodes that could benefit from alternatives
    return [
      { 
        id: 'node1', 
        name: 'HTTP Request', 
        type: 'n8n-nodes-base.httpRequest',
        workflowId: 'workflow1'
      },
      { 
        id: 'node2', 
        name: 'Code', 
        type: 'n8n-nodes-base.code',
        workflowId: 'workflow1'
      }
    ];
  }

  private async analyzeNodeForAlternatives(
    node: any,
    optimizationGoal: string,
    includeExperimental: boolean,
    includeThirdParty: boolean,
    minConfidence: number
  ): Promise<NodeAlternative | null> {

    const alternatives = await this.findAlternatives(
      node.type,
      optimizationGoal,
      includeExperimental,
      includeThirdParty
    );

    if (alternatives.length === 0) {
      return null;
    }

    // Filter alternatives by confidence
    const qualifiedAlternatives = alternatives.filter(alt => alt.confidenceScore >= minConfidence);
    
    if (qualifiedAlternatives.length === 0) {
      return null;
    }

    // Find the best recommended alternative
    const recommendedAlternative = this.selectBestAlternative(qualifiedAlternatives, optimizationGoal);

    return {
      currentNode: {
        id: node.id || node.name,
        name: node.name,
        type: node.type,
        description: this.getNodeDescription(node.type)
      },
      alternatives: qualifiedAlternatives,
      recommendedAlternative: recommendedAlternative?.nodeType,
      reasoning: this.generateReasoningForRecommendation(node, recommendedAlternative, optimizationGoal)
    };
  }

  private async findAlternatives(
    currentNodeType: string,
    optimizationGoal: string,
    includeExperimental: boolean,
    includeThirdParty: boolean
  ): Promise<any[]> {

    const alternativeDatabase: Record<string, any[]> = {
      'n8n-nodes-base.httpRequest': [
        {
          nodeType: 'n8n-nodes-base.httpBatch',
          name: 'HTTP Batch',
          description: 'Execute multiple HTTP requests in parallel',
          advantages: [
            'Batch processing reduces total execution time',
            'Better resource utilization',
            'Built-in error handling for batches'
          ],
          disadvantages: [
            'More complex configuration',
            'Requires restructuring workflow logic'
          ],
          migrationDifficulty: 'medium',
          confidenceScore: 0.85,
          category: 'community',
          estimatedImprovement: {
            performance: '40-60% faster for multiple requests',
            reliability: '20% improvement',
            functionality: 'Enhanced batch capabilities',
            cost: '30% reduction in execution time'
          },
          migrationSteps: [
            'Identify all HTTP requests that can be batched',
            'Restructure workflow to group requests',
            'Update error handling logic',
            'Test batch operations'
          ],
          requiredCredentials: ['http'],
          compatibilityNotes: ['Requires n8n v0.200.0+']
        },
        {
          nodeType: 'n8n-nodes-base.webhook',
          name: 'Webhook',
          description: 'Use webhooks for event-driven architecture instead of polling',
          advantages: [
            'Real-time data processing',
            'Reduced API calls and rate limiting',
            'Lower resource consumption'
          ],
          disadvantages: [
            'Requires webhook support from external service',
            'More complex setup'
          ],
          migrationDifficulty: 'hard',
          confidenceScore: 0.75,
          category: 'official',
          estimatedImprovement: {
            performance: '80% reduction in unnecessary calls',
            reliability: '50% improvement',
            functionality: 'Real-time processing',
            cost: '60% reduction in API usage'
          },
          migrationSteps: [
            'Configure webhook endpoint',
            'Update external service to send webhooks',
            'Modify workflow trigger logic',
            'Implement webhook validation'
          ]
        }
      ],
      'n8n-nodes-base.code': [
        {
          nodeType: 'n8n-nodes-base.function',
          name: 'Function',
          description: 'Legacy function node with simpler interface',
          advantages: [
            'Simpler code structure',
            'Better for basic transformations',
            'Faster execution for simple operations'
          ],
          disadvantages: [
            'Less powerful than Code node',
            'Limited JavaScript features',
            'Deprecated in newer versions'
          ],
          migrationDifficulty: 'easy',
          confidenceScore: 0.6,
          category: 'official',
          estimatedImprovement: {
            performance: '10-20% faster for simple operations',
            reliability: 'No significant change',
            functionality: 'Reduced functionality',
            cost: 'Minor improvement'
          },
          migrationSteps: [
            'Convert code to function format',
            'Test functionality',
            'Update error handling'
          ]
        },
        {
          nodeType: 'n8n-nodes-base.set',
          name: 'Set',
          description: 'Use Set node for simple data transformations',
          advantages: [
            'No code required',
            'Visual configuration',
            'Better maintainability for simple operations'
          ],
          disadvantages: [
            'Limited to simple transformations',
            'Cannot handle complex logic'
          ],
          migrationDifficulty: 'easy',
          confidenceScore: 0.8,
          category: 'official',
          estimatedImprovement: {
            performance: '30% faster for simple transformations',
            reliability: '25% improvement',
            functionality: 'Limited to simple operations',
            cost: 'Significant improvement'
          },
          migrationSteps: [
            'Identify simple transformations in code',
            'Configure Set node mappings',
            'Test data transformations',
            'Remove unnecessary code'
          ]
        }
      ],
      'n8n-nodes-base.spreadsheetFile': [
        {
          nodeType: 'n8n-nodes-base.googleSheets',
          name: 'Google Sheets',
          description: 'Direct Google Sheets integration instead of file operations',
          advantages: [
            'Real-time data access',
            'No file upload/download overhead',
            'Better collaboration features',
            'Automatic syncing'
          ],
          disadvantages: [
            'Requires Google account',
            'Internet dependency',
            'API rate limits'
          ],
          migrationDifficulty: 'medium',
          confidenceScore: 0.9,
          category: 'official',
          estimatedImprovement: {
            performance: '50% faster data access',
            reliability: '40% improvement',
            functionality: 'Enhanced collaboration',
            cost: '20% reduction in processing time'
          },
          migrationSteps: [
            'Set up Google Sheets API credentials',
            'Create or move data to Google Sheets',
            'Update workflow to use Google Sheets node',
            'Test data operations',
            'Remove file-based operations'
          ],
          requiredCredentials: ['googleSheetsOAuth2Api']
        }
      ]
    };

    let alternatives = alternativeDatabase[currentNodeType] || [];

    // Filter based on inclusion preferences
    if (!includeExperimental) {
      alternatives = alternatives.filter(alt => alt.category !== 'experimental');
    }

    if (!includeThirdParty) {
      alternatives = alternatives.filter(alt => alt.category !== 'community');
    }

    return alternatives;
  }

  private selectBestAlternative(alternatives: any[], optimizationGoal: string): any {
    // Score alternatives based on optimization goal
    const scoredAlternatives = alternatives.map(alt => {
      let score = alt.confidenceScore;

      // Adjust score based on optimization goal
      switch (optimizationGoal) {
        case 'performance':
          score += this.parseImprovementPercentage(alt.estimatedImprovement.performance) / 100;
          break;
        case 'reliability':
          score += this.parseImprovementPercentage(alt.estimatedImprovement.reliability) / 100;
          break;
        case 'cost':
          score += this.parseImprovementPercentage(alt.estimatedImprovement.cost) / 100;
          break;
        case 'functionality':
          score += 0.1; // Small bonus for functionality improvements
          break;
        case 'all':
          score += (
            this.parseImprovementPercentage(alt.estimatedImprovement.performance) +
            this.parseImprovementPercentage(alt.estimatedImprovement.reliability) +
            this.parseImprovementPercentage(alt.estimatedImprovement.cost)
          ) / 300; // Average improvement across all areas
          break;
      }

      // Penalty for difficult migrations
      if (alt.migrationDifficulty === 'hard') {
        score -= 0.2;
      } else if (alt.migrationDifficulty === 'medium') {
        score -= 0.1;
      }

      return { ...alt, finalScore: score };
    });

    // Return the highest scored alternative
    return scoredAlternatives.reduce((best, current) => 
      current.finalScore > best.finalScore ? current : best
    );
  }

  private parseImprovementPercentage(improvementText: string): number {
    // Extract percentage from improvement text like "40-60% faster" or "20% improvement"
    const match = improvementText.match(/(\d+)(?:-\d+)?%/);
    return match ? parseInt(match[1]) : 0;
  }

  private getNodeDescription(nodeType: string): string {
    const descriptions: Record<string, string> = {
      'n8n-nodes-base.httpRequest': 'Make HTTP requests to external APIs',
      'n8n-nodes-base.code': 'Execute custom JavaScript code',
      'n8n-nodes-base.function': 'Execute simple JavaScript functions',
      'n8n-nodes-base.spreadsheetFile': 'Read and write spreadsheet files',
      'n8n-nodes-base.set': 'Set or modify data properties'
    };

    return descriptions[nodeType] || 'Node for data processing';
  }

  private generateReasoningForRecommendation(
    currentNode: any,
    recommendedAlternative: any,
    optimizationGoal: string
  ): string {
    if (!recommendedAlternative) {
      return 'No suitable alternatives found for the specified criteria.';
    }

    let reasoning = `Recommended ${recommendedAlternative.name} over ${currentNode.name} because: `;
    
    const primaryAdvantages = recommendedAlternative.advantages.slice(0, 2);
    reasoning += primaryAdvantages.join(', ') + '. ';

    if (optimizationGoal !== 'all') {
      const improvement = recommendedAlternative.estimatedImprovement[optimizationGoal];
      if (improvement && improvement !== 'No significant change') {
        reasoning += `This provides ${improvement.toLowerCase()} for your ${optimizationGoal} optimization goal. `;
      }
    }

    if (recommendedAlternative.migrationDifficulty === 'easy') {
      reasoning += 'Migration is straightforward with minimal workflow changes required.';
    } else if (recommendedAlternative.migrationDifficulty === 'medium') {
      reasoning += 'Migration requires moderate effort but provides significant benefits.';
    } else {
      reasoning += 'Migration is complex but offers substantial improvements.';
    }

    return reasoning;
  }

  private generateSuggestionSummary(suggestions: NodeAlternative[]) {
    const totalSuggestions = suggestions.reduce((sum, s) => sum + s.alternatives.length, 0);
    const highConfidenceSuggestions = suggestions.reduce((sum, s) => 
      sum + s.alternatives.filter(alt => alt.confidenceScore >= 0.8).length, 0
    );
    const easyMigrations = suggestions.reduce((sum, s) => 
      sum + s.alternatives.filter(alt => alt.migrationDifficulty === 'easy').length, 0
    );

    const potentialImprovements: string[] = [];
    suggestions.forEach(s => {
      s.alternatives.forEach(alt => {
        if (alt.confidenceScore >= 0.8) {
          alt.advantages.forEach(advantage => {
            if (!potentialImprovements.includes(advantage)) {
              potentialImprovements.push(advantage);
            }
          });
        }
      });
    });

    return {
      totalSuggestions,
      highConfidenceSuggestions,
      easyMigrations,
      potentialImprovements: potentialImprovements.slice(0, 5) // Top 5 improvements
    };
  }

  private generateMigrationPlan(suggestions: NodeAlternative[]) {
    // Group suggestions by migration difficulty
    const easyMigrations = suggestions.filter(s => 
      s.alternatives.some(alt => alt.migrationDifficulty === 'easy')
    );
    const mediumMigrations = suggestions.filter(s => 
      s.alternatives.some(alt => alt.migrationDifficulty === 'medium' && 
        !s.alternatives.some(alt2 => alt2.migrationDifficulty === 'easy'))
    );
    const hardMigrations = suggestions.filter(s => 
      s.alternatives.every(alt => alt.migrationDifficulty === 'hard')
    );

    const phases = [];
    
    if (easyMigrations.length > 0) {
      phases.push({
        phase: 1,
        nodes: easyMigrations.map(s => s.currentNode.name),
        estimatedEffort: '1-2 days',
        dependencies: []
      });
    }

    if (mediumMigrations.length > 0) {
      phases.push({
        phase: phases.length + 1,
        nodes: mediumMigrations.map(s => s.currentNode.name),
        estimatedEffort: '3-5 days',
        dependencies: phases.length > 0 ? ['Phase 1 completion'] : []
      });
    }

    if (hardMigrations.length > 0) {
      phases.push({
        phase: phases.length + 1,
        nodes: hardMigrations.map(s => s.currentNode.name),
        estimatedEffort: '1-2 weeks',
        dependencies: phases.length > 0 ? [`Phase ${phases.length} completion`] : []
      });
    }

    return {
      phases,
      totalEstimatedTime: this.calculateTotalMigrationTime(phases),
      riskAssessment: this.assessMigrationRisk(suggestions)
    };
  }

  private calculateTotalMigrationTime(phases: any[]): string {
    const totalDays = phases.reduce((sum, phase) => {
      if (phase.estimatedEffort.includes('week')) {
        return sum + 7; // 1 week = 7 days
      } else if (phase.estimatedEffort.includes('day')) {
        const days = parseInt(phase.estimatedEffort.match(/(\d+)/)?.[1] || '1');
        return sum + days;
      }
      return sum;
    }, 0);

    if (totalDays > 7) {
      return `${Math.ceil(totalDays / 7)} weeks`;
    } else {
      return `${totalDays} days`;
    }
  }

  private assessMigrationRisk(suggestions: NodeAlternative[]): string {
    const hasHardMigrations = suggestions.some(s => 
      s.alternatives.some(alt => alt.migrationDifficulty === 'hard')
    );
    const hasLowConfidence = suggestions.some(s => 
      s.alternatives.some(alt => alt.confidenceScore < 0.7)
    );

    if (hasHardMigrations && hasLowConfidence) {
      return 'high';
    } else if (hasHardMigrations || hasLowConfidence) {
      return 'medium';
    } else {
      return 'low';
    }
  }
}

export function getSuggestNodeAlternativesToolDefinition(): ToolDefinition {
  return {
    name: 'suggest_node_alternatives',
    description: 'Recommend better node alternatives based on usage patterns and optimization goals',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of specific workflow to analyze'
        },
        nodeId: {
          type: 'string',
          description: 'Optional ID of specific node to analyze (requires workflowId)'
        },
        optimizationGoal: {
          type: 'string',
          enum: ['performance', 'reliability', 'functionality', 'cost', 'all'],
          description: 'Primary optimization goal for suggestions (default: all)',
          default: 'all'
        },
        includeExperimental: {
          type: 'boolean',
          description: 'Include experimental node alternatives',
          default: false
        },
        includeThirdParty: {
          type: 'boolean',
          description: 'Include community/third-party node alternatives',
          default: true
        },
        minConfidence: {
          type: 'number',
          description: 'Minimum confidence score for suggestions (0.0-1.0)',
          default: 0.7
        }
      },
      required: []
    }
  };
}