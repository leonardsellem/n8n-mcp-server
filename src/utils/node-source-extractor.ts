import * as fs from 'fs/promises';
import * as path from 'path';
import { logger } from './logger';

export interface NodeSourceInfo {
  nodeType: string;
  sourceCode: string;
  credentialCode?: string;
  packageInfo?: any;
  location: string;
}

export class NodeSourceExtractor {
  private n8nBasePaths = [
    '/usr/local/lib/node_modules/n8n/node_modules',
    '/app/node_modules',
    '/home/node/.n8n/custom/nodes',
    './node_modules',
    // Docker volume paths
    '/var/lib/docker/volumes/n8n-mcp_n8n_modules/_data',
    '/n8n-modules',
    // Common n8n installation paths
    process.env.N8N_CUSTOM_EXTENSIONS || '',
    // Additional local path for testing
    path.join(process.cwd(), 'node_modules'),
  ].filter(Boolean);

  /**
   * Extract source code for a specific n8n node
   */
  async extractNodeSource(nodeType: string): Promise<NodeSourceInfo> {
    logger.info(`Extracting source code for node: ${nodeType}`);
    
    // Parse node type to get package and node name
    const { packageName, nodeName } = this.parseNodeType(nodeType);
    
    // Search for the node in known locations
    for (const basePath of this.n8nBasePaths) {
      try {
        const nodeInfo = await this.searchNodeInPath(basePath, packageName, nodeName);
        if (nodeInfo) {
          logger.info(`Found node source at: ${nodeInfo.location}`);
          return nodeInfo;
        }
      } catch (error) {
        logger.debug(`Failed to search in ${basePath}: ${error}`);
      }
    }
    
    throw new Error(`Node source code not found for: ${nodeType}`);
  }

  /**
   * Parse node type identifier
   */
  private parseNodeType(nodeType: string): { packageName: string; nodeName: string } {
    // Handle different formats:
    // - @n8n/n8n-nodes-langchain.Agent
    // - n8n-nodes-base.HttpRequest
    // - customNode
    
    if (nodeType.includes('.')) {
      const [pkg, node] = nodeType.split('.');
      return { packageName: pkg, nodeName: node };
    }
    
    // Default to n8n-nodes-base for simple node names
    return { packageName: 'n8n-nodes-base', nodeName: nodeType };
  }

  /**
   * Search for node in a specific path
   */
  private async searchNodeInPath(
    basePath: string,
    packageName: string,
    nodeName: string
  ): Promise<NodeSourceInfo | null> {
    try {
      // Try both the provided case and capitalized first letter
      const nodeNameVariants = [
        nodeName,
        nodeName.charAt(0).toUpperCase() + nodeName.slice(1), // Capitalize first letter
        nodeName.toLowerCase(), // All lowercase
        nodeName.toUpperCase(), // All uppercase
      ];
      
      // First, try standard patterns with all case variants
      for (const nameVariant of nodeNameVariants) {
        const standardPatterns = [
          `${packageName}/dist/nodes/${nameVariant}/${nameVariant}.node.js`,
          `${packageName}/dist/nodes/${nameVariant}.node.js`,
          `${packageName}/nodes/${nameVariant}/${nameVariant}.node.js`,
          `${packageName}/nodes/${nameVariant}.node.js`,
          `${nameVariant}/${nameVariant}.node.js`,
          `${nameVariant}.node.js`,
        ];

        // Additional patterns for nested node structures (e.g., agents/Agent)
        const nestedPatterns = [
          `${packageName}/dist/nodes/*/${nameVariant}/${nameVariant}.node.js`,
          `${packageName}/dist/nodes/**/${nameVariant}/${nameVariant}.node.js`,
          `${packageName}/nodes/*/${nameVariant}/${nameVariant}.node.js`,
          `${packageName}/nodes/**/${nameVariant}/${nameVariant}.node.js`,
        ];

        // Try standard patterns first
        for (const pattern of standardPatterns) {
          const fullPath = path.join(basePath, pattern);
          const result = await this.tryLoadNodeFile(fullPath, packageName, nodeName, basePath);
          if (result) return result;
        }

        // Try nested patterns (with glob-like search)
        for (const pattern of nestedPatterns) {
          const result = await this.searchWithGlobPattern(basePath, pattern, packageName, nodeName);
          if (result) return result;
        }
      }

      // If basePath contains .pnpm, search in pnpm structure
      if (basePath.includes('node_modules')) {
        const pnpmPath = path.join(basePath, '.pnpm');
        try {
          await fs.access(pnpmPath);
          const result = await this.searchInPnpm(pnpmPath, packageName, nodeName);
          if (result) return result;
        } catch {
          // .pnpm directory doesn't exist
        }
      }
    } catch (error) {
      logger.debug(`Error searching in path ${basePath}: ${error}`);
    }

    return null;
  }

