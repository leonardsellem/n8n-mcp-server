/**
 * Node Type Definitions for n8n MCP Server
 * 
 * This file contains the TypeScript interfaces and types used throughout
 * the n8n node catalog system.
 */

export interface NodeTypeInfo {
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory?: string;
  properties: NodeProperty[];
  inputs: NodeInput[];
  outputs: NodeOutput[];
  credentials?: string[] | CredentialInfo[];
  webhookSupport?: boolean;
  triggerNode?: boolean;
  regularNode?: boolean;
  codeable?: boolean;
  polling?: boolean;
  langChainNode?: boolean;
  examples?: NodeExample[];
  
  // Additional n8n-specific properties
  version?: number | number[];
  defaults?: Record<string, any>;
  subtitle?: string;
  aliases?: string[];
  group?: string[];
  icon?: string | { light: string; dark: string };
  
  // AI-specific metadata
  aiMetadata?: AIMetadata;
  usageNotes?: string;
  integrationGuide?: string;
}

export interface NodeProperty {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
  options?: PropertyOption[];
  validation?: PropertyValidation;
  displayOptions?: DisplayOptions;
  typeOptions?: TypeOptions;
  placeholder?: string;
  modes?: ResourceLocatorMode[];
}

export interface PropertyOption {
  name: string;
  value?: string | number | boolean;
  description?: string;
  action?: string;
  displayName?: string;
  values?: any[];
  type?: string;
  default?: any;
  typeOptions?: TypeOptions;
  options?: PropertyOption[];
  placeholder?: string;
  displayOptions?: DisplayOptions;
  required?: boolean;
}

export interface PropertyValidation {
  type: string;
  min?: number;
  max?: number;
  pattern?: string;
  regex?: string;
  enum?: string[];
  properties?: {
    regex: string;
    errorMessage: string;
  };
}

export interface DisplayOptions {
  show?: Record<string, any[]>;
  hide?: Record<string, any[]>;
}

export interface TypeOptions {
  rows?: number;
  multipleValues?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  loadOptionsMethod?: string;
  loadOptionsDependsOn?: string[];
  searchListMethod?: string;
  minValue?: number;
  maxValue?: number;
  numberPrecision?: number;
  codeAutocomplete?: string;
  filter?: {
    supportedTypes?: string[];
    supportedOperators?: string[];
  };
}

export interface ResourceLocatorMode {
  displayName: string;
  name: string;
  type: string;
  placeholder?: string;
  hint?: string;
  typeOptions?: TypeOptions;
  validation?: PropertyValidation[];
}

export interface NodeInput {
  type: string;
  displayName: string;
  required: boolean;
  maxConnections?: number;
}

export interface NodeOutput {
  type: string;
  displayName: string;
  description?: string;
}

export interface CredentialInfo {
  name: string;
  required: boolean;
  displayOptions?: DisplayOptions;
  types?: string[];
  description?: string;
  documentationUrl?: string;
}

export interface NodeExample {
  name: string;
  description: string;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  useCase?: string;
  workflow: {
    nodes: WorkflowNode[];
  };
}

export interface AIMetadata {
  aiOptimized?: boolean;
  rateLimits?: {
    requests: number;
    window: string;
    unit?: string;
  };
  commonPatterns?: string[];
  integrationComplexity?: 'low' | 'medium' | 'high';
  prerequisites?: string[];
  errorHandling?: {
    retryableErrors?: string[];
    nonRetryableErrors?: string[];
    documentation?: string;
  };
}

export interface WorkflowNode {
  name: string;
  type: string;
  parameters: Record<string, any>;
  position?: [number, number];
  id?: string;
}

// Search and discovery types
export interface SearchResult {
  node: NodeTypeInfo;
  score: number;
  matchReasons: string[];
  category: string;
  isTrigger: boolean;
  isPopular: boolean;
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  nodeTypes?: ('trigger' | 'regular' | 'webhook')[];
  showTriggerOnly?: boolean;
  showPopularOnly?: boolean;
}

// Export common node groups
export type NodeGroup = 'input' | 'output' | 'transform' | 'trigger';

export type NodeCategory = 
  | 'Core'
  | 'Communication' 
  | 'Development'
  | 'AI'
  | 'Productivity'
  | 'Data & Storage'
  | 'E-commerce'
  | 'Marketing'
  | 'Finance'
  | 'Analytics'
  | 'Security';

export type NodeSubcategory =
  | 'Helpers'
  | 'Data Transformation'
  | 'Flow Control'
  | 'Trigger'
  | 'Response'
  | 'Social Media'
  | 'Team Chat'
  | 'Email'
  | 'Version Control'
  | 'CI/CD'
  | 'Language Models'
  | 'Embeddings'
  | 'Image Generation'
  | 'Project Management'
  | 'Note Taking'
  | 'Cloud Storage'
  | 'Databases'
  | 'CRM'
  | 'Payment Processing';