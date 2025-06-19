import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const salesforceNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.salesforce',
  displayName: 'Salesforce',
  description: 'Use the Salesforce node to automate work in Salesforce, and integrate Salesforce with other applications. n8n has built-in support for a wide range of Salesforce features, including creating, updating, deleting, and getting accounts, attachments, cases, and leads, as well as uploading documents.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'account',
      description: 'The resource to operate on',
      options: [
        { name: 'Account', value: 'account', description: 'Work with accounts' },
        { name: 'Attachment', value: 'attachment', description: 'Handle file attachments' },
        { name: 'Case', value: 'case', description: 'Manage support cases' },
        { name: 'Contact', value: 'contact', description: 'Work with contacts' },
        { name: 'Custom Object', value: 'customObject', description: 'Handle custom objects' },
        { name: 'Document', value: 'document', description: 'Upload documents' },
        { name: 'Flow', value: 'flow', description: 'Work with Salesforce flows' },
        { name: 'Lead', value: 'lead', description: 'Manage leads' },
        { name: 'Opportunity', value: 'opportunity', description: 'Handle sales opportunities' },
        { name: 'Search', value: 'search', description: 'Execute SOQL queries' },
        { name: 'Task', value: 'task', description: 'Manage tasks' },
        { name: 'User', value: 'user', description: 'Work with users' }
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
        // Account operations
        { name: 'Add Note', value: 'addNote', description: 'Add note to an account' },
        { name: 'Create', value: 'create', description: 'Create an account' },
        { name: 'Upsert', value: 'upsert', description: 'Create a new account, or update if it exists' },
        { name: 'Get', value: 'get', description: 'Get an account' },
        { name: 'Get All', value: 'getAll', description: 'Get all accounts' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get account metadata overview' },
        { name: 'Delete', value: 'delete', description: 'Delete an account' },
        { name: 'Update', value: 'update', description: 'Update an account' },
        // Attachment operations
        { name: 'Create', value: 'create', description: 'Create an attachment' },
        { name: 'Delete', value: 'delete', description: 'Delete an attachment' },
        { name: 'Get', value: 'get', description: 'Get an attachment' },
        { name: 'Get All', value: 'getAll', description: 'Get all attachments' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get attachment metadata overview' },
        { name: 'Update', value: 'update', description: 'Update an attachment' },
        // Case operations
        { name: 'Add Comment', value: 'addComment', description: 'Add a comment to a case' },
        { name: 'Create', value: 'create', description: 'Create a case' },
        { name: 'Get', value: 'get', description: 'Get a case' },
        { name: 'Get All', value: 'getAll', description: 'Get all cases' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get case metadata overview' },
        { name: 'Delete', value: 'delete', description: 'Delete a case' },
        { name: 'Update', value: 'update', description: 'Update a case' },
        // Contact operations
        { name: 'Add to Campaign', value: 'addToCampaign', description: 'Add contact to a campaign' },
        { name: 'Add Note', value: 'addNote', description: 'Add note to a contact' },
        { name: 'Create', value: 'create', description: 'Create a contact' },
        { name: 'Upsert', value: 'upsert', description: 'Create a new contact, or update if it exists' },
        { name: 'Delete', value: 'delete', description: 'Delete a contact' },
        { name: 'Get', value: 'get', description: 'Get a contact' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get contact metadata overview' },
        { name: 'Get All', value: 'getAll', description: 'Get all contacts' },
        { name: 'Update', value: 'update', description: 'Update a contact' },
        // Custom Object operations
        { name: 'Create', value: 'create', description: 'Create a custom object record' },
        { name: 'Upsert', value: 'upsert', description: 'Create a new record, or update if it exists' },
        { name: 'Get', value: 'get', description: 'Get a custom object record' },
        { name: 'Get All', value: 'getAll', description: 'Get all custom object records' },
        { name: 'Delete', value: 'delete', description: 'Delete a custom object record' },
        { name: 'Update', value: 'update', description: 'Update a custom object record' },
        // Document operations
        { name: 'Upload', value: 'upload', description: 'Upload a document' },
        // Flow operations
        { name: 'Get All', value: 'getAll', description: 'Get all flows' },
        { name: 'Invoke', value: 'invoke', description: 'Invoke a flow' },
        // Lead operations
        { name: 'Add to Campaign', value: 'addToCampaign', description: 'Add lead to a campaign' },
        { name: 'Add Note', value: 'addNote', description: 'Add note to a lead' },
        { name: 'Create', value: 'create', description: 'Create a lead' },
        { name: 'Upsert', value: 'upsert', description: 'Create a new lead, or update if it exists' },
        { name: 'Delete', value: 'delete', description: 'Delete a lead' },
        { name: 'Get', value: 'get', description: 'Get a lead' },
        { name: 'Get All', value: 'getAll', description: 'Get all leads' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get lead metadata overview' },
        { name: 'Update', value: 'update', description: 'Update a lead' },
        // Opportunity operations
        { name: 'Add Note', value: 'addNote', description: 'Add note to an opportunity' },
        { name: 'Create', value: 'create', description: 'Create an opportunity' },
        { name: 'Upsert', value: 'upsert', description: 'Create a new opportunity, or update if it exists' },
        { name: 'Delete', value: 'delete', description: 'Delete an opportunity' },
        { name: 'Get', value: 'get', description: 'Get an opportunity' },
        { name: 'Get All', value: 'getAll', description: 'Get all opportunities' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get opportunity metadata overview' },
        { name: 'Update', value: 'update', description: 'Update an opportunity' },
        // Search operations
        { name: 'Query', value: 'query', description: 'Execute a SOQL query that returns all results' },
        // Task operations
        { name: 'Create', value: 'create', description: 'Create a task' },
        { name: 'Delete', value: 'delete', description: 'Delete a task' },
        { name: 'Get', value: 'get', description: 'Get a task' },
        { name: 'Get All', value: 'getAll', description: 'Get all tasks' },
        { name: 'Get Metadata', value: 'getMetadata', description: 'Get task metadata overview' },
        { name: 'Update', value: 'update', description: 'Update a task' },
        // User operations
        { name: 'Get', value: 'get', description: 'Get a user' },
        { name: 'Get All', value: 'getAll', description: 'Get all users' }
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
      name: 'customObjectType',
      displayName: 'Custom Object Type',
      type: 'string',
      required: false,
      default: '',
      description: 'The API name of the custom object type'
    },
    {
      name: 'campaignId',
      displayName: 'Campaign ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the campaign'
    },
    {
      name: 'flowId',
      displayName: 'Flow ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the flow to invoke'
    },
    {
      name: 'query',
      displayName: 'SOQL Query',
      type: 'string',
      required: false,
      default: '',
      description: 'The SOQL query to execute'
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
      name: 'industry',
      displayName: 'Industry',
      type: 'string',
      required: false,
      default: '',
      description: 'Industry type'
    },
    {
      name: 'annualRevenue',
      displayName: 'Annual Revenue',
      type: 'number',
      required: false,
      default: 0,
      description: 'Annual revenue amount'
    },
    {
      name: 'numberOfEmployees',
      displayName: 'Number of Employees',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of employees'
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
      name: 'status',
      displayName: 'Status',
      type: 'string',
      required: false,
      default: '',
      description: 'Status of the record'
    },
    {
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'Medium',
      description: 'Priority level',
      options: [
        { name: 'High', value: 'High' },
        { name: 'Medium', value: 'Medium' },
        { name: 'Low', value: 'Low' }
      ]
    },
    {
      name: 'type',
      displayName: 'Type',
      type: 'string',
      required: false,
      default: '',
      description: 'Type classification'
    },
    {
      name: 'accountId',
      displayName: 'Account ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the associated account'
    },
    {
      name: 'contactId',
      displayName: 'Contact ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the associated contact'
    },
    {
      name: 'leadSource',
      displayName: 'Lead Source',
      type: 'string',
      required: false,
      default: '',
      description: 'Source of the lead'
    },
    {
      name: 'amount',
      displayName: 'Amount',
      type: 'number',
      required: false,
      default: 0,
      description: 'Opportunity amount'
    },
    {
      name: 'closeDate',
      displayName: 'Close Date',
      type: 'string',
      required: false,
      default: '',
      description: 'Expected close date (YYYY-MM-DD)'
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
      description: 'The processed Salesforce data'
    }
  ],
  credentials: ['salesforceApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Account',
      description: 'Create a new account in Salesforce',
      workflow: {
        nodes: [
          {
            name: 'Salesforce',
            type: 'n8n-nodes-base.salesforce',
            parameters: {
              resource: 'account',
              operation: 'create',
              name: 'Acme Corporation',
              website: 'https://acme.com',
              industry: 'Technology',
              annualRevenue: 5000000,
              numberOfEmployees: 250,
              description: 'Leading technology company'
            }
          }
        ]
      }
    },
    {
      name: 'Create Lead',
      description: 'Create a new lead from contact information',
      workflow: {
        nodes: [
          {
            name: 'Salesforce',
            type: 'n8n-nodes-base.salesforce',
            parameters: {
              resource: 'lead',
              operation: 'create',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              company: 'Example Corp',
              phone: '+1-555-0123',
              leadSource: 'Website',
              status: 'Open - Not Contacted'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Opportunities',
      description: 'Retrieve all opportunities from Salesforce',
      workflow: {
        nodes: [
          {
            name: 'Salesforce',
            type: 'n8n-nodes-base.salesforce',
            parameters: {
              resource: 'opportunity',
              operation: 'getAll',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Create Contact',
      description: 'Create a new contact with account association',
      workflow: {
        nodes: [
          {
            name: 'Salesforce',
            type: 'n8n-nodes-base.salesforce',
            parameters: {
              resource: 'contact',
              operation: 'create',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@acme.com',
              phone: '+1-555-0456',
              accountId: '001XX000003DHPt'
            }
          }
        ]
      }
    },
    {
      name: 'SOQL Query',
      description: 'Execute a custom SOQL query',
      workflow: {
        nodes: [
          {
            name: 'Salesforce',
            type: 'n8n-nodes-base.salesforce',
            parameters: {
              resource: 'search',
              operation: 'query',
              query: 'SELECT Id, Name, Email FROM Contact WHERE LastModifiedDate = TODAY'
            }
          }
        ]
      }
    },
    {
      name: 'Create Case',
      description: 'Create a support case',
      workflow: {
        nodes: [
          {
            name: 'Salesforce',
            type: 'n8n-nodes-base.salesforce',
            parameters: {
              resource: 'case',
              operation: 'create',
              subject: 'Product Support Request',
              description: 'Customer needs help with product configuration',
              priority: 'Medium',
              status: 'New',
              accountId: '001XX000003DHPt'
            }
          }
        ]
      }
    }
  ]
};

export const salesforceTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.salesforceTrigger',
  displayName: 'Salesforce Trigger',
  description: 'Use the Salesforce Trigger node to respond to events in Salesforce and integrate Salesforce with other applications. n8n has built-in support for a wide range of Salesforce events.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['onAccountCreated'],
      description: 'The events to trigger on',
      options: [
        { name: 'On Account Created', value: 'onAccountCreated', description: 'Triggered when an account is created' },
        { name: 'On Account Updated', value: 'onAccountUpdated', description: 'Triggered when an account is updated' },
        { name: 'On Attachment Created', value: 'onAttachmentCreated', description: 'Triggered when an attachment is created' },
        { name: 'On Attachment Updated', value: 'onAttachmentUpdated', description: 'Triggered when an attachment is updated' },
        { name: 'On Case Created', value: 'onCaseCreated', description: 'Triggered when a case is created' },
        { name: 'On Case Updated', value: 'onCaseUpdated', description: 'Triggered when a case is updated' },
        { name: 'On Contact Created', value: 'onContactCreated', description: 'Triggered when a contact is created' },
        { name: 'On Contact Updated', value: 'onContactUpdated', description: 'Triggered when a contact is updated' },
        { name: 'On Custom Object Created', value: 'onCustomObjectCreated', description: 'Triggered when a custom object is created' },
        { name: 'On Custom Object Updated', value: 'onCustomObjectUpdated', description: 'Triggered when a custom object is updated' },
        { name: 'On Lead Created', value: 'onLeadCreated', description: 'Triggered when a lead is created' },
        { name: 'On Lead Updated', value: 'onLeadUpdated', description: 'Triggered when a lead is updated' },
        { name: 'On Opportunity Created', value: 'onOpportunityCreated', description: 'Triggered when an opportunity is created' },
        { name: 'On Opportunity Updated', value: 'onOpportunityUpdated', description: 'Triggered when an opportunity is updated' },
        { name: 'On Task Created', value: 'onTaskCreated', description: 'Triggered when a task is created' },
        { name: 'On Task Updated', value: 'onTaskUpdated', description: 'Triggered when a task is updated' },
        { name: 'On User Created', value: 'onUserCreated', description: 'Triggered when a user is created' },
        { name: 'On User Updated', value: 'onUserUpdated', description: 'Triggered when a user is updated' }
      ]
    },
    {
      name: 'objectType',
      displayName: 'Custom Object Type',
      type: 'string',
      required: false,
      default: '',
      description: 'For custom object events, specify the API name of the custom object'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Salesforce events occur'
    }
  ],
  credentials: ['salesforceApi'],
  triggerNode: true,
  polling: true,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Leads',
      description: 'Trigger workflow when new leads are created',
      workflow: {
        nodes: [
          {
            name: 'Salesforce Trigger',
            type: 'n8n-nodes-base.salesforceTrigger',
            parameters: {
              events: ['onLeadCreated']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Account Changes',
      description: 'Trigger when accounts are created or updated',
      workflow: {
        nodes: [
          {
            name: 'Salesforce Trigger',
            type: 'n8n-nodes-base.salesforceTrigger',
            parameters: {
              events: ['onAccountCreated', 'onAccountUpdated']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Opportunity Updates',
      description: 'Trigger when opportunities are updated',
      workflow: {
        nodes: [
          {
            name: 'Salesforce Trigger',
            type: 'n8n-nodes-base.salesforceTrigger',
            parameters: {
              events: ['onOpportunityUpdated']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Support Cases',
      description: 'Trigger when new support cases are created',
      workflow: {
        nodes: [
          {
            name: 'Salesforce Trigger',
            type: 'n8n-nodes-base.salesforceTrigger',
            parameters: {
              events: ['onCaseCreated']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Custom Objects',
      description: 'Trigger when custom objects are created or updated',
      workflow: {
        nodes: [
          {
            name: 'Salesforce Trigger',
            type: 'n8n-nodes-base.salesforceTrigger',
            parameters: {
              events: ['onCustomObjectCreated', 'onCustomObjectUpdated'],
              objectType: 'Custom_Product__c'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const salesforceNodes: NodeTypeInfo[] = [salesforceNode, salesforceTriggerNode];

// Export individual actions for the regular Salesforce node
export const salesforceActions = [
  // Account actions
  'add_account_note',
  'create_account',
  'upsert_account',
  'get_account',
  'get_all_accounts',
  'get_account_metadata',
  'delete_account',
  'update_account',
  // Attachment actions
  'create_attachment',
  'delete_attachment',
  'get_attachment',
  'get_all_attachments',
  'get_attachment_metadata',
  'update_attachment',
  // Case actions
  'add_case_comment',
  'create_case',
  'get_case',
  'get_all_cases',
  'get_case_metadata',
  'delete_case',
  'update_case',
  // Contact actions
  'add_contact_to_campaign',
  'add_contact_note',
  'create_contact',
  'upsert_contact',
  'delete_contact',
  'get_contact',
  'get_contact_metadata',
  'get_all_contacts',
  'update_contact',
  // Custom Object actions
  'create_custom_object',
  'upsert_custom_object',
  'get_custom_object',
  'get_all_custom_objects',
  'delete_custom_object',
  'update_custom_object',
  // Document actions
  'upload_document',
  // Flow actions
  'get_all_flows',
  'invoke_flow',
  // Lead actions
  'add_lead_to_campaign',
  'add_lead_note',
  'create_lead',
  'upsert_lead',
  'delete_lead',
  'get_lead',
  'get_all_leads',
  'get_lead_metadata',
  'update_lead',
  // Opportunity actions
  'add_opportunity_note',
  'create_opportunity',
  'upsert_opportunity',
  'delete_opportunity',
  'get_opportunity',
  'get_all_opportunities',
  'get_opportunity_metadata',
  'update_opportunity',
  // Search actions
  'execute_soql_query',
  // Task actions
  'create_task',
  'delete_task',
  'get_task',
  'get_all_tasks',
  'get_task_metadata',
  'update_task',
  // User actions
  'get_user',
  'get_all_users'
];

// Export trigger events
export const salesforceTriggers = [
  'account_created',
  'account_updated',
  'attachment_created',
  'attachment_updated',
  'case_created',
  'case_updated',
  'contact_created',
  'contact_updated',
  'custom_object_created',
  'custom_object_updated',
  'lead_created',
  'lead_updated',
  'opportunity_created',
  'opportunity_updated',
  'task_created',
  'task_updated',
  'user_created',
  'user_updated'
];