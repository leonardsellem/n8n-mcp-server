/**
 * Natural Language Workflow Builder
 * 
 * Converts natural language descriptions into n8n workflow JSON
 * using pattern matching and AI-assisted node selection.
 */

import { NodeTypeInfo } from '../../data/node-types.js';
import { ALL_COMPLETE_NODES } from '../../data/final-complete-catalog.js';

export interface NLWorkflowRequest {
  description: string;
  context?: {
    preferredNodes?: string[];
    constraints?: string[];
    environment?: 'development' | 'production';
  };
}

export interface WorkflowBlueprint {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNodeBlueprint[];
  connections: WorkflowConnection[];
  estimated_complexity: 'simple' | 'moderate' | 'complex';
  confidence_score: number;
  suggestions: string[];
}

export interface WorkflowNodeBlueprint {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  position: [number, number];
  reasoning: string;
}

export interface WorkflowConnection {
  source: string;
  target: string;
  type: 'main' | 'error';
}

/**
 * Pattern-based workflow templates for common use cases
 */
const WORKFLOW_PATTERNS = [
  {
    pattern: /send.*notification|notify.*when|alert.*if/i,
    template: 'notification',
    nodes: ['trigger', 'condition?', 'notification'],
    description: 'Notification workflow pattern'
  },
  {
    pattern: /process.*data|transform.*data|etl/i,
    template: 'data_processing',
    nodes: ['trigger', 'source', 'transform', 'destination'],
    description: 'Data processing pipeline'
  },
  {
    pattern: /api.*integration|connect.*services|sync.*between/i,
    template: 'api_integration',
    nodes: ['trigger', 'source_api', 'transform', 'target_api'],
    description: 'API integration workflow'
  },
  {
    pattern: /github.*issue|create.*issue|bug.*report/i,
    template: 'issue_management',
    nodes: ['trigger', 'github_action', 'notification'],
    description: 'GitHub issue management'
  },
  {
    pattern: /generate.*content|ai.*content|openai/i,
    template: 'ai_content',
    nodes: ['trigger', 'prepare_prompt', 'openai', 'post_process'],
    description: 'AI content generation'
  },
  {
    pattern: /schedule.*task|daily.*report|recurring/i,
    template: 'scheduled_task',
    nodes: ['schedule_trigger', 'process', 'output'],
    description: 'Scheduled automation'
  }
];

/**
 * Node type mappings for natural language terms
 */
const NL_NODE_MAPPING = {
  // Triggers
  'manual': 'n8n-nodes-base.manualTrigger',
  'schedule': 'n8n-nodes-base.scheduleTrigger',
  'webhook': 'n8n-nodes-base.webhook',
  'when': 'n8n-nodes-base.scheduleTrigger',
  
  // Communication
  'slack': 'n8n-nodes-base.slack',
  'email': 'n8n-nodes-base.gmail',
  'notify': 'n8n-nodes-base.slack',
  'message': 'n8n-nodes-base.slack',
  
  // Development
  'github': 'n8n-nodes-base.github',
  'git': 'n8n-nodes-base.github',
  'issue': 'n8n-nodes-base.github',
  'pull_request': 'n8n-nodes-base.github',
  
  // AI
  'openai': 'n8n-nodes-langchain.openai',
  'ai': 'n8n-nodes-langchain.openai',
  'gpt': 'n8n-nodes-langchain.openai',
  'generate_text': 'n8n-nodes-langchain.openai',
  'generate_image': 'n8n-nodes-langchain.openai',
  
  // Data
  'api': 'n8n-nodes-base.httpRequest',
  'http': 'n8n-nodes-base.httpRequest',
  'fetch': 'n8n-nodes-base.httpRequest',
  'database': 'n8n-nodes-base.postgres',
  'sheets': 'n8n-nodes-base.googleSheets',
  
  // Processing
  'code': 'n8n-nodes-base.code',
  'transform': 'n8n-nodes-base.code',
  'process': 'n8n-nodes-base.code',
  'condition': 'n8n-nodes-base.if',
  'if': 'n8n-nodes-base.if',
  'filter': 'n8n-nodes-base.if',
  'set': 'n8n-nodes-base.set',
  'edit': 'n8n-nodes-base.set'
};

export class NaturalLanguageWorkflowBuilder {
  private nodes: NodeTypeInfo[];
  
