/**
 * Base Security Tool Handler
 *
 * This module provides a base handler for workflow security and compliance tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { EnhancedN8nApiClient } from '../../api/enhanced-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Base class for workflow security tool handlers
 */
export abstract class BaseSecurityToolHandler {
  protected apiService: EnhancedN8nApiClient;
  
  constructor() {
    this.apiService = new EnhancedN8nApiClient(getEnvConfig());
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
  
  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return {
      content: [
        {
          type: 'text',
          text: errorMessage,
        },
      ],
      isError: true,
    };
  }
  
  /**
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    handler: (args: Record<string, any>) => Promise<ToolCallResult>,
    args: Record<string, any>
  ): Promise<ToolCallResult> {
    try {
      return await handler(args);
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.message);
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing security tool: ${errorMessage}`);
    }
  }
  
  /**
   * Validate required parameters
   *
   * @param args Arguments to validate
   * @param required Array of required parameter names
   * @throws Error if required parameters are missing
   */
  protected validateRequiredParams(args: Record<string, any>, required: string[]): void {
    const missing = required.filter(param => args[param] === undefined || args[param] === null);
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Scan for sensitive data patterns in text
   * 
   * @param text Text to scan
   * @returns Array of potential sensitive data findings
   */
  protected scanForSensitiveData(text: string): any[] {
    const findings: any[] = [];
    
    // Common sensitive data patterns
    const patterns = [
      {
        name: 'Email Address',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        severity: 'low'
      },
      {
        name: 'Credit Card Number',
        pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
        severity: 'critical'
      },
      {
        name: 'Social Security Number',
        pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g,
        severity: 'critical'
      },
      {
        name: 'API Key Pattern',
        pattern: /(?:api[_-]?key|access[_-]?token|secret[_-]?key)[\s=:]+['"]?[a-zA-Z0-9_-]{16,}['"]?/gi,
        severity: 'high'
      },
      {
        name: 'Password Pattern',
        pattern: /(?:password|passwd|pwd)[\s=:]+['"]?[^\s'",;]+['"]?/gi,
        severity: 'high'
      },
      {
        name: 'Database Connection String',
        pattern: /(?:mongodb|mysql|postgres|sqlite):\/\/[^\s]+/gi,
        severity: 'high'
      },
      {
        name: 'AWS Access Key',
        pattern: /AKIA[0-9A-Z]{16}/g,
        severity: 'critical'
      },
      {
        name: 'Private Key',
        pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/g,
        severity: 'critical'
      }
    ];

    for (const { name, pattern, severity } of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          findings.push({
            type: name,
            severity,
            value: this.maskSensitiveValue(match),
            location: text.indexOf(match),
            recommendation: this.getSecurityRecommendation(name)
          });
        }
      }
    }

    return findings;
  }

  /**
   * Mask sensitive values for safe display
   * 
   * @param value Sensitive value to mask
   * @returns Masked value
   */
  private maskSensitiveValue(value: string): string {
    if (value.length <= 8) {
      return '*'.repeat(value.length);
    }
    
    const start = value.substring(0, 3);
    const end = value.substring(value.length - 3);
    const middle = '*'.repeat(value.length - 6);
    
    return `${start}${middle}${end}`;
  }

  /**
   * Get security recommendation for a finding type
   * 
   * @param findingType Type of security finding
   * @returns Recommendation string
   */
  private getSecurityRecommendation(findingType: string): string {
    const recommendations: Record<string, string> = {
      'Email Address': 'Consider using environment variables or encrypted storage for email addresses',
      'Credit Card Number': 'CRITICAL: Remove credit card numbers from workflow configurations',
      'Social Security Number': 'CRITICAL: Remove SSNs from workflow configurations',
      'API Key Pattern': 'Store API keys in encrypted credential store, not in workflow parameters',
      'Password Pattern': 'Use n8n credential system instead of hardcoded passwords',
      'Database Connection String': 'Use environment variables or credential store for database connections',
      'AWS Access Key': 'CRITICAL: Use IAM roles or credential store for AWS access',
      'Private Key': 'CRITICAL: Store private keys in secure credential storage'
    };

    return recommendations[findingType] || 'Review and secure this sensitive data';
  }

