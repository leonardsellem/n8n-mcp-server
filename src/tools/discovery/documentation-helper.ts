/**
 * Node Documentation Helper - Phase 3 Universal Node Discovery
 * 
 * This module provides comprehensive node documentation with examples,
 * leveraging the Phase 1 Enhanced Discovery system for detailed information.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { universalNodeCatalog } from '../../discovery/index.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';

/**
 * Documentation request interface
 */
export interface NodeDocumentationRequest {
  nodeType: string;
  includeExamples?: boolean;
  includeParameters?: boolean;
  includeIntegrationPatterns?: boolean;
  includeAIOptimizations?: boolean;
  outputFormat?: 'markdown' | 'json' | 'html';
  detailLevel?: 'basic' | 'comprehensive' | 'expert';
  includeAlternatives?: boolean;
}

/**
 * Comprehensive node documentation interface
 */
export interface ComprehensiveNodeDocumentation {
  node: {
    name: string;
    displayName: string;
    description: string;
    category: string;
    subcategory?: string;
    version: string;
    author: string;
    license: string;
  };
  overview: {
    purpose: string;
    useCases: string[];
    limitations: string[];
    prerequisites: string[];
  };
  configuration: {
    parameters: Array<{
      name: string;
      displayName: string;
      type: string;
      required: boolean;
      description: string;
      defaultValue?: any;
      options?: any[];
      validation?: string;
    }>;
    credentials?: Array<{
      name: string;
      displayName: string;
      required: boolean;
      description: string;
    }>;
    inputsOutputs: {
      inputs: Array<{
        type: string;
        displayName: string;
        description: string;
        required: boolean;
      }>;
      outputs: Array<{
        type: string;
        displayName: string;
        description: string;
        dataStructure?: any;
      }>;
    };
  };
  examples: Array<{
    title: string;
    description: string;
    useCase: string;
    configuration: any;
    sampleInput?: any;
    expectedOutput?: any;
    notes?: string[];
  }>;
  integrationPatterns: Array<{
    pattern: string;
    description: string;
    commonNodes: string[];
    workflowExample: any;
    benefits: string[];
  }>;
  aiOptimizations?: {
    available: boolean;
    optimizedParameters: Array<{
      parameter: string;
      aiDefault: any;
      reasoning: string;
      performance_gain: string;
    }>;
    intelligentFeatures: string[];
    recommendedSettings: any;
  };
  troubleshooting: {
    commonIssues: Array<{
      issue: string;
      cause: string;
      solution: string;
      prevention: string;
    }>;
    debuggingTips: string[];
    performanceOptimization: string[];
  };
  alternatives?: Array<{
    node: string;
    reason: string;
    pros: string[];
    cons: string[];
    migrationNotes?: string;
  }>;
  resources: {
    officialDocs: string;
    communityGuides: string[];
    videoTutorials: string[];
    relatedNodes: string[];
  };
}

/**
 * Node Documentation Helper Handler
 */
