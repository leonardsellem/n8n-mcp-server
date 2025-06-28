import { NodeTypeInfo } from '../../node-types.js';

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
      options: [
        { name: 'Create', value: 'create', description: 'Create a new item' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple items' },
        { name: 'Send', value: 'send', description: 'Send a message' },
        { name: 'Reply', value: 'reply', description: 'Reply to a message' },
        { name: 'Add Label', value: 'addLabel', description: 'Add label to message/thread' },
        { name: 'Remove Label', value: 'removeLabel', description: 'Remove label from message/thread' },
        { name: 'Mark as Read', value: 'markAsRead', description: 'Mark message as read' },
        { name: 'Mark as Unread', value: 'markAsUnread', description: 'Mark message as unread' },
        { name: 'Trash', value: 'trash', description: 'Move thread to trash' },
        { name: 'Untrash', value: 'untrash', description: 'Remove thread from trash' }
      ]
    },
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the message to operate on'
    },
    {
      name: 'threadId',
      displayName: 'Thread ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the thread to operate on'
    },
    {
      name: 'labelId',
      displayName: 'Label ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the label to work with'
    },
    {
      name: 'to',
      displayName: 'To',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of the recipients. Multiple can be separated by comma.'
    },
    {
      name: 'cc',
      displayName: 'CC',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of recipients who will receive a copy. Multiple can be separated by comma.'
    },
    {
      name: 'bcc',
      displayName: 'BCC',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of recipients who will receive a blind copy. Multiple can be separated by comma.'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'Subject of the email'
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'Plain text message body'
    },
    {
      name: 'htmlMessage',
      displayName: 'HTML Message',
      type: 'string',
      required: false,
      default: '',
      description: 'HTML message body'
    },
    {
      name: 'attachments',
      displayName: 'Attachments',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the binary properties that contain data to add as attachment'
    },
    {
      name: 'includeSpamTrash',
      displayName: 'Include Spam and Trash',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include messages from SPAM and TRASH in the results'
    },
    {
      name: 'format',
      displayName: 'Format',
      type: 'options',
      required: false,
      default: 'full',
      description: 'The format to return the message in',
      options: [
        { name: 'Full', value: 'full', description: 'Returns the full email message data' },
        { name: 'Metadata', value: 'metadata', description: 'Returns only email message ID, labels, and email headers' },
        { name: 'Minimal', value: 'minimal', description: 'Returns only email message ID and labels' },
        { name: 'Raw', value: 'raw', description: 'Returns the full email message data in raw format' }
      ]
    },
    {
      name: 'query',
      displayName: 'Search',
      type: 'string',
      required: false,
      default: '',
      description: 'Only return messages matching the specified query. Same query format as Gmail search box'
    },
    {
      name: 'readStatus',
      displayName: 'Read Status',
      type: 'options',
      required: false,
      default: 'unreadOnly',
      description: 'Filter messages by read status',
      options: [
        { name: 'Unread and read emails', value: 'both', description: 'Return both read and unread emails' },
        { name: 'Unread emails only', value: 'unreadOnly', description: 'Return only unread emails' },
        { name: 'Read emails only', value: 'readOnly', description: 'Return only read emails' }
      ]
    },
    {
      name: 'sender',
      displayName: 'Sender',
      type: 'string',
      required: false,
      default: '',
      description: 'Return only messages from this sender'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
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
      description: 'The processed Gmail data'
    }
  ],
  credentials: ['gmailOAuth2', 'googleApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Email',
      description: 'Send a simple email message',
      workflow: {
        nodes: [
          {
            name: 'Gmail',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'send',
              to: 'recipient@example.com',
              subject: 'Hello from n8n',
              message: 'This is a test message sent from n8n workflow'
            }
          }
        ]
      }
    },
    {
      name: 'Get Unread Messages',
      description: 'Retrieve unread messages from Gmail',
      workflow: {
        nodes: [
          {
            name: 'Gmail',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'getAll',
              readStatus: 'unreadOnly',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Reply to Message',
      description: 'Reply to a specific message',
      workflow: {
        nodes: [
          {
            name: 'Gmail',
            type: 'n8n-nodes-base.gmail',
            parameters: {
              resource: 'message',
              operation: 'reply',
              messageId: '{{$json["messageId"]}}',
              message: 'Thank you for your message!'
            }
          }
        ]
      }
    }
  ]
};

export const gmailTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.gmailTrigger',
  displayName: 'Gmail Trigger',
  description: 'Triggers the workflow when a new email is received in Gmail. Supports filtering by labels, sender, and other criteria.',
  category: 'Communication',
  subcategory: 'Email',
  properties: [
    {
      name: 'pollTimes',
      displayName: 'Poll Times',
      type: 'fixedCollection',
      required: true,
      default: { mode: 'everyMinute' },
      description: 'How often to check for new messages'
    },
    {
      name: 'simple',
      displayName: 'Simplify',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to return a simplified version of the response or the raw data'
    },
    {
      name: 'includeSpamTrash',
      displayName: 'Include Spam and Trash',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to trigger on messages in Spam and Trash folders'
    },
    {
      name: 'labelIds',
      displayName: 'Label Names or IDs',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'Only trigger on messages with these labels'
    },
    {
      name: 'q',
      displayName: 'Search',
      type: 'string',
      required: false,
      default: '',
      description: 'Gmail search query to filter messages. Same format as Gmail search box'
    },
    {
      name: 'readStatus',
      displayName: 'Read Status',
      type: 'options',
      required: false,
      default: 'unreadOnly',
      description: 'Filter messages by read status',
      options: [
        { name: 'Unread and read emails', value: 'both', description: 'Trigger on both read and unread emails' },
        { name: 'Unread emails only', value: 'unreadOnly', description: 'Trigger only on unread emails' },
        { name: 'Read emails only', value: 'readOnly', description: 'Trigger only on read emails' }
      ]
    },
    {
      name: 'sender',
      displayName: 'Sender',
      type: 'string',
      required: false,
      default: '',
      description: 'Only trigger on messages from this sender'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when new messages are received'
    }
  ],
  credentials: ['gmailOAuth2', 'googleApi'],
  triggerNode: true,
  polling: true,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor New Emails',
      description: 'Trigger workflow when new unread emails arrive',
      workflow: {
        nodes: [
          {
            name: 'Gmail Trigger',
            type: 'n8n-nodes-base.gmailTrigger',
            parameters: {
              simple: true,
              readStatus: 'unreadOnly',
              includeSpamTrash: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Specific Sender',
      description: 'Trigger only when emails from a specific sender arrive',
      workflow: {
        nodes: [
          {
            name: 'Gmail Trigger',
            type: 'n8n-nodes-base.gmailTrigger',
            parameters: {
              simple: true,
              sender: 'important@company.com',
              readStatus: 'unreadOnly'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const gmailNodes: NodeTypeInfo[] = [gmailNode, gmailTriggerNode];

// Export individual actions for the regular Gmail node
export const gmailActions = [
  'create_draft',
  'delete_draft', 
  'get_draft',
  'get_many_drafts',
  'create_label',
  'delete_label',
  'get_label', 
  'get_many_labels',
  'add_label_to_message',
  'delete_message',
  'get_message',
  'get_many_messages',
  'mark_message_as_read',
  'mark_message_as_unread',
  'remove_label_from_message',
  'reply_to_message',
  'send_message',
  'add_label_to_thread',
  'delete_thread',
  'get_thread',
  'get_many_threads',
  'remove_label_from_thread',
  'reply_to_thread',
  'trash_thread',
  'untrash_thread'
];

// Export trigger events
export const gmailTriggers = [
  'message_received'
];