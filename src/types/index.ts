/**
 * Core Types Module
 * 
 * This module provides type definitions used throughout the application
 * and bridges compatibility with the MCP SDK.
 */

// Tool definition for MCP tools
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// Tool call result for MCP tool responses
export interface ToolCallResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Type for n8n workflow object
export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  nodes: any[];
  connections: any;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Type for n8n execution object
export interface Execution {
  id: string;
  workflowId: string;
  finished: boolean;
  mode: string;
  startedAt: string;
  stoppedAt: string;
  status: string;
  data: {
    resultData: {
      runData: any;
    };
  };
  [key: string]: any;
}

// Node categories for organizing n8n nodes
export type NodeCategory = 
  | 'Core Nodes'
  | 'Trigger Nodes'
  | 'Actions'
  | 'Communication'
  | 'Database'
  | 'Cloud Services'
  | 'File Management'
  | 'Marketing'
  | 'Productivity'
  | 'Development'
  | 'E-commerce'
  | 'Analytics'
  | 'Social Media'
  | 'Security'
  | 'Other';

// Node metadata interface for dynamic node discovery
export interface NodeMetadata {
  name: string;
  displayName: string;
  type?: string;
  category: NodeCategory | string;
  description: string;
  credentials: string[] | any[];
  properties: Record<string, any> | any[];
  operations: string[] | any[];
  version: number | string;
  icon?: string;
  documentationUrl?: string;
  sourceUrl?: string;
  lastUpdated: string;
  // Additional fields for enhanced discovery
  packageName?: string;
  isTrigger?: boolean;
  isWebhook?: boolean;
  isAITool?: boolean;
}

// Node cache entry for database storage
export interface NodeCacheEntry {
  id?: number;
  node_name: string;
  metadata: string; // JSON stringified NodeMetadata
  category: string;
  last_updated: string;
  created_at?: string;
}

// GitHub API response types
export interface GitHubApiResponse {
  sha: string;
  url: string;
  tree?: any[];
  truncated?: boolean;
}

// Node parameter definition
export interface NodeParameter {
  displayName: string;
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  options?: Array<{
    name: string;
    value: string;
    description?: string;
  }>;
  placeholder?: string;
  description?: string;
  displayOptions?: {
    show?: Record<string, any>;
    hide?: Record<string, any>;
  };
  typeOptions?: Record<string, any>;
}

// Node credential definition
export interface NodeCredential {
  name: string;
  required: boolean;
  displayName: string;
}

// Node example definition
export interface NodeExample {
  description: string;
  workflow: {
    nodes: Array<{
      name: string;
      type: string;
      parameters: Record<string, any>;
    }>;
  };
}

// Complete node type information
export interface NodeTypeInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory?: string;
  version: number;
  properties: NodeParameter[];
  inputs: string[];
  outputs: string[];
  credentials?: NodeCredential[];
  options?: NodeParameter[];
  examples?: NodeExample[];
  aiToolCompatible?: boolean;
  aiToolDescription?: string;
}
