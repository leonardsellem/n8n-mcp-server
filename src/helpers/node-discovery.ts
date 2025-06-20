/**
 * Node Discovery and Validation Helper
 *
 * This module provides intelligent node discovery, validation, and connection
 * assistance for building n8n workflows through AI agents.
 *
 * COMPREHENSIVE REGISTRY: Based on official n8n.io/integrations (1000+ total integrations)
 */

import {
  ALL_MASSIVE_NODES,
  MASSIVE_REGISTRY_STATS,
  NodeTypeInfo,
  NodeProperty,
  PropertyOption,
  PropertyValidation,
  NodeInput,
  NodeOutput,
  NodeExample
} from '../data/node-types.js';

export interface ConnectionValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface WorkflowValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  missingConnections: string[];
  unreachableNodes: string[];
}

/**
 * Node Discovery Service for helping AI agents understand n8n nodes
 */
export class NodeDiscoveryService {
  private nodeTypes: Map<string, NodeTypeInfo> = new Map();
  private nodeCategories: Map<string, string[]> = new Map();
  private apiClient: any = null;
  private lastFetch: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  private fallbackNodes: NodeTypeInfo[] = [];
  private coreNodes: NodeTypeInfo[] = [];

  constructor(apiClient?: any) {
    this.apiClient = apiClient;
    this.initializeCoreNodes();
    
    // Use massive registry as primary source (no API calls by default)
    this.initializeMassiveRegistry();
    
    console.error(`[NodeDiscovery] Initialized with ${this.nodeTypes.size} node types from comprehensive registry`);
  }

  /**
   * Set the API client for fetching live node data
   */
  setApiClient(apiClient: any): void {
    this.apiClient = apiClient;
    // Note: API client is available but we prioritize the massive registry
    // Call fetchNodeTypesFromApi() manually if you want to supplement with live data
  }

  /**
   * Fetch node types from n8n API (optional - only call manually if needed)
   */
  async fetchNodeTypesFromApi(): Promise<void> {
    if (!this.apiClient) {
      throw new Error('API client not available');
    }

    try {
      console.error('[NodeDiscovery] Attempting to fetch node types from n8n API...');
      const nodeTypes = await this.apiClient.getNodeTypes();
      
      console.error(`[NodeDiscovery] API returned ${nodeTypes?.length || 0} node types`);
      
      // Supplement massive registry with API data (don't replace it)
      if (nodeTypes && nodeTypes.length > 0) {
        console.error(`[NodeDiscovery] Supplementing massive registry with ${nodeTypes.length} API nodes`);
        for (const apiNode of nodeTypes) {
          const nodeInfo = this.convertApiNodeToNodeInfo(apiNode);
          // Only add if we don't already have this node type
          if (!this.nodeTypes.has(nodeInfo.name)) {
            this.addNodeType(nodeInfo);
          }
        }
        
        this.lastFetch = Date.now();
        console.error(`[NodeDiscovery] Registry now contains ${this.nodeTypes.size} node types`);
      } else {
        console.error('[NodeDiscovery] API returned no node types, keeping massive registry as-is');
      }
      
    } catch (error: any) {
      console.error('[NodeDiscovery] API fetch failed (this is normal), keeping massive registry:', error?.message || 'Unknown error');
    }
  }

  /**
   * Convert API node type to internal NodeTypeInfo format
   */
  private convertApiNodeToNodeInfo(apiNode: any): NodeTypeInfo {
    return {
      name: apiNode.name || apiNode.type,
      displayName: apiNode.displayName || apiNode.name,
      description: apiNode.description || 'No description available',
      category: this.categorizeNode(apiNode),
      subcategory: apiNode.group || apiNode.subtitle,
      properties: this.extractProperties(apiNode),
      inputs: this.extractInputs(apiNode),
      outputs: this.extractOutputs(apiNode),
      credentials: apiNode.credentials || [],
      webhookSupport: apiNode.webhooks && apiNode.webhooks.length > 0,
      triggerNode: this.isTriggerNode(apiNode),
      regularNode: !this.isTriggerNode(apiNode),
      codeable: apiNode.codeable || false,
      polling: apiNode.polling || false
    };
  }

