import { Octokit } from '@octokit/rest';
import * as ts from 'typescript';

export interface RemoteNodeFile {
  path: string;
  name: string;
  content: string;
  sha: string;
  package: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

export interface ParsedNodeMetadata {
  style: 'declarative' | 'programmatic';
  nodeType: string;
  displayName: string;
  description?: string;
  category: string;
  properties: any[];
  credentials: any[];
  isAITool: boolean;
  isTrigger: boolean;
  isWebhook: boolean;
  operations: any[];
  version: string;
  isVersioned: boolean;
  packageName: string;
  documentation?: string;
}

export class EnhancedRemoteNodeDiscovery {
  private octokit: Octokit;
  private readonly REPO_OWNER = 'n8n-io';
  private readonly REPO_NAME = 'n8n';
  private readonly BRANCH = 'master';
  
  // Node source paths in n8n repository
  private readonly NODE_PATHS = [
    'packages/nodes-base/nodes',
    'packages/@n8n/n8n-nodes-langchain/nodes'
  ];
  
  private readonly CREDENTIALS_PATHS = [
    'packages/nodes-base/credentials',
    'packages/@n8n/n8n-nodes-langchain/credentials'
  ];

  constructor(githubToken?: string) {
    this.octokit = new Octokit({
      auth: githubToken,
      request: {
        timeout: 30000,
        retries: 3,
      }
    });
  }

  /**
   * Discover all node files from n8n repository - EFFICIENT BATCH METHOD
   */
  async discoverAllNodes(): Promise<RemoteNodeFile[]> {
    console.log('🔍 Discovering nodes from n8n repository...');
    const allNodes: RemoteNodeFile[] = [];

    for (const nodePath of this.NODE_PATHS) {
      try {
        console.log(`📂 Scanning path: ${nodePath}`);
        const nodes = await this.discoverNodesInPath(nodePath);
        allNodes.push(...nodes);
        console.log(`✅ Found ${nodes.length} nodes in ${nodePath}`);
      } catch (error) {
        console.error(`❌ Failed to scan ${nodePath}:`, error);
        // Don't throw - continue with other paths
      }
    }

    console.log(`🎉 Total nodes discovered: ${allNodes.length}`);
    return allNodes;
  }

  /**
   * Discover credential files from n8n repository
   */
  async discoverAllCredentials(): Promise<RemoteNodeFile[]> {
    console.log('🔐 Discovering credentials from n8n repository...');
    const allCredentials: RemoteNodeFile[] = [];

    for (const credPath of this.CREDENTIALS_PATHS) {
      try {
        console.log(`📂 Scanning credentials path: ${credPath}`);
        const credentials = await this.discoverCredentialsInPath(credPath);
        allCredentials.push(...credentials);
        console.log(`✅ Found ${credentials.length} credentials in ${credPath}`);
      } catch (error) {
        console.error(`❌ Failed to scan credentials ${credPath}:`, error);
        // Don't throw - continue with other paths
      }
    }

    console.log(`🎉 Total credentials discovered: ${allCredentials.length}`);
    return allCredentials;
  }

  /**
   * Get the latest commit SHA for cache invalidation
   */
  async getLatestCommitSha(): Promise<string> {
    try {
      const { data } = await this.octokit.rest.repos.getBranch({
        owner: this.REPO_OWNER,
        repo: this.REPO_NAME,
        branch: this.BRANCH
      });
      return data.commit.sha;
    } catch (error) {
      console.error('Failed to get latest commit SHA:', error);
      throw new Error('Failed to fetch repository information');
    }
  }

  /**
   * Check if repository has been updated since last cache
   */
  async hasRepositoryChanged(lastKnownSha?: string): Promise<boolean> {
    if (!lastKnownSha) return true;
    
    const currentSha = await this.getLatestCommitSha();
    return currentSha !== lastKnownSha;
  }

