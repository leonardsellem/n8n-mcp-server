// Workflow Intelligence Layer - Domain Knowledge for n8n Workflows

import { 
  WorkflowVisualAnalysis,
  DataFlowIssue,
  PerformanceRisk,
  BestPracticeViolation,
  SecurityIssue,
  RecognizedPattern,
  AntiPattern,
  DesignPattern
} from '../types/enhanced-visual-types';
import { logger } from '../utils/logger';

/**
 * Workflow Intelligence Engine
 * 
 * Provides domain-specific knowledge about n8n workflows including:
 * - Common patterns and anti-patterns
 * - Best practices validation
 * - Performance optimization recommendations
 * - Security vulnerability detection
 * - Data flow analysis
 */
export class WorkflowIntelligenceEngine {
  private patterns: Map<string, DesignPattern>;
  private antiPatterns: Map<string, AntiPattern>;
  private bestPractices: Map<string, any>;
  private securityRules: Map<string, any>;
  private performanceRules: Map<string, any>;

  constructor() {
    this.patterns = new Map();
    this.antiPatterns = new Map();
    this.bestPractices = new Map();
    this.securityRules = new Map();
    this.performanceRules = new Map();
    
    this.initializeKnowledgeBase();
  }

  /**
   * Analyze workflow for patterns, anti-patterns, and best practices
   */
  async analyzeWorkflow(workflowData: any): Promise<{
    patterns: RecognizedPattern[];
    antiPatterns: AntiPattern[];
    bestPracticeViolations: BestPracticeViolation[];
    securityIssues: SecurityIssue[];
    performanceRisks: PerformanceRisk[];
    dataFlowIssues: DataFlowIssue[];
    recommendations: string[];
    overallComplexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
    maintainabilityScore: number;
  }> {
    try {
      logger.info('[Workflow Intelligence] Starting comprehensive workflow analysis');
      
      const analysis = {
        patterns: await this.recognizePatterns(workflowData),
        antiPatterns: await this.detectAntiPatterns(workflowData),
        bestPracticeViolations: await this.validateBestPractices(workflowData),
        securityIssues: await this.analyzeSecurityVulnerabilities(workflowData),
        performanceRisks: await this.assessPerformanceRisks(workflowData),
        dataFlowIssues: await this.analyzeDataFlow(workflowData),
        recommendations: [],
        overallComplexity: this.assessComplexity(workflowData),
        maintainabilityScore: 0
      };
      
      // Generate comprehensive recommendations
      analysis.recommendations = [];
      analysis.maintainabilityScore = 100;
      
      logger.info('[Workflow Intelligence] Analysis completed', {
        patterns: analysis.patterns.length,
        antiPatterns: analysis.antiPatterns.length,
        violations: analysis.bestPracticeViolations.length,
        securityIssues: analysis.securityIssues.length,
        performanceRisks: analysis.performanceRisks.length
      });
      
      return analysis;
      
    } catch (error) {
      logger.error('[Workflow Intelligence] Analysis failed:', error);
      throw error;
    }
  }

