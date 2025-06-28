/**
 * AI Outlook Manager - Ultimate Workflow Examples
 * 
 * Complete workflow configurations for building the ultimate AI-powered
 * Outlook manager that communicates through Microsoft Teams.
 */

// Removed unused import: NodeTypeInfo

export interface WorkflowExample {
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  nodes: any[];
  connections: any[];
  useCase: string;
  benefits: string[];
}

export const aiOutlookWorkflows: WorkflowExample[] = [
  {
    name: 'Ultimate AI Email Assistant',
    description: 'Complete AI-powered email management with Teams notifications',
    category: 'AI & Productivity',
    difficulty: 'advanced',
    useCase: 'Automatically process incoming emails, categorize them, generate AI responses, and notify team via Teams',
    benefits: [
      'Automatic email categorization and priority detection',
      'AI-generated responses for common inquiries',
      'Real-time Teams notifications for urgent emails',
      'Sentiment analysis for customer communications',
      'Action item extraction from email conversations'
    ],
    nodes: [
      {
        name: 'Email Trigger',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'getAll',
          filters: {
            isRead: 'false',
            dateRange: 1
          },
          aiFeatures: {
            enableSentimentAnalysis: true,
            enablePriorityDetection: true,
            enableCategorization: true,
            enableSummarization: true
          },
          options: {
            limit: 25
          }
        },
        position: [120, 200]
      },
      {
        name: 'AI Email Processor',
        type: 'n8n-nodes-base.openAi',
        parameters: {
          resource: 'text',
          textOperation: 'analyzeSentiment',
          model: 'gpt-4',
          systemMessage: 'You are an expert email analyst. Analyze the email content and provide detailed insights including sentiment, urgency, category, and recommended actions.',
          prompt: 'Analyze this email for sentiment, urgency, and category: {{ $node["Email Trigger"].json["bodyPreview"] }}',
          temperature: 0.3,
          maxTokens: 500,
          outlookIntegration: {
            enableEmailSummary: true,
            enableSentimentAnalysis: true,
            enablePriorityDetection: true,
            enableCategorization: true
          },
          options: {
            responseFormat: 'json'
          }
        },
        position: [340, 200]
      },
      {
        name: 'Priority Email Check',
        type: 'n8n-nodes-base.if',
        parameters: {
          conditions: {
            options: {
              caseSensitive: true,
              leftValue: '',
              typeValidation: 'strict'
            },
            conditions: [
              {
                id: '1',
                leftValue: '={{ $node["AI Email Processor"].json["urgency"] }}',
                rightValue: 'high',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ],
            combinator: 'and'
          }
        },
        position: [560, 200]
      },
      {
        name: 'Generate AI Response',
        type: 'n8n-nodes-base.openAi',
        parameters: {
          resource: 'text',
          textOperation: 'generate',
          model: 'gpt-4',
          systemMessage: 'You are a professional email assistant. Generate polite, helpful, and contextually appropriate email responses based on the email content and analysis.',
          prompt: 'Generate a professional email response based on this email content: {{ $node["Email Trigger"].json["bodyPreview"] }} and analysis: {{ $node["AI Email Processor"].json }}',
          temperature: 0.7,
          maxTokens: 800,
          outlookIntegration: {
            enableSmartReply: true,
            enableSentimentAnalysis: true
          }
        },
        position: [340, 360]
      },
      {
        name: 'Send Teams Alert',
        type: 'n8n-nodes-base.microsoftTeams',
        parameters: {
          resource: 'message',
          messageOperation: 'send',
          teamId: 'your-team-id',
          channelId: 'your-channel-id',
          messageType: 'adaptiveCard',
          adaptiveCardContent: {
            type: 'AdaptiveCard',
            version: '1.3',
            body: [
              {
                type: 'TextBlock',
                text: '🚨 High Priority Email Alert',
                size: 'Medium',
                weight: 'Bolder',
                color: 'Attention'
              },
              {
                type: 'TextBlock',
                text: 'From: {{ $node["Email Trigger"].json["from"]["emailAddress"]["name"] }}',
                weight: 'Bolder'
              },
              {
                type: 'TextBlock',
                text: 'Subject: {{ $node["Email Trigger"].json["subject"] }}',
                wrap: true
              },
              {
                type: 'TextBlock',
                text: 'AI Analysis: {{ $node["AI Email Processor"].json["summary"] }}',
                wrap: true,
                spacing: 'Medium'
              },
              {
                type: 'TextBlock',
                text: 'Sentiment: {{ $node["AI Email Processor"].json["sentiment"] }}',
                color: '{{ $node["AI Email Processor"].json["sentiment"] === "positive" ? "Good" : $node["AI Email Processor"].json["sentiment"] === "negative" ? "Attention" : "Default" }}'
              }
            ],
            actions: [
              {
                type: 'Action.OpenUrl',
                title: 'Open Email',
                url: '{{ $node["Email Trigger"].json["webLink"] }}'
              },
              {
                type: 'Action.OpenUrl',
                title: 'View in Outlook',
                url: 'https://outlook.office.com'
              }
            ]
          },
          aiFeatures: {
            enableSentimentAnalysis: true,
            enableActionItemDetection: true
          }
        },
        position: [780, 120]
      },
      {
        name: 'Auto Reply Email',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'reply',
          messageId: '{{ $node["Email Trigger"].json["id"] }}',
          bodyContent: '{{ $node["Generate AI Response"].json["choices"][0]["message"]["content"] }}',
          bodyContentType: 'html',
          aiFeatures: {
            enableSentimentAnalysis: true,
            enableAutoResponse: true
          }
        },
        position: [560, 360]
      },
      {
        name: 'Update Email Status',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'update',
          messageId: '{{ $node["Email Trigger"].json["id"] }}',
          importance: '{{ $node["AI Email Processor"].json["urgency"] === "high" ? "high" : "normal" }}'
        },
        position: [780, 360]
      }
    ],
    connections: [
      {
        node: 'Email Trigger',
        type: 'main',
        index: 0,
        target: 'AI Email Processor'
      },
      {
        node: 'AI Email Processor',
        type: 'main',
        index: 0,
        target: 'Priority Email Check'
      },
      {
        node: 'Priority Email Check',
        type: 'main',
        index: 0,
        target: 'Send Teams Alert'
      },
      {
        node: 'AI Email Processor',
        type: 'main',
        index: 0,
        target: 'Generate AI Response'
      },
      {
        node: 'Generate AI Response',
        type: 'main',
        index: 0,
        target: 'Auto Reply Email'
      },
      {
        node: 'Auto Reply Email',
        type: 'main',
        index: 0,
        target: 'Update Email Status'
      }
    ]
  },
  {
    name: 'Teams Meeting AI Assistant',
    description: 'AI-powered meeting management with automatic summaries and action items',
    category: 'AI & Productivity',
    difficulty: 'advanced',
    useCase: 'Monitor Teams meetings, generate AI summaries, extract action items, and create follow-up tasks',
    benefits: [
      'Automatic meeting transcription and summarization',
      'Action item extraction and assignment',
      'Meeting insights and participant analysis',
      'Automated follow-up email generation',
      'Integration with task management systems'
    ],
    nodes: [
      {
        name: 'Meeting Trigger',
        type: 'n8n-nodes-base.microsoftTeamsTrigger',
        parameters: {
          triggerEvent: 'meeting.ended',
          aiProcessing: {
            enableSentimentAnalysis: true,
            enableActionDetection: true
          }
        },
        position: [120, 200]
      },
      {
        name: 'Get Meeting Transcript',
        type: 'n8n-nodes-base.microsoftTeams',
        parameters: {
          resource: 'meeting',
          meetingOperation: 'getTranscript',
          meetingId: '{{ $node["Meeting Trigger"].json["id"] }}'
        },
        position: [340, 200]
      },
      {
        name: 'AI Meeting Analyzer',
        type: 'n8n-nodes-base.openAi',
        parameters: {
          resource: 'text',
          textOperation: 'summarize',
          model: 'gpt-4',
          systemMessage: 'You are an expert meeting analyst. Analyze meeting transcripts and provide comprehensive summaries including key discussion points, decisions made, action items, and participant insights.',
          prompt: 'Analyze this meeting transcript and provide: 1) Executive Summary, 2) Key Discussion Points, 3) Decisions Made, 4) Action Items with assigned owners, 5) Next Steps. Transcript: {{ $node["Get Meeting Transcript"].json["content"] }}',
          temperature: 0.3,
          maxTokens: 1500,
          teamsIntegration: {
            enableMeetingSummary: true,
            enableActionItems: true
          },
          options: {
            responseFormat: 'markdown'
          }
        },
        position: [560, 200]
      },
      {
        name: 'Extract Action Items',
        type: 'n8n-nodes-base.openAi',
        parameters: {
          resource: 'text',
          textOperation: 'extractKeywords',
          model: 'gpt-4',
          systemMessage: 'Extract action items from meeting analysis. Format as JSON with fields: task, assignee, deadline, priority.',
          prompt: 'Extract action items from this meeting analysis: {{ $node["AI Meeting Analyzer"].json["choices"][0]["message"]["content"] }}',
          temperature: 0.2,
          maxTokens: 800,
          teamsIntegration: {
            enableActionItems: true
          },
          options: {
            responseFormat: 'json'
          }
        },
        position: [780, 120]
      },
      {
        name: 'Send Meeting Summary',
        type: 'n8n-nodes-base.microsoftTeams',
        parameters: {
          resource: 'message',
          messageOperation: 'send',
          teamId: '{{ $node["Meeting Trigger"].json["teamId"] }}',
          channelId: '{{ $node["Meeting Trigger"].json["channelId"] }}',
          messageType: 'adaptiveCard',
          adaptiveCardContent: {
            type: 'AdaptiveCard',
            version: '1.3',
            body: [
              {
                type: 'TextBlock',
                text: '📝 Meeting Summary',
                size: 'Large',
                weight: 'Bolder'
              },
              {
                type: 'TextBlock',
                text: 'Meeting: {{ $node["Meeting Trigger"].json["subject"] }}',
                weight: 'Bolder',
                spacing: 'Medium'
              },
              {
                type: 'TextBlock',
                text: '{{ $node["AI Meeting Analyzer"].json["choices"][0]["message"]["content"] }}',
                wrap: true,
                spacing: 'Medium'
              }
            ],
            actions: [
              {
                type: 'Action.OpenUrl',
                title: 'View Full Recording',
                url: '{{ $node["Meeting Trigger"].json["recordingUrl"] }}'
              }
            ]
          },
          aiFeatures: {
            enableSmartSummary: true,
            enableActionItemDetection: true
          }
        },
        position: [780, 280]
      },
      {
        name: 'Create Follow-up Email',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'send',
          to: '{{ $node["Meeting Trigger"].json["attendees"] }}',
          subject: 'Follow-up: {{ $node["Meeting Trigger"].json["subject"] }}',
          bodyContent: `
            <h2>Meeting Follow-up</h2>
            <p>Thank you for participating in today's meeting. Please find the AI-generated summary and action items below:</p>
            
            {{ $node["AI Meeting Analyzer"].json["choices"][0]["message"]["content"] }}
            
            <h3>Action Items</h3>
            {{ $node["Extract Action Items"].json["choices"][0]["message"]["content"] }}
            
            <p>If you have any questions or need clarification on any action items, please don't hesitate to reach out.</p>
          `,
          bodyContentType: 'html',
          importance: 'normal',
          aiFeatures: {
            enableSentimentAnalysis: true,
            enableAutoResponse: true
          }
        },
        position: [1000, 200]
      }
    ],
    connections: [
      {
        node: 'Meeting Trigger',
        type: 'main',
        index: 0,
        target: 'Get Meeting Transcript'
      },
      {
        node: 'Get Meeting Transcript',
        type: 'main',
        index: 0,
        target: 'AI Meeting Analyzer'
      },
      {
        node: 'AI Meeting Analyzer',
        type: 'main',
        index: 0,
        target: 'Extract Action Items'
      },
      {
        node: 'AI Meeting Analyzer',
        type: 'main',
        index: 0,
        target: 'Send Meeting Summary'
      },
      {
        node: 'Extract Action Items',
        type: 'main',
        index: 0,
        target: 'Create Follow-up Email'
      }
    ]
  },
  {
    name: 'Intelligent Email Categorization System',
    description: 'Advanced AI system for automatic email categorization and routing',
    category: 'AI & Productivity',
    difficulty: 'intermediate',
    useCase: 'Automatically categorize incoming emails, route them to appropriate folders, and notify relevant team members',
    benefits: [
      'Automatic email categorization using AI',
      'Smart folder organization',
      'Team notifications for specific categories',
      'Priority-based routing',
      'Custom categorization rules'
    ],
    nodes: [
      {
        name: 'Email Monitor',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'getAll',
          filters: {
            isRead: 'false',
            dateRange: 1
          },
          aiFeatures: {
            enableCategorization: true,
            enablePriorityDetection: true
          },
          options: {
            limit: 50
          }
        },
        position: [120, 200]
      },
      {
        name: 'AI Categorizer',
        type: 'n8n-nodes-base.openAi',
        parameters: {
          resource: 'text',
          textOperation: 'classify',
          model: 'gpt-4',
          systemMessage: 'You are an expert email categorizer. Analyze email content and classify into categories: Customer Support, Sales, Marketing, Internal, Urgent, Spam, Newsletter, Invoice, Meeting Request, Project Update.',
          prompt: 'Categorize this email based on subject and content. Subject: {{ $node["Email Monitor"].json["subject"] }} Content: {{ $node["Email Monitor"].json["bodyPreview"] }}',
          temperature: 0.2,
          maxTokens: 200,
          outlookIntegration: {
            enableCategorization: true,
            enablePriorityDetection: true
          },
          options: {
            responseFormat: 'json'
          }
        },
        position: [340, 200]
      },
      {
        name: 'Route Customer Support',
        type: 'n8n-nodes-base.if',
        parameters: {
          conditions: {
            conditions: [
              {
                leftValue: '={{ $node["AI Categorizer"].json["category"] }}',
                rightValue: 'Customer Support',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ]
          }
        },
        position: [560, 120]
      },
      {
        name: 'Route Sales',
        type: 'n8n-nodes-base.if',
        parameters: {
          conditions: {
            conditions: [
              {
                leftValue: '={{ $node["AI Categorizer"].json["category"] }}',
                rightValue: 'Sales',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ]
          }
        },
        position: [560, 200]
      },
      {
        name: 'Route Urgent',
        type: 'n8n-nodes-base.if',
        parameters: {
          conditions: {
            conditions: [
              {
                leftValue: '={{ $node["AI Categorizer"].json["priority"] }}',
                rightValue: 'urgent',
                operator: {
                  type: 'string',
                  operation: 'equals'
                }
              }
            ]
          }
        },
        position: [560, 280]
      },
      {
        name: 'Move to Support Folder',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'move',
          messageId: '{{ $node["Email Monitor"].json["id"] }}',
          folder: 'Customer Support'
        },
        position: [780, 120]
      },
      {
        name: 'Notify Support Team',
        type: 'n8n-nodes-base.microsoftTeams',
        parameters: {
          resource: 'message',
          messageOperation: 'send',
          teamId: 'support-team-id',
          channelId: 'support-channel-id',
          messageContent: '🎧 New Customer Support Email: {{ $node["Email Monitor"].json["subject"] }} from {{ $node["Email Monitor"].json["from"]["emailAddress"]["name"] }}',
          messageType: 'html'
        },
        position: [1000, 120]
      },
      {
        name: 'Move to Sales Folder',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'move',
          messageId: '{{ $node["Email Monitor"].json["id"] }}',
          folder: 'Sales'
        },
        position: [780, 200]
      },
      {
        name: 'Notify Sales Team',
        type: 'n8n-nodes-base.microsoftTeams',
        parameters: {
          resource: 'message',
          messageOperation: 'send',
          teamId: 'sales-team-id',
          channelId: 'sales-channel-id',
          messageContent: '💰 New Sales Inquiry: {{ $node["Email Monitor"].json["subject"] }} from {{ $node["Email Monitor"].json["from"]["emailAddress"]["name"] }}',
          messageType: 'html'
        },
        position: [1000, 200]
      },
      {
        name: 'Flag as Urgent',
        type: 'n8n-nodes-base.microsoftOutlook',
        parameters: {
          resource: 'message',
          messageOperation: 'flag',
          messageId: '{{ $node["Email Monitor"].json["id"] }}'
        },
        position: [780, 280]
      },
      {
        name: 'Urgent Alert',
        type: 'n8n-nodes-base.microsoftTeams',
        parameters: {
          resource: 'message',
          messageOperation: 'send',
          teamId: 'management-team-id',
          channelId: 'urgent-channel-id',
          messageContent: '🚨 URGENT EMAIL: {{ $node["Email Monitor"].json["subject"] }} from {{ $node["Email Monitor"].json["from"]["emailAddress"]["name"] }}',
          messageType: 'html',
          mentions: {
            mention: [
              {
                type: 'user',
                id: 'manager-user-id',
                displayName: 'Manager'
              }
            ]
          }
        },
        position: [1000, 280]
      }
    ],
    connections: [
      {
        node: 'Email Monitor',
        type: 'main',
        index: 0,
        target: 'AI Categorizer'
      },
      {
        node: 'AI Categorizer',
        type: 'main',
        index: 0,
        target: 'Route Customer Support'
      },
      {
        node: 'AI Categorizer',
        type: 'main',
        index: 0,
        target: 'Route Sales'
      },
      {
        node: 'AI Categorizer',
        type: 'main',
        index: 0,
        target: 'Route Urgent'
      },
      {
        node: 'Route Customer Support',
        type: 'main',
        index: 0,
        target: 'Move to Support Folder'
      },
      {
        node: 'Move to Support Folder',
        type: 'main',
        index: 0,
        target: 'Notify Support Team'
      },
      {
        node: 'Route Sales',
        type: 'main',
        index: 0,
        target: 'Move to Sales Folder'
      },
      {
        node: 'Move to Sales Folder',
        type: 'main',
        index: 0,
        target: 'Notify Sales Team'
      },
      {
        node: 'Route Urgent',
        type: 'main',
        index: 0,
        target: 'Flag as Urgent'
      },
      {
        node: 'Flag as Urgent',
        type: 'main',
        index: 0,
        target: 'Urgent Alert'
      }
    ]
  }
];

export const workflowCategories = [
  'Email Management',
  'Meeting Automation',
  'Team Communication',
  'AI Processing',
  'Task Management',
  'Reporting & Analytics'
];

export const workflowDifficulties = [
  'beginner',
  'intermediate',
  'advanced'
];

/**
 * Get workflows by category
 */
export function getWorkflowsByCategory(category: string): WorkflowExample[] {
  return aiOutlookWorkflows.filter(workflow => 
    workflow.category.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Get workflows by difficulty
 */
export function getWorkflowsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): WorkflowExample[] {
  return aiOutlookWorkflows.filter(workflow => workflow.difficulty === difficulty);
}

/**
 * Search workflows
 */
export function searchWorkflows(query: string): WorkflowExample[] {
  const lowerQuery = query.toLowerCase();
  return aiOutlookWorkflows.filter(workflow => 
    workflow.name.toLowerCase().includes(lowerQuery) ||
    workflow.description.toLowerCase().includes(lowerQuery) ||
    workflow.useCase.toLowerCase().includes(lowerQuery) ||
    workflow.benefits.some(benefit => benefit.toLowerCase().includes(lowerQuery))
  );
}

export default aiOutlookWorkflows;
