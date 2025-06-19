/**
 * Node Detail Scraper
 * 
 * Scrapes individual node documentation pages to extract comprehensive
 * information including operations, parameters, credentials, and examples.
 */

import { BaseScraper } from './base-scraper.js';
import { RawNodeData, NodeReference, RawOperation, RawParameter, RawCredential, RawExample } from './interfaces.js';

/**
 * Scraper for extracting detailed information from individual node pages
 */
export class NodeDetailScraper extends BaseScraper {

  /**
   * Implementation of abstract scrape method
   */
  async scrape(): Promise<RawNodeData[]> {
    throw new Error('Use scrapeNode() or scrapeNodes() instead');
  }

  /**
   * Clean and normalize text content
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-\.]/g, '')
      .trim();
  }

  /**
   * Scrape detailed information for a single node
   */
  async scrapeNode(nodeRef: NodeReference): Promise<RawNodeData> {
    this.log(`Scraping node details: ${nodeRef.name} (${nodeRef.url})`);
    
    try {
      const html = await this.makeRequest(nodeRef.url);
      const rawData = await this.extractNodeData(html, nodeRef);
      
      // Validate the extracted data
      const validation = this.validateData(rawData);
      if (!validation.valid) {
        this.log(`Node data validation failed for ${nodeRef.name}: ${validation.errors.join(', ')}`, 'warn');
      }
      
      this.log(`Successfully scraped ${nodeRef.name} (quality score: ${validation.score})`);
      return rawData;
      
    } catch (error) {
      this.log(`Failed to scrape node ${nodeRef.name}: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Scrape multiple nodes in batch
   */
  async scrapeNodes(nodeRefs: NodeReference[]): Promise<RawNodeData[]> {
    this.log(`Starting batch scraping of ${nodeRefs.length} nodes`);
    
    const results: RawNodeData[] = [];
    const batchSize = 5; // Process 5 nodes concurrently
    
    this.updateProgress(0, nodeRefs.length);
    
    for (let i = 0; i < nodeRefs.length; i += batchSize) {
      const batch = nodeRefs.slice(i, i + batchSize);
      
      // Process batch concurrently
      const batchPromises = batch.map(async (nodeRef) => {
        try {
          return await this.scrapeNode(nodeRef);
        } catch (error) {
          this.log(`Batch scraping failed for ${nodeRef.name}: ${error}`, 'error');
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      // Add successful results
      for (const result of batchResults) {
        if (result) {
          results.push(result);
        }
      }
      
      this.updateProgress(i + batch.length);
      
      // Rate limiting between batches
      if (i + batchSize < nodeRefs.length) {
        await this.delay(this.config.rateLimit * 2);
      }
    }
    
    this.log(`Batch scraping completed. Successfully scraped ${results.length}/${nodeRefs.length} nodes`);
    return results;
  }

  /**
   * Extract comprehensive node data from HTML
   */
  private async extractNodeData(html: string, nodeRef: NodeReference): Promise<RawNodeData> {
    const data: RawNodeData = {
      url: nodeRef.url,
      name: nodeRef.name,
      displayName: nodeRef.displayName,
      description: '',
      category: nodeRef.category,
      nodeType: this.determineNodeType(html, nodeRef),
      rawContent: this.extractTextContent(html),
      scrapedAt: new Date(),
      sourceUrl: nodeRef.url
    };

    // Extract basic information
    data.displayName = this.extractDisplayName(html) || nodeRef.displayName;
    data.description = this.extractDescription(html);
    data.version = this.extractVersion(html);
    
    // Extract node characteristics
    data.isTrigger = this.checkIsTrigger(html);
    data.hasWebhook = this.checkHasWebhook(html);
    data.hasPolling = this.checkHasPolling(html);
    data.isCore = this.checkIsCore(html, nodeRef.name);
    
    // Extract operations and parameters
    data.operations = this.extractOperations(html);
    
    // Extract credentials information
    data.credentials = this.extractCredentials(html);
    
    // Extract examples
    data.examples = this.extractExamples(html);
    
    // Store raw HTML for debugging if needed
    if (process.env.NODE_ENV === 'development') {
      data.htmlContent = html;
    }
    
    return data;
  }

  /**
   * Extract display name from page
   */
  private extractDisplayName(html: string): string | undefined {
    // Try multiple selectors for the page title
    const titleSelectors = [
      'h1.page-title',
      'h1[data-testid="page-title"]',
      'h1',
      '.node-title',
      '.title'
    ];
    
    for (const selector of titleSelectors) {
      const titles = this.parseHtml(html, selector);
      if (titles.length > 0) {
        return this.cleanText(titles[0]);
      }
    }
    
    // Fallback: extract from title tag
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      return this.cleanText(titleMatch[1].replace(/\s*\|\s*n8n.*$/i, ''));
    }
    
    return undefined;
  }

  /**
   * Extract description from page
   */
  private extractDescription(html: string): string {
    // Try multiple strategies to find description
    const descriptionPatterns = [
      // Look for meta description
      /<meta[^>]+name="description"[^>]+content="([^"]*)"[^>]*>/i,
      // Look for description paragraphs
      /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]*)<\/p>/i,
      // Look for first paragraph after title
      /<h1[^>]*>.*?<\/h1>\s*<p[^>]*>([^<]*)<\/p>/is
    ];
    
    for (const pattern of descriptionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const desc = this.cleanText(match[1]);
        if (desc.length > 20) {
          return desc;
        }
      }
    }
    
    // Fallback: look for any early paragraph
    const paragraphs = this.parseHtml(html, 'p');
    for (const p of paragraphs) {
      const cleaned = this.cleanText(p);
      if (cleaned.length > 30 && !cleaned.toLowerCase().includes('navigate')) {
        return cleaned;
      }
    }
    
    return 'No description available';
  }

  /**
   * Extract version information
   */
  private extractVersion(html: string): string | undefined {
    const versionPatterns = [
      /version[:\s]+([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
      /v([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i,
      /<span[^>]*class="[^"]*version[^"]*"[^>]*>([^<]*)<\/span>/i
    ];
    
    for (const pattern of versionPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return undefined;
  }

  /**
   * Determine node type from content
   */
  private determineNodeType(html: string, nodeRef: NodeReference): 'trigger' | 'regular' | 'sub' | 'cluster' {
    const content = html.toLowerCase();
    
    if (content.includes('trigger') || nodeRef.category.toLowerCase().includes('trigger')) {
      return 'trigger';
    }
    
    if (content.includes('cluster') || nodeRef.category.toLowerCase().includes('cluster')) {
      return 'cluster';
    }
    
    if (content.includes('sub-node') || nodeRef.category.toLowerCase().includes('sub')) {
      return 'sub';
    }
    
    return 'regular';
  }

  /**
   * Check if node is a trigger node
   */
  private checkIsTrigger(html: string): boolean {
    const triggerIndicators = [
      'trigger node',
      'starts the workflow',
      'webhook trigger',
      'schedule trigger',
      'manual trigger'
    ];
    
    const content = html.toLowerCase();
    return triggerIndicators.some(indicator => content.includes(indicator));
  }

  /**
   * Check if node supports webhooks
   */
  private checkHasWebhook(html: string): boolean {
    const webhookIndicators = [
      'webhook',
      'http endpoint',
      'incoming request',
      'webhook url'
    ];
    
    const content = html.toLowerCase();
    return webhookIndicators.some(indicator => content.includes(indicator));
  }

  /**
   * Check if node supports polling
   */
  private checkHasPolling(html: string): boolean {
    const pollingIndicators = [
      'polling',
      'check interval',
      'poll for',
      'periodically check'
    ];
    
    const content = html.toLowerCase();
    return pollingIndicators.some(indicator => content.includes(indicator));
  }

  /**
   * Check if node is a core n8n node
   */
  private checkIsCore(html: string, nodeName: string): boolean {
    const coreNodes = [
      'http', 'webhook', 'function', 'set', 'if', 'merge', 'split', 
      'wait', 'manual', 'schedule', 'code', 'switch', 'filter'
    ];
    
    return coreNodes.some(core => nodeName.toLowerCase().includes(core)) ||
           html.toLowerCase().includes('core node') ||
           html.toLowerCase().includes('built-in node');
  }

  /**
   * Extract operations from the page
   */
  private extractOperations(html: string): RawOperation[] {
    const operations: RawOperation[] = [];
    
    try {
      // Look for operations sections
      const operationSections = this.findOperationSections(html);
      
      for (const section of operationSections) {
        const operation = this.parseOperation(section);
        if (operation) {
          operations.push(operation);
        }
      }
      
    } catch (error) {
      this.log(`Error extracting operations: ${error}`, 'warn');
    }
    
    return operations;
  }

  /**
   * Find operation sections in HTML
   */
  private findOperationSections(html: string): string[] {
    const sections: string[] = [];
    
    // Look for headings that indicate operations
    const operationHeadingRegex = /<h[2-6][^>]*>([^<]*(?:operation|action|method)[^<]*)<\/h[2-6]>(.*?)(?=<h[2-6]|$)/gis;
    let match;
    
    while ((match = operationHeadingRegex.exec(html)) !== null) {
      sections.push(match[0]);
    }
    
    return sections;
  }

  /**
   * Parse an individual operation
   */
  private parseOperation(sectionHtml: string): RawOperation | null {
    try {
      // Extract operation name
      const nameMatch = sectionHtml.match(/<h[2-6][^>]*>([^<]*)<\/h[2-6]>/i);
      if (!nameMatch) return null;
      
      const name = this.cleanText(nameMatch[1]);
      
      // Extract parameters from this section
      const parameters = this.extractParametersFromSection(sectionHtml);
      
      return {
        name: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        displayName: name,
        description: this.extractOperationDescription(sectionHtml),
        parameters
      };
      
    } catch (error) {
      this.log(`Error parsing operation: ${error}`, 'warn');
      return null;
    }
  }

  /**
   * Extract operation description
   */
  private extractOperationDescription(sectionHtml: string): string {
    // Look for the first paragraph after the heading
    const descMatch = sectionHtml.match(/<h[2-6][^>]*>.*?<\/h[2-6]>\s*<p[^>]*>([^<]*)<\/p>/is);
    if (descMatch) {
      return this.cleanText(descMatch[1]);
    }
    
    return 'No description available';
  }

  /**
   * Extract parameters from a section
   */
  private extractParametersFromSection(sectionHtml: string): RawParameter[] {
    const parameters: RawParameter[] = [];
    
    try {
      // Look for parameter tables or lists
      const tableRows = this.parseHtml(sectionHtml, 'tr');
      
      for (const row of tableRows) {
        const parameter = this.parseParameterRow(row);
        if (parameter) {
          parameters.push(parameter);
        }
      }
      
    } catch (error) {
      this.log(`Error extracting parameters: ${error}`, 'warn');
    }
    
    return parameters;
  }

  /**
   * Parse a parameter from a table row
   */
  private parseParameterRow(rowHtml: string): RawParameter | null {
    try {
      const cells = this.parseHtml(rowHtml, 'td');
      
      if (cells.length >= 2) {
        return {
          name: this.cleanText(cells[0]).toLowerCase().replace(/[^a-z0-9]/g, ''),
          displayName: this.cleanText(cells[0]),
          type: cells.length > 2 ? this.cleanText(cells[1]) : 'string',
          required: cells.length > 3 ? this.cleanText(cells[3]).toLowerCase().includes('yes') : false,
          description: cells.length > 1 ? this.cleanText(cells[cells.length - 1]) : 'No description'
        };
      }
      
    } catch (error) {
      this.log(`Error parsing parameter row: ${error}`, 'warn');
    }
    
    return null;
  }

  /**
   * Extract credentials information
   */
  private extractCredentials(html: string): RawCredential[] {
    const credentials: RawCredential[] = [];
    
    try {
      // Look for authentication/credentials sections
      const authSections = this.findAuthSections(html);
      
      for (const section of authSections) {
        const cred = this.parseCredential(section);
        if (cred) {
          credentials.push(cred);
        }
      }
      
    } catch (error) {
      this.log(`Error extracting credentials: ${error}`, 'warn');
    }
    
    return credentials;
  }

  /**
   * Find authentication sections in HTML
   */
  private findAuthSections(html: string): string[] {
    const authKeywords = ['credential', 'authentication', 'auth', 'api key', 'token'];
    const sections: string[] = [];
    
    for (const keyword of authKeywords) {
      const regex = new RegExp(`<h[2-6][^>]*>([^<]*${keyword}[^<]*)<\/h[2-6]>(.*?)(?=<h[2-6]|$)`, 'gis');
      let match;
      
      while ((match = regex.exec(html)) !== null) {
        sections.push(match[0]);
      }
    }
    
    return sections;
  }

  /**
   * Parse credential information
   */
  private parseCredential(sectionHtml: string): RawCredential | null {
    try {
      const nameMatch = sectionHtml.match(/<h[2-6][^>]*>([^<]*)<\/h[2-6]>/i);
      if (!nameMatch) return null;
      
      const name = this.cleanText(nameMatch[1]);
      
      return {
        name: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        displayName: name,
        type: this.extractCredentialType(sectionHtml),
        required: sectionHtml.toLowerCase().includes('required'),
        description: this.extractCredentialDescription(sectionHtml)
      };
      
    } catch (error) {
      this.log(`Error parsing credential: ${error}`, 'warn');
      return null;
    }
  }

  /**
   * Extract credential type
   */
  private extractCredentialType(html: string): string {
    const typeKeywords = ['oauth', 'api key', 'token', 'basic auth', 'bearer'];
    const content = html.toLowerCase();
    
    for (const type of typeKeywords) {
      if (content.includes(type)) {
        return type;
      }
    }
    
    return 'api';
  }

  /**
   * Extract credential description
   */
  private extractCredentialDescription(sectionHtml: string): string {
    const descMatch = sectionHtml.match(/<h[2-6][^>]*>.*?<\/h[2-6]>\s*<p[^>]*>([^<]*)<\/p>/is);
    if (descMatch) {
      return this.cleanText(descMatch[1]);
    }
    
    return 'Authentication required';
  }

  /**
   * Extract examples from the page
   */
  private extractExamples(html: string): RawExample[] {
    const examples: RawExample[] = [];
    
    try {
      // Look for example sections
      const exampleSections = this.findExampleSections(html);
      
      for (const section of exampleSections) {
        const example = this.parseExample(section);
        if (example) {
          examples.push(example);
        }
      }
      
    } catch (error) {
      this.log(`Error extracting examples: ${error}`, 'warn');
    }
    
    return examples;
  }

  /**
   * Find example sections in HTML
   */
  private findExampleSections(html: string): string[] {
    const exampleKeywords = ['example', 'usage', 'sample', 'workflow'];
    const sections: string[] = [];
    
    for (const keyword of exampleKeywords) {
      const regex = new RegExp(`<h[2-6][^>]*>([^<]*${keyword}[^<]*)<\/h[2-6]>(.*?)(?=<h[2-6]|$)`, 'gis');
      let match;
      
      while ((match = regex.exec(html)) !== null) {
        sections.push(match[0]);
      }
    }
    
    return sections;
  }

  /**
   * Parse an example
   */
  private parseExample(sectionHtml: string): RawExample | null {
    try {
      const nameMatch = sectionHtml.match(/<h[2-6][^>]*>([^<]*)<\/h[2-6]>/i);
      if (!nameMatch) return null;
      
      const title = this.cleanText(nameMatch[1]);
      
      // Extract code blocks
      const codeBlocks = this.parseHtml(sectionHtml, 'pre');
      const codeSnippet = codeBlocks.length > 0 ? codeBlocks[0] : undefined;
      
      return {
        title,
        description: this.extractExampleDescription(sectionHtml),
        codeSnippet
      };
      
    } catch (error) {
      this.log(`Error parsing example: ${error}`, 'warn');
      return null;
    }
  }

  /**
   * Extract example description
   */
  private extractExampleDescription(sectionHtml: string): string {
    const descMatch = sectionHtml.match(/<h[2-6][^>]*>.*?<\/h[2-6]>\s*<p[^>]*>([^<]*)<\/p>/is);
    if (descMatch) {
      return this.cleanText(descMatch[1]);
    }
    
    return 'Example usage';
  }

  /**
   * Get scraping statistics
   */
  public getDetailedStats(): any {
    const baseStats = this.getStats();
    
    return {
      ...baseStats,
      averageProcessingTime: baseStats.averageTimePerRequest,
      dataQualityScore: this.calculateAverageQualityScore(),
      extractionSuccess: {
        operations: this.progress.completed * 0.8, // Estimate
        credentials: this.progress.completed * 0.6,
        examples: this.progress.completed * 0.4
      }
    };
  }

  /**
   * Calculate average quality score across scraped nodes
   */
  private calculateAverageQualityScore(): number {
    // This would track quality scores in a real implementation
    return 85; // Placeholder
  }
}