/**
 * Node Discovery Tools - Phase 1 Enhanced Discovery Integration
 *
 * Tools for discovering and understanding n8n node types using the
 * Phase 1 Enhanced Discovery system with Universal Node Catalog,
 * Dual Architecture, and Dynamic Discovery capabilities.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { NodeTypeInfo } from '../../data/node-types.js';
import { nodeDiscovery } from '../../helpers/node-discovery.js';
import { universalNodeCatalog } from '../../discovery/index.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';
import { dynamicNodeDiscovery } from '../../discovery/dynamic-discovery.js';
import { nodeParameterValidator } from '../../validation/node-parameter-validator.js';

/**
 * Handler for discovering node types
 */
export class DiscoverNodesHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { category, search, limit = 50, includeAiOptimized = true } = args;

      console.error(`[DiscoverNodesHandler] Using Phase 1 Enhanced Discovery - Universal Node Catalog`);

      let nodeTypes: NodeTypeInfo[] = [];
      
      // Use Phase 1 Universal Node Catalog for enhanced discovery
      if (category) {
        const categoryResult = await universalNodeCatalog.discoverByCategory(category);
        nodeTypes = Array.isArray(categoryResult) 
          ? categoryResult.map((item: any) => item.node || item).filter((node: any) => node && node.name)
          : [];
        console.error(`[DiscoverNodesHandler] Found ${nodeTypes.length} nodes in category '${category}'`);
      } else if (search) {
        const searchResult = await universalNodeCatalog.searchNodes(search, {
          maxResults: limit,
          includeAiOptimized,
          fuzzySearch: true
        });
        // Handle different return formats from search
        try {
          const searchData = searchResult as any;
          if (searchData && searchData.nodes && Array.isArray(searchData.nodes)) {
            nodeTypes = searchData.nodes.map((item: any) => item.node || item).filter((node: any) => node && node.name);
          } else if (Array.isArray(searchData)) {
            nodeTypes = searchData.map((item: any) => item.node || item).filter((node: any) => node && node.name);
          } else {
            nodeTypes = [];
          }
        } catch (error) {
          console.error('[DiscoverNodesHandler] Error processing search results:', error);
          nodeTypes = [];
        }
        console.error(`[DiscoverNodesHandler] Search '${search}' found ${nodeTypes.length} nodes with AI optimization`);
        
        // Include enhanced search metadata
        const enhancedResponse = {
          nodes: nodeTypes.map((node: NodeTypeInfo) => ({
            name: node.name,
            displayName: node.displayName,
            description: node.description,
            category: node.category,
            subcategory: node.subcategory,
            triggerNode: node.triggerNode,
            regularNode: node.regularNode,
            webhookSupport: node.webhookSupport,
            codeable: node.codeable,
            credentials: node.credentials,
            inputCount: node.inputs?.length || 0,
            outputCount: node.outputs?.length || 0
          })),
          totalFound: (searchResult as any)?.totalCount || nodeTypes.length,
          categories: (searchResult as any)?.categories || [],
          suggestions: (searchResult as any)?.suggestions || [],
          relatedNodes: (searchResult as any)?.relatedNodes?.slice(0, 3).map((node: any) => node.displayName) || [],
          aiOptimizedVariants: (searchResult as any)?.aiOptimizedVariants?.length || 0,
          statistics: universalNodeCatalog.getNodeStatistics()
        };

        return this.formatSuccess(
          enhancedResponse,
          `Enhanced search found ${nodeTypes.length} nodes with AI optimization suggestions`
        );
      } else {
        // Get all nodes with statistics
        nodeTypes = await universalNodeCatalog.getAllAvailableNodes();
        console.error(`[DiscoverNodesHandler] Retrieved ${nodeTypes.length} total nodes from Universal Catalog`);
      }

      // Limit results if needed
      const limitedResults = nodeTypes.slice(0, limit);
      
      // Get enhanced statistics and ecosystem information
      const statistics = universalNodeCatalog.getNodeStatistics();
      const aiEcosystem = universalNodeCatalog.getAiEcosystem();
      const platformIntegrations = universalNodeCatalog.getPlatformIntegrations();

      const response = {
        nodes: limitedResults.map(node => ({
          name: node.name,
          displayName: node.displayName,
          description: node.description,
          category: node.category,
          subcategory: node.subcategory,
          triggerNode: node.triggerNode,
          regularNode: node.regularNode,
          webhookSupport: node.webhookSupport,
          codeable: node.codeable,
          credentials: node.credentials,
          inputCount: node.inputs?.length || 0,
          outputCount: node.outputs?.length || 0
        })),
        totalFound: nodeTypes.length,
        categories: universalNodeCatalog.getNodeCategories(),
        statistics: {
          totalNodes: statistics.totalNodes,
          aiNodes: statistics.aiNodes,
          regularNodes: statistics.regularNodes,
          topIntegrations: statistics.topIntegrations.slice(0, 5),
          coverage: statistics.coverage
        },
        ecosystem: {
          aiCapabilities: {
            chatModels: aiEcosystem.chatModels.length,
            vectorStores: aiEcosystem.vectorStores.length,
            embeddings: aiEcosystem.embeddings.length,
            agents: aiEcosystem.agents.length
          },
          platformCoverage: {
            communication: platformIntegrations.communication.length,
            databases: platformIntegrations.databases.length,
            cloud: platformIntegrations.cloud.length,
            business: platformIntegrations.business.length
          }
        }
      };

      return this.formatSuccess(
        response,
        `Universal Catalog: Found ${limitedResults.length} of ${statistics.totalNodes} nodes (${statistics.aiNodes} AI-optimized)`
      );
    }, args);
  }
}

