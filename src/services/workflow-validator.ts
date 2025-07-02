/**
 * Workflow Validator for n8n workflows
 * Validates complete workflow structure, connections, and node configurations
 */

import { NodeRepository } from '../database/node-repository';
import { EnhancedConfigValidator } from './enhanced-config-validator';
import { ExpressionValidator } from './expression-validator';
import { Logger } from '../utils/logger';

const logger = new Logger({ prefix: '[WorkflowValidator]' });

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: any;
  credentials?: any;
  disabled?: boolean;
  notes?: string;
  typeVersion?: number;
}

interface WorkflowConnection {
  [sourceNode: string]: {
    main?: Array<Array<{ node: string; type: string; index: number }>>;
    error?: Array<Array<{ node: string; type: string; index: number }>>;
    ai_tool?: Array<Array<{ node: string; type: string; index: number }>>;
  };
}

interface WorkflowJson {
  name?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection;
  settings?: any;
  staticData?: any;
  pinData?: any;
  meta?: any;
}

interface ValidationIssue {
  type: 'error' | 'warning';
  nodeId?: string;
  nodeName?: string;
  message: string;
  details?: any;
}

interface WorkflowValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  statistics: {
    totalNodes: number;
    enabledNodes: number;
    triggerNodes: number;
    validConnections: number;
    invalidConnections: number;
    expressionsValidated: number;
  };
  suggestions: string[];
}

export class WorkflowValidator {
  constructor(
    private nodeRepository: NodeRepository,
    private nodeValidator: typeof EnhancedConfigValidator
  ) {}

  /**
   * Validate a complete workflow
   */
  async validateWorkflow(
    workflow: WorkflowJson,
    options: {
      validateNodes?: boolean;
      validateConnections?: boolean;
      validateExpressions?: boolean;
      profile?: 'minimal' | 'runtime' | 'ai-friendly' | 'strict';
    } = {}
  ): Promise<WorkflowValidationResult> {
    const {
      validateNodes = true,
      validateConnections = true,
      validateExpressions = true,
      profile = 'runtime'
    } = options;

    const result: WorkflowValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      statistics: {
        totalNodes: workflow.nodes.length,
        enabledNodes: workflow.nodes.filter(n => !n.disabled).length,
        triggerNodes: 0,
        validConnections: 0,
        invalidConnections: 0,
        expressionsValidated: 0,
      },
      suggestions: []
    };

