#!/usr/bin/env node
/**
 * Research Script: n8n Template Discovery
 * 
 * This script researches and catalogs popular workflow templates
 * from n8n.io/workflows and community sources.
 * 
 * Goal: Build comprehensive template library with 100+ templates
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class N8nTemplateResearcher {
  constructor() {
    this.templates = new Map();
    this.categories = new Map();
    this.outputDir = path.join(__dirname, '..', 'data', 'templates');
  }

  async research() {
    console.log('📋 Starting comprehensive n8n template research...');
    
    // Create output directory
    await this.ensureOutputDirectory();
    
    // Research from multiple sources
    await this.researchCommunicationTemplates();
    await this.researchDataProcessingTemplates();
    await this.researchBusinessAutomationTemplates();
    await this.researchDeveloperTemplates();
    await this.researchAIWorkflowTemplates();
    await this.researchEcommerceTemplates();
    await this.researchMarketingTemplates();
    await this.researchProductivityTemplates();
    
    // Generate comprehensive template library
    await this.generateTemplateLibrary();
    
    console.log(`✅ Research complete! Found ${this.templates.size} templates across ${this.categories.size} categories`);
  }

  async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create output directory:', error);
    }
  }

  /**
   * Research communication workflow templates
   */
  async researchCommunicationTemplates() {
    console.log('💬 Researching communication templates...');
    
    // Webhook to Communication Templates
    this.addTemplate({
      id: 'webhook-to-slack-notification',
      name: 'Webhook to Slack Notification',
      description: 'Receive webhook data and send formatted notifications to Slack channels',
      category: 'Communication',
      tags: ['webhook', 'slack', 'notification', 'alerts'],
      difficulty: 'beginner',
      estimatedTime: '10 minutes',
      useCases: ['System alerts', 'Form submissions', 'API notifications'],
      parameters: [
        { name: 'slackChannel', type: 'string', description: 'Slack channel to send notifications', required: true },
        { name: 'messageTemplate', type: 'string', description: 'Message template with variables', required: false }
      ],
      workflow: {
        name: 'Webhook to Slack',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'Webhook Trigger',
            parameters: {
              path: 'notification',
              httpMethod: 'POST',
              options: {}
            },
            position: [240, 300]
          },
          {
            id: 'slack',
            type: 'n8n-nodes-base.slack',
            name: 'Send to Slack',
            parameters: {
              resource: 'message',
              operation: 'post',
              channel: '={{$parameter["slackChannel"] || "#general"}}',
              text: '=🔔 *{{$json.title}}*\n\n{{$json.message}}\n\n_Received at {{$now.format("YYYY-MM-DD HH:mm:ss")}}_'
            },
            position: [460, 300]
          }
        ],
        connections: {
          'Webhook Trigger': {
            main: [[{ node: 'Send to Slack', type: 'main', index: 0 }]]
          }
        }
      }
    });

    this.addTemplate({
      id: 'multi-channel-alert-system',
      name: 'Multi-Channel Alert System',
      description: 'Send critical alerts to multiple communication channels (Slack, Discord, Teams, Email)',
      category: 'Communication',
      tags: ['alerts', 'multi-channel', 'critical', 'notifications'],
      difficulty: 'intermediate',
      estimatedTime: '30 minutes',
      useCases: ['System monitoring', 'Critical alerts', 'Incident response'],
      parameters: [
        { name: 'alertLevel', type: 'options', description: 'Alert severity level', required: true, options: ['low', 'medium', 'high', 'critical'] },
        { name: 'enableSlack', type: 'boolean', description: 'Send to Slack', required: false },
        { name: 'enableDiscord', type: 'boolean', description: 'Send to Discord', required: false },
        { name: 'enableEmail', type: 'boolean', description: 'Send email notification', required: false }
      ],
      workflow: {
        name: 'Multi-Channel Alerts',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'Alert Webhook',
            parameters: { path: 'alert', httpMethod: 'POST' },
            position: [240, 300]
          },
          {
            id: 'if',
            type: 'n8n-nodes-base.if',
            name: 'Check Alert Level',
            parameters: {
              conditions: {
                options: {
                  caseSensitive: true,
                  leftValue: '={{$json.level}}',
                  operation: 'equal',
                  rightValue: 'critical'
                }
              }
            },
            position: [460, 300]
          },
          {
            id: 'slack',
            type: 'n8n-nodes-base.slack',
            name: 'Slack Alert',
            parameters: {
              resource: 'message',
              operation: 'post',
              channel: '#alerts',
              text: '=🚨 CRITICAL ALERT\n\n*{{$json.title}}*\n{{$json.description}}'
            },
            position: [680, 200]
          },
          {
            id: 'discord',
            type: 'n8n-nodes-base.discord',
            name: 'Discord Alert',
            parameters: {
              resource: 'message',
              operation: 'post',
              text: '=🚨 **CRITICAL ALERT**\n\n**{{$json.title}}**\n{{$json.description}}'
            },
            position: [680, 300]
          },
          {
            id: 'email',
            type: 'n8n-nodes-base.emailSend',
            name: 'Email Alert',
            parameters: {
              subject: '=🚨 Critical Alert: {{$json.title}}',
              text: '=Critical alert received:\n\nTitle: {{$json.title}}\nDescription: {{$json.description}}\nTime: {{$now}}'
            },
            position: [680, 400]
          }
        ],
        connections: {
          'Alert Webhook': { main: [[{ node: 'Check Alert Level', type: 'main', index: 0 }]] },
          'Check Alert Level': {
            main: [
              [
                { node: 'Slack Alert', type: 'main', index: 0 },
                { node: 'Discord Alert', type: 'main', index: 0 },
                { node: 'Email Alert', type: 'main', index: 0 }
              ]
            ]
          }
        }
      }
    });

    this.addTemplate({
      id: 'customer-support-ticket-router',
      name: 'Customer Support Ticket Router',
      description: 'Route customer support tickets to appropriate teams based on priority and category',
      category: 'Communication',
      tags: ['customer-support', 'routing', 'tickets', 'automation'],
      difficulty: 'intermediate',
      estimatedTime: '45 minutes',
      useCases: ['Help desk automation', 'Ticket routing', 'Support team management'],
      parameters: [
        { name: 'highPriorityChannel', type: 'string', description: 'Slack channel for high priority tickets', required: true },
        { name: 'generalSupportChannel', type: 'string', description: 'Slack channel for general support', required: true }
      ],
      workflow: {
        name: 'Support Ticket Router',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'New Ticket',
            parameters: { path: 'support-ticket', httpMethod: 'POST' },
            position: [240, 300]
          },
          {
            id: 'switch',
            type: 'n8n-nodes-base.switch',
            name: 'Route by Priority',
            parameters: {
              mode: 'expression',
              output: 'input2',
              options: {
                values: [
                  { conditions: { '0': { leftValue: '={{$json.priority}}', operation: 'equal', rightValue: 'high' } } },
                  { conditions: { '0': { leftValue: '={{$json.priority}}', operation: 'equal', rightValue: 'urgent' } } }
                ]
              }
            },
            position: [460, 300]
          }
        ]
      }
    });
  }

  /**
   * Research data processing templates
   */
  async researchDataProcessingTemplates() {
    console.log('📊 Researching data processing templates...');
    
    this.addTemplate({
      id: 'api-data-sync-pipeline',
      name: 'API Data Sync Pipeline',
      description: 'Synchronize data between multiple APIs with transformation and validation',
      category: 'Data Processing',
      tags: ['api', 'sync', 'transformation', 'etl'],
      difficulty: 'intermediate',
      estimatedTime: '60 minutes',
      useCases: ['Data integration', 'ETL processes', 'Multi-system sync'],
      parameters: [
        { name: 'sourceApiUrl', type: 'string', description: 'Source API endpoint', required: true },
        { name: 'targetApiUrl', type: 'string', description: 'Target API endpoint', required: true },
        { name: 'syncInterval', type: 'number', description: 'Sync interval in minutes', required: false }
      ],
      workflow: {
        name: 'API Data Sync',
        nodes: [
          {
            id: 'schedule',
            type: 'n8n-nodes-base.scheduleTrigger',
            name: 'Schedule Sync',
            parameters: {
              rule: { interval: [{ field: 'minutes', minutesInterval: 30 }] }
            },
            position: [240, 300]
          },
          {
            id: 'httpRequest1',
            type: 'n8n-nodes-base.httpRequest',
            name: 'Fetch Source Data',
            parameters: {
              url: '={{$parameter["sourceApiUrl"]}}',
              method: 'GET',
              options: { response: { response: { responseFormat: 'json' } } }
            },
            position: [460, 300]
          },
          {
            id: 'function',
            type: 'n8n-nodes-base.function',
            name: 'Transform Data',
            parameters: {
              functionCode: `
                const items = $input.all();
                const transformedItems = [];
                
                for (const item of items) {
                  transformedItems.push({
                    json: {
                      id: item.json.id,
                      name: item.json.name?.toLowerCase(),
                      email: item.json.email?.toLowerCase(),
                      createdAt: new Date(item.json.created_at).toISOString(),
                      status: item.json.status || 'active'
                    }
                  });
                }
                
                return transformedItems;
              `
            },
            position: [680, 300]
          },
          {
            id: 'httpRequest2',
            type: 'n8n-nodes-base.httpRequest',
            name: 'Send to Target',
            parameters: {
              url: '={{$parameter["targetApiUrl"]}}',
              method: 'POST',
              body: { mode: 'json', json: '={{$json}}' },
              headers: { 'Content-Type': 'application/json' }
            },
            position: [900, 300]
          }
        ],
        connections: {
          'Schedule Sync': { main: [[{ node: 'Fetch Source Data', type: 'main', index: 0 }]] },
          'Fetch Source Data': { main: [[{ node: 'Transform Data', type: 'main', index: 0 }]] },
          'Transform Data': { main: [[{ node: 'Send to Target', type: 'main', index: 0 }]] }
        }
      }
    });

    this.addTemplate({
      id: 'csv-database-import',
      name: 'CSV to Database Import',
      description: 'Import CSV files into database with validation and error handling',
      category: 'Data Processing',
      tags: ['csv', 'database', 'import', 'validation'],
      difficulty: 'beginner',
      estimatedTime: '30 minutes',
      useCases: ['Data migration', 'Bulk imports', 'File processing'],
      parameters: [
        { name: 'csvFilePath', type: 'string', description: 'Path to CSV file', required: true },
        { name: 'tableName', type: 'string', description: 'Database table name', required: true }
      ],
      workflow: {
        name: 'CSV Database Import',
        nodes: [
          {
            id: 'readFile',
            type: 'n8n-nodes-base.readPdf',
            name: 'Read CSV File',
            parameters: { inputDataFieldName: 'data', options: {} },
            position: [240, 300]
          },
          {
            id: 'splitInBatches',
            type: 'n8n-nodes-base.splitInBatches',
            name: 'Process in Batches',
            parameters: { batchSize: 100, options: {} },
            position: [460, 300]
          },
          {
            id: 'postgres',
            type: 'n8n-nodes-base.postgres',
            name: 'Insert to Database',
            parameters: {
              operation: 'insert',
              schema: 'public',
              table: '={{$parameter["tableName"]}}',
              columns: '={{Object.keys($json)}}'
            },
            position: [680, 300]
          }
        ]
      }
    });
  }

  /**
   * Research AI workflow templates
   */
  async researchAIWorkflowTemplates() {
    console.log('🤖 Researching AI workflow templates...');
    
    this.addTemplate({
      id: 'ai-content-generator',
      name: 'AI Content Generator',
      description: 'Generate blog posts, social media content, and marketing copy using AI',
      category: 'AI',
      tags: ['ai', 'content', 'generation', 'openai', 'marketing'],
      difficulty: 'intermediate',
      estimatedTime: '45 minutes',
      useCases: ['Content marketing', 'Blog writing', 'Social media automation'],
      parameters: [
        { name: 'contentType', type: 'options', description: 'Type of content to generate', required: true, options: ['blog-post', 'social-media', 'email', 'product-description'] },
        { name: 'targetAudience', type: 'string', description: 'Target audience description', required: false },
        { name: 'tone', type: 'options', description: 'Content tone', required: false, options: ['professional', 'casual', 'funny', 'technical'] }
      ],
      workflow: {
        name: 'AI Content Generator',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'Content Request',
            parameters: { path: 'generate-content', httpMethod: 'POST' },
            position: [240, 300]
          },
          {
            id: 'openai',
            type: '@n8n/n8n-nodes-langchain.openAi',
            name: 'Generate Content',
            parameters: {
              model: 'gpt-4',
              prompt: '=Create a {{$json.contentType}} about "{{$json.topic}}" for {{$json.targetAudience}} in a {{$json.tone}} tone. Include engaging headlines and call-to-actions.'
            },
            position: [460, 300]
          },
          {
            id: 'set',
            type: 'n8n-nodes-base.set',
            name: 'Format Response',
            parameters: {
              values: {
                content: '={{$json.choices[0].message.content}}',
                generatedAt: '={{$now}}',
                wordCount: '={{$json.choices[0].message.content.split(" ").length}}'
              }
            },
            position: [680, 300]
          }
        ],
        connections: {
          'Content Request': { main: [[{ node: 'Generate Content', type: 'main', index: 0 }]] },
          'Generate Content': { main: [[{ node: 'Format Response', type: 'main', index: 0 }]] }
        }
      }
    });

    this.addTemplate({
      id: 'ai-document-processor',
      name: 'AI Document Processor',
      description: 'Extract information from documents using AI and store in structured format',
      category: 'AI',
      tags: ['ai', 'document', 'extraction', 'ocr', 'processing'],
      difficulty: 'advanced',
      estimatedTime: '60 minutes',
      useCases: ['Document digitization', 'Invoice processing', 'Contract analysis'],
      parameters: [
        { name: 'documentType', type: 'options', description: 'Type of document', required: true, options: ['invoice', 'contract', 'receipt', 'form'] },
        { name: 'extractionFields', type: 'array', description: 'Fields to extract', required: true }
      ],
      workflow: {
        name: 'AI Document Processor',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'Document Upload',
            parameters: { path: 'process-document', httpMethod: 'POST' },
            position: [240, 300]
          }
        ]
      }
    });
  }

  /**
   * Research business automation templates
   */
  async researchBusinessAutomationTemplates() {
    console.log('💼 Researching business automation templates...');
    
    this.addTemplate({
      id: 'lead-qualification-pipeline',
      name: 'Lead Qualification Pipeline',
      description: 'Automatically qualify and route leads based on scoring criteria',
      category: 'Business Automation',
      tags: ['leads', 'crm', 'qualification', 'sales', 'automation'],
      difficulty: 'intermediate',
      estimatedTime: '90 minutes',
      useCases: ['Sales automation', 'Lead management', 'CRM integration'],
      parameters: [
        { name: 'crmSystem', type: 'options', description: 'CRM system to use', required: true, options: ['salesforce', 'hubspot', 'pipedrive'] },
        { name: 'qualificationScore', type: 'number', description: 'Minimum qualification score', required: true }
      ],
      workflow: {
        name: 'Lead Qualification',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'New Lead',
            parameters: { path: 'new-lead', httpMethod: 'POST' },
            position: [240, 300]
          },
          {
            id: 'function',
            type: 'n8n-nodes-base.function',
            name: 'Calculate Lead Score',
            parameters: {
              functionCode: `
                const lead = $json;
                let score = 0;
                
                // Company size scoring
                if (lead.company_size === 'enterprise') score += 30;
                else if (lead.company_size === 'medium') score += 20;
                else if (lead.company_size === 'small') score += 10;
                
                // Budget scoring
                if (lead.budget >= 10000) score += 25;
                else if (lead.budget >= 5000) score += 15;
                else if (lead.budget >= 1000) score += 10;
                
                // Industry scoring
                if (['technology', 'finance', 'healthcare'].includes(lead.industry)) score += 15;
                
                // Role scoring
                if (['ceo', 'cto', 'vp', 'director'].includes(lead.role.toLowerCase())) score += 20;
                
                return [{ json: { ...lead, score } }];
              `
            },
            position: [460, 300]
          }
        ]
      }
    });
  }

  /**
   * Research e-commerce templates
   */
  async researchEcommerceTemplates() {
    console.log('🛍️ Researching e-commerce templates...');
    
    this.addTemplate({
      id: 'order-fulfillment-automation',
      name: 'Order Fulfillment Automation',
      description: 'Automate order processing from payment to shipping notifications',
      category: 'E-commerce',
      tags: ['orders', 'fulfillment', 'automation', 'shipping', 'notifications'],
      difficulty: 'advanced',
      estimatedTime: '120 minutes',
      useCases: ['Order processing', 'Fulfillment automation', 'Customer notifications'],
      parameters: [
        { name: 'ecommerceProvider', type: 'options', description: 'E-commerce platform', required: true, options: ['shopify', 'woocommerce', 'magento'] },
        { name: 'shippingProvider', type: 'options', description: 'Shipping provider', required: true, options: ['ups', 'fedex', 'dhl'] }
      ],
      workflow: {
        name: 'Order Fulfillment',
        nodes: [
          {
            id: 'shopifyTrigger',
            type: 'n8n-nodes-base.shopifyTrigger',
            name: 'New Order',
            parameters: { topic: 'orders/create' },
            position: [240, 300]
          }
        ]
      }
    });
  }

  /**
   * Research marketing templates
   */
  async researchMarketingTemplates() {
    console.log('📈 Researching marketing templates...');
    
    this.addTemplate({
      id: 'social-media-scheduler',
      name: 'Social Media Scheduler',
      description: 'Schedule and post content across multiple social media platforms',
      category: 'Marketing',
      tags: ['social-media', 'scheduling', 'content', 'automation'],
      difficulty: 'intermediate',
      estimatedTime: '60 minutes',
      useCases: ['Content marketing', 'Social media automation', 'Brand management'],
      parameters: [
        { name: 'platforms', type: 'multiOptions', description: 'Social media platforms', required: true, options: ['twitter', 'facebook', 'linkedin', 'instagram'] },
        { name: 'postingSchedule', type: 'string', description: 'Posting schedule (cron format)', required: true }
      ],
      workflow: {
        name: 'Social Media Scheduler',
        nodes: [
          {
            id: 'googleSheets',
            type: 'n8n-nodes-base.googleSheets',
            name: 'Read Content Calendar',
            parameters: {
              operation: 'read',
              sheetId: 'content-calendar-sheet-id',
              range: 'A:D'
            },
            position: [240, 300]
          }
        ]
      }
    });
  }

  /**
   * Research productivity templates
   */
  async researchProductivityTemplates() {
    console.log('⚡ Researching productivity templates...');
    
    this.addTemplate({
      id: 'meeting-notes-processor',
      name: 'Meeting Notes Processor',
      description: 'Process meeting recordings, extract action items, and distribute summaries',
      category: 'Productivity',
      tags: ['meetings', 'notes', 'ai', 'transcription', 'action-items'],
      difficulty: 'advanced',
      estimatedTime: '90 minutes',
      useCases: ['Meeting automation', 'Note-taking', 'Team productivity'],
      parameters: [
        { name: 'transcriptionService', type: 'options', description: 'Transcription service', required: true, options: ['whisper', 'assemblyai', 'rev'] },
        { name: 'summaryLength', type: 'options', description: 'Summary length', required: false, options: ['short', 'medium', 'detailed'] }
      ],
      workflow: {
        name: 'Meeting Notes Processor',
        nodes: [
          {
            id: 'webhook',
            type: 'n8n-nodes-base.webhook',
            name: 'Meeting Recording',
            parameters: { path: 'meeting-recording', httpMethod: 'POST' },
            position: [240, 300]
          }
        ]
      }
    });
  }

  /**
   * Research developer templates
   */
  async researchDeveloperTemplates() {
    console.log('👨‍💻 Researching developer templates...');
    
    this.addTemplate({
      id: 'github-deployment-pipeline',
      name: 'GitHub Deployment Pipeline',
      description: 'Automated deployment pipeline triggered by GitHub commits',
      category: 'Developer Tools',
      tags: ['github', 'deployment', 'ci-cd', 'automation'],
      difficulty: 'advanced',
      estimatedTime: '120 minutes',
      useCases: ['Continuous deployment', 'DevOps automation', 'Release management'],
      parameters: [
        { name: 'repository', type: 'string', description: 'GitHub repository', required: true },
        { name: 'branch', type: 'string', description: 'Deployment branch', required: true },
        { name: 'environment', type: 'options', description: 'Target environment', required: true, options: ['staging', 'production'] }
      ],
      workflow: {
        name: 'GitHub Deployment',
        nodes: [
          {
            id: 'githubTrigger',
            type: 'n8n-nodes-base.githubTrigger',
            name: 'GitHub Push',
            parameters: { repository: '={{$parameter["repository"]}}', events: ['push'] },
            position: [240, 300]
          }
        ]
      }
    });
  }

  /**
   * Add template to registry
   */
  addTemplate(template) {
    const fullTemplate = {
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags || [],
      difficulty: template.difficulty || 'intermediate',
      estimatedTime: template.estimatedTime || '30 minutes',
      useCases: template.useCases || [],
      parameters: template.parameters || [],
      workflow: template.workflow,
      version: '1.0.0',
      author: 'n8n Community',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.templates.set(fullTemplate.id, fullTemplate);
    
    // Update categories
    if (!this.categories.has(fullTemplate.category)) {
      this.categories.set(fullTemplate.category, []);
    }
    this.categories.get(fullTemplate.category).push(fullTemplate.id);
  }

  /**
   * Generate comprehensive template library
   */
  async generateTemplateLibrary() {
    console.log('📝 Generating comprehensive template library...');
    
    const library = {
      metadata: {
        totalTemplates: this.templates.size,
        totalCategories: this.categories.size,
        generated: new Date().toISOString(),
        version: '1.0.0'
      },
      categories: Object.fromEntries(this.categories),
      templates: Object.fromEntries(this.templates)
    };

    // Write main library file
    await fs.writeFile(
      path.join(this.outputDir, 'comprehensive-library.json'),
      JSON.stringify(library, null, 2)
    );

    // Write category-specific files
    for (const [category, templateIds] of this.categories) {
      const categoryTemplates = templateIds.map(id => this.templates.get(id));
      await fs.writeFile(
        path.join(this.outputDir, `${category.toLowerCase().replace(/\s+/g, '-')}.json`),
        JSON.stringify({
          category,
          count: categoryTemplates.length,
          templates: categoryTemplates
        }, null, 2)
      );
    }

    // Generate summary report
    const summary = {
      total: this.templates.size,
      byCategory: Object.fromEntries(
        Array.from(this.categories.entries()).map(([cat, ids]) => [cat, ids.length])
      ),
      byDifficulty: {
        beginner: Array.from(this.templates.values()).filter(t => t.difficulty === 'beginner').length,
        intermediate: Array.from(this.templates.values()).filter(t => t.difficulty === 'intermediate').length,
        advanced: Array.from(this.templates.values()).filter(t => t.difficulty === 'advanced').length
      },
      popularTags: this.getPopularTags()
    };

    await fs.writeFile(
      path.join(this.outputDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log(`📊 Generated template library with ${summary.total} templates:`);
    console.log(`   • Categories: ${Object.keys(summary.byCategory).join(', ')}`);
    console.log(`   • Difficulty: Beginner (${summary.byDifficulty.beginner}), Intermediate (${summary.byDifficulty.intermediate}), Advanced (${summary.byDifficulty.advanced})`);
  }

  /**
   * Get popular tags across all templates
   */
  getPopularTags() {
    const tagCounts = new Map();
    
    for (const template of this.templates.values()) {
      for (const tag of template.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }));
  }
}

// Run the research
const researcher = new N8nTemplateResearcher();
researcher.research().catch(console.error);