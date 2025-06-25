/**
 * Zendesk Node - Essential Customer Support Platform
 * 
 * Comprehensive Zendesk API integration for customer service automation,
 * ticket management, and support operations.
 */

import { NodeTypeInfo } from '../node-types.js';

export const zendeskNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zendesk',
  displayName: 'Zendesk',
  description: 'Integrate with Zendesk for customer support automation, ticket management, and user operations',
  category: 'Customer Support',
  subcategory: 'Help Desk',
  
  properties: [
    // Subdomain
    {
      name: 'subdomain',
      displayName: 'Subdomain',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Zendesk subdomain (e.g., "mycompany" for mycompany.zendesk.com)'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'ticket',
      options: [
        { name: 'Ticket', value: 'ticket' },
        { name: 'User', value: 'user' },
        { name: 'Organization', value: 'organization' },
        { name: 'Group', value: 'group' },
        { name: 'Ticket Field', value: 'ticketField' },
        { name: 'Ticket Comment', value: 'ticketComment' },
        { name: 'Brand', value: 'brand' },
        { name: 'Macro', value: 'macro' },
        { name: 'Tag', value: 'tag' }
      ],
      description: 'Choose the Zendesk resource to work with'
    },

    // Ticket operations
    {
      name: 'ticketOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['ticket'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Get Comments', value: 'getComments' },
        { name: 'Add Comment', value: 'addComment' }
      ],
      description: 'Choose the operation to perform on the ticket resource'
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
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Get Related', value: 'getRelated' }
      ],
      description: 'Choose the operation to perform on the user resource'
    },

    // Organization operations
    {
      name: 'organizationOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['organization'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ],
      description: 'Choose the operation to perform on the organization resource'
    },

    // Ticket ID
    {
      name: 'ticketId',
      displayName: 'Ticket ID',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['get', 'update', 'delete', 'getComments', 'addComment']
        }
      },
      description: 'The ID of the ticket'
    },

    // User ID
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['user'],
          userOperation: ['get', 'update', 'delete', 'getRelated']
        }
      },
      description: 'The ID of the user'
    },

    // Ticket creation fields
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      description: 'The subject/title of the ticket'
    },

    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 5
    },
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create']
        }
      },
      description: 'The initial comment/description for the ticket'
    },

    {
      name: 'type',
      displayName: 'Type',
      type: 'options',
      required: false,
      default: 'ticket',
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Ticket', value: 'ticket' },
        { name: 'Incident', value: 'incident' },
        { name: 'Problem', value: 'problem' },
        { name: 'Question', value: 'question' },
        { name: 'Task', value: 'task' }
      ],
      description: 'The type of ticket to create or update'
    },

    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'normal',
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Low', value: 'low' },
        { name: 'Normal', value: 'normal' },
        { name: 'High', value: 'high' },
        { name: 'Urgent', value: 'urgent' }
      ],
      description: 'The priority level of the ticket'
    },

    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'new',
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'New', value: 'new' },
        { name: 'Open', value: 'open' },
        { name: 'Pending', value: 'pending' },
        { name: 'Hold', value: 'hold' },
        { name: 'Solved', value: 'solved' },
        { name: 'Closed', value: 'closed' }
      ],
      description: 'The current status of the ticket'
    },

    // Requester
    {
      name: 'requesterId',
      displayName: 'Requester ID',
      type: 'number',
      required: false,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      description: 'The ID of the user requesting support'
    },

    {
      name: 'requesterEmail',
      displayName: 'Requester Email',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create']
        }
      },
      description: 'Email of the requester (alternative to Requester ID)'
    },

    // Assignee
    {
      name: 'assigneeId',
      displayName: 'Assignee ID',
      type: 'number',
      required: false,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      description: 'The ID of the agent to assign the ticket to'
    },

    // Group
    {
      name: 'groupId',
      displayName: 'Group ID',
      type: 'number',
      required: false,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      description: 'The ID of the group to assign the ticket to'
    },

    // Tags
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['create', 'update']
        }
      },
      description: 'Comma-separated list of tags to add to the ticket'
    },

    // Comment
    {
      name: 'comment',
      displayName: 'Comment',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 4
    },
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['addComment']
        }
      },
      description: 'The comment to add to the ticket'
    },

    {
      name: 'commentPublic',
      displayName: 'Public Comment',
      type: 'boolean',
      required: false,
      default: true,
      displayOptions: {
        show: { 
          resource: ['ticket'],
          ticketOperation: ['addComment']
        }
      },
      description: 'Whether the comment is public (visible to requester)'
    },

    // User creation fields
    {
      name: 'userName',
      displayName: 'Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['user'],
          userOperation: ['create', 'update']
        }
      },
      description: 'The name of the user'
    },

    {
      name: 'userEmail',
      displayName: 'Email',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['user'],
          userOperation: ['create']
        }
      },
      description: 'The email address of the user'
    },

    {
      name: 'userRole',
      displayName: 'Role',
      type: 'options',
      required: false,
      default: 'end-user',
      displayOptions: {
        show: { 
          resource: ['user'],
          userOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'End User', value: 'end-user' },
        { name: 'Agent', value: 'agent' },
        { name: 'Admin', value: 'admin' }
      ],
      description: 'The role of the user in the Zendesk system'
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for API calls and data filtering',
      options: [
        {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
          description: 'Number of results to return'
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
      name: 'sortBy',
      displayName: 'Sort By',
      type: 'string',
      required: false,
      default: 'created_at',
          description: 'Field to sort results by'
    },
        {
      name: 'sortOrder',
      displayName: 'Sort Order',
      type: 'options',
      required: false,
      default: 'desc',
          options: [
            { name: 'Ascending', value: 'asc'
    },
            { name: 'Descending', value: 'desc' }
          ],
          description: 'The order to sort results in'
        },
        {
      name: 'query',
      displayName: 'Search Query',
      type: 'string',
      required: false,
      default: '',
          description: 'Search query to filter results'
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
      description: 'Zendesk API response data'
    }
  ],

  credentials: [
    {
      name: 'zendeskApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Zendesk'
  },

  aliases: ['customer support', 'help desk', 'tickets', 'support'],
  
  examples: [
    {
      name: 'Create Support Ticket',
      description: 'Create a new support ticket in Zendesk',
      workflow: {
        nodes: [
          {
            name: 'Create Ticket',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              subdomain: 'mycompany',
              resource: 'ticket',
              ticketOperation: 'create',
              subject: 'User needs help with login',
              description: 'User is unable to access their account and needs password reset assistance.',
              type: 'question',
              priority: 'normal',
              requesterEmail: 'user@example.com',
              tags: 'login,password,help'
            }
          }
        ]
      }
    },
    {
      name: 'Update Ticket Status',
      description: 'Update the status of an existing ticket',
      workflow: {
        nodes: [
          {
            name: 'Update Ticket',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              subdomain: 'mycompany',
              resource: 'ticket',
              ticketOperation: 'update',
              ticketId: 12345,
              status: 'solved',
              assigneeId: 67890
            }
          }
        ]
      }
    },
    {
      name: 'Get Recent Tickets',
      description: 'Retrieve recent tickets from Zendesk',
      workflow: {
        nodes: [
          {
            name: 'Get Tickets',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              subdomain: 'mycompany',
              resource: 'ticket',
              ticketOperation: 'getAll',
              options: {
                limit: 50,
                sortBy: 'created_at',
                sortOrder: 'desc'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Add Comment to Ticket',
      description: 'Add a comment to an existing ticket',
      workflow: {
        nodes: [
          {
            name: 'Add Comment',
            type: 'n8n-nodes-base.zendesk',
            parameters: {
              subdomain: 'mycompany',
              resource: 'ticket',
              ticketOperation: 'addComment',
              ticketId: 12345,
              comment: 'Thank you for your patience. We have resolved the issue and your account should now be accessible.',
              commentPublic: true
            }
          }
        ]
      }
    }
  ]
};

export const zendeskTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zendeskTrigger',
  displayName: 'Zendesk Trigger',
  description: 'Triggers the workflow when events occur in Zendesk, such as new tickets, status changes, or comments',
  category: 'Customer Support',
  subcategory: 'Help Desk',
  
  properties: [
    {
      name: 'subdomain',
      displayName: 'Subdomain',
      type: 'string',
      required: true,
      default: '',
      description: 'Your Zendesk subdomain (e.g., "mycompany" for mycompany.zendesk.com)'
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'ticket.created',
      description: 'The event to listen for',
      options: [
        { name: 'Ticket Created', value: 'ticket.created' },
        { name: 'Ticket Updated', value: 'ticket.updated' },
        { name: 'Ticket Status Changed', value: 'ticket.status_changed' },
        { name: 'Ticket Comment Added', value: 'ticket.comment_added' },
        { name: 'User Created', value: 'user.created' },
        { name: 'User Updated', value: 'user.updated' },
        { name: 'Organization Created', value: 'organization.created' },
        { name: 'Organization Updated', value: 'organization.updated' }
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
      name: 'priority',
      displayName: 'Priority',
      type: 'multiOptions',
      required: false,
          description: 'Filter events by ticket priority levels',
          options: [
            { name: 'Low', value: 'low'
    },
            { name: 'Normal', value: 'normal' },
            { name: 'High', value: 'high' },
            { name: 'Urgent', value: 'urgent' }
          ]
        },
        {
      name: 'status',
      displayName: 'Status',
      type: 'multiOptions',
      required: false,
      default: [],
          description: 'Filter events by ticket status values',
          options: [
            { name: 'New', value: 'new'
    },
            { name: 'Open', value: 'open' },
            { name: 'Pending', value: 'pending' },
            { name: 'Hold', value: 'hold' },
            { name: 'Solved', value: 'solved' },
            { name: 'Closed', value: 'closed' }
          ]
        },
        {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
          description: 'Comma-separated list of tags to filter by'
    }
      ]
    }
  ],

  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Zendesk events occur'
    }
  ],

  credentials: [
    {
      name: 'zendeskApi',
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
      name: 'Monitor New Tickets',
      description: 'Trigger workflow when new tickets are created',
      workflow: {
        nodes: [
          {
            name: 'Zendesk Trigger',
            type: 'n8n-nodes-base.zendeskTrigger',
            parameters: {
              subdomain: 'mycompany',
              event: 'ticket.created',
              conditions: {
                priority: ['high', 'urgent']
              }
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes
export const zendeskNodes: NodeTypeInfo[] = [zendeskNode, zendeskTriggerNode];

export default zendeskNode;