/**
 * Natural Language Workflow Creation System
 * 
 * This system converts natural language descriptions into fully functional n8n workflows
 * using advanced intent recognition, entity extraction, and workflow pattern matching.
 */

import { NodeTypeInfo } from '../data/node-types.js';
import { completeN8NCatalog } from '../data/final-complete-catalog.js';
import { ExpressionBuilder, AIExpressionHelper } from '../utils/expression-syntax.js';

export interface NLPWorkflowRequest {
  description: string;
  context?: {
    user_preferences?: {
      preferred_nodes?: string[];
      notification_channels?: string[];
      data_sources?: string[];
    };
    existing_workflows?: string[];
    available_credentials?: string[];
  };
  constraints?: {
    max_nodes?: number;
    complexity_level?: 'simple' | 'moderate' | 'complex';
    performance_requirements?: string[];
  };
}

export interface WorkflowIntent {
  primary_action: string;
  triggers: ExtractedTrigger[];
  actions: ExtractedAction[];
  conditions: ExtractedCondition[];
  data_transformations: ExtractedTransformation[];
  notifications: ExtractedNotification[];
  confidence: number;
  complexity_score: number;
  estimated_nodes: number;
}

export interface ExtractedTrigger {
  type: 'schedule' | 'webhook' | 'manual' | 'email' | 'file' | 'database';
  schedule?: string;
  condition?: string;
  source?: string;
  confidence: number;
}

export interface ExtractedAction {
  type: string;
  target: string;
  operation: string;
  parameters?: Record<string, any>;
  confidence: number;
}

export interface ExtractedCondition {
  field: string;
  operator: string;
  value: string;
  logic?: 'and' | 'or';
  confidence: number;
}

export interface ExtractedTransformation {
  type: 'filter' | 'map' | 'format' | 'calculate' | 'merge';
  source_field?: string;
  target_field?: string;
  operation?: string;
  expression?: string;
  confidence: number;
}

export interface ExtractedNotification {
  channel: 'slack' | 'email' | 'webhook' | 'sms';
  target: string;
  message_template?: string;
  conditions?: string[];
  confidence: number;
}

export interface GeneratedWorkflow {
  workflow: any;
  explanation: {
    overview: string;
    node_explanations: Array<{
      node_name: string;
      purpose: string;
      configuration_notes: string[];
    }>;
    setup_instructions: string[];
    testing_guide: string[];
  };
  confidence: number;
  alternative_approaches?: Array<{
    description: string;
    workflow: any;
    pros: string[];
    cons: string[];
  }>;
}

/**
 * Natural Language Processor for Workflow Creation
 */
export class NaturalLanguageWorkflowProcessor {
  private intentPatterns: Map<string, RegExp[]> = new Map();
  private nodeKeywords: Map<string, string[]> = new Map();
  private actionMappings: Map<string, NodeActionMapping> = new Map();

  constructor() {
    this.initializePatterns();
    this.initializeNodeKeywords();
    this.initializeActionMappings();
  }

  /**
   * Main entry point: Convert natural language to workflow
   */
  async createWorkflowFromDescription(request: NLPWorkflowRequest): Promise<GeneratedWorkflow> {
    console.log('[NLP] Processing workflow request:', request.description);

    // Step 1: Extract intent and entities
    const intent = await this.analyzeIntent(request.description);
    console.log('[NLP] Extracted intent:', intent);

    // Step 2: Map to workflow structure
    const workflowStructure = await this.mapToWorkflowStructure(intent, request.context);
    console.log('[NLP] Generated workflow structure');

    // Step 3: Generate actual workflow
    const workflow = await this.generateWorkflow(workflowStructure, intent);
    console.log('[NLP] Generated workflow with', workflow.nodes.length, 'nodes');

    // Step 4: Create explanation and documentation
    const explanation = this.generateExplanation(workflow, intent, request.description);

    // Step 5: Generate alternatives if requested
    const alternatives = await this.generateAlternatives(intent, workflowStructure);

    return {
      workflow,
      explanation,
      confidence: intent.confidence,
      alternative_approaches: alternatives
    };
  }

