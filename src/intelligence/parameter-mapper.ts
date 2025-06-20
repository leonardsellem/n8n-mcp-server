/**
 * Universal Parameter Mapper - Phase 2 AI Agent Workflow Tools
 * 
 * This module provides intelligent parameter mapping between n8n nodes,
 * with universal compatibility patterns that work across all integrations
 * and AI agent platforms.
 */

import { universalNodeCatalog } from '../discovery/live-node-catalog.js';
import { dualNodeArchitecture } from '../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../discovery/dynamic-discovery.js';

/**
 * Universal mapping result
 */
export interface UniversalMappingResult {
  success: boolean;
  mappings: Array<{
    source_node: string;
    target_node: string;
    parameter_mappings: Array<{
      source_parameter: string;
      target_parameter: string;
      transformation: string;
      confidence: number;
      data_type: string;
      validation_rules: string[];
    }>;
    data_transformations: Array<{
      transformation_type: string;
      expression: string;
      description: string;
    }>;
    compatibility_score: number;
  }>;
  universal_patterns: {
    common_mappings: Array<{
      pattern: string;
      description: string;
      usage_frequency: number;
    }>;
    data_formats: string[];
    transformation_templates: Array<{
      name: string;
      template: string;
      use_cases: string[];
    }>;
  };
  optimization_suggestions: Array<{
    type: string;
    description: string;
    implementation: string;
    benefit: string;
  }>;
}

/**
 * Data transformation specification
 */
export interface DataTransformation {
  source_field: string;
  target_field: string;
  transformation_type: 'direct' | 'format' | 'calculate' | 'lookup' | 'custom';
  expression?: string;
  validation?: string;
  default_value?: any;
  required: boolean;
}

/**
 * Universal Parameter Mapper Class
 */
export class UniversalParameterMapper {
  
  /**
   * Map parameters between nodes with intelligent analysis
   */
  async mapParameters(
    sourceNode: any,
    targetNode: any,
    existingMappings: any[] = [],
    options: {
      includeTransformations?: boolean;
      optimizeForPerformance?: boolean;
      universalCompatibility?: boolean;
    } = {}
  ): Promise<UniversalMappingResult> {
    try {
      console.error(`[UniversalParameterMapper] Mapping parameters from ${sourceNode.name} to ${targetNode.name}`);
      
      const {
        includeTransformations = true,
        optimizeForPerformance = true,
        universalCompatibility = true
      } = options;

      // Phase 1: Find universal mappings using Enhanced Discovery
      const universalMappings = await this.findUniversalMappings(sourceNode, targetNode);
      
      // Phase 2: Apply universal defaults and optimizations
      const optimizedMappings = await this.applyUniversalDefaults(
        sourceNode,
        targetNode,
        universalMappings,
        existingMappings
      );
      
      // Phase 3: Add data transformations if requested
      let dataTransformations: any[] = [];
      if (includeTransformations) {
        dataTransformations = await this.addDataTransformations(
          sourceNode,
          targetNode,
          optimizedMappings
        );
      }
      
      // Phase 4: Calculate compatibility score
      const compatibilityScore = await this.calculateCompatibilityScore(
        sourceNode,
        targetNode,
        optimizedMappings
      );
      
      // Phase 5: Generate universal patterns and suggestions
      const universalPatterns = await this.generateUniversalPatterns(sourceNode, targetNode);
      const optimizationSuggestions = await this.generateOptimizationSuggestions(
        sourceNode,
        targetNode,
        optimizedMappings,
        { optimizeForPerformance, universalCompatibility }
      );
      
      const result: UniversalMappingResult = {
        success: true,
        mappings: [{
          source_node: sourceNode.name,
          target_node: targetNode.name,
          parameter_mappings: optimizedMappings,
          data_transformations: dataTransformations,
          compatibility_score: compatibilityScore
        }],
        universal_patterns: universalPatterns,
        optimization_suggestions: optimizationSuggestions
      };
      
      console.error(`[UniversalParameterMapper] Generated ${optimizedMappings.length} parameter mappings with ${compatibilityScore}% compatibility`);
      return result;
    } catch (error) {
      console.error(`[UniversalParameterMapper] Parameter mapping failed:`, error);
      return {
        success: false,
        mappings: [],
        universal_patterns: {
          common_mappings: [],
          data_formats: [],
          transformation_templates: []
        },
        optimization_suggestions: []
      };
    }
  }
  