    try {
      // Basic workflow structure validation
      this.validateWorkflowStructure(workflow, result);

      // Validate each node if requested
      if (validateNodes) {
        await this.validateAllNodes(workflow, result, profile);
      }

      // Validate connections if requested
      if (validateConnections) {
        this.validateConnections(workflow, result);
      }

      // Validate expressions if requested
      if (validateExpressions) {
        this.validateExpressions(workflow, result);
      }

      // Check workflow patterns and best practices
      this.checkWorkflowPatterns(workflow, result);

      // Add suggestions based on findings
      this.generateSuggestions(workflow, result);

    } catch (error) {
      logger.error('Error validating workflow:', error);
      result.errors.push({
        type: 'error',
        message: `Workflow validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  /**
   * Validate basic workflow structure
   */
  private validateWorkflowStructure(
    workflow: WorkflowJson,
    result: WorkflowValidationResult
  ): void {
    // Check for required fields
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      result.errors.push({
        type: 'error',
        message: 'Workflow must have a nodes array'
      });
      return;
    }

    if (!workflow.connections || typeof workflow.connections !== 'object') {
      result.errors.push({
        type: 'error',
        message: 'Workflow must have a connections object'
      });
      return;
    }

    // Check for empty workflow
    if (workflow.nodes.length === 0) {
      result.errors.push({
        type: 'error',
        message: 'Workflow has no nodes'
      });
      return;
    }

    // Check for minimum viable workflow
    if (workflow.nodes.length === 1) {
      const singleNode = workflow.nodes[0];
      const normalizedType = singleNode.type.replace('n8n-nodes-base.', 'nodes-base.');
      const isWebhook = normalizedType === 'nodes-base.webhook' || 
                       normalizedType === 'nodes-base.webhookTrigger';
      
      if (!isWebhook) {
        result.errors.push({
          type: 'error',
          message: 'Single-node workflows are only valid for webhook endpoints. Add at least one more connected node to create a functional workflow.'
        });
      } else if (Object.keys(workflow.connections).length === 0) {
        result.warnings.push({
          type: 'warning',
          message: 'Webhook node has no connections. Consider adding nodes to process the webhook data.'
        });
      }
    }

    // Check for empty connections in multi-node workflows
    if (workflow.nodes.length > 1) {
      const hasEnabledNodes = workflow.nodes.some(n => !n.disabled);
      const hasConnections = Object.keys(workflow.connections).length > 0;
      
      if (hasEnabledNodes && !hasConnections) {
        result.errors.push({
          type: 'error',
          message: 'Multi-node workflow has no connections. Nodes must be connected to create a workflow. Use connections: { "Source Node Name": { "main": [[{ "node": "Target Node Name", "type": "main", "index": 0 }]] } }'
        });
      }
    }

    // Check for duplicate node names
    const nodeNames = new Set<string>();
    const nodeIds = new Set<string>();
    
    for (const node of workflow.nodes) {
      if (nodeNames.has(node.name)) {
        result.errors.push({
          type: 'error',
          nodeId: node.id,
          nodeName: node.name,
          message: `Duplicate node name: "${node.name}"`
        });
      }
      nodeNames.add(node.name);

      if (nodeIds.has(node.id)) {
        result.errors.push({
          type: 'error',
          nodeId: node.id,
          message: `Duplicate node ID: "${node.id}"`
        });
      }
      nodeIds.add(node.id);
    }

    // Count trigger nodes - normalize type names first
    const triggerNodes = workflow.nodes.filter(n => {
      const normalizedType = n.type.replace('n8n-nodes-base.', 'nodes-base.');
      return normalizedType.toLowerCase().includes('trigger') || 
             normalizedType.toLowerCase().includes('webhook') ||
             normalizedType === 'nodes-base.start' ||
             normalizedType === 'nodes-base.manualTrigger' ||
             normalizedType === 'nodes-base.formTrigger';
    });
    result.statistics.triggerNodes = triggerNodes.length;

    // Check for at least one trigger node
    if (triggerNodes.length === 0 && workflow.nodes.filter(n => !n.disabled).length > 0) {
      result.warnings.push({
        type: 'warning',
        message: 'Workflow has no trigger nodes. It can only be executed manually.'
      });
    }
  }

  /**
   * Validate all nodes in the workflow
   */
  private async validateAllNodes(
    workflow: WorkflowJson,
    result: WorkflowValidationResult,
    profile: string
  ): Promise<void> {
    for (const node of workflow.nodes) {
      if (node.disabled) continue;

      try {
        // FIRST: Check for common invalid patterns before database lookup
        if (node.type.startsWith('nodes-base.')) {
          // This is ALWAYS invalid in workflows - must use n8n-nodes-base prefix
          const correctType = node.type.replace('nodes-base.', 'n8n-nodes-base.');
          result.errors.push({
            type: 'error',
            nodeId: node.id,
            nodeName: node.name,
            message: `Invalid node type: "${node.type}". Use "${correctType}" instead. Node types in workflows must use the full package name.`
          });
          continue;
        }
        
        // Get node definition - try multiple formats
        let nodeInfo = this.nodeRepository.getNode(node.type);
        
        // If not found, try with normalized type
        if (!nodeInfo) {
          let normalizedType = node.type;
          
          // Handle n8n-nodes-base -> nodes-base
          if (node.type.startsWith('n8n-nodes-base.')) {
            normalizedType = node.type.replace('n8n-nodes-base.', 'nodes-base.');
            nodeInfo = this.nodeRepository.getNode(normalizedType);
          }
          // Handle @n8n/n8n-nodes-langchain -> nodes-langchain
          else if (node.type.startsWith('@n8n/n8n-nodes-langchain.')) {
            normalizedType = node.type.replace('@n8n/n8n-nodes-langchain.', 'nodes-langchain.');
            nodeInfo = this.nodeRepository.getNode(normalizedType);
          }
        }
        
        if (!nodeInfo) {
          // Check for common mistakes
          let suggestion = '';
          
          // Missing package prefix
          if (node.type.startsWith('nodes-base.')) {
            const withPrefix = node.type.replace('nodes-base.', 'n8n-nodes-base.');
            const exists = this.nodeRepository.getNode(withPrefix) || 
                          this.nodeRepository.getNode(withPrefix.replace('n8n-nodes-base.', 'nodes-base.'));
            if (exists) {
              suggestion = ` Did you mean "n8n-nodes-base.${node.type.substring(11)}"?`;
            }
          }
          // Check if it's just the node name without package
          else if (!node.type.includes('.')) {
            // Try common node names
            const commonNodes = [
              'webhook', 'httpRequest', 'set', 'code', 'manualTrigger', 
              'scheduleTrigger', 'emailSend', 'slack', 'discord'
            ];
            
            if (commonNodes.includes(node.type)) {
              suggestion = ` Did you mean "n8n-nodes-base.${node.type}"?`;
            }
          }
          
          // If no specific suggestion, try to find similar nodes
          if (!suggestion) {
            const similarNodes = this.findSimilarNodeTypes(node.type);
            if (similarNodes.length > 0) {
              suggestion = ` Did you mean: ${similarNodes.map(n => `"${n}"`).join(', ')}?`;
            }
          }
          
          result.errors.push({
            type: 'error',
            nodeId: node.id,
            nodeName: node.name,
            message: `Unknown node type: "${node.type}".${suggestion} Node types must include the package prefix (e.g., "n8n-nodes-base.webhook", not "webhook" or "nodes-base.webhook").`
          });
          continue;
        }

        // Validate typeVersion for versioned nodes
        if (nodeInfo.isVersioned) {
          // Check if typeVersion is missing
          if (!node.typeVersion) {
            result.errors.push({
              type: 'error',
              nodeId: node.id,
              nodeName: node.name,
              message: `Missing required property 'typeVersion'. Add typeVersion: ${nodeInfo.version || 1}`
            });
          } 
          // Check if typeVersion is invalid
          else if (typeof node.typeVersion !== 'number' || node.typeVersion < 1) {
            result.errors.push({
              type: 'error',
              nodeId: node.id,
              nodeName: node.name,
              message: `Invalid typeVersion: ${node.typeVersion}. Must be a positive number`
            });
          }
          // Check if typeVersion is outdated (less than latest)
          else if (nodeInfo.version && node.typeVersion < nodeInfo.version) {
            result.warnings.push({
              type: 'warning',
              nodeId: node.id,
              nodeName: node.name,
              message: `Outdated typeVersion: ${node.typeVersion}. Latest is ${nodeInfo.version}`
            });
          }
          // Check if typeVersion exceeds maximum supported
          else if (nodeInfo.version && node.typeVersion > nodeInfo.version) {
            result.errors.push({
              type: 'error',
              nodeId: node.id,
              nodeName: node.name,
              message: `typeVersion ${node.typeVersion} exceeds maximum supported version ${nodeInfo.version}`
            });
          }
        }

        // Validate node configuration
        const nodeValidation = this.nodeValidator.validateWithMode(
          node.type,
          node.parameters,
          nodeInfo.properties || [],
          'operation',
          profile as any
        );

        // Add node-specific errors and warnings
        nodeValidation.errors.forEach((error: any) => {
          result.errors.push({
            type: 'error',
            nodeId: node.id,
            nodeName: node.name,
            message: error
          });
        });

        nodeValidation.warnings.forEach((warning: any) => {
          result.warnings.push({
            type: 'warning',
            nodeId: node.id,
            nodeName: node.name,
            message: warning
          });
        });

      } catch (error) {
        result.errors.push({
          type: 'error',
          nodeId: node.id,
          nodeName: node.name,
          message: `Failed to validate node: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
  }

  /**
   * Validate workflow connections
   */
  private validateConnections(
    workflow: WorkflowJson,
    result: WorkflowValidationResult
  ): void {
    const nodeMap = new Map(workflow.nodes.map(n => [n.name, n]));
    const nodeIdMap = new Map(workflow.nodes.map(n => [n.id, n]));

    // Check all connections
    for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
      const sourceNode = nodeMap.get(sourceName);
      
      if (!sourceNode) {
        // Check if this is an ID being used instead of a name
        const nodeById = nodeIdMap.get(sourceName);
        if (nodeById) {
          result.errors.push({
            type: 'error',
            nodeId: nodeById.id,
            nodeName: nodeById.name,
            message: `Connection uses node ID '${sourceName}' instead of node name '${nodeById.name}'. In n8n, connections must use node names, not IDs.`
          });
        } else {
          result.errors.push({
            type: 'error',
            message: `Connection from non-existent node: "${sourceName}"`
          });
        }
        result.statistics.invalidConnections++;
        continue;
      }

      // Check main outputs
      if (outputs.main) {
        this.validateConnectionOutputs(
          sourceName,
          outputs.main,
          nodeMap,
          nodeIdMap,
          result,
          'main'
        );
      }

      // Check error outputs
      if (outputs.error) {
        this.validateConnectionOutputs(
          sourceName,
          outputs.error,
          nodeMap,
          nodeIdMap,
          result,
          'error'
        );
      }

      // Check AI tool outputs
      if (outputs.ai_tool) {
        this.validateConnectionOutputs(
          sourceName,
          outputs.ai_tool,
          nodeMap,
          nodeIdMap,
          result,
          'ai_tool'
        );
      }
    }

    // Check for orphaned nodes (not connected and not triggers)
    const connectedNodes = new Set<string>();
    
    // Add all source nodes
    Object.keys(workflow.connections).forEach(name => connectedNodes.add(name));
    
    // Add all target nodes
    Object.values(workflow.connections).forEach(outputs => {
      if (outputs.main) {
        outputs.main.flat().forEach(conn => {
          if (conn) connectedNodes.add(conn.node);
        });
      }
      if (outputs.error) {
        outputs.error.flat().forEach(conn => {
          if (conn) connectedNodes.add(conn.node);
        });
      }
      if (outputs.ai_tool) {
        outputs.ai_tool.flat().forEach(conn => {
          if (conn) connectedNodes.add(conn.node);
        });
      }
    });

    // Check for orphaned nodes
    for (const node of workflow.nodes) {
      if (node.disabled) continue;
      
      const normalizedType = node.type.replace('n8n-nodes-base.', 'nodes-base.');
      const isTrigger = normalizedType.toLowerCase().includes('trigger') || 
                       normalizedType.toLowerCase().includes('webhook') ||
                       normalizedType === 'nodes-base.start' ||
                       normalizedType === 'nodes-base.manualTrigger' ||
                       normalizedType === 'nodes-base.formTrigger';
      
      if (!connectedNodes.has(node.name) && !isTrigger) {
        result.warnings.push({
          type: 'warning',
          nodeId: node.id,
          nodeName: node.name,
          message: 'Node is not connected to any other nodes'
        });
      }
    }

    // Check for cycles
    if (this.hasCycle(workflow)) {
      result.errors.push({
        type: 'error',
        message: 'Workflow contains a cycle (infinite loop)'
      });
    }
  }

  /**
   * Validate connection outputs
   */
  private validateConnectionOutputs(
    sourceName: string,
    outputs: Array<Array<{ node: string; type: string; index: number }>>,
    nodeMap: Map<string, WorkflowNode>,
    nodeIdMap: Map<string, WorkflowNode>,
    result: WorkflowValidationResult,
    outputType: 'main' | 'error' | 'ai_tool'
  ): void {
    outputs.forEach((outputConnections, outputIndex) => {
      if (!outputConnections) return;
      
      outputConnections.forEach(connection => {
        const targetNode = nodeMap.get(connection.node);
        
        if (!targetNode) {
          // Check if this is an ID being used instead of a name
          const nodeById = nodeIdMap.get(connection.node);
          if (nodeById) {
            result.errors.push({
              type: 'error',
              nodeId: nodeById.id,
              nodeName: nodeById.name,
              message: `Connection target uses node ID '${connection.node}' instead of node name '${nodeById.name}' (from ${sourceName}). In n8n, connections must use node names, not IDs.`
            });
          } else {
            result.errors.push({
              type: 'error',
              message: `Connection to non-existent node: "${connection.node}" from "${sourceName}"`
            });
          }
          result.statistics.invalidConnections++;
        } else if (targetNode.disabled) {
          result.warnings.push({
            type: 'warning',
            message: `Connection to disabled node: "${connection.node}" from "${sourceName}"`
          });
        } else {
          result.statistics.validConnections++;
          
          // Additional validation for AI tool connections
          if (outputType === 'ai_tool') {
            this.validateAIToolConnection(sourceName, targetNode, result);
          }
        }
      });
    });
  }

  /**
   * Validate AI tool connections
   */
  private validateAIToolConnection(
    sourceName: string,
    targetNode: WorkflowNode,
    result: WorkflowValidationResult
  ): void {
    // For AI tool connections, we just need to check if this is being used as a tool
    // The source should be an AI Agent connecting to this target node as a tool
    
    // Get target node info to check if it can be used as a tool
    let targetNodeInfo = this.nodeRepository.getNode(targetNode.type);
    
    // Try normalized type if not found
    if (!targetNodeInfo) {
      let normalizedType = targetNode.type;
      
      // Handle n8n-nodes-base -> nodes-base
      if (targetNode.type.startsWith('n8n-nodes-base.')) {
        normalizedType = targetNode.type.replace('n8n-nodes-base.', 'nodes-base.');
        targetNodeInfo = this.nodeRepository.getNode(normalizedType);
      }
      // Handle @n8n/n8n-nodes-langchain -> nodes-langchain
      else if (targetNode.type.startsWith('@n8n/n8n-nodes-langchain.')) {
        normalizedType = targetNode.type.replace('@n8n/n8n-nodes-langchain.', 'nodes-langchain.');
        targetNodeInfo = this.nodeRepository.getNode(normalizedType);
      }
    }
    
    if (targetNodeInfo && !targetNodeInfo.isAITool && targetNodeInfo.package !== 'n8n-nodes-base') {
      // It's a community node being used as a tool
      result.warnings.push({
        type: 'warning',
        nodeId: targetNode.id,
        nodeName: targetNode.name,
        message: `Community node "${targetNode.name}" is being used as an AI tool. Ensure N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true is set.`
      });
    }
  }

  /**
   * Check if workflow has cycles
   */
  private hasCycle(workflow: WorkflowJson): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleDFS = (nodeName: string): boolean => {
      visited.add(nodeName);
      recursionStack.add(nodeName);

      const connections = workflow.connections[nodeName];
      if (connections) {
        const allTargets: string[] = [];
        
        if (connections.main) {
          connections.main.flat().forEach(conn => {
            if (conn) allTargets.push(conn.node);
          });
        }
        
        if (connections.error) {
          connections.error.flat().forEach(conn => {
            if (conn) allTargets.push(conn.node);
          });
        }
        
        if (connections.ai_tool) {
          connections.ai_tool.flat().forEach(conn => {
            if (conn) allTargets.push(conn.node);
          });
        }

        for (const target of allTargets) {
          if (!visited.has(target)) {
            if (hasCycleDFS(target)) return true;
          } else if (recursionStack.has(target)) {
            return true;
          }
        }
      }

      recursionStack.delete(nodeName);
      return false;
    };

    // Check from all nodes
    for (const node of workflow.nodes) {
      if (!visited.has(node.name)) {
        if (hasCycleDFS(node.name)) return true;
      }
    }

    return false;
  }

