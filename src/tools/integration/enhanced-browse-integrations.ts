/**
 * Enhanced Browse Integrations Tool
 * 
 * Comprehensive integration discovery using the full 1000+ node registry.
 */

import { IntegrationBaseHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import {
  ALL_COMPLETE_NODES,
  searchNodes,
  getNodesByCategory,
  completeN8NCatalog
} from '../../data/final-complete-catalog.js';

interface EnhancedBrowseArgs {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  includeDetails?: boolean;
  sortBy?: 'name' | 'popularity' | 'category' | 'updated';
  filterBy?: {
    official?: boolean;
    ai?: boolean;
    triggerNodes?: boolean;
    requiresCredentials?: boolean;
    subcategory?: string;
  };
}

interface IntegrationResult {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory?: string;
  nodeType: string;
  isOfficial: boolean;
  isTrigger: boolean;
  isRegular: boolean;
  hasCredentials: boolean;
  webhookSupport?: boolean;
  codeable?: boolean;
  inputCount: number;
  outputCount: number;
  propertyCount: number;
  credentials?: string[];
  tags?: string[];
  examples?: any[];
}

export class EnhancedBrowseIntegrationsHandler extends IntegrationBaseHandler {
  async execute(args: EnhancedBrowseArgs): Promise<ToolCallResult> {
    try {
      const {
        category,
        search,
        limit = 50,
        offset = 0,
        includeDetails = false,
        sortBy = 'name',
        filterBy = {}
      } = args;

      // Start with all nodes
      let nodes = [...ALL_MASSIVE_NODES];

      // Apply category filter
      if (category) {
        const categoriesMap = getNodesByCategory();
        nodes = categoriesMap.get(category) || [];
      }

      // Apply search filter
      if (search) {
        const searchResults = searchNodes(search);
        nodes = searchResults.map((result: any) => result.node);
      }

      // Apply additional filters
      if (filterBy.ai) {
        nodes = nodes.filter(node => node.category === 'AI');
      }

      if (filterBy.triggerNodes !== undefined) {
        nodes = nodes.filter(node => node.triggerNode === filterBy.triggerNodes);
      }

      if (filterBy.requiresCredentials !== undefined) {
        nodes = nodes.filter(node => 
          filterBy.requiresCredentials 
            ? node.credentials && node.credentials.length > 0
            : !node.credentials || node.credentials.length === 0
        );
      }

      if (filterBy.subcategory) {
        nodes = nodes.filter(node => 
          node.subcategory?.toLowerCase().includes(filterBy.subcategory!.toLowerCase())
        );
      }

      // Apply sorting
      nodes.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.displayName.localeCompare(b.displayName);
          case 'category':
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category);
            }
            return a.displayName.localeCompare(b.displayName);
          case 'popularity':
            // Sort by type: triggers first, then regular nodes, then by name
            if (a.triggerNode && !b.triggerNode) return -1;
            if (!a.triggerNode && b.triggerNode) return 1;
            return a.displayName.localeCompare(b.displayName);
          default:
            return a.displayName.localeCompare(b.displayName);
        }
      });

      // Apply pagination
      const total = nodes.length;
      const paginatedNodes = nodes.slice(offset, offset + limit);

      // Transform to integration results
      const integrations: IntegrationResult[] = paginatedNodes.map(node => ({
        id: node.name,
        name: node.name,
        displayName: node.displayName,
        description: node.description,
        category: node.category,
        subcategory: node.subcategory,
        nodeType: node.name,
        isOfficial: true, // All nodes in our registry are considered official
        isTrigger: node.triggerNode || false,
        isRegular: node.regularNode || false,
        hasCredentials: Boolean(node.credentials && node.credentials.length > 0),
        webhookSupport: node.webhookSupport,
        codeable: node.codeable,
        inputCount: node.inputs.length,
        outputCount: node.outputs.length,
        propertyCount: node.properties.length,
        credentials: node.credentials,
        examples: includeDetails ? node.examples : undefined
      }));

      // Build response
      const result = {
        integrations,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
          totalPages: Math.ceil(total / limit),
          currentPage: Math.floor(offset / limit) + 1
        },
        filters: {
          category,
          search,
          sortBy,
          filterBy
        },
        statistics: {
          totalInRegistry: MASSIVE_REGISTRY_STATS.total,
          filteredCount: total,
          byCategory: this.getCategoryBreakdown(paginatedNodes),
          byType: {
            triggers: paginatedNodes.filter(n => n.triggerNode).length,
            regular: paginatedNodes.filter(n => n.regularNode).length,
            withCredentials: paginatedNodes.filter(n => n.credentials?.length).length,
            withWebhooks: paginatedNodes.filter(n => n.webhookSupport).length
          }
        },
        availableCategories: Array.from(getNodesByCategory().keys()),
        registryInfo: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          totalNodes: completeN8NCatalog.getStats().totalNodes,
          coverage: completeN8NCatalog.getStats().nodesByCategory
        }
      };

      return this.formatIntegrationResponse(
        result,
        `Found ${total} integrations in comprehensive registry (showing ${paginatedNodes.length})`
      );

    } catch (error) {
      return this.handleIntegrationError(error, 'browse comprehensive integrations');
    }
  }

  /**
   * Get category breakdown for the current result set
   */
  private getCategoryBreakdown(nodes: any[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    for (const node of nodes) {
      breakdown[node.category] = (breakdown[node.category] || 0) + 1;
    }
    
    return breakdown;
  }
}

/**
 * Tool definition for enhanced integration browsing
 */
export function getEnhancedBrowseIntegrationsToolDefinition(): ToolDefinition {
  return {
    name: 'browse_comprehensive_integrations',
    description: 'Browse the complete n8n integration registry with 1000+ integrations, advanced filtering, and detailed information',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by integration category (AI, Communication, Database, CRM, Productivity, Cloud Storage, E-commerce, Developer Tools, Core, etc.)'
        },
        search: {
          type: 'string',
          description: 'Search integrations by name, description, or functionality'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of integrations to return (default: 50, max: 200)',
          default: 50,
          minimum: 1,
          maximum: 200
        },
        offset: {
          type: 'number',
          description: 'Number of integrations to skip for pagination (default: 0)',
          default: 0,
          minimum: 0
        },
        includeDetails: {
          type: 'boolean',
          description: 'Include detailed information like examples and advanced properties',
          default: false
        },
        sortBy: {
          type: 'string',
          enum: ['name', 'popularity', 'category', 'updated'],
          description: 'Sort integrations by specified criteria (default: name)',
          default: 'name'
        },
        filterBy: {
          type: 'object',
          properties: {
            official: {
              type: 'boolean',
              description: 'Filter by official n8n integrations only'
            },
            ai: {
              type: 'boolean',
              description: 'Show only AI/ML related integrations'
            },
            triggerNodes: {
              type: 'boolean',
              description: 'Filter by trigger nodes (true) or regular nodes (false)'
            },
            requiresCredentials: {
              type: 'boolean',
              description: 'Filter by nodes that require authentication credentials'
            },
            subcategory: {
              type: 'string',
              description: 'Filter by subcategory (Language Models, Team Chat, SQL Databases, etc.)'
            }
          },
          description: 'Advanced filtering options'
        }
      },
      required: []
    }
  };
}