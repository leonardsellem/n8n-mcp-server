/**
 * Comprehensive Tool Definitions - Phase 5 Hybrid Integration
 * 
 * This module defines MCP tool schemas for all hybrid integration tools,
 * including monitoring, optimization, configuration, and native MCP tools.
 */

import { ToolDefinition } from '../../types/index.js';

// ==================
// MONITORING & ANALYTICS TOOLS
// ==================

/**
 * Real-time workflow performance monitoring
 */
export function getMonitorWorkflowPerformanceToolDefinition(): ToolDefinition {
  return {
    name: 'monitor_workflow_performance',
    description: 'Real-time workflow performance monitoring with execution times, success rates, and error patterns',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of specific workflow to monitor (optional, monitors all if not provided)'
        },
        timeRange: {
          type: 'object',
          description: 'Time range for performance analysis',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          }
        },
        metrics: {
          type: 'array',
          description: 'Specific metrics to track',
          items: { type: 'string' },
          default: ['execution_time', 'success_rate', 'error_rate']
        },
        realTimeEnabled: {
          type: 'boolean',
          description: 'Enable real-time monitoring',
          default: false
        }
      },
      required: []
    }
  };
}

/**
 * Comprehensive workflow analytics and insights
 */
export function getWorkflowAnalyticsToolDefinition(): ToolDefinition {
  return {
    name: 'get_workflow_analytics',
    description: 'Get comprehensive workflow analytics and AI-powered insights',
    inputSchema: {
      type: 'object',
      properties: {
        workflowIds: {
          type: 'array',
          description: 'Specific workflow IDs to analyze',
          items: { type: 'string' }
        },
        analysisDepth: {
          type: 'string',
          description: 'Depth of analysis to perform',
          enum: ['basic', 'detailed', 'comprehensive'],
          default: 'detailed'
        },
        includeAIInsights: {
          type: 'boolean',
          description: 'Include AI-powered insights and recommendations',
          default: true
        },
        timeRange: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          }
        }
      },
      required: []
    }
  };
}

/**
 * Detailed performance reports with recommendations
 */
export function getGeneratePerformanceReportToolDefinition(): ToolDefinition {
  return {
    name: 'generate_performance_report',
    description: 'Generate detailed performance reports with AI recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        reportType: {
          type: 'string',
          description: 'Type of performance report to generate',
          enum: ['performance', 'optimization', 'comprehensive', 'executive'],
          default: 'comprehensive'
        },
        workflowIds: {
          type: 'array',
          description: 'Workflows to include in report',
          items: { type: 'string' }
        },
        timeRange: {
          type: 'object',
          description: 'Time range for report data',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          },
          required: ['start', 'end']
        },
        format: {
          type: 'string',
          description: 'Output format for the report',
          enum: ['json', 'markdown', 'html', 'pdf'],
          default: 'json'
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include optimization recommendations',
          default: true
        }
      },
      required: ['reportType', 'timeRange']
    }
  };
}

/**
 * Overall MCP server health status
 */
export function getSystemHealthToolDefinition(): ToolDefinition {
  return {
    name: 'get_system_health',
    description: 'Get overall MCP server health status and component diagnostics',
    inputSchema: {
      type: 'object',
      properties: {
        includeDetails: {
          type: 'boolean',
          description: 'Include detailed component diagnostics',
          default: true
        },
        checkAllComponents: {
          type: 'boolean',
          description: 'Check all system components',
          default: true
        },
        alertThresholds: {
          type: 'object',
          description: 'Custom alert thresholds',
          properties: {
            overall: { type: 'number', minimum: 0, maximum: 100 },
            apiConnectivity: { type: 'number', minimum: 0, maximum: 100 },
            nodeAvailability: { type: 'number', minimum: 0, maximum: 100 }
          }
        }
      },
      required: []
    }
  };
}

/**
 * Integration usage statistics and optimization
 */
export function getTrackIntegrationUsageToolDefinition(): ToolDefinition {
  return {
    name: 'track_integration_usage',
    description: 'Track integration usage statistics and provide optimization recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        integrationTypes: {
          type: 'array',
          description: 'Types of integrations to track',
          items: { type: 'string' }
        },
        timeRange: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          }
        },
        includeOptimization: {
          type: 'boolean',
          description: 'Include optimization suggestions',
          default: true
        }
      },
      required: []
    }
  };
}

// ==================
// OPTIMIZATION TOOLS
// ==================