  /**
   * Validate expressions in the workflow
   */
  private validateExpressions(
    workflow: WorkflowJson,
    result: WorkflowValidationResult
  ): void {
    const nodeNames = workflow.nodes.map(n => n.name);

    for (const node of workflow.nodes) {
      if (node.disabled) continue;

      // Create expression context
      const context = {
        availableNodes: nodeNames.filter(n => n !== node.name),
        currentNodeName: node.name,
        hasInputData: this.nodeHasInput(node.name, workflow),
        isInLoop: false // Could be enhanced to detect loop nodes
      };

      // Validate expressions in parameters
      const exprValidation = ExpressionValidator.validateNodeExpressions(
        node.parameters,
        context
      );

      result.statistics.expressionsValidated += exprValidation.usedVariables.size;

      // Add expression errors and warnings
      exprValidation.errors.forEach(error => {
        result.errors.push({
          type: 'error',
          nodeId: node.id,
          nodeName: node.name,
          message: `Expression error: ${error}`
        });
      });

      exprValidation.warnings.forEach(warning => {
        result.warnings.push({
          type: 'warning',
          nodeId: node.id,
          nodeName: node.name,
          message: `Expression warning: ${warning}`
        });
      });
    }
  }

  /**
   * Check if a node has input connections
   */
  private nodeHasInput(nodeName: string, workflow: WorkflowJson): boolean {
    for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
      if (outputs.main) {
        for (const outputConnections of outputs.main) {
          if (outputConnections?.some(conn => conn.node === nodeName)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Check workflow patterns and best practices
   */
  private checkWorkflowPatterns(
    workflow: WorkflowJson,
    result: WorkflowValidationResult
  ): void {
    // Check for error handling
    const hasErrorHandling = Object.values(workflow.connections).some(
      outputs => outputs.error && outputs.error.length > 0
    );

    if (!hasErrorHandling && workflow.nodes.length > 3) {
      result.warnings.push({
        type: 'warning',
        message: 'Consider adding error handling to your workflow'
      });
    }

    // Check for very long linear workflows
    const linearChainLength = this.getLongestLinearChain(workflow);
    if (linearChainLength > 10) {
      result.warnings.push({
        type: 'warning',
        message: `Long linear chain detected (${linearChainLength} nodes). Consider breaking into sub-workflows.`
      });
    }

    // Check for missing credentials
    for (const node of workflow.nodes) {
      if (node.credentials && Object.keys(node.credentials).length > 0) {
        for (const [credType, credConfig] of Object.entries(node.credentials)) {
          if (!credConfig || (typeof credConfig === 'object' && !('id' in credConfig))) {
            result.warnings.push({
              type: 'warning',
              nodeId: node.id,
              nodeName: node.name,
              message: `Missing credentials configuration for ${credType}`
            });
          }
        }
      }
    }

    // Check for AI Agent workflows
    const aiAgentNodes = workflow.nodes.filter(n => 
      n.type.toLowerCase().includes('agent') || 
      n.type.includes('langchain.agent')
    );
    
    if (aiAgentNodes.length > 0) {
      // Check if AI agents have tools connected
      for (const agentNode of aiAgentNodes) {
        const connections = workflow.connections[agentNode.name];
        if (!connections?.ai_tool || connections.ai_tool.flat().filter(c => c).length === 0) {
          result.warnings.push({
            type: 'warning',
            nodeId: agentNode.id,
            nodeName: agentNode.name,
            message: 'AI Agent has no tools connected. Consider adding tools to enhance agent capabilities.'
          });
        }
      }
      
      // Check for community nodes used as tools
      const hasAIToolConnections = Object.values(workflow.connections).some(
        outputs => outputs.ai_tool && outputs.ai_tool.length > 0
      );
      
      if (hasAIToolConnections) {
        result.suggestions.push(
          'For community nodes used as AI tools, ensure N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true is set'
        );
      }
    }
  }

  /**
   * Get the longest linear chain in the workflow
   */
  private getLongestLinearChain(workflow: WorkflowJson): number {
    const memo = new Map<string, number>();
    const visiting = new Set<string>();

    const getChainLength = (nodeName: string): number => {
      // If we're already visiting this node, we have a cycle
      if (visiting.has(nodeName)) return 0;
      
      if (memo.has(nodeName)) return memo.get(nodeName)!;

      visiting.add(nodeName);

      let maxLength = 0;
      const connections = workflow.connections[nodeName];
      
      if (connections?.main) {
        for (const outputConnections of connections.main) {
          if (outputConnections) {
            for (const conn of outputConnections) {
              const length = getChainLength(conn.node);
              maxLength = Math.max(maxLength, length);
            }
          }
        }
      }

      visiting.delete(nodeName);
      const result = maxLength + 1;
      memo.set(nodeName, result);
      return result;
    };

    let maxChain = 0;
    for (const node of workflow.nodes) {
      if (!this.nodeHasInput(node.name, workflow)) {
        maxChain = Math.max(maxChain, getChainLength(node.name));
      }
    }

    return maxChain;
  }

  /**
   * Find similar node types for suggestions
   */
  private findSimilarNodeTypes(invalidType: string): string[] {
    // Since we don't have a method to list all nodes, we'll use a predefined list
    // of common node types that users might be looking for
    const suggestions: string[] = [];
    const nodeName = invalidType.includes('.') ? invalidType.split('.').pop()! : invalidType;
    
    const commonNodeMappings: Record<string, string[]> = {
      'webhook': ['nodes-base.webhook'],
      'httpRequest': ['nodes-base.httpRequest'],
      'http': ['nodes-base.httpRequest'],
      'set': ['nodes-base.set'],
      'code': ['nodes-base.code'],
      'manualTrigger': ['nodes-base.manualTrigger'],
      'manual': ['nodes-base.manualTrigger'],
      'scheduleTrigger': ['nodes-base.scheduleTrigger'],
      'schedule': ['nodes-base.scheduleTrigger'],
      'cron': ['nodes-base.scheduleTrigger'],
      'emailSend': ['nodes-base.emailSend'],
      'email': ['nodes-base.emailSend'],
      'slack': ['nodes-base.slack'],
      'discord': ['nodes-base.discord'],
      'postgres': ['nodes-base.postgres'],
      'mysql': ['nodes-base.mySql'],
      'mongodb': ['nodes-base.mongoDb'],
      'redis': ['nodes-base.redis'],
      'if': ['nodes-base.if'],
      'switch': ['nodes-base.switch'],
      'merge': ['nodes-base.merge'],
      'splitInBatches': ['nodes-base.splitInBatches'],
      'loop': ['nodes-base.splitInBatches'],
      'googleSheets': ['nodes-base.googleSheets'],
      'sheets': ['nodes-base.googleSheets'],
      'airtable': ['nodes-base.airtable'],
      'github': ['nodes-base.github'],
      'git': ['nodes-base.github'],
    };
    
    // Check for exact match
    const lowerNodeName = nodeName.toLowerCase();
    if (commonNodeMappings[lowerNodeName]) {
      suggestions.push(...commonNodeMappings[lowerNodeName]);
    }
    
    // Check for partial matches
    Object.entries(commonNodeMappings).forEach(([key, values]) => {
      if (key.includes(lowerNodeName) || lowerNodeName.includes(key)) {
        values.forEach(v => {
          if (!suggestions.includes(v)) {
            suggestions.push(v);
          }
        });
      }
    });
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Generate suggestions based on validation results
   */
  private generateSuggestions(
    workflow: WorkflowJson,
    result: WorkflowValidationResult
  ): void {
    // Suggest adding trigger if missing
    if (result.statistics.triggerNodes === 0) {
      result.suggestions.push(
        'Add a trigger node (e.g., Webhook, Schedule Trigger) to automate workflow execution'
      );
    }

    // Suggest proper connection structure for workflows with connection errors
    const hasConnectionErrors = result.errors.some(e => 
      e.message && (
        e.message.includes('connection') || 
        e.message.includes('Connection') ||
        e.message.includes('Multi-node workflow has no connections')
      )
    );
    
    if (hasConnectionErrors) {
      result.suggestions.push(
        'Example connection structure: connections: { "Manual Trigger": { "main": [[{ "node": "Set", "type": "main", "index": 0 }]] } }'
      );
      result.suggestions.push(
        'Remember: Use node NAMES (not IDs) in connections. The name is what you see in the UI, not the node type.'
      );
    }

    // Suggest error handling
    if (!Object.values(workflow.connections).some(o => o.error)) {
      result.suggestions.push(
        'Add error handling using the error output of nodes or an Error Trigger node'
      );
    }

    // Suggest optimization for large workflows
    if (workflow.nodes.length > 20) {
      result.suggestions.push(
        'Consider breaking this workflow into smaller sub-workflows for better maintainability'
      );
    }

    // Suggest using Code node for complex logic
    const complexExpressionNodes = workflow.nodes.filter(node => {
      const jsonString = JSON.stringify(node.parameters);
      const expressionCount = (jsonString.match(/\{\{/g) || []).length;
      return expressionCount > 5;
    });

    if (complexExpressionNodes.length > 0) {
      result.suggestions.push(
        'Consider using a Code node for complex data transformations instead of multiple expressions'
      );
    }

    // Suggest minimum workflow structure
    if (workflow.nodes.length === 1 && Object.keys(workflow.connections).length === 0) {
      result.suggestions.push(
        'A minimal workflow needs: 1) A trigger node (e.g., Manual Trigger), 2) An action node (e.g., Set, HTTP Request), 3) A connection between them'
      );
    }
  }
}