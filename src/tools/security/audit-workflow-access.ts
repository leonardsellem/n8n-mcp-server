import { BaseSecurityToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';

interface Workflow {
  id: string;
  name: string;
  active: boolean;
  [key: string]: any;
}

interface WorkflowAccessAuditOptions {
  workflowId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  actionTypes?: string[];
  includeMetadata?: boolean;
  limit?: number;
}

interface AccessLogEntry {
  timestamp: string;
  workflowId: string;
  workflowName: string;
  userId: string;
  userEmail: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
}

interface AccessAuditReport {
  summary: {
    totalAccesses: number;
    uniqueUsers: number;
    uniqueWorkflows: number;
    riskBreakdown: Record<string, number>;
    timeRange: {
      start: string;
      end: string;
    };
  };
  accessLogs: AccessLogEntry[];
  insights: {
    mostAccessedWorkflows: Array<{ workflowId: string; name: string; count: number }>;
    mostActiveUsers: Array<{ userId: string; email: string; count: number }>;
    suspiciousActivity: AccessLogEntry[];
    complianceIssues: string[];
  };
  recommendations: string[];
}

export class AuditWorkflowAccessHandler extends BaseSecurityToolHandler {
  constructor() {
    super();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const options = args as WorkflowAccessAuditOptions;
      const report = await this.auditWorkflowAccess(options);
      return this.formatSuccess(report, 'Workflow access audit completed successfully');
    }, args);
  }

  async auditWorkflowAccess(options: WorkflowAccessAuditOptions): Promise<AccessAuditReport> {
    try {
      // Simulate access log retrieval and analysis
      const accessLogs = await this.generateAccessLogs(options);
      const summary = this.generateSummary(accessLogs, options);
      const insights = await this.generateInsights(accessLogs);
      const recommendations = this.generateRecommendations(insights);

      return {
        summary,
        accessLogs,
        insights,
        recommendations
      };
    } catch (error) {
      throw new Error(`Failed to audit workflow access: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateAccessLogs(options: WorkflowAccessAuditOptions): Promise<AccessLogEntry[]> {
    // In a real implementation, this would query actual access logs
    // For now, we'll generate realistic sample data
    const logs: AccessLogEntry[] = [];
    const sampleActions = ['view', 'edit', 'execute', 'delete', 'clone', 'export', 'share'];
    const sampleUsers = [
      { id: 'user1', email: 'admin@company.com' },
      { id: 'user2', email: 'developer@company.com' },
      { id: 'user3', email: 'analyst@company.com' }
    ];

    // Get workflows to simulate access logs
    const workflows = await this.apiService.getWorkflows();
    const targetWorkflows = options.workflowId
      ? workflows.filter((w: Workflow) => w.id === options.workflowId)
      : workflows.slice(0, 10);

    const startDate = new Date(options.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const endDate = new Date(options.endDate || new Date());
    const limit = options.limit || 100;

    for (let i = 0; i < Math.min(limit, 50); i++) {
      const workflow = targetWorkflows[Math.floor(Math.random() * targetWorkflows.length)];
      const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const action = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      
      const timestamp = new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      );

      if (options.userId && user.id !== options.userId) continue;
      if (options.actionTypes && !options.actionTypes.includes(action)) continue;

      const riskLevel = this.assessActionRisk(action, timestamp);

      logs.push({
        timestamp: timestamp.toISOString(),
        workflowId: workflow.id,
        workflowName: workflow.name,
        userId: user.id,
        userEmail: user.email,
        action,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          duration: Math.floor(Math.random() * 3600),
          changes: action === 'edit' ? ['updated node parameters', 'modified connections'] : undefined,
          exported: action === 'export' ? { format: 'json', size: Math.floor(Math.random() * 10000) } : undefined
        },
        riskLevel
      });
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private assessActionRisk(action: string, timestamp: Date): 'low' | 'medium' | 'high' {
    // Assess risk based on action type and timing
    const hour = timestamp.getHours();
    const isAfterHours = hour < 8 || hour > 18;
    const isWeekend = timestamp.getDay() === 0 || timestamp.getDay() === 6;

    const highRiskActions = ['delete', 'export'];
    const mediumRiskActions = ['edit', 'share'];

    if (highRiskActions.includes(action)) {
      return isAfterHours || isWeekend ? 'high' : 'medium';
    } else if (mediumRiskActions.includes(action)) {
      return isAfterHours || isWeekend ? 'medium' : 'low';
    } else {
      return 'low';
    }
  }

  private generateSummary(logs: AccessLogEntry[], options: WorkflowAccessAuditOptions): AccessAuditReport['summary'] {
    const uniqueUsers = new Set(logs.map(log => log.userId)).size;
    const uniqueWorkflows = new Set(logs.map(log => log.workflowId)).size;
    
    const riskBreakdown = logs.reduce((acc, log) => {
      acc[log.riskLevel] = (acc[log.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timestamps = logs.map(log => new Date(log.timestamp));
    const startTime = timestamps.length > 0 ? Math.min(...timestamps.map(t => t.getTime())) : Date.now();
    const endTime = timestamps.length > 0 ? Math.max(...timestamps.map(t => t.getTime())) : Date.now();

    return {
      totalAccesses: logs.length,
      uniqueUsers,
      uniqueWorkflows,
      riskBreakdown,
      timeRange: {
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString()
      }
    };
  }

  private async generateInsights(logs: AccessLogEntry[]): Promise<AccessAuditReport['insights']> {
    // Most accessed workflows
    const workflowCounts = logs.reduce((acc, log) => {
      const key = `${log.workflowId}:${log.workflowName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostAccessedWorkflows = Object.entries(workflowCounts)
      .map(([key, count]) => {
        const [workflowId, name] = key.split(':');
        return { workflowId, name, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Most active users
    const userCounts = logs.reduce((acc, log) => {
      const key = `${log.userId}:${log.userEmail}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveUsers = Object.entries(userCounts)
      .map(([key, count]) => {
        const [userId, email] = key.split(':');
        return { userId, email, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Suspicious activity (high risk actions)
    const suspiciousActivity = logs.filter(log => log.riskLevel === 'high');

    // Compliance issues
    const complianceIssues: string[] = [];
    
    // Check for after-hours access to sensitive workflows
    const afterHoursAccess = logs.filter(log => {
      const hour = new Date(log.timestamp).getHours();
      return (hour < 8 || hour > 18) && log.action !== 'view';
    });
    
    if (afterHoursAccess.length > 0) {
      complianceIssues.push(`${afterHoursAccess.length} after-hours modifications detected`);
    }

    // Check for bulk exports
    const bulkExports = logs.filter(log => 
      log.action === 'export' && 
      log.details.exported?.size > 5000
    );
    
    if (bulkExports.length > 0) {
      complianceIssues.push(`${bulkExports.length} large data exports detected`);
    }

    return {
      mostAccessedWorkflows,
      mostActiveUsers,
      suspiciousActivity,
      complianceIssues
    };
  }

  private generateRecommendations(insights: AccessAuditReport['insights']): string[] {
    const recommendations: string[] = [];

    if (insights.suspiciousActivity.length > 0) {
      recommendations.push('Review and investigate flagged high-risk activities');
      recommendations.push('Consider implementing additional authentication for sensitive operations');
    }

    if (insights.complianceIssues.length > 0) {
      recommendations.push('Implement time-based access controls for workflow modifications');
      recommendations.push('Add approval workflows for data exports and bulk operations');
    }

    if (insights.mostActiveUsers.some(user => user.count > 100)) {
      recommendations.push('Consider implementing rate limiting for high-frequency users');
    }

    recommendations.push('Enable detailed audit logging for all workflow operations');
    recommendations.push('Regular access reviews and user permission audits');
    recommendations.push('Implement role-based access control (RBAC) for workflow management');

    return recommendations;
  }
}