/**
 * Automatic workflow optimization
 */
export function getOptimizeWorkflowPerformanceToolDefinition(): ToolDefinition {
  return {
    name: 'optimize_workflow_performance',
    description: 'Automatically optimize workflow performance with AI-powered recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of workflow to optimize'
        },
        strategy: {
          type: 'object',
          description: 'Optimization strategy configuration',
          properties: {
            focus: {
              type: 'string',
              enum: ['performance', 'cost', 'reliability', 'balanced'],
              default: 'balanced'
            },
            aggressiveness: {
              type: 'string',
              enum: ['conservative', 'moderate', 'aggressive'],
              default: 'moderate'
            },
            preserveExactBehavior: {
              type: 'boolean',
              default: true
            }
          }
        },
        dryRun: {
          type: 'boolean',
          description: 'Perform analysis without applying changes',
          default: false
        },
        validationMode: {
          type: 'string',
          enum: ['strict', 'moderate', 'permissive'],
          default: 'moderate'
        }
      },
      required: ['workflowId']
    }
  };
}

/**
 * Performance bottleneck identification
 */
export function getAnalyzePerformanceBottlenecksToolDefinition(): ToolDefinition {
  return {
    name: 'analyze_performance_bottlenecks',
    description: 'Identify and analyze performance bottlenecks in workflows',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of workflow to analyze'
        },
        analysisDepth: {
          type: 'string',
          description: 'Depth of bottleneck analysis',
          enum: ['basic', 'detailed', 'comprehensive'],
          default: 'detailed'
        },
        includeExecutionHistory: {
          type: 'boolean',
          description: 'Include execution history in analysis',
          default: true
        },
        timeRange: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          }
        }
      },
      required: ['workflowId']
    }
  };
}

/**
 * AI-powered improvement recommendations
 */
export function getSuggestWorkflowImprovementsToolDefinition(): ToolDefinition {
  return {
    name: 'suggest_workflow_improvements',
    description: 'Generate AI-powered workflow improvement recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Specific workflow to analyze (optional)'
        },
        analysisScope: {
          type: 'string',
          description: 'Scope of improvement analysis',
          enum: ['single', 'all', 'active_only'],
          default: 'single'
        },
        strategy: {
          type: 'object',
          description: 'Improvement strategy preferences',
          properties: {
            focus: { type: 'string', enum: ['performance', 'cost', 'reliability', 'balanced'] },
            aggressiveness: { type: 'string', enum: ['conservative', 'moderate', 'aggressive'] }
          }
        },
        includeImplementationGuide: {
          type: 'boolean',
          description: 'Include step-by-step implementation guide',
          default: false
        }
      },
      required: []
    }
  };
}

/**
 * Node configuration optimization
 */
export function getOptimizeNodeConfigurationsToolDefinition(): ToolDefinition {
  return {
    name: 'optimize_node_configurations',
    description: 'Optimize individual node configurations for better performance',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Workflow containing nodes to optimize'
        },
        nodeTypes: {
          type: 'array',
          description: 'Specific node types to optimize',
          items: { type: 'string' }
        },
        optimizationTargets: {
          type: 'array',
          description: 'Optimization targets',
          items: {
            type: 'string',
            enum: ['execution_time', 'memory_usage', 'error_rate', 'reliability']
          },
          default: ['execution_time', 'error_rate']
        },
        preserveLogic: {
          type: 'boolean',
          description: 'Preserve exact workflow logic',
          default: true
        }
      },
      required: ['workflowId']
    }
  };
}

/**
 * Cost analysis and optimization suggestions
 */
export function getAnalyzeCostEfficiencyToolDefinition(): ToolDefinition {
  return {
    name: 'analyze_cost_efficiency',
    description: 'Analyze workflow cost efficiency and provide optimization suggestions',
    inputSchema: {
      type: 'object',
      properties: {
        workflowIds: {
          type: 'array',
          description: 'Workflows to analyze for cost efficiency',
          items: { type: 'string' }
        },
        timeRange: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date-time' },
            end: { type: 'string', format: 'date-time' }
          }
        },
        costModel: {
          type: 'object',
          description: 'Cost model for analysis',
          properties: {
            apiCallCost: { type: 'number', minimum: 0 },
            executionTimeCost: { type: 'number', minimum: 0 },
            storageCost: { type: 'number', minimum: 0 }
          }
        },
        optimizationTargets: {
          type: 'array',
          description: 'Cost optimization targets',
          items: {
            type: 'string',
            enum: ['api_calls', 'execution_time', 'storage', 'resource_usage']
          },
          default: ['api_calls', 'execution_time']
        }
      },
      required: []
    }
  };
}