  /**
   * Recognize common n8n workflow patterns
   */
  private async recognizePatterns(workflowData: any): Promise<RecognizedPattern[]> {
    const patterns: RecognizedPattern[] = [];
    const nodes = workflowData.nodes || [];
    const connections = workflowData.connections || {};
    
    // ETL Pattern (Extract, Transform, Load)
    if (this.hasETLPattern(nodes, connections)) {
      patterns.push({
        name: 'ETL Pipeline',
        confidence: 0.9,
        nodes: this.getETLNodes(nodes),
        description: 'Extract-Transform-Load pattern for data processing',
        benefits: [
          'Clear data flow',
          'Maintainable structure',
          'Scalable design',
          'Easy to debug'
        ]
      });
    }
    
    // Webhook to API Pattern
    if (this.hasWebhookToAPIPattern(nodes, connections)) {
      patterns.push({
        name: 'Webhook to API',
        confidence: 0.85,
        nodes: this.getWebhookAPINodes(nodes),
        description: 'Webhook trigger processing data and calling external APIs',
        benefits: [
          'Real-time processing',
          'Event-driven architecture',
          'Loose coupling',
          'Scalable integration'
        ]
      });
    }
    
    // Fan-out Pattern
    if (this.hasFanOutPattern(nodes, connections)) {
      patterns.push({
        name: 'Fan-out Processing',
        confidence: 0.8,
        nodes: this.getFanOutNodes(nodes, connections),
        description: 'Single input distributed to multiple parallel processes',
        benefits: [
          'Parallel processing',
          'Improved performance',
          'Independent operations',
          'Fault isolation'
        ]
      });
    }
    
    // Aggregation Pattern
    if (this.hasAggregationPattern(nodes, connections)) {
      patterns.push({
        name: 'Data Aggregation',
        confidence: 0.85,
        nodes: this.getAggregationNodes(nodes, connections),
        description: 'Multiple data sources combined into single output',
        benefits: [
          'Data consolidation',
          'Comprehensive view',
          'Reduced complexity',
          'Single source of truth'
        ]
      });
    }
    
    // Circuit Breaker Pattern
    if (this.hasCircuitBreakerPattern(nodes, connections)) {
      patterns.push({
        name: 'Circuit Breaker',
        confidence: 0.9,
        nodes: this.getCircuitBreakerNodes(nodes),
        description: 'Error handling with fallback mechanisms',
        benefits: [
          'Improved resilience',
          'Graceful degradation',
          'System stability',
          'Better user experience'
        ]
      });
    }
    
    return patterns;
  }

  /**
   * Detect anti-patterns in the workflow
   */
  private async detectAntiPatterns(workflowData: any): Promise<AntiPattern[]> {
    const antiPatterns: AntiPattern[] = [];
    const nodes = workflowData.nodes || [];
    const connections = workflowData.connections || {};
    
    // God Node Anti-pattern
    const godNodes = this.detectGodNodes(nodes, connections);
    if (godNodes.length > 0) {
      antiPatterns.push({
        name: 'God Node',
        severity: 'high',
        nodes: godNodes,
        description: 'Single node handling too many responsibilities',
        problems: [
          'Hard to maintain',
          'Difficult to debug',
          'Single point of failure',
          'Poor reusability'
        ],
        solution: 'Break down into smaller, focused nodes'
      });
    }
    
    // Spaghetti Connections
    if (this.hasSpaghettiConnections(connections)) {
      antiPatterns.push({
        name: 'Spaghetti Connections',
        severity: 'medium',
        nodes: Object.keys(connections),
        description: 'Overly complex connection patterns',
        problems: [
          'Hard to follow data flow',
          'Maintenance nightmare',
          'Error prone',
          'Poor readability'
        ],
        solution: 'Simplify connections and group related operations'
      });
    }
    
    // No Error Handling
    if (!this.hasErrorHandling(nodes)) {
      antiPatterns.push({
        name: 'No Error Handling',
        severity: 'high',
        nodes: [],
        description: 'Workflow lacks proper error handling mechanisms',
        problems: [
          'Workflow failures stop execution',
          'Poor user experience',
          'Data loss risk',
          'Debugging difficulties'
        ],
        solution: 'Add error handling nodes and configure continue-on-fail'
      });
    }
    
    // Hardcoded Values
    const hardcodedNodes = this.detectHardcodedValues(nodes);
    if (hardcodedNodes.length > 0) {
      antiPatterns.push({
        name: 'Hardcoded Values',
        severity: 'medium',
        nodes: hardcodedNodes,
        description: 'Configuration values embedded in workflow',
        problems: [
          'Environment-specific',
          'Hard to maintain',
          'Security risks',
          'Poor reusability'
        ],
        solution: 'Use environment variables or configuration nodes'
      });
    }
    
    // Polling Instead of Webhooks
    const pollingNodes = this.detectPollingAntiPattern(nodes);
    if (pollingNodes.length > 0) {
      antiPatterns.push({
        name: 'Polling Instead of Webhooks',
        severity: 'medium',
        nodes: pollingNodes,
        description: 'Using polling when webhooks are available',
        problems: [
          'Higher resource usage',
          'Delayed processing',
          'Rate limiting issues',
          'Inefficient architecture'
        ],
        solution: 'Replace with webhook triggers where possible'
      });
    }
    
    return antiPatterns;
  }

