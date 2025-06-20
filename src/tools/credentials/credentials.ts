/**
 * Credentials Management Tools
 *
 * Tools for managing n8n credentials safely and effectively.
 */

import { BaseCredentialsToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Handler for listing credentials
 */
export class ListCredentialsHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const credentials = await this.apiClient.getCredentials();
      const safeCredentials = this.sanitizeCredentials(credentials);

      return this.formatSuccess(
        { credentials: safeCredentials, count: safeCredentials.length },
        `Retrieved ${safeCredentials.length} credentials`
      );
    }, args);
  }
}

/**
 * Handler for getting credential information (without sensitive data)
 */
export class GetCredentialHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['credentialId']);
      
      const { credentialId } = args;
      const credential = await this.apiClient.getCredential(credentialId);
      const safeCredential = this.sanitizeCredential(credential);

      return this.formatSuccess(
        safeCredential,
        `Retrieved credential: ${credential.name}`
      );
    }, args);
  }
}

/**
 * Handler for creating credentials
 */
export class CreateCredentialHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['name', 'type', 'data']);
      
      const { name, type, data, nodesAccess } = args;

      const credentialData = {
        name,
        type,
        data,
        nodesAccess: nodesAccess || []
      };

      const credential = await this.apiClient.createCredential(credentialData);
      const safeCredential = this.sanitizeCredential(credential);

      return this.formatSuccess(
        safeCredential,
        `Created credential: ${credential.name}`
      );
    }, args);
  }
}

/**
 * Handler for updating credentials
 */
export class UpdateCredentialHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['credentialId']);
      
      const { credentialId, name, data, nodesAccess } = args;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (data) updateData.data = data;
      if (nodesAccess) updateData.nodesAccess = nodesAccess;

      const credential = await this.apiClient.updateCredential(credentialId, updateData);
      const safeCredential = this.sanitizeCredential(credential);

      return this.formatSuccess(
        safeCredential,
        `Updated credential: ${credential.name}`
      );
    }, args);
  }
}

/**
 * Handler for deleting credentials
 */
export class DeleteCredentialHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['credentialId']);
      
      const { credentialId } = args;
      await this.apiClient.deleteCredential(credentialId);

      return this.formatSuccess(
        { deleted: true, credentialId },
        `Deleted credential: ${credentialId}`
      );
    }, args);
  }
}

/**
 * Handler for testing credentials
 */
export class TestCredentialHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      this.validateRequiredParams(args, ['type', 'data']);
      
      const { type, data, nodeType } = args;

      const testData = {
        type,
        data,
        nodeType: nodeType || undefined
      };

      const result = await this.apiClient.testCredential(testData);

      return this.formatSuccess(
        {
          success: result.success || true,
          message: result.message || 'Credential test completed',
          nodeType
        },
        result.success !== false ? 'Credential test passed' : 'Credential test failed'
      );
    }, args);
  }
}

/**
 * Handler for listing credential types
 */
export class ListCredentialTypesHandler extends BaseCredentialsToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const credentialTypes = await this.apiClient.getCredentialTypes();

      const response = {
        credentialTypes: credentialTypes.map(type => ({
          name: type.name,
          displayName: type.displayName,
          description: type.description,
          properties: type.properties?.map((prop: any) => ({
            name: prop.name,
            displayName: prop.displayName,
            type: prop.type,
            required: prop.required,
            description: prop.description
          })) || []
        })),
        count: credentialTypes.length
      };

      return this.formatSuccess(
        response,
        `Retrieved ${credentialTypes.length} credential types`
      );
    }, args);
  }
}

// Tool definitions
export function getListCredentialsToolDefinition(): ToolDefinition {
  return {
    name: 'list_credentials',
    description: 'List all credentials (without sensitive data)',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  };
}

export function getGetCredentialToolDefinition(): ToolDefinition {
  return {
    name: 'get_credential',
    description: 'Get credential information by ID (without sensitive data)',
    inputSchema: {
      type: 'object',
      properties: {
        credentialId: {
          type: 'string',
          description: 'ID of the credential to retrieve'
        }
      },
      required: ['credentialId']
    }
  };
}

export function getCreateCredentialToolDefinition(): ToolDefinition {
  return {
    name: 'create_credential',
    description: 'Create a new credential',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the credential'
        },
        type: {
          type: 'string',
          description: 'Type of the credential (e.g., "httpBasicAuth", "apiKey")'
        },
        data: {
          type: 'object',
          description: 'Credential data (specific to credential type)'
        },
        nodesAccess: {
          type: 'array',
          description: 'Array of node access configurations',
          items: {
            type: 'object'
          }
        }
      },
      required: ['name', 'type', 'data']
    }
  };
}

export function getUpdateCredentialToolDefinition(): ToolDefinition {
  return {
    name: 'update_credential',
    description: 'Update an existing credential',
    inputSchema: {
      type: 'object',
      properties: {
        credentialId: {
          type: 'string',
          description: 'ID of the credential to update'
        },
        name: {
          type: 'string',
          description: 'New name for the credential'
        },
        data: {
          type: 'object',
          description: 'Updated credential data'
        },
        nodesAccess: {
          type: 'array',
          description: 'Updated node access configurations',
          items: {
            type: 'object'
          }
        }
      },
      required: ['credentialId']
    }
  };
}

export function getDeleteCredentialToolDefinition(): ToolDefinition {
  return {
    name: 'delete_credential',
    description: 'Delete a credential',
    inputSchema: {
      type: 'object',
      properties: {
        credentialId: {
          type: 'string',
          description: 'ID of the credential to delete'
        }
      },
      required: ['credentialId']
    }
  };
}

export function getTestCredentialToolDefinition(): ToolDefinition {
  return {
    name: 'test_credential',
    description: 'Test credential configuration before saving',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'Type of the credential to test'
        },
        data: {
          type: 'object',
          description: 'Credential data to test'
        },
        nodeType: {
          type: 'string',
          description: 'Optional node type to test the credential with'
        }
      },
      required: ['type', 'data']
    }
  };
}

export function getListCredentialTypesToolDefinition(): ToolDefinition {
  return {
    name: 'list_credential_types',
    description: 'List all available credential types and their properties',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  };
}