  /**
   * Assess workflow security risk level
   * 
   * @param findings Array of security findings
   * @returns Risk assessment
   */
  protected assessSecurityRisk(findings: any[]): any {
    let riskScore = 0;
    const riskFactors: string[] = [];

    const criticalFindings = findings.filter(f => f.severity === 'critical');
    const highFindings = findings.filter(f => f.severity === 'high');
    const mediumFindings = findings.filter(f => f.severity === 'medium');
    const lowFindings = findings.filter(f => f.severity === 'low');

    // Calculate risk score
    riskScore += criticalFindings.length * 40;
    riskScore += highFindings.length * 20;
    riskScore += mediumFindings.length * 10;
    riskScore += lowFindings.length * 5;

    // Determine risk level
    let riskLevel = 'low';
    if (riskScore >= 80) riskLevel = 'critical';
    else if (riskScore >= 40) riskLevel = 'high';
    else if (riskScore >= 20) riskLevel = 'medium';

    // Add risk factors
    if (criticalFindings.length > 0) {
      riskFactors.push(`${criticalFindings.length} critical security issues found`);
    }
    if (highFindings.length > 0) {
      riskFactors.push(`${highFindings.length} high-severity security issues found`);
    }

    return {
      riskLevel,
      riskScore,
      riskFactors,
      findings: {
        critical: criticalFindings.length,
        high: highFindings.length,
        medium: mediumFindings.length,
        low: lowFindings.length,
        total: findings.length
      }
    };
  }

  /**
   * Check for insecure node configurations
   * 
   * @param node Workflow node to check
   * @returns Security issues found in node
   */
  protected checkNodeSecurity(node: any): any[] {
    const issues: any[] = [];

    // Check for insecure HTTP requests
    if (node.type === 'n8n-nodes-base.httpRequest') {
      if (node.parameters?.url?.startsWith('http://')) {
        issues.push({
          type: 'Insecure HTTP',
          severity: 'medium',
          message: 'HTTP requests are not encrypted',
          recommendation: 'Use HTTPS instead of HTTP'
        });
      }

      if (node.parameters?.ignoreSSLIssues) {
        issues.push({
          type: 'SSL Verification Disabled',
          severity: 'high',
          message: 'SSL certificate verification is disabled',
          recommendation: 'Enable SSL verification for secure connections'
        });
      }
    }

    // Check for function nodes with potential security issues
    if (node.type === 'n8n-nodes-base.function' || node.type === 'n8n-nodes-base.code') {
      const code = node.parameters?.functionCode || node.parameters?.jsCode || '';
      
      if (code.includes('eval(') || code.includes('Function(')) {
        issues.push({
          type: 'Code Injection Risk',
          severity: 'critical',
          message: 'Dynamic code execution detected',
          recommendation: 'Avoid using eval() or Function() constructors'
        });
      }

      if (code.includes('require(') && !code.includes('// @ts-ignore')) {
        issues.push({
          type: 'Module Loading',
          severity: 'medium',
          message: 'External module loading detected',
          recommendation: 'Review external dependencies for security risks'
        });
      }
    }

    // Check for webhook nodes with security concerns
    if (node.type === 'n8n-nodes-base.webhook') {
      if (!node.parameters?.authentication || node.parameters?.authentication === 'none') {
        issues.push({
          type: 'Unauthenticated Webhook',
          severity: 'high',
          message: 'Webhook has no authentication',
          recommendation: 'Add authentication to webhook endpoints'
        });
      }
    }

    return issues;
  }

