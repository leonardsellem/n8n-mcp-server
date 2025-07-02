// n8n API Types - Ported from n8n-manager-for-ai-agents
// These types define the structure of n8n API requests and responses

// Workflow Node Types
export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, string>;
  disabled?: boolean;
  notes?: string;
  notesInFlow?: boolean;
  continueOnFail?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
}

export interface WorkflowConnection {
  [sourceNodeId: string]: {
    [outputType: string]: Array<Array<{
      node: string;
      type: string;
      index: number;
    }>>;
  };
}

export interface WorkflowSettings {
  executionOrder?: 'v0' | 'v1';
  timezone?: string;
  saveDataErrorExecution?: 'all' | 'none';
  saveDataSuccessExecution?: 'all' | 'none';
  saveManualExecutions?: boolean;
  saveExecutionProgress?: boolean;
  executionTimeout?: number;
  errorWorkflow?: string;
}

export interface Workflow {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection;
  active?: boolean; // Optional for creation as it's read-only
  settings?: WorkflowSettings;
  staticData?: Record<string, unknown>;
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
  versionId?: string;
  meta?: {
    instanceId?: string;
  };
}

// Execution Types
export enum ExecutionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  WAITING = 'waiting',
  // Note: 'running' status is not returned by the API
}

export interface ExecutionSummary {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  status: ExecutionStatus;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowName?: string;
  waitTill?: string;
}

export interface ExecutionData {
  startData?: Record<string, unknown>;
  resultData: {
    runData: Record<string, unknown>;
    lastNodeExecuted?: string;
    error?: Record<string, unknown>;
  };
  executionData?: Record<string, unknown>;
}

export interface Execution extends ExecutionSummary {
  data?: ExecutionData;
}

// Credential Types
export interface Credential {
  id?: string;
  name: string;
  type: string;
  data?: Record<string, unknown>;
  nodesAccess?: Array<{
    nodeType: string;
    date?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// Tag Types
export interface Tag {
  id?: string;
  name: string;
  workflowIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Variable Types
export interface Variable {
  id?: string;
  key: string;
  value: string;
  type?: 'string';
}

// Import/Export Types
export interface WorkflowExport {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection;
  settings?: WorkflowSettings;
  staticData?: Record<string, unknown>;
  tags?: string[];
  pinData?: Record<string, unknown>;
  versionId?: string;
  meta?: Record<string, unknown>;
}

export interface WorkflowImport {
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection;
  settings?: WorkflowSettings;
  staticData?: Record<string, unknown>;
  tags?: string[];
  pinData?: Record<string, unknown>;
}

// Source Control Types
export interface SourceControlStatus {
  ahead: number;
  behind: number;
  conflicted: string[];
  created: string[];
  current: string;
  deleted: string[];
  detached: boolean;
  files: Array<{
    path: string;
    status: string;
  }>;
  modified: string[];
  notAdded: string[];
  renamed: Array<{
    from: string;
    to: string;
  }>;
  staged: string[];
  tracking: string;
}

export interface SourceControlPullResult {
  conflicts: string[];
  files: Array<{
    path: string;
    status: string;
  }>;
  mergeConflicts: boolean;
  pullResult: 'success' | 'conflict' | 'error';
}

export interface SourceControlPushResult {
  ahead: number;
  conflicts: string[];
  files: Array<{
    path: string;
    status: string;
  }>;
  pushResult: 'success' | 'conflict' | 'error';
}

// Health Check Types
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  instanceId?: string;
  n8nVersion?: string;
  features?: {
    sourceControl?: boolean;
    externalHooks?: boolean;
    workers?: boolean;
    [key: string]: boolean | undefined;
  };
}

// Request Parameter Types
export interface WorkflowListParams {
  limit?: number;
  cursor?: string;
  active?: boolean;
  tags?: string[] | null;
  projectId?: string;
  excludePinnedData?: boolean;
  instance?: string;
}

export interface WorkflowListResponse {
  data: Workflow[];
  nextCursor?: string | null;
}

export interface ExecutionListParams {
  limit?: number;
  cursor?: string;
  workflowId?: string;
  projectId?: string;
  status?: ExecutionStatus;
  includeData?: boolean;
}

export interface ExecutionListResponse {
  data: Execution[];
  nextCursor?: string | null;
}

export interface CredentialListParams {
  limit?: number;
  cursor?: string;
  filter?: Record<string, unknown>;
}

export interface CredentialListResponse {
  data: Credential[];
  nextCursor?: string | null;
}

export interface TagListParams {
  limit?: number;
  cursor?: string;
  withUsageCount?: boolean;
}

export interface TagListResponse {
  data: Tag[];
  nextCursor?: string | null;
}

// Webhook Request Type
export interface WebhookRequest {
  webhookUrl: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  waitForResponse?: boolean;
}

// MCP Tool Response Type
export interface McpToolResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
}