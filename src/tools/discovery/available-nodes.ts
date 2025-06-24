/**
 * Available Nodes Discovery - Core Discovery Enhancement
 * 
 * This module provides comprehensive available node discovery with filtering,
 * leveraging the Phase 1 Enhanced Discovery system.
 */

import { BaseDiscoveryToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { universalNodeCatalog } from '../../discovery/index.js';
import { dualNodeArchitecture } from '../../discovery/dual-architecture.js';

/**
 * Available nodes discovery request interface
 */
export interface AvailableNodesRequest {
  category?: string;
  limit?: number;
  includeAIOptimized?: boolean;
  includeDeprecated?: boolean;
  sortBy?: 'name' | 'category' | 'popularity' | 'updated';
  filterBy?: {
    triggerNodes?: boolean;
    hasCredentials?: boolean;
    hasWebhookSupport?: boolean;
  };
}

/**
 * Available nodes discovery result interface
 */
export interface AvailableNodesResult {
  nodes: Array<{
    name: string;
    displayName: string;
    description: string;
    category: string;
    subcategory?: string;
    version: string;
    triggerNode: boolean;
    regularNode: boolean;
    webhookSupport: boolean;
    credentials?: string[];
    aiOptimized?: boolean;
    popularity?: number;
    lastUpdated?: string;
  }>;
  statistics: {
    totalNodes: number;
    categoryCounts: { [category: string]: number };
    triggerNodes: number;
    regularNodes: number;
    aiOptimizedNodes: number;
    webhookSupportNodes: number;
  };
  categories: string[];
  recommendations?: Array<{
    node: string;
    reason: string;
    useCase: string;
  }>;
}

/**
 * Discover Available Nodes Handler
 */
export class DiscoverAvailableNodesHandler extends BaseDiscoveryToolHandler {
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const {
        category,
        limit = 50,
        includeAIOptimized = true,
        includeDeprecated = false,
        sortBy = 'category',
        filterBy = {}
      } = args;

      console.error(`[DiscoverAvailableNodesHandler] Discovering available nodes${category ? ` in category: ${category}` : ''}`);

      const request: AvailableNodesRequest = {
        category,
        limit,
        includeAIOptimized,
        includeDeprecated,
        sortBy,
        filterBy
      };

      // Get all available nodes from Universal Node Catalog
      const allNodes = await this.getAllAvailableNodes();
      console.error(`[DiscoverAvailableNodesHandler] Found ${allNodes.length} total nodes`);

      // Apply filters
      const filteredNodes = await this.applyFilters(allNodes, request);
      console.error(`[DiscoverAvailableNodesHandler] After filtering: ${filteredNodes.length} nodes`);

      // Enhance nodes with additional information
      const enhancedNodes = await this.enhanceNodesWithMetadata(filteredNodes, request);

      // Sort nodes
      const sortedNodes = this.sortNodes(enhancedNodes, request.sortBy!);

      // Limit results
      const limitedNodes = sortedNodes.slice(0, limit);

      // Generate statistics
      const statistics = this.generateStatistics(allNodes, filteredNodes);

      // Get categories
      const categories = this.extractCategories(allNodes);

      // Generate recommendations if no category specified
      let recommendations;
      if (!category) {
        recommendations = await this.generateRecommendations(limitedNodes.slice(0, 5));
      }

      const result: AvailableNodesResult = {
        nodes: limitedNodes,
        statistics,
        categories,
        recommendations
      };

      return this.formatSuccess(
        result,
        `Discovered ${limitedNodes.length} available nodes${category ? ` in ${category} category` : ''}`
      );
    }, args);
  }

  private async getAllAvailableNodes(): Promise<any[]> {
    try {
      return await universalNodeCatalog.getAllAvailableNodes();
    } catch (error) {
      console.error(`[DiscoverAvailableNodesHandler] Failed to get nodes from catalog:`, error);
      // Fallback to basic node list
      return this.getFallbackNodeList();
    }
  }

  private async applyFilters(nodes: any[], request: AvailableNodesRequest): Promise<any[]> {
    let filtered = [...nodes];

    // Category filter
    if (request.category) {
      filtered = filtered.filter(node => 
        node.category?.toLowerCase().includes(request.category!.toLowerCase())
      );
    }

    // Filter by node type
    if (request.filterBy?.triggerNodes !== undefined) {
      filtered = filtered.filter(node => 
        node.triggerNode === request.filterBy!.triggerNodes
      );
    }

    // Filter by credentials requirement
    if (request.filterBy?.hasCredentials !== undefined) {
      filtered = filtered.filter(node => {
        const hasCredentials = node.credentials && node.credentials.length > 0;
        return hasCredentials === request.filterBy!.hasCredentials;
      });
    }

    // Filter by webhook support
    if (request.filterBy?.hasWebhookSupport !== undefined) {
      filtered = filtered.filter(node => 
        node.webhookSupport === request.filterBy!.hasWebhookSupport
      );
    }

    // Filter deprecated nodes
    if (!request.includeDeprecated) {
      filtered = filtered.filter(node => !node.deprecated);
    }

    return filtered;
  }

  private async enhanceNodesWithMetadata(nodes: any[], request: AvailableNodesRequest): Promise<any[]> {
    const enhanced = [];

    for (const node of nodes) {
      try {
        const enhancedNode: any = {
          name: node.name,
          displayName: node.displayName,
          description: node.description,
          category: node.category,
          subcategory: node.subcategory,
          version: node.version || '1.0.0',
          triggerNode: node.triggerNode || false,
          regularNode: node.regularNode !== false,
          webhookSupport: node.webhookSupport || false,
          credentials: node.credentials || [],
          popularity: this.calculatePopularity(node),
          lastUpdated: node.lastUpdated || new Date().toISOString()
        };

        // Add AI optimization info if requested
        if (request.includeAIOptimized) {
          try {
            const toolVariant = await dualNodeArchitecture.getToolVariant(node);
            enhancedNode.aiOptimized = toolVariant?.aiOptimized || false;
          } catch (error) {
            enhancedNode.aiOptimized = false;
          }
        }

        enhanced.push(enhancedNode);
      } catch (error) {
        console.error(`[DiscoverAvailableNodesHandler] Enhancement failed for node ${node.name}:`, error);
        enhanced.push(node); // Include original if enhancement fails
      }
    }

    return enhanced;
  }

  private sortNodes(nodes: any[], sortBy: string): any[] {
    switch (sortBy) {
      case 'name':
        return nodes.sort((a, b) => a.displayName.localeCompare(b.displayName));
      case 'category':
        return nodes.sort((a, b) => {
          const categoryCompare = a.category.localeCompare(b.category);
          return categoryCompare !== 0 ? categoryCompare : a.displayName.localeCompare(b.displayName);
        });
      case 'popularity':
        return nodes.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'updated':
        return nodes.sort((a, b) => 
          new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
        );
      default:
        return nodes;
    }
  }

  private generateStatistics(allNodes: any[], filteredNodes: any[]): any {
    const categoryCounts: { [category: string]: number } = {};
    let triggerNodes = 0;
    let regularNodes = 0;
    let aiOptimizedNodes = 0;
    let webhookSupportNodes = 0;

    filteredNodes.forEach(node => {
      // Count by category
      const category = node.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;

      // Count node types
      if (node.triggerNode) triggerNodes++;
      if (node.regularNode) regularNodes++;
      if (node.aiOptimized) aiOptimizedNodes++;
      if (node.webhookSupport) webhookSupportNodes++;
    });

    return {
      totalNodes: filteredNodes.length,
      categoryCounts,
      triggerNodes,
      regularNodes,
      aiOptimizedNodes,
      webhookSupportNodes
    };
  }

  private extractCategories(nodes: any[]): string[] {
    const categories = new Set<string>();
    nodes.forEach(node => {
      if (node.category) {
        categories.add(node.category);
      }
    });
    return Array.from(categories).sort();
  }

  private async generateRecommendations(topNodes: any[]): Promise<any[]> {
    const recommendations = [];

    // Recommend popular trigger nodes
    const triggerNodes = topNodes.filter(node => node.triggerNode);
    if (triggerNodes.length > 0) {
      recommendations.push({
        node: triggerNodes[0].displayName,
        reason: 'Popular trigger node for starting workflows',
        useCase: 'Workflow automation triggering'
      });
    }

    // Recommend AI-optimized nodes
    const aiNodes = topNodes.filter(node => node.aiOptimized);
    if (aiNodes.length > 0) {
      recommendations.push({
        node: aiNodes[0].displayName,
        reason: 'AI-optimized for enhanced performance',
        useCase: 'Intelligent data processing'
      });
    }

    // Recommend webhook-enabled nodes
    const webhookNodes = topNodes.filter(node => node.webhookSupport);
    if (webhookNodes.length > 0) {
      recommendations.push({
        node: webhookNodes[0].displayName,
        reason: 'Supports real-time webhook processing',
        useCase: 'Real-time event handling'
      });
    }

    return recommendations.slice(0, 3);
  }

  private calculatePopularity(node: any): number {
    let popularity = 0.5; // Base popularity

    // Boost for common categories
    const popularCategories = ['Communication', 'Data', 'Core Utilities', 'AI'];
    if (popularCategories.includes(node.category)) {
      popularity += 0.2;
    }

    // Boost for trigger nodes
    if (node.triggerNode) {
      popularity += 0.1;
    }

    // Boost for webhook support
    if (node.webhookSupport) {
      popularity += 0.1;
    }

    // Boost for AI optimization
    if (node.aiOptimized) {
      popularity += 0.1;
    }

    return Math.min(1.0, popularity);
  }

  private getFallbackNodeList(): any[] {
    // Fallback list of common n8n nodes
    return [
      {
        name: 'n8n-nodes-base.webhook',
        displayName: 'Webhook',
        description: 'Receive HTTP requests',
        category: 'Trigger Nodes',
        triggerNode: true,
        webhookSupport: true
      },
      {
        name: 'n8n-nodes-base.httpRequest',
        displayName: 'HTTP Request',
        description: 'Make HTTP requests',
        category: 'Core Utilities',
        regularNode: true
      },
      {
        name: 'n8n-nodes-base.function',
        displayName: 'Function',
        description: 'Execute JavaScript code',
        category: 'Core Utilities',
        regularNode: true
      },
      {
        name: 'n8n-nodes-base.gmail',
        displayName: 'Gmail',
        description: 'Google email service',
        category: 'Communication',
        regularNode: true,
        credentials: ['gmailOAuth2']
      },
      {
        name: 'n8n-nodes-base.slack',
        displayName: 'Slack',
        description: 'Team communication platform',
        category: 'Communication',
        regularNode: true,
        credentials: ['slackOAuth2']
      }
    ];
  }
}

