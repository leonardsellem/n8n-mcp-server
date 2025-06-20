/**
 * Security Tools Module
 * 
 * This module provides MCP tools for workflow security and compliance analysis.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions and handlers
import {
  ScanWorkflowSecurityHandler,
  getScanWorkflowSecurityToolDefinition
} from './scan-workflow-security.js';
import { AuditWorkflowAccessHandler } from './audit-workflow-access.js';
import { CheckComplianceHandler } from './check-compliance.js';
import { EncryptSensitiveDataHandler } from './encrypt-sensitive-data.js';

// Export handlers
export {
  ScanWorkflowSecurityHandler,
  AuditWorkflowAccessHandler,
  CheckComplianceHandler,
  EncryptSensitiveDataHandler,
};

/**
 * Tool definition functions
 */
export function getAuditWorkflowAccessToolDefinition(): ToolDefinition {
  return {
    name: 'audit_workflow_access',
    description: 'Audit workflow access and modifications with detailed logs and analysis',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of specific workflow to audit'
        },
        userId: {
          type: 'string',
          description: 'Optional ID of specific user to audit'
        },
        startDate: {
          type: 'string',
          description: 'Start date for audit period (ISO format)'
        },
        endDate: {
          type: 'string',
          description: 'End date for audit period (ISO format)'
        },
        actionTypes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Types of actions to filter (view, edit, execute, delete, etc.)'
        },
        includeMetadata: {
          type: 'boolean',
          description: 'Include detailed metadata in audit logs'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of audit entries to return'
        }
      },
      required: []
    }
  };
}

export function getCheckComplianceToolDefinition(): ToolDefinition {
  return {
    name: 'check_compliance',
    description: 'Check workflows against compliance frameworks (GDPR, SOX, HIPAA, PCI, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of specific workflow to check'
        },
        framework: {
          type: 'string',
          enum: ['gdpr', 'sox', 'hipaa', 'pci', 'iso27001', 'nist', 'all'],
          description: 'Compliance framework to validate against'
        },
        includeRecommendations: {
          type: 'boolean',
          description: 'Include compliance recommendations in report'
        },
        severity: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Filter violations by severity level'
        }
      },
      required: ['framework']
    }
  };
}

export function getEncryptSensitiveDataToolDefinition(): ToolDefinition {
  return {
    name: 'encrypt_sensitive_data',
    description: 'Encrypt, decrypt, and manage sensitive data in workflows with key rotation',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of specific workflow to process'
        },
        operation: {
          type: 'string',
          enum: ['encrypt', 'decrypt', 'rotate_keys', 'audit_encryption', 'scan_unencrypted'],
          description: 'Encryption operation to perform'
        },
        data: {
          type: 'string',
          description: 'Data to encrypt/decrypt (required for encrypt/decrypt operations)'
        },
        algorithm: {
          type: 'string',
          enum: ['aes-256-gcm', 'aes-256-cbc', 'chacha20-poly1305'],
          description: 'Encryption algorithm to use'
        },
        keyId: {
          type: 'string',
          description: 'Encryption key ID (required for decrypt operation)'
        },
        generateNewKey: {
          type: 'boolean',
          description: 'Generate new encryption key during rotation'
        }
      },
      required: ['operation']
    }
  };
}

/**
 * Set up workflow security tools
 *
 * @returns Array of security tool definitions
 */
export async function setupSecurityTools(): Promise<ToolDefinition[]> {
  return [
    getScanWorkflowSecurityToolDefinition(),
    getAuditWorkflowAccessToolDefinition(),
    getCheckComplianceToolDefinition(),
    getEncryptSensitiveDataToolDefinition()
  ];
}