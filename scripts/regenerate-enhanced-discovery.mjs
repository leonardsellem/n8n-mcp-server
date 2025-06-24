#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';

console.log('🔧 Regenerating enhanced discovery with correct imports...\n');

// Get all node files
const nodeFiles = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));
console.log(`📋 Processing ${nodeFiles.length} node files...\n`);

const imports = [];
const exports = [];
let processedCount = 0;

// Process each node file to get the correct export name
for (const file of nodeFiles) {
  const filePath = `src/data/nodes/${file}`;
  
  try {
    // Read the node file to find the actual export name
    const nodeContent = readFileSync(filePath, 'utf8');
    
    // Find export statement like "export const someNode: NodeTypeInfo = {"
    const exportMatch = nodeContent.match(/export const (\w+): NodeTypeInfo/);
    
    if (exportMatch) {
      const actualExportName = exportMatch[1];
      const importStatement = `import { ${actualExportName} } from '../data/nodes/${file.replace('.ts', '.js')}';`;
      
      imports.push(importStatement);
      exports.push(actualExportName);
      processedCount++;
      
      if (processedCount % 50 === 0) {
        console.log(`✅ Processed ${processedCount}/${nodeFiles.length} files...`);
      }
    } else {
      console.warn(`⚠️  ${file}: Could not find export statement`);
    }
    
  } catch (error) {
    console.warn(`❌ ${file}: Error reading file - ${error.message}`);
  }
}

// Generate the new enhanced discovery content
const discoveryContent = `/**
 * Enhanced Node Discovery System - All ${processedCount} Verified Nodes
 * Auto-generated complete registry for production use
 */

import { NodeTypeInfo } from '../data/node-types.js';

// Import all verified nodes
${imports.join('\n')}

/**
 * Complete registry of all available n8n nodes
 */
export const ALL_COMPLETE_NODES: NodeTypeInfo[] = [
${exports.map(name => `  ${name},`).join('\n')}
];

/**
 * Enhanced Node Discovery Service
 */
export class EnhancedNodeDiscovery {
  private allNodes: NodeTypeInfo[] = ALL_COMPLETE_NODES;
  
  /**
   * Get all available nodes
   */
  getAllAvailableNodes(): NodeTypeInfo[] {
    return this.allNodes;
  }
  
  /**
   * Search nodes by query
   */
  searchNodes(query: string, options: { limit?: number } = {}): NodeTypeInfo[] {
    const queryLower = query.toLowerCase();
    const results = this.allNodes.filter(node =>
      node.name.toLowerCase().includes(queryLower) ||
      node.displayName.toLowerCase().includes(queryLower) ||
      node.description.toLowerCase().includes(queryLower) ||
      (node.category && node.category.toLowerCase().includes(queryLower))
    );
    
    return results.slice(0, options.limit || 50);
  }
  
  /**
   * Get nodes by category
   */
  getNodesByCategory(category: string): NodeTypeInfo[] {
    return this.allNodes.filter(node =>
      node.category === category ||
      node.subcategory === category ||
      (node.category && node.category.toLowerCase().includes(category.toLowerCase()))
    );
  }
  
  /**
   * Get node statistics
   */
  getNodeStatistics() {
    const categories = new Set(this.allNodes.map(node => node.category).filter(Boolean));
    return {
      totalNodes: this.allNodes.length,
      categories: categories.size,
      categoryList: Array.from(categories)
    };
  }
}

// Create singleton instance
export const enhancedNodeDiscovery = new EnhancedNodeDiscovery();

// Export utility functions
export const getAllAvailableNodes = () => enhancedNodeDiscovery.getAllAvailableNodes();
export const searchNodes = (query: string, options?: { limit?: number }) => 
  enhancedNodeDiscovery.searchNodes(query, options);
export const getNodesByCategory = (category: string) => 
  enhancedNodeDiscovery.getNodesByCategory(category);
export const getNodeStatistics = () => enhancedNodeDiscovery.getNodeStatistics();

// Universal catalog for compatibility
export const universalNodeCatalog = {
  getAllAvailableNodes,
  searchNodes,
  getNodesByCategory,
  getNodeStatistics
};

export default enhancedNodeDiscovery;
`;

// Write the new enhanced discovery
writeFileSync('src/discovery/enhanced-discovery.ts', discoveryContent);

console.log(`\n📊 Enhanced Discovery Generation Complete:`);
console.log(`  ✅ Processed: ${processedCount} nodes`);
console.log(`  ✅ Generated: ${imports.length} imports`);
console.log(`  ✅ Registry: src/discovery/enhanced-discovery.ts`);

console.log(`\n🎯 Enhanced discovery regenerated successfully!`);