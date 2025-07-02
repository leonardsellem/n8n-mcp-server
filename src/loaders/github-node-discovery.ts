import axios from 'axios';
import { createHash } from 'crypto';
import { NodeMetadata, NodeCategory } from '../types/index.js';
import { NodeCacheService } from '../database/node-cache.js';

export interface GitHubNodeFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubNodeFile[];
  truncated: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
    };
    message: string;
  };
}

export class GitHubNodeDiscovery {
  private cache: NodeCacheService;
  private readonly GITHUB_API_BASE = 'https://api.github.com/repos/n8n-io/n8n';
  private readonly NODES_PATH = 'packages/nodes-base/nodes';
  private readonly CREDENTIALS_PATH = 'packages/nodes-base/credentials';
  private readonly RATE_LIMIT_DELAY = 1000; // 1 second between requests
  private lastRequestTime = 0;
  private credentialsCache: Map<string, any> = new Map();

  constructor() {
    this.cache = new NodeCacheService();
  }

  /**
   * Rate limit API requests to respect GitHub's limits
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise(resolve => 
        setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Get the latest commit SHA from the master branch
   */
  async getLatestCommitSha(): Promise<string> {
    await this.rateLimit();
    
    try {
      const response = await axios.get(`${this.GITHUB_API_BASE}/commits/master`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'n8n-mcp-server'
        }
      });
      