  private async discoverNodesInPath(basePath: string): Promise<RemoteNodeFile[]> {
    const nodes: RemoteNodeFile[] = [];
    
    try {
      // Get tree structure for the path - SINGLE API CALL
      const tree = await this.getDirectoryTree(basePath);
      
      // Find all .node.ts files - LOCAL FILTERING (NO API CALLS)
      const nodeFiles = tree.filter(item => 
        item.type === 'blob' && 
        item.path.endsWith('.node.ts')
      );

      console.log(`📄 Found ${nodeFiles.length} .node.ts files in ${basePath}`);

      // Fetch content for each node file - BATCH PROCESSING
      const batchSize = 10;
      for (let i = 0; i < nodeFiles.length; i += batchSize) {
        const batch = nodeFiles.slice(i, i + batchSize);
        
        const promises = batch.map(async (file) => {
          try {
            const content = await this.getFileContent(file.sha);
            const packageName = this.extractPackageName(basePath);
            const nodeName = this.extractNodeName(file.path);
            
            return {
              path: file.path,
              name: nodeName,
              content,
              sha: file.sha,
              package: packageName
            };
          } catch (error) {
            console.error(`  ❌ Failed to fetch ${file.path}:`, error);
            return null;
          }
        });

        const results = await Promise.allSettled(promises);
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            nodes.push(result.value);
            console.log(`  ✓ Fetched ${result.value.name} from ${result.value.package}`);
          }
        });

        // Rate limiting - small delay between batches
        if (i + batchSize < nodeFiles.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error(`Failed to discover nodes in ${basePath}:`, error);
      throw error;
    }

    return nodes;
  }

  private async discoverCredentialsInPath(basePath: string): Promise<RemoteNodeFile[]> {
    const credentials: RemoteNodeFile[] = [];
    
    try {
      const tree = await this.getDirectoryTree(basePath);
      
      // Find all .credentials.ts files
      const credentialFiles = tree.filter(item => 
        item.type === 'blob' && 
        item.path.endsWith('.credentials.ts')
      );

      console.log(`🔐 Found ${credentialFiles.length} .credentials.ts files in ${basePath}`);

      // Batch process credentials
      const batchSize = 10;
      for (let i = 0; i < credentialFiles.length; i += batchSize) {
        const batch = credentialFiles.slice(i, i + batchSize);
        
        const promises = batch.map(async (file) => {
          try {
            const content = await this.getFileContent(file.sha);
            const packageName = this.extractPackageName(basePath);
            const credentialName = this.extractCredentialName(file.path);
            
            return {
              path: file.path,
              name: credentialName,
              content,
              sha: file.sha,
              package: packageName
            };
          } catch (error) {
            console.error(`  ❌ Failed to fetch ${file.path}:`, error);
            return null;
          }
        });

        const results = await Promise.allSettled(promises);
        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            credentials.push(result.value);
            console.log(`  ✓ Fetched ${result.value.name} from ${result.value.package}`);
          }
        });

        // Rate limiting
        if (i + batchSize < credentialFiles.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error(`Failed to discover credentials in ${basePath}:`, error);
      throw error;
    }