  /**
   * Find universal mappings using common data patterns
   */
  async findUniversalMappings(sourceNode: any, targetNode: any): Promise<any[]> {
    try {
      const mappings: any[] = [];
      
      // Get node information from Universal Node Catalog
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      const sourceNodeInfo = allNodes.find(n => n.name === sourceNode.type);
      const targetNodeInfo = allNodes.find(n => n.name === targetNode.type);
      
      if (!sourceNodeInfo || !targetNodeInfo) {
        console.error(`[UniversalParameterMapper] Node information not found for mapping`);
        return this.generateBasicMappings(sourceNode, targetNode);
      }
      
      // Universal data field mappings
      const universalMappings = [
        // Common data fields
        { source: 'id', target: 'id', type: 'string', confidence: 0.95 },
        { source: 'name', target: 'name', type: 'string', confidence: 0.9 },
        { source: 'email', target: 'email', type: 'string', confidence: 0.95 },
        { source: 'data', target: 'data', type: 'object', confidence: 0.85 },
        { source: 'json', target: 'json', type: 'object', confidence: 0.85 },
        { source: 'body', target: 'body', type: 'string', confidence: 0.8 },
        { source: 'message', target: 'message', type: 'string', confidence: 0.8 },
        { source: 'text', target: 'text', type: 'string', confidence: 0.8 },
        { source: 'title', target: 'subject', type: 'string', confidence: 0.7 },
        { source: 'content', target: 'body', type: 'string', confidence: 0.7 },
        
        // HTTP-specific mappings
        { source: 'url', target: 'endpoint', type: 'string', confidence: 0.9 },
        { source: 'method', target: 'httpMethod', type: 'string', confidence: 0.9 },
        { source: 'headers', target: 'headers', type: 'object', confidence: 0.9 },
        { source: 'query', target: 'qs', type: 'object', confidence: 0.8 },
        
        // Email-specific mappings
        { source: 'to', target: 'toEmail', type: 'string', confidence: 0.95 },
        { source: 'from', target: 'fromEmail', type: 'string', confidence: 0.95 },
        { source: 'subject', target: 'subject', type: 'string', confidence: 0.95 },
        
        // Database-specific mappings
        { source: 'query', target: 'operation', type: 'string', confidence: 0.8 },
        { source: 'table', target: 'collection', type: 'string', confidence: 0.8 },
        { source: 'where', target: 'filter', type: 'object', confidence: 0.7 }
      ];
      
      // Apply universal mappings based on node types
      for (const mapping of universalMappings) {
        if (this.hasParameter(sourceNodeInfo, mapping.source) && 
            this.hasParameter(targetNodeInfo, mapping.target)) {
          mappings.push({
            source_parameter: mapping.source,
            target_parameter: mapping.target,
            transformation: 'direct',
            confidence: mapping.confidence,
            data_type: mapping.type,
            validation_rules: this.generateValidationRules(mapping.type)
          });
        }
      }
      
      // Add node-specific intelligent mappings
      const intelligentMappings = await this.generateIntelligentMappings(
        sourceNodeInfo,
        targetNodeInfo
      );
      mappings.push(...intelligentMappings);
      
      console.error(`[UniversalParameterMapper] Found ${mappings.length} universal mappings`);
      return mappings.slice(0, 15); // Limit to top 15 mappings
    } catch (error) {
      console.error(`[UniversalParameterMapper] Universal mapping discovery failed:`, error);
      return this.generateBasicMappings(sourceNode, targetNode);
    }
  }
  