  constructor() {
    this.nodes = ALL_COMPLETE_NODES;
  }

  /**
   * Convert natural language description to workflow blueprint
   */
  async buildWorkflow(request: NLWorkflowRequest): Promise<WorkflowBlueprint> {
    const { description, context } = request;
    
    // 1. Identify workflow pattern
    const pattern = this.identifyPattern(description);
    
    // 2. Extract entities and intents
    const entities = this.extractEntities(description);
    
    // 3. Map to nodes
    const nodeSelection = this.selectNodes(entities, pattern, context);
    
    // 4. Generate workflow structure
    const blueprint = this.generateBlueprint(nodeSelection, pattern, description);
    
    // 5. Add positioning and connections
    this.optimizeLayout(blueprint);
    
    return blueprint;
  }

  /**
   * Identify workflow pattern from description
   */
  private identifyPattern(description: string): typeof WORKFLOW_PATTERNS[0] | null {
    for (const pattern of WORKFLOW_PATTERNS) {
      if (pattern.pattern.test(description)) {
        return pattern;
      }
    }
    return null;
  }

  /**
   * Extract entities (services, actions, conditions) from description
   */
  private extractEntities(description: string): {
    services: string[];
    actions: string[];
    conditions: string[];
    triggers: string[];
  } {
    const words = description.toLowerCase().split(/\s+/);
    
    const services = words.filter(word => NL_NODE_MAPPING[word] && !['when', 'if', 'condition'].includes(word));
    const triggers = words.filter(word => ['when', 'schedule', 'webhook', 'manual'].includes(word));
    const actions = words.filter(word => ['send', 'create', 'update', 'delete', 'notify', 'process', 'transform'].includes(word));
    const conditions = words.filter(word => ['if', 'when', 'unless', 'condition', 'filter'].includes(word));
    
    return { services, actions, conditions, triggers };
  }

  /**
   * Select appropriate nodes based on entities and pattern
   */
  private selectNodes(
    entities: ReturnType<typeof this.extractEntities>,
    pattern: typeof WORKFLOW_PATTERNS[0] | null,
    context?: NLWorkflowRequest['context']
  ): NodeTypeInfo[] {
    const selectedNodes: NodeTypeInfo[] = [];
    
    // Add trigger node
    if (entities.triggers.includes('schedule')) {
      selectedNodes.push(this.findNode('n8n-nodes-base.scheduleTrigger')!);
    } else if (entities.triggers.includes('webhook')) {
      selectedNodes.push(this.findNode('n8n-nodes-base.webhook')!);
    } else {
      selectedNodes.push(this.findNode('n8n-nodes-base.manualTrigger')!);
    }

    // Add service nodes based on entities
    entities.services.forEach(service => {
      const nodeType = NL_NODE_MAPPING[service as keyof typeof NL_NODE_MAPPING];
      if (nodeType) {
        const node = this.findNode(nodeType);
        if (node && !selectedNodes.find(n => n.name === node.name)) {
          selectedNodes.push(node);
        }
      }
    });

    // Add condition nodes if needed
    if (entities.conditions.length > 0) {
      const ifNode = this.findNode('n8n-nodes-base.if');
      if (ifNode && !selectedNodes.find(n => n.name === ifNode.name)) {
        selectedNodes.push(ifNode);
      }
    }

    // Apply context preferences
    if (context?.preferredNodes) {
      context.preferredNodes.forEach(preferredType => {
        const node = this.findNode(preferredType);
        if (node && !selectedNodes.find(n => n.name === node.name)) {
          selectedNodes.push(node);
        }
      });
    }

    return selectedNodes;
  }

  /**
   * Generate workflow blueprint from selected nodes
   */
  private generateBlueprint(
    nodes: NodeTypeInfo[],
    pattern: typeof WORKFLOW_PATTERNS[0] | null,
    description: string
  ): WorkflowBlueprint {
    const id = `workflow_${Date.now()}`;
    const workflowNodes: WorkflowNodeBlueprint[] = [];
    const connections: WorkflowConnection[] = [];

    // Create node blueprints
    nodes.forEach((node, index) => {
      const nodeId = `node_${index}`;
      
      workflowNodes.push({
        id: nodeId,
        name: node.displayName,
        type: node.name,
        parameters: this.generateDefaultParameters(node, description),
        position: [100 + index * 200, 100],
        reasoning: this.generateNodeReasoning(node, description)
      });

      // Create connections (simple linear flow for now)
      if (index > 0) {
        connections.push({
          source: `node_${index - 1}`,
          target: nodeId,
          type: 'main'
        });
      }
    });

    return {
      id,
      name: this.generateWorkflowName(description),
      description,
      nodes: workflowNodes,
      connections,
      estimated_complexity: this.estimateComplexity(nodes),
      confidence_score: this.calculateConfidence(nodes, pattern),
      suggestions: this.generateSuggestions(nodes, description)
    };
  }

