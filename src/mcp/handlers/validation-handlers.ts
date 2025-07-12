import { NodeRepository } from '../../database/node-repository';
import { ConfigValidator } from '../../services/config-validator';
import { EnhancedConfigValidator, ValidationMode, ValidationProfile } from '../../services/enhanced-config-validator';
import { WorkflowValidator } from '../../services/workflow-validator';
import { SimpleCache } from '../../utils/simple-cache';
import { logger } from '../../utils/logger';

export class ValidationHandlers {
  constructor(
    private repository: NodeRepository,
    private cache: SimpleCache
  ) {}

  async validateNodeConfig(
    nodeType: string, 
    config: any, 
    mode: ValidationMode = 'operation', 
    profile: ValidationProfile = 'ai-friendly'
  ): Promise<any> {
    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }
    const validator = new EnhancedConfigValidator(this.repository);
    return validator.validateConfig(nodeType, config, nodeInfo.properties || [], mode, profile);
  }

  async validateNodeMinimal(nodeType: string, config: any): Promise<any> {
    const nodeInfo = await this.repository.getNodeInfo(nodeType);
    if (!nodeInfo) {
      throw new Error(`Node type ${nodeType} not found`);
    }
    const validator = new ConfigValidator(this.repository);
    return validator.validateMinimal(nodeType, config, nodeInfo.properties || []);
  }

  async validateWorkflow(workflow: any, options: any = {}): Promise<any> {
    const validator = new WorkflowValidator(this.repository);
    return validator.validateWorkflow(workflow, options);
  }

  async validateWorkflowConnections(workflow: any): Promise<any> {
    const validator = new WorkflowValidator(this.repository);
    return validator.validateConnections(workflow);
  }

  async validateWorkflowExpressions(workflow: any): Promise<any> {
    const validator = new WorkflowValidator(this.repository);
    return validator.validateExpressions(workflow);
  }

  async validateWorkflowStructure(workflow: any): Promise<any> {
    const validator = new WorkflowValidator(this.repository);
    
    const errors = [];
    const warnings = [];
    
    // Basic structure validation
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      errors.push('Workflow must contain a nodes array');
    }
    
    if (!workflow.connections || typeof workflow.connections !== 'object') {
      errors.push('Workflow must contain a connections object');
    }
    
    // Node validation
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (!node.type) {
          errors.push(`Node ${node.name || 'unknown'} is missing type`);
        }
        
        if (!node.name) {
          errors.push(`Node with type ${node.type || 'unknown'} is missing name`);
        }
        
        if (!node.parameters) {
          warnings.push(`Node ${node.name} has no parameters`);
        }
      }
    }
    
    // Connection validation
    if (workflow.connections && workflow.nodes) {
      const nodeNames = new Set(workflow.nodes.map((n: any) => n.name));
      
      for (const [sourceName, connections] of Object.entries(workflow.connections)) {
        if (!nodeNames.has(sourceName)) {
          errors.push(`Connection source '${sourceName}' not found in nodes`);
        }
        
        if (connections && typeof connections === 'object') {
          for (const [outputIndex, targets] of Object.entries(connections)) {
            if (Array.isArray(targets)) {
              for (const target of targets) {
                if (target.node && !nodeNames.has(target.node)) {
                  errors.push(`Connection target '${target.node}' not found in nodes`);
                }
              }
            }
          }
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        nodeCount: workflow.nodes?.length || 0,
        connectionCount: Object.keys(workflow.connections || {}).length,
        errorCount: errors.length,
        warningCount: warnings.length
      }
    };
  }

  async validateNodeTypes(workflow: any): Promise<any> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      return {
        valid: false,
        errors: ['Workflow must contain a nodes array'],
        warnings: []
      };
    }
    
    for (const node of workflow.nodes) {
      if (!node.type) {
        errors.push(`Node ${node.name || 'unknown'} is missing type`);
        continue;
      }
      
      try {
        const nodeInfo = await this.repository.getNodeInfo(node.type);
        if (!nodeInfo) {
          errors.push(`Node type '${node.type}' not found in database`);
        }
      } catch (error) {
        errors.push(`Error validating node type '${node.type}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalNodes: workflow.nodes.length,
        validNodeTypes: workflow.nodes.length - errors.length,
        invalidNodeTypes: errors.length
      }
    };
  }
}