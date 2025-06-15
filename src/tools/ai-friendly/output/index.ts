/**
 * AI-Friendly Output Formats Module
 * 
 * These tools provide machine-readable and condensed output formats
 * that are optimized for AI model consumption and understanding.
 */

import { ToolDefinition, ToolCallResult } from '../../../types/index.js';
import { getEnvConfig } from '../../../config/environment.js';
import { EnhancedN8nApiClient } from '../../../api/enhanced-client.js';

/**
 * Get Structured Workflow Data Handler
 * Returns machine-readable workflow representations
 */
export class GetStructuredWorkflowDataHandler {
  async execute(args: { 
    workflow_id: string; 
    format?: 'minimal' | 'standard' | 'detailed';
    include_node_data?: boolean;
  }): Promise<ToolCallResult> {
    try {
      const { workflow_id, format = 'standard', include_node_data = false } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const workflow = await apiClient.getWorkflow(workflow_id);
      
      let structuredData: any = {};
      
      if (format === 'minimal') {
        structuredData = {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          structure: {
            node_count: workflow.nodes?.length || 0,
            has_trigger: workflow.nodes?.some((node: any) => 
              node.type?.includes('trigger') || node.type?.includes('webhook')
            ) || false,
            has_connections: Object.keys(workflow.connections || {}).length > 0,
            complexity_score: this.calculateComplexityScore(workflow)
          }
        };
      } else if (format === 'standard') {
        structuredData = {
          metadata: {
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            created: workflow.createdAt,
            updated: workflow.updatedAt,
            tags: workflow.tags || []
          },
          structure: {
            nodes: workflow.nodes?.map((node: any) => ({
              name: node.name,
              type: node.type,
              position: node.position,
              has_credentials: !!(node.credentials && Object.keys(node.credentials).length > 0)
            })) || [],
            connections: this.simplifyConnections(workflow.connections),
            flow_analysis: this.analyzeWorkflowFlow(workflow)
          },
          statistics: {
            node_count: workflow.nodes?.length || 0,
            connection_count: Object.keys(workflow.connections || {}).length,
            trigger_nodes: workflow.nodes?.filter((node: any) => 
              node.type?.includes('trigger') || node.type?.includes('webhook')
            ).length || 0,
            complexity_score: this.calculateComplexityScore(workflow)
          }
        };
      } else if (format === 'detailed') {
        structuredData = {
          metadata: {
            id: workflow.id,
            name: workflow.name,
            active: workflow.active,
            created: workflow.createdAt,
            updated: workflow.updatedAt,
            tags: workflow.tags || [],
            folder: workflow.folder?.name || null
          },
          nodes: workflow.nodes?.map((node: any) => ({
            id: node.id,
            name: node.name,
            type: node.type,
            type_version: node.typeVersion,
            position: node.position,
            parameters: include_node_data ? node.parameters : {},
            credentials: node.credentials ? Object.keys(node.credentials) : [],
            disabled: node.disabled || false
          })) || [],
          connections: workflow.connections || {},
          analysis: {
            flow_paths: this.analyzeFlowPaths(workflow),
            node_types: this.categorizeNodeTypes(workflow),
            potential_issues: this.identifyPotentialIssues(workflow),
            complexity_analysis: this.detailedComplexityAnalysis(workflow)
          }
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            workflow_data: structuredData,
            format_used: format,
            data_optimized_for: 'ai_consumption'
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error getting structured workflow data: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private calculateComplexityScore(workflow: any): number {
    const nodeCount = workflow.nodes?.length || 0;
    const connectionCount = Object.keys(workflow.connections || {}).length;
    const conditionalNodes = workflow.nodes?.filter((node: any) => 
      node.type?.includes('if') || node.type?.includes('switch')
    ).length || 0;
    
    // Simple complexity scoring algorithm
    return Math.min(100, (nodeCount * 2) + (connectionCount * 1.5) + (conditionalNodes * 5));
  }
  
  private simplifyConnections(connections: any): any {
    if (!connections) return {};
    
    const simplified: any = {};
    Object.entries(connections).forEach(([nodeId, nodeConnections]: [string, any]) => {
      simplified[nodeId] = Object.keys(nodeConnections).map(outputKey => ({
        output: outputKey,
        targets: nodeConnections[outputKey]?.map((conn: any) => ({
          node: conn.node,
          input: conn.type
        })) || []
      }));
    });
    
    return simplified;
  }
  
  private analyzeWorkflowFlow(workflow: any): any {
    const triggerNodes = workflow.nodes?.filter((node: any) => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    ) || [];
    
    return {
      entry_points: triggerNodes.length,
      has_parallel_branches: this.hasParallelBranches(workflow),
      has_loops: this.hasLoops(workflow),
      linear_flow: this.isLinearFlow(workflow)
    };
  }
  
  private analyzeFlowPaths(workflow: any): any[] {
    // Simplified flow path analysis
    const triggerNodes = workflow.nodes?.filter((node: any) => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    ) || [];
    
    return triggerNodes.map((trigger: any) => ({
      start_node: trigger.name,
      estimated_path_length: this.estimatePathLength(workflow, trigger.id),
      path_complexity: 'medium' // Simplified for now
    }));
  }
  
  private categorizeNodeTypes(workflow: any): any {
    const categories: any = {
      triggers: 0,
      actions: 0,
      conditions: 0,
      transformations: 0,
      integrations: 0
    };
    
    workflow.nodes?.forEach((node: any) => {
      const nodeType = node.type || '';
      if (nodeType.includes('trigger') || nodeType.includes('webhook')) {
        categories.triggers++;
      } else if (nodeType.includes('if') || nodeType.includes('switch')) {
        categories.conditions++;
      } else if (nodeType.includes('function') || nodeType.includes('set')) {
        categories.transformations++;
      } else if (nodeType.includes('http') || nodeType.includes('email')) {
        categories.integrations++;
      } else {
        categories.actions++;
      }
    });
    
    return categories;
  }
  
  private identifyPotentialIssues(workflow: any): string[] {
    const issues: string[] = [];
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      issues.push('No nodes in workflow');
    }
    
    const hasTrigger = workflow.nodes?.some((node: any) => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    if (!hasTrigger && workflow.active) {
      issues.push('Active workflow without trigger');
    }
    
    const hasConnections = workflow.connections && Object.keys(workflow.connections).length > 0;
    if (workflow.nodes?.length > 1 && !hasConnections) {
      issues.push('Multiple nodes without connections');
    }
    
    return issues;
  }
  
  private detailedComplexityAnalysis(workflow: any): any {
    return {
      node_complexity: this.calculateComplexityScore(workflow),
      branching_factor: this.calculateBranchingFactor(workflow),
      depth_estimate: this.estimateWorkflowDepth(workflow),
      maintainability_score: this.calculateMaintainabilityScore(workflow)
    };
  }
  
  private hasParallelBranches(workflow: any): boolean {
    // Simplified check for parallel branches
    if (!workflow.connections) return false;
    
    return Object.values(workflow.connections).some((nodeConnections: any) => 
      Object.values(nodeConnections).some((outputs: any) => 
        Array.isArray(outputs) && outputs.length > 1
      )
    );
  }
  
  private hasLoops(workflow: any): boolean {
    // Simplified loop detection - would need proper graph analysis for accuracy
    return false;
  }
  
  private isLinearFlow(workflow: any): boolean {
    if (!workflow.connections) return true;
    
    return !this.hasParallelBranches(workflow) && !this.hasLoops(workflow);
  }
  
  private estimatePathLength(workflow: any, startNodeId: string): number {
    // Simplified path length estimation
    return workflow.nodes?.length || 0;
  }
  
  private calculateBranchingFactor(workflow: any): number {
    if (!workflow.connections) return 0;
    
    const totalBranches = Object.values(workflow.connections).reduce((sum: number, nodeConnections: any) => {
      return sum + Object.values(nodeConnections).reduce((nodeSum: number, outputs: any) => {
        return nodeSum + (Array.isArray(outputs) ? outputs.length : 0);
      }, 0);
    }, 0);
    
    return workflow.nodes?.length > 0 ? totalBranches / workflow.nodes.length : 0;
  }
  
  private estimateWorkflowDepth(workflow: any): number {
    // Simplified depth estimation
    return Math.ceil(Math.sqrt(workflow.nodes?.length || 0));
  }
  
  private calculateMaintainabilityScore(workflow: any): number {
    const nodeCount = workflow.nodes?.length || 0;
    const hasDescriptiveNames = workflow.nodes?.filter((node: any) => 
      node.name && node.name.length > 5 && !node.name.includes('Node')
    ).length || 0;
    
    const nameScore = nodeCount > 0 ? (hasDescriptiveNames / nodeCount) * 100 : 0;
    const sizeScore = Math.max(0, 100 - (nodeCount * 2)); // Penalty for large workflows
    
    return (nameScore + sizeScore) / 2;
  }
}

/**
 * Export Workflow Schema Handler
 * JSON schema for programmatic understanding
 */
export class ExportWorkflowSchemaHandler {
  async execute(args: { 
    workflow_id?: string; 
    schema_type?: 'json-schema' | 'openapi' | 'n8n-native';
    include_examples?: boolean;
  }): Promise<ToolCallResult> {
    try {
      const { workflow_id, schema_type = 'json-schema', include_examples = false } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      if (workflow_id) {
        const workflow = await apiClient.getWorkflow(workflow_id);
        const schema = this.generateWorkflowSchema(workflow, schema_type, include_examples);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(schema, null, 2)
          }],
          isError: false
        };
      } else {
        // Generate general n8n workflow schema
        const generalSchema = this.generateGeneralWorkflowSchema(schema_type);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(generalSchema, null, 2)
          }],
          isError: false
        };
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error exporting workflow schema: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private generateWorkflowSchema(workflow: any, schemaType: string, includeExamples: boolean): any {
    if (schemaType === 'json-schema') {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        title: `${workflow.name} Workflow Schema`,
        properties: {
          id: { type: 'string', example: workflow.id },
          name: { type: 'string', example: workflow.name },
          active: { type: 'boolean', example: workflow.active },
          nodes: {
            type: 'array',
            items: this.generateNodeSchema(workflow.nodes, includeExamples)
          },
          connections: {
            type: 'object',
            additionalProperties: true
          }
        },
        required: ['id', 'name', 'nodes']
      };
    }
    
    return { error: 'Unsupported schema type' };
  }
  
