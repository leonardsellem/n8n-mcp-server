import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const hubspotNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hubspot',
  displayName: 'HubSpot',
  description: 'Use the HubSpot node to automate work in HubSpot, and integrate HubSpot with other applications. n8n has built-in support for a wide range of HubSpot features, including creating, updating, deleting, and getting contacts, deals, lists, engagements and companies.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'contact',
      description: 'The resource to operate on',
      options: [
        { name: 'Contact', value: 'contact', description: 'Work with HubSpot contacts' },
        { name: 'Contact List', value: 'contactList', description: 'Manage contact lists' },
        { name: 'Company', value: 'company', description: 'Work with companies' },
        { name: 'Deal', value: 'deal', description: 'Manage deals and opportunities' },
        { name: 'Engagement', value: 'engagement', description: 'Handle engagements and activities' },
        { name: 'Form', value: 'form', description: 'Work with HubSpot forms' },
        { name: 'Ticket', value: 'ticket', description: 'Manage support tickets' }
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
        { name: 'Create/Update', value: 'upsert', description: 'Create or update a contact' },
        { name: 'Delete', value: 'delete', description: 'Delete a contact' },
        { name: 'Get', value: 'get', description: 'Get a contact' },
        { name: 'Get All', value: 'getAll', description: 'Get all contacts' },
        { name: 'Get Recently Created/Updated', value: 'getRecent', description: 'Get recently created/updated contacts' },
        { name: 'Search', value: 'search', description: 'Search contacts' },
        // Contact List operations
        { name: 'Add Contact to List', value: 'addToList', description: 'Add contact to a list' },
        { name: 'Remove Contact from List', value: 'removeFromList', description: 'Remove a contact from a list' },
        // Company operations
        { name: 'Create', value: 'create', description: 'Create a company' },
        { name: 'Delete', value: 'delete', description: 'Delete a company' },
        { name: 'Get', value: 'get', description: 'Get a company' },
        { name: 'Get All', value: 'getAll', description: 'Get all companies' },
        { name: 'Get Recently Created', value: 'getRecentlyCreated', description: 'Get recently created companies' },
        { name: 'Get Recently Modified', value: 'getRecentlyModified', description: 'Get recently modified companies' },
        { name: 'Search by Domain', value: 'searchByDomain', description: 'Search companies by domain' },
        { name: 'Update', value: 'update', description: 'Update a company' },
        // Deal operations
        { name: 'Create', value: 'create', description: 'Create a deal' },
        { name: 'Delete', value: 'delete', description: 'Delete a deal' },
        { name: 'Get', value: 'get', description: 'Get a deal' },
        { name: 'Get All', value: 'getAll', description: 'Get all deals' },
        { name: 'Get Recently Created', value: 'getRecentlyCreated', description: 'Get recently created deals' },
        { name: 'Get Recently Modified', value: 'getRecentlyModified', description: 'Get recently modified deals' },
        { name: 'Search', value: 'search', description: 'Search deals' },
        { name: 'Update', value: 'update', description: 'Update a deal' },
        // Engagement operations
        { name: 'Create', value: 'create', description: 'Create an engagement' },
        { name: 'Delete', value: 'delete', description: 'Delete an engagement' },
        { name: 'Get', value: 'get', description: 'Get an engagement' },
        { name: 'Get All', value: 'getAll', description: 'Get all engagements' },
        // Form operations
        { name: 'Get All Fields', value: 'getFields', description: 'Get all fields from a form' },
        { name: 'Submit Data', value: 'submitData', description: 'Submit data to a form' },
        // Ticket operations
        { name: 'Create', value: 'create', description: 'Create a ticket' },
        { name: 'Delete', value: 'delete', description: 'Delete a ticket' },
        { name: 'Get', value: 'get', description: 'Get a ticket' },
        { name: 'Get All', value: 'getAll', description: 'Get all tickets' },
        { name: 'Update', value: 'update', description: 'Update a ticket' }
      ]
    },
    {
      name: 'contactId',
      displayName: 'Contact ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the contact to operate on'
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
      name: 'dealId',
      displayName: 'Deal ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the deal to operate on'
    },
    {
      name: 'engagementId',
      displayName: 'Engagement ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the engagement to operate on'
    },
    {
      name: 'ticketId',
      displayName: 'Ticket ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the ticket to operate on'
    },
    {
      name: 'formId',
      displayName: 'Form ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the form to operate on'
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the contact list'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Contact email address'
    },
    {
      name: 'firstName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Contact first name'
    },
    {
      name: 'lastName',
      displayName: 'Last Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Contact last name'
    },
    {
      name: 'phone',
      displayName: 'Phone',
      type: 'string',
      required: false,
      default: '',
      description: 'Contact phone number'
    },
    {
      name: 'website',
      displayName: 'Website',
      type: 'string',
      required: false,
      default: '',
      description: 'Company website URL'
    },
    {
      name: 'domain',
      displayName: 'Domain',
      type: 'string',
      required: false,
      default: '',
      description: 'Company domain for search'
    },
    {
      name: 'companyName',
      displayName: 'Company Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the company'
    },
    {
      name: 'dealName',
      displayName: 'Deal Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the deal'
    },
    {
      name: 'dealStage',
      displayName: 'Deal Stage',
      type: 'string',
      required: false,
      default: '',
      description: 'Current stage of the deal'
    },
    {
      name: 'dealAmount',
      displayName: 'Deal Amount',
      type: 'number',
      required: false,
      default: 0,
      description: 'Deal amount in company currency'
    },
    {
      name: 'pipeline',
      displayName: 'Pipeline',
      type: 'string',
      required: false,
      default: '',
      description: 'Deal pipeline'
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
      name: 'priority',
      displayName: 'Priority',
      type: 'options',
      required: false,
      default: 'MEDIUM',
      description: 'Priority level',
      options: [
        { name: 'Low', value: 'LOW' },
        { name: 'Medium', value: 'MEDIUM' },
        { name: 'High', value: 'HIGH' }
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
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'Subject or title'
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
      name: 'category',
      displayName: 'Category',
      type: 'string',
      required: false,
      default: '',
      description: 'Category classification'
    },
    {
      name: 'source',
      displayName: 'Source',
      type: 'string',
      required: false,
      default: '',
      description: 'Source of the record'
    },
    {
      name: 'customProperties',
      displayName: 'Custom Properties',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of custom property key-value pairs'
    },
    {
      name: 'searchQuery',
      displayName: 'Search Query',
      type: 'string',
      required: false,
      default: '',
      description: 'Search query string'
    },
    {
      name: 'formData',
      displayName: 'Form Data',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of form field data'
    },
    {
      name: 'engagementType',
      displayName: 'Engagement Type',
      type: 'options',
      required: false,
      default: 'NOTE',
      description: 'Type of engagement',
      options: [
        { name: 'Note', value: 'NOTE' },
        { name: 'Task', value: 'TASK' },
        { name: 'Meeting', value: 'MEETING' },
        { name: 'Call', value: 'CALL' },
        { name: 'Email', value: 'EMAIL' }
      ]
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
      description: 'The processed HubSpot data'
    }
  ],
  credentials: ['hubspotApi', 'hubspotOAuth2Api', 'hubspotAppToken'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Contact',
      description: 'Create a new contact in HubSpot',
      workflow: {
        nodes: [
          {
            name: 'HubSpot',
            type: 'n8n-nodes-base.hubspot',
            parameters: {
              resource: 'contact',
              operation: 'upsert',
              email: 'john.doe@example.com',
              firstName: 'John',
              lastName: 'Doe',
              phone: '+1-555-0123',
              companyName: 'Example Corp'
            }
          }
        ]
      }
    },
    {
      name: 'Create Company',
      description: 'Create a new company in HubSpot',
      workflow: {
        nodes: [
          {
            name: 'HubSpot',
            type: 'n8n-nodes-base.hubspot',
            parameters: {
              resource: 'company',
              operation: 'create',
              companyName: 'Acme Corporation',
              website: 'https://acme.com',
              domain: 'acme.com',
              description: 'Leading technology company'
            }
          }
        ]
      }
    },
    {
      name: 'Create Deal',
      description: 'Create a new deal in HubSpot',
      workflow: {
        nodes: [
          {
            name: 'HubSpot',
            type: 'n8n-nodes-base.hubspot',
            parameters: {
              resource: 'deal',
              operation: 'create',
              dealName: 'Enterprise Software License',
              dealAmount: 50000,
              dealStage: 'appointmentscheduled',
              pipeline: 'default',
              closeDate: '2024-12-31'
            }
          }
        ]
      }
    },
    {
      name: 'Search Contacts',
      description: 'Search for contacts matching criteria',
      workflow: {
        nodes: [
          {
            name: 'HubSpot',
            type: 'n8n-nodes-base.hubspot',
            parameters: {
              resource: 'contact',
              operation: 'search',
              searchQuery: 'email:*@example.com',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Create Support Ticket',
      description: 'Create a support ticket in HubSpot',
      workflow: {
        nodes: [
          {
            name: 'HubSpot',
            type: 'n8n-nodes-base.hubspot',
            parameters: {
              resource: 'ticket',
              operation: 'create',
              subject: 'Product Support Request',
              description: 'Customer needs help with product configuration',
              priority: 'MEDIUM',
              status: 'OPEN',
              category: 'SUPPORT_REQUEST'
            }
          }
        ]
      }
    },
    {
      name: 'Submit Form Data',
      description: 'Submit data to a HubSpot form',
      workflow: {
        nodes: [
          {
            name: 'HubSpot',
            type: 'n8n-nodes-base.hubspot',
            parameters: {
              resource: 'form',
              operation: 'submitData',
              formId: 'abc123-def456-ghi789',
              formData: JSON.stringify({
                email: 'prospect@example.com',
                firstname: 'Jane',
                lastname: 'Smith',
                company: 'Smith Industries'
              })
            }
          }
        ]
      }
    }
  ]
};

export const hubspotTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hubspotTrigger',
  displayName: 'HubSpot Trigger',
  description: 'Use the HubSpot Trigger node to respond to events in HubSpot and integrate HubSpot with other applications. n8n has built-in support for a wide range of HubSpot events, including contact, company, deal, and ticket changes.',
  category: 'Sales & CRM',
  subcategory: 'CRM',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['contact.creation'],
      description: 'The events to trigger on',
      options: [
        // Company events
        { name: 'Company Created', value: 'company.creation', description: 'Triggered when a company is created' },
        { name: 'Company Deleted', value: 'company.deletion', description: 'Triggered when a company is deleted' },
        { name: 'Company Property Changed', value: 'company.propertyChange', description: 'Triggered when a company property changes' },
        // Contact events
        { name: 'Contact Created', value: 'contact.creation', description: 'Triggered when a contact is created' },
        { name: 'Contact Deleted', value: 'contact.deletion', description: 'Triggered when a contact is deleted' },
        { name: 'Contact Privacy Deleted', value: 'contact.privacyDeletion', description: 'Triggered when a contact is privacy deleted' },
        { name: 'Contact Property Changed', value: 'contact.propertyChange', description: 'Triggered when a contact property changes' },
        // Conversation events
        { name: 'Conversation Created', value: 'conversation.creation', description: 'Triggered when a conversation is created' },
        { name: 'Conversation Deleted', value: 'conversation.deletion', description: 'Triggered when a conversation is deleted' },
        { name: 'Conversation New Message', value: 'conversation.newMessage', description: 'Triggered when a new message is added to a conversation' },
        { name: 'Conversation Privacy Deletion', value: 'conversation.privacyDeletion', description: 'Triggered when a conversation is privacy deleted' },
        { name: 'Conversation Property Changed', value: 'conversation.propertyChange', description: 'Triggered when a conversation property changes' },
        // Deal events
        { name: 'Deal Created', value: 'deal.creation', description: 'Triggered when a deal is created' },
        { name: 'Deal Deleted', value: 'deal.deletion', description: 'Triggered when a deal is deleted' },
        { name: 'Deal Property Changed', value: 'deal.propertyChange', description: 'Triggered when a deal property changes' },
        // Ticket events
        { name: 'Ticket Created', value: 'ticket.creation', description: 'Triggered when a ticket is created' },
        { name: 'Ticket Deleted', value: 'ticket.deletion', description: 'Triggered when a ticket is deleted' },
        { name: 'Ticket Property Changed', value: 'ticket.propertyChange', description: 'Triggered when a ticket property changes' }
      ]
    },
    {
      name: 'propertyName',
      displayName: 'Property Name',
      type: 'string',
      required: false,
      default: '',
      description: 'For property change events, specify the property name to watch (optional - leave empty to watch all properties)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when HubSpot events occur'
    }
  ],
  credentials: ['hubspotDeveloperApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Contacts',
      description: 'Trigger workflow when new contacts are created',
      workflow: {
        nodes: [
          {
            name: 'HubSpot Trigger',
            type: 'n8n-nodes-base.hubspotTrigger',
            parameters: {
              events: ['contact.creation']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Deal Changes',
      description: 'Trigger when deals are created or properties change',
      workflow: {
        nodes: [
          {
            name: 'HubSpot Trigger',
            type: 'n8n-nodes-base.hubspotTrigger',
            parameters: {
              events: ['deal.creation', 'deal.propertyChange']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Company Creation',
      description: 'Trigger when new companies are created',
      workflow: {
        nodes: [
          {
            name: 'HubSpot Trigger',
            type: 'n8n-nodes-base.hubspotTrigger',
            parameters: {
              events: ['company.creation']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Support Tickets',
      description: 'Trigger when new support tickets are created',
      workflow: {
        nodes: [
          {
            name: 'HubSpot Trigger',
            type: 'n8n-nodes-base.hubspotTrigger',
            parameters: {
              events: ['ticket.creation']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Email Property Changes',
      description: 'Trigger when contact email property changes',
      workflow: {
        nodes: [
          {
            name: 'HubSpot Trigger',
            type: 'n8n-nodes-base.hubspotTrigger',
            parameters: {
              events: ['contact.propertyChange'],
              propertyName: 'email'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const hubspotNodes: NodeTypeInfo[] = [hubspotNode, hubspotTriggerNode];

// Export individual actions for the regular HubSpot node
export const hubspotActions = [
  // Contact actions
  'create_update_contact',
  'delete_contact',
  'get_contact',
  'get_all_contacts',
  'get_recent_contacts',
  'search_contacts',
  // Contact List actions
  'add_contact_to_list',
  'remove_contact_from_list',
  // Company actions
  'create_company',
  'delete_company',
  'get_company',
  'get_all_companies',
  'get_recently_created_companies',
  'get_recently_modified_companies',
  'search_companies_by_domain',
  'update_company',
  // Deal actions
  'create_deal',
  'delete_deal',
  'get_deal',
  'get_all_deals',
  'get_recently_created_deals',
  'get_recently_modified_deals',
  'search_deals',
  'update_deal',
  // Engagement actions
  'create_engagement',
  'delete_engagement',
  'get_engagement',
  'get_all_engagements',
  // Form actions
  'get_form_fields',
  'submit_form_data',
  // Ticket actions
  'create_ticket',
  'delete_ticket',
  'get_ticket',
  'get_all_tickets',
  'update_ticket'
];

// Export trigger events
export const hubspotTriggers = [
  'company_created',
  'company_deleted',
  'company_property_changed',
  'contact_created',
  'contact_deleted',
  'contact_privacy_deleted',
  'contact_property_changed',
  'conversation_created',
  'conversation_deleted',
  'conversation_new_message',
  'conversation_privacy_deletion',
  'conversation_property_changed',
  'deal_created',
  'deal_deleted',
  'deal_property_changed',
  'ticket_created',
  'ticket_deleted',
  'ticket_property_changed'
];