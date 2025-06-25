/**
 * Intercom Node - Essential Customer Messaging Platform
 * 
 * Comprehensive Intercom API integration for customer communication,
 * user management, and support automation.
 */

import { NodeTypeInfo } from '../node-types.js';

export const intercomNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.intercom',
  displayName: 'Intercom',
  description: 'Integrate with Intercom for customer messaging, user management, and support automation',
  category: 'Customer Support',
  subcategory: 'Live Chat',
  
  properties: [
    // Access Token (required for Intercom API)
    {
      name: 'accessToken',
      displayName: 'Access Token',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Intercom Access Token (found in Developer Hub)'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'user',
      options: [
        { name: 'User', value: 'user' },
        { name: 'Contact', value: 'contact' },
        { name: 'Conversation', value: 'conversation' },
        { name: 'Message', value: 'message' },
        { name: 'Event', value: 'event' },
        { name: 'Company', value: 'company' },
        { name: 'Tag', value: 'tag' },
        { name: 'Segment', value: 'segment' },
        { name: 'Note', value: 'note' },
        { name: 'Admin', value: 'admin' }
      ],
      description: 'Choose the Intercom resource to work with'
    },

    // User operations
    {
      name: 'userOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['user'] }
      },
      description: 'Select the operation to perform on users',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Archive', value: 'archive' },
        { name: 'Unarchive', value: 'unarchive' }
      ]
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
      description: 'Select the operation to perform on contacts',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Merge', value: 'merge' }
      ]
    },

    // Conversation operations
    {
      name: 'conversationOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['conversation'] }
      },
      description: 'Select the operation to perform on conversations',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Reply', value: 'reply' },
        { name: 'Assign', value: 'assign' },
        { name: 'Close', value: 'close' },
        { name: 'Open', value: 'open' },
        { name: 'Snooze', value: 'snooze' },
        { name: 'Tag', value: 'tag' },
        { name: 'Untag', value: 'untag' }
      ]
    },

    // Company operations
    {
      name: 'companyOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['company'] }
      },
      description: 'Select the operation to perform on companies',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Get Users', value: 'getUsers' },
        { name: 'Attach Contact', value: 'attachContact' },
        { name: 'Detach Contact', value: 'detachContact' }
      ]
    },

    // Resource IDs
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['user'],
          userOperation: ['get', 'update', 'delete', 'archive', 'unarchive']
        }
      },
      description: 'The Intercom user ID'
    },

    {
      name: 'contactId',
      displayName: 'Contact ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['contact'],
          contactOperation: ['get', 'update', 'delete', 'merge']
        }
      },
      description: 'The Intercom contact ID'
    },

    {
      name: 'conversationId',
      displayName: 'Conversation ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['conversation'],
          conversationOperation: ['get', 'reply', 'assign', 'close', 'open', 'snooze', 'tag', 'untag']
        }
      },
      description: 'The conversation ID'
    },

    {
      name: 'companyId',
      displayName: 'Company ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['company'],
          companyOperation: ['get', 'update', 'getUsers', 'attachContact', 'detachContact']
        }
      },
      description: 'The company ID'
    },

    // User/Contact creation fields
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['user', 'contact'],
          operation: ['create', 'update']
        }
      },
      description: 'Email address of the user/contact'
    },

    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['user', 'contact'],
          operation: ['create', 'update']
        }
      },
      description: 'Name of the user/contact'
    },

    {
      name: 'phone',
      displayName: 'Phone',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['user', 'contact'],
          operation: ['create', 'update']
        }
      },
      description: 'Phone number'
    },

    {
      name: 'externalId',
      displayName: 'External ID',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['user', 'contact'],
          operation: ['create', 'update']
        }
      },
      description: 'External ID to identify user in your system'
    },

    // Custom attributes
    {
      name: 'customAttributes',

      displayName: 'Custom Attributes',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['user', 'contact'],
          operation: ['create', 'update']
        }
      },
      description: 'Add custom attributes to the user or contact',
      options: [
        {
          name: 'attribute',
          displayName: 'Attribute',
          values: [
            {
      name: 'key',

      displayName: 'Key',
      type: 'string',
      required: false,
      default: '',
              description: 'The attribute name'
    },
            {
      name: 'value',

      displayName: 'Value',
      type: 'string',
      required: false,
      default: '',
              description: 'The attribute value'
    }
          ]
        }
      ]
    },

    // Company fields
    {
      name: 'companyName',
      displayName: 'Company Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['company'],
          companyOperation: ['create', 'update']
        }
      },
      description: 'Name of the company'
    },

    {
      name: 'companyExternalId',
      displayName: 'Company External ID',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['company'],
          companyOperation: ['create', 'update']
        }
      },
      description: 'External ID for the company'
    },

    {
      name: 'website',
      displayName: 'Website',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['company'],
          companyOperation: ['create', 'update']
        }
      },
      description: 'Company website URL'
    },

    // Message/Reply fields
    {
      name: 'messageBody',

      displayName: 'Message',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 4
    },
      displayOptions: {
        show: { 
          resource: ['conversation'],
          conversationOperation: ['reply']
        }
      },
      description: 'The message content'
    },

    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: true,
      default: 'comment',
      displayOptions: {
        show: { 
          resource: ['conversation'],
          conversationOperation: ['reply']
        }
      },
      description: 'Type of message to send (comment is visible to user, note is internal)',
      options: [
        { name: 'Comment', value: 'comment' },
        { name: 'Note', value: 'note' }
      ]
    },

    // Assignment
    {
      name: 'assigneeId',
      displayName: 'Assignee ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['conversation'],
          conversationOperation: ['assign']
        }
      },
      description: 'ID of the admin to assign the conversation to'
    },

    // Tags
    {
      name: 'tagId',
      displayName: 'Tag ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['conversation'],
          conversationOperation: ['tag', 'untag']
        }
      },
      description: 'The tag ID to apply or remove'
    },

    // Event tracking
    {
      name: 'eventName',
      displayName: 'Event Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['event']
        }
      },
      description: 'Name of the event to track'
    },

    {
      name: 'eventMetadata',

      displayName: 'Event Metadata',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['event']
        }
      },
      description: 'Additional metadata to attach to the event',
      options: [
        {
          name: 'metadata',
          displayName: 'Metadata',
          values: [
            {
      name: 'key',

      displayName: 'Key',
      type: 'string',
      required: false,
      default: '',
              description: 'The metadata key'
    },
            {
      name: 'value',

      displayName: 'Value',
      type: 'string',
      required: false,
      default: '',
              description: 'The metadata value'
    }
          ]
        }
      ]
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure additional options for the operation',
      options: [
        {
      name: 'perPage',

      displayName: 'Per Page',
      type: 'number',
      required: false,
          description: 'Number of results per page'
    },
        {
      name: 'page',

      displayName: 'Page',
      type: 'number',
      required: false,
      default: 1,
          description: 'Page number for pagination'
    },
        {
      name: 'order',

      displayName: 'Order',
      type: 'options',
      required: false,
      default: 'desc',
          options: [
            { name: 'Ascending', value: 'asc' },
            { name: 'Descending', value: 'desc' }
          ]
        },
        {
      name: 'sort',

      displayName: 'Sort By',
      type: 'options',
      required: false,
      default: 'created_at',
          options: [
            { name: 'Created At', value: 'created_at' },
            { name: 'Updated At', value: 'updated_at' },
            { name: 'Name', value: 'name' },
            { name: 'Email', value: 'email' }
          ]
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
      description: 'Intercom API response data'
    }
  ],

  credentials: [
    {
      name: 'intercomApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Intercom'
  },

  aliases: ['customer messaging', 'live chat', 'support', 'communication'],
  
  examples: [
    {
      name: 'Create User',
      description: 'Create a new user in Intercom',
      workflow: {
        nodes: [
          {
            name: 'Create User',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'user',
              userOperation: 'create',
              email: 'user@example.com',
              name: 'John Doe',
              externalId: 'user_123',
              customAttributes: {
                attribute: [
                  {
                    key: 'plan',
                    value: 'premium'
                  },
                  {
                    key: 'signup_date',
                    value: '2024-01-15'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Reply to Conversation',
      description: 'Send a reply to an existing conversation',
      workflow: {
        nodes: [
          {
            name: 'Reply to Conversation',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'conversation',
              conversationOperation: 'reply',
              conversationId: '12345',
              messageBody: 'Thank you for contacting us. We will look into this issue and get back to you soon.',
              messageType: 'comment'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Conversations',
      description: 'Retrieve all conversations from Intercom',
      workflow: {
        nodes: [
          {
            name: 'Get Conversations',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'conversation',
              conversationOperation: 'getAll',
              options: {
                perPage: 25,
                sort: 'updated_at',
                order: 'desc'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Track User Event',
      description: 'Track a custom event for user analytics',
      workflow: {
        nodes: [
          {
            name: 'Track Event',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'event',
              eventName: 'completed_purchase',
              email: 'user@example.com',
              eventMetadata: {
                metadata: [
                  {
                    key: 'order_id',
                    value: 'ORD-12345'
                  },
                  {
                    key: 'amount',
                    value: '99.99'
                  },
                  {
                    key: 'currency',
                    value: 'USD'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Create Company and Attach User',
      description: 'Create a company and associate a user with it',
      workflow: {
        nodes: [
          {
            name: 'Create Company',
            type: 'n8n-nodes-base.intercom',
            parameters: {
              resource: 'company',
              companyOperation: 'create',
              companyName: 'Acme Corporation',
              companyExternalId: 'company_123',
              website: 'https://acme.com',
              customAttributes: {
                attribute: [
                  {
                    key: 'industry',
                    value: 'Technology'
                  },
                  {
                    key: 'size',
                    value: '100-500'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
};

export const intercomTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.intercomTrigger',
  displayName: 'Intercom Trigger',
  description: 'Triggers the workflow when events occur in Intercom, such as new conversations, user actions, or admin replies',
  category: 'Customer Support',
  subcategory: 'Live Chat',
  
  properties: [
    {
      name: 'accessToken',
      displayName: 'Access Token',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Intercom Access Token (found in Developer Hub)'
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'conversation.created',
      description: 'The event to listen for',
      options: [
        { name: 'Conversation Created', value: 'conversation.created' },
        { name: 'Conversation Updated', value: 'conversation.updated' },
        { name: 'Conversation Closed', value: 'conversation.closed' },
        { name: 'Conversation Opened', value: 'conversation.opened' },
        { name: 'User Created', value: 'user.created' },
        { name: 'User Updated', value: 'user.updated' },
        { name: 'User Deleted', value: 'user.deleted' },
        { name: 'Contact Created', value: 'contact.created' },
        { name: 'Contact Updated', value: 'contact.updated' },
        { name: 'Contact Deleted', value: 'contact.deleted' },
        { name: 'Company Created', value: 'company.created' },
        { name: 'Company Updated', value: 'company.updated' },
        { name: 'Admin Reply', value: 'conversation.admin.replied' },
        { name: 'User Reply', value: 'conversation.user.replied' }
      ]
    },
    {
      name: 'conditions',
      displayName: 'Conditions',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional conditions to filter events',
      options: [
        {
      name: 'assignedTo',

      displayName: 'Assigned To Admin ID',
      type: 'string',
      required: false,
          description: 'Filter by conversations assigned to specific admin'
    },
        {
      name: 'tagId',

      displayName: 'Tag ID',
      type: 'string',
      required: false,
      default: '',
          description: 'Filter by conversations with specific tag'
    },
        {
      name: 'unread',

      displayName: 'Unread Only',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Only trigger for unread conversations'
    }
      ]
    }
  ],

  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Intercom events occur'
    }
  ],

  credentials: [
    {
      name: 'intercomApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: true,
  webhookSupport: true,
  
  examples: [
    {
      name: 'Monitor New Conversations',
      description: 'Trigger workflow when new conversations are created',
      workflow: {
        nodes: [
          {
            name: 'Intercom Trigger',
            type: 'n8n-nodes-base.intercomTrigger',
            parameters: {
              event: 'conversation.created',
              conditions: {
                unread: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Monitor User Replies',
      description: 'Trigger when users reply to conversations',
      workflow: {
        nodes: [
          {
            name: 'Intercom Trigger',
            type: 'n8n-nodes-base.intercomTrigger',
            parameters: {
              event: 'conversation.user.replied'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes
export const intercomNodes: NodeTypeInfo[] = [intercomNode, intercomTriggerNode];

export default intercomNode;