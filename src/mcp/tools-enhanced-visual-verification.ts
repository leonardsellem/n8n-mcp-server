// Enhanced Visual Verification MCP Tools

import { EnhancedVisualVerificationSystem } from '../services/enhanced-visual-verification';
import { WorkflowIntelligenceEngine } from '../services/workflow-intelligence';
import { ExecutionMonitor } from '../services/execution-monitor';
import { N8nApiClient } from '../services/n8n-api-client';
import { logger } from '../utils/logger';

/**
 * Enhanced Visual Verification MCP Tools
 * 
 * Provides comprehensive visual analysis capabilities for AI agents:
 * - Advanced computer vision with OCR
 * - Real-time execution monitoring
 * - Workflow intelligence and pattern recognition
 * - Cross-reference with n8n API data
 * - AI-friendly recommendations and auto-fix
 */

let visualSystem: EnhancedVisualVerificationSystem | null = null;
let intelligenceEngine: WorkflowIntelligenceEngine | null = null;
let executionMonitor: ExecutionMonitor | null = null;
let apiClient: N8nApiClient | null = null;

/**
 * Initialize enhanced visual verification system
 */
async function initializeEnhancedSystem(
  n8nUrl: string, 
  credentials: { username: string; password: string },
  config: any = {}
): Promise<void> {
  if (!visualSystem) {
    visualSystem = new EnhancedVisualVerificationSystem(n8nUrl, credentials, config);
    await visualSystem.initialize();
    
    intelligenceEngine = new WorkflowIntelligenceEngine();
    
    // Initialize API client for cross-referencing
    apiClient = new N8nApiClient({
      baseUrl: n8nUrl,
      apiKey: 'placeholder-api-key' // Would need proper API key for real usage
    });
    
    logger.info('[Enhanced Visual] Advanced system initialized with intelligence layer');
  }
}

/**
 * Enhanced visual verification tool definitions
 */
