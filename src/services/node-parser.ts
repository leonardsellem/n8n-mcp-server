// src/services/node-parser.ts

import * as ts from 'typescript';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

/**
 * Node Definition Interface
 */
export interface NodeDefinition {
  name: string;
  displayName: string;
  description: string;
  version: number;
  group: string[];
  inputs: string[];
  outputs: string[];
  credentials: any[];
  properties: PropertyDefinition[];
  category: string;
  subcategory: string;
  documentation: string;
  icon?: string;
  deprecated: boolean;
}

/**
 * Property Definition Interface
 */
export interface PropertyDefinition {
  displayName: string;
  name: string;
  type: string;
  default?: any;
  required: boolean;
  description: string;
  options?: any[];
  displayOptions?: any;
}

/**
 * Search Result Interface
 */
export interface SearchResult {
  name: string;
  displayName: string;
  description: string;
  category: string;
  version: number;
  score: number;
}

/**
 * Node Definition Parser
 * 
 * This class parses TypeScript node files to extract metadata about n8n nodes.
 * It helps the AI understand what nodes are available, their properties,
 * and how they can be used in workflows. This is crucial for preventing
 * the AI from creating workflows with invalid node configurations.
 */
export class NodeParser {
  private nodeCache: Map<string, NodeDefinition> = new Map();
  private cachePath: string;
  private searchIndex: Map<string, Set<string>> = new Map(); // For fast searching

  constructor(cachePath = './cache/github-nodes') {
    this.cachePath = cachePath;
  }

  /**
   * Initialize the parser and build the node index
   */
  async initialize(): Promise<void> {
    logger.info('[Node Parser] Initializing and building index...');
    await this.parseAllNodes();
    logger.info(`[Node Parser] Indexed ${this.nodeCache.size} nodes`);
  }

  /**
   * Parse all cached node files and build searchable index
   */
  async parseAllNodes(): Promise<NodeDefinition[]> {
    try {
      const nodesDir = path.join(this.cachePath, 'nodes');
      const files = await fs.readdir(nodesDir).catch(() => []);
      
      // Filter for TypeScript node files
      const nodeFiles = files.filter(f => f.endsWith('.node.ts'));
      logger.info(`[Node Parser] Found ${nodeFiles.length} node files to parse`);
      
      const nodes: NodeDefinition[] = [];
      const parsePromises: Promise<void>[] = [];
      
      // Parse files in parallel for better performance
      for (const file of nodeFiles) {
        parsePromises.push(
          this.parseNodeFile(file)
            .then(node => {
              if (node) {
                nodes.push(node);
                this.nodeCache.set(node.name, node);
                this.indexNode(node);
              }
            })
            .catch(error => {
              logger.error(`[Node Parser] Failed to parse ${file}`, error);
            })
        );
      }
      
      await Promise.all(parsePromises);
      
      // Also parse JSON codex files for additional metadata
      await this.parseCodexFiles();
      
      return nodes;
    } catch (error) {
      logger.error('[Node Parser] Failed to parse nodes', error);
      return [];
    }
  }

  /**
   * Parse a single node TypeScript file
   */
  async parseNodeFile(fileName: string): Promise<NodeDefinition | null> {
    try {
      const filePath = path.join(this.cachePath, 'nodes', fileName);
      const sourceCode = await fs.readFile(filePath, 'utf-8');
      
      // Create TypeScript source file for AST parsing
      const sourceFile = ts.createSourceFile(
        fileName,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
      );
      
      // Extract node information from AST
      const nodeInfo = this.extractNodeInfoFromAST(sourceFile, fileName);
      
      if (!nodeInfo || !nodeInfo.name) {
        return null;
      }
      
      // Set default values for missing fields
      return {
        name: nodeInfo.name,
        displayName: nodeInfo.displayName || nodeInfo.name,
        description: nodeInfo.description || '',
        version: nodeInfo.version || 1,
        group: nodeInfo.group || ['transform'],
        inputs: nodeInfo.inputs || ['main'],
        outputs: nodeInfo.outputs || ['main'],
        credentials: nodeInfo.credentials || [],
        properties: nodeInfo.properties || [],
        category: nodeInfo.category || 'Core Nodes',
        subcategory: nodeInfo.subcategory || 'Flow',
        documentation: nodeInfo.documentation || '',
        icon: nodeInfo.icon,
        deprecated: false
      };
      
    } catch (error) {
      logger.error(`[Node Parser] Error parsing ${fileName}`, error);
      return null;
    }
  }

