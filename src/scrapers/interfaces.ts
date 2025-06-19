/**
 * Scraper Interfaces and Types
 * 
 * This module defines the interfaces used throughout the scraping system
 * for raw data extraction and transformation pipeline.
 */

import { NodeTypeInfo } from '../data/accurate-massive-registry.js';

/**
 * Raw scraped data from n8n documentation before processing
 */
export interface RawNodeData {
  // Basic node information
  url: string;
  name: string;
  displayName: string;
  description: string;
  version?: string;
  category: string;
  subcategory?: string;
  
  // Node characteristics
  nodeType: 'trigger' | 'regular' | 'sub' | 'cluster';
  isCore?: boolean;
  isTrigger?: boolean;
  hasWebhook?: boolean;
  hasPolling?: boolean;
  
  // Extracted content
  rawContent: string;
  operations?: RawOperation[];
  credentials?: RawCredential[];
  examples?: RawExample[];
  
  // Metadata
  scrapedAt: Date;
  sourceUrl: string;
  htmlContent?: string;
}

/**
 * Raw operation data extracted from node documentation
 */
export interface RawOperation {
  name: string;
  displayName: string;
  description: string;
  parameters?: RawParameter[];
}

/**
 * Raw parameter data extracted from operation documentation
 */
export interface RawParameter {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
  options?: Array<{
    name: string;
    value: any;
    description?: string;
  }>;
}

/**
 * Raw credential information extracted from node documentation
 */
export interface RawCredential {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  description?: string;
}

/**
 * Raw example data extracted from node documentation
 */
export interface RawExample {
  title: string;
  description: string;
  workflowData?: any;
  codeSnippet?: string;
}

/**
 * Node reference for batch processing
 */
export interface NodeReference {
  name: string;
  displayName: string;
  url: string;
  category: string;
  subcategory?: string;
  priority: number; // For processing order
}

/**
 * Scraping progress tracking
 */
export interface ScrapingProgress {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  errors: ScrapingError[];
  startTime: Date;
  lastUpdate: Date;
}

/**
 * Scraping error information
 */
export interface ScrapingError {
  url: string;
  nodeName: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}

/**
 * Scraper configuration
 */
export interface ScraperConfig {
  baseUrl: string;
  rateLimit: number; // ms between requests
  timeout: number; // request timeout in ms
  retries: number; // max retry attempts
  userAgent: string;
  headers: Record<string, string>;
  selectors: ScrapingSelectors;
}

/**
 * CSS selectors for scraping different parts of the documentation
 */
export interface ScrapingSelectors {
  // Main page selectors
  categoryLinks: string;
  nodeList: string;
  nodeLink: string;
  
  // Node detail page selectors
  nodeTitle: string;
  nodeDescription: string;
  nodeVersion: string;
  operationsList: string;
  parametersList: string;
  credentialInfo: string;
  exampleSection: string;
  
  // Content extraction
  codeBlocks: string;
  tableRows: string;
  listItems: string;
}

/**
 * Data transformation result
 */
export interface TransformationResult {
  success: boolean;
  nodeInfo?: NodeTypeInfo;
  errors: string[];
  warnings: string[];
  rawData: RawNodeData;
}

/**
 * Validation result for scraped data
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // Quality score 0-100
}

/**
 * Batch processing result
 */
export interface BatchResult {
  processed: number;
  successful: number;
  failed: number;
  results: TransformationResult[];
  errors: ScrapingError[];
  duration: number; // ms
}

/**
 * Scraper statistics
 */
export interface ScraperStats {
  totalNodes: number;
  successfulScrapes: number;
  failedScrapes: number;
  averageResponseTime: number;
  errorRate: number;
  categoryCounts: Record<string, number>;
  processingTime: number;
}