/**
 * Microsoft Outlook Node - Comprehensive Email Management
 * 
 * Advanced Microsoft Outlook integration for email management,
 * calendar operations, and contact handling for AI-powered automation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const microsoftOutlookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftOutlook',
  displayName: 'Microsoft Outlook',
  description: 'Comprehensive Microsoft Outlook integration for email, calendar, and contact management with AI-powered automation capabilities',
  category: 'AI & Productivity',
  subcategory: 'Email Management',
  
  properties: [
    // Authentication
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'oAuth2',
      options: [
        { name: 'OAuth2', value: 'oAuth2' },
        { name: 'Microsoft Graph API', value: 'microsoftGraphApi' }
      ],
      description: 'Authentication method for Microsoft Outlook'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      options: [
        { name: 'Message', value: 'message' },
        { name: 'Calendar Event', value: 'calendarEvent' },
        { name: 'Contact', value: 'contact' },
        { name: 'Folder', value: 'folder' },
        { name: 'Category', value: 'category' },
        { name: 'Rule', value: 'rule' },
        { name: 'Attachment', value: 'attachment' }
      ],
      description: 'Choose the Outlook resource to work with'
    },

    // Message operations
    {
      name: 'messageOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['message'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Send', value: 'send' },
        { name: 'Reply', value: 'reply' },
        { name: 'Reply All', value: 'replyAll' },
        { name: 'Forward', value: 'forward' },
        { name: 'Move', value: 'move' },
        { name: 'Copy', value: 'copy' },
        { name: 'Delete', value: 'delete' },
        { name: 'Mark as Read', value: 'markAsRead' },
        { name: 'Mark as Unread', value: 'markAsUnread' },
        { name: 'Flag', value: 'flag' },
        { name: 'Unflag', value: 'unflag' },
        { name: 'Archive', value: 'archive' },
        { name: 'Update', value: 'update' }
      ],
      description: 'Select the operation to perform on messages'
    },

    // Calendar Event operations
    {
      name: 'calendarEventOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['calendarEvent'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Accept', value: 'accept' },
        { name: 'Decline', value: 'decline' },
        { name: 'Tentative', value: 'tentative' },
        { name: 'Cancel', value: 'cancel' }
      ],
      description: 'Select the operation to perform on calendar events'
    },

    // Contact operations
    {
      name: 'contactOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['contact'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ],
      description: 'Select the operation to perform on contacts'
    },

    // Message ID
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['get', 'reply', 'replyAll', 'forward', 'move', 'copy', 'delete', 'markAsRead', 'markAsUnread', 'flag', 'unflag', 'archive', 'update']
        }
      },
      description: 'The message ID'
    },

    // Email composition fields
    {
      name: 'to',
      displayName: 'To',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send']
        }
      },
      description: 'Recipient email addresses (comma-separated)'
    },

    {
      name: 'cc',
      displayName: 'CC',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send', 'reply', 'replyAll', 'forward']
        }
      },
      description: 'CC email addresses (comma-separated)'
    },

    {
      name: 'bcc',
      displayName: 'BCC',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send', 'reply', 'replyAll', 'forward']
        }
      },
      description: 'BCC email addresses (comma-separated)'
    },

    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send', 'reply', 'replyAll', 'forward', 'update']
        }
      },
      description: 'Email subject line'
    },

    {
      name: 'bodyContent',
      displayName: 'Body Content',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 6
      },
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send', 'reply', 'replyAll', 'forward']
        }
      },
      description: 'Email body content'
    },

    {
      name: 'bodyContentType',
      displayName: 'Body Content Type',
      type: 'options',
      required: false,
      default: 'html',
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send', 'reply', 'replyAll', 'forward']
        }
      },
      options: [
        { name: 'HTML', value: 'html' },
        { name: 'Text', value: 'text' }
      ],
      description: 'Format of the email body'
    },

    {
      name: 'importance',
      displayName: 'Importance',
      type: 'options',
      required: false,
      default: 'normal',
      displayOptions: {
        show: { 
          resource: ['message'],
          messageOperation: ['send', 'update']
        }
      },
      options: [
        { name: 'Low', value: 'low' },
        { name: 'Normal', value: 'normal' },
        { name: 'High', value: 'high' }
      ],
      description: 'Email importance level'
    },

    // Calendar Event fields
    {
      name: 'eventSubject',
      displayName: 'Subject',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['calendarEvent'],
          calendarEventOperation: ['create', 'update']
        }
      },
      description: 'Event subject/title'
    },

    {
      name: 'eventStart',
      displayName: 'Start Date/Time',
      type: 'dateTime',
      required: true,
      displayOptions: {
        show: { 
          resource: ['calendarEvent'],
          calendarEventOperation: ['create', 'update']
        }
      },
      description: 'Event start date and time'
    },

    {
      name: 'eventEnd',
      displayName: 'End Date/Time',
      type: 'dateTime',
      required: true,
      displayOptions: {
        show: { 
          resource: ['calendarEvent'],
          calendarEventOperation: ['create', 'update']
        }
      },
      description: 'Event end date and time'
    },

    {
      name: 'eventAttendees',
      displayName: 'Attendees',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['calendarEvent'],
          calendarEventOperation: ['create', 'update']
        }
      },
      description: 'Attendee email addresses (comma-separated)'
    },

    {
      name: 'eventLocation',
      displayName: 'Location',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['calendarEvent'],
          calendarEventOperation: ['create', 'update']
        }
      },
      description: 'Event location'
    },

    {
      name: 'eventBody',
      displayName: 'Description',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 4
      },
      displayOptions: {
        show: { 
          resource: ['calendarEvent'],
          calendarEventOperation: ['create', 'update']
        }
      },
      description: 'Event description'
    },

    // Contact fields
    {
      name: 'contactDisplayName',
      displayName: 'Display Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['contact'],
          contactOperation: ['create', 'update']
        }
      },
      description: 'Contact display name'
    },

    {
      name: 'contactEmailAddress',
      displayName: 'Email Address',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['contact'],
          contactOperation: ['create', 'update']
        }
      },
      description: 'Contact email address'
    },

    {
      name: 'contactJobTitle',
      displayName: 'Job Title',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['contact'],
          contactOperation: ['create', 'update']
        }
      },
      description: 'Contact job title'
    },

    {
      name: 'contactCompanyName',
      displayName: 'Company Name',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['contact'],
          contactOperation: ['create', 'update']
        }
      },
      description: 'Contact company name'
    },

    // AI-Enhanced Features
    {
      name: 'aiFeatures',
      displayName: 'AI Features',
      type: 'collection',
      required: false,
      default: {},
      description: 'Enable AI-powered features for email processing',
      options: [
        {
          name: 'enableSentimentAnalysis',
          displayName: 'Enable Sentiment Analysis',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Analyze email sentiment'
        },
        {
          name: 'enableAutoResponse',
          displayName: 'Enable Auto Response',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Generate AI-powered auto responses'
        },
        {
          name: 'enableCategorization',
          displayName: 'Enable Auto Categorization',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically categorize emails'
        },
        {
          name: 'enablePriorityDetection',
          displayName: 'Enable Priority Detection',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Detect email priority using AI'
        },
        {
          name: 'enableSummarization',
          displayName: 'Enable Email Summarization',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Generate email summaries'
        }
      ]
    },

    // Filtering and search options
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'collection',
      required: false,
      default: {},
      description: 'Filter options for retrieving messages or events',
      options: [
        {
          name: 'folder',
          displayName: 'Folder',
          type: 'string',
          required: false,
          description: 'Specific folder to search in'
        },
        {
          name: 'from',
          displayName: 'From',
          type: 'string',
          required: false,
          description: 'Filter by sender email'
        },
        {
          name: 'hasAttachments',
          displayName: 'Has Attachments',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Filter messages with attachments'
        },
        {
          name: 'isRead',
          displayName: 'Is Read',
          type: 'options',
          required: false,
          options: [
            { name: 'All', value: 'all' },
            { name: 'Read', value: 'true' },
            { name: 'Unread', value: 'false' }
          ],
          default: 'all',
          description: 'Filter by read status'
        },
        {
          name: 'dateRange',
          displayName: 'Date Range (Days)',
          type: 'number',
          required: false,
          description: 'Number of days to look back'
        },
        {
          name: 'searchQuery',
          displayName: 'Search Query',
          type: 'string',
          required: false,
          description: 'Search in subject and body'
        }
      ]
    },

    // Pagination and limits
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options',
      options: [
        {
          name: 'limit',
          displayName: 'Limit',
          type: 'number',
          required: false,
          default: 50,
          description: 'Maximum number of results'
        },
        {
          name: 'returnAll',
          displayName: 'Return All',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Return all results (ignores limit)'
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Microsoft Outlook API response data'
    }
  ],

  credentials: [
    {
      name: 'microsoftOutlookOAuth2Api',
      required: true,
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    },
    {
      name: 'microsoftGraphApi',
      required: true,
      displayOptions: {
        show: {
          authentication: ['microsoftGraphApi']
        }
      }
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Microsoft Outlook'
  },

  aliases: ['outlook', 'email', 'microsoft', 'office365', 'exchange'],
  
  examples: [
    {
      name: 'Send AI-Powered Email',
      description: 'Send an email with AI sentiment analysis and auto-categorization',
      workflow: {
        nodes: [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'message',
              messageOperation: 'send',
              to: 'recipient@example.com',
              subject: 'AI-Powered Email Test',
              bodyContent: 'This is an AI-enhanced email with sentiment analysis enabled.',
              bodyContentType: 'html',
              importance: 'normal',
              aiFeatures: {
                enableSentimentAnalysis: true,
                enableCategorization: true,
                enablePriorityDetection: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Get Unread Emails with AI Processing',
      description: 'Retrieve unread emails and process them with AI features',
      workflow: {
        nodes: [
          {
            name: 'Get Unread Emails',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'message',
              messageOperation: 'getAll',
              filters: {
                isRead: 'false',
                dateRange: 7
              },
              aiFeatures: {
                enableSentimentAnalysis: true,
                enableSummarization: true,
                enablePriorityDetection: true
              },
              options: {
                limit: 25
              }
            }
          }
        ]
      }
    },
    {
      name: 'Create Meeting with Teams Integration',
      description: 'Create a calendar event that includes Teams meeting link',
      workflow: {
        nodes: [
          {
            name: 'Create Meeting',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'calendarEvent',
              calendarEventOperation: 'create',
              eventSubject: 'AI Strategy Meeting',
              eventStart: '2024-02-15T10:00:00',
              eventEnd: '2024-02-15T11:00:00',
              eventAttendees: 'team@example.com,manager@example.com',
              eventLocation: 'Microsoft Teams Meeting',
              eventBody: 'Discussing AI implementation strategy for Q1 2024'
            }
          }
        ]
      }
    }
  ]
};

export default microsoftOutlookNode;
