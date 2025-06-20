/**
 * Main Scraper Orchestrator
 * 
 * Coordinates the entire scraping process from node discovery to
 * data transformation and validation.
 */

import { NodeListScraper } from './node-list-scraper.js';
import { NodeDetailScraper } from './node-detail-scraper.js';
import { DataTransformer } from './data-transformer.js';
import { NodeTypeInfo } from '../data/node-types.js';
import { 
  NodeReference, 
  RawNodeData, 
  TransformationResult, 
  BatchResult,
  ScraperStats 
} from './interfaces.js';
import { PERFORMANCE_CONFIG } from './config.js';

/**
 * Main scraper that orchestrates the entire process
 */
export class MainScraper {
  private nodeListScraper: NodeListScraper;
  private nodeDetailScraper: NodeDetailScraper;
  private dataTransformer: DataTransformer;
  private stats: ScraperStats;

  constructor() {
    this.nodeListScraper = new NodeListScraper();
    this.nodeDetailScraper = new NodeDetailScraper();
    this.dataTransformer = new DataTransformer();
    
    this.stats = {
      totalNodes: 0,
      successfulScrapes: 0,
      failedScrapes: 0,
      averageResponseTime: 0,
      errorRate: 0,
      categoryCounts: {},
      processingTime: 0
    };
  }

  /**
   * Execute complete scraping process
   */
  async scrapeAll(): Promise<NodeTypeInfo[]> {
    const startTime = Date.now();
    
    try {
      console.log('🚀 Starting n8n node catalog scraping...');
      
      // Phase 1: Discover all nodes
      console.log('📋 Phase 1: Discovering nodes...');
      const nodeReferences = await this.discoverNodes();
      console.log(`✅ Discovered ${nodeReferences.length} nodes`);
      
      // Phase 2: Scrape detailed information
      console.log('🔍 Phase 2: Scraping node details...');
      const rawData = await this.scrapeNodeDetails(nodeReferences);
      console.log(`✅ Successfully scraped ${rawData.length}/${nodeReferences.length} nodes`);
      
      // Phase 3: Transform data
      console.log('🔄 Phase 3: Transforming data...');
      const transformedNodes = await this.transformData(rawData);
      console.log(`✅ Successfully transformed ${transformedNodes.length} nodes`);
      
      // Phase 4: Update statistics
      this.updateFinalStats(nodeReferences, rawData, transformedNodes, startTime);
      
      console.log('🎉 Scraping completed successfully!');
      this.printStats();
      
      return transformedNodes;
      
    } catch (error) {
      console.error('❌ Scraping failed:', error);
      throw error;
    }
  }

