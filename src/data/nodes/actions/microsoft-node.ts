import { NodeTypeInfo } from '../../node-types.js';

export const microsoftNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoft',
  displayName: 'Microsoft',
  description: 'Microsoft serves as the unified authentication hub for all Microsoft services in n8n. Use Microsoft OAuth2 credentials to authenticate with Microsoft Dynamics CRM, Excel, Graph Security, OneDrive, Outlook, SharePoint, Teams, and To Do services.',
  category: 'Productivity',
  subcategory: 'Microsoft Services',
  properties: [
    {
      name: 'service',
      displayName: 'Microsoft Service',
      type: 'options',
      required: true,
      default: 'outlook',
      description: 'Select the Microsoft service to integrate with',
      options: [
        { name: 'Dynamics CRM', value: 'dynamics', description: 'Microsoft Dynamics CRM integration' },
        { name: 'Excel', value: 'excel', description: 'Microsoft Excel spreadsheet operations' },
        { name: 'Graph Security', value: 'graphSecurity', description: 'Microsoft Graph Security API' },
        { name: 'OneDrive', value: 'onedrive', description: 'Microsoft OneDrive file storage' },
        { name: 'Outlook', value: 'outlook', description: 'Microsoft Outlook email and calendar' },
        { name: 'SharePoint', value: 'sharepoint', description: 'Microsoft SharePoint collaboration' },
        { name: 'Teams', value: 'teams', description: 'Microsoft Teams communication' },
        { name: 'To Do', value: 'todo', description: 'Microsoft To Do task management' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Create', value: 'create', description: 'Create a new item' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple items' },
        { name: 'Update', value: 'update', description: 'Update an item' },
        { name: 'Search', value: 'search', description: 'Search for items' }
      ]
    },
    {
      name: 'clientId',
      displayName: 'Client ID',
      type: 'string',
      required: true,
      default: '',
      description: 'The Application (client) ID from your Microsoft Azure app registration'
    },
    {
      name: 'clientSecret',
      displayName: 'Client Secret',
      type: 'string',
      required: true,
      default: '',
      description: 'The client secret generated for your Microsoft Azure application'
    },
    {
      name: 'tenantId',
      displayName: 'Tenant ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional: Directory (tenant) ID for Azure AD authentication'
    },
    {
      name: 'scope',
      displayName: 'Scope',
      type: 'string',
      required: false,
      default: 'https://graph.microsoft.com/.default',
      description: 'Space-separated list of permissions (scopes) for this credential'
    },
    {
      name: 'region',
      displayName: 'Region',
      type: 'options',
      required: false,
      default: 'global',
      description: 'Microsoft data center region',
      options: [
        { name: 'Global', value: 'global', description: 'Global Microsoft cloud' },
        { name: 'US Government', value: 'usgov', description: 'US Government cloud' },
        { name: 'Germany', value: 'germany', description: 'Germany cloud' },
        { name: 'China', value: 'china', description: 'China cloud operated by 21Vianet' }
      ]
    },
    {
      name: 'useSharedInbox',
      displayName: 'Use Shared Inbox',
      type: 'boolean',
      required: false,
      default: false,
      description: 'For Outlook: Access a shared inbox instead of primary inbox'
    },
    {
      name: 'userPrincipalName',
      displayName: 'User Principal Name',
      type: 'string',
      required: false,
      default: '',
      description: 'For shared inbox: Target user UPN or ID'
    },
    {
      name: 'domain',
      displayName: 'Domain',
      type: 'string',
      required: false,
      default: '',
      description: 'For Dynamics: Your Dynamics domain'
    },
    {
      name: 'subdomain',
      displayName: 'Subdomain',
      type: 'string',
      required: false,
      default: '',
      description: 'For SharePoint: The subdomain part of your SharePoint URL'
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
      description: 'The processed Microsoft service data'
    }
  ],
  credentials: ['microsoftOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Microsoft Outlook - Get Emails',
      description: 'Connect to Microsoft Outlook and retrieve emails',
      workflow: {
        nodes: [
          {
            name: 'Microsoft',
            type: 'n8n-nodes-base.microsoft',
            parameters: {
              service: 'outlook',
              operation: 'getAll',
              clientId: '${your_client_id}',
              clientSecret: '${your_client_secret}',
              scope: 'https://graph.microsoft.com/Mail.Read'
            }
          }
        ]
      }
    },
    {
      name: 'Microsoft OneDrive - Upload File',
      description: 'Upload a file to Microsoft OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft',
            type: 'n8n-nodes-base.microsoft',
            parameters: {
              service: 'onedrive',
              operation: 'create',
              clientId: '${your_client_id}',
              clientSecret: '${your_client_secret}',
              scope: 'https://graph.microsoft.com/Files.ReadWrite'
            }
          }
        ]
      }
    },
    {
      name: 'Microsoft Excel - Read Spreadsheet',
      description: 'Read data from a Microsoft Excel spreadsheet',
      workflow: {
        nodes: [
          {
            name: 'Microsoft',
            type: 'n8n-nodes-base.microsoft',
            parameters: {
              service: 'excel',
              operation: 'get',
              clientId: '${your_client_id}',
              clientSecret: '${your_client_secret}',
              scope: 'https://graph.microsoft.com/Files.ReadWrite'
            }
          }
        ]
      }
    },
    {
      name: 'Microsoft Teams - Send Message',
      description: 'Send a message to Microsoft Teams',
      workflow: {
        nodes: [
          {
            name: 'Microsoft',
            type: 'n8n-nodes-base.microsoft',
            parameters: {
              service: 'teams',
              operation: 'create',
              clientId: '${your_client_id}',
              clientSecret: '${your_client_secret}',
              scope: 'https://graph.microsoft.com/Chat.ReadWrite'
            }
          }
        ]
      }
    },
    {
      name: 'Microsoft SharePoint - List Items',
      description: 'List items from a Microsoft SharePoint list',
      workflow: {
        nodes: [
          {
            name: 'Microsoft',
            type: 'n8n-nodes-base.microsoft',
            parameters: {
              service: 'sharepoint',
              operation: 'getAll',
              clientId: '${your_client_id}',
              clientSecret: '${your_client_secret}',
              subdomain: 'tenant123',
              scope: 'https://graph.microsoft.com/Sites.Read.All'
            }
          }
        ]
      }
    },
    {
      name: 'Microsoft To Do - Create Task',
      description: 'Create a new task in Microsoft To Do',
      workflow: {
        nodes: [
          {
            name: 'Microsoft',
            type: 'n8n-nodes-base.microsoft',
            parameters: {
              service: 'todo',
              operation: 'create',
              clientId: '${your_client_id}',
              clientSecret: '${your_client_secret}',
              scope: 'https://graph.microsoft.com/Tasks.ReadWrite'
            }
          }
        ]
      }
    }
  ]
};