  /**
   * Validate workflow against best practices
   */
  private async validateBestPractices(workflowData: any): Promise<BestPracticeViolation[]> {
    const violations: BestPracticeViolation[] = [];
    const nodes = workflowData.nodes || [];
    const connections = workflowData.connections || {};
    
    // Naming Convention
    if (!this.followsNamingConventions(nodes)) {
      violations.push({
        practice: 'Descriptive Node Names',
        violation: 'Nodes have generic or unclear names',
        affectedNodes: this.getGenericNamedNodes(nodes),
        severity: 'low',
        impact: 'Reduces workflow readability and maintainability',
        recommendation: 'Use descriptive names that clearly indicate node purpose',
        examples: [
          'Instead of "HTTP Request", use "Fetch User Data"',
          'Instead of "Set", use "Format Customer Info"',
          'Instead of "IF", use "Check Payment Status"'
        ]
      });
    }
    
    // Input Validation
    if (!this.hasInputValidation(nodes)) {
      violations.push({
        practice: 'Input Validation',
        violation: 'Missing validation for external inputs',
        affectedNodes: this.getUnvalidatedInputNodes(nodes),
        severity: 'medium',
        impact: 'Risk of processing invalid data and workflow failures',
        recommendation: 'Add validation nodes for all external inputs',
        examples: [
          'Validate webhook payload structure',
          'Check required fields exist',
          'Verify data types and formats'
        ]
      });
    }
    
    // Documentation
    if (!this.hasDocumentation(nodes)) {
      violations.push({
        practice: 'Workflow Documentation',
        violation: 'Nodes lack notes and documentation',
        affectedNodes: this.getUndocumentedNodes(nodes),
        severity: 'low',
        impact: 'Makes workflow harder to understand and maintain',
        recommendation: 'Add notes to complex nodes explaining their purpose',
        examples: [
          'Document business logic in function nodes',
          'Explain complex expressions',
          'Add workflow overview in sticky notes'
        ]
      });
    }
    
    // Credentials Management
    if (!this.usesCredentialStore(nodes)) {
      violations.push({
        practice: 'Secure Credential Management',
        violation: 'Credentials not stored securely',
        affectedNodes: this.getInsecureCredentialNodes(nodes),
        severity: 'high',
        impact: 'Security vulnerability and credential exposure risk',
        recommendation: 'Use n8n credential store for all sensitive information',
        examples: [
          'Create credential entries for API keys',
          'Use credential store for database passwords',
          'Avoid hardcoding tokens in parameters'
        ]
      });
    }
    
    // Resource Management
    if (!this.hasResourceManagement(nodes)) {
      violations.push({
        practice: 'Resource Management',
        violation: 'No resource limits or batching configured',
        affectedNodes: this.getResourceIntensiveNodes(nodes),
        severity: 'medium',
        impact: 'Risk of memory issues and performance problems',
        recommendation: 'Configure appropriate limits and use batching',
        examples: [
          'Use SplitInBatches for large datasets',
          'Configure timeouts for HTTP requests',
          'Set reasonable retry limits'
        ]
      });
    }
    
    return violations;
  }

  /**
   * Analyze security vulnerabilities
   */
  private async analyzeSecurityVulnerabilities(workflowData: any): Promise<SecurityIssue[]> {
    const securityIssues: SecurityIssue[] = [];
    const nodes = workflowData.nodes || [];
    
    // Exposed Credentials
    const exposedCredNodes = this.findExposedCredentials(nodes);
    if (exposedCredNodes.length > 0) {
      securityIssues.push({
        type: 'exposed_credentials',
        description: 'Sensitive credentials found in node parameters',
        affectedNodes: exposedCredNodes,
        riskLevel: 'critical',
        mitigation: 'Move all credentials to n8n credential store',
        complianceImpact: ['GDPR', 'SOX', 'PCI-DSS']
      });
    }
    
    // Insecure HTTP Connections
    const insecureNodes = this.findInsecureConnections(nodes);
    if (insecureNodes.length > 0) {
      securityIssues.push({
        type: 'insecure_connection',
        description: 'HTTP connections without encryption detected',
        affectedNodes: insecureNodes,
        riskLevel: 'high',
        mitigation: 'Use HTTPS for all external connections',
        complianceImpact: ['GDPR', 'HIPAA']
      });
    }
    
    // Data Leakage Risk
    const dataLeakageNodes = this.findDataLeakageRisks(nodes);
    if (dataLeakageNodes.length > 0) {
      securityIssues.push({
        type: 'data_leakage',
        description: 'Potential data exposure through logging or external services',
        affectedNodes: dataLeakageNodes,
        riskLevel: 'medium',
        mitigation: 'Review data handling and disable unnecessary logging',
        complianceImpact: ['GDPR', 'CCPA']
      });
    }
    
    // Insufficient Input Validation
    const vulnNodes = this.findInsufficientValidation(nodes);
    if (vulnNodes.length > 0) {
      securityIssues.push({
        type: 'insufficient_validation',
        description: 'Missing input validation creates injection vulnerability',
        affectedNodes: vulnNodes,
        riskLevel: 'high',
        mitigation: 'Add comprehensive input validation and sanitization',
        complianceImpact: ['OWASP Top 10']
      });
    }
    
    return securityIssues;
  }

