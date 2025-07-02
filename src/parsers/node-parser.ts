import { PropertyExtractor } from './property-extractor';

export interface ParsedNode {
  style: 'declarative' | 'programmatic';
  nodeType: string;
  displayName: string;
  description?: string;
  category?: string;
  properties: any[];
  credentials: any[];
  isAITool: boolean;
  isTrigger: boolean;
  isWebhook: boolean;
  operations: any[];
  version?: string;
  isVersioned: boolean;
  packageName: string;
  documentation?: string;
}

export class NodeParser {
  private propertyExtractor = new PropertyExtractor();
  
  parse(nodeClass: any, packageName: string): ParsedNode {
    // Get base description (handles versioned nodes)
    const description = this.getNodeDescription(nodeClass);
    
    return {
      style: this.detectStyle(nodeClass),
      nodeType: this.extractNodeType(description, packageName),
      displayName: description.displayName || description.name,
      description: description.description,
      category: this.extractCategory(description),
      properties: this.propertyExtractor.extractProperties(nodeClass),
      credentials: this.propertyExtractor.extractCredentials(nodeClass),
      isAITool: this.propertyExtractor.detectAIToolCapability(nodeClass),
      isTrigger: this.detectTrigger(description),
      isWebhook: this.detectWebhook(description),
      operations: this.propertyExtractor.extractOperations(nodeClass),
      version: this.extractVersion(nodeClass),
      isVersioned: this.detectVersioned(nodeClass),
      packageName: packageName
    };
  }
  
  private getNodeDescription(nodeClass: any): any {
    // Try to get description from the class first
    let description: any;
    
    // Check if it's a versioned node (has baseDescription and nodeVersions)
    if (typeof nodeClass === 'function' && nodeClass.prototype && 
        nodeClass.prototype.constructor && 
        nodeClass.prototype.constructor.name === 'VersionedNodeType') {
      // This is a VersionedNodeType class - instantiate it
      const instance = new nodeClass();
      description = instance.baseDescription || {};
    } else if (typeof nodeClass === 'function') {
      // Try to instantiate to get description
      try {
        const instance = new nodeClass();
        description = instance.description || {};
        
        // For versioned nodes, we might need to look deeper
        if (!description.name && instance.baseDescription) {
          description = instance.baseDescription;
        }
      } catch (e) {
        // Some nodes might require parameters to instantiate
        // Try to access static properties
        description = nodeClass.description || {};
      }
    } else {
      // Maybe it's already an instance
      description = nodeClass.description || {};
    }
    
    return description;
  }
  
  private detectStyle(nodeClass: any): 'declarative' | 'programmatic' {
    const desc = this.getNodeDescription(nodeClass);
    return desc.routing ? 'declarative' : 'programmatic';
  }
  
  private extractNodeType(description: any, packageName: string): string {
    // Ensure we have the full node type including package prefix
    const name = description.name;
    
    if (!name) {
      throw new Error('Node is missing name property');
    }
    
    if (name.includes('.')) {
      return name;
    }
    
    // Add package prefix if missing
    const packagePrefix = packageName.replace('@n8n/', '').replace('n8n-', '');
    return `${packagePrefix}.${name}`;
  }
  
  private extractCategory(description: any): string {
    return description.group?.[0] || 
           description.categories?.[0] || 
           description.category || 
           'misc';
  }
  
  private detectTrigger(description: any): boolean {
    return description.polling === true || 
           description.trigger === true ||
           description.eventTrigger === true ||
           description.name?.toLowerCase().includes('trigger');
  }
  
  private detectWebhook(description: any): boolean {
    return (description.webhooks?.length > 0) ||
           description.webhook === true ||
           description.name?.toLowerCase().includes('webhook');
  }
  
  private extractVersion(nodeClass: any): string {
    // Handle VersionedNodeType with defaultVersion
    if (nodeClass.baseDescription?.defaultVersion) {
      return nodeClass.baseDescription.defaultVersion.toString();
    }
    
    // Handle VersionedNodeType with nodeVersions
    if (nodeClass.nodeVersions) {
      const versions = Object.keys(nodeClass.nodeVersions);
      return Math.max(...versions.map(Number)).toString();
    }
    
    // Check instance for nodeVersions and version arrays
    try {
      const instance = typeof nodeClass === 'function' ? new nodeClass() : nodeClass;
      
      // Handle instance-level nodeVersions
      if (instance?.nodeVersions) {
        const versions = Object.keys(instance.nodeVersions);
        return Math.max(...versions.map(Number)).toString();
      }
      
      // Handle version array in description (e.g., [1, 1.1, 1.2])
      if (instance?.description?.version) {
        const version = instance.description.version;
        if (Array.isArray(version)) {
          // Find the maximum version from the array
          const maxVersion = Math.max(...version.map((v: any) => parseFloat(v.toString())));
          return maxVersion.toString();
        } else if (typeof version === 'number' || typeof version === 'string') {
          return version.toString();
        }
      }
    } catch (e) {
      // Some nodes might require parameters to instantiate
      // Try to get version from class-level description
    }
    
    // Also check class-level description for version array
    const description = this.getNodeDescription(nodeClass);
    if (description?.version) {
      if (Array.isArray(description.version)) {
        const maxVersion = Math.max(...description.version.map((v: any) => parseFloat(v.toString())));
        return maxVersion.toString();
      } else if (typeof description.version === 'number' || typeof description.version === 'string') {
        return description.version.toString();
      }
    }
    
    // Default to version 1
    return '1';
  }
  
  private detectVersioned(nodeClass: any): boolean {
    // Check class-level nodeVersions
    if (nodeClass.nodeVersions || nodeClass.baseDescription?.defaultVersion) {
      return true;
    }
    
    // Check instance-level nodeVersions and version arrays
    try {
      const instance = typeof nodeClass === 'function' ? new nodeClass() : nodeClass;
      
      // Check for nodeVersions
      if (instance?.nodeVersions) {
        return true;
      }
      
      // Check for version array in description
      if (instance?.description?.version && Array.isArray(instance.description.version)) {
        return true;
      }
    } catch (e) {
      // Some nodes might require parameters to instantiate
      // Try to check class-level description
    }
    
    // Also check class-level description for version array
    const description = this.getNodeDescription(nodeClass);
    if (description?.version && Array.isArray(description.version)) {
      return true;
    }
    
    return false;
  }
}