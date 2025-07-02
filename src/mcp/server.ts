import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { n8nDocumentationToolsFinal } from './tools.js';
import { logger } from '../utils/logger.js';
import { NodeRepository } from '../database/node-repository.js';
import { DatabaseAdapter, createDatabaseAdapter } from '../database/database-adapter.js';
import { SimpleCache } from '../utils/simple-cache.js';

interface NodeRow {
  node_type: string;
  package_name: string;
  display_name: string;
  description?: string;
  category?: string;
  development_style?: string;
  is_ai_tool: number;
  is_trigger: number;
  is_webhook: number;
  is_versioned: number;
  version?: string;
  documentation?: string;
  properties_schema?: string;
  operations?: string;
  credentials_required?: string;
}

export class N8NDocumentationMCPServer {
  private server: Server;
  private db: DatabaseAdapter | null = null;
  private repository: NodeRepository | null = null;
  private initialized: Promise<void>;
  private cache = new SimpleCache();

  constructor() {
    // Try multiple database paths
    const possiblePaths = [
      path.join(process.cwd(), 'data', 'nodes.db'),
      path.join(__dirname, '../../data', 'nodes.db'),
      './data/nodes.db'
    ];
    
    let dbPath: string | null = null;
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        dbPath = p;
        break;
      }
    }
    
    if (!dbPath) {
      logger.error('Database not found in any of the expected locations:', possiblePaths);
      throw new Error('Database nodes.db not found. Please run npm run rebuild first.');
    }
    
    // Initialize database asynchronously
    this.initialized = this.initializeDatabase(dbPath);
    
    logger.info('Initializing n8n Documentation MCP server');
    
    // Log configuration at startup
    const totalTools = n8nDocumentationToolsFinal.length;
    
    logger.info(`MCP server initialized with ${totalTools} tools`);
    
    this.server = new Server(
      {
        name: 'n8n-documentation-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }
  
  private async initializeDatabase(dbPath: string): Promise<void> {
    try {
      this.db = await createDatabaseAdapter(dbPath);
      this.repository = new NodeRepository(this.db);
      logger.info(`Initialized database from: ${dbPath}`);
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw new Error(`Failed to open database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async ensureInitialized(): Promise<void> {
    await this.initialized;
    if (!this.db || !this.repository) {
      throw new Error('Database not initialized');
    }
  }

  private setupHandlers(): void {
    // Handle initialization
    this.server.setRequestHandler(InitializeRequestSchema, async () => {
      const response = {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: 'n8n-documentation-mcp',
          version: '1.0.0',
        },
      };
      
      // Debug logging
      if (process.env.DEBUG_MCP === 'true') {
        logger.debug('Initialize handler called', { response });
      }
      
      return response;
    });

    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [...n8nDocumentationToolsFinal];
      
      logger.debug(`Tool listing: ${tools.length} tools available`);
      
      return { tools };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        logger.debug(`Executing tool: ${name}`, { args });
        const result = await this.executeTool(name, args);
        logger.debug(`Tool ${name} executed successfully`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Error executing tool ${name}`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'start_here_workflow_guide':
        return this.getWorkflowGuide(args.topic);
      case 'list_nodes':
        return this.listNodes(args);
      case 'get_node_info':
        return this.getNodeInfo(args.nodeType);
      case 'search_nodes':
        return this.searchNodes(args.query, args.limit);
      case 'list_ai_tools':
        return this.listAITools();
      case 'get_node_documentation':
        return this.getNodeDocumentation(args.nodeType);
      case 'get_database_statistics':
        return this.getDatabaseStatistics();
      case 'get_node_essentials':
        return this.getNodeEssentials(args.nodeType);
      case 'search_node_properties':
        return this.searchNodeProperties(args.nodeType, args.query, args.maxResults);
      case 'get_node_for_task':
        return this.getNodeForTask(args.task);
      case 'list_tasks':
        return this.listTasks(args.category);
      case 'validate_node_operation':
        return this.validateNodeConfig(args.nodeType, args.config, args.profile);
      case 'validate_node_minimal':
        return this.validateNodeMinimal(args.nodeType, args.config);
      case 'get_property_dependencies':
        return this.getPropertyDependencies(args.nodeType, args.config);
      case 'get_node_as_tool_info':
        return this.getNodeAsToolInfo(args.nodeType);
      case 'list_node_templates':
        return this.listNodeTemplates(args.nodeTypes, args.limit);
      case 'get_template':
        return this.getTemplate(args.templateId);
      case 'search_templates':
        return this.searchTemplates(args.query, args.limit);
      case 'get_templates_for_task':
        return this.getTemplatesForTask(args.task);
      case 'validate_workflow':
        return this.validateWorkflow(args.workflow, args.options);
      case 'validate_workflow_connections':
        return this.validateWorkflowConnections(args.workflow);
      case 'validate_workflow_expressions':
        return this.validateWorkflowExpressions(args.workflow);
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async listNodes(filters: any = {}): Promise<any> {
    await this.ensureInitialized();
    
    let query = 'SELECT * FROM nodes WHERE 1=1';
    const params: any[] = [];

    if (filters.package) {
      // Handle both formats
      const packageVariants = [
        filters.package,
        `@n8n/${filters.package}`,
        filters.package.replace('@n8n/', '')
      ];
      query += ' AND package_name IN (' + packageVariants.map(() => '?').join(',') + ')';
      params.push(...packageVariants);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.developmentStyle) {
      query += ' AND development_style = ?';
      params.push(filters.developmentStyle);
    }

    if (filters.isAITool !== undefined) {
      query += ' AND is_ai_tool = ?';
      params.push(filters.isAITool ? 1 : 0);
    }

    query += ' ORDER BY display_name';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const nodes = this.db!.prepare(query).all(...params) as NodeRow[];
    
    return {
      nodes: nodes.map(node => ({
        nodeType: node.node_type,
        displayName: node.display_name,
        description: node.description,
        category: node.category,
        package: node.package_name,
        developmentStyle: node.development_style,
        isAITool: !!node.is_ai_tool,
        isTrigger: !!node.is_trigger,
        isVersioned: !!node.is_versioned,
      })),
      totalCount: nodes.length,
    };
  }

  private async getNodeInfo(nodeType: string): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      // Try alternative formats
      const alternatives = [
        nodeType,
        nodeType.replace('n8n-nodes-base.', ''),
        `n8n-nodes-base.${nodeType}`,
        nodeType.toLowerCase()
      ];
      
      for (const alt of alternatives) {
        const found = this.repository!.getNode(alt);
        if (found) {
          node = found;
          break;
        }
      }
      
      if (!node) {
        throw new Error(`Node ${nodeType} not found`);
      }
    }
    
    // Add AI tool capabilities information
    const aiToolCapabilities = {
      canBeUsedAsTool: true, // Any node can be used as a tool in n8n
      hasUsableAsToolProperty: node.isAITool,
      requiresEnvironmentVariable: !node.isAITool && node.package !== 'n8n-nodes-base',
      toolConnectionType: 'ai_tool',
      commonToolUseCases: this.getCommonAIToolUseCases(node.nodeType),
      environmentRequirement: node.package !== 'n8n-nodes-base' ? 
        'N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true' : 
        null
    };
    
    return {
      ...node,
      aiToolCapabilities
    };
  }

  private async searchNodes(query: string, limit: number = 20): Promise<any> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');
    
    // Handle exact phrase searches with quotes
    if (query.startsWith('"') && query.endsWith('"')) {
      const exactPhrase = query.slice(1, -1);
      const nodes = this.db!.prepare(`
        SELECT * FROM nodes 
        WHERE node_type LIKE ? OR display_name LIKE ? OR description LIKE ?
        ORDER BY display_name
        LIMIT ?
      `).all(`%${exactPhrase}%`, `%${exactPhrase}%`, `%${exactPhrase}%`, limit) as NodeRow[];
      
      return { 
        query, 
        results: nodes.map(node => ({
          nodeType: node.node_type,
          displayName: node.display_name,
          description: node.description,
          category: node.category,
          package: node.package_name
        })), 
        totalCount: nodes.length 
      };
    }
    
    // Split into words for normal search
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    if (words.length === 0) {
      return { query, results: [], totalCount: 0 };
    }
    
    // Build conditions for each word
    const conditions = words.map(() => 
      '(node_type LIKE ? OR display_name LIKE ? OR description LIKE ?)'
    ).join(' OR ');
    
    const params: any[] = words.flatMap(w => [`%${w}%`, `%${w}%`, `%${w}%`]);
    params.push(limit);
    
    const nodes = this.db!.prepare(`
      SELECT DISTINCT * FROM nodes 
      WHERE ${conditions}
      ORDER BY display_name
      LIMIT ?
    `).all(...params) as NodeRow[];
    
    return {
      query,
      results: nodes.map(node => ({
        nodeType: node.node_type,
        displayName: node.display_name,
        description: node.description,
        category: node.category,
        package: node.package_name
      })),
      totalCount: nodes.length
    };
  }

  private async listAITools(): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    const tools = this.repository.getAITools();
    
    return {
      tools,
      totalCount: tools.length,
      requirements: {
        environmentVariable: 'N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true',
        nodeProperty: 'usableAsTool: true',
      },
      usage: {
        description: 'These nodes have the usableAsTool property set to true, making them optimized for AI agent usage.',
        note: 'ANY node in n8n can be used as an AI tool by connecting it to the ai_tool port of an AI Agent node.',
        examples: [
          'Regular nodes like Slack, Google Sheets, or HTTP Request can be used as tools',
          'Connect any node to an AI Agent\'s tool port to make it available for AI-driven automation',
          'Community nodes require the environment variable to be set'
        ]
      }
    };
  }

  private async getNodeDocumentation(nodeType: string): Promise<any> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');
    const node = this.db!.prepare(`
      SELECT node_type, display_name, documentation, description 
      FROM nodes 
      WHERE node_type = ?
    `).get(nodeType) as NodeRow | undefined;
    
    if (!node) {
      throw new Error(`Node ${nodeType} not found`);
    }
    
    // If no documentation, generate fallback
    if (!node.documentation) {
      const essentials = await this.getNodeEssentials(nodeType);
      
      return {
        nodeType: node.node_type,
        displayName: node.display_name,
        documentation: `
# ${node.display_name}

${node.description || 'No description available.'}

## Common Properties

${essentials.commonProperties.map((p: any) => 
  `### ${p.displayName}\n${p.description || `Type: ${p.type}`}`
).join('\n\n')}

## Note
Full documentation is being prepared. For now, use get_node_essentials for configuration help.
`,
        hasDocumentation: false
      };
    }
    
    return {
      nodeType: node.node_type,
      displayName: node.display_name,
      documentation: node.documentation,
      hasDocumentation: true,
    };
  }

  private async getDatabaseStatistics(): Promise<any> {
    await this.ensureInitialized();
    if (!this.db) throw new Error('Database not initialized');
    const stats = this.db!.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(is_ai_tool) as ai_tools,
        SUM(is_trigger) as triggers,
        SUM(is_versioned) as versioned,
        SUM(CASE WHEN documentation IS NOT NULL THEN 1 ELSE 0 END) as with_docs,
        COUNT(DISTINCT package_name) as packages,
        COUNT(DISTINCT category) as categories
      FROM nodes
    `).get() as any;
    
    const packages = this.db!.prepare(`
      SELECT package_name, COUNT(*) as count 
      FROM nodes 
      GROUP BY package_name
    `).all() as any[];
    
    return {
      totalNodes: stats.total,
      statistics: {
        aiTools: stats.ai_tools,
        triggers: stats.triggers,
        versionedNodes: stats.versioned,
        nodesWithDocumentation: stats.with_docs,
        documentationCoverage: Math.round((stats.with_docs / stats.total) * 100) + '%',
        uniquePackages: stats.packages,
        uniqueCategories: stats.categories,
      },
      packageBreakdown: packages.map(pkg => ({
        package: pkg.package_name,
        nodeCount: pkg.count,
      })),
    };
  }

  private async getNodeEssentials(nodeType: string): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    
    // Check cache first
    const cacheKey = `essentials:${nodeType}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    
    // Get the full node information
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      // Try alternative formats
      const alternatives = [
        nodeType,
        nodeType.replace('n8n-nodes-base.', ''),
        `n8n-nodes-base.${nodeType}`,
        nodeType.toLowerCase()
      ];
      
      for (const alt of alternatives) {
        const found = this.repository!.getNode(alt);
        if (found) {
          node = found;
          break;
        }
      }
      
      if (!node) {
        throw new Error(`Node ${nodeType} not found`);
      }
    }
    
    // Get properties (already parsed by repository)
    const allProperties = node.properties || [];
    
    // Get essential properties (simplified version without PropertyFilter)
    const requiredProperties = allProperties.filter((p: any) => p.required);
    const commonProperties = allProperties.filter((p: any) => 
      !p.displayOptions || Object.keys(p.displayOptions).length === 0
    ).slice(0, 20); // Limit to first 20 common properties
    
    // Get operations (already parsed by repository)
    const operations = node.operations || [];
    
    const result = {
      nodeType: node.nodeType,
      displayName: node.displayName,
      description: node.description,
      category: node.category,
      version: node.version || '1',
      isVersioned: node.isVersioned || false,
      requiredProperties,
      commonProperties,
      operations: operations.map((op: any) => ({
        name: op.name || op.operation,
        description: op.description,
        action: op.action,
        resource: op.resource
      })),
      examples: this.getNodeExamples(node.nodeType),
      metadata: {
        totalProperties: allProperties.length,
        isAITool: node.isAITool,
        isTrigger: node.isTrigger,
        isWebhook: node.isWebhook,
        hasCredentials: node.credentials ? true : false,
        package: node.package,
        developmentStyle: node.developmentStyle || 'programmatic'
      }
    };
    
    // Cache for 1 hour
    this.cache.set(cacheKey, result, 3600);
    
    return result;
  }

  private getNodeExamples(nodeType: string): any {
    const examples: Record<string, any> = {
      'nodes-base.httpRequest': {
        basicGet: {
          method: 'GET',
          url: 'https://api.example.com/data'
        },
        postWithAuth: {
          method: 'POST',
          url: 'https://api.example.com/submit',
          sendBody: true,
          bodyContentType: 'json',
          jsonBody: '{"key": "value"}'
        }
      },
      'nodes-base.webhook': {
        basic: {
          httpMethod: 'POST',
          path: 'webhook-endpoint',
          responseMode: 'responseNode'
        }
      },
      'nodes-base.slack': {
        sendMessage: {
          resource: 'message',
          operation: 'post',
          channel: '#general',
          text: 'Hello from n8n!'
        }
      }
    };
    
    return examples[nodeType] || { note: 'No examples available for this node type' };
  }

  private async searchNodeProperties(nodeType: string, query: string, maxResults: number = 20): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    
    // Get the node
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      // Try alternative formats
      const alternatives = [
        nodeType,
        nodeType.replace('n8n-nodes-base.', ''),
        `n8n-nodes-base.${nodeType}`,
        nodeType.toLowerCase()
      ];
      
      for (const alt of alternatives) {
        const found = this.repository!.getNode(alt);
        if (found) {
          node = found;
          break;
        }
      }
      
      if (!node) {
        throw new Error(`Node ${nodeType} not found`);
      }
    }
    
    // Get properties and search (simplified without PropertyFilter)
    const allProperties = node.properties || [];
    const searchTerm = query.toLowerCase();
    
    const matches = allProperties.filter((prop: any) => 
      prop.name?.toLowerCase().includes(searchTerm) ||
      prop.displayName?.toLowerCase().includes(searchTerm) ||
      prop.description?.toLowerCase().includes(searchTerm)
    ).slice(0, maxResults);
    
    return {
      nodeType: node.nodeType,
      query,
      matches: matches.map((match: any) => ({
        name: match.name,
        displayName: match.displayName,
        type: match.type,
        description: match.description,
        path: match.path || match.name,
        required: match.required,
        default: match.default,
        options: match.options,
        showWhen: match.showWhen
      })),
      totalMatches: matches.length,
      searchedIn: allProperties.length + ' properties'
    };
  }

  private async getNodeForTask(task: string): Promise<any> {
    // Basic task templates (simplified version)
    const taskTemplates: Record<string, any> = {
      'send_slack_message': {
        task: 'send_slack_message',
        description: 'Send a message to a Slack channel',
        nodeType: 'nodes-base.slack',
        configuration: {
          resource: 'message',
          operation: 'post',
          channel: '#general',
          text: 'Your message here'
        },
        userMustProvide: [
          { property: 'channel', description: 'Slack channel to send to', example: '#general' },
          { property: 'text', description: 'Message content', example: 'Hello from n8n!' }
        ]
      },
      'receive_webhook': {
        task: 'receive_webhook',
        description: 'Receive webhook data',
        nodeType: 'nodes-base.webhook',
        configuration: {
          httpMethod: 'POST',
          path: 'webhook-endpoint',
          responseMode: 'responseNode'
        },
        userMustProvide: [
          { property: 'path', description: 'Webhook endpoint path', example: 'my-webhook' }
        ]
      }
    };
    
    const template = taskTemplates[task];
    
    if (!template) {
      const availableTasks = Object.keys(taskTemplates);
      throw new Error(
        `Unknown task: ${task}. Available tasks: ${availableTasks.join(', ')}`
      );
    }
    
    return {
      task: template.task,
      description: template.description,
      nodeType: template.nodeType,
      configuration: template.configuration,
      userMustProvide: template.userMustProvide,
      example: {
        node: {
          type: template.nodeType,
          parameters: template.configuration
        }
      }
    };
  }
  
  private async listTasks(category?: string): Promise<any> {
    const taskCategories = {
      'Communication': ['send_slack_message', 'send_email'],
      'Webhooks': ['receive_webhook', 'webhook_with_response'],
      'HTTP/API': ['get_api_data', 'post_json_request'],
      'Database': ['query_postgres', 'insert_postgres_data']
    };
    
    if (category) {
      const tasks = taskCategories[category as keyof typeof taskCategories];
      
      if (!tasks) {
        throw new Error(
          `Unknown category: ${category}. Available categories: ${Object.keys(taskCategories).join(', ')}`
        );
      }
      
      return {
        category,
        tasks: tasks.map(task => ({
          task,
          description: `Template for ${task.replace(/_/g, ' ')}`
        }))
      };
    }
    
    return {
      totalTasks: Object.values(taskCategories).flat().length,
      categories: taskCategories
    };
  }
  
  private async validateNodeConfig(
    nodeType: string, 
    config: Record<string, any>, 
    profile: string = 'ai-friendly'
  ): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    
    // Get node info to access properties
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      // Try alternative formats
      const alternatives = [
        nodeType,
        nodeType.replace('n8n-nodes-base.', ''),
        `n8n-nodes-base.${nodeType}`,
        nodeType.toLowerCase()
      ];
      
      for (const alt of alternatives) {
        const found = this.repository!.getNode(alt);
        if (found) {
          node = found;
          break;
        }
      }
      
      if (!node) {
        throw new Error(`Node ${nodeType} not found`);
      }
    }
    
    // Get properties
    const properties = node.properties || [];
    
    // Basic validation (simplified without EnhancedConfigValidator)
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingRequired: string[] = [];
    
    for (const prop of properties) {
      if (prop.required && !(prop.name in config)) {
        missingRequired.push(prop.displayName || prop.name);
        errors.push(`Missing required field: ${prop.displayName || prop.name}`);
      }
    }
    
    return {
      nodeType: node.nodeType,
      displayName: node.displayName,
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions: [],
      missingRequiredFields: missingRequired,
      summary: {
        hasErrors: errors.length > 0,
        errorCount: errors.length,
        warningCount: warnings.length,
        suggestionCount: 0
      }
    };
  }
  
  private async getPropertyDependencies(nodeType: string, config?: Record<string, any>): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    
    // Get node info to access properties
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      throw new Error(`Node ${nodeType} not found`);
    }
    
    // Basic property dependencies analysis (simplified)
    const properties = node.properties || [];
    const dependencies: any[] = [];
    
    for (const prop of properties) {
      if (prop.displayOptions) {
        dependencies.push({
          property: prop.name,
          displayName: prop.displayName,
          dependencies: prop.displayOptions
        });
      }
    }
    
    return {
      nodeType: node.nodeType,
      displayName: node.displayName,
      dependencies,
      currentConfig: config ? {
        providedValues: config
      } : undefined
    };
  }
  
  private async getNodeAsToolInfo(nodeType: string): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    
    // Get node info
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      throw new Error(`Node ${nodeType} not found`);
    }
    
    // Determine common AI tool use cases based on node type
    const commonUseCases = this.getCommonAIToolUseCases(node.nodeType);
    
    // Build AI tool capabilities info
    const aiToolCapabilities = {
      canBeUsedAsTool: true, // In n8n, ANY node can be used as a tool when connected to AI Agent
      hasUsableAsToolProperty: node.isAITool,
      requiresEnvironmentVariable: !node.isAITool && node.package !== 'n8n-nodes-base',
      connectionType: 'ai_tool',
      commonUseCases,
      requirements: {
        connection: 'Connect to the "ai_tool" port of an AI Agent node',
        environment: node.package !== 'n8n-nodes-base' ? 
          'Set N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true for community nodes' : 
          'No special environment variables needed for built-in nodes'
      },
      examples: this.getAIToolExamples(node.nodeType),
      tips: [
        'Give the tool a clear, descriptive name in the AI Agent settings',
        'Write a detailed tool description to help the AI understand when to use it',
        'Test the node independently before connecting it as a tool',
        node.isAITool ? 
          'This node is optimized for AI tool usage' : 
          'This is a regular node that can be used as an AI tool'
      ]
    };
    
    return {
      nodeType: node.nodeType,
      displayName: node.displayName,
      description: node.description,
      package: node.package,
      isMarkedAsAITool: node.isAITool,
      aiToolCapabilities
    };
  }
  
  private getCommonAIToolUseCases(nodeType: string): string[] {
    const useCaseMap: Record<string, string[]> = {
      'nodes-base.slack': [
        'Send notifications about task completion',
        'Post updates to channels',
        'Send direct messages',
        'Create alerts and reminders'
      ],
      'nodes-base.googleSheets': [
        'Read data for analysis',
        'Log results and outputs',
        'Update spreadsheet records',
        'Create reports'
      ],
      'nodes-base.gmail': [
        'Send email notifications',
        'Read and process emails',
        'Send reports and summaries',
        'Handle email-based workflows'
      ],
      'nodes-base.httpRequest': [
        'Call external APIs',
        'Fetch data from web services',
        'Send webhooks',
        'Integrate with any REST API'
      ],
      'nodes-base.postgres': [
        'Query database for information',
        'Store analysis results',
        'Update records based on AI decisions',
        'Generate reports from data'
      ],
      'nodes-base.webhook': [
        'Receive external triggers',
        'Create callback endpoints',
        'Handle incoming data',
        'Integrate with external systems'
      ]
    };
    
    // Check for partial matches
    for (const [key, useCases] of Object.entries(useCaseMap)) {
      if (nodeType.includes(key)) {
        return useCases;
      }
    }
    
    // Generic use cases for unknown nodes
    return [
      'Perform automated actions',
      'Integrate with external services',
      'Process and transform data',
      'Extend AI agent capabilities'
    ];
  }
  
  private getAIToolExamples(nodeType: string): any {
    const exampleMap: Record<string, any> = {
      'nodes-base.slack': {
        toolName: 'Send Slack Message',
        toolDescription: 'Sends a message to a specified Slack channel or user. Use this to notify team members about important events or results.',
        nodeConfig: {
          resource: 'message',
          operation: 'post',
          channel: '={{ $fromAI("channel", "The Slack channel to send to, e.g. #general") }}',
          text: '={{ $fromAI("message", "The message content to send") }}'
        }
      },
      'nodes-base.googleSheets': {
        toolName: 'Update Google Sheet',
        toolDescription: 'Reads or updates data in a Google Sheets spreadsheet. Use this to log information, retrieve data, or update records.',
        nodeConfig: {
          operation: 'append',
          sheetId: 'your-sheet-id',
          range: 'A:Z',
          dataMode: 'autoMap'
        }
      },
      'nodes-base.httpRequest': {
        toolName: 'Call API',
        toolDescription: 'Makes HTTP requests to external APIs. Use this to fetch data, trigger webhooks, or integrate with any web service.',
        nodeConfig: {
          method: '={{ $fromAI("method", "HTTP method: GET, POST, PUT, DELETE") }}',
          url: '={{ $fromAI("url", "The complete API endpoint URL") }}',
          sendBody: true,
          bodyContentType: 'json',
          jsonBody: '={{ $fromAI("body", "Request body as JSON object") }}'
        }
      }
    };
    
    // Check for exact match or partial match
    for (const [key, example] of Object.entries(exampleMap)) {
      if (nodeType.includes(key)) {
        return example;
      }
    }
    
    // Generic example
    return {
      toolName: 'Custom Tool',
      toolDescription: 'Performs specific operations. Describe what this tool does and when to use it.',
      nodeConfig: {
        note: 'Configure the node based on its specific requirements'
      }
    };
  }
  
  private async validateNodeMinimal(nodeType: string, config: Record<string, any>): Promise<any> {
    await this.ensureInitialized();
    if (!this.repository) throw new Error('Repository not initialized');
    
    // Get node info
    let node = this.repository.getNode(nodeType);
    
    if (!node) {
      // Try alternative formats
      const alternatives = [
        nodeType,
        nodeType.replace('n8n-nodes-base.', ''),
        `n8n-nodes-base.${nodeType}`,
        nodeType.toLowerCase()
      ];
      
      for (const alt of alternatives) {
        const found = this.repository!.getNode(alt);
        if (found) {
          node = found;
          break;
        }
      }
      
      if (!node) {
        throw new Error(`Node ${nodeType} not found`);
      }
    }
    
    // Get properties  
    const properties = node.properties || [];
    
    // Find missing required fields
    const missingFields: string[] = [];
    
    for (const prop of properties) {
      // Skip if not required
      if (!prop.required) continue;
      
      // Skip if not visible based on current config
      if (prop.displayOptions) {
        let isVisible = true;
        
        // Check show conditions
        if (prop.displayOptions.show) {
          for (const [key, values] of Object.entries(prop.displayOptions.show)) {
            const configValue = config[key];
            const expectedValues = Array.isArray(values) ? values : [values];
            
            if (!expectedValues.includes(configValue)) {
              isVisible = false;
              break;
            }
          }
        }
        
        // Check hide conditions
        if (isVisible && prop.displayOptions.hide) {
          for (const [key, values] of Object.entries(prop.displayOptions.hide)) {
            const configValue = config[key];
            const expectedValues = Array.isArray(values) ? values : [values];
            
            if (expectedValues.includes(configValue)) {
              isVisible = false;
              break;
            }
          }
        }
        
        if (!isVisible) continue;
      }
      
      // Check if field is missing
      if (!(prop.name in config)) {
        missingFields.push(prop.displayName || prop.name);
      }
    }
    
    return {
      nodeType: node.nodeType,
      displayName: node.displayName,
      valid: missingFields.length === 0,
      missingRequiredFields: missingFields
    };
  }

  private async getWorkflowGuide(topic?: string): Promise<any> {
    const guides: Record<string, any> = {
      overview: {
        title: "n8n MCP Tools Quick Start Guide",
        sections: {
          recommended_workflow: {
            title: "Recommended Workflow",
            steps: [
              "1. search_nodes({query:'slack'}) - Find nodes by keyword",
              "2. get_node_essentials('nodes-base.slack') - Get only essential properties (<5KB)",
              "3. get_node_for_task('send_slack_message') - Get pre-configured settings",
              "4. validate_node_minimal() - Quick check for required fields only",
              "5. validate_node_operation() - Full validation with suggestions"
            ],
            tip: "Avoid get_node_info unless you need ALL properties (100KB+ response)"
          },
          essential_tools: {
            discovery: "list_nodes({category:'trigger'}) - Browse by category",
            quick_config: "get_node_essentials() - 95% smaller than get_node_info",
            tasks: "list_tasks() then get_node_for_task() - Pre-configured common tasks",
            validation: "validate_node_minimal() for quick checks, validate_node_operation() for full validation",
            ai_tools: "get_node_as_tool_info() - Learn how to use ANY node as an AI tool"
          }
        }
      }
    };

    if (topic && guides[topic]) {
      return guides[topic];
    }

    // Return complete overview
    return {
      title: "n8n MCP Tools Complete Guide",
      quickStart: guides.overview,
      examples: {
        "Find and configure Slack": [
          "search_nodes({query:'slack'})",
          "get_node_essentials('nodes-base.slack')",
          "validate_node_minimal('nodes-base.slack', {resource:'message',operation:'post'})",
          "get_node_for_task('send_slack_message')"
        ]
      }
    };
  }

  // Template-related methods (simplified stubs)
  private async listNodeTemplates(nodeTypes: string[], limit: number = 10): Promise<any> {
    return {
      message: `Template search functionality not yet implemented in simplified version`,
      tip: "Use get_node_for_task() for pre-configured node templates instead",
      nodeTypes,
      limit
    };
  }
  
  private async getTemplate(templateId: number): Promise<any> {
    return {
      error: `Template functionality not yet implemented in simplified version`,
      tip: "Use get_node_for_task() for pre-configured node examples instead",
      templateId
    };
  }
  
  private async searchTemplates(query: string, limit: number = 20): Promise<any> {
    return {
      message: `Template search functionality not yet implemented in simplified version`,
      tip: "Use search_nodes() to find relevant node types instead",
      query,
      limit
    };
  }
  
  private async getTemplatesForTask(task: string): Promise<any> {
    return {
      message: `Template functionality not yet implemented in simplified version`,
      tip: "Use get_node_for_task() for pre-configured task examples instead",
      task
    };
  }

  private async validateWorkflow(workflow: any, options?: any): Promise<any> {
    return {
      message: "Workflow validation not yet implemented in simplified version",
      tip: "Use validate_node_operation() to validate individual nodes instead",
      workflow: workflow ? "provided" : "missing"
    };
  }

  private async validateWorkflowConnections(workflow: any): Promise<any> {
    return {
      message: "Workflow connection validation not yet implemented in simplified version",
      tip: "Ensure connections use node names, not IDs",
      workflow: workflow ? "provided" : "missing"
    };
  }

  private async validateWorkflowExpressions(workflow: any): Promise<any> {
    return {
      message: "Expression validation not yet implemented in simplified version",
      tip: "Use {{ }} to wrap expressions and reference data with $json.propertyName",
      workflow: workflow ? "provided" : "missing"
    };
  }

  // Add connect method
  async connect(transport: any): Promise<void> {
    await this.ensureInitialized();
    await this.server.connect(transport);
    logger.info('MCP Server connected', { 
      transportType: transport.constructor.name 
    });
  }

  async run(): Promise<void> {
    // Ensure database is initialized before starting server
    await this.ensureInitialized();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    logger.info('n8n Documentation MCP Server running on stdio transport');
    
    // Keep the process alive and listening
    process.stdin.resume();
  }
}
