/**
 * Node Reference Validator
 * 
 * Validates that all node references in AI tools exist in the catalog
 */

import { ALL_COMPLETE_NODES } from '../../data/final-complete-catalog.js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface ValidationError {
  file: string;
  line: number;
  nodeType: string;
  context: string;
  severity: 'error' | 'warning';
}

export class NodeReferenceValidator {
  private availableNodes: Set<string>;
  private errors: ValidationError[] = [];

  constructor() {
    this.availableNodes = new Set(ALL_COMPLETE_NODES.map(node => node.name));
  }

  /**
   * Validate all AI workflow tools
   */
  validateAllTools(): ValidationError[] {
    this.errors = [];
    
    const toolsDir = '/mnt/c/Users/Chris Boyd/Documents/MCP-Servers/n8n-mcp-server/src/tools';
    this.validateDirectory(toolsDir);
    
    return this.errors;
  }

  /**
   * Validate a specific directory recursively
   */
  private validateDirectory(dirPath: string): void {
    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          this.validateDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
          this.validateFile(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or permission error
    }
  }

  /**
   * Validate node references in a single file
   */
  private validateFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Look for n8n node references
        const nodeMatches = line.match(/['"`]n8n-nodes-[^'"`]+['"`]/g);
        
        if (nodeMatches) {
          nodeMatches.forEach(match => {
            const nodeType = match.slice(1, -1); // Remove quotes
            
            if (!this.availableNodes.has(nodeType)) {
              this.errors.push({
                file: filePath,
                line: index + 1,
                nodeType,
                context: line.trim(),
                severity: 'error'
              });
            }
          });
        }
      });
    } catch (error) {
      // File read error
    }
  }

  /**
   * Get available nodes list
   */
  getAvailableNodes(): string[] {
    return Array.from(this.availableNodes).sort();
  }

  /**
   * Suggest alternatives for missing nodes
   */
  suggestAlternatives(missingNode: string): string[] {
    const suggestions: string[] = [];
    const nodeName = missingNode.split('.').pop() || '';
    
    // Look for similar nodes
    for (const availableNode of this.availableNodes) {
      const availableName = availableNode.split('.').pop() || '';
      
      // Check for similar naming
      if (availableName.includes(nodeName) || nodeName.includes(availableName)) {
        suggestions.push(availableNode);
      }
    }
    
    // Category-based suggestions
    if (missingNode.includes('email') || missingNode.includes('mail')) {
      suggestions.push('n8n-nodes-base.gmail');
    }
    
    if (missingNode.includes('http') || missingNode.includes('request')) {
      suggestions.push('n8n-nodes-base.httpRequest');
    }
    
    if (missingNode.includes('webhook')) {
      suggestions.push('n8n-nodes-base.webhook');
    }
    
    return [...new Set(suggestions)];
  }

  /**
   * Generate validation report
   */
  generateReport(): string {
    const report = [
      '# Node Reference Validation Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      `## Summary`,
      `- Total Available Nodes: ${this.availableNodes.size}`,
      `- Validation Errors: ${this.errors.length}`,
      ''
    ];

    if (this.errors.length === 0) {
      report.push('✅ All node references are valid!');
      return report.join('\n');
    }

    report.push('## Errors Found');
    report.push('');

    // Group errors by node type
    const errorsByNode = new Map<string, ValidationError[]>();
    this.errors.forEach(error => {
      if (!errorsByNode.has(error.nodeType)) {
        errorsByNode.set(error.nodeType, []);
      }
      errorsByNode.get(error.nodeType)!.push(error);
    });

    errorsByNode.forEach((errors, nodeType) => {
      report.push(`### Missing Node: \`${nodeType}\``);
      report.push(`Found in ${errors.length} location(s):`);
      
      errors.forEach(error => {
        const relativePath = error.file.replace('/mnt/c/Users/Chris Boyd/Documents/MCP-Servers/n8n-mcp-server/', '');
        report.push(`- ${relativePath}:${error.line}`);
        report.push(`  \`${error.context}\``);
      });
      
      const suggestions = this.suggestAlternatives(nodeType);
      if (suggestions.length > 0) {
        report.push(`**Suggested alternatives:**`);
        suggestions.forEach(suggestion => {
          report.push(`- \`${suggestion}\``);
        });
      }
      
      report.push('');
    });

    report.push('## Available Nodes');
    report.push('');
    this.getAvailableNodes().forEach(node => {
      report.push(`- \`${node}\``);
    });

    return report.join('\n');
  }
}

export default NodeReferenceValidator;