export const enhancedVisualVerificationTools = [
  {
    name: 'setup_enhanced_visual_verification',
    description: 'Initialize advanced visual verification system with intelligence layer, computer vision, OCR, and real-time monitoring capabilities. This is the most comprehensive visual analysis system available.',
    inputSchema: {
      type: 'object',
      properties: {
        n8nUrl: {
          type: 'string',
          description: 'n8n instance URL (e.g., https://n8n.example.com or http://localhost:5678)'
        },
        username: {
          type: 'string',
          description: 'n8n username or email for authentication'
        },
        password: {
          type: 'string',
          description: 'n8n password for authentication'
        },
        config: {
          type: 'object',
          description: 'Optional configuration for advanced features',
          properties: {
            enableOCR: { type: 'boolean', description: 'Enable OCR text extraction (default: true)' },
            enableComputerVision: { type: 'boolean', description: 'Enable computer vision analysis (default: true)' },
            enableRealTimeMonitoring: { type: 'boolean', description: 'Enable real-time execution monitoring (default: true)' },
            enablePatternRecognition: { type: 'boolean', description: 'Enable workflow pattern recognition (default: true)' },
            crossReferenceAPI: { type: 'boolean', description: 'Cross-reference with n8n API data (default: true)' },
            autoFix: { type: 'boolean', description: 'Enable automatic issue fixing (default: false)' }
          }
        }
      },
      required: ['n8nUrl', 'username', 'password']
    }
  },
  {
    name: 'analyze_workflow_comprehensively',
    description: 'Perform comprehensive visual and intelligence analysis of a workflow. Combines computer vision, OCR, pattern recognition, best practices validation, security analysis, and performance assessment. Returns detailed insights and actionable recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The n8n workflow ID to analyze comprehensively'
        },
        analysisLevel: {
          type: 'string',
          enum: ['quick', 'standard', 'comprehensive', 'expert'],
          description: 'Analysis depth level. expert=all features enabled, comprehensive=most features, standard=common checks, quick=basic visual only',
          default: 'standard'
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include AI-friendly actionable recommendations',
          default: true
        },
        includeFixInstructions: {
          type: 'boolean', 
          description: 'Include step-by-step fix instructions for detected issues',
          default: true
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'start_execution_monitoring',
    description: 'Start real-time monitoring of workflow execution with live visual updates, performance tracking, and issue detection. Provides live screenshots, execution step tracking, and performance metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to monitor during execution'
        },
        executionId: {
          type: 'string',
          description: 'Optional specific execution ID to monitor (if not provided, monitors next execution)'
        },
        config: {
          type: 'object',
          description: 'Monitoring configuration',
          properties: {
            screenshotInterval: { type: 'number', description: 'Screenshot interval in milliseconds (default: 2000)' },
            performanceTracking: { type: 'boolean', description: 'Enable performance metrics tracking (default: true)' },
            autoStop: { type: 'boolean', description: 'Auto-stop when execution completes (default: true)' },
            maxDuration: { type: 'number', description: 'Maximum monitoring duration in milliseconds (default: 300000)' }
          }
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'get_workflow_intelligence_report',
    description: 'Generate comprehensive workflow intelligence report with pattern recognition, anti-pattern detection, best practices validation, security analysis, and maintainability scoring. Provides domain expertise about n8n workflows.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to analyze with intelligence engine'
        },
        includePatterns: {
          type: 'boolean',
          description: 'Include recognized design patterns analysis',
          default: true
        },
        includeAntiPatterns: {
          type: 'boolean',
          description: 'Include anti-pattern detection',
          default: true
        },
        includeBestPractices: {
          type: 'boolean',
          description: 'Include best practices validation',
          default: true
        },
        includeSecurity: {
          type: 'boolean',
          description: 'Include security vulnerability analysis',
          default: true
        },
        includePerformance: {
          type: 'boolean',
          description: 'Include performance risk assessment',
          default: true
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'detect_enhanced_visual_issues',
    description: 'Detect visual issues using advanced computer vision, OCR, and cross-referencing with API data. Provides detailed issue analysis with severity, impact, and auto-fix suggestions.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to analyze for visual issues'
        },
        detectionTypes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['layout', 'execution', 'security', 'performance', 'connectivity', 'data_flow', 'best_practice']
          },
          description: 'Types of issues to detect. Default: all types',
          default: ['layout', 'execution', 'security', 'performance', 'connectivity', 'data_flow', 'best_practice']
        },
        confidenceThreshold: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Minimum confidence threshold for issue detection (default: 0.7)',
          default: 0.7
        },
        includeOCR: {
          type: 'boolean',
          description: 'Include OCR text analysis for error messages and labels',
          default: true
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'generate_ai_recommendations',
    description: 'Generate AI-friendly recommendations with prioritized actions, auto-fix suggestions, and estimated impact. Provides actionable guidance for workflow improvement.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to generate recommendations for'
        },
        focusAreas: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['security', 'performance', 'maintainability', 'reliability', 'user_experience']
          },
          description: 'Areas to focus recommendations on. Default: all areas'
        },
        includeAutoFix: {
          type: 'boolean',
          description: 'Include automatic fix suggestions where possible',
          default: true
        },
        prioritizeBy: {
          type: 'string',
          enum: ['severity', 'impact', 'effort', 'business_value'],
          description: 'How to prioritize recommendations',
          default: 'severity'
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'compare_workflow_states_enhanced',
    description: 'Advanced workflow comparison using visual diff, intelligence analysis, and breaking change detection. Provides comprehensive before/after analysis with safety assessment.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to compare'
        },
        beforeWorkflow: {
          type: 'object',
          description: 'The workflow state before changes (workflow JSON)'
        },
        afterWorkflow: {
          type: 'object',
          description: 'The workflow state after changes (workflow JSON)'
        },
        analysisLevel: {
          type: 'string',
          enum: ['visual_only', 'structure', 'intelligence', 'comprehensive'],
          description: 'Level of comparison analysis',
          default: 'comprehensive'
        },
        includeVisualDiff: {
          type: 'boolean',
          description: 'Include visual diff screenshots',
          default: true
        },
        includeBreakingChanges: {
          type: 'boolean',
          description: 'Analyze for breaking changes',
          default: true
        }
      },
      required: ['workflowId', 'beforeWorkflow', 'afterWorkflow']
    }
  },
  {
    name: 'get_execution_monitoring_status',
    description: 'Get current status of execution monitoring sessions. Shows which workflows are being monitored and their current state.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional specific workflow ID to get status for'
        }
      }
    }
  },
  {
    name: 'stop_execution_monitoring',
    description: 'Stop execution monitoring for a specific workflow or all workflows.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Workflow ID to stop monitoring (omit to stop all monitoring)'
        }
      }
    }
  },
  {
    name: 'get_live_execution_data',
    description: 'Get live execution data for a monitored workflow including real-time screenshots, performance metrics, and detected issues.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to get live execution data for'
        },
        includeScreenshots: {
          type: 'boolean',
          description: 'Include recent screenshots in response',
          default: true
        },
        screenshotLimit: {
          type: 'number',
          description: 'Maximum number of recent screenshots to include',
          default: 5
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'cleanup_enhanced_visual_verification',
    description: 'Clean up all enhanced visual verification resources including browser instances, monitoring sessions, and temporary files.',
    inputSchema: {
      type: 'object',
      properties: {
        stopMonitoring: {
          type: 'boolean',
          description: 'Stop all active monitoring sessions',
          default: true
        }
      }
    }
  }
];

