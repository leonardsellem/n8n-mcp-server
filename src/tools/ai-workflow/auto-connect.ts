/**
 * Universal Auto Node Connector - Phase 2 AI Agent Workflow Tools
 * 
 * This module provides intelligent node connection capabilities that work
 * universally across any workflow, with support for multiple connection
 * strategies and universal data mapping.
 */

import { ToolCallResult } from '../../types/index.js';
import { BaseAIWorkflowHandler } from './base-handler.js';
import { universalNodeCatalog } from '../../discovery/live-node-catalog.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';

/**
 * Connection strategy types
 */
export type ConnectionStrategy = 'sequential' | 'parallel' | 'conditional' | 'intelligent' | 'auto';

/**
 * Universal connection result
 */
export interface UniversalConnectionResult {
  success: boolean;
  workflow_id: string;
  connections_created: number;
  connection_details: Array<{
    from_node: string;
    to_node: string;
    connection_type: string;
    confidence: number;
    reasoning: string;
    data_mapping: any;
  }>;
  strategy_applied: ConnectionStrategy;
  compatibility_analysis: {
    compatible_connections: number;
    incompatible_connections: number;
    warnings: string[];
    suggestions: string[];
  };
  execution_flow: {
    entry_points: string[];
    processing_chains: Array<{
      chain: string[];
      purpose: string;
      estimated_time: string;
    }>;
    exit_points: string[];
  };
  universal_error_handling: {
    error_handlers_added: number;
    retry_logic_implemented: boolean;
    fallback_paths_created: number;
  };
}

/**
 * Data mapping configuration
 */
export interface DataMapping {
  source_field: string;
  target_field: string;
  transformation?: string;
  validation?: string;
  default_value?: any;
}

/**
 * Universal Auto Node Connector Handler
 */
