/**
 * Workflow Loader - Integration with Existing n8n Workflows
 * 
 * Loads and processes existing n8n workflows from specified directories,
 * making them available through the MCP server for the ultimate AI Outlook manager.
 */

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export interface N8nWorkflow {
  id?: string;
  name: string;
  description?: string;
  tags?: string[];
  nodes: N8nNode[];
  connections: Record<string, any>;
  active?: boolean;
  settings?: Record<string, any>;
  staticData?: Record<string, any>;
  pinData?: Record<string, any>;
  versionId?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  useCase?: string;
  benefits?: string[];
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters?: Record<string, any>;
  credentials?: Record<string, any>;
  webhookId?: string;
  disabled?: boolean;
  notes?: string;
  executeOnce?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  onError?: 'stopWorkflow' | 'continueRegularOutput' | 'continueErrorOutput';
}

export interface WorkflowMetadata {
  filePath: string;
  fileName: string;
  directory: string;
  fileSize: number;
  lastModified: Date;
  isAIRelated: boolean;
  isOutlookRelated: boolean;
  isTeamsRelated: boolean;
  nodeTypes: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedCategory: string;
}

export class WorkflowLoader {
  private workflows: Map<string, N8nWorkflow> = new Map();
  private metadata: Map<string, WorkflowMetadata> = new Map();
  
  private readonly workflowDirectories = [
    'F:\\n8n-mcp-setup\\mcp-server\\n8n-workflows',
    'F:\\n8n-mcp-setup\\mcp-server\\n8n-free-templates',
    'F:\\n8n-mcp-setup\\mcp-server\\awesome-n8n-templates'
  ];

  private readonly aiKeywords = [
    'openai', 'gpt', 'ai', 'artificial intelligence', 'machine learning',
    'chatgpt', 'claude', 'anthropic', 'sentiment', 'nlp', 'natural language'
  ];

  private readonly outlookKeywords = [
    'outlook', 'email', 'microsoft', 'office365', 'exchange', 'mail'
  ];

  private readonly teamsKeywords = [
    'teams', 'microsoft teams', 'collaboration', 'meeting', 'chat', 'channel'
  ];

  /**
   * Load all workflows from the specified directories
   */
  async loadAllWorkflows(): Promise<void> {
    console.log('🔄 Loading workflows from directories...');
    
    for (const directory of this.workflowDirectories) {
      if (fs.existsSync(directory)) {
        await this.loadWorkflowsFromDirectory(directory);
      } else {
        console.warn(`⚠️ Directory not found: ${directory}`);
      }
    }

    console.log(`✅ Loaded ${this.workflows.size} workflows successfully`);
  }

