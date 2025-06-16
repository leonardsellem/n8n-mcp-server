/**
 * Server Configuration
 * 
 * This module configures the MCP server with tools and resources
 * for n8n workflow management.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { getEnvConfig } from './environment.js';
import { setupWorkflowTools } from '../tools/workflow/index.js';
import { setupExecutionTools } from '../tools/execution/index.js';
import { setupDiscoveryTools } from '../tools/discovery/index.js';
import { setupCredentialsTools } from '../tools/credentials/index.js';
import { setupFolderTools } from '../tools/folders/index.js';
// Temporarily disable tools that don't have setup functions
// import { setupUtilityTools } from '../tools/utility/index.js';
// import { setupTemplateTools } from '../tools/templates/index.js';
// import { setupAIGenerationTools } from '../tools/ai-generation/index.js';
// import { setupEnvironmentTools } from '../tools/environment/index.js';
// import { setupTestingTools } from '../tools/testing/index.js';
// import { setupMonitoringTools } from '../tools/monitoring/index.js';
// import { setupSecurityTools } from '../tools/security/index.js';
// import { setupCollaborationTools } from '../tools/collaboration/index.js';
// import { setupIntegrationTools } from '../tools/integration/index.js';
// import { setupOptimizationTools } from '../tools/optimization/index.js';
// import { setupDocumentationTools } from '../tools/documentation/index.js';
// import { setupAIFriendlyTools } from '../tools/ai-friendly/index.js';
// import { setupAdaptiveLearningTools } from '../tools/adaptive-learning/index.js';
// import { setupAiAgentTemplateTools } from '../tools/ai-agent-templates/index.js';
import { setupResourceHandlers } from '../resources/index.js';
import { EnhancedN8nApiClient } from '../api/enhanced-client.js';
import { initializeNodeDiscovery } from '../helpers/node-discovery.js';
import { initializeDiscoveryApiClient } from '../tools/discovery/base-handler.js';
import { initializeCredentialsApiClient } from '../tools/credentials/base-handler.js';

// Import types
import { ToolCallResult } from '../types/index.js';

/**
 * Configure and return an MCP server instance with all tools and resources
 * 
 * @returns Configured MCP server instance
 */
export async function configureServer(): Promise<Server> {
  // Get validated environment configuration
  const envConfig = getEnvConfig();
  
  // Create enhanced n8n API client
  const apiClient = new EnhancedN8nApiClient(envConfig);
  
  // Verify n8n API connectivity (non-blocking)
  try {
    console.error('Verifying n8n API connectivity...');
    await apiClient.checkConnectivity();
    console.error(`Successfully connected to n8n API at ${envConfig.n8nApiUrl}`);
    
    // Initialize node discovery service with API client
    console.error('Initializing node discovery with live API data...');
    initializeNodeDiscovery(apiClient);
    console.error('Node discovery service initialized successfully');
    
    // Initialize shared API clients for all tool handlers
    console.error('Initializing shared API clients for tool handlers...');
    initializeDiscoveryApiClient(apiClient);
    initializeCredentialsApiClient(apiClient);
    console.error('Shared API clients initialized successfully');
  } catch (error) {
    console.error('WARNING: Failed to connect to n8n API:', error instanceof Error ? error.message : error);
    console.error('Server will continue in offline mode - tools will be available but may have limited functionality');
    
    // Initialize in offline mode
    console.error('Initializing node discovery in offline mode...');
    initializeNodeDiscovery(null);
    console.error('Node discovery service initialized in offline mode');
    
    // Initialize shared API clients in offline mode
    console.error('Initializing shared API clients in offline mode...');
    initializeDiscoveryApiClient(null);
    initializeCredentialsApiClient(null);
    console.error('Shared API clients initialized in offline mode');
  }

  // Create server instance
  const server = new Server(
    {
      name: 'n8n-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    }
  );

  // Set up all request handlers
  setupToolListRequestHandler(server);
  setupToolCallRequestHandler(server);
  setupPromptsListRequestHandler(server);
  setupResourceHandlers(server, envConfig);

  return server;
}

/**
 * Set up the prompts list request handler for the server
 *
 * @param server MCP server instance
 */
function setupPromptsListRequestHandler(server: Server): void {
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    // Return empty prompts list since this server focuses on tools, not prompts
    return {
      prompts: []
    };
  });
}

/**
 * Set up the tool list request handler for the server
 *
 * @param server MCP server instance
 */