export class NodeDocumentationHelper extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const {
        nodeType,
        includeExamples = true,
        includeParameters = true,
        includeIntegrationPatterns = true,
        includeAIOptimizations = true,
        outputFormat = 'json',
        detailLevel = 'comprehensive',
        includeAlternatives = true
      } = args;

      if (!nodeType) {
        throw new Error('Node type is required for documentation generation');
      }

      console.error(`[NodeDocumentationHelper] Generating ${detailLevel} documentation for: ${nodeType}`);

      const request: NodeDocumentationRequest = {
        nodeType,
        includeExamples,
        includeParameters,
        includeIntegrationPatterns,
        includeAIOptimizations,
        outputFormat,
        detailLevel,
        includeAlternatives
      };

      // Resolve node information from Universal Node Catalog
      const nodeInfo = await this.resolveNodeInformation(nodeType);
      if (!nodeInfo) {
        throw new Error(`Node type not found: ${nodeType}`);
      }

      // Generate comprehensive documentation
      const documentation = await this.generateComprehensiveDocumentation(nodeInfo, request);

      // Format output according to requested format
      const formattedOutput = await this.formatDocumentation(documentation, outputFormat);

      return this.formatSuccess(
        {
          nodeType,
          generationMetadata: {
            detailLevel,
            format: outputFormat,
            sections: this.getIncludedSections(request),
            timestamp: new Date().toISOString()
          },
          documentation: formattedOutput
        },
        `Generated ${detailLevel} documentation for ${nodeInfo.displayName} in ${outputFormat} format`
      );
    }, args);
  }

  private async resolveNodeInformation(nodeType: string): Promise<any> {
    try {
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      const nodeInfo = allNodes.find((node: any) => 
        node.name === nodeType || 
        node.displayName === nodeType ||
        node.name.toLowerCase() === nodeType.toLowerCase()
      );

      if (!nodeInfo) {
        // Try searching for partial matches
        const partialMatches = allNodes.filter((node: any) =>
          node.name.toLowerCase().includes(nodeType.toLowerCase()) ||
          node.displayName.toLowerCase().includes(nodeType.toLowerCase())
        );

        if (partialMatches.length > 0) {
          console.error(`[NodeDocumentationHelper] Found ${partialMatches.length} partial matches for ${nodeType}`);
          return partialMatches[0]; // Return best match
        }
      }

      return nodeInfo;
    } catch (error) {
      console.error(`[NodeDocumentationHelper] Node resolution failed:`, error);
      return null;
    }
  }

  private async generateComprehensiveDocumentation(
    nodeInfo: any,
    request: NodeDocumentationRequest
  ): Promise<ComprehensiveNodeDocumentation> {
    const documentation: ComprehensiveNodeDocumentation = {
      node: await this.buildNodeBasicInfo(nodeInfo),
      overview: await this.buildNodeOverview(nodeInfo, request),
      configuration: await this.buildConfigurationSection(nodeInfo, request),
      examples: request.includeExamples ? await this.buildExamplesSection(nodeInfo, request) : [],
      integrationPatterns: request.includeIntegrationPatterns ? 
        await this.buildIntegrationPatterns(nodeInfo, request) : [],
      troubleshooting: await this.buildTroubleshootingSection(nodeInfo, request),
      resources: await this.buildResourcesSection(nodeInfo)
    };

    // Add AI optimizations if requested
    if (request.includeAIOptimizations) {
      documentation.aiOptimizations = await this.buildAIOptimizationsSection(nodeInfo);
    }

    // Add alternatives if requested
    if (request.includeAlternatives) {
      documentation.alternatives = await this.buildAlternativesSection(nodeInfo);
    }

    return documentation;
  }

  private async buildNodeBasicInfo(nodeInfo: any): Promise<any> {
    return {
      name: nodeInfo.name,
      displayName: nodeInfo.displayName,
      description: nodeInfo.description,
      category: nodeInfo.category,
      subcategory: nodeInfo.subcategory,
      version: nodeInfo.version || '1.0.0',
      author: nodeInfo.author || 'n8n team',
      license: nodeInfo.license || 'MIT'
    };
  }

  private async buildNodeOverview(nodeInfo: any, request: NodeDocumentationRequest): Promise<any> {
    const useCases = this.generateUseCases(nodeInfo);
    const limitations = this.identifyLimitations(nodeInfo);
    const prerequisites = this.identifyPrerequisites(nodeInfo);

    return {
      purpose: this.generatePurposeDescription(nodeInfo),
      useCases,
      limitations,
      prerequisites
    };
  }

  private async buildConfigurationSection(nodeInfo: any, request: NodeDocumentationRequest): Promise<any> {
    let parameters: any[] = [];
    let credentials: any[] = [];

    if (request.includeParameters) {
      parameters = await this.extractParameterInformation(nodeInfo);
      credentials = await this.extractCredentialsInformation(nodeInfo);
    }

    const inputsOutputs = {
      inputs: this.extractInputInformation(nodeInfo),
      outputs: this.extractOutputInformation(nodeInfo)
    };

    return {
      parameters,
      credentials,
      inputsOutputs
    };
  }

  private async buildExamplesSection(nodeInfo: any, request: NodeDocumentationRequest): Promise<any[]> {
    const examples = [];

    // Generate basic usage example
    examples.push(await this.generateBasicExample(nodeInfo));

    // Generate advanced examples based on detail level
    if (request.detailLevel !== 'basic') {
      examples.push(...await this.generateAdvancedExamples(nodeInfo));
    }

    // Generate real-world examples for expert level
    if (request.detailLevel === 'expert') {
      examples.push(...await this.generateRealWorldExamples(nodeInfo));
    }

    return examples;
  }

  private async buildIntegrationPatterns(nodeInfo: any, request: NodeDocumentationRequest): Promise<any[]> {
    try {
      // Use Universal Node Catalog to find common integration patterns
      const workflowDescription = {
        intent: `Use ${nodeInfo.displayName} for integration`,
        preferences: {
          reliability: 'high' as const,
          speed: 'balanced' as const,
          cost: 'medium' as const
        }
      };

      const chainSuggestions = await universalNodeCatalog.getNodeChainSuggestions(nodeInfo.name || nodeInfo.displayName);
      
      return chainSuggestions.slice(0, 3).map((suggestion: any) => ({
        pattern: suggestion.reasoning || 'Common Integration Pattern',
        description: `Integration pattern using ${nodeInfo.displayName} with other nodes`,
        commonNodes: suggestion.chain?.map((node: any) => node.displayName) || [],
        workflowExample: this.generateWorkflowExample(suggestion.chain),
        benefits: this.extractPatternBenefits(suggestion)
      }));
    } catch (error) {
      console.error(`[NodeDocumentationHelper] Integration pattern generation failed:`, error);
      return this.generateFallbackIntegrationPatterns(nodeInfo);
    }
  }

  private async buildAIOptimizationsSection(nodeInfo: any): Promise<any> {
    try {
      // Use Dual Architecture for AI optimization information
      const toolVariant = await dualNodeArchitecture.getToolVariant(nodeInfo);
      const aiParameters = await dualNodeArchitecture.getAIOptimizedParameters(nodeInfo.name);

      if (!toolVariant && aiParameters.length === 0) {
        return {
          available: false,
          optimizedParameters: [],
          intelligentFeatures: [],
          recommendedSettings: {}
        };
      }

      return {
        available: true,
        optimizedParameters: aiParameters.slice(0, 5).map(param => ({
          parameter: param.name,
          aiDefault: param.aiDefault,
          reasoning: param.aiDescription || 'AI-optimized default value',
          performance_gain: 'Improved accuracy and efficiency'
        })),
        intelligentFeatures: this.extractIntelligentFeatures(toolVariant),
        recommendedSettings: toolVariant?.suggestedValues || {}
      };
    } catch (error) {
      console.error(`[NodeDocumentationHelper] AI optimization analysis failed:`, error);
      return { available: false, optimizedParameters: [], intelligentFeatures: [], recommendedSettings: {} };
    }
  }

  private async buildTroubleshootingSection(nodeInfo: any, request: NodeDocumentationRequest): Promise<any> {
    return {
      commonIssues: this.generateCommonIssues(nodeInfo),
      debuggingTips: this.generateDebuggingTips(nodeInfo),
      performanceOptimization: this.generatePerformanceOptimizations(nodeInfo)
    };
  }

  private async buildAlternativesSection(nodeInfo: any): Promise<any[]> {
    try {
      // Use Dynamic Discovery to find alternatives
      const alternatives = await dynamicNodeDiscovery.findAlternativeNodes(nodeInfo, {
        exclude_categories: [],
        require_features: [],
        performance_requirements: []
      });

      return alternatives.slice(0, 3).map(alt => ({
        node: alt.alternative.displayName,
        reason: alt.reason,
        pros: alt.benefits,
        cons: ['May require different configuration', 'Different feature set'],
        migrationNotes: alt.migration_effort
      }));
    } catch (error) {
      console.error(`[NodeDocumentationHelper] Alternatives generation failed:`, error);
      return this.generateFallbackAlternatives(nodeInfo);
    }
  }

  private async buildResourcesSection(nodeInfo: any): Promise<any> {
    return {
      officialDocs: `https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.${nodeInfo.name.split('.').pop()}/`,
      communityGuides: [
        'https://community.n8n.io/',
        'https://n8n.io/workflows/'
      ],
      videoTutorials: [
        'https://www.youtube.com/c/n8n-io',
        'https://academy.n8n.io/'
      ],
      relatedNodes: await this.findRelatedNodes(nodeInfo)
    };
  }

  private async formatDocumentation(documentation: ComprehensiveNodeDocumentation, format: string): Promise<any> {
    switch (format) {
      case 'markdown':
        return this.formatAsMarkdown(documentation);
      case 'html':
        return this.formatAsHTML(documentation);
      case 'json':
      default:
        return documentation;
    }
  }

  private formatAsMarkdown(doc: ComprehensiveNodeDocumentation): string {
    let markdown = `# ${doc.node.displayName}\n\n`;
    markdown += `${doc.node.description}\n\n`;
    
    markdown += `## Overview\n\n`;
    markdown += `**Purpose:** ${doc.overview.purpose}\n\n`;
    
    if (doc.overview.useCases.length > 0) {
      markdown += `**Use Cases:**\n`;
      doc.overview.useCases.forEach(useCase => {
        markdown += `- ${useCase}\n`;
      });
      markdown += '\n';
    }

    if (doc.configuration.parameters.length > 0) {
      markdown += `## Configuration\n\n`;
      markdown += `### Parameters\n\n`;
      doc.configuration.parameters.forEach(param => {
        markdown += `**${param.displayName}** (${param.type})\n`;
        markdown += `- ${param.description}\n`;
        markdown += `- Required: ${param.required ? 'Yes' : 'No'}\n`;
        if (param.defaultValue !== undefined) {
          markdown += `- Default: \`${param.defaultValue}\`\n`;
        }
        markdown += '\n';
      });
    }

    if (doc.examples.length > 0) {
      markdown += `## Examples\n\n`;
      doc.examples.forEach((example, index) => {
        markdown += `### ${example.title}\n\n`;
        markdown += `${example.description}\n\n`;
        markdown += `**Use Case:** ${example.useCase}\n\n`;
        markdown += `**Configuration:**\n\`\`\`json\n${JSON.stringify(example.configuration, null, 2)}\n\`\`\`\n\n`;
      });
    }

    if (doc.aiOptimizations?.available) {
      markdown += `## AI Optimizations\n\n`;
      markdown += `This node has AI-powered optimizations available.\n\n`;
      doc.aiOptimizations.optimizedParameters.forEach(param => {
        markdown += `- **${param.parameter}:** ${param.reasoning}\n`;
      });
      markdown += '\n';
    }

    return markdown;
  }

  private formatAsHTML(doc: ComprehensiveNodeDocumentation): string {
    let html = `<!DOCTYPE html>\n<html>\n<head>\n<title>${doc.node.displayName} Documentation</title>\n</head>\n<body>\n`;
    html += `<h1>${doc.node.displayName}</h1>\n`;
    html += `<p>${doc.node.description}</p>\n`;
    
    html += `<h2>Overview</h2>\n`;
    html += `<p><strong>Purpose:</strong> ${doc.overview.purpose}</p>\n`;
    
    if (doc.overview.useCases.length > 0) {
      html += `<h3>Use Cases</h3>\n<ul>\n`;
      doc.overview.useCases.forEach(useCase => {
        html += `<li>${useCase}</li>\n`;
      });
      html += `</ul>\n`;
    }

    html += `</body>\n</html>`;
    return html;
  }

  // Helper methods for content generation
  private generatePurposeDescription(nodeInfo: any): string {
    if (nodeInfo.triggerNode) {
      return `${nodeInfo.displayName} serves as a trigger node that initiates workflows based on ${nodeInfo.category.toLowerCase()} events.`;
    } else {
      return `${nodeInfo.displayName} is used for ${nodeInfo.category.toLowerCase()} operations within n8n workflows.`;
    }
  }

  private generateUseCases(nodeInfo: any): string[] {
    const useCases = [];
    
    if (nodeInfo.triggerNode) {
      useCases.push('Workflow automation triggering');
      useCases.push('Event-driven processing');
    } else {
      useCases.push('Data processing and transformation');
      useCases.push('Integration with external services');
    }
    
    if (nodeInfo.category === 'Communication') {
      useCases.push('Notification and messaging', 'Team collaboration');
    } else if (nodeInfo.category === 'Data') {
      useCases.push('Data storage and retrieval', 'Analytics and reporting');
    }
    
    return useCases;
  }

  private identifyLimitations(nodeInfo: any): string[] {
    const limitations = [];
    
    if (nodeInfo.category === 'AI') {
      limitations.push('Requires API key and may have usage limits');
      limitations.push('Response time dependent on external service');
    }
    
    if (nodeInfo.webhookSupport) {
      limitations.push('Requires publicly accessible webhook URL');
    }
    
    limitations.push('Rate limits may apply based on external service');
    return limitations;
  }

  private identifyPrerequisites(nodeInfo: any): string[] {
    const prerequisites = ['Basic n8n workflow knowledge'];
    
    if (nodeInfo.credentials && nodeInfo.credentials.length > 0) {
      prerequisites.push('Valid credentials for the service');
    }
    
    if (nodeInfo.category === 'AI') {
      prerequisites.push('API key from the AI service provider');
    }
    
    return prerequisites;
  }

  private async extractParameterInformation(nodeInfo: any): Promise<any[]> {
    const parameters = nodeInfo.properties || [];
    
    return parameters.map((prop: any) => ({
      name: prop.name,
      displayName: prop.displayName || prop.name,
      type: prop.type || 'string',
      required: prop.required || false,
      description: prop.description || `Configuration parameter for ${prop.name}`,
      defaultValue: prop.default,
      options: prop.options,
      validation: prop.validation
    }));
  }

  private async extractCredentialsInformation(nodeInfo: any): Promise<any[]> {
    const credentials = nodeInfo.credentials || [];
    
    return credentials.map((cred: any) => ({
      name: cred.name,
      displayName: cred.displayName || cred.name,
      required: cred.required !== false,
      description: cred.description || `Credentials for ${cred.name}`
    }));
  }

  private extractInputInformation(nodeInfo: any): any[] {
    const inputs = nodeInfo.inputs || [{ type: 'main', displayName: 'Input', required: false }];
    
    return inputs.map((input: any) => ({
      type: input.type || 'main',
      displayName: input.displayName || 'Input',
      description: input.description || 'Standard input connection',
      required: input.required || false
    }));
  }

  private extractOutputInformation(nodeInfo: any): any[] {
    const outputs = nodeInfo.outputs || [{ type: 'main', displayName: 'Output' }];
    
    return outputs.map((output: any) => ({
      type: output.type || 'main',
      displayName: output.displayName || 'Output',
      description: output.description || 'Standard output connection',
      dataStructure: output.dataStructure
    }));
  }

  private async generateBasicExample(nodeInfo: any): Promise<any> {
    return {
      title: 'Basic Usage',
      description: `Simple example of using ${nodeInfo.displayName}`,
      useCase: 'Getting started',
      configuration: this.generateBasicConfiguration(nodeInfo),
      sampleInput: { data: 'example input' },
      expectedOutput: { result: 'processed output' },
      notes: ['Ensure proper configuration before execution']
    };
  }

  private async generateAdvancedExamples(nodeInfo: any): Promise<any[]> {
    return [
      {
        title: 'Advanced Configuration',
        description: `Advanced usage with custom parameters`,
        useCase: 'Production deployment',
        configuration: this.generateAdvancedConfiguration(nodeInfo),
        notes: ['Suitable for production environments', 'Includes error handling']
      }
    ];
  }

  private async generateRealWorldExamples(nodeInfo: any): Promise<any[]> {
    return [
      {
        title: 'Real-world Integration',
        description: `Enterprise-level integration example`,
        useCase: 'Enterprise workflow',
        configuration: this.generateEnterpriseConfiguration(nodeInfo),
        notes: ['Includes monitoring and logging', 'Scalable configuration']
      }
    ];
  }

  private generateBasicConfiguration(nodeInfo: any): any {
    const config: any = {};
    
    if (nodeInfo.properties) {
      nodeInfo.properties.slice(0, 3).forEach((prop: any) => {
        config[prop.name] = prop.default || this.getDefaultValueForType(prop.type);
      });
    }
    
    return config;
  }

  private generateAdvancedConfiguration(nodeInfo: any): any {
    const config = this.generateBasicConfiguration(nodeInfo);
    config.options = { timeout: 30000, retries: 3 };
    return config;
  }

  private generateEnterpriseConfiguration(nodeInfo: any): any {
    const config = this.generateAdvancedConfiguration(nodeInfo);
    config.monitoring = { enabled: true, alerts: true };
    config.security = { encryption: true, audit: true };
    return config;
  }

  private getDefaultValueForType(type: string): any {
    const typeDefaults: { [key: string]: any } = {
      'string': 'example-value',
      'number': 100,
      'boolean': true,
      'object': {},
      'array': []
    };
    
    return typeDefaults[type] || 'default-value';
  }

  private generateCommonIssues(nodeInfo: any): any[] {
    return [
      {
        issue: 'Authentication failure',
        cause: 'Invalid or expired credentials',
        solution: 'Verify and update credentials in n8n',
        prevention: 'Regular credential rotation and monitoring'
      },
      {
        issue: 'Connection timeout',
        cause: 'Network issues or service unavailability',
        solution: 'Check network connectivity and service status',
        prevention: 'Implement retry logic and monitoring'
      }
    ];
  }

  private generateDebuggingTips(nodeInfo: any): string[] {
    return [
      'Enable detailed logging for troubleshooting',
      'Test with sample data before production use',
      'Monitor execution times and error rates',
      'Validate input data format and structure'
    ];
  }

  private generatePerformanceOptimizations(nodeInfo: any): string[] {
    return [
      'Optimize batch sizes for bulk operations',
      'Implement proper error handling and retries',
      'Use connection pooling where applicable',
      'Monitor and tune timeout settings'
    ];
  }

  private extractIntelligentFeatures(toolVariant: any): string[] {
    const features = [];
    
    if (toolVariant?.aiOptimized) {
      features.push('AI-optimized parameter suggestions');
    }
    
    if (toolVariant?.performanceProfile) {
      features.push('Performance-optimized execution');
    }
    
    if (toolVariant?.chainCompatibility) {
      features.push('Intelligent workflow chaining');
    }
    
    return features;
  }

  private generateWorkflowExample(chain: any[]): any {
    if (!chain || chain.length === 0) {
      return { nodes: [], connections: {} };
    }
    
    return {
      nodes: chain.map((node: any, index: number) => ({
        id: `node_${index}`,
        name: node.displayName,
        type: node.name,
        position: [index * 200, 100]
      })),
      connections: this.generateConnections(chain.length)
    };
  }

  private generateConnections(nodeCount: number): any {
    const connections: any = {};
    
    for (let i = 0; i < nodeCount - 1; i++) {
      connections[`node_${i}`] = {
        main: [[{ node: `node_${i + 1}`, type: 'main', index: 0 }]]
      };
    }
    
    return connections;
  }

  private extractPatternBenefits(suggestion: any): string[] {
    return [
      'Proven workflow pattern',
      'Optimized node sequence',
      'Reduced complexity',
      'Better error handling'
    ];
  }

  private generateFallbackIntegrationPatterns(nodeInfo: any): any[] {
    return [
      {
        pattern: 'Basic Integration',
        description: `Standard integration pattern using ${nodeInfo.displayName}`,
        commonNodes: ['Webhook', 'Function', 'HTTP Request'],
        workflowExample: { nodes: [], connections: {} },
        benefits: ['Simple setup', 'Easy maintenance']
      }
    ];
  }

  private generateFallbackAlternatives(nodeInfo: any): any[] {
    return [
      {
        node: 'HTTP Request',
        reason: 'Generic alternative for API interactions',
        pros: ['Universal compatibility', 'Flexible configuration'],
        cons: ['Requires manual setup', 'Less specialized features'],
        migrationNotes: 'May require additional configuration'
      }
    ];
  }

  private async findRelatedNodes(nodeInfo: any): Promise<string[]> {
    try {
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      return allNodes
        .filter((node: any) => 
          node.category === nodeInfo.category && 
          node.name !== nodeInfo.name
        )
        .slice(0, 5)
        .map((node: any) => node.displayName);
    } catch (error) {
      return [];
    }
  }

  private getIncludedSections(request: NodeDocumentationRequest): string[] {
    const sections = ['node', 'overview', 'configuration'];
    
    if (request.includeExamples) sections.push('examples');
    if (request.includeIntegrationPatterns) sections.push('integrationPatterns');
    if (request.includeAIOptimizations) sections.push('aiOptimizations');
    if (request.includeAlternatives) sections.push('alternatives');
    
    sections.push('troubleshooting', 'resources');
    
    return sections;
  }
}

