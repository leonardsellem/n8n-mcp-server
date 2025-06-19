/**
 * Scraper Configuration
 * 
 * Configuration settings for the n8n documentation scraping system
 */

import { ScraperConfig } from './interfaces.js';

/**
 * Default scraper configuration
 */
export const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  baseUrl: 'https://docs.n8n.io/integrations/builtin/',
  rateLimit: 1000, // 1 second between requests to be respectful
  timeout: 30000, // 30 second timeout
  retries: 3, // max 3 retry attempts
  userAgent: 'n8n-mcp-server-scraper/1.0.0 (+https://github.com/leonardsellem/n8n-mcp-server)',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  selectors: {
    // Main page selectors
    categoryLinks: 'a[href*="node-types"]',
    nodeList: '.node-list, .integration-list, ul li',
    nodeLink: 'a[href*="/integrations/builtin/"]',
    
    // Node detail page selectors
    nodeTitle: 'h1, .node-title, .page-title',
    nodeDescription: '.node-description, .description, p:first-of-type',
    nodeVersion: '.version, .node-version, [data-version]',
    operationsList: '.operations, .methods, .actions',
    parametersList: '.parameters, .properties, .options',
    credentialInfo: '.credentials, .auth, .authentication',
    exampleSection: '.examples, .usage, .code-example',
    
    // Content extraction
    codeBlocks: 'pre, code, .highlight',
    tableRows: 'table tr, .table tr',
    listItems: 'ul li, ol li, .list-item'
  }
};

/**
 * Node categories and their documentation paths
 */
export const NODE_CATEGORIES = {
  'core-nodes': {
    name: 'Core Nodes',
    path: 'core-nodes/',
    description: 'Essential n8n functionality nodes',
    priority: 1
  },
  'app-nodes': {
    name: 'App Nodes', 
    path: 'app-nodes/',
    description: 'Third-party service integrations',
    priority: 2
  },
  'trigger-nodes': {
    name: 'Trigger Nodes',
    path: 'trigger-nodes/',
    description: 'Event-driven workflow starters',
    priority: 3
  },
  'cluster-nodes': {
    name: 'Cluster Nodes',
    path: 'cluster-nodes/',
    description: 'Distributed processing nodes',
    priority: 4
  },
  'sub-nodes': {
    name: 'Sub Nodes',
    path: 'sub-nodes/',
    description: 'Specialized component nodes',
    priority: 5
  }
} as const;

/**
 * Known n8n documentation URL patterns
 */
export const URL_PATTERNS = {
  nodeDetail: /\/integrations\/builtin\/[^\/]+\/$/,
  categoryIndex: /\/integrations\/builtin\/[^\/]+\/$/,
  mainIndex: /\/integrations\/builtin\/$/
};

/**
 * Data quality thresholds
 */
export const QUALITY_THRESHOLDS = {
  minDescriptionLength: 20,
  minParameterCount: 1,
  maxRetryAttempts: 3,
  qualityScoreThreshold: 70, // Minimum quality score to accept
  maxProcessingTimeMs: 300000 // 5 minutes max processing time
};

/**
 * Scraping rate limits and performance settings
 */
export const PERFORMANCE_CONFIG = {
  concurrentRequests: 3, // Max concurrent requests
  batchSize: 10, // Process nodes in batches
  memoryThresholdMB: 512, // Memory usage threshold
  diskCacheMaxSizeMB: 100, // Max disk cache size
  progressReportInterval: 5000 // Report progress every 5 seconds
};

/**
 * File paths for data storage
 */
export const DATA_PATHS = {
  rawData: 'src/scrapers/data/raw/',
  processedData: 'src/scrapers/data/processed/',
  logs: 'src/scrapers/logs/',
  cache: 'src/scrapers/cache/',
  backups: 'src/scrapers/backups/'
};

/**
 * Validation rules for different node types
 */
export const VALIDATION_RULES = {
  trigger: {
    requiredFields: ['name', 'displayName', 'description', 'category'],
    requiredProperties: ['triggerNode'],
    minDescriptionLength: 30
  },
  regular: {
    requiredFields: ['name', 'displayName', 'description', 'category', 'properties'],
    requiredProperties: ['regularNode'],
    minDescriptionLength: 20
  },
  core: {
    requiredFields: ['name', 'displayName', 'description', 'category', 'properties', 'inputs', 'outputs'],
    requiredProperties: [],
    minDescriptionLength: 25
  }
};

/**
 * CSS selectors for different n8n documentation layouts
 */
export const LAYOUT_SELECTORS = {
  // Modern documentation layout
  modern: {
    title: 'h1.page-title, h1[data-testid="page-title"]',
    description: '.page-description, [data-testid="page-description"]',
    content: '.page-content, [data-testid="page-content"]',
    sidebar: '.sidebar, [data-testid="sidebar"]',
    navigation: '.nav, [data-testid="navigation"]'
  },
  
  // Legacy documentation layout
  legacy: {
    title: 'h1, .title',
    description: '.description, p.description',
    content: '.content, .main-content',
    sidebar: '.sidebar, .nav-sidebar',
    navigation: '.navbar, .nav-menu'
  },
  
  // Fallback selectors
  fallback: {
    title: 'h1, h2, .title, .heading',
    description: 'p, .desc, .summary',
    content: 'main, .content, .body',
    sidebar: '.side, .menu',
    navigation: 'nav, .nav'
  }
};

/**
 * Error handling configuration
 */
export const ERROR_CONFIG = {
  maxErrors: 50, // Max errors before stopping
  logLevel: 'info' as const,
  retryDelayMs: 2000, // Initial retry delay
  exponentialBackoffBase: 2, // Backoff multiplier
  timeoutErrorRetries: 2, // Extra retries for timeout errors
  networkErrorRetries: 3 // Extra retries for network errors
};