      return response.data.sha;
    } catch (error) {
      console.error('Failed to get latest commit SHA:', error);
      throw new Error('Unable to fetch latest n8n repository state');
    }
  }

  /**
   * Check if we need to update based on commit SHA
   */
  async needsUpdate(): Promise<boolean> {
    try {
      const latestSha = await this.getLatestCommitSha();
      const cachedSha = await this.cache.getCommitSha();
      
      console.error(`Latest SHA: ${latestSha}, Cached SHA: ${cachedSha}`);
      return latestSha !== cachedSha;
    } catch (error) {
      console.error('Error checking for updates:', error);
      
      // If we can't check for updates but have cached data, prefer cache
      const cachedNodes = await this.cache.getAllNodes();
      if (cachedNodes.length > 0) {
        console.error('Using cache since GitHub API is unavailable');
        return false; // Don't update if we have cache and can't check
      }
      
      return true; // Only force update if no cache exists
    }
  }

  /**
   * Discover all nodes from the GitHub repository
   */
  async discoverNodes(forceUpdate = false): Promise<NodeMetadata[]> {
    if (!forceUpdate && !(await this.needsUpdate())) {
      console.error('Using cached nodes - no update needed');
      return await this.cache.getAllNodes();
    }

    console.error('🔄 Discovering nodes from GitHub...');
    
    try {
      const latestSha = await this.getLatestCommitSha();
      const nodes = await this.fetchAllNodes();
      
      // Cache the results
      await this.cache.saveNodes(nodes, latestSha);
      
      console.error(`✅ Discovered ${nodes.length} nodes from GitHub`);
      return nodes;
    } catch (error) {
      console.error('Failed to discover nodes from GitHub:', error);
      
      // Fall back to cached data if available
      const cachedNodes = await this.cache.getAllNodes();
      if (cachedNodes.length > 0) {
        console.error(`⚠️ Using ${cachedNodes.length} cached nodes as fallback`);
        return cachedNodes;
      }
      
      throw new Error('Unable to discover nodes and no cached data available');
    }
  }

  /**
   * Fetch all nodes from the GitHub repository
   */
  private async fetchAllNodes(): Promise<NodeMetadata[]> {
    const nodes: NodeMetadata[] = [];
    
    // First, load all credentials to match against nodes
    console.error('🔐 Loading credentials...');
    await this.loadCredentials();
    
    // Get the directory tree for the nodes folder
    const nodeDirectories = await this.getNodeDirectories();
    
    console.error(`Found ${nodeDirectories.length} node directories`);
    
    for (const directory of nodeDirectories) {
      try {
        const nodeMetadata = await this.parseNodeDirectory(directory);
        if (nodeMetadata) {
          nodes.push(nodeMetadata);
        }
      } catch (error) {
        console.error(`Failed to parse node directory ${directory.name}:`, error);
      }
    }
    
    return nodes;
  }

  /**
   * Load all credentials from the credentials directory
   */
  private async loadCredentials(): Promise<void> {
    await this.rateLimit();
    
    try {
      const response = await axios.get(
        `${this.GITHUB_API_BASE}/contents/${this.CREDENTIALS_PATH}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'n8n-mcp-server'
          }
        }
      );
      
      const credentialFiles = response.data.filter((item: GitHubNodeFile) => 
        item.type === 'file' && item.name.endsWith('.credentials.ts')
      );
      
      console.error(`Found ${credentialFiles.length} credential files`);
      
      for (const credFile of credentialFiles) {
        try {
          const content = await this.fetchFileContent(credFile.download_url);
          const credentialName = credFile.name.replace('.credentials.ts', '');
          this.credentialsCache.set(credentialName, {
            name: credentialName,
            displayName: this.extractCredentialDisplayName(content),
            description: this.extractCredentialDescription(content),
            properties: this.extractCredentialProperties(content),
            sourceUrl: `https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/credentials/${credFile.name}`
          });
        } catch (error) {
          console.error(`Failed to parse credential ${credFile.name}:`, error);
        }
      }
      
      console.error(`✅ Loaded ${this.credentialsCache.size} credentials`);
    } catch (error) {
      console.error('Failed to load credentials:', error);
    }
  }

  /**
   * Extract credential display name
   */
  private extractCredentialDisplayName(content: string): string {
    const match = content.match(/displayName:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : 'Unknown Credential';
  }

  /**
   * Extract credential description
   */
  private extractCredentialDescription(content: string): string {
    const match = content.match(/description:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : 'No description available';
  }

  /**
   * Extract credential properties
   */
  private extractCredentialProperties(content: string): Record<string, any> {
    const properties: Record<string, any> = {};
    
    // Look for property definitions in the properties array
    const propertiesMatch = content.match(/properties:\s*\[([\s\S]*?)\]/);
    if (propertiesMatch) {
      const propertiesContent = propertiesMatch[1];
      const nameMatches = propertiesContent.matchAll(/name:\s*['"`]([^'"`]+)['"`]/g);
      
      for (const match of nameMatches) {
        properties[match[1]] = { type: 'string', required: true };
      }
    }
    
    return properties;
  }

  /**
   * Get all node directories from the nodes folder
   */
  private async getNodeDirectories(): Promise<GitHubNodeFile[]> {
    await this.rateLimit();
    
    try {
      const response = await axios.get(
        `${this.GITHUB_API_BASE}/contents/${this.NODES_PATH}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'n8n-mcp-server'
          }
        }
      );
      
      return response.data.filter((item: GitHubNodeFile) => item.type === 'dir');
    } catch (error) {
      console.error('Failed to get node directories:', error);
      throw new Error('Unable to fetch node directories from GitHub');
    }
  }

  /**
   * Parse a node directory to extract metadata
   */
  private async parseNodeDirectory(directory: GitHubNodeFile): Promise<NodeMetadata | null> {
    await this.rateLimit();
    
    try {
      // Get the contents of the node directory
      const response = await axios.get(
        `${this.GITHUB_API_BASE}/contents/${directory.path}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'n8n-mcp-server'
          }
        }
      );
      
      const files = response.data as GitHubNodeFile[];
      
      // Find the main .node.ts file
      const nodeFile = files.find(file => 
        file.name.endsWith('.node.ts') && !file.name.includes('.test.')
      );
      
      if (!nodeFile) {
        console.warn(`No .node.ts file found in ${directory.name}`);
        return null;
      }
      
      // Parse the node file content
      const nodeContent = await this.fetchFileContent(nodeFile.download_url);
      return this.parseNodeContent(nodeContent, directory.name, nodeFile.name);
      
    } catch (error) {
      console.error(`Failed to parse directory ${directory.name}:`, error);
      return null;
    }
  }

  /**
   * Fetch file content from GitHub
   */
  private async fetchFileContent(downloadUrl: string): Promise<string> {
    await this.rateLimit();
    
    try {
      const response = await axios.get(downloadUrl, {
        headers: {
          'User-Agent': 'n8n-mcp-server'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch file content:', error);
      throw new Error('Unable to fetch node file content');
    }
  }

  /**
   * Parse node content to extract metadata
   */
  private parseNodeContent(content: string, directoryName: string, fileName: string): NodeMetadata {
    const nodeName = directoryName;
    const nodeType = this.extractNodeType(content);
    const category = this.determineCategory(directoryName, content);
    const description = this.extractDescription(content);
    const credentials = this.extractCredentials(content);
    const properties = this.extractProperties(content);
    const operations = this.extractOperations(content);
    
    return {
      name: nodeName,
      displayName: this.extractDisplayName(content) || nodeName,
      type: nodeType,
      category,
      description,
      credentials,
      properties,
      operations,
      version: this.extractVersion(content),
      icon: this.extractIcon(content),
      documentationUrl: this.generateDocumentationUrl(nodeName),
      sourceUrl: `https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes/${directoryName}`,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Extract node type from content
   */
  private extractNodeType(content: string): string {
    // Look for extends patterns
    if (content.includes('implements INodeType')) {
      return 'regular';
    }
    if (content.includes('implements ITriggerNode')) {
      return 'trigger';
    }
    if (content.includes('implements IWebhookNode')) {
      return 'webhook';
    }
    return 'regular';
  }

  /**
   * Determine category based on directory name and content analysis
   */
  private determineCategory(directoryName: string, content: string): NodeCategory {
    const name = directoryName.toLowerCase();
    
    // Core nodes
    const coreNodes = [
      'code', 'function', 'functionitem', 'http', 'httprequest', 'webhook',
      'set', 'edit', 'filter', 'if', 'switch', 'merge', 'sort', 'split',
      'wait', 'schedule', 'manual', 'cron', 'datetime', 'crypto', 'json',
      'xml', 'html', 'compression', 'ssh', 'ftp', 'aggregate', 'limit',
      'removeduplicates', 'summarize', 'itemlists', 'renamekeys', 'stopanderror'
    ];
    
    if (coreNodes.some(core => name.includes(core))) {
      return 'Core';
    }
    
    // Trigger nodes
    if (content.includes('implements ITriggerNode') || 
        name.includes('trigger') || 
        name.includes('webhook')) {
      return 'Trigger';
    }
    
    // Database nodes
    const dbNodes = ['mysql', 'postgres', 'mongodb', 'redis', 'sqlite', 'influxdb'];
    if (dbNodes.some(db => name.includes(db))) {
      return 'Data & Storage';
    }
    
    // Cloud/Storage nodes
    const cloudNodes = ['aws', 'google', 'azure', 'dropbox', 'box', 's3', 'drive'];
    if (cloudNodes.some(cloud => name.includes(cloud))) {
      return 'Data & Storage';
    }
    
    // Communication nodes
    const commNodes = ['slack', 'discord', 'telegram', 'teams', 'email', 'gmail', 'outlook'];
    if (commNodes.some(comm => name.includes(comm))) {
      return 'Communication';
    }
    
    // Default to Action
    return 'Action';
  }

  /**
   * Extract various metadata from node content
   */
  private extractDisplayName(content: string): string | undefined {
    const match = content.match(/displayName:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : undefined;
  }

  private extractDescription(content: string): string {
    const match = content.match(/description:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : 'No description available';
  }

  private extractVersion(content: string): number {
    const match = content.match(/version:\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }

  private extractIcon(content: string): string | undefined {
    const match = content.match(/icon:\s*['"`]([^'"`]+)['"`]/);
    return match ? match[1] : undefined;
  }

  private extractCredentials(content: string): Array<{name: string; required?: boolean}> {
    const credentials: Array<{name: string; required?: boolean}> = [];
    
    // Look for credential references in the auth property
    const authMatch = content.match(/auth:\s*[\s\S]*?['"`]([^'"`]*[Cc]redential[^'"`]*)['"`]/);
    if (authMatch) {
      credentials.push({ name: authMatch[1], required: true });
    }
    
    // Look for credential references in the credentials array
    const credentialsArrayMatch = content.match(/credentials:\s*\[([\s\S]*?)\]/);
    if (credentialsArrayMatch) {
      const credContent = credentialsArrayMatch[1];
      const credMatches = credContent.matchAll(/name:\s*['"`]([^'"`]+)['"`]/g);
      for (const match of credMatches) {
        credentials.push({ name: match[1], required: true });
      }
    }
    
    // Look for direct credential name patterns
    const directMatches = content.matchAll(/['"`]([^'"`]*[Cc]redential[^'"`]*)['"`]/g);
    for (const match of directMatches) {
      const credName = match[1];
      // Only add if it exists in our credentials cache
      if (this.credentialsCache.has(credName) || this.credentialsCache.has(credName.replace('Credential', ''))) {
        credentials.push({ name: credName, required: true });
      }
    }
    
    // Remove duplicates by name
    const unique = credentials.filter((cred, index, self) => 
      index === self.findIndex(c => c.name === cred.name)
    );
    
    return unique;
  }

  private extractProperties(content: string): Record<string, any> {
    const properties: Record<string, any> = {};
    
    // Extract basic properties (simplified for now)
    const propertyMatches = content.matchAll(/name:\s*['"`]([^'"`]+)['"`]/g);
    for (const match of propertyMatches) {
      properties[match[1]] = { type: 'string' };
    }
    
    return properties;
  }

  private extractOperations(content: string): string[] {
    const operations: string[] = [];
    const matches = content.matchAll(/value:\s*['"`]([^'"`]+)['"`].*?name:\s*['"`]([^'"`]+)['"`]/gs);
    for (const match of matches) {
      operations.push(match[2]);
    }
    return [...new Set(operations)]; // Remove duplicates
  }

  private generateDocumentationUrl(nodeName: string): string {
    const kebabCase = nodeName.toLowerCase().replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    return `https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.${kebabCase}/`;
  }

  /**
   * Get nodes by category
   */
  async getNodesByCategory(category: NodeCategory): Promise<NodeMetadata[]> {
    const allNodes = await this.discoverNodes();
    return allNodes.filter(node => node.category === category);
  }

  /**
   * Search nodes by name or description
   */
  async searchNodes(query: string): Promise<NodeMetadata[]> {
    const allNodes = await this.discoverNodes();
    const lowerQuery = query.toLowerCase();
    
    return allNodes.filter(node => 
      node.name.toLowerCase().includes(lowerQuery) ||
      node.displayName.toLowerCase().includes(lowerQuery) ||
      node.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get a specific node by name
   */
  async getNode(nodeName: string): Promise<NodeMetadata | null> {
    const allNodes = await this.discoverNodes();
    return allNodes.find(node => 
      node.name.toLowerCase() === nodeName.toLowerCase() ||
      node.displayName.toLowerCase() === nodeName.toLowerCase()
    ) || null;
  }

  /**
   * Get detailed information about a specific node
   */
  async getNodeDetails(nodeName: string): Promise<NodeMetadata | null> {
    return await this.getNode(nodeName);
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalNodes: number;
    categoryCounts: Record<string, number>;
    lastSync: string | null;
    commitSha: string | null;
  }> {
    return await this.cache.getCacheStats();
  }

  /**
   * Get all available node categories
   */
  async getAvailableCategories(): Promise<string[]> {
    const allNodes = await this.discoverNodes();
    const categories = new Set<string>();
    
    for (const node of allNodes) {
      categories.add(node.category);
    }
    
    return Array.from(categories).sort();
  }

  /**
   * Force refresh all nodes from GitHub
   */
  async forceRefresh(): Promise<NodeMetadata[]> {
    console.error('🔄 Force refreshing nodes from GitHub...');
    return await this.discoverNodes(true);
  }
}