export const microsoftTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftTrigger',
  displayName: 'Microsoft Trigger',
  description: 'Triggers workflows when events occur in Microsoft services. Supports webhooks and polling for various Microsoft Graph API endpoints.',
  category: 'Productivity',
  subcategory: 'Microsoft Services',
  properties: [
    {
      name: 'service',
      displayName: 'Microsoft Service',
      type: 'options',
      required: true,
      default: 'outlook',
      description: 'Select the Microsoft service to monitor',
      options: [
        { name: 'Outlook', value: 'outlook', description: 'Monitor Outlook emails and calendar events' },
        { name: 'OneDrive', value: 'onedrive', description: 'Monitor OneDrive file changes' },
        { name: 'SharePoint', value: 'sharepoint', description: 'Monitor SharePoint list and library changes' },
        { name: 'Teams', value: 'teams', description: 'Monitor Teams messages and channel activity' },
        { name: 'To Do', value: 'todo', description: 'Monitor To Do task changes' }
      ]
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'newEmail',
      description: 'The event to trigger on',
      options: [
        { name: 'New Email', value: 'newEmail', description: 'Trigger when new email is received' },
        { name: 'New Calendar Event', value: 'newCalendarEvent', description: 'Trigger when calendar event is created' },
        { name: 'File Changed', value: 'fileChanged', description: 'Trigger when file is modified' },
        { name: 'New File', value: 'newFile', description: 'Trigger when new file is added' },
        { name: 'List Item Added', value: 'listItemAdded', description: 'Trigger when SharePoint list item is added' },
        { name: 'New Message', value: 'newMessage', description: 'Trigger when new Teams message is posted' },
        { name: 'Task Created', value: 'taskCreated', description: 'Trigger when new To Do task is created' }
      ]
    },
    {
      name: 'pollInterval',
      displayName: 'Poll Interval',
      type: 'number',
      required: false,
      default: 60,
      description: 'How often to check for changes (in seconds)'
    },
    {
      name: 'webhookUrl',
      displayName: 'Webhook URL',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional: Webhook URL for real-time notifications'
    },
    {
      name: 'filter',
      displayName: 'Filter',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional: Filter criteria for the events'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Microsoft service events occur'
    }
  ],
  credentials: ['microsoftOAuth2'],
  triggerNode: true,
  polling: true,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Emails',
      description: 'Trigger workflow when new emails are received in Outlook',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Trigger',
            type: 'n8n-nodes-base.microsoftTrigger',
            parameters: {
              service: 'outlook',
              event: 'newEmail',
              pollInterval: 300
            }
          }
        ]
      }
    },
    {
      name: 'Monitor OneDrive Changes',
      description: 'Trigger workflow when files are changed in OneDrive',
      workflow: {
        nodes: [
          {
            name: 'Microsoft Trigger',
            type: 'n8n-nodes-base.microsoftTrigger',
            parameters: {
              service: 'onedrive',
              event: 'fileChanged',
              pollInterval: 120
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const microsoftNodes: NodeTypeInfo[] = [microsoftNode, microsoftTriggerNode];

// Export Microsoft service integrations
export const microsoftServices = [
  'dynamics_crm',
  'excel',
  'graph_security', 
  'onedrive',
  'outlook',
  'sharepoint',
  'teams',
  'todo'
];

// Export available operations
export const microsoftOperations = [
  'create',
  'delete',
  'get',
  'get_many',
  'update',
  'search',
  'authenticate',
  'refresh_token'
];

// Export trigger events
export const microsoftTriggerEvents = [
  'new_email',
  'new_calendar_event',
  'file_changed',
  'new_file',
  'list_item_added',
  'new_message',
  'task_created'
];

// Export OAuth2 scopes for different services
export const microsoftScopes = {
  outlook: [
    'https://graph.microsoft.com/Mail.Read',
    'https://graph.microsoft.com/Mail.ReadWrite',
    'https://graph.microsoft.com/Mail.Send',
    'https://graph.microsoft.com/Calendars.Read',
    'https://graph.microsoft.com/Calendars.ReadWrite'
  ],
  onedrive: [
    'https://graph.microsoft.com/Files.Read',
    'https://graph.microsoft.com/Files.ReadWrite',
    'https://graph.microsoft.com/Files.Read.All'
  ],
  sharepoint: [
    'https://graph.microsoft.com/Sites.Read.All',
    'https://graph.microsoft.com/Sites.ReadWrite.All'
  ],
  teams: [
    'https://graph.microsoft.com/Chat.Read',
    'https://graph.microsoft.com/Chat.ReadWrite',
    'https://graph.microsoft.com/Team.ReadBasic.All'
  ],
  excel: [
    'https://graph.microsoft.com/Files.ReadWrite'
  ],
  todo: [
    'https://graph.microsoft.com/Tasks.Read',
    'https://graph.microsoft.com/Tasks.ReadWrite'
  ],
  dynamics: [
    'https://orgname.crm.dynamics.com/user_impersonation'
  ],
  graphSecurity: [
    'https://graph.microsoft.com/SecurityEvents.Read.All',
    'https://graph.microsoft.com/SecurityEvents.ReadWrite.All'
  ]
};