    return credentials;
  }

  private async getDirectoryTree(path: string): Promise<GitHubTreeItem[]> {
    try {
      const { data } = await this.octokit.rest.git.getTree({
        owner: this.REPO_OWNER,
        repo: this.REPO_NAME,
        tree_sha: this.BRANCH,
        recursive: 'true'
      });

      // Filter items that start with our path
      return data.tree
        .filter((item: any) => item.path?.startsWith(path))
        .map((item: any) => ({
          path: item.path!,
          mode: item.mode!,
          type: item.type!,
          sha: item.sha!,
          size: item.size,
          url: item.url!
        }));
    } catch (error) {
      console.error(`Failed to get directory tree for ${path}:`, error);
      throw error;
    }
  }

  private async getFileContent(sha: string): Promise<string> {
    try {
      const { data } = await this.octokit.rest.git.getBlob({
        owner: this.REPO_OWNER,
        repo: this.REPO_NAME,
        file_sha: sha
      });

      // Decode base64 content
      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.error(`Failed to get file content for SHA ${sha}:`, error);
      throw error;
    }
  }

  private extractPackageName(path: string): string {
    if (path.includes('nodes-base')) {
      return 'n8n-nodes-base';
    } else if (path.includes('n8n-nodes-langchain')) {
      return '@n8n/n8n-nodes-langchain';
    }
    return 'unknown';
  }

  private extractNodeName(filePath: string): string {
    // Extract node name from path like "packages/nodes-base/nodes/Slack/Slack.node.ts"
    const match = filePath.match(/\/([^\/]+)\.node\.ts$/);
    return match ? match[1] : 'Unknown';
  }

  private extractCredentialName(filePath: string): string {
    // Extract credential name from path like "packages/nodes-base/credentials/SlackApi.credentials.ts"
    const match = filePath.match(/\/([^\/]+)\.credentials\.ts$/);
    return match ? match[1] : 'Unknown';
  }

  /**
   * Parse TypeScript node file to extract metadata using AST parsing
   */
  parseNodeFromSource(nodeFile: RemoteNodeFile): ParsedNodeMetadata | null {
    try {
      return this.parseTypeScriptNode(nodeFile.content, nodeFile.name, nodeFile.package);
    } catch (error) {
      console.error(`Failed to parse node ${nodeFile.name}:`, error);
      return null;
    }
  }

  private parseTypeScriptNode(sourceCode: string, nodeName: string, packageName: string): ParsedNodeMetadata {
    // Create TypeScript source file
    const sourceFile = ts.createSourceFile(
      `${nodeName}.node.ts`,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    // Extract node metadata using TypeScript AST
    const nodeMetadata = this.extractNodeMetadata(sourceFile);
    
    // Build parsed node structure
    return {
      style: nodeMetadata.isDeclarative ? 'declarative' : 'programmatic',
      nodeType: this.buildNodeType(nodeName, packageName),
      displayName: nodeMetadata.displayName || nodeName,
      description: nodeMetadata.description,
      category: nodeMetadata.category || 'misc',
      properties: nodeMetadata.properties || [],
      credentials: nodeMetadata.credentials || [],
      isAITool: nodeMetadata.isAITool || false,
      isTrigger: nodeMetadata.isTrigger || false,
      isWebhook: nodeMetadata.isWebhook || false,
      operations: nodeMetadata.operations || [],
      version: nodeMetadata.version || '1',
      isVersioned: nodeMetadata.isVersioned || false,
      packageName: packageName,
      documentation: nodeMetadata.documentation
    };
  }

  private extractNodeMetadata(sourceFile: ts.SourceFile): any {
    const metadata: any = {
      properties: [],
      credentials: [],
      operations: [],
      isDeclarative: false,
      isAITool: false,
      isTrigger: false,
      isWebhook: false,
      isVersioned: false,
      version: '1'
    };

    // Visit all nodes in the AST
    const visit = (node: ts.Node) => {
      // Look for class declarations
      if (ts.isClassDeclaration(node) && node.name) {
        // Extract from class members
        node.members.forEach((member: any) => {
          if (ts.isPropertyDeclaration(member) && member.name) {
            const propertyName = member.name.getText();
            
            // Extract description property
            if (propertyName === 'description') {
              const desc = this.extractObjectLiteral(member.initializer);
              if (desc) {
                metadata.displayName = desc.displayName;
                metadata.description = desc.description;
                metadata.category = desc.group?.[0] || desc.category;
                metadata.version = desc.version;
                metadata.isVersioned = Array.isArray(desc.version) || desc.nodeVersions;
                metadata.isTrigger = desc.trigger || desc.polling;
                metadata.isWebhook = desc.webhooks?.length > 0;
                metadata.isDeclarative = !!desc.routing;
                
                // Extract properties
                if (desc.properties) {
                  metadata.properties = desc.properties;
                }
                
                // Extract credentials
                if (desc.credentials) {
                  metadata.credentials = desc.credentials;
                }
              }
            }
          }
        });
      }
      
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return metadata;
  }

  private extractObjectLiteral(node: ts.Node | undefined): any {
    if (!node || !ts.isObjectLiteralExpression(node)) {
      return null;
    }

    const obj: any = {};
    
    node.properties.forEach((prop: any) => {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        const key = prop.name.text;
        const value = this.extractValue(prop.initializer);
        if (value !== undefined) {
          obj[key] = value;
        }
      }
    });

    return obj;
  }

  private extractValue(node: ts.Node): any {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    } else if (ts.isNumericLiteral(node)) {
      return Number(node.text);
    } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    } else if (ts.isArrayLiteralExpression(node)) {
      return node.elements.map((element: any) => this.extractValue(element));
    } else if (ts.isObjectLiteralExpression(node)) {
      return this.extractObjectLiteral(node);
    }
    
    return undefined;
  }

  private buildNodeType(nodeName: string, packageName: string): string {
    const packagePrefix = packageName.replace('@n8n/', '').replace('n8n-', '');
    return `${packagePrefix}.${nodeName.toLowerCase()}`;
  }

  // Additional methods needed for MCP server compatibility
  private nodeCache: RemoteNodeFile[] = [];
  private credentialCache: RemoteNodeFile[] = [];
  private lastUpdateSha: string = '';
  private cacheInitialized: boolean = false;

  /**
   * Initialize cache if not already done
   */
  private async ensureCacheInitialized(): Promise<void> {
    if (!this.cacheInitialized) {
      console.log('🔄 Initializing node cache...');
      this.nodeCache = await this.discoverAllNodes();
      this.credentialCache = await this.discoverAllCredentials();
      this.lastUpdateSha = await this.getLatestCommitSha();
      this.cacheInitialized = true;
      console.log(`✅ Cache initialized with ${this.nodeCache.length} nodes and ${this.credentialCache.length} credentials`);
    }
  }

  /**
   * Search nodes by query string
   */
  async searchNodes(query: string): Promise<any[]> {
    await this.ensureCacheInitialized();
    
    const searchTerm = query.toLowerCase();
    const results: any[] = [];

    for (const nodeFile of this.nodeCache) {
      const parsedNode = this.parseNodeFromSource(nodeFile);
      if (!parsedNode) continue;

      // Search in name, display name, and description
      const searchableText = [
        nodeFile.name,
        parsedNode.displayName,
        parsedNode.description || '',
        parsedNode.category
      ].join(' ').toLowerCase();

      if (searchableText.includes(searchTerm)) {
        results.push({
          name: nodeFile.name,
          displayName: parsedNode.displayName,
          description: parsedNode.description,
          category: parsedNode.category,
          package: nodeFile.package,
          nodeType: parsedNode.nodeType,
          isAITool: parsedNode.isAITool,
          isTrigger: parsedNode.isTrigger,
          isWebhook: parsedNode.isWebhook,
          version: parsedNode.version
        });
      }
    }

    return results;
  }

  /**
   * Get nodes by category
   */
  async getNodesByCategory(category: string): Promise<any[]> {
    await this.ensureCacheInitialized();
    
    const results: any[] = [];

    for (const nodeFile of this.nodeCache) {
      const parsedNode = this.parseNodeFromSource(nodeFile);
      if (!parsedNode) continue;

      if (parsedNode.category.toLowerCase() === category.toLowerCase()) {
        results.push({
          name: nodeFile.name,
          displayName: parsedNode.displayName,
          description: parsedNode.description,
          category: parsedNode.category,
          package: nodeFile.package,
          nodeType: parsedNode.nodeType,
          isAITool: parsedNode.isAITool,
          isTrigger: parsedNode.isTrigger,
          isWebhook: parsedNode.isWebhook,
          version: parsedNode.version
        });
      }
    }

    return results;
  }

  /**
   * Discover nodes (alias for discoverAllNodes but returns formatted results)
   */
  async discoverNodes(): Promise<any[]> {
    await this.ensureCacheInitialized();
    
    const results: any[] = [];

    for (const nodeFile of this.nodeCache) {
      const parsedNode = this.parseNodeFromSource(nodeFile);
      if (!parsedNode) continue;

      results.push({
        name: nodeFile.name,
        displayName: parsedNode.displayName,
        description: parsedNode.description,
        category: parsedNode.category,
        package: nodeFile.package,
        nodeType: parsedNode.nodeType,
        isAITool: parsedNode.isAITool,
        isTrigger: parsedNode.isTrigger,
        isWebhook: parsedNode.isWebhook,
        version: parsedNode.version
      });
    }

    return results;
  }

  /**
   * Get detailed information about a specific node
   */
  async getNodeDetails(nodeName: string): Promise<any | null> {
    await this.ensureCacheInitialized();
    
    const nodeFile = this.nodeCache.find(n => 
      n.name.toLowerCase() === nodeName.toLowerCase()
    );

    if (!nodeFile) {
      return null;
    }

    const parsedNode = this.parseNodeFromSource(nodeFile);
    if (!parsedNode) {
      return null;
    }

    // Find related credentials
    const relatedCredentials: any[] = [];
    for (const credFile of this.credentialCache) {
      // Basic heuristic: credential name contains node name or vice versa
      if (credFile.name.toLowerCase().includes(nodeName.toLowerCase()) ||
          nodeName.toLowerCase().includes(credFile.name.toLowerCase())) {
        relatedCredentials.push({
          name: credFile.name,
          package: credFile.package,
          path: credFile.path
        });
      }
    }

    return {
      name: nodeFile.name,
      displayName: parsedNode.displayName,
      description: parsedNode.description,
      category: parsedNode.category,
      package: nodeFile.package,
      path: nodeFile.path,
      nodeType: parsedNode.nodeType,
      properties: parsedNode.properties,
      credentials: parsedNode.credentials,
      operations: parsedNode.operations,
      isAITool: parsedNode.isAITool,
      isTrigger: parsedNode.isTrigger,
      isWebhook: parsedNode.isWebhook,
      version: parsedNode.version,
      isVersioned: parsedNode.isVersioned,
      relatedCredentials,
      sourceCode: nodeFile.content.length > 10000 ? 
        nodeFile.content.substring(0, 10000) + '...[truncated]' : 
        nodeFile.content
    };
  }

  /**
   * Force refresh the cache from GitHub
   */
  async forceRefresh(): Promise<void> {
    console.log('🔄 Force refreshing cache from GitHub...');
    this.cacheInitialized = false;
    this.nodeCache = [];
    this.credentialCache = [];
    await this.ensureCacheInitialized();
    console.log('✅ Cache refreshed successfully');
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<any> {
    await this.ensureCacheInitialized();
    
    const nodesByPackage: Record<string, number> = {};
    const nodesByCategory: Record<string, number> = {};
    
    for (const nodeFile of this.nodeCache) {
      // Count by package
      nodesByPackage[nodeFile.package] = (nodesByPackage[nodeFile.package] || 0) + 1;
      
      // Count by category
      const parsedNode = this.parseNodeFromSource(nodeFile);
      if (parsedNode) {
        nodesByCategory[parsedNode.category] = (nodesByCategory[parsedNode.category] || 0) + 1;
      }
    }

    return {
      totalNodes: this.nodeCache.length,
      totalCredentials: this.credentialCache.length,
      nodesByPackage,
      nodesByCategory,
      lastUpdateSha: this.lastUpdateSha,
      cacheInitialized: this.cacheInitialized,
      lastRefreshed: new Date().toISOString()
    };
  }

  /**
   * Get available node categories
   */
  async getAvailableCategories(): Promise<string[]> {
    await this.ensureCacheInitialized();
    
    const categories = new Set<string>();
    
    for (const nodeFile of this.nodeCache) {
      const parsedNode = this.parseNodeFromSource(nodeFile);
      if (parsedNode && parsedNode.category) {
        categories.add(parsedNode.category);
      }
    }

    return Array.from(categories).sort();
  }
}
