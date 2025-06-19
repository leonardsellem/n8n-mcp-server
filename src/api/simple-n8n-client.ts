/**
 * Simple N8N Client - Direct API calls without abstraction layers
 * 
 * This replaces the over-engineered client system with straightforward
 * HTTP calls to the n8n API.
 */

import { NodeInfo } from '../data/clean-node-catalog.js';

export interface N8nWorkflow {
  id?: string;
  name: string;
  nodes: N8nNode[];
  connections: N8nConnections;
  active?: boolean;
  settings?: {
    executionOrder?: 'v0' | 'v1';
    saveManualExecutions?: boolean;
    callerPolicy?: string;
    timezone?: string;
  };
  meta?: {
    templateCredsSetupCompleted?: boolean;
  };
  tags?: string[];
  versionId?: string;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: { [key: string]: any };
  credentials?: { [key: string]: { id: string; name: string } };
  webhookId?: string;
  continueOnFail?: boolean;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  notes?: string;
  color?: string;
  disabled?: boolean;
}

export interface N8nConnections {
  [sourceNodeName: string]: {
    [outputType: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}

export interface N8nExecution {
  id: string;
  mode: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  finished: boolean;
  retryOf?: string;
  retrySuccessId?: string;
  status: 'new' | 'running' | 'success' | 'error' | 'canceled' | 'crashed' | 'waiting';
  data?: any;
}

export interface N8nCredential {
  id: string;
  name: string;
  type: string;
  data?: { [key: string]: any };
  nodesAccess?: Array<{ nodeType: string }>;
}

export interface N8nCredentialType {
  name: string;
  displayName: string;
  documentationUrl?: string;
  properties: Array<{
    displayName: string;
    name: string;
    type: string;
    default?: any;
    description?: string;
    required?: boolean;
  }>;
}

export interface N8nNodeType {
  name: string;
  displayName: string;
  description: string;
  defaults: {
    name: string;
    color?: string;
  };
  inputs: string[];
  outputs: string[];
  properties: Array<{
    displayName: string;
    name: string;
    type: string;
    default?: any;
    description?: string;
    required?: boolean;
    options?: Array<{ name: string; value: any }>;
  }>;
  credentials?: Array<{
    name: string;
    required?: boolean;
    displayOptions?: any;
  }>;
  webhooks?: Array<{
    name: string;
    httpMethod: string;
    responseMode: string;
    path: string;
  }>;
  polling?: boolean;
  trigger?: boolean;
  codex?: {
    categories?: string[];
    resources?: {
      primaryDocumentation?: Array<{ url: string }>;
    };
  };
}

export class SimpleN8nClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = 'http://localhost:5678', apiKey: string = '') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['X-N8N-API-KEY'] = this.apiKey;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`N8N API Error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to call N8N API: ${error.message}`);
    }
  }

  // Workflow Management
  async getWorkflows(): Promise<N8nWorkflow[]> {
    const response = await this.makeRequest<{ data: N8nWorkflow[] }>('/workflows');
    return response.data || [];
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return await this.makeRequest<N8nWorkflow>(`/workflows/${id}`);
  }

  async createWorkflow(workflow: Omit<N8nWorkflow, 'id'>): Promise<N8nWorkflow> {
    return await this.makeRequest<N8nWorkflow>('/workflows', 'POST', workflow);
  }

  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return await this.makeRequest<N8nWorkflow>(`/workflows/${id}`, 'PUT', workflow);
  }

  async deleteWorkflow(id: string): Promise<void> {
    await this.makeRequest(`/workflows/${id}`, 'DELETE');
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    return await this.makeRequest<N8nWorkflow>(`/workflows/${id}/activate`, 'POST');
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    return await this.makeRequest<N8nWorkflow>(`/workflows/${id}/deactivate`, 'POST');
  }

  async executeWorkflow(id: string, data?: any): Promise<{ executionId: string }> {
    return await this.makeRequest<{ executionId: string }>(`/workflows/${id}/execute`, 'POST', data);
  }

  // Execution Management
  async getExecutions(workflowId?: string, limit: number = 20): Promise<N8nExecution[]> {
    const params = new URLSearchParams();
    if (workflowId) params.append('workflowId', workflowId);
    params.append('limit', limit.toString());
    
    const endpoint = `/executions?${params.toString()}`;
    const response = await this.makeRequest<{ data: N8nExecution[] }>(endpoint);
    return response.data || [];
  }

  async getExecution(id: string): Promise<N8nExecution> {
    return await this.makeRequest<N8nExecution>(`/executions/${id}`);
  }

  async deleteExecution(id: string): Promise<void> {
    await this.makeRequest(`/executions/${id}`, 'DELETE');
  }

  // Node Types (Discovery)
  async getNodeTypes(): Promise<N8nNodeType[]> {
    try {
      const response = await this.makeRequest<N8nNodeType[]>('/node-types');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch node types from n8n API:', error);
      return [];
    }
  }

  async getNodeType(nodeTypeName: string): Promise<N8nNodeType | null> {
    try {
      return await this.makeRequest<N8nNodeType>(`/node-types/${encodeURIComponent(nodeTypeName)}`);
    } catch (error) {
      console.error(`Failed to fetch node type ${nodeTypeName}:`, error);
      return null;
    }
  }

  // Credential Types
  async getCredentialTypes(): Promise<N8nCredentialType[]> {
    try {
      const response = await this.makeRequest<N8nCredentialType[]>('/credential-types');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Failed to fetch credential types from n8n API:', error);
      return [];
    }
  }

  // Credentials Management
  async getCredentials(): Promise<N8nCredential[]> {
    const response = await this.makeRequest<{ data: N8nCredential[] }>('/credentials');
    return response.data || [];
  }

  async getCredential(id: string): Promise<N8nCredential> {
    return await this.makeRequest<N8nCredential>(`/credentials/${id}`);
  }

  async createCredential(credential: Omit<N8nCredential, 'id'>): Promise<N8nCredential> {
    return await this.makeRequest<N8nCredential>('/credentials', 'POST', credential);
  }

  async updateCredential(id: string, credential: Partial<N8nCredential>): Promise<N8nCredential> {
    return await this.makeRequest<N8nCredential>(`/credentials/${id}`, 'PUT', credential);
  }

  async deleteCredential(id: string): Promise<void> {
    await this.makeRequest(`/credentials/${id}`, 'DELETE');
  }

  async testCredential(type: string, data: any): Promise<{ status: 'success' | 'error'; message?: string }> {
    try {
      await this.makeRequest('/credentials/test', 'POST', { type, data });
      return { status: 'success' };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }

  // Health Check
  async checkHealth(): Promise<{ status: 'ok' | 'error'; version?: string }> {
    try {
      const response = await this.makeRequest<any>('/health');
      return { status: 'ok', version: response.version };
    } catch (error) {
      return { status: 'error' };
    }
  }
}

