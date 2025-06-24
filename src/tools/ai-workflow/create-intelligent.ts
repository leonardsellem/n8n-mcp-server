/**
 * Universal Workflow Creator - Phase 2 AI Agent Workflow Tools
 * 
 * This module provides universal AI-powered workflow creation capabilities
 * that work with any AI agent and any workflow description, leveraging the
 * Phase 1 Enhanced Discovery system for optimal node selection.
 */

import { ToolCallResult } from '../../types/index.js';
import { BaseAIWorkflowHandler, WorkflowIntent, UniversalOptimization } from './base-handler.js';
import { universalNodeCatalog } from '../../discovery/index.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';

/**
 * Universal workflow creation result
 */
export interface UniversalWorkflowResult {
  success: boolean;
  workflow: any;
  intent_analysis: WorkflowIntent;
  optimization: UniversalOptimization;
  webhook_urls: string[];
  configuration_guide: {
    required_credentials: string[];
    optional_settings: string[];
    testing_instructions: string[];
    deployment_notes: string[];
  };
  universal_compatibility: {
    ai_agent_support: string[];
    platform_compatibility: string[];
    integration_options: string[];
  };
  performance_metrics: {
    estimated_execution_time: string;
    complexity_score: number;
    reliability_score: number;
    maintainability_score: number;
  };
}

/**
 * Universal Workflow Creator Handler
 * Creates AI-powered workflows that work universally across all platforms
 */