  private generateNodeSchema(nodes: any[], includeExamples: boolean): any {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        type: { type: 'string' },
        position: {
          type: 'array',
          items: { type: 'number' },
          minItems: 2,
          maxItems: 2
        },
        parameters: { type: 'object' }
      },
      required: ['name', 'type']
    };
  }
  
  private generateGeneralWorkflowSchema(schemaType: string): any {
    return {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      title: 'n8n Workflow Schema',
      description: 'General schema for n8n workflow structure',
      properties: {
        id: { type: 'string', description: 'Unique workflow identifier' },
        name: { type: 'string', description: 'Human-readable workflow name' },
        active: { type: 'boolean', description: 'Whether the workflow is active' },
        nodes: {
          type: 'array',
          description: 'Array of workflow nodes',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' },
              position: { type: 'array', items: { type: 'number' } },
              parameters: { type: 'object' }
            }
          }
        },
        connections: {
          type: 'object',
          description: 'Node connection mappings'
        }
      }
    };
  }
}

/**
 * Simplify Workflow Output Handler
 * Condensed output formats optimized for AI consumption
 */
export class SimplifyWorkflowOutputHandler {
  async execute(args: { 
    workflow_data: any; 
    simplification_level?: 'high' | 'medium' | 'low';
    focus_areas?: string[];
  }): Promise<ToolCallResult> {
    try {
      const { workflow_data, simplification_level = 'medium', focus_areas = [] } = args;
      
      let simplified: any = {};
      
      if (simplification_level === 'high') {
        simplified = {
          summary: `${workflow_data.name} - ${workflow_data.nodes?.length || 0} nodes, ${workflow_data.active ? 'active' : 'inactive'}`,
          key_info: {
            id: workflow_data.id,
            node_count: workflow_data.nodes?.length || 0,
            has_trigger: workflow_data.nodes?.some((node: any) => 
              node.type?.includes('trigger') || node.type?.includes('webhook')
            ) || false,
            status: workflow_data.active ? 'active' : 'inactive'
          }
        };
      } else if (simplification_level === 'medium') {
        simplified = {
          workflow: {
            id: workflow_data.id,
            name: workflow_data.name,
            status: workflow_data.active ? 'active' : 'inactive',
            complexity: this.assessComplexity(workflow_data)
          },
          structure: {
            nodes: workflow_data.nodes?.length || 0,
            node_types: this.getUniqueNodeTypes(workflow_data),
            has_branching: this.hasBranching(workflow_data),
            estimated_runtime: this.estimateRuntime(workflow_data)
          }
        };
      } else {
        // Low simplification - keep most data but organize better
        simplified = {
          metadata: {
            id: workflow_data.id,
            name: workflow_data.name,
            active: workflow_data.active,
            last_updated: workflow_data.updatedAt
          },
          analysis: {
            node_count: workflow_data.nodes?.length || 0,
            node_types: this.categorizeNodes(workflow_data),
            flow_structure: this.analyzeFlowStructure(workflow_data),
            complexity_metrics: this.calculateComplexityMetrics(workflow_data)
          },
          quick_insights: this.generateQuickInsights(workflow_data)
        };
      }
      
      // Apply focus areas if specified
      if (focus_areas.length > 0) {
        simplified = this.applyFocusAreas(simplified, focus_areas);
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            simplified_workflow: simplified,
            simplification_level,
            focus_areas: focus_areas.length > 0 ? focus_areas : 'none',
            optimized_for: 'ai_processing'
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error simplifying workflow output: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private assessComplexity(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    if (nodeCount <= 5) return 'simple';
    if (nodeCount <= 15) return 'moderate';
    return 'complex';
  }
  
  private getUniqueNodeTypes(workflow: any): string[] {
    if (!workflow.nodes) return [];
    const types = new Set(workflow.nodes.map((node: any) => node.type as string));
    return Array.from(types) as string[];
  }
  
  private hasBranching(workflow: any): boolean {
    return workflow.nodes?.some((node: any) => 
      node.type?.includes('if') || node.type?.includes('switch')
    ) || false;
  }
  
  private estimateRuntime(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    const hasHttpRequests = workflow.nodes?.some((node: any) => 
      node.type?.includes('http')
    ) || false;
    
    if (nodeCount <= 3 && !hasHttpRequests) return 'fast (<1s)';
    if (nodeCount <= 10) return 'medium (1-5s)';
    return 'slow (>5s)';
  }
  
  private categorizeNodes(workflow: any): any {
    const categories = {
      triggers: 0,
      actions: 0,
      conditions: 0,
      integrations: 0
    };
    
    workflow.nodes?.forEach((node: any) => {
      const type = node.type || '';
      if (type.includes('trigger') || type.includes('webhook')) {
        categories.triggers++;
      } else if (type.includes('if') || type.includes('switch')) {
        categories.conditions++;
      } else if (type.includes('http') || type.includes('email')) {
        categories.integrations++;
      } else {
        categories.actions++;
      }
    });
    
    return categories;
  }
  
  private analyzeFlowStructure(workflow: any): any {
    return {
      type: this.determineFlowType(workflow),
      branching_points: this.countBranchingPoints(workflow),
      depth_estimate: Math.ceil(Math.sqrt(workflow.nodes?.length || 0))
    };
  }
  
  private calculateComplexityMetrics(workflow: any): any {
    const nodeCount = workflow.nodes?.length || 0;
    const connectionCount = Object.keys(workflow.connections || {}).length;
    
    return {
      size_score: Math.min(100, nodeCount * 5),
      connection_density: nodeCount > 0 ? (connectionCount / nodeCount).toFixed(2) : 0,
      maintainability: this.calculateMaintainability(workflow)
    };
  }
  
  private generateQuickInsights(workflow: any): string[] {
    const insights: string[] = [];
    
    const nodeCount = workflow.nodes?.length || 0;
    if (nodeCount > 20) {
      insights.push('Large workflow - consider breaking into smaller parts');
    }
    
    const hasTrigger = workflow.nodes?.some((node: any) => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    if (!hasTrigger) {
      insights.push('No trigger nodes - workflow must be manually executed');
    }
    
    const hasErrorHandling = workflow.nodes?.some((node: any) => 
      node.type?.includes('error') || node.continueOnFail
    );
    if (!hasErrorHandling) {
      insights.push('No error handling detected - consider adding error nodes');
    }
    
    return insights;
  }
  
  private applyFocusAreas(simplified: any, focusAreas: string[]): any {
    const focused: any = {};
    
    focusAreas.forEach(area => {
      if (simplified[area]) {
        focused[area] = simplified[area];
      }
    });
    
    return Object.keys(focused).length > 0 ? focused : simplified;
  }
  
  private determineFlowType(workflow: any): string {
    const hasBranching = this.hasBranching(workflow);
    const hasLoops = false; // Simplified for now
    
    if (hasLoops) return 'cyclic';
    if (hasBranching) return 'branching';
    return 'linear';
  }
  
  private countBranchingPoints(workflow: any): number {
    return workflow.nodes?.filter((node: any) => 
      node.type?.includes('if') || node.type?.includes('switch')
    ).length || 0;
  }
  
  private calculateMaintainability(workflow: any): number {
    const nodeCount = workflow.nodes?.length || 0;
    const descriptiveNames = workflow.nodes?.filter((node: any) => 
      node.name && node.name.length > 5
    ).length || 0;
    
    return nodeCount > 0 ? Math.round((descriptiveNames / nodeCount) * 100) : 100;
  }
}

/**
 * Get Workflow Essence Handler
 * Extract the core purpose and function of workflows
 */
export class GetWorkflowEssenceHandler {
  async execute(args: { 
    workflow_id: string; 
    include_recommendations?: boolean;
    essence_format?: 'summary' | 'technical' | 'business';
  }): Promise<ToolCallResult> {
    try {
      const { workflow_id, include_recommendations = false, essence_format = 'summary' } = args;
      
      const envConfig = getEnvConfig();
      const apiClient = new EnhancedN8nApiClient(envConfig);
      
      const workflow = await apiClient.getWorkflow(workflow_id);
      
      const essence = this.extractWorkflowEssence(workflow, essence_format);
      
      if (include_recommendations) {
        essence.recommendations = this.generateRecommendations(workflow);
      }
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            workflow_essence: essence,
            format: essence_format,
            extracted_from: workflow_id
          }, null, 2)
        }],
        isError: false
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error extracting workflow essence: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
  
  private extractWorkflowEssence(workflow: any, format: string): any {
    const baseEssence = {
      purpose: this.determinePurpose(workflow),
      trigger_method: this.getTriggerMethod(workflow),
      main_actions: this.getMainActions(workflow),
      output_type: this.determineOutputType(workflow),
      complexity_level: this.assessComplexity(workflow)
    };
    
    if (format === 'technical') {
      return {
        ...baseEssence,
        technical_details: {
          node_types_used: this.getUniqueNodeTypes(workflow),
          integration_points: this.getIntegrationPoints(workflow),
          data_flow: this.analyzeDataFlow(workflow),
          error_handling: this.hasErrorHandling(workflow)
        }
      };
    } else if (format === 'business') {
      return {
        ...baseEssence,
        business_value: {
          automation_type: this.classifyAutomationType(workflow),
          business_process: this.identifyBusinessProcess(workflow),
          efficiency_impact: this.assessEfficiencyImpact(workflow),
          stakeholders: this.identifyStakeholders(workflow)
        }
      };
    }
    
    // Summary format
    return {
      one_line_summary: this.generateOneLineSummary(workflow),
      core_function: baseEssence.purpose,
      how_it_works: `${baseEssence.trigger_method} → ${baseEssence.main_actions.join(' → ')} → ${baseEssence.output_type}`,
      complexity: baseEssence.complexity_level
    };
  }
  
  private determinePurpose(workflow: any): string {
    const nodeTypes = workflow.nodes?.map((node: any) => node.type) || [];
    
    if (nodeTypes.some((type: string) => type.includes('email'))) {
      return 'Communication automation';
    } else if (nodeTypes.some((type: string) => type.includes('database') || type.includes('sql'))) {
      return 'Data processing';
    } else if (nodeTypes.some((type: string) => type.includes('http'))) {
      return 'API integration';
    } else if (nodeTypes.some((type: string) => type.includes('file'))) {
      return 'File processing';
    }
    
    return 'General automation';
  }
  
  private getTriggerMethod(workflow: any): string {
    const triggerNode = workflow.nodes?.find((node: any) => 
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    
    if (!triggerNode) return 'Manual execution';
    if (triggerNode.type.includes('webhook')) return 'HTTP webhook';
    if (triggerNode.type.includes('cron')) return 'Scheduled';
    if (triggerNode.type.includes('email')) return 'Email trigger';
    
    return 'Event-based';
  }
  
  private getMainActions(workflow: any): string[] {
    const actions: string[] = [];
    
    workflow.nodes?.forEach((node: any) => {
      const type = node.type || '';
      if (type.includes('http') && !type.includes('trigger')) {
        actions.push('API call');
      } else if (type.includes('email')) {
        actions.push('Send email');
      } else if (type.includes('function')) {
        actions.push('Transform data');
      } else if (type.includes('if')) {
        actions.push('Conditional logic');
      } else if (type.includes('set')) {
        actions.push('Set values');
      }
    });
    
    return [...new Set(actions)]; // Remove duplicates
  }
  
  private determineOutputType(workflow: any): string {
    const lastNodes = this.findEndNodes(workflow);
    
    if (lastNodes.some((node: any) => node.type?.includes('email'))) {
      return 'Email notification';
    } else if (lastNodes.some((node: any) => node.type?.includes('http'))) {
      return 'API response';
    } else if (lastNodes.some((node: any) => node.type?.includes('database'))) {
      return 'Database update';
    }
    
    return 'Data output';
  }
  
  private findEndNodes(workflow: any): any[] {
    if (!workflow.nodes || !workflow.connections) return [];
    
    const connectedNodes = new Set();
    Object.values(workflow.connections).forEach((nodeConnections: any) => {
      Object.values(nodeConnections).forEach((outputs: any) => {
        if (Array.isArray(outputs)) {
          outputs.forEach((connection: any) => {
            connectedNodes.add(connection.node);
          });
        }
      });
    });
    
    return workflow.nodes.filter((node: any) => !connectedNodes.has(node.id));
  }
  
  private assessComplexity(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    if (nodeCount <= 5) return 'Simple';
    if (nodeCount <= 15) return 'Moderate';
    return 'Complex';
  }
  
  private getUniqueNodeTypes(workflow: any): string[] {
    if (!workflow.nodes) return [];
    const types = new Set(workflow.nodes.map((node: any) => node.type as string));
    return Array.from(types) as string[];
  }
  
  private getIntegrationPoints(workflow: any): string[] {
    const integrations: string[] = [];
    
    workflow.nodes?.forEach((node: any) => {
      if (node.type?.includes('http')) {
        integrations.push('HTTP API');
      } else if (node.type?.includes('email')) {
        integrations.push('Email service');
      } else if (node.type?.includes('database')) {
        integrations.push('Database');
      }
    });
    
    return [...new Set(integrations)]; // Remove duplicates
  }
  
  private analyzeDataFlow(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    const hasTransformations = workflow.nodes?.some((node: any) =>
      node.type?.includes('function') || node.type?.includes('set')
    ) || false;
    
    if (hasTransformations) return 'Complex data transformation';
    if (nodeCount > 10) return 'Multi-step processing';
    return 'Simple data flow';
  }
  
  private hasErrorHandling(workflow: any): boolean {
    return workflow.nodes?.some((node: any) =>
      node.type?.includes('error') || node.continueOnFail
    ) || false;
  }
  
  private classifyAutomationType(workflow: any): string {
    const nodeTypes = workflow.nodes?.map((node: any) => node.type) || [];
    
    if (nodeTypes.some((type: string) => type.includes('email'))) {
      return 'Communication automation';
    } else if (nodeTypes.some((type: string) => type.includes('database'))) {
      return 'Data management';
    } else if (nodeTypes.some((type: string) => type.includes('http'))) {
      return 'Integration automation';
    }
    
    return 'Process automation';
  }
  
  private identifyBusinessProcess(workflow: any): string {
    const name = workflow.name?.toLowerCase() || '';
    
    if (name.includes('order') || name.includes('invoice')) {
      return 'Order processing';
    } else if (name.includes('customer') || name.includes('support')) {
      return 'Customer service';
    } else if (name.includes('report') || name.includes('analytics')) {
      return 'Reporting and analytics';
    }
    
    return 'General business process';
  }
  
  private assessEfficiencyImpact(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    const hasScheduledTrigger = workflow.nodes?.some((node: any) =>
      node.type?.includes('cron') || node.type?.includes('schedule')
    ) || false;
    
    if (hasScheduledTrigger && nodeCount > 5) return 'High efficiency gain';
    if (nodeCount > 3) return 'Medium efficiency gain';
    return 'Low efficiency gain';
  }
  
  private identifyStakeholders(workflow: any): string[] {
    const stakeholders: string[] = [];
    const nodeTypes = workflow.nodes?.map((node: any) => node.type) || [];
    
    if (nodeTypes.some((type: string) => type.includes('email'))) {
      stakeholders.push('Email recipients');
    }
    if (nodeTypes.some((type: string) => type.includes('webhook'))) {
      stakeholders.push('External systems');
    }
    if (nodeTypes.some((type: string) => type.includes('database'))) {
      stakeholders.push('Data consumers');
    }
    
    return stakeholders.length > 0 ? stakeholders : ['Internal team'];
  }
  
  private generateOneLineSummary(workflow: any): string {
    const triggerMethod = this.getTriggerMethod(workflow);
    const purpose = this.determinePurpose(workflow);
    const nodeCount = workflow.nodes?.length || 0;
    
    return `${triggerMethod} workflow for ${purpose} with ${nodeCount} steps`;
  }
  
  private generateRecommendations(workflow: any): string[] {
    const recommendations: string[] = [];
    
    const nodeCount = workflow.nodes?.length || 0;
    if (nodeCount > 20) {
      recommendations.push('Consider breaking this workflow into smaller, more manageable workflows');
    }
    
    const hasErrorHandling = this.hasErrorHandling(workflow);
    if (!hasErrorHandling) {
      recommendations.push('Add error handling nodes to improve reliability');
    }
    
    const hasTrigger = workflow.nodes?.some((node: any) =>
      node.type?.includes('trigger') || node.type?.includes('webhook')
    );
    if (!hasTrigger) {
      recommendations.push('Add a trigger node to enable automatic execution');
    }
    
    const hasDescriptiveNames = workflow.nodes?.every((node: any) =>
      node.name && node.name.length > 5 && !node.name.includes('Node')
    );
    if (!hasDescriptiveNames) {
      recommendations.push('Use more descriptive node names for better maintainability');
    }
    
    return recommendations;
  }
}

// Tool definitions
export function getGetStructuredWorkflowDataToolDefinition(): ToolDefinition {
  return {
    name: 'get_structured_workflow_data',
    description: 'Get machine-readable workflow representations optimized for AI consumption',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'ID of the workflow to structure'
        },
        format: {
          type: 'string',
          enum: ['minimal', 'standard', 'detailed'],
          description: 'Level of detail in the structured output',
          default: 'standard'
        },
        include_node_data: {
          type: 'boolean',
          description: 'Include detailed node parameter data',
          default: false
        }
      },
      required: ['workflow_id']
    }
  };
}

