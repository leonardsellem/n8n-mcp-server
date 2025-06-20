import { BaseSecurityToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';

interface ComplianceCheckOptions {
  workflowId?: string;
  framework: 'gdpr' | 'sox' | 'hipaa' | 'pci' | 'iso27001' | 'nist' | 'all';
  includeRecommendations?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceViolation {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  framework: string;
  description: string;
  location: {
    workflowId: string;
    workflowName: string;
    nodeId?: string;
    nodeName?: string;
  };
  requirement: string;
  impact: string;
  remediation: string;
  riskScore: number;
}

interface ComplianceReport {
  summary: {
    framework: string;
    overallScore: number;
    status: 'compliant' | 'partially_compliant' | 'non_compliant';
    totalViolations: number;
    criticalViolations: number;
    highViolations: number;
    mediumViolations: number;
    lowViolations: number;
  };
  violations: ComplianceViolation[];
  frameworkDetails: {
    [framework: string]: {
      score: number;
      status: string;
      applicableControls: number;
      passedControls: number;
      failedControls: number;
    };
  };
  recommendations: {
    priority: 'immediate' | 'high' | 'medium' | 'low';
    category: string;
    description: string;
    effort: 'low' | 'medium' | 'high';
    impact: string;
  }[];
  nextSteps: string[];
}

export class CheckComplianceHandler extends BaseSecurityToolHandler {
  constructor() {
    super();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['framework']);
      const options = args as ComplianceCheckOptions;
      const report = await this.checkCompliance(options);
      return this.formatSuccess(report, 'Compliance check completed successfully');
    }, args);
  }

  async checkCompliance(options: ComplianceCheckOptions): Promise<ComplianceReport> {
    try {
      const workflows = options.workflowId 
        ? [await this.apiService.getWorkflow(options.workflowId)]
        : await this.apiService.getWorkflows();

      const violations: ComplianceViolation[] = [];
      const frameworkDetails: ComplianceReport['frameworkDetails'] = {};

      const frameworks = options.framework === 'all' 
        ? ['gdpr', 'sox', 'hipaa', 'pci', 'iso27001', 'nist']
        : [options.framework];

      for (const framework of frameworks) {
        const frameworkViolations = await this.checkFrameworkCompliance(workflows, framework);
        violations.push(...frameworkViolations);

        frameworkDetails[framework] = this.calculateFrameworkScore(frameworkViolations, framework);
      }

      // Filter by severity if specified
      const filteredViolations = options.severity 
        ? violations.filter(v => v.severity === options.severity)
        : violations;

      const summary = this.generateComplianceSummary(filteredViolations, options.framework);
      const recommendations = options.includeRecommendations !== false 
        ? this.generateComplianceRecommendations(filteredViolations)
        : [];
      const nextSteps = this.generateNextSteps(filteredViolations);

      return {
        summary,
        violations: filteredViolations,
        frameworkDetails,
        recommendations,
        nextSteps
      };
    } catch (error) {
      throw new Error(`Failed to check compliance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkFrameworkCompliance(workflows: any[], framework: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];

    for (const workflow of workflows) {
      const workflowViolations = await this.checkWorkflowCompliance(workflow, framework);
      violations.push(...workflowViolations);
    }

    return violations;
  }

  private async checkWorkflowCompliance(workflow: any, framework: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    
    // Scan workflow content for sensitive data
    const workflowContent = JSON.stringify(workflow);
    const sensitiveFindings = this.scanForSensitiveData(workflowContent);

    // Check nodes for compliance issues
    const nodes = workflow.nodes || [];
    for (const node of nodes) {
      const nodeViolations = this.checkNodeCompliance(node, framework, workflow);
      violations.push(...nodeViolations);
    }

    // Framework-specific checks
    switch (framework) {
      case 'gdpr':
        violations.push(...this.checkGDPRSpecificCompliance(workflow, sensitiveFindings));
        break;
      case 'sox':
        violations.push(...this.checkSOXSpecificCompliance(workflow, sensitiveFindings));
        break;
      case 'hipaa':
        violations.push(...this.checkHIPAASpecificCompliance(workflow, sensitiveFindings));
        break;
      case 'pci':
        violations.push(...this.checkPCISpecificCompliance(workflow, sensitiveFindings));
        break;
      case 'iso27001':
        violations.push(...this.checkISO27001SpecificCompliance(workflow, sensitiveFindings));
        break;
      case 'nist':
        violations.push(...this.checkNISTSpecificCompliance(workflow, sensitiveFindings));
        break;
    }

    return violations;
  }

  private checkNodeCompliance(node: any, framework: string, workflow: any): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const nodeId = node.id || 'unknown';
    const nodeName = node.name || node.type || 'unnamed';

    // Check for insecure configurations
    const securityIssues = this.checkNodeSecurity(node);
    
    for (const issue of securityIssues) {
      violations.push({
        id: `${workflow.id}-${nodeId}-${issue.type.replace(/\s+/g, '-').toLowerCase()}`,
        type: issue.type,
        severity: issue.severity as any,
        framework,
        description: issue.message,
        location: {
          workflowId: workflow.id,
          workflowName: workflow.name,
          nodeId,
          nodeName
        },
        requirement: this.getFrameworkRequirement(framework, issue.type),
        impact: this.getComplianceImpact(issue.type, framework),
        remediation: issue.recommendation,
        riskScore: this.calculateRiskScore(issue.severity as any, framework)
      });
    }

    return violations;
  }

  private checkGDPRSpecificCompliance(workflow: any, sensitiveFindings: any[]): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    // Check for personal data processing without consent mechanisms
    const personalDataTypes = ['Email Address', 'Phone Number', 'Social Security Number'];
    const hasPersonalData = sensitiveFindings.some(f => personalDataTypes.includes(f.type));

    if (hasPersonalData) {
      // Check for consent collection mechanisms
      const hasConsentNode = workflow.nodes?.some((node: any) => 
        node.type?.includes('webhook') || 
        node.type?.includes('form') ||
        node.parameters?.url?.includes('consent')
      );

      if (!hasConsentNode) {
        violations.push({
          id: `${workflow.id}-gdpr-consent`,
          type: 'Missing Consent Mechanism',
          severity: 'high',
          framework: 'gdpr',
          description: 'Workflow processes personal data without explicit consent collection',
          location: {
            workflowId: workflow.id,
            workflowName: workflow.name
          },
          requirement: 'Article 6 - Lawfulness of processing',
          impact: 'Non-compliance with GDPR consent requirements',
          remediation: 'Implement consent collection and management mechanisms',
          riskScore: 75
        });
      }

      // Check for data retention policies
      const hasDataRetention = workflow.nodes?.some((node: any) => 
        node.type?.includes('schedule') || 
        node.parameters?.rule?.includes('delete') ||
        node.parameters?.retention
      );

      if (!hasDataRetention) {
        violations.push({
          id: `${workflow.id}-gdpr-retention`,
          type: 'Missing Data Retention Policy',
          severity: 'medium',
          framework: 'gdpr',
          description: 'No data retention or deletion mechanisms found',
          location: {
            workflowId: workflow.id,
            workflowName: workflow.name
          },
          requirement: 'Article 5 - Principles relating to processing',
          impact: 'Potential indefinite storage of personal data',
          remediation: 'Implement automated data retention and deletion processes',
          riskScore: 60
        });
      }
    }

    return violations;
  }

  private checkSOXSpecificCompliance(workflow: any, sensitiveFindings: any[]): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    // Check for financial data handling
    const financialDataTypes = ['Credit Card Number', 'Bank Account', 'Financial'];
    const hasFinancialData = sensitiveFindings.some(f => financialDataTypes.includes(f.type));

    if (hasFinancialData) {
      // Check for audit trail mechanisms
      const hasAuditTrail = workflow.nodes?.some((node: any) => 
        node.type?.includes('log') || 
        node.type?.includes('audit') ||
        node.parameters?.log
      );

      if (!hasAuditTrail) {
        violations.push({
          id: `${workflow.id}-sox-audit-trail`,
          type: 'Missing Audit Trail',
          severity: 'critical',
          framework: 'sox',
          description: 'Financial data processing without proper audit trail',
          location: {
            workflowId: workflow.id,
            workflowName: workflow.name
          },
          requirement: 'Section 404 - Management Assessment of Internal Controls',
          impact: 'Inability to track financial data changes and access',
          remediation: 'Implement comprehensive audit logging for all financial operations',
          riskScore: 90
        });
      }
    }

    return violations;
  }

  private checkHIPAASpecificCompliance(workflow: any, sensitiveFindings: any[]): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    // Check for health information
    const healthDataTypes = ['Medical Record', 'Health ID', 'Social Security Number'];
    const hasHealthData = sensitiveFindings.some(f => healthDataTypes.includes(f.type));

    if (hasHealthData) {
      // Check for encryption
      const hasEncryption = workflow.nodes?.some((node: any) => 
        node.parameters?.encryption || 
        node.type?.includes('encrypt') ||
        node.parameters?.ssl === true
      );

      if (!hasEncryption) {
        violations.push({
          id: `${workflow.id}-hipaa-encryption`,
          type: 'Missing PHI Encryption',
          severity: 'critical',
          framework: 'hipaa',
          description: 'Protected Health Information processed without encryption',
          location: {
            workflowId: workflow.id,
            workflowName: workflow.name
          },
          requirement: 'Security Rule - Technical Safeguards',
          impact: 'Risk of PHI exposure during transmission and storage',
          remediation: 'Implement end-to-end encryption for all PHI processing',
          riskScore: 95
        });
      }
    }

    return violations;
  }

  private checkPCISpecificCompliance(workflow: any, sensitiveFindings: any[]): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    // Check for payment card data
    const cardDataTypes = ['Credit Card Number', 'CVV', 'Card Expiry'];
    const hasCardData = sensitiveFindings.some(f => cardDataTypes.includes(f.type));

    if (hasCardData) {
      violations.push({
        id: `${workflow.id}-pci-card-data`,
        type: 'Payment Card Data Exposure',
        severity: 'critical',
        framework: 'pci',
        description: 'Payment card data found in workflow configuration',
        location: {
          workflowId: workflow.id,
          workflowName: workflow.name
        },
        requirement: 'Requirement 3 - Protect stored cardholder data',
        impact: 'Direct violation of PCI DSS requirements',
        remediation: 'Remove card data from workflows and use tokenization',
        riskScore: 100
      });
    }

    return violations;
  }

  private checkISO27001SpecificCompliance(workflow: any, sensitiveFindings: any[]): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    // Check for access controls
    const hasAuthentication = workflow.nodes?.some((node: any) => 
      node.parameters?.authentication || 
      node.type?.includes('auth') ||
      node.credentials
    );

    if (!hasAuthentication && workflow.nodes?.length > 0) {
      violations.push({
        id: `${workflow.id}-iso27001-access`,
        type: 'Insufficient Access Controls',
        severity: 'high',
        framework: 'iso27001',
        description: 'Workflow lacks proper authentication and access controls',
        location: {
          workflowId: workflow.id,
          workflowName: workflow.name
        },
        requirement: 'A.9 - Access control',
        impact: 'Unauthorized access to workflow functionality',
        remediation: 'Implement proper authentication and authorization mechanisms',
        riskScore: 70
      });
    }

    return violations;
  }

  private checkNISTSpecificCompliance(workflow: any, sensitiveFindings: any[]): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    // Check for monitoring and logging
    const hasMonitoring = workflow.nodes?.some((node: any) => 
      node.type?.includes('monitor') || 
      node.type?.includes('log') ||
      node.parameters?.monitoring
    );

    if (!hasMonitoring && sensitiveFindings.length > 0) {
      violations.push({
        id: `${workflow.id}-nist-monitoring`,
        type: 'Insufficient Monitoring',
        severity: 'medium',
        framework: 'nist',
        description: 'Workflow processes sensitive data without adequate monitoring',
        location: {
          workflowId: workflow.id,
          workflowName: workflow.name
        },
        requirement: 'DE.CM - Security Continuous Monitoring',
        impact: 'Limited ability to detect security incidents',
        remediation: 'Implement continuous monitoring and logging capabilities',
        riskScore: 50
      });
    }

    return violations;
  }

  private getFrameworkRequirement(framework: string, violationType: string): string {
    const requirements: Record<string, Record<string, string>> = {
      gdpr: {
        'Missing Consent Mechanism': 'Article 6 - Lawfulness of processing',
        'Personal Data Exposure': 'Article 5 - Principles relating to processing',
        'default': 'General GDPR principles'
      },
      sox: {
        'Missing Audit Trail': 'Section 404 - Management Assessment of Internal Controls',
        'Financial Data Security': 'Section 302 - Corporate Responsibility',
        'default': 'SOX compliance requirements'
      },
      hipaa: {
        'Missing PHI Encryption': 'Security Rule - Technical Safeguards',
        'PHI Access Controls': 'Security Rule - Administrative Safeguards',
        'default': 'HIPAA Security Rule'
      },
      pci: {
        'Payment Card Data Exposure': 'Requirement 3 - Protect stored cardholder data',
        'Insecure Transmission': 'Requirement 4 - Encrypt transmission of cardholder data',
        'default': 'PCI DSS Requirements'
      }
    };

    return requirements[framework]?.[violationType] || requirements[framework]?.['default'] || 'Framework compliance requirement';
  }

  private getComplianceImpact(violationType: string, framework: string): string {
    const impacts: Record<string, string> = {
      'Missing Consent Mechanism': 'Potential regulatory fines and legal action',
      'Personal Data Exposure': 'Risk of data breach and privacy violations',
      'Missing Audit Trail': 'Inability to demonstrate compliance and detect fraud',
      'Missing PHI Encryption': 'Risk of protected health information exposure',
      'Payment Card Data Exposure': 'Direct PCI DSS violation with potential fines',
      'Insufficient Access Controls': 'Unauthorized access to sensitive systems'
    };

    return impacts[violationType] || 'Potential compliance violation and associated risks';
  }

  private calculateRiskScore(severity: 'low' | 'medium' | 'high' | 'critical', framework: string): number {
    const baseScores = {
      low: 25,
      medium: 50,
      high: 75,
      critical: 100
    };

    const frameworkMultipliers: Record<string, number> = {
      pci: 1.2,
      hipaa: 1.15,
      sox: 1.1,
      gdpr: 1.05,
      iso27001: 1.0,
      nist: 1.0
    };

    return Math.min(100, baseScores[severity] * (frameworkMultipliers[framework] || 1.0));
  }

  private calculateFrameworkScore(violations: ComplianceViolation[], framework: string): any {
    const totalControls = this.getFrameworkControlCount(framework);
    const failedControls = violations.length;
    const passedControls = Math.max(0, totalControls - failedControls);
    
    const score = Math.max(0, Math.round((passedControls / totalControls) * 100));
    
    let status = 'compliant';
    if (score < 60) status = 'non_compliant';
    else if (score < 80) status = 'partially_compliant';

    return {
      score,
      status,
      applicableControls: totalControls,
      passedControls,
      failedControls
    };
  }

  private getFrameworkControlCount(framework: string): number {
    const controlCounts: Record<string, number> = {
      gdpr: 15,
      sox: 10,
      hipaa: 20,
      pci: 12,
      iso27001: 35,
      nist: 25
    };

    return controlCounts[framework] || 20;
  }

  private generateComplianceSummary(violations: ComplianceViolation[], framework: string): ComplianceReport['summary'] {
    const totalViolations = violations.length;
    const criticalViolations = violations.filter(v => v.severity === 'critical').length;
    const highViolations = violations.filter(v => v.severity === 'high').length;
    const mediumViolations = violations.filter(v => v.severity === 'medium').length;
    const lowViolations = violations.filter(v => v.severity === 'low').length;

    const overallScore = totalViolations === 0 ? 100 : Math.max(0, 100 - (criticalViolations * 25 + highViolations * 15 + mediumViolations * 10 + lowViolations * 5));
    
    let status: 'compliant' | 'partially_compliant' | 'non_compliant' = 'compliant';
    if (overallScore < 60) status = 'non_compliant';
    else if (overallScore < 80) status = 'partially_compliant';

    return {
      framework,
      overallScore,
      status,
      totalViolations,
      criticalViolations,
      highViolations,
      mediumViolations,
      lowViolations
    };
  }

  private generateComplianceRecommendations(violations: ComplianceViolation[]): ComplianceReport['recommendations'] {
    const recommendations: ComplianceReport['recommendations'] = [];

    // Critical violations get immediate priority
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      recommendations.push({
        priority: 'immediate',
        category: 'Critical Security',
        description: `Address ${criticalViolations.length} critical compliance violations immediately`,
        effort: 'high',
        impact: 'Prevents regulatory violations and potential fines'
      });
    }

    // High severity violations
    const highViolations = violations.filter(v => v.severity === 'high');
    if (highViolations.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'Security Controls',
        description: `Implement security controls for ${highViolations.length} high-severity issues`,
        effort: 'medium',
        impact: 'Significantly improves compliance posture'
      });
    }

    // General recommendations
    recommendations.push({
      priority: 'medium',
      category: 'Process Improvement',
      description: 'Establish regular compliance monitoring and assessment procedures',
      effort: 'medium',
      impact: 'Ensures ongoing compliance and early issue detection'
    });

    recommendations.push({
      priority: 'low',
      category: 'Training',
      description: 'Provide compliance training for workflow developers',
      effort: 'low',
      impact: 'Prevents future compliance issues'
    });

    return recommendations;
  }

  private generateNextSteps(violations: ComplianceViolation[]): string[] {
    const steps: string[] = [];

    if (violations.length === 0) {
      steps.push('Continue monitoring for compliance drift');
      steps.push('Regular compliance assessments recommended');
      return steps;
    }

    steps.push('Review and prioritize compliance violations by severity');
    
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    if (criticalViolations.length > 0) {
      steps.push(`Immediately address ${criticalViolations.length} critical violations`);
    }

    steps.push('Implement recommended remediation actions');
    steps.push('Establish ongoing compliance monitoring');
    steps.push('Document compliance procedures and controls');
    steps.push('Schedule regular compliance reviews');

    return steps;
  }
}