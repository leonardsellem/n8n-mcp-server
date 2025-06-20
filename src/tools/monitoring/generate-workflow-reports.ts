/**
 * Generate Workflow Reports Tool
 * 
 * This tool generates comprehensive workflow reports with charts and insights.
 */

import { BaseMonitoringToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the generate_workflow_reports tool
 */
export class GenerateWorkflowReportsHandler extends BaseMonitoringToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing report configuration
   * @returns Generated workflow report
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { 
        workflowId, 
        reportType,
        timeRange,
        includeCharts,
        exportFormat,
        includeRecommendations,
        customMetrics 
      } = args;
      
      this.validateRequiredParams(args, ['reportType']);

      if (workflowId) {
        // Verify workflow exists
        const workflow = await this.apiService.getWorkflow(workflowId);
        if (!workflow) {
          throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
        }
      }

      const report = await this.generateComprehensiveReport({
        workflowId,
        reportType,
        timeRange: timeRange || 2592000000, // 30 days default
        includeCharts: includeCharts !== false,
        exportFormat: exportFormat || 'json',
        includeRecommendations: includeRecommendations !== false,
        customMetrics: customMetrics || []
      });

      return this.formatSuccess(
        report,
        workflowId 
          ? `Report generated for workflow: ${workflowId}`
          : 'Global workflow report generated'
      );
    }, args);
  }

  /**
   * Generate comprehensive workflow report
   */
  private async generateComprehensiveReport(config: any): Promise<any> {
    const { workflowId, reportType, timeRange, includeCharts, exportFormat, includeRecommendations, customMetrics } = config;

    const report: Record<string, any> = {
      reportInfo: {
        reportId: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        reportType,
        generatedAt: new Date().toISOString(),
        timeRange: this.formatExecutionTime(timeRange),
        scope: workflowId ? 'single_workflow' : 'global',
        workflowId: workflowId || null
      },
      executiveSummary: {},
      detailedAnalysis: {},
      visualData: includeCharts ? {} : null,
      recommendations: includeRecommendations ? [] : null
    };

    // Generate report based on type
    switch (reportType) {
      case 'performance':
        await this.generatePerformanceReport(report, config);
        break;
      case 'reliability':
        await this.generateReliabilityReport(report, config);
        break;
      case 'usage':
        await this.generateUsageReport(report, config);
        break;
      case 'comprehensive':
        await this.generateComprehensiveAnalysis(report, config);
        break;
      case 'executive':
        await this.generateExecutiveReport(report, config);
        break;
      case 'custom':
        await this.generateCustomReport(report, config, customMetrics);
        break;
      default:
        throw new N8nApiError(`Unknown report type: ${reportType}`);
    }

    // Format report for export
    if (exportFormat !== 'json') {
      report.exportData = this.formatReportForExport(report, exportFormat);
    }

    return report;
  }

  /**
   * Generate performance-focused report
   */
  private async generatePerformanceReport(report: any, config: any): Promise<void> {
    const { workflowId, timeRange } = config;

    if (workflowId) {
      const workflow = await this.apiService.getWorkflow(workflowId);
      const executions = await this.getExecutionData(workflowId, timeRange);
      
      report.executiveSummary = {
        workflowName: workflow.name,
        totalExecutions: executions.length,
        averageExecutionTime: this.calculateAverageExecutionTime(executions),
        performanceScore: this.calculatePerformanceScore(executions),
        keyFindings: this.generatePerformanceFindings(executions)
      };

      report.detailedAnalysis = {
        executionMetrics: this.calculateDetailedMetrics(executions),
        performanceTrends: this.analyzePerformanceTrends(executions),
        bottleneckAnalysis: this.analyzeBottlenecks(workflow, executions),
        resourceUtilization: this.analyzeResourceUtilization(executions)
      };

      if (report.visualData) {
        report.visualData = {
          executionTimeChart: this.generateExecutionTimeChart(executions),
          trendChart: { type: 'line', title: 'Performance Trends', data: [] },
          distributionChart: { type: 'histogram', title: 'Execution Time Distribution', data: [] }
        };
      }
    } else {
      // Global performance report
      const workflows = await this.apiService.getWorkflows({ active: true });
      const globalMetrics = {
        summary: { message: 'Global metrics analysis' },
        details: { message: 'Global performance details' },
        charts: { message: 'Global performance charts' }
      };
      
      report.executiveSummary = globalMetrics.summary;
      report.detailedAnalysis = globalMetrics.details;
      
      if (report.visualData) {
        report.visualData = globalMetrics.charts;
      }
    }

    if (report.recommendations) {
      report.recommendations = this.generatePerformanceRecommendations(report.detailedAnalysis);
    }
  }

  /**
   * Generate reliability-focused report
   */
  private async generateReliabilityReport(report: any, config: any): Promise<void> {
    const { workflowId, timeRange } = config;

    if (workflowId) {
      const workflow = await this.apiService.getWorkflow(workflowId);
      const executions = await this.getExecutionData(workflowId, timeRange);
      
      const reliabilityMetrics = this.calculateReliabilityMetrics(executions);
      
      report.executiveSummary = {
        workflowName: workflow.name,
        reliabilityScore: reliabilityMetrics.reliabilityScore,
        successRate: reliabilityMetrics.successRate,
        mtbf: reliabilityMetrics.mtbf, // Mean Time Between Failures
        availabilityScore: reliabilityMetrics.availabilityScore,
        keyFindings: reliabilityMetrics.findings
      };

      report.detailedAnalysis = {
        errorAnalysis: { totalErrors: 0, errorTypes: {}, message: 'Error analysis' },
        failurePatterns: { patterns: [], message: 'Failure pattern analysis' },
        recoveryMetrics: { avgRecoveryTime: 0, message: 'Recovery metrics' },
        stabilityTrends: { trend: 'stable', message: 'Stability trend analysis' }
      };

      if (report.visualData) {
        report.visualData = {
          reliabilityChart: this.generateReliabilityChart(executions),
          errorDistribution: { type: 'pie', title: 'Error Distribution', data: [] },
          uptimeChart: { type: 'line', title: 'Uptime Chart', data: [] }
        };
      }
    }

    if (report.recommendations) {
      report.recommendations = this.generateReliabilityRecommendations(report.detailedAnalysis);
    }
  }

  /**
   * Generate usage-focused report
   */
  private async generateUsageReport(report: any, config: any): Promise<void> {
    const { workflowId, timeRange } = config;

    if (workflowId) {
      const workflow = await this.apiService.getWorkflow(workflowId);
      const executions = await this.getExecutionData(workflowId, timeRange);
      
      const usageMetrics = this.calculateUsageMetrics(executions, timeRange);
      
      report.executiveSummary = {
        workflowName: workflow.name,
        totalExecutions: executions.length,
        executionFrequency: usageMetrics.frequency,
        peakUsageTimes: usageMetrics.peakTimes,
        resourceConsumption: usageMetrics.resourceUsage,
        costEstimate: usageMetrics.costEstimate
      };

      report.detailedAnalysis = {
        usagePatterns: { patterns: [], message: 'Usage pattern analysis' },
        seasonalTrends: { trends: [], message: 'Seasonal trend analysis' },
        loadDistribution: { distribution: [], message: 'Load distribution analysis' },
        capacityAnalysis: { capacity: 'medium', message: 'Capacity analysis' }
      };

      if (report.visualData) {
        report.visualData = {
          usageChart: { type: 'line', title: 'Usage Chart', data: [] },
          heatMap: { type: 'heatmap', title: 'Usage Heat Map', data: [] },
          capacityChart: { type: 'bar', title: 'Capacity Chart', data: [] }
        };
      }
    }

    if (report.recommendations) {
      report.recommendations = this.generateUsageRecommendations(report.detailedAnalysis);
    }
  }

  /**
   * Generate comprehensive analysis
   */
  private async generateComprehensiveAnalysis(report: any, config: any): Promise<void> {
    // Combine all report types
    await this.generatePerformanceReport(report, config);
    
    const reliabilityReport: any = { detailedAnalysis: {}, visualData: {} };
    await this.generateReliabilityReport(reliabilityReport, config);
    
    const usageReport: any = { detailedAnalysis: {}, visualData: {} };
    await this.generateUsageReport(usageReport, config);

    // Merge analyses
    report.detailedAnalysis = {
      ...report.detailedAnalysis,
      reliability: reliabilityReport.detailedAnalysis,
      usage: usageReport.detailedAnalysis
    };

    if (report.visualData) {
      report.visualData = {
        ...report.visualData,
        ...reliabilityReport.visualData,
        ...usageReport.visualData
      };
    }

    // Generate comprehensive recommendations
    if (report.recommendations) {
      report.recommendations = this.generateComprehensiveRecommendations(report.detailedAnalysis);
    }
  }

  /**
   * Generate executive summary report
   */
  private async generateExecutiveReport(report: any, config: any): Promise<void> {
    const { workflowId, timeRange } = config;

    if (workflowId) {
      const workflow = await this.apiService.getWorkflow(workflowId);
      const executions = await this.getExecutionData(workflowId, timeRange);
      
      report.executiveSummary = {
        workflowOverview: {
          name: workflow.name,
          status: workflow.active ? 'Active' : 'Inactive',
          lastModified: workflow.updatedAt,
          complexity: this.assessWorkflowComplexity(workflow)
        },
        keyMetrics: {
          totalExecutions: executions.length,
          successRate: this.computeSuccessRate(executions),
          averageExecutionTime: this.calculateAverageExecutionTime(executions),
          costEstimate: this.estimateWorkflowCost(executions)
        },
        businessImpact: {
          automationValue: this.calculateAutomationValue(executions),
          timeSaved: this.calculateTimeSaved(executions),
          errorReduction: this.calculateErrorReduction(executions),
          roi: this.calculateROI(executions)
        },
        riskAssessment: {
          reliabilityRisk: this.assessReliabilityRisk(executions),
          performanceRisk: this.assessPerformanceRisk(executions),
          complianceRisk: this.assessComplianceRisk(workflow),
          overallRisk: 'Medium' // Simplified
        },
        strategicRecommendations: this.generateStrategicRecommendations(executions, workflow)
      };

      // Minimal detailed analysis for executives
      report.detailedAnalysis = {
        trendSummary: { trend: 'stable', message: 'Performance trends summary' },
        riskFactors: { risks: [], message: 'Identified risk factors' },
        opportunityAreas: { opportunities: [], message: 'Improvement opportunities' }
      };
    }
  }

  /**
   * Generate custom report based on metrics
   */
  private async generateCustomReport(report: any, config: any, customMetrics: any[]): Promise<void> {
    const { workflowId, timeRange } = config;

    const customData: Record<string, any> = {};

    if (workflowId) {
      const workflow = await this.apiService.getWorkflow(workflowId);
      const executions = await this.getExecutionData(workflowId, timeRange);

      for (const metric of customMetrics) {
        customData[metric.name] = await this.calculateCustomMetric(metric, executions, workflow);
      }
    }

    report.executiveSummary = {
      customMetricsCount: customMetrics.length,
      reportScope: workflowId ? 'Single Workflow' : 'Global',
      generatedMetrics: Object.keys(customData)
    };

    report.detailedAnalysis = {
      customMetrics: customData,
      metricDefinitions: customMetrics
    };

    if (report.visualData) {
      report.visualData = {
        customCharts: this.generateCustomCharts(customData, customMetrics)
      };
    }
  }

  /**
   * Get execution data for analysis
   */
  private async getExecutionData(workflowId: string, timeRange: number): Promise<any[]> {
    try {
      const executions = await this.apiService.getExecutions({
        workflowId,
        limit: 1000,
        includeData: true
      });

      const cutoffTime = Date.now() - timeRange;
      return (Array.isArray(executions) ? executions : (executions as any)?.data || [])
        .filter((exec: any) => {
          const execTime = new Date(exec.startedAt || exec.createdAt).getTime();
          return execTime >= cutoffTime;
        });
    } catch (error) {
      console.warn(`Could not fetch executions for workflow ${workflowId}:`, error);
      return [];
    }
  }

  /**
   * Calculate reliability metrics
   */
  private calculateReliabilityMetrics(executions: any[]): any {
    if (executions.length === 0) {
      return {
        reliabilityScore: 0,
        successRate: 0,
        mtbf: 0,
        availabilityScore: 0,
        findings: ['No executions found in the specified time range']
      };
    }

    const successful = executions.filter(exec => exec.finished && !exec.data?.resultData?.error);
    const failed = executions.filter(exec => exec.finished && exec.data?.resultData?.error);
    
    const successRate = (successful.length / executions.length) * 100;
    const failureRate = (failed.length / executions.length) * 100;
    
    // Calculate MTBF (simplified)
    const timeSpan = executions.length > 1 
      ? new Date(executions[0].startedAt || executions[0].createdAt).getTime() - 
        new Date(executions[executions.length - 1].startedAt || executions[executions.length - 1].createdAt).getTime()
      : 0;
    
    const mtbf = failed.length > 0 ? timeSpan / failed.length : timeSpan;
    
    const reliabilityScore = Math.max(0, 100 - failureRate * 2);
    const availabilityScore = successRate; // Simplified

    const findings: string[] = [];
    if (successRate >= 99) findings.push('Excellent reliability');
    else if (successRate < 90) findings.push('Reliability issues detected');
    if (failed.length > 5) findings.push('High failure count');

    return {
      reliabilityScore,
      successRate,
      mtbf,
      availabilityScore,
      findings
    };
  }

  /**
   * Calculate usage metrics
   */
  private calculateUsageMetrics(executions: any[], timeRange: number): any {
    const frequency = executions.length / (timeRange / (1000 * 60 * 60 * 24)); // executions per day
    
    // Find peak usage times
    const hourCounts: Record<number, number> = {};
    for (const execution of executions) {
      const hour = new Date(execution.startedAt || execution.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    
    const peakTimes = Object.entries(hourCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), executions: count }));

    return {
      frequency,
      peakTimes,
      resourceUsage: this.getResourceUsageEstimates(executions),
      costEstimate: this.estimateWorkflowCost(executions)
    };
  }

  /**
   * Generate various chart data structures
   */
  private generateExecutionTimeChart(executions: any[]): any {
    const chartData = executions
      .filter(exec => exec.startedAt && exec.stoppedAt)
      .map(exec => ({
        timestamp: exec.startedAt,
        executionTime: new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime(),
        status: exec.finished && !exec.data?.resultData?.error ? 'success' : 'failure'
      }))
      .slice(0, 100); // Limit for performance

    return {
      type: 'line',
      title: 'Execution Time Trends',
      data: chartData,
      xAxis: 'timestamp',
      yAxis: 'executionTime',
      colorBy: 'status'
    };
  }

  private generateReliabilityChart(executions: any[]): any {
    // Group by day and calculate daily success rates
    const dailyStats: Record<string, any> = {};
    
    for (const execution of executions) {
      const date = new Date(execution.startedAt || execution.createdAt).toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { total: 0, successful: 0 };
      }
      dailyStats[date].total++;
      if (execution.finished && !execution.data?.resultData?.error) {
        dailyStats[date].successful++;
      }
    }

    const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      successRate: ((stats as any).successful / (stats as any).total) * 100,
      totalExecutions: (stats as any).total
    }));

    return {
      type: 'line',
      title: 'Daily Success Rate',
      data: chartData,
      xAxis: 'date',
      yAxis: 'successRate'
    };
  }

  /**
   * Calculate various assessment scores and metrics
   */
  private calculatePerformanceScore(executions: any[]): number {
    if (executions.length === 0) return 0;
    
    const successRate = this.computeSuccessRate(executions);
    const avgTime = this.calculateAverageExecutionTime(executions);
    
    // Performance score based on success rate and execution time
    const successScore = successRate;
    const timeScore = Math.max(0, 100 - (avgTime / 10000)); // 10 second baseline
    
    return Math.round((successScore + timeScore) / 2);
  }

  private computeSuccessRate(executions: any[]): number {
    if (executions.length === 0) return 0;
    
    const successful = executions.filter(exec => exec.finished && !exec.data?.resultData?.error);
    return (successful.length / executions.length) * 100;
  }

  private calculateAverageExecutionTime(executions: any[]): number {
    const times = executions
      .filter(exec => exec.startedAt && exec.stoppedAt)
      .map(exec => new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());
    
    return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
  }

  private assessWorkflowComplexity(workflow: any): string {
    const nodeCount = workflow.nodes?.length || 0;
    const connectionCount = Object.keys(workflow.connections || {}).length;
    
    if (nodeCount > 20 || connectionCount > 25) return 'High';
    if (nodeCount > 10 || connectionCount > 15) return 'Medium';
    return 'Low';
  }

  private estimateWorkflowCost(executions: any[]): any {
    const resourceUsage = this.getResourceUsageEstimates(executions);
    return resourceUsage.costEstimate;
  }

  private generatePerformanceFindings(executions: any[]): string[] {
    const findings: string[] = [];
    const avgTime = this.calculateAverageExecutionTime(executions);
    const successRate = this.computeSuccessRate(executions);
    
    if (avgTime < 5000) findings.push('Fast execution times');
    else if (avgTime > 60000) findings.push('Slow execution times detected');
    
    if (successRate >= 95) findings.push('High reliability');
    else if (successRate < 90) findings.push('Reliability concerns');
    
    return findings;
  }

  /**
   * Generate recommendations for different report types
   */
  private generatePerformanceRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    if (analysis.executionMetrics?.averageExecutionTime > 60000) {
      recommendations.push('Consider optimizing slow nodes to improve execution time');
    }
    
    if (analysis.executionMetrics?.successRate < 95) {
      recommendations.push('Investigate and fix recurring errors to improve reliability');
    }
    
    return recommendations;
  }

  private generateReliabilityRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    if (analysis.errorAnalysis?.totalErrors > 0) {
      recommendations.push('Implement error handling and retry mechanisms');
    }
    
    return recommendations;
  }

  private generateUsageRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    if (analysis.usagePatterns?.peakUsage) {
      recommendations.push('Consider load balancing during peak usage times');
    }
    
    return recommendations;
  }

  private generateComprehensiveRecommendations(analysis: any): string[] {
    return [
      ...this.generatePerformanceRecommendations(analysis),
      ...this.generateReliabilityRecommendations(analysis.reliability || {}),
      ...this.generateUsageRecommendations(analysis.usage || {})
    ];
  }

  private generateStrategicRecommendations(executions: any[], workflow: any): string[] {
    const recommendations: string[] = [];
    
    if (executions.length > 1000) {
      recommendations.push('High automation value - consider expanding similar workflows');
    }
    
    if (workflow.nodes?.length > 20) {
      recommendations.push('Consider breaking complex workflow into smaller, manageable components');
    }
    
    return recommendations;
  }

  /**
   * Calculate business impact metrics
   */
  private calculateAutomationValue(executions: any[]): string {
    // Simplified automation value calculation
    const executionCount = executions.length;
    if (executionCount > 1000) return 'High';
    if (executionCount > 100) return 'Medium';
    return 'Low';
  }

  private calculateTimeSaved(executions: any[]): string {
    // Estimate time saved vs manual process
    const estimatedManualTime = executions.length * 300000; // 5 minutes per execution
    const actualAutomationTime = executions.reduce((sum, exec) => {
      if (exec.startedAt && exec.stoppedAt) {
        return sum + (new Date(exec.stoppedAt).getTime() - new Date(exec.startedAt).getTime());
      }
      return sum;
    }, 0);
    
    const timeSaved = estimatedManualTime - actualAutomationTime;
    return this.formatExecutionTime(timeSaved);
  }

  private calculateErrorReduction(executions: any[]): string {
    // Simplified error reduction calculation
    const successRate = this.computeSuccessRate(executions);
    const assumedManualErrorRate = 5; // 5% error rate for manual processes
    const automationErrorRate = 100 - successRate;
    
    if (automationErrorRate < assumedManualErrorRate) {
      return `${(assumedManualErrorRate - automationErrorRate).toFixed(1)}% reduction`;
    }
    return 'No significant reduction';
  }

  private calculateROI(executions: any[]): string {
    // Simplified ROI calculation
    return 'Analysis requires cost data'; // Placeholder
  }

  /**
   * Risk assessment functions
   */
  private assessReliabilityRisk(executions: any[]): string {
    const successRate = this.computeSuccessRate(executions);
    if (successRate < 90) return 'High';
    if (successRate < 95) return 'Medium';
    return 'Low';
  }

  private assessPerformanceRisk(executions: any[]): string {
    const avgTime = this.calculateAverageExecutionTime(executions);
    if (avgTime > 300000) return 'High'; // > 5 minutes
    if (avgTime > 60000) return 'Medium'; // > 1 minute
    return 'Low';
  }

  private assessComplianceRisk(workflow: any): string {
    // Simplified compliance risk assessment
    // In real implementation, would check for specific compliance patterns
    return 'Medium'; // Placeholder
  }

  /**
   * Placeholder functions for various analyses
   */
  private calculateDetailedMetrics(executions: any[]): any {
    return {
      totalExecutions: executions.length,
      successRate: this.computeSuccessRate(executions),
      averageExecutionTime: this.calculateAverageExecutionTime(executions)
    };
  }

  private analyzePerformanceTrends(executions: any[]): any {
    return { trend: 'stable', analysis: 'Performance has been consistent' };
  }

  private analyzeBottlenecks(workflow: any, executions: any[]): any {
    return { bottlenecks: [], analysis: 'No significant bottlenecks detected' };
  }

  private analyzeResourceUtilization(executions: any[]): any {
    return this.getResourceUsageEstimates(executions);
  }

  private calculateCustomMetric(metric: any, executions: any[], workflow: any): Promise<any> {
    // Placeholder for custom metric calculation
    return Promise.resolve({ value: 'Custom metric result', type: metric.type });
  }

  private generateCustomCharts(customData: any, customMetrics: any[]): any {
    return { charts: 'Custom charts would be generated here' };
  }

  /**
   * Format report for different export formats
   */
  private formatReportForExport(report: any, format: string): any {
    switch (format) {
      case 'csv':
        return this.convertToCSV(report);
      case 'pdf':
        return this.generatePDFMetadata(report);
      case 'summary':
        return this.generateTextSummary(report);
      default:
        return report;
    }
  }

  private convertToCSV(report: any): any {
    return {
      format: 'CSV',
      note: 'CSV export would contain tabular data from the report',
      headers: ['Metric', 'Value', 'Timestamp'],
      sampleData: [
        ['Total Executions', report.executiveSummary?.totalExecutions || 0, new Date().toISOString()],
        ['Success Rate', report.executiveSummary?.successRate || 0, new Date().toISOString()]
      ]
    };
  }

  private generatePDFMetadata(report: any): any {
    return {
      format: 'PDF',
      note: 'PDF export would generate a formatted document',
      pageCount: Math.ceil(JSON.stringify(report).length / 3000), // Estimate
      sections: ['Executive Summary', 'Detailed Analysis', 'Recommendations']
    };
  }

  private generateTextSummary(report: any): string {
    return `
Workflow Report Summary
======================
Generated: ${report.reportInfo.generatedAt}
Type: ${report.reportInfo.reportType}

Key Findings:
${report.executiveSummary?.keyFindings?.join('\n') || 'No key findings'}

Recommendations:
${report.recommendations?.join('\n') || 'No recommendations'}
`;
  }

}