export function getExportWorkflowSchemaToolDefinition(): ToolDefinition {
  return {
    name: 'export_workflow_schema',
    description: 'Export JSON schema for programmatic understanding of workflow structure',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'Specific workflow ID to generate schema for (optional)'
        },
        schema_type: {
          type: 'string',
          enum: ['json-schema', 'openapi', 'n8n-native'],
          description: 'Type of schema to generate',
          default: 'json-schema'
        },
        include_examples: {
          type: 'boolean',
          description: 'Include example values in schema',
          default: false
        }
      },
      required: []
    }
  };
}

export function getSimplifyWorkflowOutputToolDefinition(): ToolDefinition {
  return {
    name: 'simplify_workflow_output',
    description: 'Create condensed output formats optimized for AI model consumption',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_data: {
          type: 'object',
          description: 'Workflow data object to simplify'
        },
        simplification_level: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Level of simplification to apply',
          default: 'medium'
        },
        focus_areas: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific areas to focus on during simplification'
        }
      },
      required: ['workflow_data']
    }
  };
}

export function getGetWorkflowEssenceToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_essence',
    description: 'Extract the core purpose and function of workflows in digestible format',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: {
          type: 'string',
          description: 'ID of the workflow to analyze'
        },
        include_recommendations: {
          type: 'boolean',
          description: 'Include improvement recommendations',
          default: false
        },
        essence_format: {
          type: 'string',
          enum: ['summary', 'technical', 'business'],
          description: 'Format perspective for essence extraction',
          default: 'summary'
        }
      },
      required: ['workflow_id']
    }
  };
}