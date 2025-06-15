/**
 * Simulate Workflow Execution Tool
 * 
 * This tool performs dry-run workflows without side effects, showing predicted flow.
 */

import { BaseTestingToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the simulate_workflow_execution tool
 */
export class SimulateWorkflowExecutionHandler extends BaseTestingToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow ID and simulation options
   * @returns Simulation results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, inputData, startNode, skipNodes, includeDebugInfo } = args;
      
      this.validateRequiredParams(args, ['workflowId']);
      
      // Get workflow details
      const workflow = await this.apiService.getWorkflow(workflowId);
      if (!workflow) {
        throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
      }

      // Generate input data if not provided
      const finalInputData = inputData || this.generateDefaultInputData(workflow);

      // Perform simulation
      const simulation = this.simulateWorkflowExecution(
        workflow, 
        finalInputData, 
        startNode, 
        skipNodes || [],
        includeDebugInfo || false
      );

      return this.formatSuccess(
        simulation,
        `Workflow simulation completed for: ${workflow.name}`
      );
    }, args);
  }

  /**
   * Simulate workflow execution without side effects
   */
  private simulateWorkflowExecution(
    workflow: any, 
    inputData: any, 
    startNode?: string, 
    skipNodes: string[] = [],
    includeDebugInfo: boolean = false
  ): any {
    const simulation: Record<string, any> = {
      workflowInfo: {
        id: workflow.id,
        name: workflow.name,
        totalNodes: workflow.nodes?.length || 0
      },
      inputData,
      executionFlow: [] as Array<any>,
      nodeResults: {} as Record<string, any>,
      predictions: {
        estimatedDuration: 0,
        potentialErrors: [] as Array<any>,
        resourceUsage: 'low',
        successProbability: 100
      },
      warnings: [] as string[],
      recommendations: [] as string[]
    };

    if (includeDebugInfo) {
      simulation.debugInfo = {
        nodeConnections: this.analyzeNodeConnections(workflow),
        dataFlow: this.analyzeDataFlow(workflow, inputData),
        conditionalPaths: this.analyzeConditionalPaths(workflow)
      };
    }

    // Build execution graph
    const executionGraph = this.buildExecutionGraph(workflow, startNode);
    
    // Simulate execution flow
    this.simulateExecutionFlow(
      executionGraph, 
      inputData, 
      simulation, 
      skipNodes
    );

    // Calculate predictions
    this.calculatePredictions(simulation, workflow);

    // Generate recommendations
    this.generateSimulationRecommendations(simulation);

    return simulation;
  }

  /**
   * Generate default input data for simulation
   */
  private generateDefaultInputData(workflow: any): any {
    const inputData: Record<string, any> = {
      triggerData: {
        timestamp: new Date().toISOString(),
        simulationMode: true,
        testId: `sim-${Date.now()}`
      }
    };

    // Find trigger nodes and generate appropriate data
    if (workflow.nodes) {
      const triggerNodes = workflow.nodes.filter((node: any) => 
        node.type.includes('trigger') || node.type.includes('webhook')
      );

      for (const trigger of triggerNodes) {
        inputData[trigger.name] = this.generateSampleDataForNode(trigger.type);
      }
    }

    return inputData;
  }

  /**
   * Build execution graph from workflow
   */
  private buildExecutionGraph(workflow: any, startNode?: string): any {
    const graph = {
      nodes: new Map(),
      connections: new Map(),
      startNodes: [] as string[],
      endNodes: [] as string[]
    };

    // Add all nodes to graph
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        graph.nodes.set(node.name, {
          ...node,
          dependencies: [] as string[],
          dependents: [] as string[]
        });
      }
    }

    // Build connections
    if (workflow.connections) {
      for (const [sourceNode, connections] of Object.entries(workflow.connections)) {
        const sourceConnections = connections as Record<string, any>;
        
        for (const [outputIndex, outputConnections] of Object.entries(sourceConnections)) {
          const connectionArray = outputConnections as any[];
          
          for (const connection of connectionArray) {
            const targetNode = connection.node;
            
            // Add connection
            if (!graph.connections.has(sourceNode)) {
              graph.connections.set(sourceNode, []);
            }
            graph.connections.get(sourceNode).push(targetNode);
            
            // Update dependencies
            const sourceNodeData = graph.nodes.get(sourceNode);
            const targetNodeData = graph.nodes.get(targetNode);
            
            if (sourceNodeData && targetNodeData) {
              sourceNodeData.dependents.push(targetNode);
              targetNodeData.dependencies.push(sourceNode);
            }
          }
        }
      }
    }

    // Identify start and end nodes
    if (startNode) {
      graph.startNodes = [startNode];
    } else {
      for (const [nodeName, nodeData] of graph.nodes) {
        if (nodeData.dependencies.length === 0) {
          graph.startNodes.push(nodeName);
        }
        if (nodeData.dependents.length === 0) {
          graph.endNodes.push(nodeName);
        }
      }
    }

    return graph;
  }

  /**
   * Simulate execution flow through the workflow
   */
  private simulateExecutionFlow(
    graph: any, 
    inputData: any, 
    simulation: any, 
    skipNodes: string[]
  ): void {
    const executed = new Set<string>();
    const queue = [...graph.startNodes];
    let currentData = inputData;

    while (queue.length > 0) {
      const nodeName = queue.shift()!;
      
      // Skip if already executed or in skip list
      if (executed.has(nodeName) || skipNodes.includes(nodeName)) {
        continue;
      }

      const nodeData = graph.nodes.get(nodeName);
      if (!nodeData) continue;

      // Check if all dependencies are met
      const allDependenciesMet = nodeData.dependencies.every((dep: string) => 
        executed.has(dep) || skipNodes.includes(dep)
      );

      if (!allDependenciesMet) continue;

      // Simulate node execution
      const nodeResult = this.simulateNodeExecution(nodeData, currentData);
      
      // Record execution
      simulation.executionFlow.push({
        nodeName,
        nodeType: nodeData.type,
        executionOrder: simulation.executionFlow.length + 1,
        input: this.simplifyDataForLogging(currentData),
        output: nodeResult.output,
        status: nodeResult.status,
        estimatedDuration: nodeResult.estimatedDuration,
        warnings: nodeResult.warnings
      });

      simulation.nodeResults[nodeName] = nodeResult;
      executed.add(nodeName);

      // Update current data
      if (nodeResult.output) {
        currentData = nodeResult.output;
      }

      // Add warnings
      if (nodeResult.warnings.length > 0) {
        simulation.warnings.push(...nodeResult.warnings);
      }

      // Add dependent nodes to queue
      for (const dependent of nodeData.dependents) {
        if (!executed.has(dependent)) {
          queue.push(dependent);
        }
      }
    }
  }

  /**
   * Simulate individual node execution
   */
  private simulateNodeExecution(node: any, inputData: any): any {
    const result = {
      output: inputData,
      status: 'success',
      estimatedDuration: 100,
      warnings: [] as string[]
    };

    // Node-specific simulation logic
    switch (node.type) {
      case 'n8n-nodes-base.httpRequest':
        result.estimatedDuration = 1000 + Math.random() * 2000; // 1-3 seconds
        result.output = { statusCode: 200, body: { result: 'simulated response' } };
        if (!node.parameters?.url) {
          result.warnings.push('HTTP Request node missing URL parameter');
        }
        break;

      case 'n8n-nodes-base.function':
      case 'n8n-nodes-base.code':
        result.estimatedDuration = 50 + Math.random() * 200; // 50-250ms
        result.output = { processedData: inputData };
        if (!node.parameters?.functionCode && !node.parameters?.jsCode) {
          result.warnings.push('Function node missing code');
        }
        break;

      case 'n8n-nodes-base.set':
        result.estimatedDuration = 10; // Very fast
        result.output = { ...inputData, ...(node.parameters?.values || {}) };
        break;

      case 'n8n-nodes-base.if':
        result.estimatedDuration = 20;
        const condition = this.evaluateCondition(node.parameters, inputData);
        result.output = { condition, branch: condition ? 'true' : 'false' };
        break;

      case 'n8n-nodes-base.wait':
        const waitTime = node.parameters?.amount || 1;
        result.estimatedDuration = waitTime * 1000;
        result.output = inputData;
        break;

      default:
        result.estimatedDuration = 100 + Math.random() * 500;
        result.output = { ...inputData, processedBy: node.name };
    }

    return result;
  }

  /**
   * Evaluate condition for IF nodes (simplified)
   */
  private evaluateCondition(parameters: any, data: any): boolean {
    // Simplified condition evaluation - in real implementation would be more complex
    if (!parameters) return true;
    
    // Default to true for simulation purposes
    return Math.random() > 0.2; // 80% chance of true
  }

  /**
   * Simplify data for logging to avoid circular references
   */
  private simplifyDataForLogging(data: any): any {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch {
      return { simplified: 'Complex data structure' };
    }
  }

  /**
   * Analyze node connections
   */
  private analyzeNodeConnections(workflow: any): any {
    const analysis = {
      totalConnections: 0,
      nodeConnectivity: {} as Record<string, number>,
      isolatedNodes: [] as string[],
      complexNodes: [] as string[]
    };

    if (!workflow.connections) return analysis;

    // Count connections
    for (const [sourceNode, connections] of Object.entries(workflow.connections)) {
      const sourceConnections = connections as Record<string, any>;
      let nodeConnectionCount = 0;

      for (const outputConnections of Object.values(sourceConnections)) {
        const connectionArray = outputConnections as any[];
        nodeConnectionCount += connectionArray.length;
        analysis.totalConnections += connectionArray.length;
      }

      analysis.nodeConnectivity[sourceNode] = nodeConnectionCount;

      if (nodeConnectionCount > 3) {
        analysis.complexNodes.push(sourceNode);
      }
    }

    // Find isolated nodes
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (!analysis.nodeConnectivity[node.name]) {
          analysis.isolatedNodes.push(node.name);
        }
      }
    }

    return analysis;
  }

  /**
   * Analyze data flow through workflow
   */
  private analyzeDataFlow(workflow: any, inputData: any): any {
    return {
      inputDataSize: JSON.stringify(inputData).length,
      estimatedDataGrowth: 'moderate',
      dataTransformations: this.countDataTransformations(workflow),
      potentialBottlenecks: this.identifyDataBottlenecks(workflow)
    };
  }

  /**
   * Count data transformation nodes
   */
  private countDataTransformations(workflow: any): number {
    if (!workflow.nodes) return 0;

    const transformationNodes = ['function', 'code', 'set', 'merge', 'split'];
    return workflow.nodes.filter((node: any) => 
      transformationNodes.some(type => node.type.includes(type))
    ).length;
  }

  /**
   * Identify potential data bottlenecks
   */
  private identifyDataBottlenecks(workflow: any): string[] {
    const bottlenecks: string[] = [];
    
    if (!workflow.nodes) return bottlenecks;

    for (const node of workflow.nodes) {
      if (node.type.includes('merge') || node.type.includes('aggregate')) {
        bottlenecks.push(`${node.name}: Data aggregation can be memory intensive`);
      }
      if (node.type.includes('split')) {
        bottlenecks.push(`${node.name}: Data splitting may create many items`);
      }
    }

    return bottlenecks;
  }

  /**
   * Analyze conditional paths in workflow
   */
  private analyzeConditionalPaths(workflow: any): any {
    const analysis = {
      conditionalNodes: [] as string[],
      parallelPaths: 0,
      maxPathDepth: 0
    };

    if (!workflow.nodes) return analysis;

    // Find conditional nodes
    for (const node of workflow.nodes) {
      if (node.type.includes('if') || node.type.includes('switch') || node.type.includes('merge')) {
        analysis.conditionalNodes.push(node.name);
      }
    }

    return analysis;
  }

  /**
   * Calculate execution predictions
   */
  private calculatePredictions(simulation: any, workflow: any): void {
    const predictions = simulation.predictions;

    // Calculate estimated duration
    predictions.estimatedDuration = simulation.executionFlow.reduce(
      (total: number, step: any) => total + step.estimatedDuration, 0
    );

    // Calculate success probability
    let successProbability = 100;
    for (const step of simulation.executionFlow) {
      if (step.warnings.length > 0) {
        successProbability -= 5;
      }
      if (step.nodeType.includes('http')) {
        successProbability -= 10; // External dependencies
      }
    }
    predictions.successProbability = Math.max(0, successProbability);

    // Determine resource usage
    if (predictions.estimatedDuration > 60000) {
      predictions.resourceUsage = 'high';
    } else if (predictions.estimatedDuration > 10000) {
      predictions.resourceUsage = 'medium';
    } else {
      predictions.resourceUsage = 'low';
    }

    // Identify potential errors
    for (const step of simulation.executionFlow) {
      if (step.warnings.length > 0) {
        predictions.potentialErrors.push({
          node: step.nodeName,
          risk: 'medium',
          description: step.warnings.join(', ')
        });
      }
    }
  }

  /**
   * Generate simulation recommendations
   */
  private generateSimulationRecommendations(simulation: any): void {
    const recommendations = simulation.recommendations;

    if (simulation.predictions.estimatedDuration > 60000) {
      recommendations.push('Long execution time predicted - consider optimizing slow nodes');
    }

    if (simulation.predictions.successProbability < 80) {
      recommendations.push('Low success probability - review nodes with warnings');
    }

    if (simulation.warnings.length > 5) {
      recommendations.push('Many warnings detected - consider workflow cleanup');
    }

    if (simulation.executionFlow.length > 20) {
      recommendations.push('Complex workflow - consider breaking into smaller workflows');
    }

    if (recommendations.length === 0) {
      recommendations.push('Workflow simulation looks good - ready for testing');
    }
  }
}

/**
 * Get tool definition for the simulate_workflow_execution tool
 * 
 * @returns Tool definition
 */
export function getSimulateWorkflowExecutionToolDefinition(): ToolDefinition {
  return {
    name: 'simulate_workflow_execution',
    description: 'Dry-run workflows without side effects, showing predicted flow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to simulate',
        },
        inputData: {
          type: 'object',
          description: 'Input data for simulation (auto-generated if not provided)',
        },
        startNode: {
          type: 'string',
          description: 'Node to start simulation from (optional)',
        },
        skipNodes: {
          type: 'array',
          description: 'List of node names to skip during simulation',
          items: {
            type: 'string',
          },
        },
        includeDebugInfo: {
          type: 'boolean',
          description: 'Include detailed debug information in results',
          default: false,
        },
      },
      required: ['workflowId'],
    },
  };
}