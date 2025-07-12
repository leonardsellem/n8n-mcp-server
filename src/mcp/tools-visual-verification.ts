// src/mcp/tools-visual-verification.ts

import { VisualVerificationSystem } from '../services/visual-verification';
import { logger } from '../utils/logger';

/**
 * Visual Verification MCP Tools
 * 
 * These tools provide "eyes" for the MCP server, enabling visual analysis
 * of n8n workflows that goes beyond text-based validation. They can detect
 * visual issues that would be invisible to traditional validation.
 */

let visualSystem: VisualVerificationSystem | null = null;

/**
 * Initialize visual verification system
 */
async function initializeVisualSystem(n8nUrl: string, credentials: { username: string; password: string }): Promise<void> {
  if (!visualSystem) {
    visualSystem = new VisualVerificationSystem(n8nUrl, credentials);
    await visualSystem.initialize();
    logger.info('[Visual Verification] System initialized');
  }
}

/**
 * Get visual verification system instance
 */
function getVisualSystem(): VisualVerificationSystem {
  if (!visualSystem) {
    throw new Error('Visual verification system not initialized. Call setup_visual_verification first.');
  }
  return visualSystem;
}

/**
 * Visual verification tool definitions
 */
export const visualVerificationTools = [
  {
    name: 'setup_visual_verification',
    description: 'Initialize visual verification system with n8n credentials. Required before using other visual tools.',
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
        }
      },
      required: ['n8nUrl', 'username', 'password']
    }
  },
  {
    name: 'verify_workflow_visually',
    description: 'Perform comprehensive visual analysis of a workflow. Returns annotated screenshot showing detected issues like overlapping nodes, error badges, disconnected components. This is the main visual verification tool.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The n8n workflow ID to analyze visually'
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'compare_workflow_states',
    description: 'Compare two workflow states visually to detect breaking changes. Essential for safe updates - shows visual diff and identifies potential issues before applying changes.',
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
        }
      },
      required: ['workflowId', 'beforeWorkflow', 'afterWorkflow']
    }
  },
  {
    name: 'check_workflow_health',
    description: 'Quick visual health check of a workflow. Returns overall health status (healthy/warning/error) and summary of any visual issues detected.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to check'
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'get_workflow_visual_summary',
    description: 'Get visual summary of workflow structure without full analysis. Returns node positions, connections, and basic visual metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'The workflow ID to summarize'
        }
      },
      required: ['workflowId']
    }
  },
  {
    name: 'cleanup_visual_verification',
    description: 'Clean up visual verification resources (browser instances). Use this when done with visual verification to free resources.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

/**
 * Handle visual verification tool execution
 */
export async function handleVisualVerificationTool(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      case 'setup_visual_verification':
        return await handleSetupVisualVerification(args);
      
      case 'verify_workflow_visually':
        return await handleVerifyWorkflowVisually(args);
      
      case 'compare_workflow_states':
        return await handleCompareWorkflowStates(args);
      
      case 'check_workflow_health':
        return await handleCheckWorkflowHealth(args);
      
      case 'get_workflow_visual_summary':
        return await handleGetWorkflowVisualSummary(args);
      
      case 'cleanup_visual_verification':
        return await handleCleanupVisualVerification();
      
      default:
        throw new Error(`Unknown visual verification tool: ${name}`);
    }
  } catch (error) {
    logger.error(`[Visual Verification] Error in tool ${name}:`, error);
    throw error;
  }
}

/**
 * Setup visual verification system
 */
