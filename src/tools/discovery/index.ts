/**
 * Discovery Tools Index
 * 
 * Exports all discovery-related tools and handlers.
 */

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

/**
 * Setup discovery tools
 */
export async function setupDiscoveryTools() {
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