export class UniversalWorkflowCreator extends BaseAIWorkflowHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['description']);
      
      const {
        description,
        complexity = 'auto',
        preferred_integrations = [],
        trigger_type = 'auto',
        output_format = 'json',
        name,
        optimize_for_universal_use = true
      } = args;

      console.error(`[UniversalWorkflowCreator] Creating universal workflow for: "${description}"`);

      try {
        // Phase 1: AI-powered workflow analysis using Enhanced Discovery
        const intent = await this.analyzeWorkflowIntent(description);
        console.error(`[UniversalWorkflowCreator] Intent analysis complete - confidence: ${intent.confidence}`);
        
        // Phase 2: Discover optimal nodes using Phase 1 Enhanced Discovery
        const matchingNodes = await this.discoverMatchingNodes(intent, 25);
        console.error(`[UniversalWorkflowCreator] Discovered ${matchingNodes.length} matching nodes`);
        
        // Phase 3: Generate universal workflow structure
        const workflowStructure = await this.generateWorkflowStructure(intent, matchingNodes, name);
        console.error(`[UniversalWorkflowCreator] Generated workflow with ${workflowStructure.nodes.length} nodes`);
        
        // Phase 4: Apply universal optimizations
        let optimization: UniversalOptimization;
        if (optimize_for_universal_use) {
          optimization = await this.optimizeForUniversalUse(workflowStructure);
          console.error(`[UniversalWorkflowCreator] Applied ${optimization.performance_improvements.length} optimizations`);
        } else {
          optimization = {
            performance_improvements: [],
            reliability_enhancements: [],
            cost_optimizations: [],
            recommended_alternatives: []
          };
        }
        
        // Phase 5: Create the workflow in n8n
        const createdWorkflow = await this.apiService.createWorkflow(workflowStructure);
        console.error(`[UniversalWorkflowCreator] Created workflow with ID: ${createdWorkflow.id}`);
        
        // Phase 6: Generate universal compatibility information
        const webhookUrls = this.extractWebhookUrls(createdWorkflow);
        const configurationGuide = this.generateConfigurationGuide(createdWorkflow, intent);
        const universalCompatibility = this.generateUniversalCompatibility(intent, matchingNodes);
        const performanceMetrics = this.calculatePerformanceMetrics(intent, workflowStructure, optimization);
        
        const result: UniversalWorkflowResult = {
          success: true,
          workflow: {
            id: createdWorkflow.id,
            name: createdWorkflow.name,
            active: createdWorkflow.active,
            nodes: createdWorkflow.nodes.length,
            connections: Object.keys(createdWorkflow.connections || {}).length,
            webhook_endpoints: webhookUrls,
            created_at: new Date().toISOString()
          },
          intent_analysis: intent,
          optimization,
          webhook_urls: webhookUrls,
          configuration_guide: configurationGuide,
          universal_compatibility: universalCompatibility,
          performance_metrics: performanceMetrics
        };

        return this.formatSuccess(
          result,
          `Universal AI Workflow created successfully: "${createdWorkflow.name}" with ${intent.confidence * 100}% confidence`
        );
      } catch (error) {
        console.error(`[UniversalWorkflowCreator] Creation failed:`, error);
        throw new Error(`Failed to create universal workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, args);
  }
  
  /**
   * Extract webhook URLs from created workflow
   */
  private extractWebhookUrls(workflow: any): string[] {
    const webhookUrls: string[] = [];
    
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (node.type === 'n8n-nodes-base.webhook' && node.webhookId) {
          // Generate webhook URL (this would be customized based on n8n instance)
          const baseUrl = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook';
          webhookUrls.push(`${baseUrl}/${node.webhookId}`);
        }
      }
    }
    
    return webhookUrls;
  }
  
  /**
   * Generate configuration guide for universal workflow
   */
  private generateConfigurationGuide(workflow: any, intent: WorkflowIntent): any {
    const requiredCredentials: string[] = [];
    const optionalSettings: string[] = [];
    const testingInstructions: string[] = [];
    const deploymentNotes: string[] = [];
    
    // Analyze nodes for credential requirements
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (node.type.includes('email')) {
          requiredCredentials.push('Email SMTP credentials');
        }
        if (node.type.includes('slack')) {
          requiredCredentials.push('Slack bot token');
        }
        if (node.type.includes('google')) {
          requiredCredentials.push('Google API credentials');
        }
        if (node.type.includes('postgres') || node.type.includes('mysql')) {
          requiredCredentials.push('Database connection credentials');
        }
        if (node.type.includes('httpRequest')) {
          optionalSettings.push('API endpoint authentication');
        }
      }
    }
    
    // Generate testing instructions
    testingInstructions.push('Test workflow with sample data before production use');
    if (intent.triggers.includes('webhook')) {
      testingInstructions.push('Send test webhook payload to verify trigger functionality');
    }
    if (intent.triggers.includes('schedule')) {
      testingInstructions.push('Verify schedule trigger timing and frequency');
    }
    
    // Generate deployment notes
    deploymentNotes.push('Activate workflow after testing completion');
    deploymentNotes.push('Monitor execution logs for first 24 hours');
    if (intent.complexity === 'complex') {
      deploymentNotes.push('Consider implementing gradual rollout for complex workflows');
    }
    
    return {
      required_credentials: requiredCredentials,
      optional_settings: optionalSettings,
      testing_instructions: testingInstructions,
      deployment_notes: deploymentNotes
    };
  }
  
  /**
   * Generate universal compatibility information
   */
  private generateUniversalCompatibility(intent: WorkflowIntent, nodes: any[]): any {
    const aiAgentSupport = [
      'Claude (Anthropic)',
      'GPT-4 (OpenAI)',
      'Gemini (Google)',
      'LLaMA (Meta)',
      'Custom AI Agents'
    ];
    
    const platformCompatibility = [
      'n8n Cloud',
      'n8n Self-hosted',
      'Docker environments',
      'Kubernetes clusters'
    ];
    
    const integrationOptions: string[] = [];
    
    // Determine integrations based on detected intents
    if (intent.integrations.includes('slack')) {
      integrationOptions.push('Slack API integration');
    }
    if (intent.integrations.includes('google')) {
      integrationOptions.push('Google Workspace integration');
    }
    if (intent.integrations.includes('microsoft')) {
      integrationOptions.push('Microsoft 365 integration');
    }
    
    // Add universal integrations
    integrationOptions.push('REST API endpoints');
    integrationOptions.push('Webhook integrations');
    integrationOptions.push('Database connections');
    
    return {
      ai_agent_support: aiAgentSupport,
      platform_compatibility: platformCompatibility,
      integration_options: integrationOptions
    };
  }
  
  /**
   * Calculate performance metrics for the workflow
   */
  private calculatePerformanceMetrics(
    intent: WorkflowIntent,
    workflow: any,
    optimization: UniversalOptimization
  ): any {
    // Calculate complexity score
    const complexityFactors = {
      'simple': 1,
      'medium': 2,
      'complex': 3
    };
    const baseComplexity = complexityFactors[intent.complexity] || 2;
    const nodeComplexity = Math.min(workflow.nodes.length / 5, 2); // Max 2 for node count
    const complexityScore = Math.min(10, (baseComplexity + nodeComplexity) * 10 / 5);
    
    // Calculate reliability score based on optimizations
    const baseReliability = intent.confidence * 100;
    const optimizationBonus = optimization.reliability_enhancements.reduce(
      (sum, enhancement) => sum + enhancement.risk_reduction, 0
    );
    const reliabilityScore = Math.min(100, baseReliability + optimizationBonus);
    
    // Calculate maintainability score
    const maintainabilityScore = Math.max(60, 100 - (workflow.nodes.length * 2) + (intent.confidence * 20));
    
    // Estimate execution time
    const baseExecutionTime = workflow.nodes.length * 2; // 2 seconds per node
    const optimizationReduction = optimization.performance_improvements.reduce(
      (sum, improvement) => sum + improvement.estimated_gain, 0
    );
    const estimatedTime = Math.max(1, baseExecutionTime * (100 - optimizationReduction) / 100);
    
    return {
      estimated_execution_time: `${estimatedTime} seconds`,
      complexity_score: Math.round(complexityScore * 10) / 10,
      reliability_score: Math.round(reliabilityScore * 10) / 10,
      maintainability_score: Math.round(maintainabilityScore * 10) / 10
    };
  }
}

/**
 * AI-Powered workflow analysis for enhanced intent detection
 */
export async function analyzeWorkflowIntent(description: string): Promise<WorkflowIntent> {
  const handler = new UniversalWorkflowCreator();
  return handler['analyzeWorkflowIntent'](description); // Access protected method
}

/**
 * Discover matching nodes using Phase 1 Enhanced Discovery
 */
export async function discoverMatchingNodes(intent: WorkflowIntent, maxNodes: number = 20): Promise<any[]> {
  const handler = new UniversalWorkflowCreator();
  return handler['discoverMatchingNodes'](intent, maxNodes); // Access protected method
}

/**
 * Generate universal workflow structure
 */
export async function generateWorkflowStructure(
  intent: WorkflowIntent,
  matchingNodes: any[],
  name?: string
): Promise<any> {
  const handler = new UniversalWorkflowCreator();
  return handler['generateWorkflowStructure'](intent, matchingNodes, name); // Access protected method
}

/**
 * Optimize workflow for universal use
 */
export async function optimizeForUniversalUse(workflow: any): Promise<UniversalOptimization> {
  const handler = new UniversalWorkflowCreator();
  return handler['optimizeForUniversalUse'](workflow); // Access protected method
}