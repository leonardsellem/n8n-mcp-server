import { NodeTypeInfo } from '../../node-types.js';

export const odooNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.odoo',
  displayName: 'Odoo',
  description: 'Use the Odoo node to automate work in Odoo, and integrate Odoo with other applications. n8n has built-in support for a wide range of Odoo features, including creating, updating, deleting, and getting contracts, resources, and opportunities.',
  category: 'Business & ERP',
  subcategory: 'ERP',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'contact',
      description: 'The resource to operate on',
      options: [
        { name: 'Contact', value: 'contact', description: 'Work with contacts' },
        { name: 'Custom Resource', value: 'customResource', description: 'Handle custom resources' },
        { name: 'Note', value: 'note', description: 'Manage notes' },
        { name: 'Opportunity', value: 'opportunity', description: 'Handle sales opportunities' }
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
        // Contact operations
        { name: 'Create', value: 'create', description: 'Create a new contact' },
        { name: 'Delete', value: 'delete', description: 'Delete a contact' },
        { name: 'Get', value: 'get', description: 'Get a contact' },
        { name: 'Get All', value: 'getAll', description: 'Get all contacts' },
        { name: 'Update', value: 'update', description: 'Update a contact' },
        // Custom Resource operations
        { name: 'Create', value: 'create', description: 'Create a new item' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get All', value: 'getAll', description: 'Get all items' },
        { name: 'Update', value: 'update', description: 'Update an item' },
        // Note operations
        { name: 'Create', value: 'create', description: 'Create a new note' },
        { name: 'Delete', value: 'delete', description: 'Delete a note' },
        { name: 'Get', value: 'get', description: 'Get a note' },
        { name: 'Get All', value: 'getAll', description: 'Get all notes' },
        { name: 'Update', value: 'update', description: 'Update a note' },
        // Opportunity operations
        { name: 'Create', value: 'create', description: 'Create a new opportunity' },
        { name: 'Delete', value: 'delete', description: 'Delete an opportunity' },
        { name: 'Get', value: 'get', description: 'Get an opportunity' },
        { name: 'Get All', value: 'getAll', description: 'Get all opportunities' },
        { name: 'Update', value: 'update', description: 'Update an opportunity' }
      ]
    },
    {
      name: 'recordId',
      displayName: 'Record ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the record to operate on'
    },
    {
      name: 'resourceName',
      displayName: 'Resource Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the custom resource'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the record'
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
      name: 'company',
      displayName: 'Company',
      type: 'string',
      required: false,
      default: '',
      description: 'Company name'
    },
    {
      name: 'website',
      displayName: 'Website',
      type: 'string',
      required: false,
      default: '',
      description: 'Website URL'
    },
    {
      name: 'street',
      displayName: 'Street',
      type: 'string',
      required: false,
      default: '',
      description: 'Street address'
    },
    {
      name: 'city',
      displayName: 'City',
      type: 'string',
      required: false,
      default: '',
      description: 'City'
    },
    {
      name: 'state',
      displayName: 'State',
      type: 'string',
      required: false,
      default: '',
      description: 'State or province'
    },
    {
      name: 'zip',
      displayName: 'ZIP Code',
      type: 'string',
      required: false,
      default: '',
      description: 'ZIP or postal code'
    },
    {
      name: 'country',
      displayName: 'Country',
      type: 'string',
      required: false,
      default: '',
      description: 'Country'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Job title or note title'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description or notes'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'Subject of the record'
    },
    {
      name: 'stage',
      displayName: 'Stage',
      type: 'string',
      required: false,
      default: '',
      description: 'Opportunity stage'
    },
    {
      name: 'probability',
      displayName: 'Probability',
      type: 'number',
      required: false,
      default: 0,
      description: 'Probability percentage (0-100)'
    },
    {
      name: 'expectedRevenue',
      displayName: 'Expected Revenue',
      type: 'number',
      required: false,
      default: 0,
      description: 'Expected revenue amount'
    },
    {
      name: 'partnerId',
      displayName: 'Partner ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the associated partner/customer'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the assigned user'
    },
    {
      name: 'dateDeadline',
      displayName: 'Date Deadline',
      type: 'string',
      required: false,
      default: '',
      description: 'Deadline date (YYYY-MM-DD)'
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
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of results to skip'
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
      description: 'The processed Odoo data'
    }
  ],
  credentials: ['odooApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Contact',
      description: 'Create a new contact in Odoo',
      workflow: {
        nodes: [
          {
            name: 'Odoo',
            type: 'n8n-nodes-base.odoo',
            parameters: {
              resource: 'contact',
              operation: 'create',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+1-555-0123',
              company: 'Example Corp',
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zip: '10001',
              country: 'USA'
            }
          }
        ]
      }
    },
    {
      name: 'Create Opportunity',
      description: 'Create a new sales opportunity',
      workflow: {
        nodes: [
          {
            name: 'Odoo',
            type: 'n8n-nodes-base.odoo',
            parameters: {
              resource: 'opportunity',
              operation: 'create',
              name: 'Enterprise Software Deal',
              partnerId: '123',
              expectedRevenue: 50000,
              probability: 75,
              stage: 'Proposal',
              dateDeadline: '2024-12-31',
              description: 'Large enterprise software implementation project'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Contacts',
      description: 'Retrieve all contacts from Odoo',
      workflow: {
        nodes: [
          {
            name: 'Odoo',
            type: 'n8n-nodes-base.odoo',
            parameters: {
              resource: 'contact',
              operation: 'getAll',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Create Note',
      description: 'Create a note in Odoo',
      workflow: {
        nodes: [
          {
            name: 'Odoo',
            type: 'n8n-nodes-base.odoo',
            parameters: {
              resource: 'note',
              operation: 'create',
              title: 'Meeting Summary',
              description: 'Discussed product requirements and timeline with client',
              partnerId: '123'
            }
          }
        ]
      }
    },
    {
      name: 'Update Opportunity',
      description: 'Update an existing opportunity',
      workflow: {
        nodes: [
          {
            name: 'Odoo',
            type: 'n8n-nodes-base.odoo',
            parameters: {
              resource: 'opportunity',
              operation: 'update',
              recordId: '456',
              stage: 'Won',
              probability: 100,
              description: 'Deal closed successfully'
            }
          }
        ]
      }
    },
    {
      name: 'Custom Resource Operations',
      description: 'Work with custom Odoo resources',
      workflow: {
        nodes: [
          {
            name: 'Odoo',
            type: 'n8n-nodes-base.odoo',
            parameters: {
              resource: 'customResource',
              operation: 'create',
              resourceName: 'custom.product',
              name: 'Custom Product',
              description: 'A custom product created via n8n'
            }
          }
        ]
      }
    }
  ]
};

// Export individual actions for the Odoo node
export const odooActions = [
  // Contact actions
  'create_contact',
  'delete_contact',
  'get_contact',
  'get_all_contacts',
  'update_contact',
  // Custom Resource actions
  'create_custom_resource',
  'delete_custom_resource',
  'get_custom_resource',
  'get_all_custom_resources',
  'update_custom_resource',
  // Note actions
  'create_note',
  'delete_note',
  'get_note',
  'get_all_notes',
  'update_note',
  // Opportunity actions
  'create_opportunity',
  'delete_opportunity',
  'get_opportunity',
  'get_all_opportunities',
  'update_opportunity'
];

// Export resource types
export const odooResources = [
  'contact',
  'custom_resource',
  'note',
  'opportunity'
];

// Export common field mappings
export const odooFieldMappings = {
  contact: {
    name: 'name',
    email: 'email',
    phone: 'phone',
    company: 'parent_id',
    street: 'street',
    city: 'city',
    state: 'state_id',
    zip: 'zip',
    country: 'country_id',
    website: 'website'
  },
  opportunity: {
    name: 'name',
    partnerId: 'partner_id',
    userId: 'user_id',
    stage: 'stage_id',
    probability: 'probability',
    expectedRevenue: 'expected_revenue',
    dateDeadline: 'date_deadline',
    description: 'description'
  },
  note: {
    title: 'name',
    description: 'memo',
    partnerId: 'partner_id',
    userId: 'user_id'
  }
};