  /**
   * Load workflows from a specific directory
   */
  private async loadWorkflowsFromDirectory(directory: string): Promise<void> {
    try {
      const files = await this.getWorkflowFiles(directory);
      
      for (const filePath of files) {
        try {
          const workflow = await this.loadWorkflowFile(filePath);
          if (workflow) {
            const workflowId = this.generateWorkflowId(filePath);
            this.workflows.set(workflowId, workflow);
            
            const metadata = await this.generateMetadata(filePath, workflow);
            this.metadata.set(workflowId, metadata);
          }
        } catch (error) {
          console.error(`❌ Error loading workflow file ${filePath}:`, error);
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${directory}:`, error);
    }
  }

  /**
   * Get all workflow files from a directory (recursive)
   */
  private async getWorkflowFiles(directory: string): Promise<string[]> {
    const files: string[] = [];
    
    const items = await readdir(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // Recursive search in subdirectories
        const subFiles = await this.getWorkflowFiles(fullPath);
        files.push(...subFiles);
      } else if (this.isWorkflowFile(item)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Check if a file is a workflow file
   */
  private isWorkflowFile(fileName: string): boolean {
    const workflowExtensions = ['.json', '.n8n'];
    const lowerFileName = fileName.toLowerCase();
    
    return workflowExtensions.some(ext => lowerFileName.endsWith(ext)) &&
           !lowerFileName.includes('node_modules') &&
           !lowerFileName.includes('.git');
  }

  /**
   * Load and parse a workflow file
   */
  private async loadWorkflowFile(filePath: string): Promise<N8nWorkflow | null> {
    try {
      const content = await readFile(filePath, 'utf8');
      const workflow = JSON.parse(content) as N8nWorkflow;
      
      // Validate workflow structure
      if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
        console.warn(`⚠️ Invalid workflow structure in ${filePath}`);
        return null;
      }

      // Enhance workflow with additional metadata if missing
      if (!workflow.name) {
        workflow.name = path.basename(filePath, path.extname(filePath));
      }

      if (!workflow.description) {
        workflow.description = this.generateDescription(workflow);
      }

      if (!workflow.tags) {
        workflow.tags = this.generateTags(workflow);
      }

      // Auto-categorize based on content
      workflow.category = this.categorizeWorkflow(workflow);
      workflow.difficulty = this.assessDifficulty(workflow);
      workflow.useCase = this.generateUseCase(workflow);
      workflow.benefits = this.generateBenefits(workflow);

      return workflow;
    } catch (error) {
      console.error(`❌ Error parsing workflow file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Generate workflow metadata
   */
  private async generateMetadata(filePath: string, workflow: N8nWorkflow): Promise<WorkflowMetadata> {
    const stats = await stat(filePath);
    const nodeTypes = workflow.nodes.map(node => node.type);
    
    const workflowText = JSON.stringify(workflow).toLowerCase();
    
    return {
      filePath,
      fileName: path.basename(filePath),
      directory: path.dirname(filePath),
      fileSize: stats.size,
      lastModified: stats.mtime,
      isAIRelated: this.aiKeywords.some(keyword => workflowText.includes(keyword)),
      isOutlookRelated: this.outlookKeywords.some(keyword => workflowText.includes(keyword)),
      isTeamsRelated: this.teamsKeywords.some(keyword => workflowText.includes(keyword)),
      nodeTypes: [...new Set(nodeTypes)],
      complexity: this.assessComplexity(workflow),
      estimatedCategory: this.categorizeWorkflow(workflow)
    };
  }

  /**
   * Generate a unique ID for a workflow
   */
  private generateWorkflowId(filePath: string): string {
    const relativePath = path.relative(process.cwd(), filePath);
    return relativePath.replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * Generate description for workflow
   */
  private generateDescription(workflow: N8nWorkflow): string {
    const nodeTypes = [...new Set(workflow.nodes.map(node => node.type))];
    const integrations = nodeTypes
      .filter(type => type.includes('n8n-nodes-base.'))
      .map(type => type.replace('n8n-nodes-base.', ''))
      .join(', ');

    return `Workflow with ${workflow.nodes.length} nodes using: ${integrations}`;
  }

  /**
   * Generate tags for workflow
   */
  private generateTags(workflow: N8nWorkflow): string[] {
    const tags: string[] = [];
    const workflowText = JSON.stringify(workflow).toLowerCase();
    
    // Add tags based on node types
    workflow.nodes.forEach(node => {
      if (node.type.includes('microsoft')) tags.push('microsoft');
      if (node.type.includes('google')) tags.push('google');
      if (node.type.includes('slack')) tags.push('slack');
      if (node.type.includes('webhook')) tags.push('webhook');
      if (node.type.includes('trigger')) tags.push('trigger');
    });

    // Add AI-related tags
    if (this.aiKeywords.some(keyword => workflowText.includes(keyword))) {
      tags.push('ai', 'automation');
    }

    // Add communication tags
    if (this.outlookKeywords.some(keyword => workflowText.includes(keyword))) {
      tags.push('email', 'communication');
    }

    if (this.teamsKeywords.some(keyword => workflowText.includes(keyword))) {
      tags.push('collaboration', 'teams');
    }

    return [...new Set(tags)];
  }

  /**
   * Categorize workflow based on content
   */
  private categorizeWorkflow(workflow: N8nWorkflow): string {
    const workflowText = JSON.stringify(workflow).toLowerCase();
    const nodeTypes = workflow.nodes.map(node => node.type.toLowerCase());

    // AI & Productivity
    if (this.aiKeywords.some(keyword => workflowText.includes(keyword)) ||
        this.outlookKeywords.some(keyword => workflowText.includes(keyword)) ||
        this.teamsKeywords.some(keyword => workflowText.includes(keyword))) {
      return 'AI & Productivity';
    }

    // E-commerce
    if (nodeTypes.some(type => 
        type.includes('shopify') || type.includes('woocommerce') || 
        type.includes('bigcommerce') || type.includes('stripe'))) {
      return 'E-commerce';
    }

    // Marketing
    if (nodeTypes.some(type => 
        type.includes('mailchimp') || type.includes('hubspot') || 
        type.includes('salesforce') || type.includes('analytics'))) {
      return 'Marketing';
    }

    // Customer Support
    if (nodeTypes.some(type => 
        type.includes('zendesk') || type.includes('intercom') || 
        type.includes('freshdesk'))) {
      return 'Customer Support';
    }

    // Project Management
    if (nodeTypes.some(type => 
        type.includes('trello') || type.includes('asana') || 
        type.includes('jira') || type.includes('notion'))) {
      return 'Project Management';
    }

    // Development & DevOps
    if (nodeTypes.some(type => 
        type.includes('github') || type.includes('gitlab') || 
        type.includes('docker') || type.includes('aws'))) {
      return 'Development & DevOps';
    }

    return 'General Automation';
  }

  /**
   * Assess workflow difficulty
   */
  private assessDifficulty(workflow: N8nWorkflow): 'beginner' | 'intermediate' | 'advanced' {
    const nodeCount = workflow.nodes.length;
    const hasComplexNodes = workflow.nodes.some(node => 
      node.type.includes('code') || 
      node.type.includes('function') || 
      node.type.includes('webhook')
    );
    const hasConditions = workflow.nodes.some(node => 
      node.type.includes('if') || 
      node.type.includes('switch')
    );

    if (nodeCount > 20 || hasComplexNodes) {
      return 'advanced';
    } else if (nodeCount > 8 || hasConditions) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  /**
   * Assess workflow complexity
   */
  private assessComplexity(workflow: N8nWorkflow): 'simple' | 'moderate' | 'complex' {
    const nodeCount = workflow.nodes.length;
    const uniqueNodeTypes = new Set(workflow.nodes.map(node => node.type)).size;
    
    if (nodeCount > 15 || uniqueNodeTypes > 10) {
      return 'complex';
    } else if (nodeCount > 6 || uniqueNodeTypes > 5) {
      return 'moderate';
    }
    
    return 'simple';
  }

  /**
   * Generate use case description
   */
  private generateUseCase(workflow: N8nWorkflow): string {
    const category = this.categorizeWorkflow(workflow);
    const nodeCount = workflow.nodes.length;
    
    const useCases: Record<string, string> = {
      'AI & Productivity': 'Automate email management and team communication with AI-powered processing',
      'E-commerce': 'Streamline online store operations and customer order processing',
      'Marketing': 'Automate marketing campaigns and customer engagement workflows',
      'Customer Support': 'Enhance customer service with automated ticket management and responses',
      'Project Management': 'Coordinate project tasks and team collaboration efficiently',
      'Development & DevOps': 'Automate development workflows and deployment processes',
      'General Automation': 'Streamline business processes and data integration tasks'
    };

    return useCases[category] || `Automate workflows with ${nodeCount} integrated steps`;
  }

  /**
   * Generate benefits list
   */
  private generateBenefits(workflow: N8nWorkflow): string[] {
    const benefits: string[] = [
      'Reduces manual work and human error',
      'Improves process efficiency and speed',
      'Enables 24/7 automated operations'
    ];

    const workflowText = JSON.stringify(workflow).toLowerCase();
    
    if (this.aiKeywords.some(keyword => workflowText.includes(keyword))) {
      benefits.push('Leverages AI for intelligent decision making');
    }

    if (workflow.nodes.some(node => node.type.includes('trigger'))) {
      benefits.push('Real-time event-driven automation');
    }

    if (workflow.nodes.some(node => node.type.includes('webhook'))) {
      benefits.push('Seamless integration with external systems');
    }

    return benefits;
  }

  /**
   * Get all loaded workflows
   */
  getWorkflows(): Map<string, N8nWorkflow> {
    return this.workflows;
  }

  /**
   * Get workflows by category
   */
  getWorkflowsByCategory(category: string): N8nWorkflow[] {
    return Array.from(this.workflows.values())
      .filter(workflow => workflow.category === category);
  }

  /**
   * Get AI-related workflows
   */
  getAIWorkflows(): N8nWorkflow[] {
    const aiWorkflows: N8nWorkflow[] = [];
    
    for (const [id, metadata] of this.metadata.entries()) {
      if (metadata.isAIRelated || metadata.isOutlookRelated || metadata.isTeamsRelated) {
        const workflow = this.workflows.get(id);
        if (workflow) {
          aiWorkflows.push(workflow);
        }
      }
    }
    
    return aiWorkflows;
  }

  /**
   * Search workflows
   */
  searchWorkflows(query: string): N8nWorkflow[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.workflows.values())
      .filter(workflow => 
        workflow.name.toLowerCase().includes(lowerQuery) ||
        workflow.description?.toLowerCase().includes(lowerQuery) ||
        workflow.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        workflow.useCase?.toLowerCase().includes(lowerQuery)
      );
  }

  /**
   * Get workflow metadata
   */
  getMetadata(): Map<string, WorkflowMetadata> {
    return this.metadata;
  }

  /**
   * Get workflow statistics
   */
  getStatistics() {
    const totalWorkflows = this.workflows.size;
    const aiRelated = Array.from(this.metadata.values())
      .filter(meta => meta.isAIRelated).length;
    const outlookRelated = Array.from(this.metadata.values())
      .filter(meta => meta.isOutlookRelated).length;
    const teamsRelated = Array.from(this.metadata.values())
      .filter(meta => meta.isTeamsRelated).length;

    const categories = Array.from(this.workflows.values())
      .reduce((acc, workflow) => {
        const category = workflow.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const difficulties = Array.from(this.workflows.values())
      .reduce((acc, workflow) => {
        const difficulty = workflow.difficulty || 'unknown';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalWorkflows,
      aiRelated,
      outlookRelated,
      teamsRelated,
      categories,
      difficulties,
      directories: this.workflowDirectories.length
    };
  }
}

// Export singleton instance
export const workflowLoader = new WorkflowLoader();

export default workflowLoader;