  /**
   * Generate compliance report based on findings
   * 
   * @param findings Security findings
   * @param complianceFramework Compliance framework to check against
   * @returns Compliance report
   */
  protected generateComplianceReport(findings: any[], complianceFramework: string): any {
    const report = {
      framework: complianceFramework,
      overallStatus: 'compliant',
      violations: [] as any[],
      recommendations: [] as string[],
      score: 100
    };

    switch (complianceFramework.toLowerCase()) {
      case 'gdpr':
        report.violations = this.checkGDPRCompliance(findings);
        break;
      case 'sox':
        report.violations = this.checkSOXCompliance(findings);
        break;
      case 'hipaa':
        report.violations = this.checkHIPAACompliance(findings);
        break;
      case 'pci':
        report.violations = this.checkPCICompliance(findings);
        break;
      default:
        report.violations = this.checkGeneralCompliance(findings);
    }

    // Calculate compliance score
    const violationCount = report.violations.length;
    const criticalViolations = report.violations.filter(v => v.severity === 'critical').length;
    
    report.score = Math.max(0, 100 - (violationCount * 10) - (criticalViolations * 20));
    report.overallStatus = report.score >= 80 ? 'compliant' : report.score >= 60 ? 'partially_compliant' : 'non_compliant';

    // Generate recommendations
    if (report.violations.length > 0) {
      report.recommendations = [
        'Review and remediate identified compliance violations',
        'Implement proper data handling procedures',
        'Add encryption for sensitive data processing',
        'Ensure proper access controls are in place'
      ];
    }

    return report;
  }

  /**
   * Check GDPR compliance
   */
  private checkGDPRCompliance(findings: any[]): any[] {
    const violations: any[] = [];
    
    const personalDataTypes = ['Email Address', 'Social Security Number'];
    for (const finding of findings) {
      if (personalDataTypes.includes(finding.type)) {
        violations.push({
          type: 'GDPR Personal Data Processing',
          severity: 'high',
          description: `Processing of ${finding.type} without proper safeguards`,
          article: 'Article 6 - Lawfulness of processing'
        });
      }
    }

    return violations;
  }

  /**
   * Check SOX compliance
   */
  private checkSOXCompliance(findings: any[]): any[] {
    const violations: any[] = [];
    
    // SOX focuses on financial data and audit trails
    const financialDataTypes = ['Credit Card Number', 'Bank Account'];
    for (const finding of findings) {
      if (financialDataTypes.includes(finding.type)) {
        violations.push({
          type: 'SOX Financial Data Security',
          severity: 'critical',
          description: `Insecure handling of financial data: ${finding.type}`,
          section: 'Section 404 - Internal Controls'
        });
      }
    }

    return violations;
  }

  /**
   * Check HIPAA compliance
   */
  private checkHIPAACompliance(findings: any[]): any[] {
    const violations: any[] = [];
    
    // HIPAA focuses on health information
    const healthDataTypes = ['Social Security Number', 'Medical Record'];
    for (const finding of findings) {
      if (healthDataTypes.includes(finding.type)) {
        violations.push({
          type: 'HIPAA PHI Protection',
          severity: 'critical',
          description: `Potential PHI exposure: ${finding.type}`,
          rule: 'Security Rule - Administrative Safeguards'
        });
      }
    }

    return violations;
  }

  /**
   * Check PCI compliance
   */
  private checkPCICompliance(findings: any[]): any[] {
    const violations: any[] = [];
    
    const cardDataTypes = ['Credit Card Number', 'CVV', 'Card Expiry'];
    for (const finding of findings) {
      if (cardDataTypes.includes(finding.type)) {
        violations.push({
          type: 'PCI DSS Violation',
          severity: 'critical',
          description: `Card data security violation: ${finding.type}`,
          requirement: 'Requirement 3 - Protect stored cardholder data'
        });
      }
    }

    return violations;
  }

  /**
   * Check general compliance
   */
  private checkGeneralCompliance(findings: any[]): any[] {
    const violations: any[] = [];
    
    const criticalTypes = ['Credit Card Number', 'Social Security Number', 'Private Key', 'AWS Access Key'];
    for (const finding of findings) {
      if (criticalTypes.includes(finding.type)) {
        violations.push({
          type: 'Sensitive Data Exposure',
          severity: 'critical',
          description: `Exposure of sensitive data: ${finding.type}`,
          standard: 'General Security Best Practices'
        });
      }
    }

    return violations;
  }
}