/**
 * Default client instance
 */
export const n8nClient = new SimpleN8nClient(
  process.env.N8N_HOST || 'http://localhost:5678',
  process.env.N8N_API_KEY || ''
);

/**
 * Utility functions for workflow creation
 */
export class WorkflowBuilder {
  /**
   * Calculate proper node positioning with good spacing
   */
  static calculateNodePosition(nodeIndex: number, totalNodes: number): [number, number] {
    const SPACING_X = 400;
    const SPACING_Y = 200;
    const NODES_PER_ROW = 3;
    const START_X = 240;
    const START_Y = 300;
    
    const row = Math.floor(nodeIndex / NODES_PER_ROW);
    const col = nodeIndex % NODES_PER_ROW;
    
    return [START_X + (col * SPACING_X), START_Y + (row * SPACING_Y)];
  }

  /**
   * Create a basic workflow structure
   */
  static createBasicWorkflow(
    name: string,
    nodeInfos: { nodeInfo: NodeInfo; parameters?: any }[]
  ): N8nWorkflow {
    const nodes: N8nNode[] = [];
    const connections: N8nConnections = {};

    nodeInfos.forEach((item, index) => {
      const { nodeInfo, parameters = {} } = item;
      const nodeId = `node_${index}`;
      const position = this.calculateNodePosition(index, nodeInfos.length);

      nodes.push({
        id: nodeId,
        name: nodeInfo.displayName + (index > 0 ? ` ${index}` : ''),
        type: nodeInfo.name,
        typeVersion: 1,
        position,
        parameters
      });

      // Create connections (linear chain for now)
      if (index > 0 && !nodeInfo.triggerNode) {
        const previousNodeId = `node_${index - 1}`;
        if (!connections[nodes[index - 1].name]) {
          connections[nodes[index - 1].name] = {};
        }
        if (!connections[nodes[index - 1].name].main) {
          connections[nodes[index - 1].name].main = [];
        }
        connections[nodes[index - 1].name].main.push({
          node: nodes[index].name,
          type: 'main',
          index: 0
        });
      }
    });

    return {
      name,
      nodes,
      connections,
      active: false,
      settings: {
        executionOrder: 'v1',
        saveManualExecutions: true,
        timezone: 'America/New_York'
      }
    };
  }

  /**
   * Create workflow from node names with smart parameter suggestions
   */
  static createWorkflowFromPattern(
    name: string,
    nodeNames: string[],
    description?: string
  ): N8nWorkflow {
    // This will be enhanced with the node catalog
    const nodes: N8nNode[] = [];
    const connections: N8nConnections = {};

    nodeNames.forEach((nodeName, index) => {
      const nodeId = `node_${index}`;
      const position = this.calculateNodePosition(index, nodeNames.length);

      nodes.push({
        id: nodeId,
        name: nodeName + (index > 0 ? ` ${index}` : ''),
        type: nodeName,
        typeVersion: 1,
        position,
        parameters: {}
      });

      // Create linear connections
      if (index > 0) {
        const previousNodeName = nodes[index - 1].name;
        if (!connections[previousNodeName]) {
          connections[previousNodeName] = {};
        }
        if (!connections[previousNodeName].main) {
          connections[previousNodeName].main = [];
        }
        connections[previousNodeName].main.push({
          node: nodes[index].name,
          type: 'main',
          index: 0
        });
      }
    });

    return {
      name,
      nodes,
      connections,
      active: false,
      settings: {
        executionOrder: 'v1',
        saveManualExecutions: true
      }
    };
  }
}