/**
 * Handler for getting detailed node information with AI optimization
 */
export class GetNodeInfoHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { nodeType, includeAiOptimizations = true, includeAlternatives = true } = args;

      if (!nodeType) {
        throw new Error('Missing required parameter: nodeType');
      }

      console.error(`[GetNodeInfoHandler] Using Phase 1 Enhanced Discovery for: ${nodeType}`);

      // First check if node exists in Universal Catalog
      const allNodes = await universalNodeCatalog.getAllAvailableNodes();
      const nodeInfo = allNodes.find(node => node.name === nodeType);
      
      if (!nodeInfo) {
        throw new Error(`Node type not found: ${nodeType}`);
      }

      // Get AI-optimized tool variant using Dual Architecture
      let toolVariant = null;
      let aiOptimizations = null;
      if (includeAiOptimizations) {
        try {
          toolVariant = await dualNodeArchitecture.getToolVariant(nodeInfo);
          aiOptimizations = await dualNodeArchitecture.getAIOptimizedParameters(nodeType);
        } catch (error) {
          console.error(`[GetNodeInfoHandler] AI optimization failed for ${nodeType}:`, error);
        }
      }

      // Get alternative nodes and compatibility info
      let alternatives: any[] = [];
      if (includeAlternatives) {
        try {
          const alternativeSuggestions = await dynamicNodeDiscovery.findAlternativeNodes(nodeInfo, {
            exclude_categories: [],
            require_features: [],
            performance_requirements: []
          });
          alternatives = alternativeSuggestions.slice(0, 3).map(alt => ({
            node: {
              name: alt.alternative.name,
              displayName: alt.alternative.displayName,
              description: alt.alternative.description,
              category: alt.alternative.category
            },
            reason: alt.reason,
            benefits: alt.benefits,
            migrationEffort: alt.migration_effort
          }));
        } catch (error) {
          console.error(`[GetNodeInfoHandler] Alternative discovery failed:`, error);
        }
      }

      // Get detailed node definitions using Dynamic Discovery
      let detailedDefinition = null;
      try {
        const definitions = await dynamicNodeDiscovery.getNodeDefinitions([nodeType]);
        detailedDefinition = definitions[0];
      } catch (error) {
        console.error(`[GetNodeInfoHandler] Detailed definition failed:`, error);
      }

      const enhancedResponse = {
        // Base node information
        base: nodeInfo,
        
        // AI optimizations from Dual Architecture
        aiOptimizations: toolVariant ? {
          available: true,
          toolVariant: {
            name: toolVariant.name,
            displayName: toolVariant.displayName,
            aiOptimized: toolVariant.aiOptimized,
            performanceProfile: toolVariant.performanceProfile
          },
          optimizedParameters: aiOptimizations?.slice(0, 5) || [],
          suggestedValues: toolVariant.suggestedValues?.slice(0, 3) || []
        } : { available: false },

        // Alternative nodes
        alternatives,

        // Enhanced capabilities from Dynamic Discovery
        capabilities: detailedDefinition ? {
          runtime: detailedDefinition.runtime,
          optimization: detailedDefinition.optimization,
          compatibility: detailedDefinition.compatibility,
          examples: detailedDefinition.examples?.slice(0, 2) || []
        } : null,

        // Usage recommendations
        recommendations: {
          bestPractices: [
            `Use ${nodeInfo.displayName} for ${nodeInfo.category.toLowerCase()} operations`,
            toolVariant ? "AI-optimized variant available for enhanced performance" : "Consider exploring AI optimization options",
            nodeInfo.triggerNode ? "Ideal as workflow entry point" : "Best used in workflow processing chain"
          ],
          commonPatterns: toolVariant?.chainCompatibility?.commonPatterns?.slice(0, 2) || [],
          performanceNotes: toolVariant?.performanceProfile ? [
            `Execution time: ${toolVariant.performanceProfile.executionTime}`,
            `Resource usage: ${toolVariant.performanceProfile.resourceUsage}`,
            `Reliability score: ${Math.round((toolVariant.performanceProfile.reliability || 0.9) * 100)}%`
          ] : []
        }
      };

      return this.formatSuccess(
        enhancedResponse,
        `Enhanced node info for ${nodeInfo.displayName} with ${toolVariant ? 'AI optimizations' : 'standard capabilities'}`
      );
    }, args);
  }
}

