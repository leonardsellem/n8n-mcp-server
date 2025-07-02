import path from 'path';

export interface LoadedNode {
  packageName: string;
  nodeName: string;
  NodeClass: any;
}

export class N8nNodeLoader {
  private readonly CORE_PACKAGES = [
    { name: 'n8n-nodes-base', path: 'n8n-nodes-base' },
    { name: '@n8n/n8n-nodes-langchain', path: '@n8n/n8n-nodes-langchain' }
  ];

  async loadAllNodes(): Promise<LoadedNode[]> {
    const results: LoadedNode[] = [];
    
    for (const pkg of this.CORE_PACKAGES) {
      try {
        console.log(`\n📦 Loading package: ${pkg.name} from ${pkg.path}`);
        // Use the path property to locate the package
        const packageJson = require(`${pkg.path}/package.json`);
        console.log(`  Found ${Object.keys(packageJson.n8n?.nodes || {}).length} nodes in package.json`);
        const nodes = await this.loadPackageNodes(pkg.name, pkg.path, packageJson);
        results.push(...nodes);
      } catch (error) {
        console.error(`Failed to load ${pkg.name}:`, error);
      }
    }
    
    return results;
  }

  private async loadPackageNodes(packageName: string, packagePath: string, packageJson: any): Promise<LoadedNode[]> {
    const n8nConfig = packageJson.n8n || {};
    const nodes: LoadedNode[] = [];
    
    // Check if nodes is an array or object
    const nodesList = n8nConfig.nodes || [];
    
    if (Array.isArray(nodesList)) {
      // Handle array format (n8n-nodes-base uses this)
      for (const nodePath of nodesList) {
        try {
          const fullPath = require.resolve(`${packagePath}/${nodePath}`);
          const nodeModule = require(fullPath);
          
          // Extract node name from path (e.g., "dist/nodes/Slack/Slack.node.js" -> "Slack")
          const nodeNameMatch = nodePath.match(/\/([^\/]+)\.node\.(js|ts)$/);
          const nodeName = nodeNameMatch ? nodeNameMatch[1] : path.basename(nodePath, '.node.js');
          
          // Handle default export and various export patterns
          const NodeClass = nodeModule.default || nodeModule[nodeName] || Object.values(nodeModule)[0];
          if (NodeClass) {
            nodes.push({ packageName, nodeName, NodeClass });
            console.log(`  ✓ Loaded ${nodeName} from ${packageName}`);
          } else {
            console.warn(`  ⚠ No valid export found for ${nodeName} in ${packageName}`);
          }
        } catch (error) {
          console.error(`  ✗ Failed to load node from ${packageName}/${nodePath}:`, (error as Error).message);
        }
      }
    } else {
      // Handle object format (for other packages)
      for (const [nodeName, nodePath] of Object.entries(nodesList)) {
        try {
          const fullPath = require.resolve(`${packagePath}/${nodePath as string}`);
          const nodeModule = require(fullPath);
          
          // Handle default export and various export patterns
          const NodeClass = nodeModule.default || nodeModule[nodeName] || Object.values(nodeModule)[0];
          if (NodeClass) {
            nodes.push({ packageName, nodeName, NodeClass });
            console.log(`  ✓ Loaded ${nodeName} from ${packageName}`);
          } else {
            console.warn(`  ⚠ No valid export found for ${nodeName} in ${packageName}`);
          }
        } catch (error) {
          console.error(`  ✗ Failed to load node ${nodeName} from ${packageName}:`, (error as Error).message);
        }
      }
    }
    
    return nodes;
  }
}