async function handleSetupVisualVerification(args: {
  n8nUrl: string;
  username: string;
  password: string;
}): Promise<any> {
  const { n8nUrl, username, password } = args;
  
  try {
    await initializeVisualSystem(n8nUrl, { username, password });
    
    return {
      status: 'success',
      message: 'Visual verification system initialized successfully',
      capabilities: [
        'Visual workflow analysis',
        'Issue detection (overlaps, errors, disconnections)',
        'Annotated screenshot generation',
        'Breaking change detection',
        'Workflow health assessment'
      ],
      nextSteps: [
        'Use verify_workflow_visually() to analyze workflows',
        'Use compare_workflow_states() before updating workflows',
        'Use check_workflow_health() for quick status checks'
      ]
    };
  } catch (error) {
    logger.error('[Visual Verification] Setup failed:', error);
    throw new Error(`Failed to initialize visual verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify workflow visually
 */
async function handleVerifyWorkflowVisually(args: {
  workflowId: string;
}): Promise<any> {
  const { workflowId } = args;
  const system = getVisualSystem();
  
  try {
    logger.info(`[Visual Verification] Starting visual analysis of workflow ${workflowId}`);
    
    const result = await system.verifyWorkflow(workflowId);
    
    return {
      workflowId,
      overallHealth: result.overallHealth,
      issuesDetected: result.issues.length,
      summary: {
        nodes: result.nodePositions.length,
        connections: result.connectionPaths.length,
        overlaps: result.issues.filter((i: any) => i.type === 'overlap').length,
        errors: result.issues.filter((i: any) => i.type === 'error').length,
        outdated: result.issues.filter((i: any) => i.type === 'outdated').length,
        disconnected: result.issues.filter((i: any) => i.type === 'disconnected').length,
        crossings: result.issues.filter((i: any) => i.type === 'crossing').length
      },
      issues: result.issues.map((issue: any) => ({
        type: issue.type,
        severity: issue.severity,
        description: issue.description,
        affectedNodes: issue.affectedNodes,
        coordinates: issue.coordinates
      })),
      screenshot: {
        base64: result.base64Image,
        annotated: result.issues.length > 0,
        description: result.issues.length > 0 
          ? 'Annotated screenshot showing detected issues with numbered markers and legend'
          : 'Clean screenshot with no issues detected'
      },
      recommendations: generateRecommendations(result.issues),
      actionRequired: result.overallHealth === 'error',
      canSafelyUpdate: result.overallHealth !== 'error'
    };
  } catch (error) {
    logger.error(`[Visual Verification] Failed to verify workflow ${workflowId}:`, error);
    throw new Error(`Visual verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compare workflow states
 */
async function handleCompareWorkflowStates(args: {
  workflowId: string;
  beforeWorkflow: any;
  afterWorkflow: any;
}): Promise<any> {
  const { workflowId, beforeWorkflow, afterWorkflow } = args;
  const system = getVisualSystem();
  
  try {
    logger.info(`[Visual Verification] Comparing workflow states for ${workflowId}`);
    
    const comparison = await system.compareWorkflowVisually(workflowId, beforeWorkflow, afterWorkflow);
    
    return {
      workflowId,
      changesSummary: comparison.changesSummary,
      breakingChanges: comparison.breakingChanges,
      safeToUpdate: !comparison.breakingChanges,
      visualDiff: {
        available: comparison.visualDiff.length > 0,
        description: 'Visual diff showing before/after comparison'
      },
      recommendations: comparison.breakingChanges 
        ? ['Review changes carefully', 'Test in staging environment', 'Consider reverting problematic changes']
        : ['Changes appear safe to deploy', 'Continue with update'],
      nextSteps: comparison.breakingChanges
        ? 'Fix breaking changes before updating workflow'
        : 'Safe to proceed with workflow update'
    };
  } catch (error) {
    logger.error(`[Visual Verification] Failed to compare workflow states for ${workflowId}:`, error);
    throw new Error(`Visual comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check workflow health
 */
async function handleCheckWorkflowHealth(args: {
  workflowId: string;
}): Promise<any> {
  const { workflowId } = args;
  const system = getVisualSystem();
  
  try {
    logger.info(`[Visual Verification] Checking health of workflow ${workflowId}`);
    
    const result = await system.verifyWorkflow(workflowId);
    
    return {
      workflowId,
      overallHealth: result.overallHealth,
      summary: {
        status: result.overallHealth,
        totalIssues: result.issues.length,
        criticalIssues: result.issues.filter((i: any) => i.severity === 'high').length,
        warningIssues: result.issues.filter((i: any) => i.severity === 'medium').length,
        minorIssues: result.issues.filter((i: any) => i.severity === 'low').length
      },
      quickFixes: getQuickFixes(result.issues),
      actionRequired: result.overallHealth === 'error',
      recommendation: getHealthRecommendation(result.overallHealth, result.issues.length)
    };
  } catch (error) {
    logger.error(`[Visual Verification] Failed to check workflow health for ${workflowId}:`, error);
    throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get workflow visual summary
 */
async function handleGetWorkflowVisualSummary(args: {
  workflowId: string;
}): Promise<any> {
  const { workflowId } = args;
  const system = getVisualSystem();
  
  try {
    logger.info(`[Visual Verification] Getting visual summary of workflow ${workflowId}`);
    
    const result = await system.verifyWorkflow(workflowId);
    
    return {
      workflowId,
      structure: {
        totalNodes: result.nodePositions.length,
        totalConnections: result.connectionPaths.length,
        nodeTypes: getNodeTypeDistribution(result.nodePositions),
        layout: getLayoutMetrics(result.nodePositions)
      },
      visualMetrics: {
        averageNodeSpacing: calculateAverageSpacing(result.nodePositions),
        workflowDensity: calculateDensity(result.nodePositions),
        connectionComplexity: calculateConnectionComplexity(result.connectionPaths)
      },
      overallHealth: result.overallHealth,
      hasVisualIssues: result.issues.length > 0
    };
  } catch (error) {
    logger.error(`[Visual Verification] Failed to get visual summary for ${workflowId}:`, error);
    throw new Error(`Visual summary failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cleanup visual verification
 */
async function handleCleanupVisualVerification(): Promise<any> {
  try {
    if (visualSystem) {
      await visualSystem.cleanup();
      visualSystem = null;
      logger.info('[Visual Verification] Resources cleaned up successfully');
    }
    
    return {
      status: 'success',
      message: 'Visual verification resources cleaned up',
      resourcesFreed: [
        'Browser instances closed',
        'Memory cleared',
        'Temporary files removed'
      ]
    };
  } catch (error) {
    logger.error('[Visual Verification] Cleanup failed:', error);
    throw new Error(`Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate recommendations based on issues
 */
function generateRecommendations(issues: any[]): string[] {
  const recommendations: string[] = [];
  
  const hasOverlaps = issues.some((i: any) => i.type === 'overlap');
  const hasErrors = issues.some((i: any) => i.type === 'error');
  const hasOutdated = issues.some((i: any) => i.type === 'outdated');
  const hasDisconnected = issues.some((i: any) => i.type === 'disconnected');
  
  if (hasErrors) {
    recommendations.push('🚨 Fix configuration errors immediately - workflow will not execute properly');
  }
  
  if (hasOverlaps) {
    recommendations.push('📐 Rearrange overlapping nodes to improve readability');
  }
  
  if (hasOutdated) {
    recommendations.push('📦 Update outdated nodes to latest versions');
  }
  
  if (hasDisconnected) {
    recommendations.push('🔗 Connect disconnected nodes or remove if not needed');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ Workflow looks good visually - no issues detected');
  }
  
  return recommendations;
}

/**
 * Get quick fixes for common issues
 */
function getQuickFixes(issues: any[]): string[] {
  const fixes: string[] = [];
  
  issues.forEach((issue: any) => {
    switch (issue.type) {
      case 'overlap':
        fixes.push(`Move nodes apart: ${issue.affectedNodes.join(', ')}`);
        break;
      case 'error':
        fixes.push(`Fix configuration: ${issue.affectedNodes.join(', ')}`);
        break;
      case 'outdated':
        fixes.push(`Update nodes: ${issue.affectedNodes.join(', ')}`);
        break;
      case 'disconnected':
        fixes.push(`Connect or remove: ${issue.affectedNodes.join(', ')}`);
        break;
    }
  });
  
  return fixes;
}

/**
 * Get health recommendation
 */
function getHealthRecommendation(health: string, issueCount: number): string {
  switch (health) {
    case 'healthy':
      return 'Workflow is in excellent condition. Safe to use and update.';
    case 'warning':
      return `Workflow has ${issueCount} minor issues. Consider fixing before production use.`;
    case 'error':
      return `Workflow has critical issues that must be fixed before it can run properly.`;
    default:
      return 'Unable to determine workflow health status.';
  }
}

/**
 * Get node type distribution
 */
function getNodeTypeDistribution(nodes: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  nodes.forEach((node: any) => {
    const type = node.type || 'unknown';
    distribution[type] = (distribution[type] || 0) + 1;
  });
  
  return distribution;
}

/**
 * Get layout metrics
 */
function getLayoutMetrics(nodes: any[]): any {
  if (nodes.length === 0) {
    return { width: 0, height: 0, centerX: 0, centerY: 0 };
  }
  
  const xs = nodes.map((n: any) => n.x);
  const ys = nodes.map((n: any) => n.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  return {
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

/**
 * Calculate average spacing between nodes
 */
function calculateAverageSpacing(nodes: any[]): number {
  if (nodes.length < 2) return 0;
  
  let totalDistance = 0;
  let pairCount = 0;
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      totalDistance += distance;
      pairCount++;
    }
  }
  
  return totalDistance / pairCount;
}

/**
 * Calculate workflow density
 */
function calculateDensity(nodes: any[]): number {
  if (nodes.length === 0) return 0;
  
  const layout = getLayoutMetrics(nodes);
  const area = layout.width * layout.height;
  
  if (area === 0) return 0;
  
  return nodes.length / area;
}

/**
 * Calculate connection complexity
 */
function calculateConnectionComplexity(connections: any[]): number {
  if (connections.length === 0) return 0;
  
  // Simple complexity metric based on number of connections and path length
  const totalPathLength = connections.reduce((sum: number, conn: any) => {
    return sum + (conn.path?.length || 0);
  }, 0);
  
  return totalPathLength / connections.length;
}