  /**
   * Generate default parameters for a node based on context
   */
  private generateDefaultParameters(node: NodeTypeInfo, description: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Apply node defaults
    if (node.defaults) {
      Object.assign(params, node.defaults);
    }

    // Set common parameters based on node type
    switch (node.name) {
      case 'n8n-nodes-base.slack':
        params.resource = 'message';
        params.operation = 'send';
        params.channel = '#general';
        params.text = 'Workflow notification';
        break;
        
      case 'n8n-nodes-base.github':
        params.resource = 'issue';
        params.operation = 'create';
        params.title = 'Automated issue';
        break;
        
      case 'n8n-nodes-langchain.openai':
        params.resource = 'text';
        params.operation = 'chat';
        params.model = 'gpt-4o-mini';
        break;
        
      case 'n8n-nodes-base.scheduleTrigger':
        params.rule = '0 9 * * 1-5'; // Weekdays at 9 AM
        break;
    }

    return params;
  }

  /**
   * Generate reasoning for why a node was selected
   */
  private generateNodeReasoning(node: NodeTypeInfo, description: string): string {
    const reasoning = [
      `Selected ${node.displayName} because:`
    ];

    if (node.triggerNode) {
      reasoning.push('- Workflow needs a trigger to start execution');
    }
    
    if (node.category === 'Communication') {
      reasoning.push('- Description mentions notification or messaging');
    }
    
    if (node.category === 'AI') {
      reasoning.push('- Description involves AI/content generation');
    }
    
    if (node.category === 'Development') {
      reasoning.push('- Description mentions development/code management');
    }

    return reasoning.join('\n');
  }

  /**
   * Optimize node layout and positioning
   */
  private optimizeLayout(blueprint: WorkflowBlueprint): void {
    const NODE_SPACING = 200;
    const START_X = 100;
    const START_Y = 100;

    blueprint.nodes.forEach((node, index) => {
      node.position = [START_X + index * NODE_SPACING, START_Y];
    });
  }

  /**
   * Find node by type name
   */
  private findNode(nodeName: string): NodeTypeInfo | undefined {
    return this.nodes.find(node => node.name === nodeName);
  }

  /**
   * Generate workflow name from description
   */
  private generateWorkflowName(description: string): string {
    // Extract key terms and create concise name
    const words = description.split(' ').slice(0, 4);
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  /**
   * Estimate workflow complexity
   */
  private estimateComplexity(nodes: NodeTypeInfo[]): 'simple' | 'moderate' | 'complex' {
    if (nodes.length <= 3) return 'simple';
    if (nodes.length <= 6) return 'moderate';
    return 'complex';
  }

  /**
   * Calculate confidence score for generated workflow
   */
  private calculateConfidence(nodes: NodeTypeInfo[], pattern: typeof WORKFLOW_PATTERNS[0] | null): number {
    let score = 0.5; // Base score
    
    if (pattern) score += 0.3; // Pattern match
    if (nodes.length > 0) score += 0.1; // Has nodes
    if (nodes.some(n => n.triggerNode)) score += 0.1; // Has trigger
    
    return Math.min(score, 1.0);
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(nodes: NodeTypeInfo[], description: string): string[] {
    const suggestions: string[] = [];
    
    if (!nodes.some(n => n.triggerNode)) {
      suggestions.push('Add a trigger node to start the workflow');
    }
    
    if (!nodes.some(n => n.name.includes('if'))) {
      suggestions.push('Consider adding conditional logic with IF node');
    }
    
    if (description.includes('error') && !nodes.some(n => n.name.includes('slack'))) {
      suggestions.push('Add error notification with Slack node');
    }
    
    suggestions.push('Test workflow with sample data before production use');
    suggestions.push('Add error handling and monitoring');
    
    return suggestions;
  }
}

export default NaturalLanguageWorkflowBuilder;