/**
 * Base AI Workflow Tool Handler
 * 
 * This module provides a base handler for AI-powered workflow tools that leverages
 * the Phase 1 Enhanced Discovery system for universal workflow creation.
 */

import { ToolCallResult } from '../../types/index.js';
import { BaseWorkflowToolHandler } from '../workflow/base-handler.js';
import { universalNodeCatalog } from '../../discovery/index.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';

/**
 * Intent analysis result for workflow description parsing
 */
export interface WorkflowIntent {
  triggers: string[];
  actions: string[];
  data_transformations: string[];
  integrations: string[];
  complexity: 'simple' | 'medium' | 'complex';
  confidence: number;
  suggested_nodes: string[];
  workflow_patterns: string[];
}

/**
 * Universal workflow optimization result
 */
export interface UniversalOptimization {
  performance_improvements: Array<{
    type: string;
    description: string;
    estimated_gain: number;
  }>;
  reliability_enhancements: Array<{
    type: string;
    description: string;
    risk_reduction: number;
  }>;
  cost_optimizations: Array<{
    type: string;
    description: string;
    cost_reduction: number;
  }>;
  recommended_alternatives: Array<{
    original_node: string;
    alternative_node: string;
    benefit: string;
  }>;
}

/**
 * Base class for AI workflow tool handlers
 */
export abstract class BaseAIWorkflowHandler extends BaseWorkflowToolHandler {
  
  /**
   * Analyze workflow intent from natural language description
   * Uses Phase 1 Enhanced Discovery for intelligent intent recognition
   */
  protected async analyzeWorkflowIntent(description: string): Promise<WorkflowIntent> {
    try {
      console.error(`[BaseAIWorkflowHandler] Analyzing workflow intent: "${description}"`);
      
      // Use Phase 1 Universal Node Catalog for intent-based discovery
      const intentBasedNodes = await universalNodeCatalog.discoverByIntent(description);
      console.error(`[BaseAIWorkflowHandler] Intent discovery found ${intentBasedNodes.length} relevant nodes`);
      
      const descLower = description.toLowerCase();
      
      // Detect triggers using enhanced patterns
      const triggers = this.detectTriggers(descLower);
      
      // Detect actions using enhanced patterns
      const actions = this.detectActions(descLower);
      
      // Detect data transformations
      const dataTransformations = this.detectDataTransformations(descLower);
      
      // Detect integrations
      const integrations = this.detectIntegrations(descLower);
      
      // Determine complexity
      const complexity = this.determineComplexity(triggers, actions, dataTransformations, integrations);
      
      // Calculate confidence based on pattern matches
      const confidence = this.calculateIntentConfidence(
        triggers, actions, dataTransformations, integrations, intentBasedNodes
      );
      
      // Get suggested nodes from intent discovery
      const suggestedNodes = intentBasedNodes.slice(0, 10).map((node: any) => node.name);
      
      // Detect workflow patterns
      const workflowPatterns = this.detectWorkflowPatterns(descLower);
      
      return {
        triggers,
        actions,
        data_transformations: dataTransformations,
        integrations,
        complexity,
        confidence,
        suggested_nodes: suggestedNodes,
        workflow_patterns: workflowPatterns
      };
    } catch (error) {
      console.error(`[BaseAIWorkflowHandler] Intent analysis failed:`, error);
      // Return fallback intent
      return {
        triggers: ['webhook'],
        actions: ['function'],
        data_transformations: [],
        integrations: [],
        complexity: 'simple',
        confidence: 0.3,
        suggested_nodes: [],
        workflow_patterns: ['basic']
      };
    }
  }
  