  /**
   * Categorize a node based on its properties
   */
  private categorizeNode(apiNode: any): string {
    if (this.isTriggerNode(apiNode)) {
      return 'Trigger Nodes';
    }
    
    if (apiNode.group) {
      return apiNode.group;
    }
    
    // Categorize based on name patterns
    const name = (apiNode.name || '').toLowerCase();
    if (name.includes('database') || name.includes('sql') || name.includes('mongo')) {
      return 'Database Nodes';
    }
    if (name.includes('http') || name.includes('webhook') || name.includes('api')) {
      return 'Communication Nodes';
    }
    if (name.includes('email') || name.includes('slack') || name.includes('discord')) {
      return 'Communication Nodes';
    }
    if (name.includes('file') || name.includes('csv') || name.includes('excel')) {
      return 'File Nodes';
    }
    if (name.includes('code') || name.includes('function') || name.includes('script')) {
      return 'Code Nodes';
    }
    if (name.includes('set') || name.includes('merge') || name.includes('split')) {
      return 'Data Transformation';
    }
    
    return 'Regular Nodes';
  }

  /**
   * Check if a node is a trigger node
   */
  private isTriggerNode(apiNode: any): boolean {
    return apiNode.trigger === true ||
           (apiNode.name && apiNode.name.toLowerCase().includes('trigger')) ||
           (apiNode.displayName && apiNode.displayName.toLowerCase().includes('trigger')) ||
           (apiNode.group && apiNode.group.toLowerCase().includes('trigger'));
  }

  /**
   * Extract properties from API node
   */
  private extractProperties(apiNode: any): NodeProperty[] {
    if (!apiNode.properties || !Array.isArray(apiNode.properties)) {
      return [];
    }

    return apiNode.properties.map((prop: any) => ({
      name: prop.name,
      displayName: prop.displayName || prop.name,
      type: prop.type || 'string',
      required: prop.required || false,
      default: prop.default,
      description: prop.description || '',
      options: prop.options || [],
      validation: prop.validation
    }));
  }

  /**
   * Extract inputs from API node
   */
  private extractInputs(apiNode: any): NodeInput[] {
    const inputs = apiNode.inputs || [];
    if (typeof inputs === 'number') {
      // Simple number of inputs
      return Array.from({ length: inputs }, (_, i) => ({
        type: 'main',
        displayName: `Input ${i + 1}`,
        required: i === 0
      }));
    }
    
    if (Array.isArray(inputs)) {
      return inputs.map((input: any) => ({
        type: input.type || 'main',
        displayName: input.displayName || input.type,
        required: input.required !== false,
        maxConnections: input.maxConnections
      }));
    }
    
    return [];
  }

  /**
   * Extract outputs from API node
   */
  private extractOutputs(apiNode: any): NodeOutput[] {
    const outputs = apiNode.outputs || [];
    if (typeof outputs === 'number') {
      // Simple number of outputs
      return Array.from({ length: outputs }, (_, i) => ({
        type: 'main',
        displayName: `Output ${i + 1}`
      }));
    }
    
    if (Array.isArray(outputs)) {
      return outputs.map((output: any) => ({
        type: output.type || 'main',
        displayName: output.displayName || output.type,
        description: output.description
      }));
    }
    
    return [{ type: 'main', displayName: 'Output' }];
  }

  /**
   * Ensure node types are fresh (massive registry is always fresh)
   */
  async ensureFreshNodeTypes(): Promise<void> {
    // Massive registry is always available and fresh
    // Optionally fetch from API if needed, but don't do it automatically
    if (this.nodeTypes.size === 0) {
      this.initializeMassiveRegistry();
    }
  }

  /**
   * Add a node type to the discovery service
   */
  addNodeType(nodeType: NodeTypeInfo): void {
    this.nodeTypes.set(nodeType.name, nodeType);
    this.updateCategories();
  }

  /**
   * Update the categories mapping
   */
  private updateCategories(): void {
    this.nodeCategories.clear();
    for (const nodeType of this.nodeTypes.values()) {
      if (!this.nodeCategories.has(nodeType.category)) {
        this.nodeCategories.set(nodeType.category, []);
      }
      this.nodeCategories.get(nodeType.category)!.push(nodeType.name);
    }
  }