  /**
   * Extract node information from TypeScript AST
   */
  private extractNodeInfoFromAST(sourceFile: ts.SourceFile, fileName: string): Partial<NodeDefinition> | null {
    let nodeInfo: Partial<NodeDefinition> = {};
    let foundNodeClass = false;
    
    // Visitor function to traverse the AST
    const visit = (node: ts.Node): void => {
      // Look for class declarations that implement INodeType
      if (ts.isClassDeclaration(node) && node.name) {
        const className = node.name.text;
        
        // Check if this is a node class (ends with Node or implements INodeType)
        if (className.includes('Node') || this.implementsINodeType(node)) {
          foundNodeClass = true;
          nodeInfo.name = className;
          
          // Look for the description property
          node.members.forEach(member => {
            if (ts.isPropertyDeclaration(member) && member.name) {
              const propName = member.name.getText();
              
              if (propName === 'description' && member.initializer) {
                // Parse the description object
                const descriptionData = this.parseDescriptionObject(member.initializer);
                nodeInfo = { ...nodeInfo, ...descriptionData };
              }
            }
          });
        }
      }
      
      // Continue traversing
      ts.forEachChild(node, visit);
    };
    
    visit(sourceFile);
    
    // If we didn't find a class, try to extract from exported description
    if (!foundNodeClass) {
      nodeInfo = this.extractFromExportedDescription(sourceFile) || nodeInfo;
    }
    
    return nodeInfo.name ? nodeInfo : null;
  }