  /**
   * Apply universal defaults for intelligent parameter value suggestions
   */
  async applyUniversalDefaults(
    sourceNode: any,
    targetNode: any,
    mappings: any[],
    existingMappings: any[]
  ): Promise<any[]> {
    try {
      const optimizedMappings = [...mappings];
      
      // Use Dual Architecture for AI-optimized parameter suggestions
      const aiOptimizedParams = await dualNodeArchitecture.getAIOptimizedParameters(targetNode.type);
      console.error(`[UniversalParameterMapper] Found ${aiOptimizedParams.length} AI-optimized parameters`);
      
      // Apply AI defaults to mappings
      for (const mapping of optimizedMappings) {
        const aiParam = aiOptimizedParams.find(p => p.name === mapping.target_parameter);
        if (aiParam && aiParam.aiDefault !== undefined) {
          mapping.ai_default = aiParam.aiDefault;
          mapping.ai_description = aiParam.aiDescription;
          mapping.confidence = Math.min(1.0, mapping.confidence + 0.1); // Boost confidence
        }
      }
      
      // Add universal default transformations
      for (const mapping of optimizedMappings) {
        if (!mapping.transformation || mapping.transformation === 'direct') {
          mapping.transformation = this.selectOptimalTransformation(
            mapping.source_parameter,
            mapping.target_parameter,
            mapping.data_type
          );
        }
      }
      
      // Merge with existing mappings (avoid duplicates)
      const existingTargets = new Set(existingMappings.map(m => m.target_parameter));
      const newMappings = optimizedMappings.filter(m => !existingTargets.has(m.target_parameter));
      
      return [...existingMappings, ...newMappings];
    } catch (error) {
      console.error(`[UniversalParameterMapper] Default application failed:`, error);
      return mappings;
    }
  }
  
  /**
   * Add data transformation capabilities
   */
  async addDataTransformations(
    sourceNode: any,
    targetNode: any,
    mappings: any[]
  ): Promise<any[]> {
    try {
      const transformations: any[] = [];
      
      for (const mapping of mappings) {
        const transformationType = this.determineTransformationType(
          mapping.source_parameter,
          mapping.target_parameter,
          mapping.data_type
        );
        
        if (transformationType !== 'direct') {
          const transformation = {
            transformation_type: transformationType,
            expression: this.generateTransformationExpression(
              mapping.source_parameter,
              mapping.target_parameter,
              transformationType,
              mapping.data_type
            ),
            description: this.generateTransformationDescription(
              mapping.source_parameter,
              mapping.target_parameter,
              transformationType
            )
          };
          
          transformations.push(transformation);
        }
      }
      
      // Add universal transformations for common patterns
      const universalTransformations = [
        {
          transformation_type: 'timestamp_normalization',
          expression: '={{ new Date($json.timestamp || Date.now()).toISOString() }}',
          description: 'Normalize timestamp to ISO format'
        },
        {
          transformation_type: 'email_validation',
          expression: '={{ $json.email && $json.email.includes("@") ? $json.email : null }}',
          description: 'Validate and clean email addresses'
        },
        {
          transformation_type: 'json_stringify',
          expression: '={{ typeof $json.data === "object" ? JSON.stringify($json.data) : $json.data }}',
          description: 'Convert objects to JSON strings when needed'
        },
        {
          transformation_type: 'url_validation',
          expression: '={{ $json.url && ($json.url.startsWith("http://") || $json.url.startsWith("https://")) ? $json.url : "https://" + $json.url }}',
          description: 'Ensure URLs have proper protocol'
        }
      ];
      
      transformations.push(...universalTransformations.slice(0, 2)); // Add top 2 universal transformations
      
      console.error(`[UniversalParameterMapper] Generated ${transformations.length} data transformations`);
      return transformations;
    } catch (error) {
      console.error(`[UniversalParameterMapper] Data transformation generation failed:`, error);
      return [];
    }
  }
  
  /**
   * Calculate compatibility score between nodes
   */
  private async calculateCompatibilityScore(
    sourceNode: any,
    targetNode: any,
    mappings: any[]
  ): Promise<number> {
    try {
      let score = 50; // Base score
      
      // Boost score based on number of successful mappings
      score += Math.min(30, mappings.length * 3);
      
      // Boost score based on mapping confidence
      const avgConfidence = mappings.reduce((sum, m) => sum + m.confidence, 0) / mappings.length;
      score += avgConfidence * 20;
      
      // Node type compatibility bonus
      if (this.areNodesCompatible(sourceNode.type, targetNode.type)) {
        score += 15;
      }
      
      // AI optimization bonus
      const aiMappings = mappings.filter(m => m.ai_default !== undefined);
      if (aiMappings.length > 0) {
        score += Math.min(10, aiMappings.length * 2);
      }
      
      return Math.min(100, Math.round(score));
    } catch (error) {
      console.error(`[UniversalParameterMapper] Compatibility score calculation failed:`, error);
      return 60; // Default score
    }
  }
  