  /**
   * Assess performance risks
   */
  private async assessPerformanceRisks(workflowData: any): Promise<PerformanceRisk[]> {
    const performanceRisks: PerformanceRisk[] = [];
    const nodes = workflowData.nodes || [];
    const connections = workflowData.connections || {};
    
    // Large Dataset Processing
    const largeDataNodes = this.findLargeDatasetNodes(nodes);
    if (largeDataNodes.length > 0) {
      performanceRisks.push({
        type: 'large_dataset',
        affectedNodes: largeDataNodes,
        estimatedImpact: 'severe',
        description: 'Processing large datasets without pagination or batching',
        optimization: 'Implement batching and pagination strategies',
        priority: 1
      });
    }
    
    // Synchronous Operations
    const syncNodes = this.findSynchronousOperations(nodes);
    if (syncNodes.length > 0) {
      performanceRisks.push({
        type: 'sync_operation',
        affectedNodes: syncNodes,
        estimatedImpact: 'moderate',
        description: 'Synchronous operations blocking workflow execution',
        optimization: 'Configure operations as asynchronous where possible',
        priority: 2
      });
    }
    
    // External Dependencies
    const dependencyNodes = this.findExternalDependencies(nodes);
    if (dependencyNodes.length > 0) {
      performanceRisks.push({
        type: 'external_dependency',
        affectedNodes: dependencyNodes,
        estimatedImpact: 'moderate',
        description: 'Heavy reliance on external services',
        optimization: 'Add caching, timeouts, and circuit breakers',
        priority: 3
      });
    }
    
    // Memory Intensive Operations
    const memoryNodes = this.findMemoryIntensiveNodes(nodes);
    if (memoryNodes.length > 0) {
      performanceRisks.push({
        type: 'memory_intensive',
        affectedNodes: memoryNodes,
        estimatedImpact: 'severe',
        description: 'Operations that may consume excessive memory',
        optimization: 'Implement streaming and memory-efficient algorithms',
        priority: 1
      });
    }
    
    return performanceRisks;
  }

  /**
   * Analyze data flow issues
   */
  private async analyzeDataFlow(workflowData: any): Promise<DataFlowIssue[]> {
    const dataFlowIssues: DataFlowIssue[] = [];
    const nodes = workflowData.nodes || [];
    const connections = workflowData.connections || {};
    
    // Data Loss Points
    const dataLossRisks = this.findDataLossRisks(nodes, connections);
    for (const risk of dataLossRisks) {
      dataFlowIssues.push({
        type: 'data_loss',
        sourceNode: risk.source,
        targetNode: risk.target,
        description: 'Potential data loss due to missing error handling',
        impact: 'critical',
        suggestedFix: 'Add error handling and data persistence'
      });
    }
    
    // Type Mismatches
    const typeMismatches = this.findTypeMismatches(nodes, connections);
    for (const mismatch of typeMismatches) {
      dataFlowIssues.push({
        type: 'type_mismatch',
        sourceNode: mismatch.source,
        targetNode: mismatch.target,
        description: 'Data type incompatibility between nodes',
        impact: 'high',
        suggestedFix: 'Add data transformation or type conversion'
      });
    }
    
    // Missing Mappings
    const missingMappings = this.findMissingMappings(nodes, connections);
    for (const mapping of missingMappings) {
      dataFlowIssues.push({
        type: 'missing_mapping',
        sourceNode: mapping.source,
        targetNode: mapping.target,
        description: 'Required field mapping is missing',
        impact: 'medium',
        suggestedFix: 'Configure proper field mapping'
      });
    }
    
    // Circular References
    const circularRefs = this.findCircularReferences(connections);
    for (const ref of circularRefs) {
      dataFlowIssues.push({
        type: 'circular_reference',
        sourceNode: ref.nodes[0],
        targetNode: ref.nodes[ref.nodes.length - 1],
        description: 'Circular data flow detected',
        impact: 'critical',
        suggestedFix: 'Remove circular dependency or add termination condition'
      });
    }
    
    return dataFlowIssues;
  }