  /**
   * Search for nodes in pnpm's special directory structure
   */
  private async searchInPnpm(
    pnpmPath: string,
    packageName: string,
    nodeName: string
  ): Promise<NodeSourceInfo | null> {
    try {
      const entries = await fs.readdir(pnpmPath);
      
      // Filter entries that might contain our package
      const packageEntries = entries.filter(entry => 
        entry.includes(packageName.replace('/', '+')) || 
        entry.includes(packageName)
      );

      for (const entry of packageEntries) {
        const entryPath = path.join(pnpmPath, entry, 'node_modules', packageName);
        
        // Search patterns within the pnpm package directory
        const patterns = [
          `dist/nodes/${nodeName}/${nodeName}.node.js`,
          `dist/nodes/${nodeName}.node.js`,
          `dist/nodes/*/${nodeName}/${nodeName}.node.js`,
          `dist/nodes/**/${nodeName}/${nodeName}.node.js`,
        ];

        for (const pattern of patterns) {
          if (pattern.includes('*')) {
            const result = await this.searchWithGlobPattern(entryPath, pattern, packageName, nodeName);
            if (result) return result;
          } else {
            const fullPath = path.join(entryPath, pattern);
            const result = await this.tryLoadNodeFile(fullPath, packageName, nodeName, entryPath);
            if (result) return result;
          }
        }
      }
    } catch (error) {
      logger.debug(`Error searching in pnpm directory: ${error}`);
    }

    return null;
  }

  /**
   * Search for files matching a glob-like pattern
   */
  private async searchWithGlobPattern(
    basePath: string,
    pattern: string,
    packageName: string,
    nodeName: string
  ): Promise<NodeSourceInfo | null> {
    // Convert glob pattern to regex parts
    const parts = pattern.split('/');
    const targetFile = `${nodeName}.node.js`;
    
    async function searchDir(currentPath: string, remainingParts: string[]): Promise<string | null> {
      if (remainingParts.length === 0) return null;
      
      const part = remainingParts[0];
      const isLastPart = remainingParts.length === 1;
      
      try {
        if (isLastPart && part === targetFile) {
          // Check if file exists
          const fullPath = path.join(currentPath, part);
          await fs.access(fullPath);
          return fullPath;
        }
        
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
          if (!entry.isDirectory() && !isLastPart) continue;
          
          if (part === '*' || part === '**') {
            // Match any directory
            if (entry.isDirectory()) {
              const result = await searchDir(
                path.join(currentPath, entry.name),
                part === '**' ? remainingParts : remainingParts.slice(1)
              );
              if (result) return result;
            }
          } else if (entry.name === part || (isLastPart && entry.name === targetFile)) {
            if (isLastPart && entry.isFile()) {
              return path.join(currentPath, entry.name);
            } else if (!isLastPart && entry.isDirectory()) {
              const result = await searchDir(
                path.join(currentPath, entry.name),
                remainingParts.slice(1)
              );
              if (result) return result;
            }
          }
        }
      } catch {
        // Directory doesn't exist or can't be read
      }
      
      return null;
    }
    
    const foundPath = await searchDir(basePath, parts);
    if (foundPath) {
      return this.tryLoadNodeFile(foundPath, packageName, nodeName, basePath);
    }
    