  /**
   * Initialize core nodes that must always be available
   */
  private initializeCoreNodes(): void {
    console.error('[NodeDiscovery] Initializing core n8n nodes...');
    
    // Core nodes are included in the massive registry, so they'll be loaded with it
    // This method ensures we track them separately for fallback purposes
    const coreNodeNames = [
      'n8n-nodes-base.httpRequest',
      'n8n-nodes-base.set',
      'n8n-nodes-base.function',
      'n8n-nodes-base.merge',
      'n8n-nodes-base.if',
      'n8n-nodes-base.splitInBatches',
      'n8n-nodes-base.wait',
      'n8n-nodes-base.noOp',
      'n8n-nodes-base.webhook',
      'n8n-nodes-base.manualTrigger'
    ];
    
    // These will be loaded when we initialize the massive registry
    this.coreNodes = coreNodeNames.map(name =>
      ALL_MASSIVE_NODES.find(node => node.name === name)
    ).filter(Boolean) as NodeTypeInfo[];
    
    console.error(`[NodeDiscovery] Tracked ${this.coreNodes.length} core nodes`);
  }

  /**
   * Ensure core nodes are always available, even if massive registry fails
   */
  private ensureCoreNodesAvailable(): void {
    console.error('[NodeDiscovery] Ensuring core nodes are available...');
    
    for (const coreNode of this.coreNodes) {
      if (!this.nodeTypes.has(coreNode.name)) {
        console.error(`[NodeDiscovery] Adding missing core node: ${coreNode.name}`);
        this.addNodeType(coreNode);
      }
    }
    
    console.error(`[NodeDiscovery] Core nodes check complete. Total nodes: ${this.nodeTypes.size}`);
  }

  /**
   * Initialize verified node registry as primary source
   */
  private initializeMassiveRegistry(): void {
    console.error('[NodeDiscovery] Initializing verified node registry...');

    // Load all massive nodes from registry
    for (const nodeType of ALL_MASSIVE_NODES) {
      this.addNodeType(nodeType);
    }

    console.error(`[NodeDiscovery] Initialized ${this.nodeTypes.size} node types from verified registry`);
    
    // Update categories
    this.updateCategories();
    
    // Ensure core nodes are always available
    this.ensureCoreNodesAvailable();
  }

  /**
   * Legacy method name for backward compatibility
   */
  private initializeFallbackNodes(): void {
    this.initializeMassiveRegistry();
  }

  /**
   * Get all available node types (from massive registry)
   */
  async getAllNodeTypes(): Promise<NodeTypeInfo[]> {
    // Ensure massive registry is loaded
    if (this.nodeTypes.size === 0) {
      console.error('[NodeDiscovery] No node types available, initializing massive registry');
      this.initializeMassiveRegistry();
    }
    
    return Array.from(this.nodeTypes.values());
  }

  /**
   * Get all available node types synchronously (may return stale data)
   */
  getAllNodeTypesSync(): NodeTypeInfo[] {
    return Array.from(this.nodeTypes.values());
  }

  /**
   * Get node types by category
   */
  getNodeTypesByCategory(category: string): NodeTypeInfo[] {
    return Array.from(this.nodeTypes.values()).filter(node => node.category === category);
  }

  /**
   * Search for node types by name or description
   */
  searchNodeTypes(query: string): NodeTypeInfo[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.nodeTypes.values()).filter(node =>
      node.displayName.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery) ||
      node.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get a specific node type
   */
  getNodeType(name: string): NodeTypeInfo | undefined {
    return this.nodeTypes.get(name);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    return Array.from(this.nodeCategories.keys());
  }

