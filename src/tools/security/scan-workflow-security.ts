/**
 * Scan Workflow Security Tool
 * 
 * This tool performs security vulnerability scanning for exposed credentials and unsafe practices.
 */

import { BaseSecurityToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the scan_workflow_security tool
 */
export class ScanWorkflowSecurityHandler extends BaseSecurityToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing security scan options
   * @returns Security scan results
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, scanType, includeCredentials, generateReport } = args;
      
      this.validateRequiredParams(args, ['workflowId']);
      
      // Get workflow details
      const workflow = await this.apiService.getWorkflow(workflowId);
      if (!workflow) {
        throw new N8nApiError(`Workflow with ID ${workflowId} not found`);
      }

      const securityScan = await this.performSecurityScan({
        workflow,
        scanType: scanType || 'comprehensive',
        includeCredentials: includeCredentials !== false,
        generateReport: generateReport !== false
      });

      return this.formatSuccess(
        securityScan,
        `Security scan completed for workflow: ${workflow.name}`
      );
    }, args);
  }

  /**
   * Perform comprehensive security scan
   */
  private async performSecurityScan(options: any): Promise<any> {
    const { workflow, scanType, includeCredentials, generateReport } = options;

    const scanResult: Record<string, any> = {
      workflowInfo: {
        id: workflow.id,
        name: workflow.name,
        nodeCount: workflow.nodes?.length || 0
      },
      scanInfo: {
        scanType,
        timestamp: new Date().toISOString(),
        includeCredentials
      },
      vulnerabilities: [],
      securityFindings: [],
      riskAssessment: {},
      recommendations: []
    };

    // Scan workflow nodes for security issues
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        const nodeFindings = this.scanNode(node);
        scanResult.securityFindings.push(...nodeFindings);
      }
    }

    // Scan workflow configuration
    const configFindings = this.scanWorkflowConfiguration(workflow);
    scanResult.securityFindings.push(...configFindings);

    // Scan for sensitive data
    const sensitiveDataFindings = this.scanForSensitiveDataInWorkflow(workflow);
    scanResult.securityFindings.push(...sensitiveDataFindings);

    // Check credentials if requested
    if (includeCredentials) {
      const credentialFindings = await this.scanCredentials(workflow);
      scanResult.securityFindings.push(...credentialFindings);
    }

    // Assess overall risk
    scanResult.riskAssessment = this.assessSecurityRisk(scanResult.securityFindings);

    // Generate vulnerabilities list
    scanResult.vulnerabilities = this.categorizeVulnerabilities(scanResult.securityFindings);

    // Generate recommendations
    scanResult.recommendations = this.generateSecurityRecommendations(scanResult);

    // Generate detailed report if requested
    if (generateReport) {
      scanResult.detailedReport = this.generateSecurityReport(scanResult);
    }

    return scanResult;
  }

  /**
   * Scan individual node for security issues
   */
  private scanNode(node: any): any[] {
    const findings: any[] = [];

    // Use base class method for node security check
    const nodeIssues = this.checkNodeSecurity(node);
    findings.push(...nodeIssues.map(issue => ({
      ...issue,
      nodeName: node.name,
      nodeType: node.type,
      category: 'node_configuration'
    })));

    // Check node parameters for sensitive data
    if (node.parameters) {
      const parameterText = JSON.stringify(node.parameters);
      const sensitiveFindings = this.scanForSensitiveData(parameterText);
      
      findings.push(...sensitiveFindings.map(finding => ({
        ...finding,
        nodeName: node.name,
        nodeType: node.type,
        category: 'sensitive_data',
        location: 'node_parameters'
      })));
    }

    // Check for hardcoded values
    const hardcodedFindings = this.checkForHardcodedValues(node);
    findings.push(...hardcodedFindings);

    return findings;
  }

  /**
   * Scan workflow configuration for security issues
   */
  private scanWorkflowConfiguration(workflow: any): any[] {
    const findings: any[] = [];

    // Check workflow settings
    if (workflow.settings) {
      // Check for insecure execution settings
      if (workflow.settings.saveDataErrorExecution === 'all') {
        findings.push({
          type: 'Data Retention Risk',
          severity: 'medium',
          message: 'Error execution data is saved permanently',
          category: 'configuration',
          recommendation: 'Consider limiting error data retention'
        });
      }

      if (workflow.settings.saveDataSuccessExecution === 'all') {
        findings.push({
          type: 'Data Retention Risk',
          severity: 'low',
          message: 'Success execution data is saved permanently',
          category: 'configuration',
          recommendation: 'Review data retention policies'
        });
      }
    }

    // Check for webhook security
    const webhookNodes = workflow.nodes?.filter((node: any) => 
      node.type === 'n8n-nodes-base.webhook'
    ) || [];

    if (webhookNodes.length > 0) {
      findings.push({
        type: 'Webhook Exposure',
        severity: 'medium',
        message: `Workflow contains ${webhookNodes.length} webhook(s)`,
        category: 'exposure',
        recommendation: 'Ensure webhooks have proper authentication'
      });
    }

    return findings;
  }

  /**
   * Scan for sensitive data in workflow
   */
  private scanForSensitiveDataInWorkflow(workflow: any): any[] {
    const findings: any[] = [];
    
    // Scan workflow name and description
    const workflowText = `${workflow.name} ${workflow.notes || ''}`;
    const workflowFindings = this.scanForSensitiveData(workflowText);
    
    findings.push(...workflowFindings.map(finding => ({
      ...finding,
      category: 'workflow_metadata',
      location: 'workflow_name_or_description'
    })));

    return findings;
  }

  /**
   * Scan credentials for security issues
   */
  private async scanCredentials(workflow: any): Promise<any[]> {
    const findings: any[] = [];

    try {
      // Get all credentials used in workflow
      const credentialIds = this.extractCredentialIds(workflow);
      
      for (const credId of credentialIds) {
        try {
          const credential = await this.apiService.getCredential(credId);
          
          if (credential) {
            // Check credential configuration (without accessing sensitive data)
            const credentialFindings = this.analyzeCredentialSecurity(credential);
            findings.push(...credentialFindings);
          }
        } catch (error) {
          findings.push({
            type: 'Credential Access Error',
            severity: 'medium',
            message: `Could not access credential ${credId}`,
            category: 'credential',
            recommendation: 'Verify credential permissions and existence'
          });
        }
      }
    } catch (error) {
      findings.push({
        type: 'Credential Scan Error',
        severity: 'low',
        message: 'Could not perform credential security scan',
        category: 'scan_error'
      });
    }

    return findings;
  }

  /**
   * Extract credential IDs from workflow
   */
  private extractCredentialIds(workflow: any): string[] {
    const credentialIds: string[] = [];
    
    if (workflow.nodes) {
      for (const node of workflow.nodes) {
        if (node.credentials) {
          for (const [credType, credConfig] of Object.entries(node.credentials)) {
            if ((credConfig as any)?.id) {
              credentialIds.push((credConfig as any).id);
            }
          }
        }
      }
    }

    return [...new Set(credentialIds)]; // Remove duplicates
  }

  /**
   * Analyze credential security
   */
  private analyzeCredentialSecurity(credential: any): any[] {
    const findings: any[] = [];

    // Check credential type for security implications
    const credentialType = credential.type;
    
    if (credentialType?.includes('basic') || credentialType?.includes('password')) {
      findings.push({
        type: 'Basic Authentication',
        severity: 'medium',
        message: 'Basic authentication credentials detected',
        category: 'credential',
        recommendation: 'Consider using stronger authentication methods'
      });
    }

    // Check credential age and usage
    if (credential.createdAt) {
      const age = Date.now() - new Date(credential.createdAt).getTime();
      const ageInDays = age / (1000 * 60 * 60 * 24);
      
      if (ageInDays > 365) {
        findings.push({
          type: 'Old Credential',
          severity: 'low',
          message: `Credential is ${Math.floor(ageInDays)} days old`,
          category: 'credential',
          recommendation: 'Consider rotating old credentials'
        });
      }
    }

    return findings;
  }

  /**
   * Check for hardcoded values in nodes
   */
  private checkForHardcodedValues(node: any): any[] {
    const findings: any[] = [];

    if (node.parameters) {
      // Check for common hardcoded patterns
      const suspiciousPatterns = [
        { key: 'localhost', severity: 'low', message: 'Hardcoded localhost reference' },
        { key: '127.0.0.1', severity: 'low', message: 'Hardcoded IP address' },
        { key: 'admin', severity: 'medium', message: 'Hardcoded admin reference' },
        { key: 'test', severity: 'low', message: 'Hardcoded test reference' }
      ];

      const paramStr = JSON.stringify(node.parameters).toLowerCase();
      
      for (const pattern of suspiciousPatterns) {
        if (paramStr.includes(pattern.key)) {
          findings.push({
            type: 'Hardcoded Value',
            severity: pattern.severity,
            message: pattern.message,
            nodeName: node.name,
            nodeType: node.type,
            category: 'hardcoded_value',
            recommendation: 'Use environment variables or configuration instead'
          });
        }
      }
    }

    return findings;
  }

  /**
   * Categorize vulnerabilities by type and severity
   */
  private categorizeVulnerabilities(findings: any[]): any[] {
    const vulnerabilities: Record<string, any> = {};

    for (const finding of findings) {
      const key = `${finding.type}_${finding.severity}`;
      
      if (!vulnerabilities[key]) {
        vulnerabilities[key] = {
          type: finding.type,
          severity: finding.severity,
          count: 0,
          locations: [],
          recommendation: finding.recommendation
        };
      }
      
      vulnerabilities[key].count++;
      vulnerabilities[key].locations.push({
        nodeName: finding.nodeName || 'workflow',
        nodeType: finding.nodeType || 'configuration',
        category: finding.category
      });
    }

    return Object.values(vulnerabilities).sort((a: any, b: any) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
             (severityOrder[a.severity as keyof typeof severityOrder] || 0);
    });
  }

  /**
   * Generate security recommendations
   */
  private generateSecurityRecommendations(scanResult: any): string[] {
    const recommendations: string[] = [];
    const { riskAssessment, securityFindings } = scanResult;

    // Risk-based recommendations
    if (riskAssessment.riskLevel === 'critical') {
      recommendations.push('URGENT: Address critical security vulnerabilities immediately');
    }

    if (riskAssessment.findings.critical > 0) {
      recommendations.push('Remove or secure critical sensitive data exposures');
    }

    if (riskAssessment.findings.high > 0) {
      recommendations.push('Review and fix high-severity security issues');
    }

    // Specific recommendations based on findings
    const hasCredentialIssues = securityFindings.some((f: any) => f.category === 'credential');
    if (hasCredentialIssues) {
      recommendations.push('Review credential configuration and access controls');
    }

    const hasWebhooks = securityFindings.some((f: any) => f.type === 'Webhook Exposure');
    if (hasWebhooks) {
      recommendations.push('Implement authentication for webhook endpoints');
    }

    const hasSensitiveData = securityFindings.some((f: any) => f.category === 'sensitive_data');
    if (hasSensitiveData) {
      recommendations.push('Move sensitive data to encrypted credential storage');
    }

    // General recommendations
    recommendations.push('Regularly scan workflows for security vulnerabilities');
    recommendations.push('Follow security best practices for workflow development');
    recommendations.push('Implement proper access controls and monitoring');

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Generate detailed security report
   */
  private generateSecurityReport(scanResult: any): any {
    return {
      executiveSummary: {
        totalFindings: scanResult.securityFindings.length,
        riskLevel: scanResult.riskAssessment.riskLevel,
        criticalIssues: scanResult.riskAssessment.findings.critical,
        recommendationCount: scanResult.recommendations.length
      },
      findingsByCategory: this.groupFindingsByCategory(scanResult.securityFindings),
      findingsBySeverity: this.groupFindingsBySeverity(scanResult.securityFindings),
      nodeSecuritySummary: this.generateNodeSecuritySummary(scanResult.securityFindings),
      complianceImplications: this.assessComplianceImplications(scanResult.securityFindings),
      remedationPlan: this.generateRemediationPlan(scanResult.vulnerabilities)
    };
  }

  /**
   * Group findings by category
   */
  private groupFindingsByCategory(findings: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    for (const finding of findings) {
      const category = finding.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(finding);
    }

    return groups;
  }

  /**
   * Group findings by severity
   */
  private groupFindingsBySeverity(findings: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    for (const finding of findings) {
      const severity = finding.severity || 'unknown';
      if (!groups[severity]) {
        groups[severity] = [];
      }
      groups[severity].push(finding);
    }

    return groups;
  }

  /**
   * Generate node security summary
   */
  private generateNodeSecuritySummary(findings: any[]): any {
    const nodeFindings = findings.filter(f => f.nodeName);
    const nodeGroups: Record<string, any> = {};

    for (const finding of nodeFindings) {
      const nodeKey = `${finding.nodeName} (${finding.nodeType})`;
      if (!nodeGroups[nodeKey]) {
        nodeGroups[nodeKey] = {
          nodeName: finding.nodeName,
          nodeType: finding.nodeType,
          findings: [],
          riskLevel: 'low'
        };
      }
      nodeGroups[nodeKey].findings.push(finding);
    }

    // Assess risk level for each node
    for (const nodeGroup of Object.values(nodeGroups)) {
      const node = nodeGroup as any;
      const criticalCount = node.findings.filter((f: any) => f.severity === 'critical').length;
      const highCount = node.findings.filter((f: any) => f.severity === 'high').length;
      
      if (criticalCount > 0) node.riskLevel = 'critical';
      else if (highCount > 0) node.riskLevel = 'high';
      else if (node.findings.length > 2) node.riskLevel = 'medium';
    }

    return Object.values(nodeGroups);
  }

  /**
   * Assess compliance implications
   */
  private assessComplianceImplications(findings: any[]): any {
    const implications = {
      gdpr: { affected: false, issues: [] as string[] },
      sox: { affected: false, issues: [] as string[] },
      hipaa: { affected: false, issues: [] as string[] },
      pci: { affected: false, issues: [] as string[] }
    };

    const sensitiveDataTypes = findings.filter(f => f.category === 'sensitive_data');
    
    for (const finding of sensitiveDataTypes) {
      if (finding.type === 'Email Address' || finding.type === 'Social Security Number') {
        implications.gdpr.affected = true;
        implications.gdpr.issues.push(`Personal data exposure: ${finding.type}`);
      }
      
      if (finding.type === 'Credit Card Number') {
        implications.pci.affected = true;
        implications.pci.issues.push(`Card data exposure: ${finding.type}`);
      }
    }

    return implications;
  }

  /**
   * Generate remediation plan
   */
  private generateRemediationPlan(vulnerabilities: any[]): any[] {
    return vulnerabilities.map((vuln: any) => ({
      vulnerability: vuln.type,
      severity: vuln.severity,
      priority: vuln.severity === 'critical' ? 1 : vuln.severity === 'high' ? 2 : 3,
      effort: this.estimateEffort(vuln.type),
      recommendation: vuln.recommendation,
      affectedLocations: vuln.count
    })).sort((a: any, b: any) => a.priority - b.priority);
  }

  /**
   * Estimate effort for remediation
   */
  private estimateEffort(vulnerabilityType: string): string {
    const effortMap: Record<string, string> = {
      'Credit Card Number': 'High',
      'Social Security Number': 'High',
      'API Key Pattern': 'Medium',
      'Password Pattern': 'Medium',
      'Hardcoded Value': 'Low',
      'Insecure HTTP': 'Low'
    };

    return effortMap[vulnerabilityType] || 'Medium';
  }
}

/**
 * Get tool definition for the scan_workflow_security tool
 * 
 * @returns Tool definition
 */
export function getScanWorkflowSecurityToolDefinition(): ToolDefinition {
  return {
    name: 'scan_workflow_security',
    description: 'Security vulnerability scanning for exposed credentials and unsafe practices',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to scan for security vulnerabilities',
        },
        scanType: {
          type: 'string',
          description: 'Type of security scan to perform',
          enum: ['quick', 'standard', 'comprehensive', 'compliance'],
          default: 'comprehensive',
        },
        includeCredentials: {
          type: 'boolean',
          description: 'Include credential security analysis',
          default: true,
        },
        generateReport: {
          type: 'boolean',
          description: 'Generate detailed security report',
          default: true,
        },
      },
      required: ['workflowId'],
    },
  };
}