  /**
   * Check if a class implements INodeType interface
   */
  private implementsINodeType(node: ts.ClassDeclaration): boolean {
    if (!node.heritageClauses) return false;
    
    return node.heritageClauses.some(clause => {
      if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
        return clause.types.some(type => {
          const typeName = type.expression.getText();
          return typeName === 'INodeType' || typeName.includes('INodeType');
        });
      }
      return false;
    });
  }

  /**
   * Parse the node description object to extract metadata
   */
  private parseDescriptionObject(initializer: ts.Expression): Partial<NodeDefinition> {
    const info: Partial<NodeDefinition> = {};
    
    if (!ts.isObjectLiteralExpression(initializer)) {
      return info;
    }
    
    initializer.properties.forEach(prop => {
      if (ts.isPropertyAssignment(prop) && prop.name) {
        const propName = prop.name.getText().replace(/['"]/g, '');
        const value = this.extractValue(prop.initializer);
        
        switch (propName) {
          case 'displayName':
            info.displayName = String(value);
            break;
          case 'name':
            info.name = String(value);
            break;
          case 'icon':
            info.icon = String(value);
            break;
          case 'group':
            info.group = Array.isArray(value) ? value : [String(value)];
            break;
          case 'version':
            info.version = typeof value === 'number' ? value : parseInt(String(value));
            break;
          case 'subtitle':
          case 'description':
            info.description = String(value);
            break;
          case 'defaults':
            if (typeof value === 'object' && value.name) {
              info.displayName = info.displayName || value.name;
            }
            break;
          case 'inputs':
            info.inputs = this.parseInputOutput(value);
            break;
          case 'outputs':
            info.outputs = this.parseInputOutput(value);
            break;
          case 'credentials':
            info.credentials = this.parseCredentials(value);
            break;
          case 'properties':
            info.properties = this.parseProperties(value);
            break;
        }
      }
    });
    
    return info;
  }

  /**
   * Extract value from AST node with type inference
   */
  private extractValue(node: ts.Expression): any {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      return node.text;
    }
    
    if (ts.isNumericLiteral(node)) {
      return parseFloat(node.text);
    }
    
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true;
    }
    
    if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false;
    }
    
    if (ts.isArrayLiteralExpression(node)) {
      return node.elements.map(element => this.extractValue(element));
    }
    
    if (ts.isObjectLiteralExpression(node)) {
      const obj: any = {};
      node.properties.forEach(prop => {
        if (ts.isPropertyAssignment(prop) && prop.name) {
          const key = prop.name.getText().replace(/['"]/g, '');
          obj[key] = this.extractValue(prop.initializer);
        }
      });
      return obj;
    }
    
    // For complex expressions, return the text representation
    return node.getText();
  }

  /**
   * Parse input/output configuration
   */
  private parseInputOutput(value: any): string[] {
    if (Array.isArray(value)) {
      return value.map(v => typeof v === 'object' ? v.type || 'main' : String(v));
    }
    return ['main'];
  }

  /**
   * Parse credential requirements
   */
  private parseCredentials(value: any): any[] {
    if (!Array.isArray(value)) return [];
    
    return value.map(cred => {
      if (typeof cred === 'string') {
        return { name: cred, required: true };
      }
      return cred;
    });
  }

  /**
   * Parse node properties
   */
  private parseProperties(value: any): PropertyDefinition[] {
    if (!Array.isArray(value)) return [];
    
    return value.map(prop => {
      // Ensure each property has required fields
      return {
        displayName: prop.displayName || prop.name || 'Unknown',
        name: prop.name || 'unknown',
        type: prop.type || 'string',
        default: prop.default,
        required: prop.required || false,
        description: prop.description || '',
        options: prop.options,
        displayOptions: prop.displayOptions
      };
    });
  }

  /**
   * Try to extract node info from exported description constant
   */
  private extractFromExportedDescription(sourceFile: ts.SourceFile): Partial<NodeDefinition> | null {
    let nodeInfo: Partial<NodeDefinition> | null = null;
    
    const visit = (node: ts.Node): void => {
      // Look for exported const nodeDescription
      if (ts.isVariableStatement(node)) {
        const isExported = node.modifiers?.some(
          modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
        );
        
        if (isExported) {
          node.declarationList.declarations.forEach(declaration => {
            if (ts.isVariableDeclaration(declaration) && declaration.name) {
              const varName = declaration.name.getText();
              
              if (varName.includes('Description') && declaration.initializer) {
                const data = this.parseDescriptionObject(declaration.initializer);
                if (data.name) {
                  nodeInfo = data;
                }
              }
            }
          });
        }
      }
      
      ts.forEachChild(node, visit);
    };
    
    visit(sourceFile);
    return nodeInfo;
  }

  /**
   * Parse codex JSON files for additional metadata
   */
  private async parseCodexFiles(): Promise<void> {
    try {
      const nodesDir = path.join(this.cachePath, 'nodes');
      const files = await fs.readdir(nodesDir).catch(() => []);
      const codexFiles = files.filter(f => f.endsWith('.node.json'));
      
      for (const file of codexFiles) {
        try {
          const filePath = path.join(nodesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const codex = JSON.parse(content);
          
          // Match codex to node by name
          const nodeName = file.replace('.node.json', '');
          const matchingNode = Array.from(this.nodeCache.values()).find(
            node => node.name.toLowerCase() === nodeName.toLowerCase() ||
                   node.displayName.toLowerCase() === nodeName.toLowerCase()
          );
          
          if (matchingNode && codex) {
            // Enhance node with codex metadata
            if (codex.categories && codex.categories.length > 0) {
              matchingNode.category = codex.categories[0];
            }
            
            if (codex.subcategories && matchingNode.category) {
              const subcats = codex.subcategories[matchingNode.category];
              if (subcats && subcats.length > 0) {
                matchingNode.subcategory = subcats[0];
              }
            }
            
            if (codex.resources?.primaryDocumentation?.[0]?.url) {
              matchingNode.documentation = codex.resources.primaryDocumentation[0].url;
            }
            
            // Update cache with enhanced node
            this.nodeCache.set(matchingNode.name, matchingNode);
          }
        } catch (error) {
          logger.error(`[Node Parser] Error parsing codex ${file}`, error);
        }
      }
    } catch (error) {
      logger.error('[Node Parser] Error parsing codex files', error);
    }
  }

  /**
   * Index a node for fast searching
   */
  private indexNode(node: NodeDefinition): void {
    // Index by various searchable terms
    const searchTerms = [
      node.name.toLowerCase(),
      node.displayName.toLowerCase(),
      node.category.toLowerCase(),
      node.subcategory.toLowerCase(),
      ...node.description.toLowerCase().split(/\s+/),
      ...node.group.map(g => g.toLowerCase())
    ];
    
    // Add each term to the search index
    searchTerms.forEach(term => {
      if (term.length > 2) { // Only index terms longer than 2 characters
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, new Set());
        }
        this.searchIndex.get(term)!.add(node.name);
      }
    });
  }

  /**
   * Search nodes by query with intelligent ranking
   */
  async searchNodes(query: string, category?: string): Promise<SearchResult[]> {
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const results: Map<string, SearchResult> = new Map();
    
    // Score each node based on search term matches
    for (const [nodeName, node] of this.nodeCache) {
      // Apply category filter if specified
      if (category && node.category.toLowerCase() !== category.toLowerCase()) {
        continue;
      }
      
      let score = 0;
      let matches = 0;
      
      for (const term of searchTerms) {
        // Exact name match (highest score)
        if (node.name.toLowerCase() === term) {
          score += 50;
          matches++;
        }
        // Display name match (high score)
        else if (node.displayName.toLowerCase().includes(term)) {
          score += 30;
          matches++;
        }
        // Name contains term
        else if (node.name.toLowerCase().includes(term)) {
          score += 20;
          matches++;
        }
        // Description contains term
        else if (node.description.toLowerCase().includes(term)) {
          score += 10;
          matches++;
        }
        // Category/subcategory match
        else if (node.category.toLowerCase().includes(term) || 
                 node.subcategory.toLowerCase().includes(term)) {
          score += 5;
          matches++;
        }
        // Check search index for partial matches
        else {
          for (const [indexTerm, nodeNames] of this.searchIndex) {
            if (indexTerm.includes(term) && nodeNames.has(nodeName)) {
              score += 2;
              matches++;
              break;
            }
          }
        }
      }
      
      // Only include nodes that match at least one search term
      if (matches > 0) {
        // Boost score based on percentage of search terms matched
        score *= (matches / searchTerms.length);
        
        results.set(nodeName, {
          name: node.name,
          displayName: node.displayName,
          description: node.description,
          category: node.category,
          version: node.version,
          score
        });
      }
    }
    
    // Sort by score (descending) and return top results
    return Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Limit to top 50 results
  }

  /**
   * Get node definition by exact name
   */
  async getNodeDefinition(nodeName: string): Promise<NodeDefinition | null> {
    // Check cache first
    if (this.nodeCache.has(nodeName)) {
      return this.nodeCache.get(nodeName)!;
    }
    
    // Try case-insensitive search
    for (const [name, node] of this.nodeCache) {
      if (name.toLowerCase() === nodeName.toLowerCase()) {
        return node;
      }
    }
    
    // Try to find by display name
    for (const node of this.nodeCache.values()) {
      if (node.displayName.toLowerCase() === nodeName.toLowerCase()) {
        return node;
      }
    }
    
    return null;
  }

  /**
   * List all available nodes with optional filtering
   */
  async listAvailableNodes(options?: {
    category?: string;
    includeDeprecated?: boolean;
    limit?: number;
  }): Promise<NodeDefinition[]> {
    let nodes = Array.from(this.nodeCache.values());
    
    // Apply filters
    if (options?.category) {
      nodes = nodes.filter(n => n.category === options.category);
    }
    
    if (!options?.includeDeprecated) {
      nodes = nodes.filter(n => !n.deprecated);
    }
    
    // Sort by category and name for consistent ordering
    nodes.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.displayName.localeCompare(b.displayName);
    });
    
    // Apply limit if specified
    if (options?.limit) {
      nodes = nodes.slice(0, options.limit);
    }
    
    return nodes;
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<Array<{ name: string; count: number }>> {
    const categories = new Map<string, number>();
    
    for (const node of this.nodeCache.values()) {
      const count = categories.get(node.category) || 0;
      categories.set(node.category, count + 1);
    }
    
    return Array.from(categories.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get node statistics
   */
  getStats(): {
    totalNodes: number;
    categories: number;
    deprecated: number;
    withCredentials: number;
  } {
    const nodes = Array.from(this.nodeCache.values());
    const categories = new Set(nodes.map(n => n.category));
    
    return {
      totalNodes: nodes.length,
      categories: categories.size,
      deprecated: nodes.filter(n => n.deprecated).length,
      withCredentials: nodes.filter(n => n.credentials.length > 0).length
    };
  }

  /**
   * Clear cache and force re-parse
   */
  async refresh(): Promise<void> {
    logger.info('[Node Parser] Refreshing node cache...');
    this.nodeCache.clear();
    this.searchIndex.clear();
    await this.parseAllNodes();
  }
}
