import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const pipedriveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pipedrive',
  displayName: 'Pipedrive',
  description: 'Use the Pipedrive node to automate work in Pipedrive, and integrate Pipedrive with other applications. n8n has built-in support for a wide range of Pipedrive features, including creating, updating, deleting, and getting activity, files, notes, organizations, and leads.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'deal',
      description: 'The resource to operate on',
      options: [
        { name: 'Activity', value: 'activity', description: 'Work with activities and tasks' },
        { name: 'Deal', value: 'deal', description: 'Manage deals and opportunities' },
        { name: 'Deal Activity', value: 'dealActivity', description: 'Handle activities related to deals' },
        { name: 'Deal Product', value: 'dealProduct', description: 'Manage products in deals' },
        { name: 'File', value: 'file', description: 'Work with files and attachments' },
        { name: 'Lead', value: 'lead', description: 'Manage leads and prospects' },
        { name: 'Note', value: 'note', description: 'Handle notes and comments' },
        { name: 'Organization', value: 'organization', description: 'Work with organizations and companies' },
        { name: 'Person', value: 'person', description: 'Manage people and contacts' },
        { name: 'Product', value: 'product', description: 'Work with products and services' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        // Activity operations
        { name: 'Create', value: 'create', description: 'Create an activity' },
        { name: 'Delete', value: 'delete', description: 'Delete an activity' },
        { name: 'Get', value: 'get', description: 'Get data of an activity' },
        { name: 'Get All', value: 'getAll', description: 'Get data of all activities' },
        { name: 'Update', value: 'update', description: 'Update an activity' },
        // Deal operations
        { name: 'Create', value: 'create', description: 'Create a deal' },
        { name: 'Delete', value: 'delete', description: 'Delete a deal' },
        { name: 'Duplicate', value: 'duplicate', description: 'Duplicate a deal' },
        { name: 'Get', value: 'get', description: 'Get data of a deal' },
        { name: 'Get All', value: 'getAll', description: 'Get data of all deals' },
        { name: 'Search', value: 'search', description: 'Search deals' },
        { name: 'Update', value: 'update', description: 'Update a deal' },
        // Deal Activity operations
        { name: 'Get All', value: 'getAll', description: 'Get all activities of a deal' },
        // Deal Product operations
        { name: 'Add', value: 'add', description: 'Add a product to a deal' },
        { name: 'Get All', value: 'getAll', description: 'Get all products in a deal' },
        { name: 'Remove', value: 'remove', description: 'Remove a product from a deal' },
        { name: 'Update', value: 'update', description: 'Update a product in a deal' },
        // File operations
        { name: 'Create', value: 'create', description: 'Create a file' },
        { name: 'Delete', value: 'delete', description: 'Delete a file' },
        { name: 'Download', value: 'download', description: 'Download a file' },
        { name: 'Get', value: 'get', description: 'Get data of a file' },
        // Lead operations
        { name: 'Create', value: 'create', description: 'Create a lead' },
        { name: 'Delete', value: 'delete', description: 'Delete a lead' },
        { name: 'Get', value: 'get', description: 'Get data of a lead' },
        { name: 'Get All', value: 'getAll', description: 'Get data of all leads' },
        { name: 'Update', value: 'update', description: 'Update a lead' },
        // Note operations
        { name: 'Create', value: 'create', description: 'Create a note' },
        { name: 'Delete', value: 'delete', description: 'Delete a note' },
        { name: 'Get', value: 'get', description: 'Get data of a note' },
        { name: 'Get All', value: 'getAll', description: 'Get data of all notes' },
        { name: 'Update', value: 'update', description: 'Update a note' },
        // Organization operations
        { name: 'Create', value: 'create', description: 'Create an organization' },
        { name: 'Delete', value: 'delete', description: 'Delete an organization' },
        { name: 'Get', value: 'get', description: 'Get data of an organization' },
        { name: 'Get All', value: 'getAll', description: 'Get data of all organizations' },
        { name: 'Search', value: 'search', description: 'Search organizations' },
        { name: 'Update', value: 'update', description: 'Update an organization' },
        // Person operations
        { name: 'Create', value: 'create', description: 'Create a person' },
        { name: 'Delete', value: 'delete', description: 'Delete a person' },
        { name: 'Get', value: 'get', description: 'Get data of a person' },
        { name: 'Get All', value: 'getAll', description: 'Get data of all persons' },
        { name: 'Search', value: 'search', description: 'Search all persons' },
        { name: 'Update', value: 'update', description: 'Update a person' },
        // Product operations
        { name: 'Get All', value: 'getAll', description: 'Get data of all products' }
      ]
    },
    {
      name: 'activityId',
      displayName: 'Activity ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the activity to operate on'
    },
    {
      name: 'dealId',
      displayName: 'Deal ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the deal to operate on'
    },
    {
      name: 'fileId',
      displayName: 'File ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the file to operate on'
    },
    {
      name: 'leadId',
      displayName: 'Lead ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the lead to operate on'
    },
    {
      name: 'noteId',
      displayName: 'Note ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the note to operate on'
    },
    {
      name: 'organizationId',
      displayName: 'Organization ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the organization to operate on'
    },
    {
      name: 'personId',
      displayName: 'Person ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the person to operate on'
    },
    {
      name: 'productId',
      displayName: 'Product ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the product to operate on'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title of the record'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'Subject of the activity or note'
    },
    {
      name: 'type',
      displayName: 'Type',
      type: 'string',
      required: false,
      default: '',
      description: 'Type of the activity or record'
    },
    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Due date for the activity (YYYY-MM-DD)'
    },
    {
      name: 'dueTime',
      displayName: 'Due Time',
      type: 'string',
      required: false,
      default: '',
      description: 'Due time for the activity (HH:MM)'
    },
    {
      name: 'duration',
      displayName: 'Duration',
      type: 'string',
      required: false,
      default: '',
      description: 'Duration of the activity (HH:MM)'
    },
    {
      name: 'done',
      displayName: 'Done',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the activity is completed'
    },
    {
      name: 'value',
      displayName: 'Value',
      type: 'number',
      required: false,
      default: 0,
      description: 'Value of the deal'
    },
    {
      name: 'currency',
      displayName: 'Currency',
      type: 'string',
      required: false,
      default: 'USD',
      description: 'Currency of the deal value'
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'open',
      description: 'Status of the deal',
      options: [
        { name: 'Open', value: 'open' },
        { name: 'Won', value: 'won' },
        { name: 'Lost', value: 'lost' },
        { name: 'Deleted', value: 'deleted' }
      ]
    },
    {
      name: 'stage',
      displayName: 'Stage',
      type: 'string',
      required: false,
      default: '',
      description: 'Stage of the deal'
    },
    {
      name: 'pipelineId',
      displayName: 'Pipeline ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the pipeline'
    },
    {
      name: 'expectedCloseDate',
      displayName: 'Expected Close Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Expected close date for the deal (YYYY-MM-DD)'
    },
    {
      name: 'probability',
      displayName: 'Probability',
      type: 'number',
      required: false,
      default: 0,
      description: 'Probability of deal success (0-100)'
    },
    {
      name: 'lostReason',
      displayName: 'Lost Reason',
      type: 'string',
      required: false,
      default: '',
      description: 'Reason for losing the deal'
    },
    {
      name: 'visibleTo',
      displayName: 'Visible To',
      type: 'options',
      required: false,
      default: '1',
      description: 'Visibility of the record',
      options: [
        { name: 'Owner & followers (private)', value: '1' },
        { name: 'Entire company (shared)', value: '3' }
      ]
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the person, organization, or product'
    },
    {
      name: 'firstName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      default: '',
      description: 'First name of the person'
    },
    {
      name: 'lastName',
      displayName: 'Last Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Last name of the person'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Email address'
    },
    {
      name: 'phone',
      displayName: 'Phone',
      type: 'string',
      required: false,
      default: '',
      description: 'Phone number'
    },
    {
      name: 'address',
      displayName: 'Address',
      type: 'string',
      required: false,
      default: '',
      description: 'Address information'
    },
    {
      name: 'ownerId',
      displayName: 'Owner ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the owner/user'
    },
    {
      name: 'label',
      displayName: 'Label',
      type: 'string',
      required: false,
      default: '',
      description: 'Label for categorization'
    },
    {
      name: 'content',
      displayName: 'Content',
      type: 'string',
      required: false,
      default: '',
      description: 'Content of the note'
    },
    {
      name: 'pinnedToDealFlag',
      displayName: 'Pinned to Deal',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the note is pinned to deal'
    },
    {
      name: 'pinnedToOrganizationFlag',
      displayName: 'Pinned to Organization',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the note is pinned to organization'
    },
    {
      name: 'pinnedToPersonFlag',
      displayName: 'Pinned to Person',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the note is pinned to person'
    },
    {
      name: 'quantity',
      displayName: 'Quantity',
      type: 'number',
      required: false,
      default: 1,
      description: 'Quantity of the product'
    },
    {
      name: 'itemPrice',
      displayName: 'Item Price',
      type: 'number',
      required: false,
      default: 0,
      description: 'Price per item'
    },
    {
      name: 'discount',
      displayName: 'Discount',
      type: 'number',
      required: false,
      default: 0,
      description: 'Discount percentage (0-100)'
    },
    {
      name: 'filePath',
      displayName: 'File Path',
      type: 'string',
      required: false,
      default: '',
      description: 'Path to the file to upload'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file'
    },
    {
      name: 'searchTerm',
      displayName: 'Search Term',
      type: 'string',
      required: false,
      default: '',
      description: 'Term to search for'
    },
    {
      name: 'searchFields',
      displayName: 'Search Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Fields to search in (comma-separated)'
    },
    {
      name: 'exactMatch',
      displayName: 'Exact Match',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to use exact match in search'
    },
    {
      name: 'includeFields',
      displayName: 'Include Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Fields to include in response (comma-separated)'
    },
    {
      name: 'customFields',
      displayName: 'Custom Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of custom field key-value pairs'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of results to return'
    },
    {
      name: 'start',
      displayName: 'Start',
      type: 'number',
      required: false,
      default: 0,
      description: 'Pagination start'
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
      description: 'The processed Pipedrive data'
    }
  ],
  credentials: ['pipedriveApi', 'pipedriveOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Deal',
      description: 'Create a new deal in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'deal',
              operation: 'create',
              title: 'Enterprise Software License',
              value: 50000,
              currency: 'USD',
              status: 'open',
              expectedCloseDate: '2024-12-31'
            }
          }
        ]
      }
    },
    {
      name: 'Create Person',
      description: 'Create a new person (contact) in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'person',
              operation: 'create',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+1-555-0123'
            }
          }
        ]
      }
    },
    {
      name: 'Create Organization',
      description: 'Create a new organization in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'organization',
              operation: 'create',
              name: 'Acme Corporation',
              address: '123 Business Ave, City, State 12345'
            }
          }
        ]
      }
    },
    {
      name: 'Create Activity',
      description: 'Create a new activity in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'activity',
              operation: 'create',
              subject: 'Follow-up call with prospect',
              type: 'call',
              dueDate: '2024-06-20',
              dueTime: '14:00',
              duration: '01:00'
            }
          }
        ]
      }
    },
    {
      name: 'Create Lead',
      description: 'Create a new lead in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'lead',
              operation: 'create',
              title: 'Potential Enterprise Client',
              value: 25000,
              currency: 'USD',
              personId: '123',
              organizationId: '456'
            }
          }
        ]
      }
    },
    {
      name: 'Search Deals',
      description: 'Search for deals in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'deal',
              operation: 'search',
              searchTerm: 'enterprise',
              searchFields: 'title',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Add Product to Deal',
      description: 'Add a product to an existing deal',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'dealProduct',
              operation: 'add',
              dealId: '123',
              productId: '456',
              quantity: 2,
              itemPrice: 1000,
              discount: 10
            }
          }
        ]
      }
    },
    {
      name: 'Create Note',
      description: 'Create a note for a deal',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'note',
              operation: 'create',
              content: 'Customer expressed interest in premium features',
              dealId: '123',
              pinnedToDealFlag: true
            }
          }
        ]
      }
    }
  ]
};