    return null;
  }

  /**
   * Try to load a node file and its associated files
   */
  private async tryLoadNodeFile(
    fullPath: string,
    packageName: string,
    nodeName: string,
    packageBasePath: string
  ): Promise<NodeSourceInfo | null> {
    try {
      const sourceCode = await fs.readFile(fullPath, 'utf-8');
      
      // Try to find credential files
      let credentialCode: string | undefined;
      
      // First, try alongside the node file
      const credentialPath = fullPath.replace('.node.js', '.credentials.js');
      try {
        credentialCode = await fs.readFile(credentialPath, 'utf-8');
      } catch {
        // Try in the credentials directory
        const possibleCredentialPaths = [
          // Standard n8n structure: dist/credentials/NodeNameApi.credentials.js
          path.join(packageBasePath, packageName, 'dist/credentials', `${nodeName}Api.credentials.js`),
          path.join(packageBasePath, packageName, 'dist/credentials', `${nodeName}OAuth2Api.credentials.js`),
          path.join(packageBasePath, packageName, 'credentials', `${nodeName}Api.credentials.js`),
          path.join(packageBasePath, packageName, 'credentials', `${nodeName}OAuth2Api.credentials.js`),
          // Without packageName in path
          path.join(packageBasePath, 'dist/credentials', `${nodeName}Api.credentials.js`),
          path.join(packageBasePath, 'dist/credentials', `${nodeName}OAuth2Api.credentials.js`),
          path.join(packageBasePath, 'credentials', `${nodeName}Api.credentials.js`),
          path.join(packageBasePath, 'credentials', `${nodeName}OAuth2Api.credentials.js`),
          // Try relative to node location
          path.join(path.dirname(path.dirname(fullPath)), 'credentials', `${nodeName}Api.credentials.js`),
          path.join(path.dirname(path.dirname(fullPath)), 'credentials', `${nodeName}OAuth2Api.credentials.js`),
          path.join(path.dirname(path.dirname(path.dirname(fullPath))), 'credentials', `${nodeName}Api.credentials.js`),
          path.join(path.dirname(path.dirname(path.dirname(fullPath))), 'credentials', `${nodeName}OAuth2Api.credentials.js`),
        ];
        
        // Try to find any credential file
        const allCredentials: string[] = [];
        for (const credPath of possibleCredentialPaths) {
          try {
            const content = await fs.readFile(credPath, 'utf-8');
            allCredentials.push(content);
            logger.debug(`Found credential file at: ${credPath}`);
          } catch {
            // Continue searching
          }
        }
        
        // If we found credentials, combine them
        if (allCredentials.length > 0) {
          credentialCode = allCredentials.join('\n\n// --- Next Credential File ---\n\n');
        }
      }

      // Try to get package.json info
      let packageInfo: any;
      const possiblePackageJsonPaths = [
        path.join(packageBasePath, 'package.json'),
        path.join(packageBasePath, packageName, 'package.json'),
        path.join(path.dirname(path.dirname(fullPath)), 'package.json'),
        path.join(path.dirname(path.dirname(path.dirname(fullPath))), 'package.json'),
        // Try to go up from the node location to find package.json
        path.join(fullPath.split('/dist/')[0], 'package.json'),
        path.join(fullPath.split('/nodes/')[0], 'package.json'),
      ];

      for (const packageJsonPath of possiblePackageJsonPaths) {
        try {
          const packageJson = await fs.readFile(packageJsonPath, 'utf-8');
          packageInfo = JSON.parse(packageJson);
          logger.debug(`Found package.json at: ${packageJsonPath}`);
          break;
        } catch {
          // Try next path
        }
      }

      return {
        nodeType: `${packageName}.${nodeName}`,
        sourceCode,
        credentialCode,
        packageInfo,
        location: fullPath,
      };
    } catch {
      return null;
    }
  }

  /**
   * List all available nodes
   */
  async listAvailableNodes(category?: string, search?: string): Promise<any[]> {
    const nodes: any[] = [];
    const seenNodes = new Set<string>(); // Track unique nodes
    
    for (const basePath of this.n8nBasePaths) {
      try {
        // Check for n8n-nodes-base specifically
        const n8nNodesBasePath = path.join(basePath, 'n8n-nodes-base', 'dist', 'nodes');
        try {
          await fs.access(n8nNodesBasePath);
          await this.scanDirectoryForNodes(n8nNodesBasePath, nodes, category, search, seenNodes);
        } catch {
          // Try without dist
          const altPath = path.join(basePath, 'n8n-nodes-base', 'nodes');
          try {
            await fs.access(altPath);
            await this.scanDirectoryForNodes(altPath, nodes, category, search, seenNodes);
          } catch {
            // Try the base path directly
            await this.scanDirectoryForNodes(basePath, nodes, category, search, seenNodes);
          }
        }
      } catch (error) {
        logger.debug(`Failed to scan ${basePath}: ${error}`);
      }
    }

    return nodes;
  }

  /**
   * Scan directory for n8n nodes
   */
  private async scanDirectoryForNodes(
    dirPath: string,
    nodes: any[],
    category?: string,
    search?: string,
    seenNodes?: Set<string>
  ): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.node.js')) {
          try {
            const fullPath = path.join(dirPath, entry.name);
            const content = await fs.readFile(fullPath, 'utf-8');
            
            // Extract basic info from the source
            const nameMatch = content.match(/displayName:\s*['"`]([^'"`]+)['"`]/);
            const descriptionMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/);
            
            if (nameMatch) {
              const nodeName = entry.name.replace('.node.js', '');
              
              // Skip if we've already seen this node
              if (seenNodes && seenNodes.has(nodeName)) {
                continue;
              }
              
              const nodeInfo = {
                name: nodeName,
                displayName: nameMatch[1],
                description: descriptionMatch ? descriptionMatch[1] : '',
                location: fullPath,
              };

              // Apply filters
              if (category && !nodeInfo.displayName.toLowerCase().includes(category.toLowerCase())) {
                continue;
              }
              if (search && !nodeInfo.displayName.toLowerCase().includes(search.toLowerCase()) &&
                  !nodeInfo.description.toLowerCase().includes(search.toLowerCase())) {
                continue;
              }

              nodes.push(nodeInfo);
              if (seenNodes) {
                seenNodes.add(nodeName);
              }
            }
          } catch {
            // Skip files we can't read
          }
        } else if (entry.isDirectory()) {
          // Special handling for .pnpm directories
          if (entry.name === '.pnpm') {
            await this.scanPnpmDirectory(path.join(dirPath, entry.name), nodes, category, search, seenNodes);
          } else if (entry.name !== 'node_modules') {
            // Recursively scan subdirectories
            await this.scanDirectoryForNodes(path.join(dirPath, entry.name), nodes, category, search, seenNodes);
          }
        }
      }
    } catch (error) {
      logger.debug(`Error scanning directory ${dirPath}: ${error}`);
    }
  }

  /**
   * Scan pnpm directory structure for nodes
   */
  private async scanPnpmDirectory(
    pnpmPath: string,
    nodes: any[],
    category?: string,
    search?: string,
    seenNodes?: Set<string>
  ): Promise<void> {
    try {
      const entries = await fs.readdir(pnpmPath);
      
      for (const entry of entries) {
        const entryPath = path.join(pnpmPath, entry, 'node_modules');
        try {
          await fs.access(entryPath);
          await this.scanDirectoryForNodes(entryPath, nodes, category, search, seenNodes);
        } catch {
          // Skip if node_modules doesn't exist
        }
      }
    } catch (error) {
      logger.debug(`Error scanning pnpm directory ${pnpmPath}: ${error}`);
    }
  }

  /**
   * Extract AI Agent node specifically
   */
  async extractAIAgentNode(): Promise<NodeSourceInfo> {
    // AI Agent is typically in @n8n/n8n-nodes-langchain package
    return this.extractNodeSource('@n8n/n8n-nodes-langchain.Agent');
  }
}