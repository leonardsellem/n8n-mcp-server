/**
 * Property Dependencies Service
 * 
 * Analyzes property dependencies and visibility conditions.
 * Helps AI agents understand which properties affect others.
 */

export interface PropertyDependency {
  property: string;
  displayName: string;
  dependsOn: DependencyCondition[];
  showWhen?: Record<string, any>;
  hideWhen?: Record<string, any>;
  enablesProperties?: string[];
  disablesProperties?: string[];
  notes?: string[];
}

export interface DependencyCondition {
  property: string;
  values: any[];
  condition: 'equals' | 'not_equals' | 'includes' | 'not_includes';
  description?: string;
}

export interface DependencyAnalysis {
  totalProperties: number;
  propertiesWithDependencies: number;
  dependencies: PropertyDependency[];
  dependencyGraph: Record<string, string[]>;
  suggestions: string[];
}

export class PropertyDependencies {
  /**
   * Analyze property dependencies for a node
   */
  static analyze(properties: any[]): DependencyAnalysis {
    const dependencies: PropertyDependency[] = [];
    const dependencyGraph: Record<string, string[]> = {};
    const suggestions: string[] = [];
    
    // First pass: Find all properties with display conditions
    for (const prop of properties) {
      if (prop.displayOptions?.show || prop.displayOptions?.hide) {
        const dependency = this.extractDependency(prop, properties);
        dependencies.push(dependency);
        
        // Build dependency graph
        for (const condition of dependency.dependsOn) {
          if (!dependencyGraph[condition.property]) {
            dependencyGraph[condition.property] = [];
          }
          dependencyGraph[condition.property].push(prop.name);
        }
      }
    }
    
    // Second pass: Find which properties enable/disable others
    for (const dep of dependencies) {
      dep.enablesProperties = dependencyGraph[dep.property] || [];
    }
    
    // Generate suggestions
    this.generateSuggestions(dependencies, suggestions);
    
    return {
      totalProperties: properties.length,
      propertiesWithDependencies: dependencies.length,
      dependencies,
      dependencyGraph,
      suggestions
    };
  }
  
  /**
   * Extract dependency information from a property
   */
  private static extractDependency(prop: any, allProperties: any[]): PropertyDependency {
    const dependency: PropertyDependency = {
      property: prop.name,
      displayName: prop.displayName || prop.name,
      dependsOn: [],
      showWhen: prop.displayOptions?.show,
      hideWhen: prop.displayOptions?.hide,
      notes: []
    };
    
    // Extract show conditions
    if (prop.displayOptions?.show) {
      for (const [key, values] of Object.entries(prop.displayOptions.show)) {
        const valuesArray = Array.isArray(values) ? values : [values];
        dependency.dependsOn.push({
          property: key,
          values: valuesArray,
          condition: 'equals',
          description: this.generateConditionDescription(key, valuesArray, 'show', allProperties)
        });
      }
    }
    
    // Extract hide conditions
    if (prop.displayOptions?.hide) {
      for (const [key, values] of Object.entries(prop.displayOptions.hide)) {
        const valuesArray = Array.isArray(values) ? values : [values];
        dependency.dependsOn.push({
          property: key,
          values: valuesArray,
          condition: 'not_equals',
          description: this.generateConditionDescription(key, valuesArray, 'hide', allProperties)
        });
      }
    }
    
    // Add helpful notes
    if (prop.type === 'collection' || prop.type === 'fixedCollection') {
      dependency.notes?.push('This property contains nested properties that may have their own dependencies');
    }
    
    if (dependency.dependsOn.length > 1) {
      dependency.notes?.push('Multiple conditions must be met for this property to be visible');
    }
    
    return dependency;
  }
  
  /**
   * Generate human-readable condition description
   */
  private static generateConditionDescription(
    property: string,
    values: any[],
    type: 'show' | 'hide',
    allProperties: any[]
  ): string {
    const prop = allProperties.find(p => p.name === property);
    const propName = prop?.displayName || property;
    
    if (type === 'show') {
      if (values.length === 1) {
        return `Visible when ${propName} is set to "${values[0]}"`;
      } else {
        return `Visible when ${propName} is one of: ${values.map(v => `"${v}"`).join(', ')}`;
      }
    } else {
      if (values.length === 1) {
        return `Hidden when ${propName} is set to "${values[0]}"`;
      } else {
        return `Hidden when ${propName} is one of: ${values.map(v => `"${v}"`).join(', ')}`;
      }
    }
  }
  
  /**
   * Generate suggestions based on dependency analysis
   */
  private static generateSuggestions(dependencies: PropertyDependency[], suggestions: string[]): void {
    // Find properties that control many others
    const controllers = new Map<string, number>();
    for (const dep of dependencies) {
      for (const condition of dep.dependsOn) {
        controllers.set(condition.property, (controllers.get(condition.property) || 0) + 1);
      }
    }
    
    // Suggest key properties to configure first
    const sortedControllers = Array.from(controllers.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (sortedControllers.length > 0) {
      suggestions.push(
        `Key properties to configure first: ${sortedControllers.map(([prop]) => prop).join(', ')}`
      );
    }
    
    // Find complex dependency chains
    const complexDeps = dependencies.filter(d => d.dependsOn.length > 1);
    if (complexDeps.length > 0) {
      suggestions.push(
        `${complexDeps.length} properties have multiple dependencies - check their conditions carefully`
      );
    }
    
    // Find circular dependencies (simplified check)
    for (const dep of dependencies) {
      for (const condition of dep.dependsOn) {
        const targetDep = dependencies.find(d => d.property === condition.property);
        if (targetDep?.dependsOn.some(c => c.property === dep.property)) {
          suggestions.push(
            `Circular dependency detected between ${dep.property} and ${condition.property}`
          );
        }
      }
    }
  }
  
  /**
   * Get properties that would be visible/hidden given a configuration
   */
  static getVisibilityImpact(
    properties: any[],
    config: Record<string, any>
  ): { visible: string[]; hidden: string[]; reasons: Record<string, string> } {
    const visible: string[] = [];
    const hidden: string[] = [];
    const reasons: Record<string, string> = {};
    
    for (const prop of properties) {
      const { isVisible, reason } = this.checkVisibility(prop, config);
      
      if (isVisible) {
        visible.push(prop.name);
      } else {
        hidden.push(prop.name);
      }
      
      if (reason) {
        reasons[prop.name] = reason;
      }
    }
    
    return { visible, hidden, reasons };
  }
  
  /**
   * Check if a property is visible given current configuration
   */
  private static checkVisibility(
    prop: any,
    config: Record<string, any>
  ): { isVisible: boolean; reason?: string } {
    if (!prop.displayOptions) {
      return { isVisible: true };
    }
    
    // Check show conditions
    if (prop.displayOptions.show) {
      for (const [key, values] of Object.entries(prop.displayOptions.show)) {
        const configValue = config[key];
        const expectedValues = Array.isArray(values) ? values : [values];
        
        if (!expectedValues.includes(configValue)) {
          return {
            isVisible: false,
            reason: `Hidden because ${key} is "${configValue}" (needs to be ${expectedValues.join(' or ')})`
          };
        }
      }
    }
    
    // Check hide conditions
    if (prop.displayOptions.hide) {
      for (const [key, values] of Object.entries(prop.displayOptions.hide)) {
        const configValue = config[key];
        const expectedValues = Array.isArray(values) ? values : [values];
        
        if (expectedValues.includes(configValue)) {
          return {
            isVisible: false,
            reason: `Hidden because ${key} is "${configValue}"`
          };
        }
      }
    }
    
    return { isVisible: true };
  }
}