  /**
   * Discover matching nodes using Phase 1 Enhanced Discovery
   */
  protected async discoverMatchingNodes(
    intent: WorkflowIntent,
    maxNodes: number = 20
  ): Promise<any[]> {
    try {
      console.error(`[BaseAIWorkflowHandler] Discovering nodes for intent with ${intent.suggested_nodes.length} suggestions`);
      
      // Get optimal nodes using Dynamic Discovery
      const optimalSuggestions = await dynamicNodeDiscovery.suggestOptimalNodes({
        description: intent.triggers.join(' ') + ' ' + intent.actions.join(' '),
        inputTypes: [],
        outputTypes: [],
        requirements: [
          {
            type: 'functional',
            description: `Support for ${intent.triggers.join(', ')} triggers and ${intent.actions.join(', ')} actions`,
            priority: 'must',
            measurable: false,
            criteria: 'matches workflow intent'
          }
        ],
        constraints: [],
        preferences: []
      });
      
      console.error(`[BaseAIWorkflowHandler] Dynamic discovery found ${optimalSuggestions.length} optimal suggestions`);
      
      // Combine with Universal Node Catalog suggestions
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      const matchingNodes = allNodes.filter((node: any) => 
        intent.suggested_nodes.includes(node.name) ||
        this.nodeMatchesIntent(node, intent)
      );
      
      // Merge with optimal suggestions
      const mergedNodes = [
        ...optimalSuggestions.slice(0, maxNodes / 2).map(opt => opt.node),
        ...matchingNodes.slice(0, maxNodes / 2)
      ];
      
      // Remove duplicates and limit results
      const uniqueNodes = Array.from(
        new Map(mergedNodes.map(node => [node.name, node])).values()
      ).slice(0, maxNodes);
      
      console.error(`[BaseAIWorkflowHandler] Returning ${uniqueNodes.length} unique matching nodes`);
      return uniqueNodes;
    } catch (error) {
      console.error(`[BaseAIWorkflowHandler] Node discovery failed:`, error);
      return [];
    }
  }
  