  /**
   * Analyze natural language to extract workflow intent
   */
  private async analyzeIntent(description: string): Promise<WorkflowIntent> {
    const desc = description.toLowerCase();

    // Extract triggers
    const triggers = this.extractTriggers(desc);
    
    // Extract actions
    const actions = this.extractActions(desc);
    
    // Extract conditions
    const conditions = this.extractConditions(desc);
    
    // Extract transformations
    const transformations = this.extractTransformations(desc);
    
    // Extract notifications
    const notifications = this.extractNotifications(desc);

    // Determine primary action
    const primary_action = this.determinePrimaryAction(actions, desc);

    // Calculate confidence and complexity
    const confidence = this.calculateConfidence(triggers, actions, conditions, transformations, notifications);
    const complexity_score = this.calculateComplexity(triggers, actions, conditions, transformations);
    const estimated_nodes = triggers.length + actions.length + conditions.length + transformations.length + notifications.length + 1; // +1 for potential helper nodes

    return {
      primary_action,
      triggers,
      actions,
      conditions,
      data_transformations: transformations,
      notifications,
      confidence,
      complexity_score,
      estimated_nodes
    };
  }

  /**
   * Extract trigger patterns from description
   */
  private extractTriggers(description: string): ExtractedTrigger[] {
    const triggers: ExtractedTrigger[] = [];

    // Schedule patterns
    const schedulePatterns = [
      { pattern: /every (\d+) (minute|hour|day|week|month)s?/, type: 'schedule' as const },
      { pattern: /daily at (\d+:\d+|\d+ (am|pm))/, type: 'schedule' as const },
      { pattern: /weekly on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/, type: 'schedule' as const },
      { pattern: /(cron|schedule|timer|interval)/, type: 'schedule' as const }
    ];

    // Webhook patterns
    const webhookPatterns = [
      { pattern: /when (i receive|someone sends|there's) a (webhook|http request|api call)/, type: 'webhook' as const },
      { pattern: /(webhook|http|api) (trigger|endpoint|call)/, type: 'webhook' as const },
      { pattern: /when (called|triggered) (via|through|by) (api|http)/, type: 'webhook' as const }
    ];

    // Email patterns
    const emailPatterns = [
      { pattern: /when (i receive|someone sends|there's) an? email/, type: 'email' as const },
      { pattern: /(email|gmail) (arrives|received|sent to)/, type: 'email' as const },
      { pattern: /new email in (inbox|folder)/, type: 'email' as const }
    ];

    // Manual patterns
    const manualPatterns = [
      { pattern: /(manually|on demand|when i click|test)/, type: 'manual' as const },
      { pattern: /(start|run) (manually|on demand)/, type: 'manual' as const }
    ];

    // Check all patterns
    const allPatterns = [...schedulePatterns, ...webhookPatterns, ...emailPatterns, ...manualPatterns];
    
    for (const { pattern, type } of allPatterns) {
      const match = description.match(pattern);
      if (match) {
        let schedule: string | undefined;
        
        if (type === 'schedule' && match[1] && match[2]) {
          // Convert to cron-like schedule
          schedule = this.convertToCronSchedule(match[1], match[2]);
        }
        
        triggers.push({
          type,
          schedule,
          condition: match[0],
          confidence: 0.8
        });
      }
    }

    // Default to manual trigger if none found
    if (triggers.length === 0) {
      triggers.push({
        type: 'manual',
        confidence: 0.5
      });
    }

    return triggers;
  }

  /**
   * Extract action patterns from description
   */
  private extractActions(description: string): ExtractedAction[] {
    const actions: ExtractedAction[] = [];

    const actionPatterns = [
      // Slack actions
      { pattern: /send (a )?(message|notification) to slack( channel)?( #?(\w+))?/, service: 'slack', operation: 'send_message' },
      { pattern: /notify (the )?team (on|via|through) slack/, service: 'slack', operation: 'send_message' },
      { pattern: /post to slack/, service: 'slack', operation: 'send_message' },
      
      // Email actions
      { pattern: /send (an? )?(email|gmail)( to ([^,\s]+))?/, service: 'email', operation: 'send' },
      { pattern: /email (me|someone|[\w@\.]+)/, service: 'email', operation: 'send' },
      
      // HTTP actions
      { pattern: /send (a )?(http|api) (request|call) to ([^\s,]+)/, service: 'http', operation: 'request' },
      { pattern: /(call|post to|get from) (api|endpoint|url)/, service: 'http', operation: 'request' },
      
      // Database actions
      { pattern: /save (to|in) (database|db|table)/, service: 'database', operation: 'insert' },
      { pattern: /(insert|update|delete) (in|from) (database|table)/, service: 'database', operation: 'query' },
      
      // File actions
      { pattern: /save (to|as) (file|csv|json|pdf)/, service: 'file', operation: 'write' },
      { pattern: /(read|load) from file/, service: 'file', operation: 'read' },
      
      // Google Sheets actions
      { pattern: /(add to|update|save in) (google )?sheet/, service: 'google_sheets', operation: 'append' },
      { pattern: /(spreadsheet|google sheets)/, service: 'google_sheets', operation: 'append' }
    ];

    for (const { pattern, service, operation } of actionPatterns) {
      const match = description.match(pattern);
      if (match) {
        let target = '';
        let parameters: Record<string, any> = {};

        // Extract target from match groups
        if (match[4]) target = match[4]; // For patterns with capture groups
        if (match[5]) target = match[5];

        // Set default targets
        if (!target) {
          switch (service) {
            case 'slack': target = 'general'; break;
            case 'email': target = 'team@company.com'; break;
            case 'database': target = 'main_table'; break;
            case 'file': target = 'output.json'; break;
            case 'google_sheets': target = 'Data Sheet'; break;
          }
        }

        actions.push({
          type: service,
          target,
          operation,
          parameters,
          confidence: 0.85
        });
      }
    }

    return actions;
  }

  /**
   * Extract condition patterns from description
   */
  private extractConditions(description: string): ExtractedCondition[] {
    const conditions: ExtractedCondition[] = [];

    const conditionPatterns = [
      { pattern: /if ([^,\s]+) (equals|is|=) ([^,\s]+)/, operator: 'equals' },
      { pattern: /if ([^,\s]+) (contains|includes) ([^,\s]+)/, operator: 'contains' },
      { pattern: /if ([^,\s]+) (greater than|>) ([^,\s]+)/, operator: 'greater' },
      { pattern: /if ([^,\s]+) (less than|<) ([^,\s]+)/, operator: 'lesser' },
      { pattern: /when ([^,\s]+) (is|equals) ([^,\s]+)/, operator: 'equals' },
      { pattern: /only if ([^,\s]+) (is|equals) ([^,\s]+)/, operator: 'equals' }
    ];

    for (const { pattern, operator } of conditionPatterns) {
      const match = description.match(pattern);
      if (match && match[1] && match[3]) {
        conditions.push({
          field: match[1],
          operator,
          value: match[3],
          confidence: 0.8
        });
      }
    }

    return conditions;
  }

  /**
   * Extract transformation patterns from description
   */
  private extractTransformations(description: string): ExtractedTransformation[] {
    const transformations: ExtractedTransformation[] = [];

    const transformationPatterns = [
      { pattern: /(format|transform|convert) (.*?) (to|as|into) (.*?)/, type: 'format' as const },
      { pattern: /(filter|only) (.*?) (where|that) (.*?)/, type: 'filter' as const },
      { pattern: /(map|extract|get) (.*?) from (.*?)/, type: 'map' as const },
      { pattern: /(calculate|compute|sum) (.*?)/, type: 'calculate' as const },
      { pattern: /(combine|merge|join) (.*?) with (.*?)/, type: 'merge' as const }
    ];

    for (const { pattern, type } of transformationPatterns) {
      const match = description.match(pattern);
      if (match) {
        transformations.push({
          type,
          source_field: match[2] || match[3],
          target_field: match[4],
          operation: match[1],
          confidence: 0.7
        });
      }
    }

    return transformations;
  }

  /**
   * Extract notification patterns from description
   */
  private extractNotifications(description: string): ExtractedNotification[] {
    const notifications: ExtractedNotification[] = [];

    const notificationPatterns = [
      { pattern: /(notify|alert|tell) (me|team|everyone)( via| through| on)? slack/, channel: 'slack' as const },
      { pattern: /(email|send email to) (me|team|[\w@\.]+)/, channel: 'email' as const },
      { pattern: /(text|sms) (me|someone)/, channel: 'sms' as const },
      { pattern: /send (to|via) webhook/, channel: 'webhook' as const }
    ];

    for (const { pattern, channel } of notificationPatterns) {
      const match = description.match(pattern);
      if (match) {
        let target = match[2] || 'team';
        
        // Clean up target
        if (target === 'me') target = 'user';
        if (target === 'everyone') target = 'team';

        notifications.push({
          channel,
          target,
          confidence: 0.8
        });
      }
    }

    return notifications;
  }

  /**
   * Map intent to workflow structure
   */
  private async mapToWorkflowStructure(intent: WorkflowIntent, context?: NLPWorkflowRequest['context']): Promise<WorkflowStructure> {
    const structure: WorkflowStructure = {
      nodes: [],
      connections: [],
      metadata: {
        primary_action: intent.primary_action,
        complexity: intent.complexity_score,
        estimated_execution_time: this.estimateExecutionTime(intent)
      }
    };

    let nodeId = 1;
    let previousNodeId: string | null = null;

    // Add trigger nodes
    for (const trigger of intent.triggers) {
      const triggerNode = await this.createTriggerNode(trigger, nodeId++);
      structure.nodes.push(triggerNode);
      
      if (previousNodeId) {
        structure.connections.push({
          source: previousNodeId,
          target: triggerNode.id,
          type: 'main'
        });
      }
      previousNodeId = triggerNode.id;
    }

    // Add condition nodes
    for (const condition of intent.conditions) {
      const conditionNode = await this.createConditionNode(condition, nodeId++);
      structure.nodes.push(conditionNode);
      
      if (previousNodeId) {
        structure.connections.push({
          source: previousNodeId,
          target: conditionNode.id,
          type: 'main'
        });
      }
      previousNodeId = conditionNode.id;
    }

    // Add transformation nodes
    for (const transformation of intent.data_transformations) {
      const transformNode = await this.createTransformationNode(transformation, nodeId++);
      structure.nodes.push(transformNode);
      
      if (previousNodeId) {
        structure.connections.push({
          source: previousNodeId,
          target: transformNode.id,
          type: 'main'
        });
      }
      previousNodeId = transformNode.id;
    }

    // Add action nodes
    for (const action of intent.actions) {
      const actionNode = await this.createActionNode(action, nodeId++);
      structure.nodes.push(actionNode);
      
      if (previousNodeId) {
        structure.connections.push({
          source: previousNodeId,
          target: actionNode.id,
          type: 'main'
        });
      }
      previousNodeId = actionNode.id;
    }

    // Add notification nodes
    for (const notification of intent.notifications) {
      const notificationNode = await this.createNotificationNode(notification, nodeId++);
      structure.nodes.push(notificationNode);
      
      if (previousNodeId) {
        structure.connections.push({
          source: previousNodeId,
          target: notificationNode.id,
          type: 'main'
        });
      }
      previousNodeId = notificationNode.id;
    }

    return structure;
  }

  /**
   * Create trigger node based on extracted trigger
   */
  private async createTriggerNode(trigger: ExtractedTrigger, nodeId: number): Promise<WorkflowNode> {
    const id = `trigger_${nodeId}`;
    
    switch (trigger.type) {
      case 'schedule':
        return {
          id,
          name: 'Schedule Trigger',
          type: 'n8n-nodes-base.scheduleTrigger',
          parameters: {
            rule: trigger.schedule || '0 9 * * 1-5', // Default: weekdays at 9 AM
            timezone: 'UTC'
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      case 'webhook':
        return {
          id,
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          parameters: {
            httpMethod: 'POST',
            path: 'automation-webhook',
            responseMode: 'responseNode'
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      case 'email':
        return {
          id,
          name: 'Gmail Trigger',
          type: 'n8n-nodes-base.gmail',
          parameters: {
            resource: 'message',
            operation: 'getAll',
            filters: {
              q: 'is:unread in:inbox'
            },
            options: {
              format: 'full'
            }
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      default:
        return {
          id,
          name: 'Manual Trigger',
          type: 'n8n-nodes-base.manualTrigger',
          parameters: {},
          position: [100 + (nodeId - 1) * 200, 200]
        };
    }
  }

  /**
   * Create condition node based on extracted condition
   */
  private async createConditionNode(condition: ExtractedCondition, nodeId: number): Promise<WorkflowNode> {
    const id = `condition_${nodeId}`;
    
    // Map condition operator to n8n IF node format
    const operatorMap: Record<string, string> = {
      'equals': 'equals',
      'contains': 'contains',
      'greater': 'greater',
      'lesser': 'lesser'
    };

    const operation = operatorMap[condition.operator] || 'equals';
    
    return {
      id,
      name: 'Condition Check',
      type: 'n8n-nodes-base.if',
      parameters: {
        conditions: {
          options: {
            version: 2,
            caseSensitive: true,
            typeValidation: 'strict'
          },
          combinator: condition.logic || 'and',
          conditions: [
            {
              id: `condition_${nodeId}`,
              operator: {
                type: 'string',
                operation
              },
              leftValue: ExpressionBuilder.field(condition.field),
              rightValue: condition.value
            }
          ]
        }
      },
      position: [100 + (nodeId - 1) * 200, 200]
    };
  }

  /**
   * Create transformation node based on extracted transformation
   */
  private async createTransformationNode(transformation: ExtractedTransformation, nodeId: number): Promise<WorkflowNode> {
    const id = `transform_${nodeId}`;
    
    switch (transformation.type) {
      case 'format':
      case 'map':
        return {
          id,
          name: 'Transform Data',
          type: 'n8n-nodes-base.set',
          parameters: {
            mode: 'manual',
            duplicateItem: true,
            assignments: {
              assignments: [
                {
                  id: `transform_${nodeId}`,
                  name: transformation.target_field || 'transformedValue',
                  type: 'string',
                  value: transformation.expression || ExpressionBuilder.field(transformation.source_field || 'input')
                }
              ]
            }
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      case 'calculate':
        return {
          id,
          name: 'Calculate Values',
          type: 'n8n-nodes-base.code',
          parameters: {
            jsCode: `// Calculate based on transformation
const items = $input.all();
return items.map(item => ({
  json: {
    ...item.json,
    calculated: ${transformation.operation || 'item.json.value * 2'}
  }
}));`
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      default:
        return {
          id,
          name: 'Process Data',
          type: 'n8n-nodes-base.set',
          parameters: {
            mode: 'manual',
            duplicateItem: true,
            assignments: {
              assignments: [
                {
                  id: `process_${nodeId}`,
                  name: 'processed',
                  type: 'boolean',
                  value: true
                }
              ]
            }
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };
    }
  }

  /**
   * Create action node based on extracted action
   */
  private async createActionNode(action: ExtractedAction, nodeId: number): Promise<WorkflowNode> {
    const id = `action_${nodeId}`;
    
    switch (action.type) {
      case 'slack':
        return {
          id,
          name: 'Send Slack Message',
          type: 'n8n-nodes-base.slack',
          parameters: {
            resource: 'message',
            operation: 'post',
            authentication: 'accessToken',
            select: 'channel',
            channelId: {
              __rl: true,
              mode: 'name',
              value: action.target || 'general'
            },
            text: '🤖 Automated message: {{$json.message || "Workflow completed successfully"}}',
            otherOptions: {
              username: 'n8n-bot',
              icon_emoji: ':robot_face:'
            }
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      case 'email':
        return {
          id,
          name: 'Send Email',
          type: 'n8n-nodes-base.gmail',
          parameters: {
            resource: 'message',
            operation: 'send',
            emailType: 'html',
            toList: action.target || 'team@company.com',
            subject: 'Automated Notification: {{$json.subject || "Workflow Update"}}',
            message: '{{$json.message || "Your workflow has completed successfully."}}'
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      case 'http':
        return {
          id,
          name: 'HTTP Request',
          type: 'n8n-nodes-base.httpRequest',
          parameters: {
            method: action.operation === 'request' ? 'POST' : 'GET',
            url: action.target || 'https://api.example.com/webhook',
            sendBody: true,
            bodyContentType: 'json',
            jsonBody: '={{$json}}'
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      default:
        return {
          id,
          name: 'Custom Action',
          type: 'n8n-nodes-base.code',
          parameters: {
            jsCode: `// Custom action implementation
console.log('Executing action:', '${action.type}');
return $input.all();`
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };
    }
  }

  /**
   * Create notification node based on extracted notification
   */
  private async createNotificationNode(notification: ExtractedNotification, nodeId: number): Promise<WorkflowNode> {
    const id = `notification_${nodeId}`;
    
    switch (notification.channel) {
      case 'slack':
        return {
          id,
          name: 'Notify Team',
          type: 'n8n-nodes-base.slack',
          parameters: {
            resource: 'message',
            operation: 'post',
            authentication: 'accessToken',
            select: 'channel',
            channelId: {
              __rl: true,
              mode: 'name',
              value: notification.target || 'general'
            },
            text: notification.message_template || '✅ Workflow completed successfully!\n\nTime: {{$now}}\nStatus: {{$json.status || "Complete"}}',
            otherOptions: {
              username: 'Workflow Bot',
              icon_emoji: ':white_check_mark:'
            }
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      case 'email':
        return {
          id,
          name: 'Email Notification',
          type: 'n8n-nodes-base.gmail',
          parameters: {
            resource: 'message',
            operation: 'send',
            emailType: 'html',
            toList: notification.target || 'team@company.com',
            subject: 'Workflow Notification - {{$now}}',
            message: notification.message_template || '<h2>Workflow Complete</h2><p>Your automated workflow has finished processing.</p><p><strong>Status:</strong> {{$json.status || "Success"}}</p>'
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };

      default:
        return {
          id,
          name: 'Send Notification',
          type: 'n8n-nodes-base.httpRequest',
          parameters: {
            method: 'POST',
            url: 'https://hooks.zapier.com/hooks/catch/notification',
            sendBody: true,
            bodyContentType: 'json',
            jsonBody: `{
  "message": "${notification.message_template || 'Workflow notification'}",
  "target": "${notification.target}",
  "timestamp": "{{$now}}"
}`
          },
          position: [100 + (nodeId - 1) * 200, 200]
        };
    }
  }

  // Helper methods for pattern initialization and workflow generation
  private initializePatterns(): void {
    this.intentPatterns = new Map();
    // Initialize with common workflow patterns
  }

  private initializeNodeKeywords(): void {
    this.nodeKeywords = new Map();
    // Initialize with node-specific keywords
  }

  private initializeActionMappings(): void {
    this.actionMappings = new Map();
    // Initialize with action mappings
  }

  private determinePrimaryAction(actions: ExtractedAction[], description: string): string {
    if (actions.length > 0) {
      return actions[0].type;
    }
    
    // Fallback analysis
    if (description.includes('notify') || description.includes('send')) {
      return 'notification';
    }
    
    return 'process_data';
  }

  private calculateConfidence(triggers: ExtractedTrigger[], actions: ExtractedAction[], conditions: ExtractedCondition[], transformations: ExtractedTransformation[], notifications: ExtractedNotification[]): number {
    const weights = {
      trigger: 0.3,
      action: 0.4,
      condition: 0.1,
      transformation: 0.1,
      notification: 0.1
    };

    let confidence = 0;
    
    if (triggers.length > 0) confidence += weights.trigger * Math.max(...triggers.map(t => t.confidence));
    if (actions.length > 0) confidence += weights.action * Math.max(...actions.map(a => a.confidence));
    if (conditions.length > 0) confidence += weights.condition * Math.max(...conditions.map(c => c.confidence));
    if (transformations.length > 0) confidence += weights.transformation * Math.max(...transformations.map(t => t.confidence));
    if (notifications.length > 0) confidence += weights.notification * Math.max(...notifications.map(n => n.confidence));

    return Math.min(confidence, 1.0);
  }

  private calculateComplexity(triggers: ExtractedTrigger[], actions: ExtractedAction[], conditions: ExtractedCondition[], transformations: ExtractedTransformation[]): number {
    let complexity = 0;
    
    complexity += triggers.length * 1;
    complexity += actions.length * 2;
    complexity += conditions.length * 1.5;
    complexity += transformations.length * 2.5;

    return Math.min(complexity / 10, 1.0); // Normalize to 0-1 scale
  }

  private estimateExecutionTime(intent: WorkflowIntent): string {
    const baseTime = 2; // seconds
    const nodeTime = intent.estimated_nodes * 0.5;
    const complexityTime = intent.complexity_score * 3;
    
    const totalSeconds = baseTime + nodeTime + complexityTime;
    
    if (totalSeconds < 60) {
      return `${Math.round(totalSeconds)} seconds`;
    } else {
      return `${Math.round(totalSeconds / 60)} minutes`;
    }
  }

  private convertToCronSchedule(interval: string, unit: string): string {
    const num = parseInt(interval);
    
    switch (unit) {
      case 'minute':
      case 'minutes':
        return `*/${num} * * * *`;
      case 'hour':
      case 'hours':
        return `0 */${num} * * *`;
      case 'day':
      case 'days':
        return `0 9 */${num} * *`;
      case 'week':
      case 'weeks':
        return `0 9 * * 1`;
      case 'month':
      case 'months':
        return `0 9 1 */${num} *`;
      default:
        return '0 9 * * 1-5'; // Default: weekdays at 9 AM
    }
  }

  private async generateWorkflow(structure: WorkflowStructure, intent: WorkflowIntent): Promise<any> {
    const workflow = {
      meta: {
        instanceId: 'nlp-generated-workflow'
      },
      nodes: structure.nodes,
      connections: this.buildConnections(structure.connections),
      settings: {
        executionOrder: 'v1'
      }
    };

    return workflow;
  }

  private buildConnections(connections: WorkflowConnection[]): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const connection of connections) {
      if (!result[connection.source]) {
        result[connection.source] = { main: [[]] };
      }
      
      result[connection.source].main[0].push({
        node: connection.target,
        type: connection.type,
        index: 0
      });
    }
    
    return result;
  }

  private generateExplanation(workflow: any, intent: WorkflowIntent, originalDescription: string): GeneratedWorkflow['explanation'] {
    const nodeExplanations = workflow.nodes.map((node: any) => ({
      node_name: node.name,
      purpose: this.getNodePurpose(node),
      configuration_notes: this.getConfigurationNotes(node)
    }));

    return {
      overview: `This workflow was generated from: "${originalDescription}". It implements ${intent.primary_action} with ${workflow.nodes.length} nodes and an estimated execution time of ${this.estimateExecutionTime(intent)}.`,
      node_explanations: nodeExplanations,
      setup_instructions: this.generateSetupInstructions(workflow),
      testing_guide: this.generateTestingGuide(workflow, intent)
    };
  }

  private getNodePurpose(node: any): string {
    const purposeMap: Record<string, string> = {
      'n8n-nodes-base.manualTrigger': 'Starts the workflow manually for testing',
      'n8n-nodes-base.scheduleTrigger': 'Triggers the workflow on a schedule',
      'n8n-nodes-base.webhook': 'Receives HTTP requests to trigger the workflow',
      'n8n-nodes-base.if': 'Evaluates conditions to route data flow',
      'n8n-nodes-base.set': 'Transforms and formats data',
      'n8n-nodes-base.slack': 'Sends messages to Slack channels',
      'n8n-nodes-base.gmail': 'Handles email operations',
      'n8n-nodes-base.httpRequest': 'Makes HTTP API calls',
      'n8n-nodes-base.code': 'Executes custom JavaScript logic'
    };

    return purposeMap[node.type] || 'Processes data';
  }

  private getConfigurationNotes(node: any): string[] {
    const notes: string[] = [];
    
    switch (node.type) {
      case 'n8n-nodes-base.slack':
        notes.push('Configure Slack API credentials');
        notes.push('Ensure bot has access to target channels');
        break;
      case 'n8n-nodes-base.gmail':
        notes.push('Set up Gmail OAuth2 credentials');
        notes.push('Grant necessary email permissions');
        break;
      case 'n8n-nodes-base.scheduleTrigger':
        notes.push('Adjust schedule timing as needed');
        notes.push('Consider timezone settings');
        break;
      case 'n8n-nodes-base.webhook':
        notes.push('Note the webhook URL for external systems');
        notes.push('Consider authentication for security');
        break;
    }
    
    return notes;
  }

  private generateSetupInstructions(workflow: any): string[] {
    const instructions = [
      '1. Import this workflow into your n8n instance',
      '2. Configure credentials for connected services'
    ];

    const nodeTypes = new Set(workflow.nodes.map((n: any) => n.type));
    
    if (nodeTypes.has('n8n-nodes-base.slack')) {
      instructions.push('3. Set up Slack API token with bot permissions');
    }
    
    if (nodeTypes.has('n8n-nodes-base.gmail')) {
      instructions.push('4. Configure Gmail OAuth2 credentials');
    }
    
    if (nodeTypes.has('n8n-nodes-base.webhook')) {
      instructions.push('5. Note the webhook URL and configure external systems');
    }

    instructions.push('6. Test the workflow with sample data');
    instructions.push('7. Activate the workflow when ready');

    return instructions;
  }

  private generateTestingGuide(workflow: any, intent: WorkflowIntent): string[] {
    const guide = [
      'Testing Guidelines:',
      '1. Start with manual trigger to test basic flow'
    ];

    if (intent.conditions.length > 0) {
      guide.push('2. Test conditional logic with various input values');
    }

    if (intent.notifications.length > 0) {
      guide.push('3. Verify notifications are sent to correct channels');
    }

    guide.push('4. Check data transformation accuracy');
    guide.push('5. Monitor execution logs for errors');
    guide.push('6. Test edge cases and error conditions');

    return guide;
  }

  private async generateAlternatives(intent: WorkflowIntent, structure: WorkflowStructure): Promise<GeneratedWorkflow['alternative_approaches']> {
    // This could be expanded to generate actual alternative workflows
    return [
      {
        description: 'Simplified version with fewer nodes',
        workflow: {}, // Would contain actual alternative workflow
        pros: ['Faster execution', 'Easier to maintain', 'Lower resource usage'],
        cons: ['Less functionality', 'Limited error handling']
      },
      {
        description: 'Enhanced version with error handling',
        workflow: {}, // Would contain actual alternative workflow
        pros: ['Better reliability', 'Comprehensive error handling', 'Detailed logging'],
        cons: ['More complex', 'Slower execution', 'Higher resource usage']
      }
    ];
  }
}

// Supporting interfaces
interface WorkflowStructure {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  metadata: {
    primary_action: string;
    complexity: number;
    estimated_execution_time: string;
  };
}

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  position: [number, number];
}

interface WorkflowConnection {
  source: string;
  target: string;
  type: 'main' | 'error';
}

interface NodeActionMapping {
  nodeType: string;
  defaultParameters: Record<string, any>;
  requiredCredentials: string[];
}

export default NaturalLanguageWorkflowProcessor;