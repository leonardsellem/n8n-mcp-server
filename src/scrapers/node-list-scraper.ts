/**
 * Node List Scraper
 * 
 * Scrapes the main n8n documentation pages to extract comprehensive
 * lists of available nodes across all categories.
 */

import { BaseScraper } from './base-scraper.js';
import { NodeReference } from './interfaces.js';
import { NODE_CATEGORIES } from './config.js';

/**
 * Scraper for extracting node lists from n8n documentation
 */
export class NodeListScraper extends BaseScraper {
  
  /**
   * Main scraping method - discovers all available nodes
   */
  async scrape(): Promise<NodeReference[]> {
    this.log('Starting node list scraping...');
    
    const allNodeRefs: NodeReference[] = [];
    
    try {
      // Start with the main integrations page
      const mainPageNodes = await this.scrapeMainPage();
      allNodeRefs.push(...mainPageNodes);
      
      // Scrape each category page
      for (const [categoryKey, categoryInfo] of Object.entries(NODE_CATEGORIES)) {
        try {
          this.log(`Scraping category: ${categoryInfo.name}`);
          const categoryNodes = await this.scrapeCategoryPage(categoryKey, categoryInfo);
          allNodeRefs.push(...categoryNodes);
          
          this.updateProgress(allNodeRefs.length);
          
        } catch (error) {
          this.log(`Failed to scrape category ${categoryInfo.name}: ${error}`, 'error');
        }
      }
      
      // Remove duplicates and sort by priority
      const uniqueNodes = this.deduplicateNodes(allNodeRefs);
      const sortedNodes = this.sortNodesByPriority(uniqueNodes);
      
      this.log(`Node list scraping completed. Found ${sortedNodes.length} unique nodes.`);
      return sortedNodes;
      
    } catch (error) {
      this.log(`Node list scraping failed: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Scrape the main integrations page
   */
  private async scrapeMainPage(): Promise<NodeReference[]> {
    const url = `${this.config.baseUrl}`;
    this.log(`Scraping main page: ${url}`);
    
    try {
      const html = await this.makeRequest(url);
      return this.extractNodesFromHtml(html, 'Main', 'main');
      
    } catch (error) {
      this.log(`Failed to scrape main page: ${error}`, 'warn');
      return [];
    }
  }

  /**
   * Scrape a specific category page
   */
  private async scrapeCategoryPage(categoryKey: string, categoryInfo: any): Promise<NodeReference[]> {
    const url = `${this.config.baseUrl}${categoryInfo.path}`;
    this.log(`Scraping category page: ${url}`);
    
    try {
      const html = await this.makeRequest(url);
      return this.extractNodesFromHtml(html, categoryInfo.name, categoryKey);
      
    } catch (error) {
      this.log(`Failed to scrape category ${categoryInfo.name}: ${error}`, 'warn');
      return [];
    }
  }

  /**
   * Extract node references from HTML content
   */
  private extractNodesFromHtml(html: string, category: string, categoryKey: string): NodeReference[] {
    const nodes: NodeReference[] = [];
    
    try {
      // Extract links that look like node documentation pages
      const nodeLinks = this.extractNodeLinks(html);
      
      for (const link of nodeLinks) {
        const nodeRef = this.createNodeReference(link, category, categoryKey);
        if (nodeRef) {
          nodes.push(nodeRef);
        }
      }
      
      this.log(`Extracted ${nodes.length} nodes from ${category}`);
      
    } catch (error) {
      this.log(`Error extracting nodes from ${category}: ${error}`, 'warn');
    }
    
    return nodes;
  }

  /**
   * Extract node links from HTML using multiple strategies
   */
  private extractNodeLinks(html: string): Array<{url: string, text: string}> {
    const links: Array<{url: string, text: string}> = [];
    
    // Strategy 1: Look for direct integration links
    const integrationLinkRegex = /href="([^"]*\/integrations\/builtin\/[^"]*)"[^>]*>([^<]*)</gi;
    let match;
    
    while ((match = integrationLinkRegex.exec(html)) !== null) {
      const url = this.normalizeUrl(match[1]);
      const text = this.cleanText(match[2]);
      
      if (this.isValidNodeUrl(url) && text) {
        links.push({ url, text });
      }
    }
    
    // Strategy 2: Look for anchor tags with node-like paths
    const anchorRegex = /<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>/gi;
    
    while ((match = anchorRegex.exec(html)) !== null) {
      const url = this.normalizeUrl(match[1]);
      const text = this.cleanText(match[2]);
      
      if (this.isValidNodeUrl(url) && text && !links.some(l => l.url === url)) {
        links.push({ url, text });
      }
    }
    
    // Strategy 3: Look for list items that might contain node links
    const listItemRegex = /<li[^>]*>.*?<a[^>]+href="([^"]*)"[^>]*>([^<]*)<\/a>.*?<\/li>/gi;
    
    while ((match = listItemRegex.exec(html)) !== null) {
      const url = this.normalizeUrl(match[1]);
      const text = this.cleanText(match[2]);
      
      if (this.isValidNodeUrl(url) && text && !links.some(l => l.url === url)) {
        links.push({ url, text });
      }
    }
    
    return links;
  }

  /**
   * Check if a URL is a valid node documentation URL
   */
  private isValidNodeUrl(url: string): boolean {
    // Must be an integrations URL
    if (!url.includes('/integrations/builtin/')) {
      return false;
    }
    
    // Should not be a category index page
    if (url.endsWith('/') && url.split('/').length <= 6) {
      return false;
    }
    
    // Should not be the main integrations page
    if (url.endsWith('/integrations/builtin/') || url.endsWith('/integrations/builtin')) {
      return false;
    }
    
    // Should have a specific node name
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
    
    return Boolean(lastPart && lastPart.length > 1 && !['index', 'builtin', 'integrations'].includes(lastPart));
  }

  /**
   * Normalize URL to absolute form
   */
  private normalizeUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.startsWith('/')) {
      return `https://docs.n8n.io${url}`;
    }
    
    return `${this.config.baseUrl}${url}`;
  }

  /**
   * Clean and normalize text content
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.]/g, '')
      .trim();
  }

  /**
   * Create a NodeReference from a link
   */
  private createNodeReference(link: {url: string, text: string}, category: string, categoryKey: string): NodeReference | null {
    try {
      const url = link.url;
      const displayName = link.text;
      
      // Extract node name from URL
      const urlParts = url.split('/');
      let nodeName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      
      // Clean up node name
      nodeName = nodeName.replace(/[^a-zA-Z0-9\-_]/g, '');
      
      if (!nodeName || nodeName.length < 2) {
        return null;
      }
      
      // Determine priority based on category and node type
      let priority = NODE_CATEGORIES[categoryKey as keyof typeof NODE_CATEGORIES]?.priority || 5;
      
      // Boost priority for core nodes
      if (this.isCoreNode(nodeName, displayName)) {
        priority = 1;
      }
      
      // Boost priority for commonly used nodes
      if (this.isCommonNode(nodeName, displayName)) {
        priority = Math.max(1, priority - 1) as 1 | 2 | 3 | 4 | 5;
      }
      
      return {
        name: nodeName,
        displayName: displayName || nodeName,
        url,
        category,
        priority
      };
      
    } catch (error) {
      this.log(`Error creating node reference: ${error}`, 'warn');
      return null;
    }
  }

  /**
   * Check if this is a core n8n node
   */
  private isCoreNode(name: string, displayName: string): boolean {
    const coreKeywords = [
      'http', 'webhook', 'function', 'set', 'if', 'merge', 'split', 'wait',
      'trigger', 'manual', 'schedule', 'code', 'switch', 'filter'
    ];
    
    const searchText = `${name} ${displayName}`.toLowerCase();
    return coreKeywords.some(keyword => searchText.includes(keyword));
  }

  /**
   * Check if this is a commonly used node
   */
  private isCommonNode(name: string, displayName: string): boolean {
    const commonKeywords = [
      'gmail', 'slack', 'discord', 'google', 'microsoft', 'twitter',
      'facebook', 'linkedin', 'telegram', 'trello', 'notion', 'airtable'
    ];
    
    const searchText = `${name} ${displayName}`.toLowerCase();
    return commonKeywords.some(keyword => searchText.includes(keyword));
  }

  /**
   * Remove duplicate nodes from the list
   */
  private deduplicateNodes(nodes: NodeReference[]): NodeReference[] {
    const seen = new Set<string>();
    const unique: NodeReference[] = [];
    
    for (const node of nodes) {
      const key = `${node.name}:${node.url}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(node);
      }
    }
    
    return unique;
  }

  /**
   * Sort nodes by priority and category
   */
  private sortNodesByPriority(nodes: NodeReference[]): NodeReference[] {
    return nodes.sort((a, b) => {
      // First sort by priority (lower number = higher priority)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      
      // Then sort by category
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      
      // Finally sort by name
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Get nodes filtered by category
   */
  public async getNodesByCategory(category: string): Promise<NodeReference[]> {
    const allNodes = await this.scrape();
    return allNodes.filter(node => node.category === category);
  }

  /**
   * Get high-priority nodes (core and commonly used)
   */
  public async getHighPriorityNodes(): Promise<NodeReference[]> {
    const allNodes = await this.scrape();
    return allNodes.filter(node => node.priority <= 2);
  }

  /**
   * Get statistics about discovered nodes
   */
  public async getDiscoveryStats(): Promise<any> {
    const allNodes = await this.scrape();
    
    const categoryStats: Record<string, number> = {};
    const priorityStats: Record<number, number> = {};
    
    for (const node of allNodes) {
      categoryStats[node.category] = (categoryStats[node.category] || 0) + 1;
      priorityStats[node.priority] = (priorityStats[node.priority] || 0) + 1;
    }
    
    return {
      total: allNodes.length,
      categories: categoryStats,
      priorities: priorityStats,
      highPriority: allNodes.filter(n => n.priority <= 2).length,
      coreNodes: allNodes.filter(n => n.priority === 1).length
    };
  }
}