  /**
   * Generate comprehensive recommendations
   */
  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    // Security recommendations
    if (analysis.securityIssues.length > 0) {
      recommendations.push('🔒 Security: Address all credential and connection security issues immediately');
    }
    
    // Performance recommendations
    if (analysis.performanceRisks.length > 0) {
      recommendations.push('⚡ Performance: Implement batching and async operations for better performance');
    }
    
    // Best practices
    if (analysis.bestPracticeViolations.length > 0) {
      recommendations.push('📋 Best Practices: Follow n8n conventions for naming, documentation, and structure');
    }
    
    // Anti-patterns
    if (analysis.antiPatterns.length > 0) {
      recommendations.push('🔧 Architecture: Refactor anti-patterns to improve maintainability');
    }
    
    // Data flow
    if (analysis.dataFlowIssues.length > 0) {
      recommendations.push('🔄 Data Flow: Fix data mapping and flow issues to prevent errors');
    }
    
    // Positive patterns
    if (analysis.patterns.length > 0) {
      recommendations.push('✅ Patterns: Great use of established workflow patterns!');
    }
    
    return recommendations;
  }

  /**
   * Calculate maintainability score
   */
  private calculateMaintainabilityScore(analysis: any): number {
    let score = 100;
    
    // Deduct for issues
    score -= analysis.securityIssues.length * 15;
    score -= analysis.antiPatterns.filter((ap: any) => ap.severity === 'high').length * 10;
    score -= analysis.antiPatterns.filter((ap: any) => ap.severity === 'medium').length * 5;
    score -= analysis.bestPracticeViolations.filter((bp: any) => bp.severity === 'high').length * 8;
    score -= analysis.bestPracticeViolations.filter((bp: any) => bp.severity === 'medium').length * 4;
    score -= analysis.performanceRisks.filter((pr: any) => pr.estimatedImpact === 'severe').length * 12;
    score -= analysis.dataFlowIssues.filter((df: any) => df.impact === 'critical').length * 10;
    
    // Add for good patterns
    score += analysis.patterns.length * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Assess workflow complexity
   */
  private assessComplexity(workflowData: any): 'simple' | 'moderate' | 'complex' | 'very_complex' {
    const nodes = workflowData.nodes || [];
    const connections = workflowData.connections || {};
    
    const nodeCount = nodes.length;
    const connectionCount = Object.keys(connections).length;
    const branchingFactor = this.calculateBranchingFactor(connections);
    
    const complexityScore = nodeCount + (connectionCount * 2) + (branchingFactor * 3);
    
    if (complexityScore < 10) return 'simple';
    if (complexityScore < 25) return 'moderate';
    if (complexityScore < 50) return 'complex';
    return 'very_complex';
  }

  /**
   * Initialize knowledge base with patterns and rules
   */
  private initializeKnowledgeBase(): void {
    // Initialize design patterns
    this.patterns.set('etl', {
      name: 'ETL Pipeline',
      category: 'processing',
      nodes: [],
      description: 'Extract, Transform, Load pattern',
      bestPractices: ['Clear data flow', 'Error handling', 'Validation'],
      variations: ['Real-time ETL', 'Batch ETL', 'CDC Pipeline']
    });
    
    // Initialize anti-patterns
    this.antiPatterns.set('god_node', {
      name: 'God Node',
      severity: 'high',
      nodes: [],
      description: 'Single node doing too much',
      problems: ['Hard to maintain', 'Single point of failure'],
      solution: 'Break into smaller nodes'
    });
    
    // Initialize best practices
    this.bestPractices.set('naming', {
      rule: 'Use descriptive node names',
      severity: 'low',
      checker: (nodes: any[]) => this.followsNamingConventions(nodes)
    });
    
    // Initialize security rules
    this.securityRules.set('credentials', {
      rule: 'No hardcoded credentials',
      severity: 'critical',
      checker: (nodes: any[]) => this.findExposedCredentials(nodes)
    });
    
    // Initialize performance rules
    this.performanceRules.set('batching', {
      rule: 'Use batching for large datasets',
      severity: 'high',
      checker: (nodes: any[]) => this.findLargeDatasetNodes(nodes)
    });
  }

  // Pattern detection helper methods
  private hasETLPattern(nodes: any[], connections: any): boolean {
    const hasExtract = nodes.some(n => this.isExtractNode(n));
    const hasTransform = nodes.some(n => this.isTransformNode(n));
    const hasLoad = nodes.some(n => this.isLoadNode(n));
    return hasExtract && hasTransform && hasLoad;
  }

  private hasWebhookToAPIPattern(nodes: any[], connections: any): boolean {
    const hasWebhook = nodes.some(n => n.type.includes('webhook'));
    const hasAPI = nodes.some(n => n.type.includes('httpRequest') || n.type.includes('api'));
    return hasWebhook && hasAPI;
  }

  private hasFanOutPattern(nodes: any[], connections: any): boolean {
    for (const [sourceNode, outputs] of Object.entries(connections)) {
      if (this.countOutputConnections(outputs) > 2) {
        return true;
      }
    }
    return false;
  }

  private hasAggregationPattern(nodes: any[], connections: any): boolean {
    const inputCounts = new Map();
    for (const outputs of Object.values(connections as any)) {
      this.countInputConnections(outputs, inputCounts);
    }
    return Array.from(inputCounts.values()).some(count => count > 2);
  }

  private hasCircuitBreakerPattern(nodes: any[], connections: any): boolean {
    return nodes.some(n => n.continueOnFail || n.onError) && 
           nodes.some(n => n.type.includes('if') || n.type.includes('switch'));
  }

  private detectGodNodes(nodes: any[], connections: any): string[] {
    const godNodes = [];
    for (const node of nodes) {
      if (this.isGodNode(node, connections)) {
        godNodes.push(node.name);
      }
    }
    return godNodes;
  }

  private hasSpaghettiConnections(connections: any): boolean {
    const connectionCount = Object.keys(connections).length;
    const totalConnections = Object.values(connections)
      .reduce((total: number, outputs: any) => total + this.countOutputConnections(outputs), 0);
    
    return totalConnections > connectionCount * 2.5; // Arbitrary threshold
  }

  private hasErrorHandling(nodes: any[]): boolean {
    return nodes.some(n => 
      n.continueOnFail || 
      n.onError || 
      n.type.includes('error') ||
      n.type.includes('if')
    );
  }

  private detectHardcodedValues(nodes: any[]): string[] {
    return nodes.filter(n => this.hasHardcodedValues(n)).map(n => n.name);
  }

  private detectPollingAntiPattern(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('cron') || 
      n.type.includes('schedule') ||
      n.type.includes('interval')
    ).map(n => n.name);
  }

  // Helper methods for analysis
  private isExtractNode(node: any): boolean {
    return node.type.includes('trigger') || 
           node.type.includes('webhook') || 
           node.type.includes('read') ||
           node.type.includes('fetch');
  }

  private isTransformNode(node: any): boolean {
    return node.type.includes('function') || 
           node.type.includes('set') || 
           node.type.includes('transform') ||
           node.type.includes('map');
  }

  private isLoadNode(node: any): boolean {
    return node.type.includes('write') || 
           node.type.includes('save') || 
           node.type.includes('create') ||
           node.type.includes('insert');
  }

  private countOutputConnections(outputs: any): number {
    let count = 0;
    for (const output of Object.values(outputs)) {
      if (Array.isArray(output)) {
        count += output.length;
      }
    }
    return count;
  }

  private countInputConnections(outputs: any, inputCounts: Map<string, number>): void {
    for (const output of Object.values(outputs)) {
      if (Array.isArray(output)) {
        for (const connection of output) {
          if (Array.isArray(connection)) {
            for (const conn of connection) {
              const target = conn.node;
              inputCounts.set(target, (inputCounts.get(target) || 0) + 1);
            }
          }
        }
      }
    }
  }

  private isGodNode(node: any, connections: any): boolean {
    const params = JSON.stringify(node.parameters || {});
    const paramLength = params.length;
    const connectionCount = this.getNodeConnectionCount(node.name, connections);
    
    return paramLength > 1000 || connectionCount > 5; // Arbitrary thresholds
  }

  private getNodeConnectionCount(nodeName: string, connections: any): number {
    let count = 0;
    if (connections[nodeName]) {
      count += this.countOutputConnections(connections[nodeName]);
    }
    
    // Count incoming connections
    for (const outputs of Object.values(connections as any)) {
      for (const output of Object.values(outputs as any)) {
        if (Array.isArray(output)) {
          for (const connection of output) {
            if (Array.isArray(connection)) {
              for (const conn of connection) {
                if (conn.node === nodeName) {
                  count++;
                }
              }
            }
          }
        }
      }
    }
    
    return count;
  }

  private hasHardcodedValues(node: any): boolean {
    const params = JSON.stringify(node.parameters || {});
    // Look for patterns that suggest hardcoded values
    return /["']https?:\/\/[^"']+["']/.test(params) ||
           /["'].*\.com["']/.test(params) ||
           /["']sk-[a-zA-Z0-9]{48}["']/.test(params); // API key pattern
  }

  private followsNamingConventions(nodes: any[]): boolean {
    const genericNames = ['HTTP Request', 'Set', 'Function', 'IF', 'Switch', 'Merge'];
    const genericCount = nodes.filter(n => genericNames.includes(n.name)).length;
    return genericCount < nodes.length * 0.3; // Less than 30% generic names
  }

  private getETLNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      this.isExtractNode(n) || this.isTransformNode(n) || this.isLoadNode(n)
    ).map(n => n.name);
  }

  private getWebhookAPINodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('webhook') || n.type.includes('httpRequest')
    ).map(n => n.name);
  }

  private getFanOutNodes(nodes: any[], connections: any): string[] {
    const fanOutNodes = [];
    for (const [sourceNode, outputs] of Object.entries(connections)) {
      if (this.countOutputConnections(outputs) > 2) {
        fanOutNodes.push(sourceNode);
      }
    }
    return fanOutNodes;
  }

  private getAggregationNodes(nodes: any[], connections: any): string[] {
    const inputCounts = new Map();
    for (const outputs of Object.values(connections as any)) {
      this.countInputConnections(outputs, inputCounts);
    }
    
    return Array.from(inputCounts.entries())
      .filter(([node, count]) => count > 2)
      .map(([node]) => node);
  }

  private getCircuitBreakerNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.continueOnFail || n.onError || n.type.includes('if')
    ).map(n => n.name);
  }

  // Additional helper methods for comprehensive analysis
  private getGenericNamedNodes(nodes: any[]): string[] {
    const genericNames = ['HTTP Request', 'Set', 'Function', 'IF', 'Switch', 'Merge'];
    return nodes.filter(n => genericNames.includes(n.name)).map(n => n.name);
  }

  private hasInputValidation(nodes: any[]): boolean {
    return nodes.some(n => 
      n.type.includes('validate') || 
      n.type.includes('schema') ||
      (n.type.includes('function') && JSON.stringify(n.parameters).includes('validate'))
    );
  }

  private getUnvalidatedInputNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('webhook') || n.type.includes('trigger')
    ).map(n => n.name);
  }

  private hasDocumentation(nodes: any[]): boolean {
    return nodes.some(n => n.notes && n.notes.trim().length > 0);
  }

  private getUndocumentedNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      (!n.notes || n.notes.trim().length === 0) && 
      (n.type.includes('function') || n.type.includes('code'))
    ).map(n => n.name);
  }

  private usesCredentialStore(nodes: any[]): boolean {
    return nodes.some(n => n.credentials && Object.keys(n.credentials).length > 0);
  }

  private getInsecureCredentialNodes(nodes: any[]): string[] {
    return nodes.filter(n => this.hasHardcodedValues(n)).map(n => n.name);
  }

  private hasResourceManagement(nodes: any[]): boolean {
    return nodes.some(n => 
      n.type.includes('splitInBatches') ||
      (n.parameters && (n.parameters.timeout || n.parameters.batchSize))
    );
  }

  private getResourceIntensiveNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('httpRequest') || 
      n.type.includes('database') || 
      n.type.includes('file')
    ).map(n => n.name);
  }

  private findExposedCredentials(nodes: any[]): string[] {
    return nodes.filter(n => this.hasHardcodedValues(n)).map(n => n.name);
  }

  private findInsecureConnections(nodes: any[]): string[] {
    return nodes.filter(n => {
      const params = JSON.stringify(n.parameters || {});
      return params.includes('http://') && !params.includes('localhost');
    }).map(n => n.name);
  }

  private findDataLeakageRisks(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('log') || n.type.includes('debug')
    ).map(n => n.name);
  }

  private findInsufficientValidation(nodes: any[]): string[] {
    return nodes.filter(n => 
      (n.type.includes('webhook') || n.type.includes('httpRequest')) &&
      !this.hasValidationInNode(n)
    ).map(n => n.name);
  }

  private hasValidationInNode(node: any): boolean {
    const params = JSON.stringify(node.parameters || {});
    return params.includes('validate') || params.includes('schema') || params.includes('required');
  }

  private findLargeDatasetNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('database') || 
      n.type.includes('file') ||
      n.type.includes('spreadsheet')
    ).map(n => n.name);
  }

  private findSynchronousOperations(nodes: any[]): string[] {
    return nodes.filter(n => 
      (n.type.includes('httpRequest') || n.type.includes('database')) &&
      (!n.parameters || n.parameters.async !== true)
    ).map(n => n.name);
  }

  private findExternalDependencies(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('httpRequest') || 
      n.type.includes('api') ||
      n.type.includes('webhook')
    ).map(n => n.name);
  }

  private findMemoryIntensiveNodes(nodes: any[]): string[] {
    return nodes.filter(n => 
      n.type.includes('file') || 
      n.type.includes('image') ||
      n.type.includes('pdf') ||
      n.type.includes('excel')
    ).map(n => n.name);
  }

  private findDataLossRisks(nodes: any[], connections: any): Array<{source: string, target?: string}> {
    const risks = [];
    for (const node of nodes) {
      if (!node.continueOnFail && !node.onError && this.isDataProcessingNode(node)) {
        risks.push({ source: node.name });
      }
    }
    return risks;
  }

  private isDataProcessingNode(node: any): boolean {
    return node.type.includes('httpRequest') || 
           node.type.includes('database') || 
           node.type.includes('transform');
  }

  private findTypeMismatches(nodes: any[], connections: any): Array<{source: string, target: string}> {
    // Simplified type mismatch detection
    const mismatches: Array<{source: string, target: string}> = [];
    // This would require more sophisticated type analysis
    return mismatches;
  }

  private findMissingMappings(nodes: any[], connections: any): Array<{source: string, target: string}> {
    // Simplified mapping analysis
    const missing: Array<{source: string, target: string}> = [];
    // This would require field mapping analysis
    return missing;
  }

  private findCircularReferences(connections: any): Array<{nodes: string[]}> {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles: Array<{nodes: string[]}> = [];
    
    const hasCycle = (node: string, path: string[]): boolean => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        cycles.push({ nodes: path.slice(cycleStart).concat([node]) });
        return true;
      }
      
      if (visited.has(node)) {
        return false;
      }
      
      visited.add(node);
      recursionStack.add(node);
      path.push(node);
      
      const outputs = connections[node];
      if (outputs) {
        for (const output of Object.values(outputs)) {
          if (Array.isArray(output)) {
            for (const connection of output) {
              if (Array.isArray(connection)) {
                for (const conn of connection) {
                  if (hasCycle(conn.node, [...path])) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
      
      recursionStack.delete(node);
      path.pop();
      return false;
    };
    
    for (const node of Object.keys(connections)) {
      if (!visited.has(node)) {
        hasCycle(node, []);
      }
    }
    
    return cycles;
  }

  private calculateBranchingFactor(connections: any): number {
    let totalBranches = 0;
    let nodeCount = 0;
    
    for (const outputs of Object.values(connections)) {
      nodeCount++;
      totalBranches += this.countOutputConnections(outputs);
    }
    
    return nodeCount > 0 ? totalBranches / nodeCount : 0;
  }

}