  /**
   * Generate universal patterns for reuse
   */
  private async generateUniversalPatterns(sourceNode: any, targetNode: any): Promise<any> {
    const commonMappings = [
      {
        pattern: 'webhook_to_http',
        description: 'Map webhook data to HTTP request parameters',
        usage_frequency: 85
      },
      {
        pattern: 'http_to_email',
        description: 'Transform HTTP response data for email notifications',
        usage_frequency: 70
      },
      {
        pattern: 'data_to_database',
        description: 'Map JSON data to database fields',
        usage_frequency: 65
      },
      {
        pattern: 'api_response_transform',
        description: 'Transform API responses for downstream processing',
        usage_frequency: 80
      }
    ];
    
    const dataFormats = ['json', 'xml', 'csv', 'text', 'binary', 'form-data'];
    
    const transformationTemplates = [
      {
        name: 'Email Notification Template',
        template: '={{ "Subject: " + $json.title + "\\nMessage: " + $json.content }}',
        use_cases: ['webhook to email', 'api to notification', 'data processing']
      },
      {
        name: 'HTTP Request Builder',
        template: '={{ { "url": $json.endpoint, "method": "POST", "body": $json.data } }}',
        use_cases: ['webhook to api', 'data forwarding', 'integration workflows']
      },
      {
        name: 'Database Record Mapper',
        template: '={{ { "id": $json.id, "data": JSON.stringify($json), "created_at": new Date().toISOString() } }}',
        use_cases: ['api to database', 'data storage', 'audit logging']
      }
    ];
    
    return {
      common_mappings: commonMappings,
      data_formats: dataFormats,
      transformation_templates: transformationTemplates
    };
  }
  
  /**
   * Generate optimization suggestions
   */
  private async generateOptimizationSuggestions(
    sourceNode: any,
    targetNode: any,
    mappings: any[],
    options: { optimizeForPerformance: boolean; universalCompatibility: boolean }
  ): Promise<any[]> {
    const suggestions: any[] = [];
    
    if (options.optimizeForPerformance) {
      suggestions.push({
        type: 'performance',
        description: 'Cache transformation results for repeated data patterns',
        implementation: 'Add caching logic to transformation expressions',
        benefit: 'Reduce processing time by 30-50% for repeated workflows'
      });
      
      suggestions.push({
        type: 'performance',
        description: 'Batch parameter transformations',
        implementation: 'Group similar transformations into single operations',
        benefit: 'Improve memory usage and execution speed'
      });
    }
    
    if (options.universalCompatibility) {
      suggestions.push({
        type: 'compatibility',
        description: 'Add universal data validation',
        implementation: 'Include data type and format validation in all mappings',
        benefit: 'Ensure workflow compatibility across different AI agent platforms'
      });
      
      suggestions.push({
        type: 'compatibility',
        description: 'Implement fallback mappings',
        implementation: 'Provide alternative parameter mappings for edge cases',
        benefit: 'Increase workflow reliability and reduce failure rates'
      });
    }
    
    // Add mapping-specific suggestions
    const lowConfidenceMappings = mappings.filter(m => m.confidence < 0.7);
    if (lowConfidenceMappings.length > 0) {
      suggestions.push({
        type: 'reliability',
        description: `Review ${lowConfidenceMappings.length} low-confidence mappings`,
        implementation: 'Add manual validation or alternative mapping strategies',
        benefit: 'Improve overall mapping reliability and reduce errors'
      });
    }
    
    return suggestions;
  }
  
  // Helper methods
  
  private generateBasicMappings(sourceNode: any, targetNode: any): any[] {
    return [
      {
        source_parameter: 'data',
        target_parameter: 'data',
        transformation: 'direct',
        confidence: 0.6,
        data_type: 'object',
        validation_rules: ['required']
      }
    ];
  }
  