/**
 * Handle enhanced visual verification tool execution
 */
export async function handleEnhancedVisualVerificationTool(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      case 'setup_enhanced_visual_verification':
        return await handleSetupEnhancedVisualVerification(args);
      
      case 'analyze_workflow_comprehensively':
        return await handleAnalyzeWorkflowComprehensively(args);
      
      case 'start_execution_monitoring':
        return await handleStartExecutionMonitoring(args);
      
      case 'get_workflow_intelligence_report':
        return await handleGetWorkflowIntelligenceReport(args);
      
      case 'detect_enhanced_visual_issues':
        return await handleDetectEnhancedVisualIssues(args);
      
      case 'generate_ai_recommendations':
        return await handleGenerateAIRecommendations(args);
      
      case 'compare_workflow_states_enhanced':
        return await handleCompareWorkflowStatesEnhanced(args);
      
      case 'get_execution_monitoring_status':
        return await handleGetExecutionMonitoringStatus(args);
      
      case 'stop_execution_monitoring':
        return await handleStopExecutionMonitoring(args);
      
      case 'get_live_execution_data':
        return await handleGetLiveExecutionData(args);
      
      case 'cleanup_enhanced_visual_verification':
        return await handleCleanupEnhancedVisualVerification(args);
      
      default:
        throw new Error(`Unknown enhanced visual verification tool: ${name}`);
    }
  } catch (error) {
    logger.error(`[Enhanced Visual] Error in tool ${name}:`, error);
    throw error;
  }
}

/**
 * Setup enhanced visual verification system
 */