export const pipedriveTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pipedriveTrigger',
  displayName: 'Pipedrive Trigger',
  description: 'Use the Pipedrive Trigger node to respond to events in Pipedrive and integrate Pipedrive with other applications. This trigger node uses webhooks to listen for changes in your Pipedrive account.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['*'],
      description: 'The events to trigger on',
      options: [
        { name: 'All Events', value: '*', description: 'Trigger on all Pipedrive events' },
        { name: 'Activity Added', value: 'activity.added', description: 'Triggered when an activity is added' },
        { name: 'Activity Updated', value: 'activity.updated', description: 'Triggered when an activity is updated' },
        { name: 'Activity Deleted', value: 'activity.deleted', description: 'Triggered when an activity is deleted' },
        { name: 'Deal Added', value: 'deal.added', description: 'Triggered when a deal is added' },
        { name: 'Deal Updated', value: 'deal.updated', description: 'Triggered when a deal is updated' },
        { name: 'Deal Deleted', value: 'deal.deleted', description: 'Triggered when a deal is deleted' },
        { name: 'Deal Won', value: 'deal.won', description: 'Triggered when a deal is won' },
        { name: 'Deal Lost', value: 'deal.lost', description: 'Triggered when a deal is lost' },
        { name: 'Person Added', value: 'person.added', description: 'Triggered when a person is added' },
        { name: 'Person Updated', value: 'person.updated', description: 'Triggered when a person is updated' },
        { name: 'Person Deleted', value: 'person.deleted', description: 'Triggered when a person is deleted' },
        { name: 'Organization Added', value: 'organization.added', description: 'Triggered when an organization is added' },
        { name: 'Organization Updated', value: 'organization.updated', description: 'Triggered when an organization is updated' },
        { name: 'Organization Deleted', value: 'organization.deleted', description: 'Triggered when an organization is deleted' },
        { name: 'Note Added', value: 'note.added', description: 'Triggered when a note is added' },
        { name: 'Note Updated', value: 'note.updated', description: 'Triggered when a note is updated' },
        { name: 'Note Deleted', value: 'note.deleted', description: 'Triggered when a note is deleted' },
        { name: 'Product Added', value: 'product.added', description: 'Triggered when a product is added' },
        { name: 'Product Updated', value: 'product.updated', description: 'Triggered when a product is updated' },
        { name: 'Product Deleted', value: 'product.deleted', description: 'Triggered when a product is deleted' },
        { name: 'Pipeline Added', value: 'pipeline.added', description: 'Triggered when a pipeline is added' },
        { name: 'Pipeline Updated', value: 'pipeline.updated', description: 'Triggered when a pipeline is updated' },
        { name: 'Pipeline Deleted', value: 'pipeline.deleted', description: 'Triggered when a pipeline is deleted' },
        { name: 'Stage Added', value: 'stage.added', description: 'Triggered when a stage is added' },
        { name: 'Stage Updated', value: 'stage.updated', description: 'Triggered when a stage is updated' },
        { name: 'Stage Deleted', value: 'stage.deleted', description: 'Triggered when a stage is deleted' },
        { name: 'User Added', value: 'user.added', description: 'Triggered when a user is added' },
        { name: 'User Updated', value: 'user.updated', description: 'Triggered when a user is updated' },
        { name: 'User Deleted', value: 'user.deleted', description: 'Triggered when a user is deleted' }
      ]
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Pipedrive events occur'
    }
  ],
  credentials: ['pipedriveApi', 'pipedriveOAuth2Api'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Deals',
      description: 'Trigger workflow when new deals are created',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive Trigger',
            type: 'n8n-nodes-base.pipedriveTrigger',
            parameters: {
              events: ['deal.added']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Deal Status Changes',
      description: 'Trigger when deals are won or lost',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive Trigger',
            type: 'n8n-nodes-base.pipedriveTrigger',
            parameters: {
              events: ['deal.won', 'deal.lost']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor New Contacts',
      description: 'Trigger when new people are added',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive Trigger',
            type: 'n8n-nodes-base.pipedriveTrigger',
            parameters: {
              events: ['person.added']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor All Events',
      description: 'Trigger on all Pipedrive events',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive Trigger',
            type: 'n8n-nodes-base.pipedriveTrigger',
            parameters: {
              events: ['*']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Activity Changes',
      description: 'Trigger when activities are added or updated',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive Trigger',
            type: 'n8n-nodes-base.pipedriveTrigger',
            parameters: {
              events: ['activity.added', 'activity.updated']
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const pipedriveNodes: NodeTypeInfo[] = [pipedriveNode, pipedriveTriggerNode];

// Export individual actions for the regular Pipedrive node
export const pipedriveActions = [
  // Activity actions
  'create_activity',
  'delete_activity',
  'get_activity',
  'get_all_activities',
  'update_activity',
  // Deal actions
  'create_deal',
  'delete_deal',
  'duplicate_deal',
  'get_deal',
  'get_all_deals',
  'search_deals',
  'update_deal',
  // Deal Activity actions
  'get_deal_activities',
  // Deal Product actions
  'add_deal_product',
  'get_deal_products',
  'remove_deal_product',
  'update_deal_product',
  // File actions
  'create_file',
  'delete_file',
  'download_file',
  'get_file',
  // Lead actions
  'create_lead',
  'delete_lead',
  'get_lead',
  'get_all_leads',
  'update_lead',
  // Note actions
  'create_note',
  'delete_note',
  'get_note',
  'get_all_notes',
  'update_note',
  // Organization actions
  'create_organization',
  'delete_organization',
  'get_organization',
  'get_all_organizations',
  'search_organizations',
  'update_organization',
  // Person actions
  'create_person',
  'delete_person',
  'get_person',
  'get_all_persons',
  'search_persons',
  'update_person',
  // Product actions
  'get_all_products'
];

// Export trigger events
export const pipedriveTriggers = [
  'all_events',
  'activity_added',
  'activity_updated',
  'activity_deleted',
  'deal_added',
  'deal_updated',
  'deal_deleted',
  'deal_won',
  'deal_lost',
  'person_added',
  'person_updated',
  'person_deleted',
  'organization_added',
  'organization_updated',
  'organization_deleted',
  'note_added',
  'note_updated',
  'note_deleted',
  'product_added',
  'product_updated',
  'product_deleted',
  'pipeline_added',
  'pipeline_updated',
  'pipeline_deleted',
  'stage_added',
  'stage_updated',
  'stage_deleted',
  'user_added',
  'user_updated',
  'user_deleted'
];