/**
 * ConvertKit Node - Essential Email Marketing Platform
 * 
 * Comprehensive ConvertKit API integration for email marketing automation,
 * subscriber management, and campaign operations.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const convertkitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.convertkit',
  displayName: 'ConvertKit',
  description: 'Integrate with ConvertKit for email marketing automation, subscriber management, and form operations',
  category: 'Marketing',
  subcategory: 'Email Marketing',
  
  properties: [
    // API Key (required for ConvertKit API)
    {
      name: 'apiKey',
      displayName: 'API Key',
      type: 'string',
      required: true,
      default: '',
      description: 'Your ConvertKit API Key (found in Account Settings)'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'subscriber',
      options: [
        { name: 'Subscriber', value: 'subscriber' },
        { name: 'Tag', value: 'tag' },
        { name: 'Sequence', value: 'sequence' },
        { name: 'Form', value: 'form' },
        { name: 'Broadcast', value: 'broadcast' },
        { name: 'Custom Field', value: 'customField' },
        { name: 'Purchase', value: 'purchase' },
        { name: 'Account', value: 'account' }
      ],
      description: 'Choose the ConvertKit resource to work with'
    },

    // Subscriber operations
    {
      name: 'subscriberOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['subscriber'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Unsubscribe', value: 'unsubscribe' },
        { name: 'Add Tag', value: 'addTag' },
        { name: 'Remove Tag', value: 'removeTag' },
        { name: 'Add to Sequence', value: 'addToSequence' },
        { name: 'Remove from Sequence', value: 'removeFromSequence' }
      ],
      description: 'Choose the operation to perform on subscribers'
    },

    // Tag operations
    {
      name: 'tagOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['tag'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Get Subscribers', value: 'getSubscribers' }
      ],
      description: 'Choose the operation to perform on tags'
    },

    // Sequence operations
    {
      name: 'sequenceOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['sequence'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Get Subscribers', value: 'getSubscribers' }
      ],
      description: 'Choose the operation to perform on sequences'
    },

    // Form operations
    {
      name: 'formOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['form'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Get Subscribers', value: 'getSubscribers' },
        { name: 'Add Subscriber', value: 'addSubscriber' }
      ],
      description: 'Choose the operation to perform on forms'
    },

    // Broadcast operations
    {
      name: 'broadcastOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['broadcast'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Get Stats', value: 'getStats' }
      ],
      description: 'Choose the operation to perform on broadcasts'
    },

    // Resource IDs
    {
      name: 'subscriberId',
      displayName: 'Subscriber ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['subscriber'],
          subscriberOperation: ['get', 'update', 'unsubscribe', 'addTag', 'removeTag', 'addToSequence', 'removeFromSequence']
        }
      },
      description: 'The ConvertKit subscriber ID'
    },

    {
      name: 'tagId',
      displayName: 'Tag ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['tag', 'subscriber'],
          operation: ['get', 'getSubscribers', 'addTag', 'removeTag']
        }
      },
      description: 'The ConvertKit tag ID'
    },

    {
      name: 'sequenceId',
      displayName: 'Sequence ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['sequence', 'subscriber'],
          operation: ['get', 'getSubscribers', 'addToSequence', 'removeFromSequence']
        }
      },
      description: 'The ConvertKit sequence ID'
    },

    {
      name: 'formId',
      displayName: 'Form ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['form'],
          formOperation: ['get', 'getSubscribers', 'addSubscriber']
        }
      },
      description: 'The ConvertKit form ID'
    },

    {
      name: 'broadcastId',
      displayName: 'Broadcast ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['broadcast'],
          broadcastOperation: ['get', 'getStats']
        }
      },
      description: 'The ConvertKit broadcast ID'
    },

    // Subscriber creation/update fields
    {
      name: 'subscriberEmail',
      displayName: 'Email',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['subscriber', 'form'],
          operation: ['create', 'update', 'addSubscriber']
        }
      },
      description: 'Subscriber email address'
    },

    {
      name: 'subscriberFirstName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['subscriber', 'form'],
          operation: ['create', 'update', 'addSubscriber']
        }
      },
      description: 'Subscriber first name'
    },

    {
      name: 'subscriberLastName',
      displayName: 'Last Name',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['subscriber', 'form'],
          operation: ['create', 'update', 'addSubscriber']
        }
      },
      description: 'Subscriber last name'
    },

    {
      name: 'subscriberState',
      displayName: 'State',
      type: 'options',
      required: false,
      default: 'active',
      displayOptions: {
        show: { 
          resource: ['subscriber'],
          subscriberOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Active', value: 'active' },
        { name: 'Cancelled', value: 'cancelled' }
      ],
      description: 'The subscription state of the subscriber'
    },

    // Custom fields
    {
      name: 'customFields',
      displayName: 'Custom Fields',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
      },
      default: {},
      displayOptions: {
        show: { 
          resource: ['subscriber', 'form'],
          operation: ['create', 'update', 'addSubscriber']
        }
      },
      options: [
        {
          name: 'field',
          displayName: 'Field',
          values: [
            {
      name: 'key',
      displayName: 'Field Key',
      type: 'string',
      required: false,
      default: '',
              description: 'The custom field key'
    },
            {
      name: 'value',
      displayName: 'Field Value',
      type: 'string',
      required: false,
      default: '',
              description: 'The custom field value'
    }
          ]
        }
      ],
      description: 'Custom fields to set for the subscriber'
    },

    // Tag creation fields
    {
      name: 'tagName',
      displayName: 'Tag Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['tag'],
          tagOperation: ['create']
        }
      },
      description: 'The name of the tag'
    },

    // Broadcast creation fields
    {
      name: 'broadcastSubject',
      displayName: 'Subject',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['broadcast'],
          broadcastOperation: ['create']
        }
      },
      description: 'The broadcast email subject'
    },

    {
      name: 'broadcastContent',
      displayName: 'Content',
      type: 'string',
      required: true,
      typeOptions: {
        rows: 6
    },
      displayOptions: {
        show: { 
          resource: ['broadcast'],
          broadcastOperation: ['create']
        }
      },
      description: 'The broadcast email content (HTML)'
    },

    {
      name: 'broadcastDescription',
      displayName: 'Description',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['broadcast'],
          broadcastOperation: ['create']
        }
      },
      description: 'Internal description for the broadcast'
    },

    {
      name: 'broadcastPublic',
      displayName: 'Public',
      type: 'boolean',
      required: false,
      default: true,
      displayOptions: {
        show: { 
          resource: ['broadcast'],
          broadcastOperation: ['create']
        }
      },
      description: 'Whether the broadcast should be public'
    },

    {
      name: 'broadcastSendAt',
      displayName: 'Send At',
      type: 'dateTime',
      required: false,
      displayOptions: {
        show: { 
          resource: ['broadcast'],
          broadcastOperation: ['create']
        }
      },
      description: 'When to send the broadcast (leave empty to send immediately)'
    },

    // Purchase fields
    {
      name: 'purchaseEmail',
      displayName: 'Email',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Customer email address'
    },

    {
      name: 'purchaseFirstName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Customer first name'
    },

    {
      name: 'purchaseTransactionId',
      displayName: 'Transaction ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Unique transaction identifier'
    },

    {
      name: 'purchaseProductId',
      displayName: 'Product ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Product identifier'
    },

    {
      name: 'purchaseProductName',
      displayName: 'Product Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Name of the product purchased'
    },

    {
      name: 'purchaseValue',
      displayName: 'Purchase Value',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Value of the purchase in cents'
    },

    {
      name: 'purchaseCurrency',
      displayName: 'Currency',
      type: 'string',
      required: false,
      default: 'USD',
      displayOptions: {
        show: { 
          resource: ['purchase']
        }
      },
      description: 'Currency code (e.g., USD, EUR, GBP)'
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},options: [
        {
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
          description: 'Page number for pagination'
    },
        {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
          description: 'Number of results per page (max 50)'
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
          description: 'Sort order for results'
        },
        {
      name: 'createdAfter',
      displayName: 'Created After',
      type: 'dateTime',
      required: false,
      default: '',
          description: 'Filter by creation date'
    },
        {
      name: 'createdBefore',
      displayName: 'Created Before',
      type: 'dateTime',
      required: false,
      default: '',
          description: 'Filter by creation date'
    },
        {
      name: 'updatedAfter',
      displayName: 'Updated After',
      type: 'dateTime',
      required: false,
      default: '',
          description: 'Filter by update date'
    },
        {
      name: 'updatedBefore',
      displayName: 'Updated Before',
      type: 'dateTime',
      required: false,
      default: '',
          description: 'Filter by update date'
    }
      ],
      description: 'Additional options for the API request'
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
      description: 'ConvertKit API response data'
    }
  ],

  credentials: [
    {
      name: 'convertkitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  version: [1],
  defaults: {
    name: 'ConvertKit'
  },

  aliases: ['email marketing', 'email automation', 'newsletter', 'subscribers'],
  
  examples: [
    {
      name: 'Add Subscriber',
      description: 'Add a new subscriber to ConvertKit',
      workflow: {
        nodes: [
          {
            name: 'Add Subscriber',
            type: 'n8n-nodes-base.convertkit',
            parameters: {
              resource: 'subscriber',
              subscriberOperation: 'create',
              subscriberEmail: 'user@example.com',
              subscriberFirstName: 'John',
              subscriberLastName: 'Doe',
              subscriberState: 'active',
              customFields: {
                field: [
                  {
                    key: 'company',
                    value: 'Acme Corporation'
                  },
                  {
                    key: 'industry',
                    value: 'Technology'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Add Subscriber to Form',
      description: 'Subscribe someone to a specific form',
      workflow: {
        nodes: [
          {
            name: 'Subscribe to Form',
            type: 'n8n-nodes-base.convertkit',
            parameters: {
              resource: 'form',
              formOperation: 'addSubscriber',
              formId: '123456',
              subscriberEmail: 'user@example.com',
              subscriberFirstName: 'Jane',
              customFields: {
                field: [
                  {
                    key: 'source',
                    value: 'n8n automation'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Tag Subscriber',
      description: 'Add a tag to an existing subscriber',
      workflow: {
        nodes: [
          {
            name: 'Tag Subscriber',
            type: 'n8n-nodes-base.convertkit',
            parameters: {
              resource: 'subscriber',
              subscriberOperation: 'addTag',
              subscriberId: '12345',
              tagId: '67890'
            }
          }
        ]
      }
    },
    {
      name: 'Create Broadcast',
      description: 'Create and send a broadcast email',
      workflow: {
        nodes: [
          {
            name: 'Create Broadcast',
            type: 'n8n-nodes-base.convertkit',
            parameters: {
              resource: 'broadcast',
              broadcastOperation: 'create',
              broadcastSubject: 'Weekly Newsletter - New Features Released',
              broadcastContent: '<h1>New Features This Week</h1><p>Check out our latest updates and improvements...</p>',
              broadcastDescription: 'Weekly newsletter for March 2024',
              broadcastPublic: true
            }
          }
        ]
      }
    },
    {
      name: 'Track Purchase',
      description: 'Track a purchase for subscriber segmentation',
      workflow: {
        nodes: [
          {
            name: 'Track Purchase',
            type: 'n8n-nodes-base.convertkit',
            parameters: {
              resource: 'purchase',
              purchaseEmail: 'customer@example.com',
              purchaseFirstName: 'John',
              purchaseTransactionId: 'TXN-12345',
              purchaseProductId: 'PROD-789',
              purchaseProductName: 'Premium Course',
              purchaseValue: 9900,
              purchaseCurrency: 'USD'
            }
          }
        ]
      }
    },
    {
      name: 'Get Tagged Subscribers',
      description: 'Retrieve all subscribers with a specific tag',
      workflow: {
        nodes: [
          {
            name: 'Get Tagged Subscribers',
            type: 'n8n-nodes-base.convertkit',
            parameters: {
              resource: 'tag',
              tagOperation: 'getSubscribers',
              tagId: '67890',
              options: {
                page: 1,
                limit: 50,
                sortOrder: 'desc'
              }
            }
          }
        ]
      }
    }
  ]
};

export const convertkitTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.convertkitTrigger',
  displayName: 'ConvertKit Trigger',
  description: 'Triggers the workflow when events occur in ConvertKit, such as new subscribers, form submissions, or tag additions',
  category: 'Marketing',
  subcategory: 'Email Marketing',
  
  properties: [
    {
      name: 'apiKey',
      displayName: 'API Key',
      type: 'string',
      required: true,
      default: '',
      description: 'Your ConvertKit API Key (found in Account Settings)'
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'subscriber.created',
      description: 'The event to listen for',
      options: [
        { name: 'Subscriber Created', value: 'subscriber.created' },
        { name: 'Subscriber Updated', value: 'subscriber.updated' },
        { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed' },
        { name: 'Form Submission', value: 'form.submission' },
        { name: 'Tag Added', value: 'tag.added' },
        { name: 'Tag Removed', value: 'tag.removed' },
        { name: 'Sequence Added', value: 'sequence.added' },
        { name: 'Sequence Completed', value: 'sequence.completed' },
        { name: 'Purchase Created', value: 'purchase.created' }
      ]
    },
    {
      name: 'formId',
      displayName: 'Form ID',
      type: 'string',
      required: false,
      default: '',
      displayOptions: {
        show: { 
          event: ['form.submission']
        }
      },
      description: 'Filter by specific form ID'
    },
    {
      name: 'tagId',
      displayName: 'Tag ID',
      type: 'string',
      required: false,
      default: '',
      displayOptions: {
        show: { 
          event: ['tag.added', 'tag.removed']
        }
      },
      description: 'Filter by specific tag ID'
    },
    {
      name: 'sequenceId',
      displayName: 'Sequence ID',
      type: 'string',
      required: false,
      default: '',
      displayOptions: {
        show: { 
          event: ['sequence.added', 'sequence.completed']
        }
      },
      description: 'Filter by specific sequence ID'
    }
  ],

  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when ConvertKit events occur'
    }
  ],

  credentials: [
    {
      name: 'convertkitApi',
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
      name: 'Monitor New Subscribers',
      description: 'Trigger workflow when new subscribers join',
      workflow: {
        nodes: [
          {
            name: 'ConvertKit Trigger',
            type: 'n8n-nodes-base.convertkitTrigger',
            parameters: {
              event: 'subscriber.created'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Form Submissions',
      description: 'Trigger when specific form is submitted',
      workflow: {
        nodes: [
          {
            name: 'ConvertKit Trigger',
            type: 'n8n-nodes-base.convertkitTrigger',
            parameters: {
              event: 'form.submission',
              formId: '123456'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes
export const convertkitNodes: NodeTypeInfo[] = [convertkitNode, convertkitTriggerNode];

export default convertkitNode;