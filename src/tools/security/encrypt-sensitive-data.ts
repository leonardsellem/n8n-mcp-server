import { BaseSecurityToolHandler } from './base-handler.js';
import { ToolCallResult } from '../../types/index.js';
import * as crypto from 'crypto';

interface EncryptionOptions {
  workflowId?: string;
  operation: 'encrypt' | 'decrypt' | 'rotate_keys' | 'audit_encryption' | 'scan_unencrypted';
  data?: string;
  algorithm?: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305';
  keyId?: string;
  generateNewKey?: boolean;
}

interface EncryptionResult {
  success: boolean;
  operation: string;
  result?: {
    encryptedData?: string;
    decryptedData?: string;
    keyId?: string;
    algorithm?: string;
    iv?: string;
    authTag?: string;
  };
  audit?: {
    workflowsScanned: number;
    unencryptedDataFound: number;
    encryptedDataFound: number;
    sensitiveDataTypes: string[];
    recommendations: string[];
  };
  keys?: {
    activeKeys: number;
    rotatedKeys: number;
    keyRotationSchedule: string;
  };
  error?: string;
}

interface EncryptionKey {
  id: string;
  algorithm: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'inactive' | 'revoked';
  usage: number;
}

interface SensitiveDataItem {
  workflowId: string;
  workflowName: string;
  nodeId: string;
  nodeName: string;
  dataType: string;
  fieldPath: string;
  isEncrypted: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export class EncryptSensitiveDataHandler extends BaseSecurityToolHandler {
  private encryptionKeys: Map<string, EncryptionKey> = new Map();
  private readonly defaultAlgorithm = 'aes-256-gcm';

  constructor() {
    super();
    this.initializeDefaultKeys();
  }

  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['operation']);
      const options = args as EncryptionOptions;
      const result = await this.encryptSensitiveData(options);
      return this.formatSuccess(result, `Encryption operation '${options.operation}' completed successfully`);
    }, args);
  }

  async encryptSensitiveData(options: EncryptionOptions): Promise<EncryptionResult> {
    try {
      switch (options.operation) {
        case 'encrypt':
          return await this.encryptData(options);
        case 'decrypt':
          return await this.decryptData(options);
        case 'rotate_keys':
          return await this.rotateEncryptionKeys(options);
        case 'audit_encryption':
          return await this.auditEncryption(options);
        case 'scan_unencrypted':
          return await this.scanUnencryptedData(options);
        default:
          throw new Error(`Unsupported operation: ${options.operation}`);
      }
    } catch (error) {
      return {
        success: false,
        operation: options.operation,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async encryptData(options: EncryptionOptions): Promise<EncryptionResult> {
    if (!options.data) {
      throw new Error('Data is required for encryption operation');
    }

    const algorithm = options.algorithm || this.defaultAlgorithm;
    const keyId = options.keyId || await this.getOrCreateKey(algorithm);
    const key = this.getEncryptionKey(keyId);

    if (!key) {
      throw new Error(`Encryption key not found: ${keyId}`);
    }

    const result = this.performEncryption(options.data, algorithm, keyId);

    // Update key usage
    key.lastUsed = new Date().toISOString();
    key.usage += 1;

    return {
      success: true,
      operation: 'encrypt',
      result: {
        encryptedData: result.encryptedData,
        keyId,
        algorithm,
        iv: result.iv,
        authTag: result.authTag
      }
    };
  }

  private async decryptData(options: EncryptionOptions): Promise<EncryptionResult> {
    if (!options.data || !options.keyId) {
      throw new Error('Encrypted data and keyId are required for decryption operation');
    }

    const key = this.getEncryptionKey(options.keyId);
    if (!key) {
      throw new Error(`Encryption key not found: ${options.keyId}`);
    }

    // In a real implementation, the IV and authTag would be extracted from the encrypted data
    const decryptedData = this.performDecryption(options.data, key.algorithm, options.keyId);

    // Update key usage
    key.lastUsed = new Date().toISOString();
    key.usage += 1;

    return {
      success: true,
      operation: 'decrypt',
      result: {
        decryptedData
      }
    };
  }

  private async rotateEncryptionKeys(options: EncryptionOptions): Promise<EncryptionResult> {
    let rotatedCount = 0;
    const newKeys: string[] = [];

    // Rotate keys that are older than 90 days or have high usage
    for (const [keyId, key] of this.encryptionKeys) {
      const keyAge = Date.now() - new Date(key.created).getTime();
      const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 days
      const maxUsage = 10000;

      if (keyAge > maxAge || key.usage > maxUsage) {
        // Create new key
        const newKeyId = await this.createNewKey(key.algorithm);
        newKeys.push(newKeyId);

        // Mark old key as inactive
        key.status = 'inactive';
        rotatedCount++;
      }
    }

    // If requested, generate a new key regardless
    if (options.generateNewKey) {
      const algorithm = options.algorithm || this.defaultAlgorithm;
      const newKeyId = await this.createNewKey(algorithm);
      newKeys.push(newKeyId);
      rotatedCount++;
    }

    return {
      success: true,
      operation: 'rotate_keys',
      keys: {
        activeKeys: Array.from(this.encryptionKeys.values()).filter(k => k.status === 'active').length,
        rotatedKeys: rotatedCount,
        keyRotationSchedule: 'Every 90 days or after 10,000 operations'
      }
    };
  }

  private async auditEncryption(options: EncryptionOptions): Promise<EncryptionResult> {
    const workflows = options.workflowId 
      ? [await this.apiService.getWorkflow(options.workflowId)]
      : await this.apiService.getWorkflows();

    let workflowsScanned = 0;
    let unencryptedDataFound = 0;
    let encryptedDataFound = 0;
    const sensitiveDataTypes: Set<string> = new Set();
    const recommendations: string[] = [];

    for (const workflow of workflows) {
      workflowsScanned++;
      
      const auditResult = await this.auditWorkflowEncryption(workflow);
      unencryptedDataFound += auditResult.unencrypted;
      encryptedDataFound += auditResult.encrypted;
      
      auditResult.sensitiveTypes.forEach(type => sensitiveDataTypes.add(type));
    }

    // Generate recommendations
    if (unencryptedDataFound > 0) {
      recommendations.push(`Found ${unencryptedDataFound} unencrypted sensitive data items`);
      recommendations.push('Implement encryption for all sensitive data fields');
      recommendations.push('Use n8n credential system for API keys and passwords');
    }

    if (encryptedDataFound === 0 && unencryptedDataFound === 0) {
      recommendations.push('No sensitive data found in workflows');
      recommendations.push('Continue monitoring for new sensitive data');
    } else {
      recommendations.push('Establish regular encryption audits');
      recommendations.push('Implement data classification policies');
    }

    return {
      success: true,
      operation: 'audit_encryption',
      audit: {
        workflowsScanned,
        unencryptedDataFound,
        encryptedDataFound,
        sensitiveDataTypes: Array.from(sensitiveDataTypes),
        recommendations
      }
    };
  }

  private async scanUnencryptedData(options: EncryptionOptions): Promise<EncryptionResult> {
    const workflows = options.workflowId 
      ? [await this.apiService.getWorkflow(options.workflowId)]
      : await this.apiService.getWorkflows();

    const unencryptedItems: SensitiveDataItem[] = [];
    let workflowsScanned = 0;

    for (const workflow of workflows) {
      workflowsScanned++;
      const items = await this.scanWorkflowForUnencryptedData(workflow);
      unencryptedItems.push(...items);
    }

    const sensitiveDataTypes = [...new Set(unencryptedItems.map(item => item.dataType))];
    const recommendations = this.generateEncryptionRecommendations(unencryptedItems);

    return {
      success: true,
      operation: 'scan_unencrypted',
      audit: {
        workflowsScanned,
        unencryptedDataFound: unencryptedItems.length,
        encryptedDataFound: 0, // This scan only looks for unencrypted data
        sensitiveDataTypes,
        recommendations
      }
    };
  }

  private async auditWorkflowEncryption(workflow: any): Promise<{ unencrypted: number; encrypted: number; sensitiveTypes: string[] }> {
    const workflowContent = JSON.stringify(workflow);
    const sensitiveFindings = this.scanForSensitiveData(workflowContent);
    
    let unencrypted = 0;
    let encrypted = 0;
    const sensitiveTypes: string[] = [];

    for (const finding of sensitiveFindings) {
      sensitiveTypes.push(finding.type);
      
      // Simple heuristic: if the value looks like encrypted data (base64, hex) consider it encrypted
      if (this.looksLikeEncryptedData(finding.value)) {
        encrypted++;
      } else {
        unencrypted++;
      }
    }

    return { unencrypted, encrypted, sensitiveTypes };
  }

  private async scanWorkflowForUnencryptedData(workflow: any): Promise<SensitiveDataItem[]> {
    const items: SensitiveDataItem[] = [];
    const nodes = workflow.nodes || [];

    for (const node of nodes) {
      const nodeContent = JSON.stringify(node);
      const sensitiveFindings = this.scanForSensitiveData(nodeContent);

      for (const finding of sensitiveFindings) {
        if (!this.looksLikeEncryptedData(finding.value)) {
          items.push({
            workflowId: workflow.id,
            workflowName: workflow.name,
            nodeId: node.id || 'unknown',
            nodeName: node.name || node.type || 'unnamed',
            dataType: finding.type,
            fieldPath: this.findFieldPath(node, finding.value),
            isEncrypted: false,
            riskLevel: this.assessDataRiskLevel(finding.type),
            recommendation: finding.recommendation
          });
        }
      }
    }

    return items;
  }

  private looksLikeEncryptedData(value: string): boolean {
    // Simple heuristics to determine if data might be encrypted
    if (value.length < 10) return false;
    
    // Check for base64 pattern
    const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
    if (base64Pattern.test(value) && value.length % 4 === 0) return true;
    
    // Check for hex pattern
    const hexPattern = /^[0-9a-fA-F]+$/;
    if (hexPattern.test(value) && value.length % 2 === 0) return true;
    
    // Check for encryption markers
    const encryptionMarkers = ['encrypted:', 'enc:', 'aes:', 'rsa:'];
    return encryptionMarkers.some(marker => value.toLowerCase().startsWith(marker));
  }

  private findFieldPath(node: any, value: string): string {
    // Recursively search for the field path containing the value
    const searchObject = (obj: any, path: string = ''): string => {
      for (const [key, val] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof val === 'string' && val.includes(value)) {
          return currentPath;
        } else if (typeof val === 'object' && val !== null) {
          const result = searchObject(val, currentPath);
          if (result) return result;
        }
      }
      return '';
    };

    return searchObject(node) || 'unknown';
  }

  private assessDataRiskLevel(dataType: string): 'low' | 'medium' | 'high' | 'critical' {
    const riskLevels: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
      'Credit Card Number': 'critical',
      'Social Security Number': 'critical',
      'Private Key': 'critical',
      'AWS Access Key': 'critical',
      'API Key Pattern': 'high',
      'Password Pattern': 'high',
      'Database Connection String': 'high',
      'Email Address': 'medium',
      'Phone Number': 'low'
    };

    return riskLevels[dataType] || 'medium';
  }

  private generateEncryptionRecommendations(unencryptedItems: SensitiveDataItem[]): string[] {
    const recommendations: string[] = [];
    
    if (unencryptedItems.length === 0) {
      recommendations.push('No unencrypted sensitive data found');
      return recommendations;
    }

    const criticalItems = unencryptedItems.filter(item => item.riskLevel === 'critical');
    const highItems = unencryptedItems.filter(item => item.riskLevel === 'high');

    if (criticalItems.length > 0) {
      recommendations.push(`URGENT: ${criticalItems.length} critical sensitive data items require immediate encryption`);
      recommendations.push('Move critical data to secure credential storage immediately');
    }

    if (highItems.length > 0) {
      recommendations.push(`${highItems.length} high-risk sensitive data items should be encrypted`);
    }

    recommendations.push('Implement field-level encryption for sensitive workflow data');
    recommendations.push('Use environment variables for configuration secrets');
    recommendations.push('Establish data classification and encryption policies');
    recommendations.push('Regular scans for unencrypted sensitive data');

    return recommendations;
  }

  private performEncryption(data: string, algorithm: string, keyId: string): { encryptedData: string; iv: string; authTag?: string } {
    // In a real implementation, this would use proper encryption
    // For demonstration, we'll simulate the process
    const iv = crypto.randomBytes(16).toString('hex');
    const mockEncrypted = Buffer.from(data).toString('base64');
    const authTag = algorithm.includes('gcm') ? crypto.randomBytes(16).toString('hex') : undefined;

    return {
      encryptedData: `enc:${algorithm}:${keyId}:${mockEncrypted}`,
      iv,
      authTag
    };
  }

  private performDecryption(encryptedData: string, algorithm: string, keyId: string): string {
    // In a real implementation, this would use proper decryption
    // For demonstration, we'll simulate the process
    if (encryptedData.startsWith('enc:')) {
      const parts = encryptedData.split(':');
      if (parts.length >= 4) {
        const base64Data = parts[3];
        return Buffer.from(base64Data, 'base64').toString('utf8');
      }
    }
    
    throw new Error('Invalid encrypted data format');
  }

  private initializeDefaultKeys(): void {
    // Initialize with some default keys for demonstration
    const defaultKey: EncryptionKey = {
      id: 'default-aes-256-gcm',
      algorithm: 'aes-256-gcm',
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: 'active',
      usage: 0
    };

    this.encryptionKeys.set(defaultKey.id, defaultKey);
  }

  private async getOrCreateKey(algorithm: string): Promise<string> {
    // Find existing active key for algorithm
    for (const [keyId, key] of this.encryptionKeys) {
      if (key.algorithm === algorithm && key.status === 'active') {
        return keyId;
      }
    }

    // Create new key if none found
    return await this.createNewKey(algorithm);
  }

  private async createNewKey(algorithm: string): Promise<string> {
    const keyId = `${algorithm}-${Date.now()}`;
    const newKey: EncryptionKey = {
      id: keyId,
      algorithm,
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      status: 'active',
      usage: 0
    };

    this.encryptionKeys.set(keyId, newKey);
    return keyId;
  }

  private getEncryptionKey(keyId: string): EncryptionKey | undefined {
    return this.encryptionKeys.get(keyId);
  }
}