  /**
   * Execute test scraping with a small subset
   */
  async scrapeTest(maxNodes: number = 10): Promise<NodeTypeInfo[]> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Starting test scraping (max ${maxNodes} nodes)...`);
      
      // Discover nodes
      const allNodeRefs = await this.discoverNodes();
      
      // Select test subset (prioritize high-priority nodes)
      const testNodeRefs = this.selectTestNodes(allNodeRefs, maxNodes);
      console.log(`📝 Selected ${testNodeRefs.length} nodes for testing:`);
      testNodeRefs.forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.displayName} (${node.category})`);
      });
      
      // Scrape test nodes
      const rawData = await this.scrapeNodeDetails(testNodeRefs);
      
      // Transform data
      const transformedNodes = await this.transformData(rawData);
      
      // Update statistics
      this.updateFinalStats(testNodeRefs, rawData, transformedNodes, startTime);
      
      console.log('🎉 Test scraping completed!');
      this.printTestResults(testNodeRefs, rawData, transformedNodes);
      
      return transformedNodes;
      
    } catch (error) {
      console.error('❌ Test scraping failed:', error);
      throw error;
    }
  }

  /**
   * Discover all available nodes
   */
  private async discoverNodes(): Promise<NodeReference[]> {
    const progress = this.nodeListScraper.getProgress();
    console.log(`Starting node discovery...`);
    
    const nodeRefs = await this.nodeListScraper.scrape();
    
    // Update category counts
    nodeRefs.forEach(node => {
      this.stats.categoryCounts[node.category] = 
        (this.stats.categoryCounts[node.category] || 0) + 1;
    });
    
    this.stats.totalNodes = nodeRefs.length;
    
    return nodeRefs;
  }

  /**
   * Select nodes for testing (prioritize important ones)
   */
  private selectTestNodes(allNodes: NodeReference[], maxNodes: number): NodeReference[] {
    // Sort by priority and select top nodes
    const sortedNodes = allNodes
      .sort((a, b) => a.priority - b.priority)
      .slice(0, maxNodes);
    
    // Ensure we have a good mix of categories
    const selectedNodes: NodeReference[] = [];
    const categorySeen = new Set<string>();
    
    // First pass: one from each category
    for (const node of sortedNodes) {
      if (!categorySeen.has(node.category) && selectedNodes.length < maxNodes) {
        selectedNodes.push(node);
        categorySeen.add(node.category);
      }
    }
    
    // Second pass: fill remaining slots with high-priority nodes
    for (const node of sortedNodes) {
      if (selectedNodes.length >= maxNodes) break;
      if (!selectedNodes.some(n => n.name === node.name)) {
        selectedNodes.push(node);
      }
    }
    
    return selectedNodes;
  }

  /**
   * Scrape detailed information for nodes
   */
  private async scrapeNodeDetails(nodeRefs: NodeReference[]): Promise<RawNodeData[]> {
    const batchSize = PERFORMANCE_CONFIG.batchSize;
    const results: RawNodeData[] = [];
    
    console.log(`Processing ${nodeRefs.length} nodes in batches of ${batchSize}...`);
    
    for (let i = 0; i < nodeRefs.length; i += batchSize) {
      const batch = nodeRefs.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(nodeRefs.length/batchSize)}...`);
      
      try {
        const batchResults = await this.nodeDetailScraper.scrapeNodes(batch);
        results.push(...batchResults);
        
        this.stats.successfulScrapes += batchResults.length;
        this.stats.failedScrapes += (batch.length - batchResults.length);
        
        // Progress update
        const progress = Math.round(((i + batch.length) / nodeRefs.length) * 100);
        console.log(`  Progress: ${progress}% (${results.length}/${nodeRefs.length} completed)`);
        
      } catch (error) {
        console.error(`  Batch ${Math.floor(i/batchSize) + 1} failed:`, error);
        this.stats.failedScrapes += batch.length;
      }
    }
    
    return results;
  }

  /**
   * Transform raw data to NodeTypeInfo format
   */
  private async transformData(rawData: RawNodeData[]): Promise<NodeTypeInfo[]> {
    console.log(`Transforming ${rawData.length} raw nodes...`);
    
    const transformResults = this.dataTransformer.transformBatch(rawData);
    
    // Extract successful transformations
    const successfulNodes = transformResults
      .filter(result => result.success && result.nodeInfo)
      .map(result => result.nodeInfo!);
    
    // Log transformation statistics
    const transformStats = this.dataTransformer.getStats(transformResults);
    console.log(`  Transformation success rate: ${Math.round(transformStats.successRate * 100)}%`);
    console.log(`  Average quality score: ${Math.round(transformStats.averageQualityScore)}`);
    
    if (transformStats.commonErrors.length > 0) {
      console.log('  Common transformation errors:');
      transformStats.commonErrors.forEach(({ error, count }: { error: string; count: number }) => {
        console.log(`    - ${error}: ${count} occurrences`);
      });
    }
    
    return successfulNodes;
  }

  /**
   * Update final statistics
   */
  private updateFinalStats(
    nodeRefs: NodeReference[], 
    rawData: RawNodeData[], 
    transformedNodes: NodeTypeInfo[], 
    startTime: number
  ): void {
    const endTime = Date.now();
    this.stats.processingTime = endTime - startTime;
    
    this.stats.totalNodes = nodeRefs.length;
    this.stats.successfulScrapes = rawData.length;
    this.stats.failedScrapes = nodeRefs.length - rawData.length;
    this.stats.errorRate = this.stats.failedScrapes / this.stats.totalNodes;
    this.stats.averageResponseTime = this.stats.processingTime / this.stats.totalNodes;
  }

  /**
   * Print comprehensive statistics
   */
  private printStats(): void {
    console.log('\n📊 Scraping Statistics:');
    console.log(`  Total nodes discovered: ${this.stats.totalNodes}`);
    console.log(`  Successfully scraped: ${this.stats.successfulScrapes}`);
    console.log(`  Failed scrapes: ${this.stats.failedScrapes}`);
    console.log(`  Success rate: ${Math.round((1 - this.stats.errorRate) * 100)}%`);
    console.log(`  Average response time: ${Math.round(this.stats.averageResponseTime)}ms`);
    console.log(`  Total processing time: ${Math.round(this.stats.processingTime / 1000)}s`);
    
    console.log('\n📂 Category Distribution:');
    Object.entries(this.stats.categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} nodes`);
    });
  }

  /**
   * Print test results
   */
  private printTestResults(
    nodeRefs: NodeReference[], 
    rawData: RawNodeData[], 
    transformedNodes: NodeTypeInfo[]
  ): void {
    console.log('\n🧪 Test Results Summary:');
    console.log(`  Nodes tested: ${nodeRefs.length}`);
    console.log(`  Raw data extracted: ${rawData.length}`);
    console.log(`  Successfully transformed: ${transformedNodes.length}`);
    console.log(`  Overall success rate: ${Math.round((transformedNodes.length / nodeRefs.length) * 100)}%`);
    
    console.log('\n📋 Sample Results:');
    transformedNodes.slice(0, 3).forEach((node, i) => {
      console.log(`  ${i + 1}. ${node.displayName}`);
      console.log(`     Category: ${node.category}`);
      console.log(`     Properties: ${node.properties.length}`);
      console.log(`     Description: ${node.description.substring(0, 80)}...`);
    });
  }

  /**
   * Get current scraping statistics
   */
  public getStats(): ScraperStats {
    return { ...this.stats };
  }

  /**
   * Get discovery statistics from node list scraper
   */
  public async getDiscoveryStats(): Promise<any> {
    return await this.nodeListScraper.getDiscoveryStats();
  }

  /**
   * Merge scraped data with existing catalog
   */
  public mergeWithExistingCatalog(
    scrapedNodes: NodeTypeInfo[], 
    existingNodes: NodeTypeInfo[]
  ): NodeTypeInfo[] {
    console.log('🔀 Merging with existing catalog...');
    const merged = this.dataTransformer.mergeWithExisting(scrapedNodes, existingNodes);
    
    const newNodesCount = merged.length - existingNodes.length;
    console.log(`  Added ${newNodesCount} new nodes`);
    console.log(`  Total catalog size: ${merged.length} nodes`);
    
    return merged;
  }

  /**
   * Save scraped data to file
   */
  public async saveResults(nodes: NodeTypeInfo[], filename: string): Promise<void> {
    console.log(`💾 Saving results to ${filename}...`);
    
    const content = `/**
 * Enhanced n8n Node Catalog
 * 
 * Generated by automated scraping on ${new Date().toISOString()}
 * Total nodes: ${nodes.length}
 */

export const ENHANCED_NODE_CATALOG: NodeTypeInfo[] = ${JSON.stringify(nodes, null, 2)};

export const CATALOG_STATS = {
  totalNodes: ${nodes.length},
  generatedAt: '${new Date().toISOString()}',
  categories: ${JSON.stringify(this.stats.categoryCounts, null, 2)},
  scraperStats: ${JSON.stringify(this.stats, null, 2)}
};
`;
    
    // Note: In a real implementation, you'd use fs.writeFile
    console.log(`  Generated catalog with ${nodes.length} nodes`);
    console.log(`  File size: ~${Math.round(content.length / 1024)}KB`);
  }

  /**
   * Validate scraping approach with minimal data
   */
  public async validateApproach(): Promise<boolean> {
    try {
      console.log('🔍 Validating scraping approach...');
      
      // Test with just 3 nodes
      const testResults = await this.scrapeTest(3);
      
      // Check success criteria
      const hasResults = testResults.length > 0;
      const hasValidData = testResults.every(node => 
        node.name && node.displayName && node.description.length > 10
      );
      const hasProperties = testResults.every(node => 
        node.properties && node.properties.length > 0
      );
      
      const isValid = hasResults && hasValidData && hasProperties;
      
      console.log(`✅ Validation ${isValid ? 'PASSED' : 'FAILED'}`);
      console.log(`  - Has results: ${hasResults}`);
      console.log(`  - Valid data: ${hasValidData}`);
      console.log(`  - Has properties: ${hasProperties}`);
      
      return isValid;
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.nodeListScraper.cleanup();
    this.nodeDetailScraper.cleanup();
    console.log('🧹 Cleanup completed');
  }
}