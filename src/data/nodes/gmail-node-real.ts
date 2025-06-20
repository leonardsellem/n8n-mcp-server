import { NodeTypeInfo } from '../node-types.js';

export const gmailNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gmail',
  displayName: 'Gmail',
  description: 'Use the Gmail node to automate work in Gmail, and integrate Gmail with other applications. Supports creating, updating, deleting, and getting drafts, messages, labels, and threads.',
  category: 'Communication',
  subcategory: 'Email',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Draft', value: 'draft', description: 'Work with email drafts' },
        { name: 'Label', value: 'label', description: 'Manage email labels' },
        { name: 'Message', value: 'message', description: 'Handle email messages' },
        { name: 'Thread', value: 'thread', description: 'Manage email threads' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['message']
        }
      },
      options: [
        { name: 'Create', value: 'create', description: 'Create a new message' },
        { name: 'Delete', value: 'delete', description: 'Delete a message' },
        { name: 'Get', value: 'get', description: 'Get a message' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple messages' },
        { name: 'Reply', value: 'reply', description: 'Reply to a message' },
        { name: 'Send', value: 'send', description: 'Send a message' },
        { name: 'Add Label', value: 'addLabel', description: 'Add label to message' },
        { name: 'Remove Label', value: 'removeLabel', description: 'Remove label from message' },
        { name: 'Mark as Read', value: 'markAsRead', description: 'Mark message as read' },
        { name: 'Mark as Unread', value: 'markAsUnread', description: 'Mark message as unread' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['draft']
        }
      },
      options: [
        { name: 'Create', value: 'create', description: 'Create a new draft' },
        { name: 'Delete', value: 'delete', description: 'Delete a draft' },
        { name: 'Get', value: 'get', description: 'Get a draft' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple drafts' },
        { name: 'Send', value: 'send', description: 'Send a draft' }
      ]
    },
    // Message/Draft Content
    {
      name: 'sendTo',
      displayName: 'To',
      type: 'string',
      required: true,
      default: '',
      description: 'Email address(es) to send to',
      displayOptions: {
        show: {
          operation: ['send', 'create'],
          resource: ['message', 'draft']
        }
      },
      placeholder: 'recipient@example.com'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: true,
      default: '',
      description: 'Subject of the email',
      displayOptions: {
        show: {
          operation: ['send', 'create'],
          resource: ['message', 'draft']
        }
      }
    },
    {
      name: 'emailType',
      displayName: 'Email Type',
      type: 'options',
      required: false,
      default: 'text',
      description: 'The type of email to send',
      displayOptions: {
        show: {
          operation: ['send', 'create'],
          resource: ['message', 'draft']
        }
      },
      options: [
        { name: 'Text', value: 'text', description: 'Plain text email' },
        { name: 'HTML', value: 'html', description: 'HTML formatted email' }
      ]
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: true,
      default: '',
      description: 'Content of the email',
      displayOptions: {
        show: {
          operation: ['send', 'create'],
          resource: ['message', 'draft']
        }
      },
      typeOptions: {
        rows: 5
      }
    },
    // Options for advanced settings
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options',
      displayOptions: {
        show: {
          operation: ['send', 'create', 'reply'],
          resource: ['message', 'draft']
        }
      },
      options: [
        {
          name: 'ccEmails',
          displayName: 'CC',
          type: 'string',
          default: '',
          description: 'Email addresses for CC'
        },
        {
          name: 'bccEmails',
          displayName: 'BCC',
          type: 'string',
          default: '',
          description: 'Email addresses for BCC'
        },
        {
          name: 'threadId',
          displayName: 'Thread ID',
          type: 'string',
          default: '',
          description: 'ID of the thread for reply'
        },
        {
          name: 'inReplyTo',
          displayName: 'In Reply To',
          type: 'string',
          default: '',
          description: 'Message ID this is replying to'
        },
        {
          name: 'attachments',
          displayName: 'Attachments',
          type: 'fixedCollection',
          default: {},
          description: 'Email attachments',
          options: [
            {
              name: 'attachment',
              displayName: 'Attachment',
              values: [
                {
                  name: 'filename',
                  displayName: 'Filename',
                  type: 'string',
                  default: '',
                  description: 'Name of the file'
                },
                {
                  name: 'data',
                  displayName: 'Data',
                  type: 'string',
                  default: '',
                  description: 'Base64 encoded file data or binary data reference'
                },
                {
                  name: 'type',
                  displayName: 'MIME Type',
                  type: 'string',
                  default: '',
                  description: 'MIME type of the file'
                }
              ]
            }
          ]
        }
      ]
    },
    // Message ID for operations requiring it
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: true,
      default: '',
      description: 'ID of the message',
      displayOptions: {
        show: {
          operation: ['get', 'delete', 'reply', 'addLabel', 'removeLabel', 'markAsRead', 'markAsUnread'],
          resource: ['message']
        }
      }
    },
    // Draft ID for draft operations
    {
      name: 'draftId',
      displayName: 'Draft ID',
      type: 'string',
      required: true,
      default: '',
      description: 'ID of the draft',
      displayOptions: {
        show: {
          operation: ['get', 'delete', 'send'],
          resource: ['draft']
        }
      }
    },
    // Label operations
    {
      name: 'labelIds',
      displayName: 'Label IDs',
      type: 'multiOptions',
      required: true,
      default: [],
      description: 'Label IDs to add or remove',
      displayOptions: {
        show: {
          operation: ['addLabel', 'removeLabel']
        }
      },
      options: [
        { name: 'INBOX', value: 'INBOX' },
        { name: 'SENT', value: 'SENT' },
        { name: 'DRAFT', value: 'DRAFT' },
        { name: 'SPAM', value: 'SPAM' },
        { name: 'TRASH', value: 'TRASH' },
        { name: 'UNREAD', value: 'UNREAD' },
        { name: 'STARRED', value: 'STARRED' },
        { name: 'IMPORTANT', value: 'IMPORTANT' }
      ]
    },
    // Query parameters for getAll
    {
      name: 'q',
      displayName: 'Query',
      type: 'string',
      required: false,
      default: '',
      description: 'Gmail search query (e.g., "from:sender@example.com subject:important")',
      displayOptions: {
        show: {
          operation: ['getAll'],
          resource: ['message', 'draft', 'thread']
        }
      },
      placeholder: 'from:example@domain.com'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return',
      displayOptions: {
        show: {
          operation: ['getAll']
        }
      },
      typeOptions: {
        minValue: 1,
        maxValue: 500
      }
    },
    {
      name: 'includeSpamTrash',
      displayName: 'Include Spam and Trash',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include messages from SPAM and TRASH in the results',
      displayOptions: {
        show: {
          operation: ['getAll']
        }
      }
    },
    // Additional options for message format
    {
      name: 'format',
      displayName: 'Format',
      type: 'options',
      required: false,
      default: 'metadata',
      description: 'The format to return the message in',
      displayOptions: {
        show: {
          operation: ['get'],
          resource: ['message']
        }
      },
      options: [
        { name: 'Full', value: 'full', description: 'Returns the full email message data' },
        { name: 'Metadata', value: 'metadata', description: 'Returns only email message metadata' },
        { name: 'Minimal', value: 'minimal', description: 'Returns minimal email message data' },
        { name: 'Raw', value: 'raw', description: 'Returns the raw email message' }
      ]
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Gmail operation result'
    }
  ],
  credentials: [
    {
      name: 'gmailOAuth2',
      required: true,
      types: ['gmailOAuth2'],
      description: 'Gmail OAuth2 API credentials',
      documentationUrl: 'https://developers.google.com/gmail/api/auth/oauth2'
    }
  ],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  webhookSupport: false,
  version: [1, 2, 3],
  defaults: {
    name: 'Gmail',
    resource: 'message',
    operation: 'send',
    emailType: 'text'
  },
  aliases: ['email', 'mail', 'google mail'],
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Send automated emails',
      'Reply to incoming messages',
      'Process email attachments',
      'Organize emails with labels',
      'Create email drafts',
      'Search and filter messages'
    ],
    prerequisites: [
      'Gmail API credentials configured',
      'OAuth2 authorization completed',
      'Gmail account with appropriate permissions'
    ],
    rateLimits: {
      requests: 1000000000,
      window: 'daily',
      unit: 'quota units'
    },
    errorHandling: {
      retryableErrors: ['Rate limit exceeded', 'Temporary server error'],
      nonRetryableErrors: ['Invalid credentials', 'Insufficient permissions', 'Message not found'],
      documentation: 'Common errors include quota limits and permission issues'
    }
  },
  examples: [
    {
      name: 'Send Simple Email',
      description: 'Send a plain text email to a recipient',
      workflow: {
        nodes: [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'send',
              sendTo: 'recipient@example.com',
              subject: 'Hello from n8n',
              message: 'This is a test email sent from n8n workflow.',
              emailType: 'text'
            }
          }
        ]
      }
    },
    {
      name: 'Reply to Email',
      description: 'Reply to an incoming email using thread ID',
      workflow: {
        nodes: [
          {
            name: 'Reply Email',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'reply',
              messageId: '={{$json.messageId}}',
              subject: '=Re: {{$json.subject}}',
              message: '={{$json.replyText}}',
              emailType: 'html',
              options: {
                threadId: '={{$json.threadId}}'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Create HTML Draft',
      description: 'Create an HTML email draft for review',
      workflow: {
        nodes: [
          {
            name: 'Create Draft',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'draft',
              operation: 'create',
              sendTo: 'team@company.com',
              subject: 'Weekly Report',
              message: '<h1>Weekly Summary</h1><p>{{$json.reportContent}}</p>',
              emailType: 'html',
              options: {
                ccEmails: 'manager@company.com'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Search and Label Messages',
      description: 'Search for messages and apply labels',
      workflow: {
        nodes: [
          {
            name: 'Find Messages',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'getAll',
              q: 'from:notifications@service.com is:unread',
              limit: 20
            }
          },
          {
            name: 'Add Label',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'addLabel',
              messageId: '={{$json.id}}',
              labelIds: ['IMPORTANT']
            }
          }
        ]
      }
    }
  ]
};