// ==================
// HYBRID INTEGRATION TOOLS
// ==================

/**
 * Native MCP integration setup
 */
export function getSetupMCPNativeIntegrationToolDefinition(): ToolDefinition {
  return {
    name: 'setup_mcp_native_integration',
    description: 'Setup native MCP integration with n8n built-in MCP capabilities',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Workflow to add MCP integration to (optional)'
        },
        triggerConfig: {
          type: 'object',
          description: 'MCP server trigger configuration',
          properties: {
            serverEndpoint: { type: 'string' },
            authenticationMethod: {
              type: 'string',
              enum: ['api_key', 'oauth', 'jwt', 'certificate', 'none']
            },
            timeout: { type: 'number', minimum: 1000 },
            retryCount: { type: 'number', minimum: 0 }
          },
          required: ['authenticationMethod']
        },
        responseMapping: {
          type: 'object',
          description: 'Response data mapping configuration'
        },
        securitySettings: {
          type: 'object',
          description: 'Security configuration for MCP integration',
          properties: {
            validateCertificates: { type: 'boolean', default: true },
            encryptCommunication: { type: 'boolean', default: true },
            allowedOrigins: {
              type: 'array',
              items: { type: 'string' },
              default: ['*']
            }
          }
        }
      },
      required: ['triggerConfig']
    }
  };
}

/**
 * Dual MCP server verification
 */
export function getEnableCrossVerificationToolDefinition(): ToolDefinition {
  return {
    name: 'enable_cross_verification',
    description: 'Enable cross-verification between multiple MCP servers for reliability',
    inputSchema: {
      type: 'object',
      properties: {
        primaryServer: {
          type: 'string',
          description: 'Primary MCP server endpoint'
        },
        secondaryServer: {
          type: 'string',
          description: 'Secondary MCP server endpoint for verification'
        },
        verificationRules: {
          type: 'object',
          description: 'Cross-verification configuration',
          properties: {
            compareResponses: { type: 'boolean', default: true },
            failureHandling: {
              type: 'string',
              enum: ['primary_wins', 'secondary_wins', 'merge', 'fail'],
              default: 'primary_wins'
            },
            toleranceThreshold: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              default: 5
            }
          },
          required: ['compareResponses', 'failureHandling']
        }
      },
      required: ['primaryServer', 'secondaryServer', 'verificationRules']
    }
  };
}

/**
 * Comprehensive configuration validation
 */
export function getValidateSystemConfigurationToolDefinition(): ToolDefinition {
  return {
    name: 'validate_system_configuration',
    description: 'Perform comprehensive system configuration validation',
    inputSchema: {
      type: 'object',
      properties: {
        configuration: {
          type: 'object',
          description: 'Configuration to validate (uses current if not provided)'
        },
        configType: {
          type: 'string',
          description: 'Type of configuration to validate',
          enum: ['workflow', 'system', 'integration', 'security'],
          default: 'system'
        },
        validationLevel: {
          type: 'string',
          description: 'Level of validation strictness',
          enum: ['basic', 'strict', 'enterprise'],
          default: 'strict'
        },
        includeSecurityAnalysis: {
          type: 'boolean',
          description: 'Include security configuration analysis',
          default: true
        },
        includePerformanceAnalysis: {
          type: 'boolean',
          description: 'Include performance configuration analysis',
          default: true
        }
      },
      required: []
    }
  };
}

/**
 * Available integration capabilities discovery
 */
export function getIntegrationCapabilitiesToolDefinition(): ToolDefinition {
  return {
    name: 'get_integration_capabilities',
    description: 'Discover available integration capabilities and compatibility',
    inputSchema: {
      type: 'object',
      properties: {
        integrationTypes: {
          type: 'array',
          description: 'Specific integration types to check',
          items: { type: 'string' }
        },
        includeExperimental: {
          type: 'boolean',
          description: 'Include experimental integrations',
          default: false
        },
        checkCompatibility: {
          type: 'boolean',
          description: 'Check compatibility with current system',
          default: true
        },
        includeConfiguration: {
          type: 'boolean',
          description: 'Include configuration examples',
          default: true
        }
      },
      required: []
    }
  };
}

/**
 * Integration connectivity testing
 */