/**
 * Handler for suggesting nodes based on use case with AI-powered intent discovery
 */
export class SuggestNodesHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { description, maxSuggestions = 5, includeChainSuggestions = true, includeOptimalVariants = true } = args;

      if (!description) {
        throw new Error('Missing required parameter: description');
      }

      console.error(`[SuggestNodesHandler] Using Phase 1 Enhanced Discovery for intent: "${description}"`);

      // Use Phase 1 Universal Node Catalog for intent-based discovery
      const intentBasedSuggestions: NodeTypeInfo[] = (await universalNodeCatalog.discoverByIntent(description))
        .map((item: any) => item.node || item).filter((node: any) => node && node.name);
      console.error(`[SuggestNodesHandler] Intent discovery found ${intentBasedSuggestions.length} nodes`);

      // Get node chain suggestions using Universal Node Catalog
      let chainSuggestions: any[] = [];
      if (includeChainSuggestions) {
        try {
          const workflowDescription = {
            intent: description,
            inputData: undefined,
            expectedOutput: undefined,
            constraints: [],
            preferences: {
              speed: 'balanced' as const,
              reliability: 'high' as const,
              cost: 'medium' as const
            }
          };
          chainSuggestions = await universalNodeCatalog.getNodeChainSuggestions(description || 'general');
          console.error(`[SuggestNodesHandler] Found ${chainSuggestions.length} workflow chain suggestions`);
        } catch (error) {
          console.error(`[SuggestNodesHandler] Chain suggestions failed:`, error);
        }
      }

      // Get AI-optimized variants using Dual Architecture
      let optimizedSuggestions: any[] = [];
      if (includeOptimalVariants) {
        try {
          for (const node of intentBasedSuggestions.slice(0, maxSuggestions)) {
            const toolVariant = await dualNodeArchitecture.getToolVariant(node as NodeTypeInfo);
            if (toolVariant) {
              optimizedSuggestions.push({
                base: node,
                optimized: toolVariant,
                parameterSuggestions: await dualNodeArchitecture.suggestParameterValues((node as NodeTypeInfo).name, { intent: description })
              });
            }
          }
          console.error(`[SuggestNodesHandler] Generated ${optimizedSuggestions.length} AI-optimized variants`);
        } catch (error) {
          console.error(`[SuggestNodesHandler] AI optimization failed:`, error);
        }
      }

      // Dynamic discovery for optimal node selection
      let optimalNode: any[] = [];
      try {
        optimalNode = await dynamicNodeDiscovery.suggestOptimalNodes({
          description,
          inputTypes: [],
          outputTypes: [],
          requirements: [
            {
              type: 'functional',
              description: description,
              priority: 'must',
              measurable: false,
              criteria: 'matches use case'
            }
          ],
          constraints: [],
          preferences: []
        });
        console.error(`[SuggestNodesHandler] Dynamic discovery found ${optimalNode.length} optimal suggestions`);
      } catch (error) {
        console.error(`[SuggestNodesHandler] Dynamic discovery failed:`, error);
        optimalNode = [];
      }

      const limitedSuggestions = intentBasedSuggestions.slice(0, maxSuggestions);

      const enhancedResponse = {
        // Primary suggestions from intent discovery
        suggestions: limitedSuggestions.map((node: NodeTypeInfo) => ({
          name: node.name,
          displayName: node.displayName,
          description: node.description,
          category: node.category,
          subcategory: node.subcategory,
          relevantProperties: node.properties?.slice(0, 3).map((prop: any) => ({
            name: prop.name,
            displayName: prop.displayName,
            type: prop.type,
            required: prop.required,
            description: prop.description
          })) || []
        })),

        // AI-optimized variants
        aiOptimizedVariants: optimizedSuggestions.map(opt => ({
          baseName: opt.base.name,
          optimizedName: opt.optimized.name,
          optimizedDisplayName: opt.optimized.displayName,
          aiEnhancements: opt.optimized.aiOptimized,
          parameterSuggestions: opt.parameterSuggestions?.slice(0, 2) || [],
          performanceProfile: opt.optimized.performanceProfile
        })),

        // Workflow chain suggestions
        workflowChains: chainSuggestions.slice(0, 3).map(chain => ({
          nodes: chain.chain?.map((node: any) => ({
            name: node.name,
            displayName: node.displayName,
            category: node.category
          })) || [],
          reasoning: chain.reasoning,
          confidence: chain.confidence,
          estimatedTime: chain.estimatedTime,
          complexity: chain.complexity
        })),

        // Dynamic discovery insights
        optimalRecommendations: optimalNode?.slice(0, 2).map(suggestion => ({
          node: {
            name: suggestion.node.name,
            displayName: suggestion.node.displayName,
            description: suggestion.node.description
          },
          confidence: suggestion.confidence,
          reasoning: suggestion.reasoning,
          benefits: suggestion.benefits,
          estimatedImpact: suggestion.estimatedImpact
        })) || [],

        // Enhanced metadata
        analysisMetadata: {
          intentMatches: intentBasedSuggestions.length,
          aiOptimizationsAvailable: optimizedSuggestions.length,
          workflowPatternsFound: chainSuggestions.length,
          optimalSuggestionsFound: optimalNode?.length || 0,
          useCase: description
        }
      };

      return this.formatSuccess(
        enhancedResponse,
        `Phase 1 Enhanced Discovery: Found ${limitedSuggestions.length} intent-based suggestions with ${optimizedSuggestions.length} AI optimizations`
      );
    }, args);
  }
}

