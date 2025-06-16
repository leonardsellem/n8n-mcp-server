import { userTools } from './users/index.js';
import { tagTools } from './tags/index.js';
import { projectTools } from './projects/index.js';
import { variableTools } from './variables/index.js';
import { sourceControlTools } from './source-control/index.js';
import { auditingTools } from './auditing/index.js';
import { setupWorkflowTools } from './workflow/index.js';
import { setupExecutionTools } from './execution/index.js';
import { setupCredentialsTools } from './credentials/index.js';
import { setupDiscoveryTools } from './discovery/index.js';
import { setupAIFriendlyTools } from './ai-friendly/index.js';
import { setupAIGenerationTools } from './ai-generation/index.js';
// Phase 2 Universal AI Agent Workflow Tools
import { setupAIWorkflowTools } from './ai-workflow/index.js';
// import { setupAdaptiveLearningTools } from './adaptive-learning/index.js';
// import { setupAiAgentTemplateTools } from './ai-agent-templates/index.js';
import { setupCollaborationTools } from './collaboration/index.js';
import { setupDocumentationTools } from './documentation/index.js';
import { setupEnvironmentTools } from './environment/index.js';
import { setupFolderTools } from './folders/index.js';
import { setupIntegrationTools } from './integration/index.js';
import { setupMonitoringTools } from './monitoring/index.js';
import { setupOptimizationTools } from './optimization/index.js';
import { setupSecurityTools } from './security/index.js';
import { setupTemplateTools } from './templates/index.js';
import { setupTestingTools } from './testing/index.js';
import { setupUtilityTools } from './utility/index.js';

export async function getAllTools() {
  const [
    workflowTools,
    executionTools,
    credentialTools,
    discoveryTools,
    aiFriendlyTools,
    aiGenerationTools,
    // Phase 2 Universal AI Agent Workflow Tools
    aiWorkflowTools,
    // adaptiveLearningTools,
    // aiAgentTemplateTools,
    collaborationTools,
    documentationTools,
    environmentTools,
    folderTools,
    integrationTools,
    monitoringTools,
    optimizationTools,
    securityTools,
    templateTools,
    testingTools,
    utilityTools
  ] = await Promise.all([
    setupWorkflowTools(),
    setupExecutionTools(),
    setupCredentialsTools(),
    setupDiscoveryTools(),
    setupAIFriendlyTools(),
    setupAIGenerationTools(),
    // Phase 2 Universal AI Agent Workflow Tools
    setupAIWorkflowTools(),
    // setupAdaptiveLearningTools(),
    // setupAiAgentTemplateTools(),
    setupCollaborationTools(),
    setupDocumentationTools(),
    setupEnvironmentTools(),
    setupFolderTools(),
    setupIntegrationTools(),
    setupMonitoringTools(),
    setupOptimizationTools(),
    setupSecurityTools(),
    setupTemplateTools(),
    setupTestingTools(),
    setupUtilityTools()
  ]);

  return [
    // Core workflow management
    ...workflowTools,
    ...executionTools,
    ...credentialTools,
    
    // Discovery and node management
    ...discoveryTools,
    
    // AI-optimized tools
    ...aiFriendlyTools,
    ...aiGenerationTools,
    
    // Phase 2 Universal AI Agent Workflow Tools
    ...aiWorkflowTools,
    // ...adaptiveLearningTools,
    // ...aiAgentTemplateTools,
    
    // Collaboration and documentation
    ...collaborationTools,
    ...documentationTools,
    
    // Environment and deployment
    ...environmentTools,
    
    // Organization
    ...folderTools,
    
    // Integration and external services
    ...integrationTools,
    
    // Monitoring and analytics
    ...monitoringTools,
    
    // Optimization and performance
    ...optimizationTools,
    
    // Security and compliance
    ...securityTools,
    
    // Templates and workflow generation
    ...templateTools,
    
    // Testing and validation
    ...testingTools,
    
    // Utility and bulk operations
    ...utilityTools,
    
    // Legacy tools (keeping for compatibility)
    ...userTools,
    ...tagTools,
    ...projectTools,
    ...variableTools,
    ...sourceControlTools,
    ...auditingTools,
  ];
}

// For backward compatibility - removed problematic top-level await
// export const allTools = await getAllTools();