  /**
   * Generate universal workflow structure
   */
  protected async generateWorkflowStructure(
    intent: WorkflowIntent,
    matchingNodes: any[],
    name?: string
  ): Promise<any> {
    try {
      console.error(`[BaseAIWorkflowHandler] Generating workflow structure with ${matchingNodes.length} nodes`);
      
      // Use Dynamic Discovery for node sequence recommendation
      const workflowGoal = {
        objective: `${intent.triggers.join(' ')} workflow with ${intent.actions.join(' ')} actions`,
        success_criteria: [
          'Workflow executes successfully',
          'Handles all specified triggers',
          'Performs all required actions'
        ],
        input_specification: {
          type: 'any',
          format: 'json',
          example: {},
          validation: []
        },
        output_specification: {
          type: 'any',
          format: 'json',
          schema: {},
          requirements: ['Valid structured output']
        },
        constraints: [],
        context: {
          domain: 'automation',
          use_case: `${intent.triggers.join(', ')} to ${intent.actions.join(', ')}`,
          user_skill_level: 'intermediate' as const,
          environment: 'production' as const,
          existing_systems: intent.integrations
        }
      };
      
      const nodeSequence = await dynamicNodeDiscovery.recommendNodeSequence(workflowGoal);
      console.error(`[BaseAIWorkflowHandler] Generated node sequence with ${nodeSequence.sequence.length} steps`);
      
      // Generate workflow structure
      const nodes = [];
      const connections: any = {};
      let nodeIndex = 0;
      let previousNodeId = '';
      
      // Add trigger nodes
      for (const trigger of intent.triggers) {
        const triggerNode = this.createUniversalTriggerNode(trigger, nodeIndex, matchingNodes);
        if (triggerNode) {
          nodes.push(triggerNode);
          if (nodeIndex === 0) {
            previousNodeId = triggerNode.id;
          }
          nodeIndex++;
        }
      }
      
      // Add action nodes based on sequence
      for (const step of nodeSequence.sequence.slice(0, 8)) { // Limit to 8 steps
        const actionNode = this.createUniversalActionNode(step, nodeIndex, matchingNodes);
        if (actionNode) {
          nodes.push(actionNode);
          
          // Connect to previous node
          if (previousNodeId) {
            if (!connections[previousNodeId]) {
              connections[previousNodeId] = { main: [[]] };
            }
            connections[previousNodeId].main[0].push({
              node: actionNode.id,
              type: 'main',
              index: 0
            });
          }
          
          previousNodeId = actionNode.id;
          nodeIndex++;
        }
      }
      
      // Add fallback processing node if no actions detected
      if (intent.actions.length === 0) {
        const fallbackNode = this.createFallbackProcessingNode(nodeIndex);
        nodes.push(fallbackNode);
        
        if (previousNodeId) {
          if (!connections[previousNodeId]) {
            connections[previousNodeId] = { main: [[]] };
          }
          connections[previousNodeId].main[0].push({
            node: fallbackNode.id,
            type: 'main',
            index: 0
          });
        }
      }
      
      return {
        name: name || `Universal AI Workflow - ${new Date().toISOString().split('T')[0]}`,
        nodes,
        connections,
        settings: {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600,
          timezone: "UTC",
          // Add AI workflow metadata
          aiGenerated: true,
          universalOptimized: true,
          complexity: intent.complexity,
          confidence: intent.confidence
        },
        staticData: {},
        // Add workflow metadata
        meta: {
          generatedBy: 'Universal AI Workflow Creator',
          intent,
          nodeSequence: nodeSequence.reasoning,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error(`[BaseAIWorkflowHandler] Workflow structure generation failed:`, error);
      throw new Error(`Failed to generate workflow structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Optimize workflow for universal use
   */
  protected async optimizeForUniversalUse(workflow: any): Promise<UniversalOptimization> {
    try {
      console.error(`[BaseAIWorkflowHandler] Optimizing workflow for universal use`);
      
      // Use Dual Architecture for optimization analysis
      const nodeTypes = workflow.nodes.map((node: any) => ({
        name: node.type,
        displayName: node.name,
        description: `Generated node for ${node.type}`,
        category: 'AI-Generated',
        properties: [],
        inputs: [{ type: 'main', displayName: 'Input', required: false }],
        outputs: [{ type: 'main', displayName: 'Output' }]
      }));
      
      const optimizations = await dualNodeArchitecture.getNodeChainOptimizations(nodeTypes);
      console.error(`[BaseAIWorkflowHandler] Found ${optimizations.length} optimization opportunities`);
      
      const universalOptimization: UniversalOptimization = {
        performance_improvements: [],
        reliability_enhancements: [],
        cost_optimizations: [],
        recommended_alternatives: []
      };
      
      // Process optimizations
      for (const opt of optimizations.slice(0, 3)) { // Limit to top 3
        // Performance improvements
        universalOptimization.performance_improvements.push({
          type: 'execution_speed',
          description: `Optimize ${opt.optimizedChain.length} nodes for better performance`,
          estimated_gain: opt.performanceGain || 25
        });
        
        // Reliability enhancements
        universalOptimization.reliability_enhancements.push({
          type: 'error_handling',
          description: 'Add universal error handling and retry logic',
          risk_reduction: 40
        });
        
        // Cost optimizations
        universalOptimization.cost_optimizations.push({
          type: 'resource_efficiency',
          description: 'Optimize resource usage and execution time',
          cost_reduction: 15
        });
        
        // Alternative recommendations
        for (const improvement of opt.improvements.slice(0, 2)) {
          if (improvement.nodeChanges && improvement.nodeChanges.length > 0) {
            const nodeChange = improvement.nodeChanges[0];
            universalOptimization.recommended_alternatives.push({
              original_node: (nodeChange as any).originalNode || (nodeChange as any).nodeName || 'unknown',
              alternative_node: (nodeChange as any).optimizedNode || (nodeChange as any).newNodeName || 'optimized',
              benefit: improvement.description
            });
          }
        }
      }
      
      // Add universal optimizations
      universalOptimization.performance_improvements.push({
        type: 'universal_compatibility',
        description: 'Ensure compatibility across all AI agent platforms',
        estimated_gain: 20
      });
      
      universalOptimization.reliability_enhancements.push({
        type: 'universal_validation',
        description: 'Add universal input/output validation',
        risk_reduction: 30
      });
      
      return universalOptimization;
    } catch (error) {
      console.error(`[BaseAIWorkflowHandler] Universal optimization failed:`, error);
      // Return minimal optimization
      return {
        performance_improvements: [{
          type: 'basic_optimization',
          description: 'Basic workflow structure optimization',
          estimated_gain: 10
        }],
        reliability_enhancements: [{
          type: 'basic_validation',
          description: 'Basic input validation',
          risk_reduction: 15
        }],
        cost_optimizations: [],
        recommended_alternatives: []
      };
    }
  }
  
  // Private helper methods
  
  private detectTriggers(description: string): string[] {
    const triggers = [];
    
    if (description.includes('webhook') || description.includes('http') || description.includes('api')) {
      triggers.push('webhook');
    }
    if (description.includes('schedule') || description.includes('cron') || description.includes('daily') || description.includes('hourly')) {
      triggers.push('schedule');
    }
    if (description.includes('email') && (description.includes('receive') || description.includes('incoming'))) {
      triggers.push('email_trigger');
    }
    if (description.includes('file') && (description.includes('watch') || description.includes('monitor'))) {
      triggers.push('file_trigger');
    }
    if (description.includes('manual') || description.includes('button') || description.includes('click')) {
      triggers.push('manual');
    }
    
    return triggers.length > 0 ? triggers : ['webhook']; // Default to webhook
  }
  
  private detectActions(description: string): string[] {
    const actions = [];
    
    if (description.includes('email') && (description.includes('send') || description.includes('notify'))) {
      actions.push('send_email');
    }
    if (description.includes('slack') || description.includes('discord') || description.includes('teams')) {
      actions.push('chat_message');
    }
    if (description.includes('database') || description.includes('sql') || description.includes('store')) {
      actions.push('database_operation');
    }
    if (description.includes('http') && (description.includes('post') || description.includes('send'))) {
      actions.push('http_request');
    }
    if (description.includes('transform') || description.includes('process') || description.includes('format')) {
      actions.push('data_processing');
    }
    if (description.includes('save') || description.includes('write') || description.includes('file')) {
      actions.push('file_operation');
    }
    
    return actions;
  }
  
  private detectDataTransformations(description: string): string[] {
    const transformations = [];
    
    if (description.includes('format') || description.includes('convert')) {
      transformations.push('format_conversion');
    }
    if (description.includes('filter') || description.includes('extract')) {
      transformations.push('data_filtering');
    }
    if (description.includes('merge') || description.includes('combine')) {
      transformations.push('data_merging');
    }
    if (description.includes('validate') || description.includes('check')) {
      transformations.push('data_validation');
    }
    
    return transformations;
  }
  
  private detectIntegrations(description: string): string[] {
    const integrations = [];
    
    if (description.includes('slack')) integrations.push('slack');
    if (description.includes('google')) integrations.push('google');
    if (description.includes('microsoft') || description.includes('outlook')) integrations.push('microsoft');
    if (description.includes('salesforce')) integrations.push('salesforce');
    if (description.includes('hubspot')) integrations.push('hubspot');
    if (description.includes('github')) integrations.push('github');
    if (description.includes('jira')) integrations.push('jira');
    
    return integrations;
  }
  
  private determineComplexity(
    triggers: string[],
    actions: string[],
    transformations: string[],
    integrations: string[]
  ): 'simple' | 'medium' | 'complex' {
    const totalElements = triggers.length + actions.length + transformations.length + integrations.length;
    
    if (totalElements <= 2) return 'simple';
    if (totalElements <= 5) return 'medium';
    return 'complex';
  }
  
  private calculateIntentConfidence(
    triggers: string[],
    actions: string[],
    transformations: string[],
    integrations: string[],
    discoveredNodes: any[]
  ): number {
    let confidence = 0.4; // Base confidence
    
    // Boost based on detected patterns
    if (triggers.length > 0) confidence += 0.2;
    if (actions.length > 0) confidence += 0.2;
    if (transformations.length > 0) confidence += 0.1;
    if (integrations.length > 0) confidence += 0.1;
    
    // Boost based on discovered nodes
    if (discoveredNodes.length > 0) confidence += Math.min(0.2, discoveredNodes.length * 0.02);
    
    return Math.min(1.0, confidence);
  }
  
  private detectWorkflowPatterns(description: string): string[] {
    const patterns = [];
    
    if (description.includes('webhook') && description.includes('response')) {
      patterns.push('webhook_response');
    }
    if (description.includes('email') && description.includes('notification')) {
      patterns.push('email_notification');
    }
    if (description.includes('process') && description.includes('data')) {
      patterns.push('data_processing');
    }
    if (description.includes('sync') || description.includes('synchronize')) {
      patterns.push('data_synchronization');
    }
    
    return patterns.length > 0 ? patterns : ['basic'];
  }
  
  private nodeMatchesIntent(node: any, intent: WorkflowIntent): boolean {
    const nodeType = node.name.toLowerCase();
    const allIntents = [
      ...intent.triggers,
      ...intent.actions,
      ...intent.data_transformations,
      ...intent.integrations
    ].join(' ').toLowerCase();
    
    // Simple keyword matching
    return intent.workflow_patterns.some(pattern => 
      nodeType.includes(pattern) || allIntents.includes(nodeType.split('.').pop() || '')
    );
  }
  
  private createUniversalTriggerNode(trigger: string, index: number, availableNodes: any[]): any {
    const nodeId = this.generateUniversalId();
    const position = [240 + (index * 250), 300];
    
    switch (trigger) {
      case 'webhook':
        return {
          id: nodeId,
          type: 'n8n-nodes-base.webhook',
          name: `Webhook${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            path: `universal-webhook-${Date.now()}`,
            httpMethod: 'POST',
            responseMode: 'responseNode',
            options: {}
          },
          position,
          webhookId: this.generateUniversalId()
        };
        
      case 'schedule':
        return {
          id: nodeId,
          type: 'n8n-nodes-base.scheduleTrigger',
          name: `Schedule${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            rule: {
              interval: [{
                field: 'hours',
                hoursInterval: 1
              }]
            }
          },
          position
        };
        
      case 'manual':
        return {
          id: nodeId,
          type: 'n8n-nodes-base.manualTrigger',
          name: `Manual Trigger${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {},
          position
        };
        
      default:
        return {
          id: nodeId,
          type: 'n8n-nodes-base.webhook',
          name: `Universal Trigger${index > 0 ? ` ${index + 1}` : ''}`,
          parameters: {
            path: `universal-trigger-${Date.now()}`,
            httpMethod: 'POST',
            responseMode: 'responseNode'
          },
          position,
          webhookId: this.generateUniversalId()
        };
    }
  }
  
  private createUniversalActionNode(step: any, index: number, availableNodes: any[]): any {
    const nodeId = this.generateUniversalId();
    const position = [
      Math.min(240 + ((index % 4) * 300), 1500), // Max 4 nodes per row
      300 + (Math.floor(index / 4) * 200)        // New row every 4 nodes
    ];
    
    // Use the step information from dynamic discovery
    const stepType = step.node?.name || step.purpose || 'function';
    
    if (stepType.includes('http') || stepType.includes('request')) {
      return {
        id: nodeId,
        type: 'n8n-nodes-base.httpRequest',
        name: step.node?.displayName || `HTTP Request ${index + 1}`,
        parameters: {
          url: 'https://api.example.com/endpoint',
          method: 'POST',
          sendBody: true,
          bodyContentType: 'json',
          jsonBody: '={{ $json }}',
          options: {}
        },
        position
      };
    }
    
    if (stepType.includes('email') || stepType.includes('send')) {
      return {
        id: nodeId,
        type: 'n8n-nodes-base.send-email',
        name: step.node?.displayName || `Send Email ${index + 1}`,
        parameters: {
          subject: 'Universal Workflow Notification',
          text: '={{ JSON.stringify($json, null, 2) }}',
          toEmail: 'recipient@example.com',
          options: {}
        },
        position
      };
    }
    
    // Default to function node with purpose-specific code
    return {
      id: nodeId,
      type: 'n8n-nodes-base.function',
      name: step.node?.displayName || `Process ${index + 1}`,
      parameters: {
        functionCode: `
          // Universal processing function - ${step.purpose || 'Data processing'}
          const processedData = {
            timestamp: new Date().toISOString(),
            step: '${step.purpose || 'processing'}',
            originalData: $input.all(),
            processed: true,
            nodeIndex: ${index}
          };
          
          return [processedData];
        `
      },
      position
    };
  }
  
  private createFallbackProcessingNode(index: number): any {
    const nodeId = this.generateUniversalId();
    
    return {
      id: nodeId,
      type: 'n8n-nodes-base.function',
      name: 'Universal Data Processor',
      parameters: {
        functionCode: `
          // Universal fallback processing
          const processedData = {
            timestamp: new Date().toISOString(),
            originalData: $input.all(),
            processed: true,
            source: 'universal-ai-workflow',
            message: 'Data processed by Universal AI Workflow'
          };
          
          return [processedData];
        `
      },
      position: [240 + (index * 250), 300]
    };
  }
  
  private generateUniversalId(): string {
    return `universal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}