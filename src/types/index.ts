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

// n8n workflow and execution types
export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  staticData?: Record<string, any>;
  settings?: Record<string, any>;
  pinData?: Record<string, any>;
  versionId?: string;
}

export interface Execution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: Date;
  stoppedAt?: Date;
  workflowId: string;
  workflowData?: Workflow;
  data?: Record<string, any>;
  status: 'new' | 'running' | 'success' | 'error' | 'waiting' | 'canceled';
}

// Node metadata types
export interface NodeMetadata {
  name: string;
  displayName: string;
  description: string;
  type?: string;
  icon?: string;
  iconUrl?: string;
  category: NodeCategory;
  version: number;
  lastUpdated: string;
  defaults?: Record<string, any>;
  inputs?: string[];
  outputs?: string[];
  properties?: Record<string, any>;
  credentials?: Array<{
    name: string;
    required?: boolean;
  }>;
  operations?: string[];
  documentationUrl?: string;
  sourceUrl?: string;
  requestDefaults?: Record<string, any>;
  codex?: {
    alias?: string[];
    categories?: string[];
    subcategories?: Record<string, string[]>;
    resources?: {
      primaryDocumentation?: Array<{
        url: string;
      }>;
      credentialDocumentation?: Array<{
        url: string;
      }>;
    };
  };
}

export interface NodeCacheEntry {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: NodeCategory;
  version: number;
  lastUpdated: string;
  metadata: NodeMetadata;
}

export type NodeCategory = 
  | 'Core'
  | 'Trigger'
  | 'Action'
  | 'Transform'
  | 'Files'
  | 'Communication'
  | 'Data & Storage'
  | 'Marketing'
  | 'Sales'
  | 'Productivity'
  | 'Development'
  | 'Analytics'
  | 'AI'
  | 'Social'
  | 'Finance'
  | 'IoT'
  | 'Security'
  | 'Cluster';