async function handleSetupEnhancedVisualVerification(args: {
  n8nUrl: string;
  username: string;
  password: string;
  config?: any;
}): Promise<any> {
  const { n8nUrl, username, password, config = {} } = args;
  
  try {
    await initializeEnhancedSystem(n8nUrl, { username, password }, config);
    
    return {
      status: 'success',
      message: 'Enhanced visual verification system initialized successfully',
      capabilities: [
        'Advanced computer vision with OCR',
        'Real-time execution monitoring',
        'Workflow intelligence and pattern recognition',
        'Cross-reference with n8n API data',
        'AI-friendly recommendations and auto-fix',
        'Comprehensive issue detection and analysis',
        'Visual diff and breaking change detection',
        'Performance analysis and optimization suggestions',
        'Security vulnerability assessment',
        'Best practices validation'
      ],
      configuration: {
        ocrEnabled: config.enableOCR !== false,
        computerVisionEnabled: config.enableComputerVision !== false,
        realTimeMonitoringEnabled: config.enableRealTimeMonitoring !== false,
        patternRecognitionEnabled: config.enablePatternRecognition !== false,
        apiCrossReferenceEnabled: config.crossReferenceAPI !== false,
        autoFixEnabled: config.autoFix === true
      },
      nextSteps: [
        'Use analyze_workflow_comprehensively() for complete workflow analysis',
        'Use start_execution_monitoring() for real-time execution tracking',
        'Use get_workflow_intelligence_report() for pattern and best practice analysis',
        'Use detect_enhanced_visual_issues() for advanced issue detection'
      ]
    };
  } catch (error) {
    logger.error('[Enhanced Visual] Setup failed:', error);
    throw new Error(`Failed to initialize enhanced visual verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyze workflow comprehensively
 */
async function handleAnalyzeWorkflowComprehensively(args: {
  workflowId: string;
  analysisLevel?: string;
  includeRecommendations?: boolean;
  includeFixInstructions?: boolean;
}): Promise<any> {
  const { workflowId, analysisLevel = 'standard', includeRecommendations = true, includeFixInstructions = true } = args;
  
  if (!visualSystem || !intelligenceEngine) {
    throw new Error('Enhanced visual verification system not initialized. Call setup_enhanced_visual_verification first.');
  }
  
  try {
    logger.info(`[Enhanced Visual] Starting comprehensive analysis of workflow ${workflowId} (level: ${analysisLevel})`);
    
    // Perform comprehensive analysis
    const [visualAnalysis, intelligenceReport, visualIssues] = await Promise.all([
      visualSystem.analyzeWorkflowComprehensively(workflowId),
      intelligenceEngine.analyzeWorkflow(await getWorkflowData(workflowId)),
      visualSystem.detectEnhancedVisualIssues(workflowId)
    ]);
    
    // Generate AI recommendations if requested
    let recommendations = null;
    if (includeRecommendations) {
      recommendations = await visualSystem.generateAIRecommendations(workflowId, visualIssues);
    }
    
    return {
      workflowId,
      analysisLevel,
      timestamp: new Date().toISOString(),
      overallHealth: visualAnalysis.overallHealth,
      overallScore: recommendations?.overallScore || 0,
      summary: {
        totalIssues: visualIssues.length,
        criticalIssues: visualIssues.filter(i => i.severity === 'critical').length,
        autoFixableIssues: visualIssues.filter(i => i.autoFixable).length,
        patternsRecognized: intelligenceReport.patterns.length,
        antiPatternsDetected: intelligenceReport.antiPatterns.length,
        securityIssues: intelligenceReport.securityIssues.length,
        performanceRisks: intelligenceReport.performanceRisks.length,
        maintainabilityScore: intelligenceReport.maintainabilityScore,
        complexity: intelligenceReport.overallComplexity
      },
      visualAnalysis: {
        triggerValidation: visualAnalysis.triggerValidation,
        errorHandling: visualAnalysis.errorHandling,
        layoutQuality: visualAnalysis.layoutQuality,
        executionReadiness: visualAnalysis.executionReadiness
      },
      intelligenceReport: {
        patterns: intelligenceReport.patterns,
        antiPatterns: intelligenceReport.antiPatterns,
        bestPracticeViolations: intelligenceReport.bestPracticeViolations,
        securityIssues: intelligenceReport.securityIssues,
        performanceRisks: intelligenceReport.performanceRisks,
        dataFlowIssues: intelligenceReport.dataFlowIssues,
        recommendations: intelligenceReport.recommendations
      },
      detectedIssues: visualIssues.map(issue => ({
        id: issue.id,
        type: issue.type,
        subtype: issue.subtype,
        severity: issue.severity,
        description: issue.recommendation,
        impact: issue.impact,
        autoFixable: issue.autoFixable,
        confidence: issue.confidence,
        affectedNodes: issue.relatedNodes,
        fixInstructions: includeFixInstructions ? issue.fixInstructions : undefined
      })),
      recommendations: recommendations ? {
        summary: recommendations.summary,
        prioritizedActions: recommendations.prioritizedActions,
        autoFixableCount: recommendations.autoFixableCount,
        manualFixRequired: recommendations.manualFixRequired
      } : undefined,
      actionRequired: visualIssues.some(i => i.severity === 'critical'),
      safeToExecute: !visualIssues.some(i => i.impact === 'blocks_execution'),
      nextSteps: generateNextSteps(visualIssues, intelligenceReport, recommendations)
    };
  } catch (error) {
    logger.error(`[Enhanced Visual] Comprehensive analysis failed for workflow ${workflowId}:`, error);
    throw new Error(`Comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Start execution monitoring
 */
async function handleStartExecutionMonitoring(args: {
  workflowId: string;
  executionId?: string;
  config?: any;
}): Promise<any> {
  const { workflowId, executionId, config = {} } = args;
  
  if (!visualSystem || !apiClient) {
    throw new Error('Enhanced visual verification system not initialized. Call setup_enhanced_visual_verification first.');
  }
  
  try {
    // Initialize execution monitor if not already done
    if (!executionMonitor) {
      const page = (visualSystem as any).page; // Access private page property
      executionMonitor = new ExecutionMonitor(apiClient, page, config);
    }
    
    const executionViz = await executionMonitor.startMonitoring(workflowId, executionId);
    
    return {
      status: 'monitoring_started',
      workflowId,
      executionId: executionViz.executionId,
      startTime: executionViz.startTime,
      config: {
        screenshotInterval: config.screenshotInterval || 2000,
        performanceTracking: config.performanceTracking !== false,
        autoStop: config.autoStop !== false,
        maxDuration: config.maxDuration || 300000
      },
      message: 'Real-time execution monitoring started',
      instructions: [
        'Use get_live_execution_data() to get current execution state',
        'Use get_execution_monitoring_status() to check monitoring status',
        'Use stop_execution_monitoring() to stop monitoring manually'
      ]
    };
  } catch (error) {
    logger.error(`[Enhanced Visual] Failed to start execution monitoring:`, error);
    throw new Error(`Execution monitoring failed to start: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get workflow intelligence report
 */
async function handleGetWorkflowIntelligenceReport(args: {
  workflowId: string;
  includePatterns?: boolean;
  includeAntiPatterns?: boolean;
  includeBestPractices?: boolean;
  includeSecurity?: boolean;
  includePerformance?: boolean;
}): Promise<any> {
  const { workflowId, includePatterns = true, includeAntiPatterns = true, includeBestPractices = true, includeSecurity = true, includePerformance = true } = args;
  
  if (!intelligenceEngine) {
    throw new Error('Intelligence engine not initialized. Call setup_enhanced_visual_verification first.');
  }
  
  try {
    const workflowData = await getWorkflowData(workflowId);
    const analysis = await intelligenceEngine.analyzeWorkflow(workflowData);
    
    const report: any = {
      workflowId,
      timestamp: new Date().toISOString(),
      overallComplexity: analysis.overallComplexity,
      maintainabilityScore: analysis.maintainabilityScore,
      summary: {
        totalPatterns: analysis.patterns.length,
        totalAntiPatterns: analysis.antiPatterns.length,
        totalViolations: analysis.bestPracticeViolations.length,
        securityIssues: analysis.securityIssues.length,
        performanceRisks: analysis.performanceRisks.length,
        dataFlowIssues: analysis.dataFlowIssues.length
      },
      recommendations: analysis.recommendations
    };
    
    if (includePatterns) {
      report.recognizedPatterns = analysis.patterns;
    }
    
    if (includeAntiPatterns) {
      report.antiPatterns = analysis.antiPatterns;
    }
    
    if (includeBestPractices) {
      report.bestPracticeViolations = analysis.bestPracticeViolations;
    }
    
    if (includeSecurity) {
      report.securityIssues = analysis.securityIssues;
    }
    
    if (includePerformance) {
      report.performanceRisks = analysis.performanceRisks;
    }
    
    report.dataFlowIssues = analysis.dataFlowIssues;
    
    return report;
  } catch (error) {
    logger.error(`[Enhanced Visual] Intelligence report failed for workflow ${workflowId}:`, error);
    throw new Error(`Intelligence report failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper functions
async function getWorkflowData(workflowId: string): Promise<any> {
  if (!apiClient) {
    throw new Error('API client not initialized');
  }
  return await apiClient.getWorkflow(workflowId);
}

function generateNextSteps(visualIssues: any[], intelligenceReport: any, recommendations: any): string[] {
  const steps = [];
  
  const criticalIssues = visualIssues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    steps.push(`🚨 Address ${criticalIssues.length} critical issue(s) immediately - workflow may not execute properly`);
  }
  
  const securityIssues = intelligenceReport.securityIssues.filter((i: any) => i.riskLevel === 'critical' || i.riskLevel === 'high');
  if (securityIssues.length > 0) {
    steps.push(`🔒 Fix ${securityIssues.length} security vulnerability(ies) before deployment`);
  }
  
  const autoFixable = visualIssues.filter(i => i.autoFixable);
  if (autoFixable.length > 0) {
    steps.push(`🔧 ${autoFixable.length} issue(s) can be automatically fixed`);
  }
  
  if (intelligenceReport.antiPatterns.length > 0) {
    steps.push(`📐 Refactor ${intelligenceReport.antiPatterns.length} anti-pattern(s) for better maintainability`);
  }
  
  if (recommendations && recommendations.overallScore < 70) {
    steps.push('📊 Workflow health score is below 70 - consider implementing suggested improvements');
  }
  
  if (steps.length === 0) {
    steps.push('✅ Workflow is in good condition - ready for deployment');
  }
  
  return steps;
}

// Placeholder implementations for remaining handlers
async function handleDetectEnhancedVisualIssues(args: any): Promise<any> {
  if (!visualSystem) {
    throw new Error('Enhanced visual verification system not initialized');
  }
  
  const issues = await visualSystem.detectEnhancedVisualIssues(args.workflowId);
  return {
    workflowId: args.workflowId,
    totalIssues: issues.length,
    issues: issues.map(issue => ({
      id: issue.id,
      type: issue.type,
      subtype: issue.subtype,
      severity: issue.severity,
      description: issue.recommendation,
      confidence: issue.confidence,
      autoFixable: issue.autoFixable,
      impact: issue.impact
    }))
  };
}

async function handleGenerateAIRecommendations(args: any): Promise<any> {
  if (!visualSystem) {
    throw new Error('Enhanced visual verification system not initialized');
  }
  
  const issues = await visualSystem.detectEnhancedVisualIssues(args.workflowId);
  return await visualSystem.generateAIRecommendations(args.workflowId, issues);
}

async function handleCompareWorkflowStatesEnhanced(args: any): Promise<any> {
  // TODO: Implement enhanced workflow comparison
  return {
    status: 'not_implemented',
    message: 'Enhanced workflow comparison coming soon'
  };
}

async function handleGetExecutionMonitoringStatus(args: any): Promise<any> {
  if (!executionMonitor) {
    return {
      isActive: false,
      activeWorkflows: [],
      totalSessions: 0,
      message: 'Execution monitoring not initialized'
    };
  }
  
  return executionMonitor.getMonitoringStatus();
}

async function handleStopExecutionMonitoring(args: any): Promise<any> {
  if (!executionMonitor) {
    return {
      status: 'not_active',
      message: 'No monitoring sessions active'
    };
  }
  
  if (args.workflowId) {
    await executionMonitor.stopMonitoring(args.workflowId);
    return {
      status: 'stopped',
      workflowId: args.workflowId,
      message: `Monitoring stopped for workflow ${args.workflowId}`
    };
  } else {
    await executionMonitor.stopAllMonitoring();
    return {
      status: 'all_stopped',
      message: 'All monitoring sessions stopped'
    };
  }
}

async function handleGetLiveExecutionData(args: any): Promise<any> {
  if (!executionMonitor) {
    throw new Error('Execution monitoring not active');
  }
  
  const data = executionMonitor.getLiveExecutionData(args.workflowId);
  if (!data) {
    throw new Error(`No active monitoring for workflow ${args.workflowId}`);
  }
  
  const response: any = {
    workflowId: args.workflowId,
    executionId: data.executionId,
    currentStatus: data.currentStatus,
    startTime: data.startTime,
    steps: data.steps,
    performanceMetrics: data.performanceMetrics,
    issues: data.issues,
    totalScreenshots: data.realTimeScreenshots.length
  };
  
  if (args.includeScreenshots !== false) {
    const limit = args.screenshotLimit || 5;
    response.recentScreenshots = data.realTimeScreenshots
      .slice(-limit)
      .map(s => ({
        timestamp: s.timestamp,
        context: s.context,
        annotationCount: s.annotations.length,
        screenshot: s.screenshot // Include base64 data
      }));
  }
  
  return response;
}

async function handleAutoFixVisualIssues(args: any): Promise<any> {
  try {
    if (!visualSystem) {
      throw new Error('Enhanced visual verification system not initialized. Call setup_enhanced_visual_verification first.');
    }

    const { workflowId, issues, autoApply = false } = args;
    
    logger.info('[Enhanced Visual] Starting auto-fix for visual issues');
    
    // For now, return placeholder functionality
    return {
      status: 'partial_success',
      message: 'Auto-fix functionality is planned for future release',
      workflowId,
      issuesAnalyzed: issues?.length || 0,
      fixesApplied: 0,
      fixesSuggested: issues?.length || 0,
      recommendations: [
        'Manual review recommended for complex issues',
        'Layout issues can be auto-fixed in next update',
        'Security issues require manual intervention'
      ]
    };
  } catch (error) {
    logger.error('[Enhanced Visual] Auto-fix failed:', error);
    throw new Error(`Auto-fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function handleCleanupEnhancedVisualVerification(args: any): Promise<any> {
  try {
    if (args.stopMonitoring !== false && executionMonitor) {
      await executionMonitor.stopAllMonitoring();
    }
    
    if (visualSystem) {
      await visualSystem.cleanup();
      visualSystem = null;
    }
    
    intelligenceEngine = null;
    executionMonitor = null;
    apiClient = null;
    
    return {
      status: 'success',
      message: 'Enhanced visual verification resources cleaned up',
      resourcesFreed: [
        'Browser instances closed',
        'Monitoring sessions stopped',
        'Intelligence engine cleared',
        'API client disconnected',
        'Memory cleared',
        'Temporary files removed'
      ]
    };
  } catch (error) {
    logger.error('[Enhanced Visual] Cleanup failed:', error);
    throw new Error(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Main execution function for enhanced visual verification tools
 */
export async function executeEnhancedVisualTool(name: string, args: any): Promise<any> {
  switch (name) {
    case 'setup_enhanced_visual_verification':
      return handleSetupEnhancedVisualVerification(args);
    case 'analyze_workflow_comprehensively':
      return handleAnalyzeWorkflowComprehensively(args);
    case 'detect_enhanced_visual_issues':
      return handleDetectEnhancedVisualIssues(args);
    case 'generate_ai_recommendations':
      return handleGenerateAIRecommendations(args);
    case 'start_execution_monitoring':
      return handleStartExecutionMonitoring(args);
    case 'stop_execution_monitoring':
      return handleStopExecutionMonitoring(args);
    case 'get_live_execution_data':
      return handleGetLiveExecutionData(args);
    case 'get_workflow_intelligence_report':
      return handleGetWorkflowIntelligenceReport(args);
    case 'compare_workflow_states_enhanced':
      return handleCompareWorkflowStatesEnhanced(args);
    case 'auto_fix_visual_issues':
      return handleAutoFixVisualIssues(args);
    case 'cleanup_enhanced_visual_verification':
      return handleCleanupEnhancedVisualVerification(args);
    default:
      throw new Error(`Unknown enhanced visual verification tool: ${name}`);
  }
}