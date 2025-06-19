import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const microsoftOutlookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftOutlook',
  displayName: 'Microsoft Outlook',
  description: 'Use the Microsoft Outlook node to automate work in Microsoft Outlook, and integrate Microsoft Outlook with other applications. n8n has built-in support for a wide range of Microsoft Outlook features, including creating, updating, deleting, and getting folders, messages, and drafts.',
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
        { name: 'Calendar', value: 'calendar', description: 'Work with calendars' },
        { name: 'Contact', value: 'contact', description: 'Manage contacts' },
        { name: 'Draft', value: 'draft', description: 'Handle email drafts' },
        { name: 'Event', value: 'event', description: 'Manage calendar events' },
        { name: 'Folder', value: 'folder', description: 'Work with email folders' },
        { name: 'Folder Message', value: 'folderMessage', description: 'Get messages from folders' },
        { name: 'Message', value: 'message', description: 'Handle email messages' },
        { name: 'Message Attachment', value: 'messageAttachment', description: 'Manage email attachments' }
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
        { name: 'Update', value: 'update', description: 'Update an item' },
        { name: 'Send', value: 'send', description: 'Send an email message' },
        { name: 'Reply', value: 'reply', description: 'Reply to a message' },
        { name: 'Move', value: 'move', description: 'Move a message' },
        { name: 'Send and Wait for Response', value: 'sendAndWait', description: 'Send message and wait for response' },
        { name: 'Add', value: 'add', description: 'Add an attachment' },
        { name: 'Download', value: 'download', description: 'Download an attachment' }
      ]
    },
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the message to work with'
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the folder to work with'
    },
    {
      name: 'contactId',
      displayName: 'Contact ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the contact to work with'
    },
    {
      name: 'eventId',
      displayName: 'Event ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the event to work with'
    },
    {
      name: 'calendarId',
      displayName: 'Calendar ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the calendar to work with'
    },
    {
      name: 'attachmentId',
      displayName: 'Attachment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the attachment to work with'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'The subject of the email message'
    },
    {
      name: 'bodyContent',
      displayName: 'Body Content',
      type: 'string',
      required: false,
      default: '',
      description: 'The body content of the email message'
    },
    {
      name: 'bodyContentType',
      displayName: 'Body Content Type',
      type: 'options',
      required: false,
      default: 'html',
      description: 'The format of the body content',
      options: [
        { name: 'HTML', value: 'html', description: 'HTML formatted content' },
        { name: 'Text', value: 'text', description: 'Plain text content' }
      ]
    },
    {
      name: 'toRecipients',
      displayName: 'To Recipients',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of recipients (comma-separated)'
    },
    {
      name: 'ccRecipients',
      displayName: 'CC Recipients',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of CC recipients (comma-separated)'
    },
    {
      name: 'bccRecipients',
      displayName: 'BCC Recipients',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of BCC recipients (comma-separated)'
    },
    {
      name: 'importance',
      displayName: 'Importance',
      type: 'options',
      required: false,
      default: 'normal',
      description: 'Importance level of the message',
      options: [
        { name: 'Low', value: 'low', description: 'Low importance' },
        { name: 'Normal', value: 'normal', description: 'Normal importance' },
        { name: 'High', value: 'high', description: 'High importance' }
      ]
    },
    {
      name: 'responseType',
      displayName: 'Response Type',
      type: 'options',
      required: false,
      default: 'approval',
      description: 'Type of response to wait for',
      options: [
        { name: 'Approval', value: 'approval', description: 'Approval/disapproval buttons' },
        { name: 'Free Text', value: 'freeText', description: 'Free text response form' },
        { name: 'Custom Form', value: 'customForm', description: 'Custom form with multiple fields' }
      ]
    },
    {
      name: 'limitWaitTime',
      displayName: 'Limit Wait Time',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to limit the wait time for responses'
    },
    {
      name: 'waitTimeLimit',
      displayName: 'Wait Time Limit',
      type: 'number',
      required: false,
      default: 3600,
      description: 'Maximum time to wait for response in seconds'
    },
    {
      name: 'saveToSentItems',
      displayName: 'Save to Sent Items',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to save the message to sent items'
    },
    {
      name: 'displayName',
      displayName: 'Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Display name for contacts or calendars'
    },
    {
      name: 'emailAddress',
      displayName: 'Email Address',
      type: 'string',
      required: false,
      default: '',
      description: 'Email address for contacts'
    },
    {
      name: 'givenName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      default: '',
      description: 'First name for contacts'
    },
    {
      name: 'surname',
      displayName: 'Last Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Last name for contacts'
    },
    {
      name: 'jobTitle',
      displayName: 'Job Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Job title for contacts'
    },
    {
      name: 'companyName',
      displayName: 'Company Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Company name for contacts'
    },
    {
      name: 'eventSubject',
      displayName: 'Event Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'Subject of the calendar event'
    },
    {
      name: 'eventStart',
      displayName: 'Event Start',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Start date and time of the event'
    },
    {
      name: 'eventEnd',
      displayName: 'Event End',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'End date and time of the event'
    },
    {
      name: 'eventLocation',
      displayName: 'Event Location',
      type: 'string',
      required: false,
      default: '',
      description: 'Location of the event'
    },
    {
      name: 'eventBody',
      displayName: 'Event Body',
      type: 'string',
      required: false,
      default: '',
      description: 'Description of the event'
    },
    {
      name: 'isAllDay',
      displayName: 'All Day Event',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the event is all day'
    },
    {
      name: 'attendees',
      displayName: 'Attendees',
      type: 'string',
      required: false,
      default: '',
      description: 'Email addresses of attendees (comma-separated)'
    },
    {
      name: 'folderName',
      displayName: 'Folder Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the folder'
    },
    {
      name: 'parentFolderId',
      displayName: 'Parent Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the parent folder'
    },
    {
      name: 'destinationFolderId',
      displayName: 'Destination Folder ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the destination folder for move operations'
    },
    {
      name: 'attachmentName',
      displayName: 'Attachment Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the attachment'
    },
    {
      name: 'attachmentContent',
      displayName: 'Attachment Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content of the attachment (base64 encoded)'
    },
    {
      name: 'contentType',
      displayName: 'Content Type',
      type: 'string',
      required: false,
      default: '',
      description: 'MIME type of the attachment'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    },
    {
      name: 'filter',
      displayName: 'Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'OData filter query to apply'
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
      description: 'The processed Microsoft Outlook data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Email',
      description: 'Send an email message using Microsoft Outlook',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'message',
              operation: 'send',
              subject: 'Automated Email from n8n',
              bodyContent: '<p>Hello! This is an automated email sent from n8n workflow.</p>',
              bodyContentType: 'html',
              toRecipients: 'user@example.com',
              importance: 'normal',
              saveToSentItems: true
            }
          }
        ]
      }
    },
    {
      name: 'Create Calendar Event',
      description: 'Create a new calendar event in Microsoft Outlook',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'event',
              operation: 'create',
              eventSubject: 'Team Meeting',
              eventStart: '2024-01-15T09:00:00Z',
              eventEnd: '2024-01-15T10:00:00Z',
              eventLocation: 'Conference Room A',
              eventBody: 'Weekly team sync meeting to discuss project progress',
              attendees: 'team@example.com,manager@example.com',
              isAllDay: false
            }
          }
        ]
      }
    },
    {
      name: 'Create Contact',
      description: 'Create a new contact in Microsoft Outlook',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'contact',
              operation: 'create',
              displayName: 'John Smith',
              givenName: 'John',
              surname: 'Smith',
              emailAddress: 'john.smith@example.com',
              jobTitle: 'Software Engineer',
              companyName: 'Tech Corp'
            }
          }
        ]
      }
    },
    {
      name: 'Send and Wait for Approval',
      description: 'Send an email and wait for approval response',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'message',
              operation: 'sendAndWait',
              subject: 'Budget Approval Request',
              bodyContent: 'Please review and approve the Q1 budget proposal.',
              toRecipients: 'manager@example.com',
              responseType: 'approval',
              limitWaitTime: true,
              waitTimeLimit: 7200
            }
          }
        ]
      }
    },
    {
      name: 'Get Messages from Folder',
      description: 'Retrieve messages from a specific Outlook folder',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'folderMessage',
              operation: 'getAll',
              folderId: 'inbox',
              limit: 20,
              filter: 'isRead eq false'
            }
          }
        ]
      }
    },
    {
      name: 'Add Email Attachment',
      description: 'Add an attachment to an email message',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook',
            type: 'n8n-nodes-base.microsoftOutlook',
            parameters: {
              resource: 'messageAttachment',
              operation: 'add',
              messageId: 'message_id_here',
              attachmentName: 'report.pdf',
              attachmentContent: 'base64_encoded_content',
              contentType: 'application/pdf'
            }
          }
        ]
      }
    }
  ]
};