/**
 * Handler for validating node configuration with comprehensive parameter analysis
 */
export class ValidateNodeHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { nodeType, parameters = {}, includeOptimizationAnalysis = true } = args;

      if (!nodeType) {
        throw new Error('Missing required parameter: nodeType');
      }

      console.error(`[ValidateNodeHandler] Using comprehensive parameter validation for: ${nodeType}`);

      // Comprehensive parameter validation
      const comprehensiveValidation = await nodeParameterValidator.validateNodeParameters(nodeType, parameters);
      
      // Basic validation using legacy system for backward compatibility
      const basicValidation = nodeDiscovery.validateNode(nodeType, parameters);

      // Enhanced validation using Dual Architecture
      let enhancedValidation = null;
      let optimizedConfig = null;
      if (includeOptimizationAnalysis) {
        try {
          const nodeConfig = {
            nodeType,
            parameters,
            optimizations: {
              aiEnhanced: false,
              autoParameterSuggestion: false,
              contextAwareDefaults: false,
              performanceOptimized: false,
              errorHandlingEnhanced: false
            },
            metadata: {
              version: '1.0.0',
              lastOptimized: new Date().toISOString(),
              optimizationScore: 0,
              recommendations: [],
              warnings: []
            }
          };

          enhancedValidation = await dualNodeArchitecture.validateNodeConfiguration(nodeConfig);
          
          if (enhancedValidation.score < 80) {
            optimizedConfig = await dualNodeArchitecture.optimizeNodeConfiguration(nodeConfig);
            console.error(`[ValidateNodeHandler] Generated optimized configuration (score: ${enhancedValidation.score} -> ${optimizedConfig.metadata.optimizationScore})`);
          }
        } catch (error) {
          console.error(`[ValidateNodeHandler] Enhanced validation failed:`, error);
        }
      }

      // Get AI-optimized parameters for comparison
      let aiParameters: any[] = [];
      try {
        aiParameters = await dualNodeArchitecture.getAIOptimizedParameters(nodeType);
      } catch (error) {
        console.error(`[ValidateNodeHandler] AI parameter analysis failed:`, error);
      }

      const enhancedResponse = {
        // Comprehensive validation results (PRIMARY)
        comprehensive: {
          valid: comprehensiveValidation.valid,
          score: comprehensiveValidation.score,
          errors: comprehensiveValidation.errors.map(err => ({
            parameter: err.parameter,
            message: err.message,
            severity: err.severity,
            suggestion: err.suggestion
          })),
          warnings: comprehensiveValidation.warnings.map(warn => ({
            parameter: warn.parameter,
            message: warn.message,
            recommendation: warn.recommendation
          })),
          suggestions: comprehensiveValidation.suggestions
        },

        // Basic validation results (backward compatibility)
        basic: {
          valid: basicValidation.valid,
          errors: basicValidation.errors,
          warnings: basicValidation.warnings,
          suggestions: basicValidation.suggestions
        },

        // Enhanced validation from Dual Architecture
        enhanced: enhancedValidation ? {
          valid: enhancedValidation.valid,
          score: enhancedValidation.score,
          issues: enhancedValidation.issues,
          suggestions: enhancedValidation.suggestions,
          optimizedConfigAvailable: !!optimizedConfig
        } : null,

        // AI optimization analysis
        aiAnalysis: {
          optimizedParametersAvailable: aiParameters.length,
          parameterRecommendations: aiParameters.slice(0, 3).map(param => ({
            name: param.name,
            aiDefault: param.aiDefault,
            aiDescription: param.aiDescription,
            contextAware: param.contextAware,
            currentValue: parameters[param.name],
            recommended: param.aiDefault !== undefined && parameters[param.name] !== param.aiDefault
          })),
          missingOptimizations: aiParameters.filter(param =>
            param.aiDefault !== undefined && !parameters.hasOwnProperty(param.name)
          ).map(param => param.name)
        },

        // Optimization suggestions
        optimizedConfiguration: optimizedConfig ? {
          parameters: optimizedConfig.parameters,
          optimizationScore: optimizedConfig.metadata.optimizationScore,
          recommendations: optimizedConfig.metadata.recommendations,
          improvements: [
            'AI-enhanced parameter defaults',
            'Performance optimizations enabled',
            'Context-aware parameter suggestions',
            'Enhanced error handling'
          ]
        } : null,

        // Configuration metadata
        metadata: {
          nodeType,
          originalParameters: parameters,
          validationTimestamp: new Date().toISOString(),
          comprehensiveAnalysisPerformed: true,
          enhancedAnalysisPerformed: !!enhancedValidation,
          aiOptimizationsAvailable: aiParameters.length > 0,
          validationMethod: 'comprehensive-parameter-analysis'
        }
      };

      const isValid = comprehensiveValidation.valid && basicValidation.valid && (!enhancedValidation || enhancedValidation.valid);
      const score = comprehensiveValidation.score;

      return this.formatSuccess(
        enhancedResponse,
        `Comprehensive validation: ${isValid ? 'Valid' : 'Invalid'} (Score: ${score}/100) - ${comprehensiveValidation.errors.length} errors, ${comprehensiveValidation.warnings.length} warnings`
      );
    }, args);
  }
}