export function getTestIntegrationConnectivityToolDefinition(): ToolDefinition {
  return {
    name: 'test_integration_connectivity',
    description: 'Test connectivity and functionality of integrations',
    inputSchema: {
      type: 'object',
      properties: {
        integrationName: {
          type: 'string',
          description: 'Name of integration to test'
        },
        testType: {
          type: 'string',
          description: 'Type of connectivity test',
          enum: ['basic', 'comprehensive', 'load_test'],
          default: 'basic'
        },
        configuration: {
          type: 'object',
          description: 'Integration configuration to test'
        },
        timeout: {
          type: 'number',
          description: 'Test timeout in milliseconds',
          minimum: 1000,
          default: 30000
        }
      },
      required: ['integrationName']
    }
  };
}

// ==================
// TOOL COLLECTION FUNCTIONS
// ==================

/**
 * Get all Phase 5 monitoring and analytics tool definitions
 */
export function getMonitoringAnalyticsToolDefinitions(): ToolDefinition[] {
  return [
    getMonitorWorkflowPerformanceToolDefinition(),
    getWorkflowAnalyticsToolDefinition(),
    getGeneratePerformanceReportToolDefinition(),
    getSystemHealthToolDefinition(),
    getTrackIntegrationUsageToolDefinition()
  ];
}

/**
 * Get all Phase 5 optimization tool definitions
 */
export function getOptimizationToolDefinitions(): ToolDefinition[] {
  return [
    getOptimizeWorkflowPerformanceToolDefinition(),
    getAnalyzePerformanceBottlenecksToolDefinition(),
    getSuggestWorkflowImprovementsToolDefinition(),
    getOptimizeNodeConfigurationsToolDefinition(),
    getAnalyzeCostEfficiencyToolDefinition()
  ];
}

/**
 * Get all Phase 5 hybrid integration tool definitions
 */
export function getHybridIntegrationToolDefinitions(): ToolDefinition[] {
  return [
    getSetupMCPNativeIntegrationToolDefinition(),
    getEnableCrossVerificationToolDefinition(),
    getValidateSystemConfigurationToolDefinition(),
    getIntegrationCapabilitiesToolDefinition(),
    getTestIntegrationConnectivityToolDefinition()
  ];
}

/**
 * Get all Phase 5 tool definitions
 */
export function getAllPhase5ToolDefinitions(): ToolDefinition[] {
  return [
    ...getMonitoringAnalyticsToolDefinitions(),
    ...getOptimizationToolDefinitions(),
    ...getHybridIntegrationToolDefinitions()
  ];
}

/**
 * Tool definition registry for Phase 5
 */
export const PHASE5_TOOL_REGISTRY = {
  // Monitoring & Analytics
  'monitor_workflow_performance': getMonitorWorkflowPerformanceToolDefinition(),
  'get_workflow_analytics': getWorkflowAnalyticsToolDefinition(),
  'generate_performance_report': getGeneratePerformanceReportToolDefinition(),
  'get_system_health': getSystemHealthToolDefinition(),
  'track_integration_usage': getTrackIntegrationUsageToolDefinition(),
  
  // Optimization
  'optimize_workflow_performance': getOptimizeWorkflowPerformanceToolDefinition(),
  'analyze_performance_bottlenecks': getAnalyzePerformanceBottlenecksToolDefinition(),
  'suggest_workflow_improvements': getSuggestWorkflowImprovementsToolDefinition(),
  'optimize_node_configurations': getOptimizeNodeConfigurationsToolDefinition(),
  'analyze_cost_efficiency': getAnalyzeCostEfficiencyToolDefinition(),
  
  // Hybrid Integration
  'setup_mcp_native_integration': getSetupMCPNativeIntegrationToolDefinition(),
  'enable_cross_verification': getEnableCrossVerificationToolDefinition(),
  'validate_system_configuration': getValidateSystemConfigurationToolDefinition(),
  'get_integration_capabilities': getIntegrationCapabilitiesToolDefinition(),
  'test_integration_connectivity': getTestIntegrationConnectivityToolDefinition()
};

/**
 * Get tool definition by name
 */
export function getToolDefinition(toolName: string): ToolDefinition | undefined {
  return PHASE5_TOOL_REGISTRY[toolName as keyof typeof PHASE5_TOOL_REGISTRY];
}

/**
 * Check if tool is a Phase 5 tool
 */
export function isPhase5Tool(toolName: string): boolean {
  return toolName in PHASE5_TOOL_REGISTRY;
}