function setupToolListRequestHandler(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Combine tools from all modules that have setup functions
    const workflowTools = await setupWorkflowTools();
    const executionTools = await setupExecutionTools();
    const discoveryTools = await setupDiscoveryTools();
    const credentialsTools = await setupCredentialsTools();
    const folderTools = await setupFolderTools();

    return {
      tools: [
        ...workflowTools,
        ...executionTools,
        ...discoveryTools,
        ...credentialsTools,
        ...folderTools
      ],
    };
  });
}

/**
 * Set up the tool call request handler for the server
 * 
 * @param server MCP server instance
 */
function setupToolCallRequestHandler(server: Server): void {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};

    let result: ToolCallResult;

    try {
      // Import all handlers
      const {
        ListWorkflowsHandler,
        GetWorkflowHandler,
        CreateWorkflowHandler,
        UpdateWorkflowHandler,
        DeleteWorkflowHandler,
        ActivateWorkflowHandler,
        DeactivateWorkflowHandler,
        ExecuteWorkflowHandler,
        RepairWorkflowTriggersHandler,
        RepairWorkflowHandler
      } = await import('../tools/workflow/index.js');
      
      const {
        ListExecutionsHandler,
        GetExecutionHandler,
        DeleteExecutionHandler,
        RunWebhookHandler
      } = await import('../tools/execution/index.js');

      const {
        DiscoverNodesHandler,
        GetNodeInfoHandler,
        SuggestNodesHandler,
        ValidateNodeHandler,
        GenerateWorkflowSkeletonHandler,
        ValidateWorkflowHandler,
        // Phase 3 Universal Discovery Tools
        DiscoverAvailableNodesHandler,
        AdvancedNodeSearchHandler,
        NodeCompatibilityAnalyzer,
        WorkflowPatternSuggester,
        NodeDocumentationHelper
      } = await import('../tools/discovery/index.js');

      const {
        ListCredentialsHandler,
        GetCredentialHandler,
        CreateCredentialHandler,
        UpdateCredentialHandler,
        DeleteCredentialHandler,
        TestCredentialHandler,
        ListCredentialTypesHandler
      } = await import('../tools/credentials/index.js');

      const {
        CreateSmartWorkflowHandler,
        AddNodeToWorkflowHandler,
        OptimizeWorkflowHandler,
        CloneWorkflowHandler
      } = await import('../tools/workflow/enhanced-workflow.js');

      const {
        CreateFolderHandler,
        ListFoldersHandler,
        MoveWorkflowToFolderHandler,
        GetFolderContentsHandler,
        DeleteFolderHandler,
        RenameFolderHandler
      } = await import('../tools/folders/index.js');

      const {
        BulkWorkflowOperationsHandler,
        AdvancedWorkflowSearchHandler,
        WorkflowAnalyticsHandler
      } = await import('../tools/utility/index.js');

      // Import new tool handlers
      const {
        ListWorkflowTemplatesHandler,
        CreateWorkflowFromTemplateHandler,
        CustomizeTemplateHandler
      } = await import('../tools/templates/index.js');

      const {
        GenerateWorkflowFromDescriptionHandler,
        SuggestWorkflowImprovementsHandler,
        AutoConnectNodesHandler,
        ExplainWorkflowHandler
      } = await import('../tools/ai-generation/index.js');

      const {
        ListEnvironmentsHandler,
        DeployWorkflowToEnvironmentHandler,
        CompareEnvironmentsHandler,
        SyncWorkflowsHandler
      } = await import('../tools/environment/index.js');

      // Import testing tools
      const {
        TestWorkflowWithSampleDataHandler,
        ValidateWorkflowPerformanceHandler,
        SimulateWorkflowExecutionHandler,
        GenerateTestDataHandler
      } = await import('../tools/testing/index.js');

      // Import monitoring tools
      const {
        MonitorWorkflowHealthHandler,
        GetWorkflowPerformanceMetricsHandler,
        AlertOnWorkflowFailuresHandler,
        GenerateWorkflowReportsHandler
      } = await import('../tools/monitoring/index.js');

      // Import security tools
      const {
        ScanWorkflowSecurityHandler,
        AuditWorkflowAccessHandler,
        CheckComplianceHandler,
        EncryptSensitiveDataHandler
      } = await import('../tools/security/index.js');

      // Import collaboration tools
      const {
        ShareWorkflowHandler,
        CommentOnWorkflowHandler,
        TrackWorkflowChangesHandler,
        MergeWorkflowChangesHandler
      } = await import('../tools/collaboration/index.js');

      // Import integration tools
      const {
        BrowseIntegrationsHandler,
        InstallIntegrationHandler,
        TestIntegrationConnectivityHandler,
        ManageApiKeysHandler
      } = await import('../tools/integration/index.js');

      // Import optimization tools
      const {
        OptimizeWorkflowPerformanceHandler,
        SuggestNodeAlternativesHandler,
        ConsolidateWorkflowsHandler,
        IdentifyUnusedWorkflowsHandler
      } = await import('../tools/optimization/index.js');

      // Import documentation tools
      const {
        GenerateWorkflowDocumentationHandler,
        CreateWorkflowDiagramHandler,
        ExportWorkflowKnowledgeBaseHandler,
        WorkflowBestPracticesHandler
      } = await import('../tools/documentation/index.js');

      // Import AI-friendly tools
      const {
        // Tool Discovery & Organization
        ListToolCategoriesHandler,
        GetToolRecommendationsHandler,
        SearchToolsHandler,
        GetToolUsageExamplesHandler,
        ExplainToolRelationshipsHandler,
        
        // Lightweight Data Access
        GetWorkflowSummaryHandler,
        GetLightweightWorkflowListHandler,
        GetWorkflowQuickStatsHandler,
        CheckWorkflowStatusHandler,
        GetEssentialNodeInfoHandler,
        
        // AI Context Management
        SaveWorkflowContextHandler,
        RestoreWorkflowContextHandler,
        BookmarkWorkflowsHandler,
        GetWorkflowRelationshipsHandler,
        
        // Batch & Efficiency Operations
        BatchWorkflowStatusHandler,
        BatchWorkflowMetadataHandler,
        QuickWorkflowValidationHandler,
        GetWorkflowDependenciesHandler,
        
        // AI-Friendly Output Formats
        GetStructuredWorkflowDataHandler,
        ExportWorkflowSchemaHandler,
        SimplifyWorkflowOutputHandler,
        GetWorkflowEssenceHandler,
      } = await import('../tools/ai-friendly/index.js');

      // Phase 2 tools (adaptive-learning, ai-agent-templates) will be imported here when implemented
      
      // Route the tool call to the appropriate handler
      if (toolName === 'list_workflows') {
        const handler = new ListWorkflowsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_workflow') {
        const handler = new GetWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_workflow') {
        const handler = new CreateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'update_workflow') {
        const handler = new UpdateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_workflow') {
        const handler = new DeleteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'activate_workflow') {
        const handler = new ActivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'deactivate_workflow') {
        const handler = new DeactivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'execute_workflow') {
        const handler = new ExecuteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'repair_workflow_triggers') {
        const handler = new RepairWorkflowTriggersHandler();
        result = await handler.execute(args);
      } else if (toolName === 'repair_workflow') {
        const handler = new RepairWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'list_executions') {
        const handler = new ListExecutionsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_execution') {
        const handler = new GetExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_execution') {
        const handler = new DeleteExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'run_webhook') {
        const handler = new RunWebhookHandler();
        result = await handler.execute(args);
      }
      // Enhanced workflow tools
      else if (toolName === 'create_smart_workflow') {
        const handler = new CreateSmartWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'add_node_to_workflow') {
        const handler = new AddNodeToWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'optimize_workflow') {
        const handler = new OptimizeWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'clone_workflow') {
        const handler = new CloneWorkflowHandler();
        result = await handler.execute(args);
      }
      // Discovery tools
      else if (toolName === 'discover_nodes') {
        const handler = new DiscoverNodesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_node_info') {
        const handler = new GetNodeInfoHandler();
        result = await handler.execute(args);
      } else if (toolName === 'suggest_nodes') {
        const handler = new SuggestNodesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'validate_node') {
        const handler = new ValidateNodeHandler();
        result = await handler.execute(args);
      } else if (toolName === 'generate_workflow_skeleton') {
        const handler = new GenerateWorkflowSkeletonHandler();
        result = await handler.execute(args);
      } else if (toolName === 'validate_workflow') {
        const handler = new ValidateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'discover_available_nodes') {
        const handler = new DiscoverAvailableNodesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'search_nodes_advanced') {
        const handler = new AdvancedNodeSearchHandler();
        result = await handler.execute(args);
      } else if (toolName === 'analyze_node_compatibility') {
        const handler = new NodeCompatibilityAnalyzer();
        result = await handler.execute(args);
      } else if (toolName === 'suggest_workflow_patterns') {
        const handler = new WorkflowPatternSuggester();
        result = await handler.execute(args);
      } else if (toolName === 'get_node_documentation') {
        const handler = new NodeDocumentationHelper();
        result = await handler.execute(args);
      }
      // Credentials tools
      else if (toolName === 'list_credentials') {
        const handler = new ListCredentialsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_credential') {
        const handler = new GetCredentialHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_credential') {
        const handler = new CreateCredentialHandler();
        result = await handler.execute(args);
      } else if (toolName === 'update_credential') {
        const handler = new UpdateCredentialHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_credential') {
        const handler = new DeleteCredentialHandler();
        result = await handler.execute(args);
      } else if (toolName === 'test_credential') {
        const handler = new TestCredentialHandler();
        result = await handler.execute(args);
      } else if (toolName === 'list_credential_types') {
        const handler = new ListCredentialTypesHandler();
        result = await handler.execute(args);
      }
      // Folder management tools
      else if (toolName === 'create_folder') {
        const handler = new CreateFolderHandler();
        result = await handler.execute(args);
      } else if (toolName === 'list_folders') {
        const handler = new ListFoldersHandler();
        result = await handler.execute(args);
      } else if (toolName === 'move_workflow_to_folder') {
        const handler = new MoveWorkflowToFolderHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_folder_contents') {
        const handler = new GetFolderContentsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_folder') {
        const handler = new DeleteFolderHandler();
        result = await handler.execute(args);
      } else if (toolName === 'rename_folder') {
        const handler = new RenameFolderHandler();
        result = await handler.execute(args);
      }
      // Utility tools
      else if (toolName === 'bulk_workflow_operations') {
        const handler = new BulkWorkflowOperationsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'advanced_workflow_search') {
        const handler = new AdvancedWorkflowSearchHandler();
        result = await handler.execute(args);
      } else if (toolName === 'workflow_analytics') {
        const handler = new WorkflowAnalyticsHandler();
        result = await handler.execute(args);
      }
      // Template tools
      else if (toolName === 'list_workflow_templates') {
        const handler = new ListWorkflowTemplatesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_workflow_from_template') {
        const handler = new CreateWorkflowFromTemplateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'customize_template') {
        const handler = new CustomizeTemplateHandler();
        result = await handler.execute(args);
      }
      // AI Generation tools
      else if (toolName === 'generate_workflow_from_description') {
        const handler = new GenerateWorkflowFromDescriptionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'suggest_workflow_improvements') {
        const handler = new SuggestWorkflowImprovementsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'auto_connect_nodes') {
        const handler = new AutoConnectNodesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'explain_workflow') {
        const handler = new ExplainWorkflowHandler();
        result = await handler.execute(args);
      }
      // Environment tools
      else if (toolName === 'list_environments') {
        const handler = new ListEnvironmentsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'deploy_workflow_to_environment') {
        const handler = new DeployWorkflowToEnvironmentHandler();
        result = await handler.execute(args);
      } else if (toolName === 'compare_environments') {
        const handler = new CompareEnvironmentsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'sync_workflows') {
        const handler = new SyncWorkflowsHandler();
        result = await handler.execute(args);
      }
      // Testing tools
      else if (toolName === 'test_workflow_with_sample_data') {
        const handler = new TestWorkflowWithSampleDataHandler();
        result = await handler.execute(args);
      } else if (toolName === 'validate_workflow_performance') {
        const handler = new ValidateWorkflowPerformanceHandler();
        result = await handler.execute(args);
      } else if (toolName === 'simulate_workflow_execution') {
        const handler = new SimulateWorkflowExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'generate_test_data') {
        const handler = new GenerateTestDataHandler();
        result = await handler.execute(args);
      }
      // Monitoring tools
      else if (toolName === 'monitor_workflow_health') {
        const handler = new MonitorWorkflowHealthHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_workflow_performance_metrics') {
        const handler = new GetWorkflowPerformanceMetricsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'alert_on_workflow_failures') {
        const handler = new AlertOnWorkflowFailuresHandler();
        result = await handler.execute(args);
      } else if (toolName === 'generate_workflow_reports') {
        const handler = new GenerateWorkflowReportsHandler();
        result = await handler.execute(args);
      }
      // Security tools
      else if (toolName === 'scan_workflow_security') {
        const handler = new ScanWorkflowSecurityHandler();
        result = await handler.execute(args);
      } else if (toolName === 'audit_workflow_access') {
        const handler = new AuditWorkflowAccessHandler();
        result = await handler.execute(args);
      } else if (toolName === 'check_compliance') {
        const handler = new CheckComplianceHandler();
        result = await handler.execute(args);
      } else if (toolName === 'encrypt_sensitive_data') {
        const handler = new EncryptSensitiveDataHandler();
        result = await handler.execute(args);
      }
      // Collaboration tools
      else if (toolName === 'share_workflow') {
        const handler = new ShareWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'comment_on_workflow') {
        const handler = new CommentOnWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'track_workflow_changes') {
        const handler = new TrackWorkflowChangesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'merge_workflow_changes') {
        const handler = new MergeWorkflowChangesHandler();
        result = await handler.execute(args);
      }
      // Integration tools
      else if (toolName === 'browse_integrations') {
        const handler = new BrowseIntegrationsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'install_integration') {
        const handler = new InstallIntegrationHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'test_integration_connectivity') {
        const handler = new TestIntegrationConnectivityHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'manage_api_keys') {
        const handler = new ManageApiKeysHandler();
        result = await handler.execute(args as any);
      }
      // Optimization tools
      else if (toolName === 'optimize_workflow_performance') {
        const handler = new OptimizeWorkflowPerformanceHandler();
        result = await handler.execute(args);
      } else if (toolName === 'suggest_node_alternatives') {
        const handler = new SuggestNodeAlternativesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'consolidate_workflows') {
        const handler = new ConsolidateWorkflowsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'identify_unused_workflows') {
        const handler = new IdentifyUnusedWorkflowsHandler();
        result = await handler.execute(args);
      }
      // Documentation tools
      else if (toolName === 'generate_workflow_documentation') {
        const handler = new GenerateWorkflowDocumentationHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_workflow_diagram') {
        const handler = new CreateWorkflowDiagramHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'export_workflow_knowledge_base') {
        const handler = new ExportWorkflowKnowledgeBaseHandler();
        result = await handler.execute(args);
      } else if (toolName === 'workflow_best_practices') {
        const handler = new WorkflowBestPracticesHandler();
        result = await handler.execute(args);
      }
      // AI-Friendly Tools - Tool Discovery & Organization
      else if (toolName === 'list_tool_categories') {
        const handler = new ListToolCategoriesHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_tool_recommendations') {
        const handler = new GetToolRecommendationsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'search_tools') {
        const handler = new SearchToolsHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'get_tool_usage_examples') {
        const handler = new GetToolUsageExamplesHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'explain_tool_relationships') {
        const handler = new ExplainToolRelationshipsHandler();
        result = await handler.execute(args);
      }
      // AI-Friendly Tools - Lightweight Data Access
      else if (toolName === 'get_workflow_summary') {
        const handler = new GetWorkflowSummaryHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'get_lightweight_workflow_list') {
        const handler = new GetLightweightWorkflowListHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_workflow_quick_stats') {
        const handler = new GetWorkflowQuickStatsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'check_workflow_status') {
        const handler = new CheckWorkflowStatusHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'get_essential_node_info') {
        const handler = new GetEssentialNodeInfoHandler();
        result = await handler.execute(args as any);
      }
      // AI-Friendly Tools - Context Management
      else if (toolName === 'save_workflow_context') {
        const handler = new SaveWorkflowContextHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'restore_workflow_context') {
        const handler = new RestoreWorkflowContextHandler();
        result = await handler.execute(args);
      } else if (toolName === 'bookmark_workflows') {
        const handler = new BookmarkWorkflowsHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'get_workflow_relationships') {
        const handler = new GetWorkflowRelationshipsHandler();
        result = await handler.execute(args);
      }
      // AI-Friendly Tools - Batch & Efficiency Operations
      else if (toolName === 'batch_workflow_status') {
        const handler = new BatchWorkflowStatusHandler();
        result = await handler.execute(args);
      } else if (toolName === 'batch_workflow_metadata') {
        const handler = new BatchWorkflowMetadataHandler();
        result = await handler.execute(args);
      } else if (toolName === 'quick_workflow_validation') {
        const handler = new QuickWorkflowValidationHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'get_workflow_dependencies') {
        const handler = new GetWorkflowDependenciesHandler();
        result = await handler.execute(args);
      }
      // AI-Friendly Tools - Output Formats
      else if (toolName === 'get_structured_workflow_data') {
        const handler = new GetStructuredWorkflowDataHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'export_workflow_schema') {
        const handler = new ExportWorkflowSchemaHandler();
        result = await handler.execute(args);
      } else if (toolName === 'simplify_workflow_output') {
        const handler = new SimplifyWorkflowOutputHandler();
        result = await handler.execute(args as any);
      } else if (toolName === 'get_workflow_essence') {
        const handler = new GetWorkflowEssenceHandler();
        result = await handler.execute(args as any);
      }
      // Phase 2 tool handlers (adaptive-learning, ai-agent-templates) will be added here when implemented
      else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      // Converting to MCP SDK expected format
      return {
        content: result.content,
        isError: result.isError,
      };
    } catch (error) {
      console.error(`Error handling tool call to ${toolName}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });
}