/**
 * Handler for generating intelligent workflow skeleton with Phase 1 Enhanced Discovery
 */
export class GenerateWorkflowSkeletonHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { description, complexity = 'auto', includeAiOptimizations = true, includeAlternatives = false } = args;

      if (!description) {
        throw new Error('Missing required parameter: description');
      }

      console.error(`[GenerateWorkflowSkeletonHandler] Using Phase 1 Enhanced Discovery for: "${description}"`);

      // Generate basic skeleton using legacy system as fallback
      const basicSkeleton = nodeDiscovery.generateWorkflowSkeleton(description);
      
      if (basicSkeleton.error) {
        throw new Error(basicSkeleton.error);
      }

      // Enhanced workflow generation using Dynamic Discovery
      let enhancedSequence = null;
      try {
        const workflowGoal = {
          objective: description,
          success_criteria: ['Workflow executes successfully', 'Produces expected output'],
          input_specification: {
            type: 'any',
            format: 'json',
            example: {},
            validation: []
          },
          output_specification: {
            type: 'any',
            format: 'json',
            schema: {},
            requirements: ['Valid JSON output']
          },
          constraints: [],
          context: {
            domain: 'automation',
            use_case: description,
            user_skill_level: 'intermediate' as const,
            environment: 'development' as const,
            existing_systems: []
          }
        };

        enhancedSequence = await dynamicNodeDiscovery.recommendNodeSequence(workflowGoal);
        console.error(`[GenerateWorkflowSkeletonHandler] Enhanced sequence generated with ${enhancedSequence.sequence.length} steps`);
      } catch (error) {
        console.error(`[GenerateWorkflowSkeletonHandler] Enhanced sequence generation failed:`, error);
      }

      // Get chain suggestions from Universal Node Catalog
      let chainSuggestions: any[] = [];
      try {
        const workflowDescription = {
          intent: description,
          inputData: undefined,
          expectedOutput: undefined,
          constraints: [],
          preferences: {
            speed: 'balanced' as const,
            reliability: 'high' as const,
            cost: 'medium' as const
          }
        };
        chainSuggestions = await universalNodeCatalog.getNodeChainSuggestions(description || 'workflow');
        console.error(`[GenerateWorkflowSkeletonHandler] Found ${chainSuggestions.length} chain suggestions`);
      } catch (error) {
        console.error(`[GenerateWorkflowSkeletonHandler] Chain suggestions failed:`, error);
      }

      // Generate AI-optimized workflow if requested
      let optimizedWorkflow = null;
      if (includeAiOptimizations && basicSkeleton.nodes) {
        try {
          const nodeTypes = basicSkeleton.nodes.map((node: any) => ({
            name: node.type,
            displayName: node.name,
            description: `Node for ${description}`,
            category: 'Generated',
            properties: [],
            inputs: [{ type: 'main', displayName: 'Input', required: false }],
            outputs: [{ type: 'main', displayName: 'Output' }]
          }));
          
          const optimizations = await dualNodeArchitecture.getNodeChainOptimizations(nodeTypes);
          if (optimizations.length > 0) {
            optimizedWorkflow = optimizations[0];
            console.error(`[GenerateWorkflowSkeletonHandler] Generated optimized workflow with ${optimizations[0].improvements.length} improvements`);
          }
        } catch (error) {
          console.error(`[GenerateWorkflowSkeletonHandler] Workflow optimization failed:`, error);
        }
      }

      const enhancedResponse = {
        // Basic skeleton (backward compatibility)
        basic: basicSkeleton,

        // Enhanced sequence from Dynamic Discovery
        enhanced: enhancedSequence ? {
          sequence: enhancedSequence.sequence.map(step => ({
            position: step.position,
            node: {
              name: step.node.name,
              displayName: step.node.displayName,
              type: step.node.name,
              category: step.node.category
            },
            purpose: step.purpose,
            configuration: step.configuration,
            dependencies: step.dependencies,
            outputs: step.outputs
          })),
          reasoning: enhancedSequence.reasoning,
          confidence: enhancedSequence.confidence,
          complexity: enhancedSequence.complexity_analysis,
          performance: enhancedSequence.estimated_performance,
          alternatives: enhancedSequence.alternatives.slice(0, 2)
        } : null,

        // Chain suggestions from Universal Node Catalog
        chainSuggestions: chainSuggestions.slice(0, 3).map(suggestion => ({
          chain: suggestion.chain?.map((node: any) => ({
            name: node.name,
            displayName: node.displayName,
            category: node.category
          })) || [],
          reasoning: suggestion.reasoning,
          confidence: suggestion.confidence,
          estimatedTime: suggestion.estimatedTime,
          complexity: suggestion.complexity
        })),

        // AI optimizations
        optimizations: optimizedWorkflow ? {
          improvements: optimizedWorkflow.improvements.map(imp => ({
            type: imp.type,
            description: imp.description,
            quantification: imp.quantification,
            nodeChanges: imp.nodeChanges?.length || 0
          })),
          performanceGain: optimizedWorkflow.performanceGain,
          complexityReduction: optimizedWorkflow.complexityReduction,
          optimizedNodes: optimizedWorkflow.optimizedChain.map(node => ({
            name: node.name,
            displayName: node.displayName,
            aiOptimized: node.aiOptimized
          }))
        } : null,

        // Generation metadata
        metadata: {
          description,
          generationMethod: 'Phase 1 Enhanced Discovery',
          enhancedSequenceGenerated: !!enhancedSequence,
          chainSuggestionsFound: chainSuggestions.length,
          aiOptimizationsApplied: !!optimizedWorkflow,
          complexity: enhancedSequence?.complexity_analysis?.overall_complexity || 'medium',
          timestamp: new Date().toISOString()
        }
      };

      const nodeCount = basicSkeleton.nodes?.length || 0;
      const enhancedCount = enhancedSequence?.sequence?.length || 0;
      const optimizationCount = optimizedWorkflow?.improvements?.length || 0;

      return this.formatSuccess(
        enhancedResponse,
        `Phase 1 Enhanced Discovery: Generated workflow with ${nodeCount} basic + ${enhancedCount} enhanced nodes, ${optimizationCount} AI optimizations`
      );
    }, args);
  }
}