  private hasParameter(nodeInfo: any, parameterName: string): boolean {
    if (!nodeInfo || !nodeInfo.properties) return false;
    return nodeInfo.properties.some((prop: any) => 
      prop.name === parameterName || prop.displayName?.toLowerCase().includes(parameterName.toLowerCase())
    );
  }
  
  private generateValidationRules(dataType: string): string[] {
    const rules: Record<string, string[]> = {
      'string': ['min_length:1', 'max_length:1000'],
      'object': ['valid_json'],
      'number': ['min:0'],
      'boolean': ['valid_boolean'],
      'array': ['min_items:0']
    };
    return rules[dataType] || ['required'];
  }
  
  private async generateIntelligentMappings(sourceNodeInfo: any, targetNodeInfo: any): Promise<any[]> {
    const mappings: any[] = [];
    
    // Use node categories to determine likely mappings
    if (sourceNodeInfo.category === 'Trigger Nodes' && targetNodeInfo.category === 'Regular Nodes') {
      mappings.push({
        source_parameter: 'body',
        target_parameter: 'data',
        transformation: 'json_parse',
        confidence: 0.8,
        data_type: 'object',
        validation_rules: ['valid_json']
      });
    }
    
    return mappings;
  }
  
  private selectOptimalTransformation(source: string, target: string, dataType: string): string {
    if (source === 'body' && target === 'data') return 'json_parse';
    if (source === 'data' && target === 'body') return 'json_stringify';
    if (dataType === 'string' && (target.includes('email') || target.includes('Email'))) return 'email_format';
    if (dataType === 'string' && (target.includes('url') || target.includes('Url'))) return 'url_format';
    return 'direct';
  }
  
  private determineTransformationType(source: string, target: string, dataType: string): string {
    if (source.includes('timestamp') || target.includes('timestamp')) return 'timestamp_format';
    if (source.includes('email') || target.includes('email')) return 'email_validation';
    if (source.includes('url') || target.includes('url')) return 'url_validation';
    if (dataType === 'object') return 'json_transform';
    return 'direct';
  }
  
  private generateTransformationExpression(source: string, target: string, type: string, dataType: string): string {
    const expressions: Record<string, string> = {
      'timestamp_format': '={{ new Date($json.' + source + ').toISOString() }}',
      'email_validation': '={{ $json.' + source + ' && $json.' + source + '.includes("@") ? $json.' + source + ' : null }}',
      'url_validation': '={{ $json.' + source + ' && $json.' + source + '.startsWith("http") ? $json.' + source + ' : "https://" + $json.' + source + ' }}',
      'json_transform': '={{ typeof $json.' + source + ' === "object" ? $json.' + source + ' : JSON.parse($json.' + source + ') }}',
      'json_parse': '={{ JSON.parse($json.' + source + ') }}',
      'json_stringify': '={{ JSON.stringify($json.' + source + ') }}'
    };
    
    return expressions[type] || '={{ $json.' + source + ' }}';
  }
  
  private generateTransformationDescription(source: string, target: string, type: string): string {
    const descriptions: Record<string, string> = {
      'timestamp_format': `Convert ${source} timestamp to ISO format for ${target}`,
      'email_validation': `Validate and clean email from ${source} for ${target}`,
      'url_validation': `Ensure ${source} URL has proper protocol for ${target}`,
      'json_transform': `Transform ${source} JSON data for ${target}`,
      'json_parse': `Parse JSON string ${source} to object for ${target}`,
      'json_stringify': `Convert ${source} object to JSON string for ${target}`
    };
    
    return descriptions[type] || `Transform ${source} data for ${target}`;
  }
  
  private areNodesCompatible(sourceType: string, targetType: string): boolean {
    // Basic compatibility rules
    if (sourceType.includes('webhook') && targetType.includes('http')) return true;
    if (sourceType.includes('http') && targetType.includes('email')) return true;
    if (sourceType.includes('trigger') && !targetType.includes('trigger')) return true;
    return false;
  }
}

/**
 * Create a universal parameter mapper instance
 */
export const universalParameterMapper = new UniversalParameterMapper();