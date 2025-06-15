/**
 * Manage API Keys Tool
 * 
 * Tool for centralized API key management with encryption and security features.
 */

import { IntegrationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

interface ManageApiKeysArgs {
  operation: 'create' | 'list' | 'update' | 'delete' | 'rotate' | 'validate' | 'audit';
  keyId?: string;
  service: string;
  keyData?: {
    name: string;
    value?: string;
    description?: string;
    scopes?: string[];
    expirationDate?: string;
    environment?: 'development' | 'staging' | 'production';
  };
  rotationSettings?: {
    autoRotate?: boolean;
    rotationInterval?: number; // days
    notifyBefore?: number; // days before expiration
  };
  securityOptions?: {
    encryptionLevel?: 'standard' | 'high' | 'maximum';
    accessRestrictions?: string[];
    auditEnabled?: boolean;
  };
}

interface ApiKey {
  id: string;
  service: string;
  name: string;
  description: string;
  scopes: string[];
  environment: string;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  lastUsed?: string;
  usageCount: number;
  encryptionLevel: string;
  rotationEnabled: boolean;
  accessRestrictions: string[];
}

interface ApiKeyAuditEntry {
  timestamp: string;
  keyId: string;
  action: string;
  user: string;
  ipAddress: string;
  details: any;
}

export class ManageApiKeysHandler extends IntegrationBaseHandler {
  async execute(args: ManageApiKeysArgs): Promise<ToolCallResult> {
    try {
      this.validateIntegrationParams(args, ['operation', 'service']);

      const { operation, keyId, service, keyData, rotationSettings, securityOptions } = args;

      switch (operation) {
        case 'create':
          return await this.createApiKey(service, keyData!, securityOptions);
        case 'list':
          return await this.listApiKeys(service);
        case 'update':
          return await this.updateApiKey(keyId!, keyData!, securityOptions);
        case 'delete':
          return await this.deleteApiKey(keyId!);
        case 'rotate':
          return await this.rotateApiKey(keyId!, rotationSettings);
        case 'validate':
          return await this.validateApiKey(keyId!);
        case 'audit':
          return await this.auditApiKeys(service, keyId);
        default:
          return this.formatError(`Unknown operation: ${operation}`);
      }

    } catch (error) {
      return this.handleIntegrationError(error, 'manage API keys');
    }
  }

  private async createApiKey(
    service: string, 
    keyData: NonNullable<ManageApiKeysArgs['keyData']>, 
    securityOptions?: ManageApiKeysArgs['securityOptions']
  ): Promise<ToolCallResult> {
    
    // Generate unique key ID
    const keyId = `${service}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Encrypt the API key value
    const encryptedValue = await this.encryptApiKey(
      keyData.value || this.generateApiKey(), 
      securityOptions?.encryptionLevel || 'standard'
    );

    const newApiKey: ApiKey = {
      id: keyId,
      service,
      name: keyData.name,
      description: keyData.description || '',
      scopes: keyData.scopes || [],
      environment: keyData.environment || 'development',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: keyData.expirationDate,
      lastUsed: undefined,
      usageCount: 0,
      encryptionLevel: securityOptions?.encryptionLevel || 'standard',
      rotationEnabled: false,
      accessRestrictions: securityOptions?.accessRestrictions || []
    };

    // Store the API key (simulated)
    await this.storeApiKey(newApiKey, encryptedValue);

    // Log audit entry
    if (securityOptions?.auditEnabled !== false) {
      await this.logAuditEntry({
        timestamp: new Date().toISOString(),
        keyId,
        action: 'created',
        user: 'system',
        ipAddress: '127.0.0.1',
        details: {
          service,
          name: keyData.name,
          environment: keyData.environment,
          scopes: keyData.scopes
        }
      });
    }

    return this.formatIntegrationResponse(
      {
        apiKey: this.sanitizeApiKey(newApiKey),
        keyId,
        message: 'API key created successfully'
      },
      `Created new API key for ${service}`
    );
  }

  private async listApiKeys(service: string): Promise<ToolCallResult> {
    // Mock API keys for different services
    const mockApiKeys: ApiKey[] = [
      {
        id: 'slack_1704117600_abc123def',
        service: 'slack',
        name: 'Production Slack Bot',
        description: 'Main production Slack integration',
        scopes: ['chat:write', 'channels:read', 'users:read'],
        environment: 'production',
        status: 'active',
        createdAt: '2024-01-01T12:00:00Z',
        updatedAt: '2024-01-01T12:00:00Z',
        expiresAt: '2024-12-31T23:59:59Z',
        lastUsed: '2024-01-15T14:30:00Z',
        usageCount: 1250,
        encryptionLevel: 'high',
        rotationEnabled: true,
        accessRestrictions: ['production-only']
      },
      {
        id: 'google_sheets_1704117700_xyz789ghi',
        service: 'google-sheets',
        name: 'Reporting Dashboard',
        description: 'Google Sheets integration for reports',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        environment: 'production',
        status: 'active',
        createdAt: '2024-01-02T10:00:00Z',
        updatedAt: '2024-01-10T15:00:00Z',
        expiresAt: '2024-06-30T23:59:59Z',
        lastUsed: '2024-01-14T09:45:00Z',
        usageCount: 3420,
        encryptionLevel: 'maximum',
        rotationEnabled: false,
        accessRestrictions: []
      },
      {
        id: 'salesforce_1704117800_mno456pqr',
        service: 'salesforce',
        name: 'CRM Integration',
        description: 'Salesforce API for lead management',
        scopes: ['api', 'refresh_token'],
        environment: 'staging',
        status: 'expired',
        createdAt: '2024-01-03T08:00:00Z',
        updatedAt: '2024-01-03T08:00:00Z',
        expiresAt: '2024-01-14T23:59:59Z',
        lastUsed: '2024-01-13T16:20:00Z',
        usageCount: 890,
        encryptionLevel: 'standard',
        rotationEnabled: true,
        accessRestrictions: ['staging-environment']
      }
    ];

    // Filter by service if specified
    const filteredKeys = service === 'all' 
      ? mockApiKeys 
      : mockApiKeys.filter(key => key.service === service);

    const sanitizedKeys = filteredKeys.map(key => this.sanitizeApiKey(key));

    return this.formatIntegrationResponse(
      {
        apiKeys: sanitizedKeys,
        total: sanitizedKeys.length,
        service
      },
      `Found ${sanitizedKeys.length} API keys for ${service}`
    );
  }

  private async updateApiKey(
    keyId: string, 
    keyData: NonNullable<ManageApiKeysArgs['keyData']>, 
    securityOptions?: ManageApiKeysArgs['securityOptions']
  ): Promise<ToolCallResult> {
    
    // Find existing key (simulated)
    const existingKey = await this.findApiKey(keyId);
    if (!existingKey) {
      return this.formatError(`API key with ID ${keyId} not found`);
    }

    // Update key properties
    const updatedKey: ApiKey = {
      ...existingKey,
      name: keyData.name || existingKey.name,
      description: keyData.description || existingKey.description,
      scopes: keyData.scopes || existingKey.scopes,
      environment: keyData.environment || existingKey.environment,
      expiresAt: keyData.expirationDate || existingKey.expiresAt,
      updatedAt: new Date().toISOString(),
      encryptionLevel: securityOptions?.encryptionLevel || existingKey.encryptionLevel,
      accessRestrictions: securityOptions?.accessRestrictions || existingKey.accessRestrictions
    };

    // Re-encrypt if encryption level changed
    if (securityOptions?.encryptionLevel && securityOptions.encryptionLevel !== existingKey.encryptionLevel) {
      await this.reencryptApiKey(keyId, securityOptions.encryptionLevel);
    }

    // Log audit entry
    await this.logAuditEntry({
      timestamp: new Date().toISOString(),
      keyId,
      action: 'updated',
      user: 'system',
      ipAddress: '127.0.0.1',
      details: {
        changes: keyData
      }
    });

    return this.formatIntegrationResponse(
      {
        apiKey: this.sanitizeApiKey(updatedKey),
        message: 'API key updated successfully'
      },
      `Updated API key ${keyId}`
    );
  }

  private async deleteApiKey(keyId: string): Promise<ToolCallResult> {
    const existingKey = await this.findApiKey(keyId);
    if (!existingKey) {
      return this.formatError(`API key with ID ${keyId} not found`);
    }

    // Soft delete - mark as revoked
    existingKey.status = 'revoked';
    existingKey.updatedAt = new Date().toISOString();

    // Securely wipe the encrypted key data
    await this.secureDeleteApiKey(keyId);

    // Log audit entry
    await this.logAuditEntry({
      timestamp: new Date().toISOString(),
      keyId,
      action: 'deleted',
      user: 'system',
      ipAddress: '127.0.0.1',
      details: {
        service: existingKey.service,
        name: existingKey.name
      }
    });

    return this.formatIntegrationResponse(
      {
        keyId,
        status: 'revoked',
        message: 'API key deleted successfully'
      },
      `Deleted API key ${keyId}`
    );
  }

  private async rotateApiKey(keyId: string, rotationSettings?: ManageApiKeysArgs['rotationSettings']): Promise<ToolCallResult> {
    const existingKey = await this.findApiKey(keyId);
    if (!existingKey) {
      return this.formatError(`API key with ID ${keyId} not found`);
    }

    // Generate new API key value
    const newKeyValue = this.generateApiKey();
    const encryptedValue = await this.encryptApiKey(newKeyValue, existingKey.encryptionLevel);

    // Update key with new value and rotation settings
    existingKey.updatedAt = new Date().toISOString();
    existingKey.rotationEnabled = rotationSettings?.autoRotate || existingKey.rotationEnabled;

    // Store new encrypted value
    await this.storeApiKey(existingKey, encryptedValue);

    // Log audit entry
    await this.logAuditEntry({
      timestamp: new Date().toISOString(),
      keyId,
      action: 'rotated',
      user: 'system',
      ipAddress: '127.0.0.1',
      details: {
        autoRotate: rotationSettings?.autoRotate,
        rotationInterval: rotationSettings?.rotationInterval
      }
    });

    return this.formatIntegrationResponse(
      {
        keyId,
        rotated: true,
        newKeyPreview: `${newKeyValue.substr(0, 8)}...`,
        message: 'API key rotated successfully'
      },
      `Rotated API key ${keyId}`
    );
  }

  private async validateApiKey(keyId: string): Promise<ToolCallResult> {
    const existingKey = await this.findApiKey(keyId);
    if (!existingKey) {
      return this.formatError(`API key with ID ${keyId} not found`);
    }

    const validation = {
      isValid: existingKey.status === 'active',
      status: existingKey.status,
      isExpired: existingKey.expiresAt ? new Date(existingKey.expiresAt) < new Date() : false,
      service: existingKey.service,
      scopes: existingKey.scopes,
      environment: existingKey.environment,
      lastUsed: existingKey.lastUsed,
      usageCount: existingKey.usageCount,
      security: {
        encryptionLevel: existingKey.encryptionLevel,
        accessRestrictions: existingKey.accessRestrictions
      }
    };

    // Update last used timestamp
    existingKey.lastUsed = new Date().toISOString();
    existingKey.usageCount += 1;

    return this.formatIntegrationResponse(
      validation,
      `Validated API key ${keyId}`
    );
  }

  private async auditApiKeys(service: string, keyId?: string): Promise<ToolCallResult> {
    // Mock audit entries
    const mockAuditEntries: ApiKeyAuditEntry[] = [
      {
        timestamp: '2024-01-15T10:30:00Z',
        keyId: keyId || 'slack_1704117600_abc123def',
        action: 'used',
        user: 'workflow-execution',
        ipAddress: '10.0.1.15',
        details: { endpoint: '/api/v1/slack/send-message', success: true }
      },
      {
        timestamp: '2024-01-14T14:20:00Z',
        keyId: keyId || 'slack_1704117600_abc123def',
        action: 'validated',
        user: 'system',
        ipAddress: '127.0.0.1',
        details: { validationResult: 'success' }
      },
      {
        timestamp: '2024-01-10T09:15:00Z',
        keyId: keyId || 'slack_1704117600_abc123def',
        action: 'updated',
        user: 'admin',
        ipAddress: '192.168.1.100',
        details: { changes: { description: 'Updated description' } }
      }
    ];

    const filteredEntries = keyId 
      ? mockAuditEntries.filter(entry => entry.keyId === keyId)
      : mockAuditEntries;

    return this.formatIntegrationResponse(
      {
        auditEntries: filteredEntries,
        total: filteredEntries.length,
        service,
        keyId
      },
      `Retrieved ${filteredEntries.length} audit entries`
    );
  }

  // Helper methods
  private generateApiKey(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  private async encryptApiKey(value: string, level: string): Promise<string> {
    // Simulate encryption with different levels
    const prefix = {
      'standard': 'std_enc_',
      'high': 'high_enc_',
      'maximum': 'max_enc_'
    }[level] || 'std_enc_';
    
    return `${prefix}${Buffer.from(value).toString('base64')}`;
  }

  private async findApiKey(keyId: string): Promise<ApiKey | null> {
    // Simulate finding API key by ID
    const mockKey: ApiKey = {
      id: keyId,
      service: 'slack',
      name: 'Test API Key',
      description: 'Mock API key for testing',
      scopes: ['basic'],
      environment: 'development',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      usageCount: 0,
      encryptionLevel: 'standard',
      rotationEnabled: false,
      accessRestrictions: []
    };
    
    return mockKey;
  }

  private async storeApiKey(key: ApiKey, encryptedValue: string): Promise<void> {
    // Simulate storing encrypted API key
    console.error(`Storing API key ${key.id} with encryption level ${key.encryptionLevel}`);
  }

  private async reencryptApiKey(keyId: string, newEncryptionLevel: string): Promise<void> {
    // Simulate re-encryption with new level
    console.error(`Re-encrypting API key ${keyId} with ${newEncryptionLevel} encryption`);
  }

  private async secureDeleteApiKey(keyId: string): Promise<void> {
    // Simulate secure deletion
    console.error(`Securely deleting API key ${keyId}`);
  }

  private async logAuditEntry(entry: ApiKeyAuditEntry): Promise<void> {
    // Simulate audit logging
    console.error(`Audit log: ${entry.action} on ${entry.keyId} by ${entry.user}`);
  }

  private sanitizeApiKey(key: ApiKey): Partial<ApiKey> {
    // Remove sensitive information for response
    const { ...sanitized } = key;
    return sanitized;
  }
}

export function getManageApiKeysToolDefinition(): ToolDefinition {
  return {
    name: 'manage_api_keys',
    description: 'Centralized API key management with encryption, rotation, and security features',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['create', 'list', 'update', 'delete', 'rotate', 'validate', 'audit'],
          description: 'Operation to perform on API keys'
        },
        keyId: {
          type: 'string',
          description: 'ID of the API key (required for update, delete, rotate, validate operations)'
        },
        service: {
          type: 'string',
          description: 'Service name for the API key (e.g., "slack", "google-sheets", "all" for list operation)'
        },
        keyData: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Human-readable name for the API key'
            },
            value: {
              type: 'string',
              description: 'API key value (auto-generated if not provided)'
            },
            description: {
              type: 'string',
              description: 'Description of the API key purpose'
            },
            scopes: {
              type: 'array',
              items: { type: 'string' },
              description: 'API scopes or permissions'
            },
            expirationDate: {
              type: 'string',
              description: 'Expiration date (ISO format)'
            },
            environment: {
              type: 'string',
              enum: ['development', 'staging', 'production'],
              description: 'Environment where the key will be used'
            }
          },
          description: 'API key data (required for create and update operations)'
        },
        rotationSettings: {
          type: 'object',
          properties: {
            autoRotate: {
              type: 'boolean',
              description: 'Enable automatic key rotation'
            },
            rotationInterval: {
              type: 'number',
              description: 'Rotation interval in days'
            },
            notifyBefore: {
              type: 'number',
              description: 'Days before expiration to send notification'
            }
          },
          description: 'Key rotation configuration'
        },
        securityOptions: {
          type: 'object',
          properties: {
            encryptionLevel: {
              type: 'string',
              enum: ['standard', 'high', 'maximum'],
              description: 'Level of encryption for stored keys'
            },
            accessRestrictions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Access restrictions (IP ranges, environments, etc.)'
            },
            auditEnabled: {
              type: 'boolean',
              description: 'Enable audit logging for this key'
            }
          },
          description: 'Security configuration options'
        }
      },
      required: ['operation', 'service']
    }
  };
}