/**
 * Handler for validating workflow structure
 */
export class ValidateWorkflowHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflow } = args;

      if (!workflow) {
        throw new Error('Missing required parameter: workflow');
      }

      const validation = nodeDiscovery.validateWorkflow(workflow);

      const response = {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
        suggestions: validation.suggestions,
        missingConnections: validation.missingConnections,
        unreachableNodes: validation.unreachableNodes,
        summary: {
          nodeCount: workflow.nodes?.length || 0,
          connectionCount: workflow.connections ? Object.keys(workflow.connections).length : 0,
          triggerNodes: workflow.nodes?.filter((node: any) => {
            return node.type?.toLowerCase().includes('trigger');
          }).length || 0
        }
      };

      return this.formatSuccess(
        response,
        validation.valid 
          ? `Workflow structure is valid`
          : `Workflow has ${validation.errors.length} errors and ${validation.warnings.length} warnings`
      );
    }, args);
  }
}

// Tool definitions
export function getDiscoverNodesToolDefinition(): ToolDefinition {
  return {
    name: 'discover_nodes',
    description: 'Discover available n8n node types by category or search query',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by node category (e.g., "Trigger Nodes", "Regular Nodes")'
        },
        search: {
          type: 'string',
          description: 'Search query to find nodes by name or description'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 50)',
          default: 50
        }
      },
      required: []
    }
  };
}

