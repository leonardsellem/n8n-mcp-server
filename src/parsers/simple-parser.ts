export interface ParsedNode {
  style: 'declarative' | 'programmatic';
  nodeType: string;
  displayName: string;
  description?: string;
  category?: string;
  properties: any[];
  credentials: string[];
  isAITool: boolean;
  isTrigger: boolean;
  isWebhook: boolean;
  operations: any[];
  version?: string;
  isVersioned: boolean;
}

export class SimpleParser {
  parse(nodeClass: any): ParsedNode {
    let description: any;
    let isVersioned = false;
    
    // Try to get description from the class
    try {
      // Check if it's a versioned node (has baseDescription and nodeVersions)
      if (typeof nodeClass === 'function' && nodeClass.prototype && 
          nodeClass.prototype.constructor && 
          nodeClass.prototype.constructor.name === 'VersionedNodeType') {
        // This is a VersionedNodeType class - instantiate it
        const instance = new nodeClass();
        description = instance.baseDescription || {};
        isVersioned = true;
        
        // For versioned nodes, try to get properties from the current version
        if (instance.nodeVersions && instance.currentVersion) {
          const currentVersionNode = instance.nodeVersions[instance.currentVersion];
          if (currentVersionNode && currentVersionNode.description) {
            // Merge baseDescription with version-specific description
            description = { ...description, ...currentVersionNode.description };
          }
        }
      } else if (typeof nodeClass === 'function') {
        // Try to instantiate to get description
        try {
          const instance = new nodeClass();
          description = instance.description || {};
          
          // For versioned nodes, we might need to look deeper
          if (!description.name && instance.baseDescription) {
            description = instance.baseDescription;
            isVersioned = true;
          }
        } catch (e) {
          // Some nodes might require parameters to instantiate
          // Try to access static properties or look for common patterns
          description = {};
        }
      } else {
        // Maybe it's already an instance
        description = nodeClass.description || {};
      }
    } catch (error) {
      // If instantiation fails, try to get static description
      description = nodeClass.description || {};
    }
    
    const isDeclarative = !!description.routing;
    
    // Ensure we have a valid nodeType
    if (!description.name) {
      throw new Error('Node is missing name property');
    }
    
    return {
      style: isDeclarative ? 'declarative' : 'programmatic',
      nodeType: description.name,
      displayName: description.displayName || description.name,
      description: description.description,
      category: description.group?.[0] || description.categories?.[0],
      properties: description.properties || [],
      credentials: description.credentials || [],
      isAITool: description.usableAsTool === true,
      isTrigger: description.polling === true || description.trigger === true,
      isWebhook: description.webhooks?.length > 0,
      operations: isDeclarative ? this.extractOperations(description.routing) : this.extractProgrammaticOperations(description),
      version: this.extractVersion(nodeClass),
      isVersioned: isVersioned || this.isVersionedNode(nodeClass) || Array.isArray(description.version) || description.defaultVersion !== undefined
    };
  }
  
  private extractOperations(routing: any): any[] {
    // Simple extraction without complex logic
    const operations: any[] = [];
    
    // Try different locations where operations might be defined
    if (routing?.request) {
      // Check for resources
      const resources = routing.request.resource?.options || [];
      resources.forEach((resource: any) => {
        operations.push({
          resource: resource.value,
          name: resource.name
        });
      });
      
      // Check for operations within resources
      const operationOptions = routing.request.operation?.options || [];
      operationOptions.forEach((operation: any) => {
        operations.push({
          operation: operation.value,
          name: operation.name || operation.displayName
        });
      });
    }
    
    // Also check if operations are defined at the top level
    if (routing?.operations) {
      Object.entries(routing.operations).forEach(([key, value]: [string, any]) => {
        operations.push({
          operation: key,
          name: value.displayName || key
        });
      });
    }
    
    return operations;
  }
  
  private extractProgrammaticOperations(description: any): any[] {
    const operations: any[] = [];
    
    if (!description.properties || !Array.isArray(description.properties)) {
      return operations;
    }
    
    // Find resource property
    const resourceProp = description.properties.find((p: any) => p.name === 'resource' && p.type === 'options');
    if (resourceProp && resourceProp.options) {
      // Extract resources
      resourceProp.options.forEach((resource: any) => {
        operations.push({
          type: 'resource',
          resource: resource.value,
          name: resource.name
        });
      });
    }
    
    // Find operation properties for each resource
    const operationProps = description.properties.filter((p: any) => 
      p.name === 'operation' && p.type === 'options' && p.displayOptions
    );
    
    operationProps.forEach((opProp: any) => {
      if (opProp.options) {
        opProp.options.forEach((operation: any) => {
          // Try to determine which resource this operation belongs to
          const resourceCondition = opProp.displayOptions?.show?.resource;
          const resources = Array.isArray(resourceCondition) ? resourceCondition : [resourceCondition];
          
          operations.push({
            type: 'operation',
            operation: operation.value,
            name: operation.name,
            action: operation.action,
            resources: resources
          });
        });
      }
    });
    
    return operations;
  }

  private extractVersion(nodeClass: any): string {
    if (nodeClass.baseDescription?.defaultVersion) {
      return nodeClass.baseDescription.defaultVersion.toString();
    }
    return nodeClass.description?.version || '1';
  }

  private isVersionedNode(nodeClass: any): boolean {
    // Check for VersionedNodeType pattern
    if (nodeClass.baseDescription && nodeClass.nodeVersions) {
      return true;
    }
    
    // Check for inline versioning pattern (like Code node)
    try {
      const instance = typeof nodeClass === 'function' ? new nodeClass() : nodeClass;
      const description = instance.description || {};
      
      // If version is an array, it's versioned
      if (Array.isArray(description.version)) {
        return true;
      }
      
      // If it has defaultVersion, it's likely versioned
      if (description.defaultVersion !== undefined) {
        return true;
      }
    } catch (e) {
      // Ignore instantiation errors
    }
    
    return false;
  }
}