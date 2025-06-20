/**
 * Discovery Tools Index - Phase 3 Universal Node Discovery
 *
 * Exports all discovery-related tools and handlers, including the new
 * Phase 3 Universal Node Discovery capabilities.
 */

// Phase 1 Enhanced Discovery Tools (existing)
export {
  DiscoverNodesHandler,
  GetNodeInfoHandler,
  SuggestNodesHandler,
  ValidateNodeHandler,
  GenerateWorkflowSkeletonHandler,
  ValidateWorkflowHandler,
  getDiscoverNodesToolDefinition,
  getGetNodeInfoToolDefinition,
  getSuggestNodesToolDefinition,
  getValidateNodeToolDefinition,
  getGenerateWorkflowSkeletonToolDefinition,
  getValidateWorkflowToolDefinition
} from './node-discovery.js';

// Enhanced Available Nodes Discovery
export {
  DiscoverAvailableNodesHandler,
  getDiscoverAvailableNodesToolDefinition
} from './available-nodes.js';

// Phase 3 Universal Node Discovery Tools (new)
export {
  AdvancedNodeSearchHandler,
  getAdvancedNodeSearchToolDefinition
} from './advanced-search.js';

export {
  NodeCompatibilityAnalyzer,
  getAnalyzeNodeCompatibilityToolDefinition
} from './compatibility-analyzer.js';

export {
  WorkflowPatternSuggester,
  getSuggestWorkflowPatternsToolDefinition
} from './pattern-suggester.js';

export {
  NodeDocumentationHelper,
  getNodeDocumentationToolDefinition
} from './documentation-helper.js';

/**
 * Setup discovery tools - Enhanced with Phase 3 Universal Discovery
 */
export async function setupDiscoveryTools() {
  // Import Phase 1 tools
  const {
    getDiscoverNodesToolDefinition,
    getGetNodeInfoToolDefinition,
    getSuggestNodesToolDefinition,
    getValidateNodeToolDefinition,
    getGenerateWorkflowSkeletonToolDefinition,
    getValidateWorkflowToolDefinition
  } = await import('./node-discovery.js');

  // Import enhanced available nodes discovery
  const { getDiscoverAvailableNodesToolDefinition } = await import('./available-nodes.js');
  
  // Import Phase 3 Universal Discovery tools
  const { getAdvancedNodeSearchToolDefinition } = await import('./advanced-search.js');
  const { getAnalyzeNodeCompatibilityToolDefinition } = await import('./compatibility-analyzer.js');
  const { getSuggestWorkflowPatternsToolDefinition } = await import('./pattern-suggester.js');
  const { getNodeDocumentationToolDefinition } = await import('./documentation-helper.js');

  return [
    // Phase 1 Enhanced Discovery Tools
    getDiscoverNodesToolDefinition(),
    getGetNodeInfoToolDefinition(),
    getSuggestNodesToolDefinition(),
    getValidateNodeToolDefinition(),
    getGenerateWorkflowSkeletonToolDefinition(),
    getValidateWorkflowToolDefinition(),
    
    // Enhanced Available Nodes Discovery
    getDiscoverAvailableNodesToolDefinition(),
    
    // Phase 3 Universal Node Discovery Tools
    getAdvancedNodeSearchToolDefinition(),
    getAnalyzeNodeCompatibilityToolDefinition(),
    getSuggestWorkflowPatternsToolDefinition(),
    getNodeDocumentationToolDefinition()
  ];
}

/**
 * Setup core discovery tools only (Phase 1)
 */
export async function setupCoreDiscoveryTools() {
  const {
    getDiscoverNodesToolDefinition,
    getGetNodeInfoToolDefinition,
    getSuggestNodesToolDefinition,
    getValidateNodeToolDefinition,
    getGenerateWorkflowSkeletonToolDefinition,
    getValidateWorkflowToolDefinition
  } = await import('./node-discovery.js');

  return [
    getDiscoverNodesToolDefinition(),
    getGetNodeInfoToolDefinition(),
    getSuggestNodesToolDefinition(),
    getValidateNodeToolDefinition(),
    getGenerateWorkflowSkeletonToolDefinition(),
    getValidateWorkflowToolDefinition()
  ];
}

/**
 * Setup Phase 3 Universal Discovery tools only
 */
export async function setupUniversalDiscoveryTools() {
  const { getAdvancedNodeSearchToolDefinition } = await import('./advanced-search.js');
  const { getAnalyzeNodeCompatibilityToolDefinition } = await import('./compatibility-analyzer.js');
  const { getSuggestWorkflowPatternsToolDefinition } = await import('./pattern-suggester.js');
  const { getNodeDocumentationToolDefinition } = await import('./documentation-helper.js');

  return [
    getAdvancedNodeSearchToolDefinition(),
    getAnalyzeNodeCompatibilityToolDefinition(),
    getSuggestWorkflowPatternsToolDefinition(),
    getNodeDocumentationToolDefinition()
  ];
}

/**
 * Get discovery tool handlers for MCP server registration
 */
export function getDiscoveryHandlers() {
  return {
    // Phase 1 handlers
    'discover_nodes': new (require('./node-discovery.js').DiscoverNodesHandler)(),
    'get_node_info': new (require('./node-discovery.js').GetNodeInfoHandler)(),
    'suggest_nodes': new (require('./node-discovery.js').SuggestNodesHandler)(),
    'validate_node': new (require('./node-discovery.js').ValidateNodeHandler)(),
    'generate_workflow_skeleton': new (require('./node-discovery.js').GenerateWorkflowSkeletonHandler)(),
    'validate_workflow': new (require('./node-discovery.js').ValidateWorkflowHandler)(),
    
    // Enhanced Available Nodes Discovery
    'discover_available_nodes': new (require('./available-nodes.js').DiscoverAvailableNodesHandler)(),
    
    // Phase 3 handlers
    'search_nodes_advanced': new (require('./advanced-search.js').AdvancedNodeSearchHandler)(),
    'analyze_node_compatibility': new (require('./compatibility-analyzer.js').NodeCompatibilityAnalyzer)(),
    'suggest_workflow_patterns': new (require('./pattern-suggester.js').WorkflowPatternSuggester)(),
    'get_node_documentation': new (require('./documentation-helper.js').NodeDocumentationHelper)()
  };
}