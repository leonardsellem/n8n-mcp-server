export interface MCPServerConfig {
  port: number;
  host: string;
  authToken?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean | Record<string, any>;
  };
}

export interface ResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface PromptDefinition {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

// Node and Workflow types for n8n integration
export interface NodeMetadata {
  name: string;
  displayName: string;
  description: string;
  version: number | string;
  defaults: Record<string, any>;
  inputs: string[];
  outputs: string[];
  properties: Record<string, any>;
  credentials?: Array<{
    name: string;
    required?: boolean;
  }>;
  category?: string;
  group?: string[];
  codex?: {
    categories?: string[];
    subcategories?: Record<string, string[]>;
    resources?: {
      primaryDocumentation?: Array<{
        url: string;
        name?: string;
      }>;
      credentialDocumentation?: Array<{
        url: string;
        name?: string;
      }>;
    };
  };
  operations?: Record<string, any>;
  lastUpdated?: number;
}

export interface NodeCacheEntry {
  id: string;
  metadata: NodeMetadata;
  lastUpdated: number;
  source: string;
}

export type NodeCategory = string;

export interface Workflow {
  id?: string;
  name: string;
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    position: [number, number];
    parameters: Record<string, any>;
  }>;
  connections: Record<string, Record<string, Array<{
    node: string;
    type: string;
    index: number;
  }>>>;
  active?: boolean;
  settings?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Execution {
  id?: string;
  workflowId: string;
  mode: string;
  status: 'new' | 'running' | 'success' | 'error' | 'waiting' | 'canceled';
  data?: Record<string, any>;
  startedAt?: string;
  stoppedAt?: string;
  executionData?: {
    contextData: Record<string, any>;
    nodeExecutionStack: Array<{
      node: {
        name: string;
        type: string;
      };
      data: Record<string, any>;
    }>;
    waitingExecution: Record<string, any>;
  };
}