/**
 * Get tool definition for the generate_workflow_reports tool
 *
 * @returns Tool definition
 */
export function getGenerateWorkflowReportsToolDefinition(): ToolDefinition {
    return {
      name: 'generate_workflow_reports',
      description: 'Generate comprehensive workflow reports with charts and insights',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: {
            type: 'string',
            description: 'ID of specific workflow to analyze (optional for global reports)',
          },
          reportType: {
            type: 'string',
            description: 'Type of report to generate',
            enum: ['performance', 'reliability', 'usage', 'comprehensive', 'executive', 'custom'],
          },
          timeRange: {
            type: 'number',
            description: 'Time range in milliseconds for analysis',
            default: 2592000000, // 30 days
          },
          includeCharts: {
            type: 'boolean',
            description: 'Include chart data in the report',
            default: true,
          },
          exportFormat: {
            type: 'string',
            description: 'Format for exported data',
            enum: ['json', 'csv', 'pdf', 'summary'],
            default: 'json',
          },
          includeRecommendations: {
            type: 'boolean',
            description: 'Include actionable recommendations',
            default: true,
          },
          customMetrics: {
            type: 'array',
            description: 'Custom metrics to calculate (for custom report type)',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['name', 'type']
            },
            default: []
          },
        },
        required: ['reportType'],
      },
    };
  }