// Tool definitions
export function getDiscoverAvailableNodesToolDefinition(): ToolDefinition {
  return {
    name: 'discover_available_nodes',
    description: 'Discover and list all available n8n nodes with filtering and sorting capabilities',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter nodes by category (e.g., "Communication", "Data", "AI")'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of nodes to return (default: 50)',
          default: 50
        },
        includeAIOptimized: {
          type: 'boolean',
          description: 'Include AI optimization information (default: true)',
          default: true
        },
        includeDeprecated: {
          type: 'boolean',
          description: 'Include deprecated nodes in results (default: false)',
          default: false
        },
        sortBy: {
          type: 'string',
          enum: ['name', 'category', 'popularity', 'updated'],
          description: 'Sort nodes by specified criteria (default: "category")',
          default: 'category'
        },
        filterBy: {
          type: 'object',
          properties: {
            triggerNodes: {
              type: 'boolean',
              description: 'Filter to only trigger nodes (true) or only regular nodes (false)'
            },
            hasCredentials: {
              type: 'boolean',
              description: 'Filter nodes that require credentials (true) or no credentials (false)'
            },
            hasWebhookSupport: {
              type: 'boolean',
              description: 'Filter nodes with webhook support (true) or without (false)'
            }
          },
          description: 'Additional filtering criteria'
        }
      },
      required: []
    }
  };
}