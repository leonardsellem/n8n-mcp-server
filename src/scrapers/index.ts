/**
 * n8n Node Catalog Scraper Module
 * 
 * Complete scraping infrastructure for extracting and transforming
 * n8n node documentation into structured catalog data.
 */

// Core scraper classes
export { BaseScraper } from './base-scraper.js';
export { NodeListScraper } from './node-list-scraper.js';
export { NodeDetailScraper } from './node-detail-scraper.js';
export { MainScraper } from './main-scraper.js';

// Data processing
export { DataTransformer } from './data-transformer.js';
export { NodeValidator } from './validator.js';

// Testing utilities
export { ScraperTester, runScraperTests } from './test-scraper.js';

// Configuration and interfaces
export * from './config.js';
export * from './interfaces.js';

// Re-export for convenience
export { NodeTypeInfo } from '../data/node-types.js';

/**
 * Quick Start Guide
 * 
 * 1. Basic Usage:
 *    ```typescript
 *    import { MainScraper } from './scrapers';
 *    
 *    const scraper = new MainScraper();
 *    const nodes = await scraper.scrapeTest(10); // Test with 10 nodes
 *    ```
 * 
 * 2. Full Production Scraping:
 *    ```typescript
 *    import { MainScraper } from './scrapers';
 *    
 *    const scraper = new MainScraper();
 *    const allNodes = await scraper.scrapeAll(); // All nodes
 *    ```
 * 
 * 3. Validation and Testing:
 *    ```typescript
 *    import { runScraperTests } from './scrapers';
 *    
 *    const success = await runScraperTests();
 *    ```
 * 
 * 4. Custom Configuration:
 *    ```typescript
 *    import { NodeDetailScraper, DEFAULT_SCRAPER_CONFIG } from './scrapers';
 *    
 *    const customConfig = {
 *      ...DEFAULT_SCRAPER_CONFIG,
 *      rateLimit: 2000 // 2 second delay
 *    };
 *    
 *    const scraper = new NodeDetailScraper(customConfig);
 *    ```
 */

/**
 * Available Scrapers:
 * 
 * - BaseScraper: Abstract base class with common functionality
 * - NodeListScraper: Discovers all available nodes from documentation
 * - NodeDetailScraper: Extracts detailed information for individual nodes
 * - MainScraper: Orchestrates the complete scraping process
 * - DataTransformer: Converts raw data to NodeTypeInfo format
 * - NodeValidator: Validates data quality and format compliance
 * - ScraperTester: Comprehensive testing suite
 */

/**
 * Architecture Overview:
 * 
 * 1. Discovery Phase (NodeListScraper):
 *    - Scan main documentation pages
 *    - Extract node references with categories
 *    - Prioritize nodes for processing
 * 
 * 2. Extraction Phase (NodeDetailScraper):
 *    - Scrape individual node pages
 *    - Extract operations, parameters, credentials
 *    - Capture examples and usage information
 * 
 * 3. Transformation Phase (DataTransformer):
 *    - Convert raw data to structured format
 *    - Map to existing NodeTypeInfo interface
 *    - Generate workflow examples
 * 
 * 4. Validation Phase (NodeValidator):
 *    - Validate data quality and completeness
 *    - Check format compliance
 *    - Generate quality scores
 * 
 * 5. Integration Phase (MainScraper):
 *    - Merge with existing catalog
 *    - Handle conflicts and duplicates
 *    - Generate final catalog
 */

/**
 * Error Handling:
 * 
 * All scrapers include comprehensive error handling:
 * - Automatic retry with exponential backoff
 * - Rate limiting to respect server resources
 * - Graceful degradation on individual failures
 * - Detailed error logging and reporting
 * - Progress tracking and recovery
 */

/**
 * Performance Features:
 * 
 * - Concurrent processing with configurable batch sizes
 * - Memory-efficient streaming for large datasets
 * - Intelligent caching to avoid duplicate requests
 * - Progress reporting and time estimation
 * - Resource usage monitoring
 */

/**
 * Quality Assurance:
 * 
 * - Multi-layer validation pipeline
 * - Comprehensive test suite
 * - Data consistency checks
 * - Format compliance verification
 * - Quality scoring and reporting
 */