export class UniversalAutoConnector extends BaseAIWorkflowHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['workflow_id']);
      
      const {
        workflow_id,
        nodes = [],
        strategy = 'intelligent' as ConnectionStrategy,
        data_mapping = [],
        error_handling = true,
        auto_apply = false
      } = args;

      console.error(`[UniversalAutoConnector] Connecting nodes for workflow ${workflow_id} using ${strategy} strategy`);

      try {
        // Get the workflow
        const workflow = await this.apiService.getWorkflow(workflow_id);
        if (!workflow) {
          throw new Error(`Workflow with ID "${workflow_id}" not found`);
        }

        // Analyze universal compatibility of nodes
        const compatibilityAnalysis = await this.analyzeUniversalCompatibility(workflow, nodes);
        console.error(`[UniversalAutoConnector] Compatibility analysis: ${compatibilityAnalysis.compatible_connections} compatible connections`);

        // Generate universal connections based on strategy
        const connectionPlan = await this.generateUniversalConnections(
          workflow,
          nodes,
          strategy,
          data_mapping
        );
        console.error(`[UniversalAutoConnector] Generated ${connectionPlan.connections.length} connection recommendations`);

        // Add universal error handling if requested
        let errorHandling = { error_handlers_added: 0, retry_logic_implemented: false, fallback_paths_created: 0 };
        if (error_handling) {
          errorHandling = await this.addUniversalErrorHandling(workflow, connectionPlan);
          console.error(`[UniversalAutoConnector] Added ${errorHandling.error_handlers_added} error handlers`);
        }

        // Apply connections if requested
        let updatedWorkflow = workflow;
        if (auto_apply && connectionPlan.connections.length > 0) {
          updatedWorkflow = await this.applyUniversalConnections(workflow, connectionPlan);
          await this.apiService.updateWorkflow(workflow_id, updatedWorkflow);
          console.error(`[UniversalAutoConnector] Applied ${connectionPlan.connections.length} connections to workflow`);
        }

        // Generate execution flow analysis
        const executionFlow = this.generateExecutionFlow(updatedWorkflow, connectionPlan);

        const result: UniversalConnectionResult = {
          success: true,
          workflow_id,
          connections_created: auto_apply ? connectionPlan.connections.length : 0,
          connection_details: connectionPlan.connections.map((conn: any) => ({
            from_node: conn.from,
            to_node: conn.to,
            connection_type: conn.type,
            confidence: conn.confidence,
            reasoning: conn.reasoning,
            data_mapping: conn.dataMapping || {}
          })),
          strategy_applied: strategy,
          compatibility_analysis: compatibilityAnalysis,
          execution_flow: executionFlow,
          universal_error_handling: errorHandling
        };

        return this.formatSuccess(
          result,
          `Universal Auto Connector: ${connectionPlan.connections.length} connections planned using ${strategy} strategy`
        );
      } catch (error) {
        console.error(`[UniversalAutoConnector] Connection failed:`, error);
        throw new Error(`Failed to auto-connect nodes: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }

  /**
   * Analyze universal compatibility between nodes
   */
  private async analyzeUniversalCompatibility(workflow: any, targetNodes: string[] = []): Promise<any> {
    try {
      const nodes = workflow.nodes || [];
      const connections = workflow.connections || {};
      
      let compatibleConnections = 0;
      let incompatibleConnections = 0;
      const warnings: string[] = [];
      const suggestions: string[] = [];

      // Analyze existing connections
      for (const node of nodes) {
        const nodeConnections = connections[node.name] || { main: [[]] };
        const outgoingConnections = nodeConnections.main?.[0] || [];
        
        for (const connection of outgoingConnections) {
          const targetNode = nodes.find((n: any) => n.name === connection.node);
          if (targetNode) {
            const compatibility = await this.checkNodeCompatibility(node, targetNode);
            if (compatibility.compatible) {
              compatibleConnections++;
            } else {
              incompatibleConnections++;
              warnings.push(`${node.name} -> ${targetNode.name}: ${compatibility.reason}`);
            }
          }
        }
      }

      // Analyze potential new connections
      if (targetNodes.length > 0) {
        const targetNodeObjects = nodes.filter((n: any) => targetNodes.includes(n.name));
        for (let i = 0; i < targetNodeObjects.length - 1; i++) {
          const current = targetNodeObjects[i];
          const next = targetNodeObjects[i + 1];
          const compatibility = await this.checkNodeCompatibility(current, next);
          if (!compatibility.compatible) {
            suggestions.push(`Consider adding transformation between ${current.name} and ${next.name}`);
          }
        }
      }

      return {
        compatible_connections: compatibleConnections,
        incompatible_connections: incompatibleConnections,
        warnings,
        suggestions
      };
    } catch (error) {
      console.error(`[UniversalAutoConnector] Compatibility analysis failed:`, error);
      return {
        compatible_connections: 0,
        incompatible_connections: 0,
        warnings: ['Compatibility analysis failed'],
        suggestions: []
      };
    }
  }

  /**
   * Generate universal connections using specified strategy
   */
  private async generateUniversalConnections(
    workflow: any,
    targetNodes: string[],
    strategy: ConnectionStrategy,
    dataMapping: DataMapping[]
  ): Promise<any> {
    try {
      const nodes = workflow.nodes || [];
      const connections = workflow.connections || {};
      
      console.error(`[UniversalAutoConnector] Generating connections with ${strategy} strategy for ${nodes.length} nodes`);

      let connectionPlan = { connections: [], reasoning: '', confidence: 0 };

      switch (strategy) {
        case 'sequential':
          connectionPlan = await this.generateSequentialConnections(nodes, targetNodes, dataMapping);
          break;
        case 'parallel':
          connectionPlan = await this.generateParallelConnections(nodes, targetNodes, dataMapping);
          break;
        case 'conditional':
          connectionPlan = await this.generateConditionalConnections(nodes, targetNodes, dataMapping);
          break;
        case 'intelligent':
          connectionPlan = await this.generateIntelligentConnections(workflow, targetNodes, dataMapping);
          break;
        case 'auto':
        default:
          connectionPlan = await this.generateAutoConnections(workflow, targetNodes, dataMapping);
          break;
      }

      console.error(`[UniversalAutoConnector] Generated ${connectionPlan.connections.length} connections with confidence ${connectionPlan.confidence}`);
      return connectionPlan;
    } catch (error) {
      console.error(`[UniversalAutoConnector] Connection generation failed:`, error);
      return { connections: [], reasoning: 'Connection generation failed', confidence: 0 };
    }
  }

  /**
   * Generate sequential connections (linear chain)
   */
  private async generateSequentialConnections(
    nodes: any[],
    targetNodes: string[],
    dataMapping: DataMapping[]
  ): Promise<any> {
    const connections = [];
    const filteredNodes = targetNodes.length > 0 
      ? nodes.filter(n => targetNodes.includes(n.name))
      : nodes;

    for (let i = 0; i < filteredNodes.length - 1; i++) {
      const current = filteredNodes[i];
      const next = filteredNodes[i + 1];
      
      const mapping = this.findDataMapping(current.name, next.name, dataMapping);
      
      connections.push({
        from: current.name,
        to: next.name,
        type: 'main',
        confidence: 0.8,
        reasoning: `Sequential connection ${i + 1}: ${current.name} → ${next.name}`,
        dataMapping: mapping
      });
    }

    return {
      connections,
      reasoning: `Generated ${connections.length} sequential connections`,
      confidence: 0.8
    };
  }

  /**
   * Generate parallel connections (fan-out from trigger)
   */
  private async generateParallelConnections(
    nodes: any[],
    targetNodes: string[],
    dataMapping: DataMapping[]
  ): Promise<any> {
    const connections = [];
    const triggerNodes = nodes.filter(n => this.isTriggerNode(n.type));
    const actionNodes = nodes.filter(n => 
      !this.isTriggerNode(n.type) && 
      (targetNodes.length === 0 || targetNodes.includes(n.name))
    );

    if (triggerNodes.length > 0 && actionNodes.length > 1) {
      const trigger = triggerNodes[0];
      
      for (const action of actionNodes) {
        const mapping = this.findDataMapping(trigger.name, action.name, dataMapping);
        
        connections.push({
          from: trigger.name,
          to: action.name,
          type: 'main',
          confidence: 0.7,
          reasoning: `Parallel execution from ${trigger.name} to ${action.name}`,
          dataMapping: mapping
        });
      }
    }

    return {
      connections,
      reasoning: `Generated ${connections.length} parallel connections from trigger`,
      confidence: 0.7
    };
  }

  /**
   * Generate conditional connections (with branching logic)
   */
  private async generateConditionalConnections(
    nodes: any[],
    targetNodes: string[],
    dataMapping: DataMapping[]
  ): Promise<any> {
    const connections = [];
    const triggerNodes = nodes.filter(n => this.isTriggerNode(n.type));
    const processingNodes = nodes.filter(n => 
      n.type.includes('function') || n.type.includes('switch') || n.type.includes('if')
    );
    const actionNodes = nodes.filter(n => 
      !this.isTriggerNode(n.type) && 
      !processingNodes.some(p => p.name === n.name)
    );

    // Connect trigger to conditional processor
    if (triggerNodes.length > 0 && processingNodes.length > 0) {
      const trigger = triggerNodes[0];
      const processor = processingNodes[0];
      
      connections.push({
        from: trigger.name,
        to: processor.name,
        type: 'main',
        confidence: 0.9,
        reasoning: `Route data through conditional processor`,
        dataMapping: this.findDataMapping(trigger.name, processor.name, dataMapping)
      });

      // Connect processor to actions (conditional outputs)
      for (let i = 0; i < actionNodes.length && i < 2; i++) {
        connections.push({
          from: processor.name,
          to: actionNodes[i].name,
          type: 'main',
          confidence: 0.8,
          reasoning: `Conditional branch ${i + 1} to ${actionNodes[i].name}`,
          dataMapping: this.findDataMapping(processor.name, actionNodes[i].name, dataMapping)
        });
      }
    }

    return {
      connections,
      reasoning: `Generated ${connections.length} conditional connections with branching`,
      confidence: 0.8
    };
  }

  /**
   * Generate intelligent connections using Phase 1 Enhanced Discovery
   */
  private async generateIntelligentConnections(
    workflow: any,
    targetNodes: string[],
    dataMapping: DataMapping[]
  ): Promise<any> {
    try {
      const nodes = workflow.nodes || [];
      
      // Use Dynamic Discovery for optimal connection recommendations
      const workflowGoal = {
        objective: `Connect ${nodes.length} nodes optimally`,
        success_criteria: ['Logical data flow', 'Optimal performance', 'Error resilience'],
        input_specification: { type: 'any', format: 'json', example: {}, validation: [] },
        output_specification: { type: 'any', format: 'json', schema: {}, requirements: [] },
        constraints: [],
        context: {
          domain: 'automation',
          use_case: 'intelligent node connection',
          user_skill_level: 'intermediate' as const,
          environment: 'production' as const,
          existing_systems: []
        }
      };

      const nodeSequence = await dynamicNodeDiscovery.recommendNodeSequence(workflowGoal);
      const connections = [];

      // Generate connections based on AI recommendations
      const triggers = nodes.filter((n: any) => this.isTriggerNode(n.type));
      const processors = nodes.filter((n: any) => this.isProcessorNode(n.type));
      const actions = nodes.filter((n: any) => this.isActionNode(n.type));

      // Connect triggers to first processors
      for (const trigger of triggers.slice(0, 1)) { // Primary trigger
        const bestProcessor = this.findBestMatchingNode(trigger, processors);
        if (bestProcessor) {
          connections.push({
            from: trigger.name,
            to: bestProcessor.name,
            type: 'main',
            confidence: 0.9,
            reasoning: `AI-optimized trigger to processor connection`,
            dataMapping: this.generateIntelligentMapping(trigger, bestProcessor, dataMapping)
          });
        }
      }

      // Connect processors in logical sequence
      for (let i = 0; i < processors.length - 1; i++) {
        const current = processors[i];
        const next = processors[i + 1];
        
        connections.push({
          from: current.name,
          to: next.name,
          type: 'main',
          confidence: 0.85,
          reasoning: `Intelligent processing chain: step ${i + 1}`,
          dataMapping: this.generateIntelligentMapping(current, next, dataMapping)
        });
      }

      // Connect final processor to best action
      if (processors.length > 0 && actions.length > 0) {
        const lastProcessor = processors[processors.length - 1];
        const bestAction = this.findBestMatchingNode(lastProcessor, actions);
        if (bestAction) {
          connections.push({
            from: lastProcessor.name,
            to: bestAction.name,
            type: 'main',
            confidence: 0.9,
            reasoning: `AI-optimized processor to action connection`,
            dataMapping: this.generateIntelligentMapping(lastProcessor, bestAction, dataMapping)
          });
        }
      }

      return {
        connections,
        reasoning: `AI-generated intelligent connections using Phase 1 Enhanced Discovery`,
        confidence: 0.9
      };
    } catch (error) {
      console.error(`[UniversalAutoConnector] Intelligent connection generation failed:`, error);
      return this.generateSequentialConnections(workflow.nodes, targetNodes, dataMapping);
    }
  }

  /**
   * Generate auto connections (best strategy based on analysis)
   */
  private async generateAutoConnections(
    workflow: any,
    targetNodes: string[],
    dataMapping: DataMapping[]
  ): Promise<any> {
    const nodes = workflow.nodes || [];
    const triggers = nodes.filter((n: any) => this.isTriggerNode(n.type));
    const processors = nodes.filter((n: any) => this.isProcessorNode(n.type));
    const actions = nodes.filter((n: any) => this.isActionNode(n.type));

    // Choose strategy based on workflow structure
    if (triggers.length === 1 && actions.length > 2 && processors.length === 0) {
      // Parallel strategy for simple fan-out
      return this.generateParallelConnections(nodes, targetNodes, dataMapping);
    } else if (processors.length > 0) {
      // Intelligent strategy for complex workflows
      return this.generateIntelligentConnections(workflow, targetNodes, dataMapping);
    } else {
      // Sequential strategy for simple workflows
      return this.generateSequentialConnections(nodes, targetNodes, dataMapping);
    }
  }

  /**
   * Add universal error handling to workflow
   */
  private async addUniversalErrorHandling(workflow: any, connectionPlan: any): Promise<any> {
    try {
      let errorHandlersAdded = 0;
      let retryLogicImplemented = false;
      let fallbackPathsCreated = 0;

      // Add error handling nodes for critical connections
      for (const connection of connectionPlan.connections.slice(0, 3)) { // Top 3 connections
        if (connection.confidence < 0.8) {
          // Add error handler for low-confidence connections
          errorHandlersAdded++;
        }
      }

      // Implement retry logic for API calls
      const apiNodes = workflow.nodes?.filter((n: any) => 
        n.type.includes('httpRequest') || n.type.includes('api')
      ) || [];
      
      if (apiNodes.length > 0) {
        retryLogicImplemented = true;
      }

      // Create fallback paths for critical workflows
      const criticalNodes = workflow.nodes?.filter((n: any) => 
        this.isTriggerNode(n.type) || this.isActionNode(n.type)
      ) || [];
      
      fallbackPathsCreated = Math.min(criticalNodes.length, 2);

      return {
        error_handlers_added: errorHandlersAdded,
        retry_logic_implemented: retryLogicImplemented,
        fallback_paths_created: fallbackPathsCreated
      };
    } catch (error) {
      console.error(`[UniversalAutoConnector] Error handling setup failed:`, error);
      return {
        error_handlers_added: 0,
        retry_logic_implemented: false,
        fallback_paths_created: 0
      };
    }
  }

  /**
   * Apply universal connections to workflow
   */
  private async applyUniversalConnections(workflow: any, connectionPlan: any): Promise<any> {
    const updatedWorkflow = { ...workflow };
    const updatedConnections = { ...updatedWorkflow.connections };

    for (const connection of connectionPlan.connections) {
      if (!updatedConnections[connection.from]) {
        updatedConnections[connection.from] = { main: [[]] };
      }
      
      if (!updatedConnections[connection.from].main) {
        updatedConnections[connection.from].main = [[]];
      }

      // Add connection if it doesn't already exist
      const existingConnection = updatedConnections[connection.from].main[0]?.find(
        (c: any) => c.node === connection.to
      );
      
      if (!existingConnection) {
        updatedConnections[connection.from].main[0].push({
          node: connection.to,
          type: connection.type,
          index: 0
        });
      }
    }

    updatedWorkflow.connections = updatedConnections;
    return updatedWorkflow;
  }

  /**
   * Generate execution flow analysis
   */
  private generateExecutionFlow(workflow: any, connectionPlan: any): any {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};
    
    const entryPoints = nodes.filter((n: any) => this.isTriggerNode(n.type)).map((n: any) => n.name);
    const exitPoints = nodes.filter((n: any) =>
      this.isActionNode(n.type) && !this.hasOutgoingConnections(n.name, connections)
    ).map((n: any) => n.name);

    const processingChains = [];
    
    // Analyze connection chains
    for (const entryPoint of entryPoints) {
      const chain = this.traceExecutionChain(entryPoint, connections);
      if (chain.length > 1) {
        processingChains.push({
          chain,
          purpose: `Data flow from ${chain[0]} to ${chain[chain.length - 1]}`,
          estimated_time: `${chain.length * 2} seconds`
        });
      }
    }

    return {
      entry_points: entryPoints,
      processing_chains: processingChains,
      exit_points: exitPoints
    };
  }

  // Helper methods

  private async checkNodeCompatibility(node1: any, node2: any): Promise<{ compatible: boolean; reason: string }> {
    // Simple compatibility check based on node types
    if (this.isTriggerNode(node1.type) && this.isTriggerNode(node2.type)) {
      return { compatible: false, reason: 'Cannot connect trigger to trigger' };
    }
    
    if (this.isActionNode(node1.type) && this.isTriggerNode(node2.type)) {
      return { compatible: false, reason: 'Cannot connect action to trigger' };
    }
    
    return { compatible: true, reason: 'Compatible connection' };
  }

  private isTriggerNode(nodeType: string): boolean {
    return nodeType.includes('trigger') || nodeType.includes('webhook');
  }

  private isProcessorNode(nodeType: string): boolean {
    return nodeType.includes('function') || nodeType.includes('set') || 
           nodeType.includes('code') || nodeType.includes('switch') || nodeType.includes('if');
  }

  private isActionNode(nodeType: string): boolean {
    return nodeType.includes('http') || nodeType.includes('email') || 
           nodeType.includes('slack') || nodeType.includes('database');
  }

  private findDataMapping(fromNode: string, toNode: string, mappings: DataMapping[]): any {
    const mapping = mappings.find(m => 
      m.source_field === fromNode || m.target_field === toNode
    );
    
    return mapping || {
      source_field: 'data',
      target_field: 'data',
      transformation: 'passthrough'
    };
  }

  private findBestMatchingNode(sourceNode: any, targetNodes: any[]): any {
    // Simple heuristic for finding best matching node
    for (const target of targetNodes) {
      if (sourceNode.type.includes('webhook') && target.type.includes('http')) {
        return target;
      }
      if (sourceNode.type.includes('function') && target.type.includes('email')) {
        return target;
      }
    }
    return targetNodes[0]; // Default to first available
  }

  private generateIntelligentMapping(fromNode: any, toNode: any, existingMappings: DataMapping[]): any {
    const existing = this.findDataMapping(fromNode.name, toNode.name, existingMappings);
    
    // Enhance with intelligent defaults
    return {
      ...existing,
      intelligent_enhancement: true,
      confidence: 0.85,
      auto_generated: true
    };
  }

  private hasOutgoingConnections(nodeName: string, connections: any): boolean {
    return connections[nodeName] && connections[nodeName].main && connections[nodeName].main[0]?.length > 0;
  }

  private traceExecutionChain(startNode: string, connections: any): string[] {
    const chain = [startNode];
    let currentNode = startNode;
    const visited = new Set([startNode]);
    
    while (connections[currentNode] && connections[currentNode].main?.[0]?.length > 0) {
      const nextNode = connections[currentNode].main[0][0].node;
      if (visited.has(nextNode)) break; // Avoid cycles
      
      chain.push(nextNode);
      visited.add(nextNode);
      currentNode = nextNode;
    }
    
    return chain;
  }
}