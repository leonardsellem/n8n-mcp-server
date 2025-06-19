import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const copperNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.copper',
  displayName: 'Copper',
  description: 'Use the Copper node to automate work in Copper, and integrate Copper with other applications. Supports creating, updating, deleting, and getting companies, customer sources, leads, opportunities, people, projects, tasks, and users.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'company',
      description: 'The resource to operate on',
      options: [
        { name: 'Company', value: 'company', description: 'Work with companies' },
        { name: 'Customer Source', value: 'customerSource', description: 'Work with customer sources' },
        { name: 'Lead', value: 'lead', description: 'Work with leads' },
        { name: 'Opportunity', value: 'opportunity', description: 'Work with opportunities' },
        { name: 'Person', value: 'person', description: 'Work with people/contacts' },
        { name: 'Project', value: 'project', description: 'Work with projects' },
        { name: 'Task', value: 'task', description: 'Work with tasks' },
        { name: 'User', value: 'user', description: 'Work with users' }
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
        { name: 'Create', value: 'create', description: 'Create a new record' },
        { name: 'Delete', value: 'delete', description: 'Delete a record' },
        { name: 'Get', value: 'get', description: 'Get a single record' },
        { name: 'Get All', value: 'getAll', description: 'Get multiple records' },
        { name: 'Update', value: 'update', description: 'Update a record' }
      ]
    },
    {
      name: 'companyId',
      displayName: 'Company ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the company to operate on'
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
      name: 'opportunityId',
      displayName: 'Opportunity ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the opportunity to operate on'
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
      name: 'projectId',
      displayName: 'Project ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the project to operate on'
    },
    {
      name: 'taskId',
      displayName: 'Task ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the task to operate on'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the record'
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
      name: 'website',
      displayName: 'Website',
      type: 'string',
      required: false,
      default: '',
      description: 'Website URL'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Title or job position'
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
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'None',
      description: 'Priority level',
      options: [
        { name: 'None', value: 'None', description: 'No priority' },
        { name: 'Low', value: 'Low', description: 'Low priority' },
        { name: 'Medium', value: 'Medium', description: 'Medium priority' },
        { name: 'High', value: 'High', description: 'High priority' }
      ]
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
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Tags associated with the record (comma-separated)'
    },
    {
      name: 'assigneeId',
      displayName: 'Assignee ID',
      type: 'string',
      required: false,
      default: '',
      description: 'ID of the user assigned to this record'
    },
    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Due date for tasks and projects'
    },
    {
      name: 'value',
      displayName: 'Value',
      type: 'number',
      required: false,
      default: 0,
      description: 'Monetary value for opportunities'
    },
    {
      name: 'customFields',
      displayName: 'Custom Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object with custom field values'
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
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
      default: 1,
      description: 'Page number for pagination'
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
      description: 'The processed Copper data'
    }
  ],
  credentials: ['copperApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Company',
      description: 'Create a new company in Copper',
      workflow: {
        nodes: [
          {
            name: 'Copper',
            type: 'n8n-nodes-base.copper',
            parameters: {
              resource: 'company',
              operation: 'create',
              name: 'Acme Corp',
              email: 'contact@acme.com',
              phone: '+1-555-0123',
              website: 'https://acme.com'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Leads',
      description: 'Retrieve all leads from Copper',
      workflow: {
        nodes: [
          {
            name: 'Copper',
            type: 'n8n-nodes-base.copper',
            parameters: {
              resource: 'lead',
              operation: 'getAll',
              limit: 25
            }
          }
        ]
      }
    },
    {
      name: 'Create Opportunity',
      description: 'Create a new opportunity in Copper',
      workflow: {
        nodes: [
          {
            name: 'Copper',
            type: 'n8n-nodes-base.copper',
            parameters: {
              resource: 'opportunity',
              operation: 'create',
              name: 'Big Deal',
              value: 50000,
              priority: 'High',
              description: 'Large enterprise opportunity'
            }
          }
        ]
      }
    },
    {
      name: 'Update Person',
      description: 'Update a person/contact in Copper',
      workflow: {
        nodes: [
          {
            name: 'Copper',
            type: 'n8n-nodes-base.copper',
            parameters: {
              resource: 'person',
              operation: 'update',
              personId: '{{$json["personId"]}}',
              email: 'updated@email.com',
              title: 'Senior Manager'
            }
          }
        ]
      }
    },
    {
      name: 'Create Task',
      description: 'Create a new task in Copper',
      workflow: {
        nodes: [
          {
            name: 'Copper',
            type: 'n8n-nodes-base.copper',
            parameters: {
              resource: 'task',
              operation: 'create',
              name: 'Follow up call',
              description: 'Call prospect to discuss requirements',
              priority: 'Medium',
              dueDate: '2024-12-31T10:00:00.000Z'
            }
          }
        ]
      }
    }
  ]
};

export const copperTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.copperTrigger',
  displayName: 'Copper Trigger',
  description: 'Triggers the workflow when changes occur in Copper CRM. Supports monitoring various Copper resources for create, update, and delete events.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'company',
      description: 'The resource to monitor for changes',
      options: [
        { name: 'Company', value: 'company', description: 'Monitor company changes' },
        { name: 'Lead', value: 'lead', description: 'Monitor lead changes' },
        { name: 'Opportunity', value: 'opportunity', description: 'Monitor opportunity changes' },
        { name: 'Person', value: 'person', description: 'Monitor person changes' },
        { name: 'Project', value: 'project', description: 'Monitor project changes' },
        { name: 'Task', value: 'task', description: 'Monitor task changes' }
      ]
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'created',
      description: 'The type of event to monitor',
      options: [
        { name: 'Created', value: 'created', description: 'Trigger when a record is created' },
        { name: 'Updated', value: 'updated', description: 'Trigger when a record is updated' },
        { name: 'Deleted', value: 'deleted', description: 'Trigger when a record is deleted' }
      ]
    },
    {
      name: 'pollTimes',
      displayName: 'Poll Times',
      type: 'fixedCollection',
      required: true,
      default: { mode: 'everyMinute' },
      description: 'How often to check for changes in Copper'
    },
    {
      name: 'simplify',
      displayName: 'Simplify',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to return a simplified version of the response or the raw data'
    },
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON object with filters to apply (e.g., {"tags": ["important"]})'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when monitored events occur in Copper'
    }
  ],
  credentials: ['copperApi'],
  triggerNode: true,
  polling: true,
  webhookSupport: false,
  examples: [
    {
      name: 'Monitor New Companies',
      description: 'Trigger workflow when new companies are created',
      workflow: {
        nodes: [
          {
            name: 'Copper Trigger',
            type: 'n8n-nodes-base.copperTrigger',
            parameters: {
              resource: 'company',
              event: 'created',
              simplify: true
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
            name: 'Copper Trigger',
            type: 'n8n-nodes-base.copperTrigger',
            parameters: {
              resource: 'opportunity',
              event: 'updated',
              simplify: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor High Priority Tasks',
      description: 'Trigger when high priority tasks are created',
      workflow: {
        nodes: [
          {
            name: 'Copper Trigger',
            type: 'n8n-nodes-base.copperTrigger',
            parameters: {
              resource: 'task',
              event: 'created',
              simplify: true,
              filters: '{"priority": "High"}'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const copperNodes: NodeTypeInfo[] = [copperNode, copperTriggerNode];

// Export individual actions for the regular Copper node
export const copperActions = [
  'create_company',
  'delete_company',
  'get_company',
  'get_all_companies',
  'update_company',
  'get_all_customer_sources',
  'create_lead',
  'delete_lead',
  'get_lead',
  'get_all_leads',
  'update_lead',
  'create_opportunity',
  'delete_opportunity',
  'get_opportunity',
  'get_all_opportunities',
  'update_opportunity',
  'create_person',
  'delete_person',
  'get_person',
  'get_all_people',
  'update_person',
  'create_project',
  'delete_project',
  'get_project',
  'get_all_projects',
  'update_project',
  'create_task',
  'delete_task',
  'get_task',
  'get_all_tasks',
  'update_task',
  'get_all_users'
];

// Export trigger events
export const copperTriggers = [
  'company_created',
  'company_updated',
  'company_deleted',
  'lead_created',
  'lead_updated',
  'lead_deleted',
  'opportunity_created',
  'opportunity_updated',
  'opportunity_deleted',
  'person_created',
  'person_updated',
  'person_deleted',
  'project_created',
  'project_updated',
  'project_deleted',
  'task_created',
  'task_updated',
  'task_deleted'
];