// Tool definitions
export function getNodeDocumentationToolDefinition(): ToolDefinition {
  return {
    name: 'get_node_documentation',
    description: 'Generate comprehensive documentation for n8n nodes with examples, configuration guides, and integration patterns',
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'The node type to generate documentation for (e.g., "n8n-nodes-base.httpRequest")'
        },
        includeExamples: {
          type: 'boolean',
          description: 'Include usage examples and sample configurations',
          default: true
        },
        includeParameters: {
          type: 'boolean',
          description: 'Include detailed parameter descriptions',
          default: true
        },
        includeIntegrationPatterns: {
          type: 'boolean',
          description: 'Include common integration patterns and workflow examples',
          default: true
        },
        includeAIOptimizations: {
          type: 'boolean',
          description: 'Include AI optimization information and suggestions',
          default: true
        },
        outputFormat: {
          type: 'string',
          enum: ['markdown', 'json', 'html'],
          description: 'Output format for the documentation',
          default: 'json'
        },
        detailLevel: {
          type: 'string',
          enum: ['basic', 'comprehensive', 'expert'],
          description: 'Level of detail in the documentation',
          default: 'comprehensive'
        },
        includeAlternatives: {
          type: 'boolean',
          description: 'Include alternative node suggestions',
          default: true
        }
      },
      required: ['nodeType']
    }
  };
}