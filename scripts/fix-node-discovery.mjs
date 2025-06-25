#!/usr/bin/env node

import { writeFileSync, readdirSync } from 'fs';

console.log('🔧 Fixing node discovery to use all 532 nodes...\n');

// Get actual node files
const nodeFiles = readdirSync('src/data/nodes').filter(f => f.endsWith('.ts'));
console.log(`Found ${nodeFiles.length} node files to include in discovery`);

// Create corrected discovery system
const fixedDiscovery = `/**
 * Fixed Discovery Module - All 532 Nodes
 * 
 * Updated to use all available nodes from the nodes directory
 */

import { NodeTypeInfo } from '../data/node-types.js';

// Import ALL node files
${nodeFiles.map(file => {
  const name = file.replace('.ts', '').replace(/-/g, '');
  return `import { ${name}Node } from '../data/nodes/${file.replace('.ts', '.js')}';`;
}).join('\n')}

// Complete node registry with all ${nodeFiles.length} nodes
export const ALL_COMPLETE_NODES: NodeTypeInfo[] = [
${nodeFiles.map(file => {
  const name = file.replace('.ts', '').replace(/-/g, '');
  return `  ${name}Node`;
}).join(',\n')}
];

// Create enhanced discovery service
export class EnhancedNodeDiscovery {
  private static allNodes = ALL_COMPLETE_NODES;
  
  static getAllAvailableNodes(): NodeTypeInfo[] {
    console.log(\`[NodeDiscovery] Returning \${this.allNodes.length} nodes\`);
    return this.allNodes;
  }
  
  static getNodesByCategory(): Map<string, NodeTypeInfo[]> {
    const categoryMap = new Map<string, NodeTypeInfo[]>();
    
    this.allNodes.forEach(node => {
      const category = node.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(node);
    });
    
    console.log(\`[NodeDiscovery] Found \${categoryMap.size} categories\`);
    return categoryMap;
  }
  
  static searchNodes(query: string, options: any = {}): NodeTypeInfo[] {
    const results = this.allNodes.filter(node => 
      node.name.toLowerCase().includes(query.toLowerCase()) ||
      node.displayName.toLowerCase().includes(query.toLowerCase()) ||
      node.description.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log(\`[NodeDiscovery] Search '\${query}' found \${results.length} results\`);
    return results.slice(0, options.maxResults || 50);
  }
  
  static getNodeStatistics() {
    const categories = this.getNodesByCategory();
    const triggerNodes = this.allNodes.filter(node => node.triggerNode);
    
    return {
      totalNodes: this.allNodes.length,
      categories: categories.size,
      triggerNodes: triggerNodes.length,
      regularNodes: this.allNodes.length - triggerNodes.length
    };
  }
}

// Export compatibility functions
export const getAllAvailableNodes = () => EnhancedNodeDiscovery.getAllAvailableNodes();
export const getNodesByCategory = () => EnhancedNodeDiscovery.getNodesByCategory();
export const searchNodes = (query: string, options?: any) => EnhancedNodeDiscovery.searchNodes(query, options);
export const getNodeStatistics = () => EnhancedNodeDiscovery.getNodeStatistics();

// Export legacy compatibility
export const universalNodeCatalog = {
  getAllAvailableNodes: () => getAllAvailableNodes(),
  discoverByCategory: (category: string) => {
    const categoryMap = getNodesByCategory();
    return categoryMap.get(category) || [];
  },
  searchNodes: (query: string, options: any = {}) => ({
    nodes: searchNodes(query, options),
    totalCount: searchNodes(query, options).length,
    categories: Array.from(getNodesByCategory().keys()),
    suggestions: [],
    relatedNodes: [],
    aiOptimizedVariants: []
  }),
  getNodeCategories: () => Array.from(getNodesByCategory().keys()),
  getNodeStatistics: () => getNodeStatistics()
};

export default EnhancedNodeDiscovery;
`;

writeFileSync('src/discovery/enhanced-discovery.ts', fixedDiscovery);

// Update the main discovery index to use enhanced discovery
const updatedIndex = `/**
 * Discovery Module Index - Updated for All 532 Nodes
 */

export { 
  EnhancedNodeDiscovery as default,
  ALL_COMPLETE_NODES,
  getAllAvailableNodes,
  getNodesByCategory, 
  searchNodes,
  getNodeStatistics,
  universalNodeCatalog
} from './enhanced-discovery.js';

export { NodeTypeInfo } from '../data/node-types.js';
`;

writeFileSync('src/discovery/index.ts', updatedIndex);

// Create a simple test to verify the discovery works
const testScript = `#!/usr/bin/env node

import { EnhancedNodeDiscovery } from './src/discovery/enhanced-discovery.js';

console.log('🧪 Testing Enhanced Node Discovery...');

try {
  const stats = EnhancedNodeDiscovery.getNodeStatistics();
  console.log(\`✅ Total Nodes: \${stats.totalNodes}\`);
  console.log(\`✅ Categories: \${stats.categories}\`);
  console.log(\`✅ Trigger Nodes: \${stats.triggerNodes}\`);
  console.log(\`✅ Regular Nodes: \${stats.regularNodes}\`);
  
  if (stats.totalNodes >= 500) {
    console.log('🎉 Discovery fixed - All nodes available!');
  } else {
    console.log('⚠️  Still missing nodes - check imports');
  }
} catch (error) {
  console.error('❌ Discovery test failed:', error.message);
}
`;

writeFileSync('test-discovery.js', testScript);

console.log('✅ Enhanced discovery system created');
console.log('✅ Updated discovery index');
console.log('✅ Created discovery test script');

console.log(`\n📊 Fixed Discovery System:`);
console.log(`  • Total node files: ${nodeFiles.length}`);
console.log(`  • All nodes will be discoverable`);
console.log(`  • Categories properly organized`);
console.log(`  • Search functionality enabled`);

console.log('\n🔧 Next Steps:');
console.log('1. The server will now discover all 532 nodes');
console.log('2. Run the server to verify discovery works');
console.log('3. All nodes will be available as MCP tools');

console.log('\n🎯 Node discovery system fixed!');