  /**
   * Validate a node configuration
   */
  validateNode(nodeType: string, parameters: Record<string, any>): ConnectionValidation {
    const node = this.getNodeType(nodeType);
    if (!node) {
      return {
        valid: false,
        errors: [`Unknown node type: ${nodeType}`],
        warnings: [],
        suggestions: [`Did you mean one of: ${this.getSimilarNodeTypes(nodeType).join(', ')}?`]
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate required properties
    for (const property of node.properties) {
      if (property.required && !parameters[property.name]) {
        errors.push(`Missing required property: ${property.name}`);
      }

      // Type validation
      if (parameters[property.name] !== undefined) {
        const validationResult = this.validateProperty(property, parameters[property.name]);
        errors.push(...validationResult.errors);
        warnings.push(...validationResult.warnings);
        suggestions.push(...validationResult.suggestions);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate a property value
   */
  private validateProperty(property: NodeProperty, value: any): ConnectionValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Type checking
    switch (property.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Property ${property.name} must be a string`);
        }
        break;
      case 'number':
        if (typeof value !== 'number') {
          errors.push(`Property ${property.name} must be a number`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Property ${property.name} must be a boolean`);
        }
        break;
      case 'options':
        if (property.options) {
          const validValues = property.options.map(opt => opt.value);
          if (!validValues.includes(value)) {
            errors.push(`Property ${property.name} must be one of: ${validValues.join(', ')}`);
          }
        }
        break;
    }

    // Additional validation rules
    if (property.validation) {
      if (property.validation.min !== undefined && value < property.validation.min) {
        errors.push(`Property ${property.name} must be at least ${property.validation.min}`);
      }
      if (property.validation.max !== undefined && value > property.validation.max) {
        errors.push(`Property ${property.name} must be at most ${property.validation.max}`);
      }
      if (property.validation.pattern && typeof value === 'string') {
        const pattern = new RegExp(property.validation.pattern);
        if (!pattern.test(value)) {
          errors.push(`Property ${property.name} does not match required pattern`);
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings, suggestions };
  }

  /**
   * Validate connections between nodes
   */
  validateConnection(fromNode: any, toNode: any, outputIndex = 0, inputIndex = 0): ConnectionValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    const fromNodeType = this.getNodeType(fromNode.type);
    const toNodeType = this.getNodeType(toNode.type);

    if (!fromNodeType) {
      errors.push(`Unknown source node type: ${fromNode.type}`);
    }

    if (!toNodeType) {
      errors.push(`Unknown target node type: ${toNode.type}`);
    }

    if (fromNodeType && toNodeType) {
      // Check if source node has outputs
      if (fromNodeType.outputs.length === 0) {
        errors.push(`Source node ${fromNode.name} has no outputs`);
      }

      // Check if target node accepts inputs
      if (toNodeType.inputs.length === 0) {
        errors.push(`Target node ${toNode.name} does not accept inputs`);
      }

      // Check output/input index bounds
      if (outputIndex >= fromNodeType.outputs.length) {
        errors.push(`Source node ${fromNode.name} does not have output index ${outputIndex}`);
      }

      if (inputIndex >= toNodeType.inputs.length) {
        errors.push(`Target node ${toNode.name} does not have input index ${inputIndex}`);
      }

      // Trigger nodes cannot have inputs connected from other nodes
      if (toNodeType.triggerNode) {
        warnings.push(`Target node ${toNode.name} is a trigger node - connections to trigger nodes are unusual`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validate an entire workflow structure
   */
  validateWorkflow(workflow: any): WorkflowValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const missingConnections: string[] = [];
    const unreachableNodes: string[] = [];

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      errors.push('Workflow must have a nodes array');
      return { valid: false, errors, warnings, suggestions, missingConnections, unreachableNodes };
    }

    if (workflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
      return { valid: false, errors, warnings, suggestions, missingConnections, unreachableNodes };
    }

    // Validate individual nodes
    for (const node of workflow.nodes) {
      const nodeValidation = this.validateNode(node.type, node.parameters || {});
      errors.push(...nodeValidation.errors.map(err => `Node ${node.name}: ${err}`));
      warnings.push(...nodeValidation.warnings.map(warn => `Node ${node.name}: ${warn}`));
    }

    // Check for trigger nodes
    const triggerNodes = workflow.nodes.filter((node: any) => {
      const nodeType = this.getNodeType(node.type);
      return nodeType?.triggerNode;
    });

    if (triggerNodes.length === 0) {
      warnings.push('Workflow has no trigger nodes - it can only be executed manually');
      suggestions.push('Consider adding a trigger node like Webhook, Cron, or Manual Trigger');
    }

    // Validate connections
    if (workflow.connections) {
      this.validateWorkflowConnections(workflow, errors, warnings, missingConnections, unreachableNodes);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      missingConnections,
      unreachableNodes
    };
  }

  /**
   * Validate workflow connections
   */
  private validateWorkflowConnections(
    workflow: any,
    errors: string[],
    warnings: string[],
    missingConnections: string[],
    unreachableNodes: string[]
  ): void {
    const nodeMap = new Map(workflow.nodes.map((node: any) => [node.name, node]));
    const connectedNodes = new Set<string>();

    // Track which nodes have outgoing connections
    for (const [fromNodeName, connections] of Object.entries(workflow.connections)) {
      if (!nodeMap.has(fromNodeName)) {
        errors.push(`Connection from unknown node: ${fromNodeName}`);
        continue;
      }

      connectedNodes.add(fromNodeName);

      for (const [outputType, outputConnections] of Object.entries(connections as any)) {
        for (const connectionList of outputConnections as any[]) {
          for (const connection of connectionList) {
            const toNodeName = connection.node;
            if (!nodeMap.has(toNodeName)) {
              errors.push(`Connection to unknown node: ${toNodeName}`);
              continue;
            }

            connectedNodes.add(toNodeName);

            // Validate the specific connection
            const fromNode = nodeMap.get(fromNodeName);
            const toNode = nodeMap.get(toNodeName);
            const connectionValidation = this.validateConnection(
              fromNode,
              toNode,
              connection.output || 0,
              connection.input || 0
            );

            errors.push(...connectionValidation.errors);
            warnings.push(...connectionValidation.warnings);
          }
        }
      }
    }

    // Find unreachable nodes (nodes with no incoming connections and not trigger nodes)
    for (const node of workflow.nodes) {
      const nodeType = this.getNodeType(node.type);
      if (!nodeType?.triggerNode && !connectedNodes.has(node.name)) {
        unreachableNodes.push(node.name);
      }
    }
  }

  /**
   * Get similar node types for suggestions
   */
  private getSimilarNodeTypes(nodeType: string): string[] {
    const allTypes = Array.from(this.nodeTypes.keys());
    return allTypes
      .filter(type => this.calculateSimilarity(nodeType, type) > 0.5)
      .slice(0, 3);
  }

  /**
   * Calculate similarity between two strings (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Suggest nodes for a given use case
   */
  suggestNodesForUseCase(description: string): NodeTypeInfo[] {
    const keywords = description.toLowerCase().split(/\s+/);
    const suggestions = new Map<string, number>();

    for (const nodeType of this.nodeTypes.values()) {
      let score = 0;
      
      // Score based on keyword matches
      for (const keyword of keywords) {
        if (nodeType.displayName.toLowerCase().includes(keyword)) score += 3;
        if (nodeType.description.toLowerCase().includes(keyword)) score += 2;
        if (nodeType.category.toLowerCase().includes(keyword)) score += 1;
      }

      if (score > 0) {
        suggestions.set(nodeType.name, score);
      }
    }

    // Return top suggestions sorted by score
    return Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => this.nodeTypes.get(name)!)
      .filter(Boolean);
  }

  /**
   * Generate an enhanced workflow structure for a use case
   */
  generateWorkflowSkeleton(description: string): any {
    console.error(`[NodeDiscovery] Generating enhanced skeleton for: "${description}"`);
    
    // Enhanced keyword analysis for better node suggestions
    const descLower = description.toLowerCase();
    const keywords = descLower.split(/\s+/);
    
    // Detect specific workflow patterns
    const patterns = this.detectWorkflowPatterns(descLower);
    console.error('[NodeDiscovery] Detected patterns:', patterns);
    
    // Get base suggestions from existing logic
    let suggestions = this.suggestNodesForUseCase(description);
    
    // Enhance suggestions based on patterns
    suggestions = this.enhanceSuggestionsWithPatterns(suggestions, patterns, keywords);
    
    if (suggestions.length === 0) {
      console.error('[NodeDiscovery] No suggestions found, creating basic workflow');
      return this.createBasicWorkflow(description);
    }

    console.error(`[NodeDiscovery] Using ${suggestions.length} enhanced suggestions`);
    
    const nodes = [];
    const connections: any = {};
    let nodeIndex = 0;

    // Add trigger node(s) based on patterns
    const triggerNodes = this.createTriggerNodes(patterns, nodeIndex);
    nodes.push(...triggerNodes);
    nodeIndex += triggerNodes.length;

    // Add processing nodes based on suggestions and patterns
    const processingNodes = this.createProcessingNodes(suggestions, patterns, nodeIndex);
    nodes.push(...processingNodes);
    nodeIndex += processingNodes.length;

    // Add output/action nodes based on patterns
    const actionNodes = this.createActionNodes(patterns, nodeIndex);
    nodes.push(...actionNodes);

    // Create intelligent connections
    this.createIntelligentConnections(nodes, connections);

    const result = {
      name: `Enhanced Workflow - ${description.substring(0, 50)}`,
      nodes,
      connections
    };

    console.error(`[NodeDiscovery] Generated workflow with ${nodes.length} nodes and ${Object.keys(connections).length} connection points`);
    return result;
  }

  /**
   * Detect specific workflow patterns from description
   */
  private detectWorkflowPatterns(description: string): {
    triggers: string[];
    processing: string[];
    outputs: string[];
    dataFlow: string;
    complexity: string;
  } {
    const patterns = {
      triggers: [] as string[],
      processing: [] as string[],
      outputs: [] as string[],
      dataFlow: 'linear' as string,
      complexity: 'simple' as string
    };

    // Detect triggers
    if (description.includes('webhook') || description.includes('api endpoint') || description.includes('http')) {
      patterns.triggers.push('webhook');
    }
    if (description.includes('schedule') || description.includes('cron') || description.includes('timer')) {
      patterns.triggers.push('schedule');
    }
    if (description.includes('email') && (description.includes('receive') || description.includes('incoming'))) {
      patterns.triggers.push('emailTrigger');
    }
    if (description.includes('file') && (description.includes('watch') || description.includes('monitor'))) {
      patterns.triggers.push('fileTrigger');
    }

    // Detect processing patterns
    if (description.includes('transform') || description.includes('process') || description.includes('modify')) {
      patterns.processing.push('transform');
    }
    if (description.includes('filter') || description.includes('condition') || description.includes('if')) {
      patterns.processing.push('conditional');
    }
    if (description.includes('loop') || description.includes('iterate') || description.includes('batch')) {
      patterns.processing.push('iteration');
    }
    if (description.includes('merge') || description.includes('combine') || description.includes('join')) {
      patterns.processing.push('merge');
    }

    // Detect outputs
    if (description.includes('email') && (description.includes('send') || description.includes('notify'))) {
      patterns.outputs.push('email');
    }
    if (description.includes('slack') || description.includes('discord') || description.includes('teams')) {
      patterns.outputs.push('chat');
    }
    if (description.includes('database') || description.includes('save') || description.includes('store')) {
      patterns.outputs.push('database');
    }
    if (description.includes('api') && (description.includes('send') || description.includes('post'))) {
      patterns.outputs.push('api');
    }
    if (description.includes('file') && (description.includes('save') || description.includes('write'))) {
      patterns.outputs.push('file');
    }

    // Determine complexity
    const totalElements = patterns.triggers.length + patterns.processing.length + patterns.outputs.length;
    if (totalElements > 4) {
      patterns.complexity = 'complex';
      patterns.dataFlow = 'branched';
    } else if (totalElements > 2) {
      patterns.complexity = 'medium';
    }

    return patterns;
  }

  /**
   * Enhance suggestions based on detected patterns
   */
  private enhanceSuggestionsWithPatterns(suggestions: NodeTypeInfo[], patterns: any, keywords: string[]): NodeTypeInfo[] {
    const enhanced = [...suggestions];
    
    // Add pattern-specific nodes that might not have been suggested
    const patternNodes = [
      // Processing nodes
      { pattern: 'conditional', nodeType: 'n8n-nodes-base.if' },
      { pattern: 'transform', nodeType: 'n8n-nodes-base.function' },
      { pattern: 'merge', nodeType: 'n8n-nodes-base.merge' },
      { pattern: 'iteration', nodeType: 'n8n-nodes-base.splitInBatches' },
      
      // Output nodes
      { pattern: 'email', nodeType: 'n8n-nodes-base.send-email' },
      { pattern: 'api', nodeType: 'n8n-nodes-base.httpRequest' },
      { pattern: 'file', nodeType: 'n8n-nodes-base.writeFile' }
    ];

    for (const { pattern, nodeType } of patternNodes) {
      if (patterns.processing.includes(pattern) || patterns.outputs.includes(pattern)) {
        const node = this.getNodeType(nodeType);
        if (node && !enhanced.some(n => n.name === nodeType)) {
          enhanced.push(node);
        }
      }
    }

    return enhanced.slice(0, 5); // Limit to top 5 for manageable workflows
  }

  /**
   * Create trigger nodes based on patterns
   */
  private createTriggerNodes(patterns: any, startIndex: number): any[] {
    const nodes = [];
    
    if (patterns.triggers.length === 0) {
      // Default manual trigger
      nodes.push({
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        position: [250, 300],
        parameters: {}
      });
    } else {
      let index = startIndex;
      for (const trigger of patterns.triggers.slice(0, 2)) { // Max 2 triggers
        switch (trigger) {
          case 'webhook':
            nodes.push({
              name: 'Webhook',
              type: 'n8n-nodes-base.webhook',
              position: [250 + (index * 220), 300],
              parameters: {
                path: 'data-webhook',
                httpMethod: 'POST'
              }
            });
            break;
          case 'schedule':
            nodes.push({
              name: 'Schedule',
              type: 'n8n-nodes-base.scheduleTrigger',
              position: [250 + (index * 220), 300],
              parameters: {
                rule: {
                  interval: [{
                    field: 'hours',
                    hoursInterval: 1
                  }]
                }
              }
            });
            break;
          case 'emailTrigger':
            nodes.push({
              name: 'Email Trigger',
              type: 'n8n-nodes-base.emailReadImap',
              position: [250 + (index * 220), 300],
              parameters: {
                mailbox: 'INBOX'
              }
            });
            break;
        }
        index++;
      }
    }
    
    return nodes;
  }

  /**
   * Create processing nodes based on suggestions and patterns
   */
  private createProcessingNodes(suggestions: NodeTypeInfo[], patterns: any, startIndex: number): any[] {
    const nodes = [];
    let index = startIndex;
    
    // Add pattern-specific processing nodes
    if (patterns.processing.includes('conditional')) {
      nodes.push({
        name: 'Condition',
        type: 'n8n-nodes-base.if',
        position: [250 + (index * 220), 300],
        parameters: {
          conditions: {
            boolean: [{
              value1: '={{$json["status"]}}',
              operation: 'equal',
              value2: 'active'
            }]
          }
        }
      });
      index++;
    }

    if (patterns.processing.includes('transform')) {
      nodes.push({
        name: 'Transform Data',
        type: 'n8n-nodes-base.function',
        position: [250 + (index * 220), 300],
        parameters: {
          functionCode: `// Transform the data
const transformed = {
  ...($json as any),
  processed: true,
  timestamp: new Date().toISOString()
};
return [transformed];`
        }
      });
      index++;
    }

    // Add up to 2 more nodes from suggestions (excluding triggers and already added types)
    const usedTypes = new Set(nodes.map(n => n.type));
    const availableSuggestions = suggestions.filter(s =>
      !s.triggerNode &&
      !usedTypes.has(s.name) &&
      index < startIndex + 3 // Limit processing nodes
    );

    for (const suggestion of availableSuggestions.slice(0, 2)) {
      nodes.push({
        name: suggestion.displayName.replace(/[^a-zA-Z0-9\s]/g, ''),
        type: suggestion.name,
        position: [250 + (index * 220), 300],
        parameters: this.generateDefaultParameters(suggestion)
      });
      index++;
    }

    return nodes;
  }

  /**
   * Create action/output nodes based on patterns
   */
  private createActionNodes(patterns: any, startIndex: number): any[] {
    const nodes = [];
    let index = startIndex;

    // Add output nodes based on detected patterns
    if (patterns.outputs.includes('email')) {
      nodes.push({
        name: 'Send Email',
        type: 'n8n-nodes-base.send-email',
        position: [250 + (index * 220), 300],
        parameters: {
          subject: 'Workflow Notification',
          text: '={{ JSON.stringify($json, null, 2) }}',
          toEmail: 'recipient@example.com'
        }
      });
      index++;
    }

    if (patterns.outputs.includes('api')) {
      nodes.push({
        name: 'API Request',
        type: 'n8n-nodes-base.httpRequest',
        position: [250 + (index * 220), 300],
        parameters: {
          method: 'POST',
          url: 'https://api.example.com/data',
          body: {
            mode: 'json',
            json: '={{ $json }}'
          }
        }
      });
      index++;
    }

    if (patterns.outputs.includes('database')) {
      nodes.push({
        name: 'Save to Database',
        type: 'n8n-nodes-base.postgres',
        position: [250 + (index * 220), 300],
        parameters: {
          operation: 'insert',
          table: 'workflow_data'
        }
      });
      index++;
    }

    // If no specific outputs detected, add a basic set node
    if (nodes.length === 0) {
      nodes.push({
        name: 'Set Result',
        type: 'n8n-nodes-base.set',
        position: [250 + (index * 220), 300],
        parameters: {
          values: {
            string: [{
              name: 'status',
              value: 'completed'
            }]
          }
        }
      });
    }

    return nodes;
  }

  /**
   * Create intelligent connections between nodes
   */
  private createIntelligentConnections(nodes: any[], connections: any): void {
    for (let i = 0; i < nodes.length - 1; i++) {
      const currentNode = nodes[i];
      const nextNode = nodes[i + 1];
      
      // Skip connections to trigger nodes
      const nextNodeType = this.getNodeType(nextNode.type);
      if (nextNodeType?.triggerNode) {
        continue;
      }

      if (!connections[currentNode.name]) {
        connections[currentNode.name] = { main: [[]] };
      }

      connections[currentNode.name].main[0].push({
        node: nextNode.name,
        type: 'main',
        index: 0
      });
    }

    // Handle conditional nodes - create both true/false paths if we have enough nodes
    const conditionalNodes = nodes.filter(n => n.type === 'n8n-nodes-base.if');
    for (const condNode of conditionalNodes) {
      const condIndex = nodes.indexOf(condNode);
      if (condIndex < nodes.length - 2) {
        // True path (already connected above)
        // False path to alternative node or end
        const falseTargetIndex = Math.min(condIndex + 2, nodes.length - 1);
        const falseTarget = nodes[falseTargetIndex];
        
        if (!connections[condNode.name]) {
          connections[condNode.name] = { main: [[], []] };
        } else if (!connections[condNode.name].main[1]) {
          connections[condNode.name].main[1] = [];
        }

        connections[condNode.name].main[1].push({
          node: falseTarget.name,
          type: 'main',
          index: 0
        });
      }
    }
  }

  /**
   * Create a basic fallback workflow
   */
  private createBasicWorkflow(description: string): any {
    return {
      name: `Basic Workflow - ${description.substring(0, 30)}`,
      nodes: [
        {
          name: 'Manual Trigger',
          type: 'n8n-nodes-base.manualTrigger',
          position: [250, 300],
          parameters: {}
        },
        {
          name: 'Process',
          type: 'n8n-nodes-base.function',
          position: [450, 300],
          parameters: {
            functionCode: `// Generated for: ${description}\nreturn [{ processed: true, input: $json }];`
          }
        }
      ],
      connections: {
        'Manual Trigger': {
          main: [[{
            node: 'Process',
            type: 'main',
            index: 0
          }]]
        }
      }
    };
  }

  /**
   * Generate default parameters for a node type
   */
  private generateDefaultParameters(nodeType: NodeTypeInfo): Record<string, any> {
    const parameters: Record<string, any> = {};

    for (const property of nodeType.properties) {
      if (property.required && property.default !== undefined) {
        parameters[property.name] = property.default;
      }
    }

    return parameters;
  }
}

// Export singleton instance (will be updated with API client when available)
export const nodeDiscovery = new NodeDiscoveryService();

/**
 * Initialize the node discovery service with an API client
 */
export function initializeNodeDiscovery(apiClient: any): void {
  nodeDiscovery.setApiClient(apiClient);
}