export function getGetNodeInfoToolDefinition(): ToolDefinition {
  return {
    name: 'get_node_info',
    description: 'Get detailed information about a specific node type including properties and examples',
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'The node type to get information for (e.g., "n8n-nodes-base.httpRequest")'
        }
      },
      required: ['nodeType']
    }
  };
}

export function getSuggestNodesToolDefinition(): ToolDefinition {
  return {
    name: 'suggest_nodes',
    description: 'Get node suggestions based on a use case description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of what you want to accomplish (e.g., "send HTTP request", "process webhook")'
        },
        maxSuggestions: {
          type: 'number',
          description: 'Maximum number of suggestions to return (default: 5)',
          default: 5
        }
      },
      required: ['description']
    }
  };
}

export function getValidateNodeToolDefinition(): ToolDefinition {
  return {
    name: 'validate_node',
    description: 'Validate a node configuration against its expected parameters',
    inputSchema: {
      type: 'object',
      properties: {
        nodeType: {
          type: 'string',
          description: 'The node type to validate'
        },
        parameters: {
          type: 'object',
          description: 'The node parameters to validate'
        }
      },
      required: ['nodeType']
    }
  };
}

export function getGenerateWorkflowSkeletonToolDefinition(): ToolDefinition {
  return {
    name: 'generate_workflow_skeleton',
    description: 'Generate a basic workflow structure based on a use case description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of the workflow functionality you want to create'
        }
      },
      required: ['description']
    }
  };
}

export function getValidateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'validate_workflow',
    description: 'Validate a complete workflow structure for errors and best practices',
    inputSchema: {
      type: 'object',
      properties: {
        workflow: {
          type: 'object',
          description: 'The complete workflow object with nodes and connections'
        }
      },
      required: ['workflow']
    }
  };
}