export const microsoftOutlookTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftOutlookTrigger',
  displayName: 'Microsoft Outlook Trigger',
  description: 'Use the Microsoft Outlook Trigger node to respond to events in Microsoft Outlook and integrate Microsoft Outlook with other applications.',
  category: 'Communication',
  subcategory: 'Email',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'messageReceived',
      description: 'The event to trigger on',
      options: [
        { name: 'Message Received', value: 'messageReceived', description: 'Trigger when a new message is received' }
      ]
    },
    {
      name: 'folderId',
      displayName: 'Folder ID',
      type: 'string',
      required: false,
      default: 'inbox',
      description: 'The ID of the folder to monitor (default: inbox)'
    },
    {
      name: 'senderFilter',
      displayName: 'Sender Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter messages by sender email address'
    },
    {
      name: 'subjectFilter',
      displayName: 'Subject Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter messages by subject line (case insensitive)'
    },
    {
      name: 'bodyFilter',
      displayName: 'Body Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter messages by body content (case insensitive)'
    },
    {
      name: 'hasAttachments',
      displayName: 'Has Attachments',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Only trigger on messages with attachments'
    },
    {
      name: 'importanceFilter',
      displayName: 'Importance Filter',
      type: 'options',
      required: false,
      default: 'any',
      description: 'Filter messages by importance level',
      options: [
        { name: 'Any', value: 'any', description: 'Any importance level' },
        { name: 'Low', value: 'low', description: 'Low importance only' },
        { name: 'Normal', value: 'normal', description: 'Normal importance only' },
        { name: 'High', value: 'high', description: 'High importance only' }
      ]
    },
    {
      name: 'markAsRead',
      displayName: 'Mark as Read',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Mark processed messages as read'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when new messages are received in Microsoft Outlook'
    }
  ],
  credentials: ['microsoftOAuth2'],
  triggerNode: true,
  polling: true,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Inbox',
      description: 'Trigger workflow when new messages are received in inbox',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook Trigger',
            type: 'n8n-nodes-base.microsoftOutlookTrigger',
            parameters: {
              event: 'messageReceived',
              folderId: 'inbox',
              markAsRead: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor High Priority Messages',
      description: 'Trigger workflow only for high priority messages',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook Trigger',
            type: 'n8n-nodes-base.microsoftOutlookTrigger',
            parameters: {
              event: 'messageReceived',
              folderId: 'inbox',
              importanceFilter: 'high',
              markAsRead: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Messages with Attachments',
      description: 'Trigger workflow only for messages containing attachments',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook Trigger',
            type: 'n8n-nodes-base.microsoftOutlookTrigger',
            parameters: {
              event: 'messageReceived',
              folderId: 'inbox',
              hasAttachments: true,
              markAsRead: false
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Specific Sender',
      description: 'Trigger workflow for messages from specific sender',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Outlook Trigger',
            type: 'n8n-nodes-base.microsoftOutlookTrigger',
            parameters: {
              event: 'messageReceived',
              folderId: 'inbox',
              senderFilter: 'important@company.com',
              subjectFilter: 'urgent',
              markAsRead: true
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const microsoftOutlookNodes: NodeTypeInfo[] = [microsoftOutlookNode, microsoftOutlookTriggerNode];

// Export individual actions for the regular Microsoft Outlook node
export const microsoftOutlookActions = [
  'create_calendar',
  'delete_calendar',
  'get_calendar',
  'get_many_calendars',
  'update_calendar',
  'create_contact',
  'delete_contact',
  'get_contact',
  'get_many_contacts',
  'update_contact',
  'create_draft',
  'delete_draft',
  'get_draft',
  'send_draft',
  'update_draft',
  'create_event',
  'delete_event',
  'get_event',
  'get_many_events',
  'update_event',
  'create_folder',
  'delete_folder',
  'get_folder',
  'get_many_folders',
  'update_folder',
  'get_many_folder_messages',
  'delete_message',
  'get_message',
  'get_many_messages',
  'move_message',
  'reply_message',
  'send_message',
  'send_and_wait_for_response',
  'update_message',
  'add_message_attachment',
  'download_message_attachment',
  'get_message_attachment',
  'get_many_message_attachments'
];

// Export trigger events
export const microsoftOutlookTriggers = [
  'message_received'
];