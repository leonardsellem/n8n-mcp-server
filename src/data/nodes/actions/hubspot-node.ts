/**
 * # HubSpot
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Sales & Marketing
 * 
 * ## Description
 * 
 * Use the HubSpot node to automate work in HubSpot, and integrate HubSpot with other applications. 
 * n8n has built-in support for a wide range of HubSpot features, including creating, updating, deleting, 
 * and getting contacts, deals, lists, engagements and companies.
 * 
 * ## Key Features
 * 
 * - **Complete CRM Management**: Full contact, company, and deal lifecycle management
 * - **Advanced Contact Operations**: Create, update, delete, search, and manage contact lists
 * - **Sales Pipeline Management**: Complete deal tracking from creation to closure
 * - **Company & Account Management**: Comprehensive company data and relationship tracking
 * - **Engagement Tracking**: Monitor and manage all customer interactions and touchpoints
 * - **Form Integration**: Capture leads directly from HubSpot forms and custom forms
 * - **Ticket Management**: Full customer support ticket lifecycle management
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Recent Activity Tracking**: Get recently created or modified records efficiently
 * - **Advanced Search**: Powerful search capabilities across all HubSpot objects
 * - **List Management**: Add and remove contacts from marketing lists and sequences
 * - **Domain-based Search**: Find companies by domain for lead enrichment
 * 
 * ## Credentials
 * 
 * Refer to [HubSpot credentials](../../credentials/hubspot/) for guidance on setting up authentication.
 * Uses HubSpot API keys or OAuth tokens for secure access to your HubSpot portal.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Contact Operations
 * - **Create/Update**: Create new contacts or update existing ones with upsert functionality
 * - **Delete**: Remove contacts from your HubSpot database
 * - **Get**: Retrieve specific contact information by ID or email
 * - **Get All**: Retrieve all contacts with pagination and filtering options
 * - **Get Recently Created/Updated**: Efficiently sync recent contact changes
 * - **Search**: Advanced contact search with multiple criteria and filters
 * 
 * ### Contact List Operations
 * - **Add Contact to List**: Add contacts to static lists for segmentation and campaigns
 * - **Remove Contact from List**: Remove contacts from specific lists
 * 
 * ### Company Operations
 * - **Create**: Add new companies to your HubSpot database
 * - **Delete**: Remove companies from your database
 * - **Get**: Retrieve specific company information by ID or domain
 * - **Get All**: Retrieve all companies with filtering and pagination
 * - **Get Recently Created**: Sync newly added companies
 * - **Get Recently Modified**: Track company data changes
 * - **Search by Domain**: Find companies using domain names for lead enrichment
 * - **Update**: Modify existing company information and properties
 * 
 * ### Deal Operations
 * - **Create**: Create new deals in your sales pipeline
 * - **Delete**: Remove deals from your pipeline
 * - **Get**: Retrieve specific deal information and associated data
 * - **Get All**: Retrieve all deals with stage and pipeline filtering
 * - **Get Recently Created**: Track new deals entering your pipeline
 * - **Get Recently Modified**: Monitor deal progress and updates
 * - **Search**: Find deals using advanced search criteria
 * - **Update**: Modify deal properties, stages, and associated records
 * 
 * ### Engagement Operations
 * - **Create**: Log new engagements (calls, emails, meetings, tasks)
 * - **Delete**: Remove engagement records
 * - **Get**: Retrieve specific engagement details and metadata
 * - **Get All**: Retrieve all engagements with type and date filtering
 * 
 * ### Form Operations
 * - **Get All Fields**: Retrieve form structure and field definitions
 * - **Submit Data**: Submit form data programmatically for lead capture
 * 
 * ### Ticket Operations
 * - **Create**: Create new support tickets in HubSpot Service Hub
 * - **Delete**: Remove tickets from the system
 * - **Get**: Retrieve specific ticket information and history
 * - **Get All**: Retrieve all tickets with status and priority filtering
 * - **Update**: Modify ticket properties, status, and assignments
 * 
 * ## Related Resources
 * 
 * Refer to HubSpot's API documentation for more information about the service.
 * n8n provides trigger nodes for HubSpot to receive webhook notifications about record changes.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the HubSpot API directly with your HubSpot credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include API rate limiting, property mapping, and association management.
 * 
 * ## Use Cases
 * 
 * - **Lead Generation & Qualification**: Capture, score, and qualify leads automatically
 * - **Sales Pipeline Automation**: Automate deal progression and sales team notifications
 * - **Marketing Automation**: Trigger campaigns based on contact behavior and properties
 * - **Customer Onboarding**: Automate welcome sequences and onboarding workflows
 * - **Support Ticket Management**: Automate ticket creation, routing, and status updates
 * - **Data Synchronization**: Keep HubSpot data in sync with other business systems
 * - **Lead Scoring & Enrichment**: Automatically score and enrich leads with external data
 * - **Event Tracking**: Log website visits, email opens, and other engagement events
 * - **Revenue Operations**: Automate reporting, forecasting, and revenue attribution
 * - **Customer Success**: Monitor customer health and trigger intervention workflows
 * - **E-commerce Integration**: Sync purchase data and customer lifecycle events
 * - **Social Media Integration**: Track social engagement and convert to leads
 */

import { NodeTypeInfo } from '../../node-types.js';

export const hubspotNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.hubspot',
  displayName: 'HubSpot',
  description: 'Manage contacts, companies, deals, and customer relationships in HubSpot CRM.',
  category: 'Action Nodes',
  subcategory: 'Sales & Marketing',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'contact',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Contact',
          value: 'contact',
          description: 'Work with contacts'
        },
        {
          name: 'Company',
          value: 'company',
          description: 'Work with companies'
        },
        {
          name: 'Deal',
          value: 'deal',
          description: 'Work with deals'
        },
        {
          name: 'Engagement',
          value: 'engagement',
          description: 'Work with engagements'
        },
        {
          name: 'Ticket',
          value: 'ticket',
          description: 'Work with tickets'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Operation to perform',
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new record'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an existing record'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a record by ID'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all records'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a record'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search for records'
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
      displayName: 'Output'
    }
  ],

  credentials: [
    {
      name: 'hubspotApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'HubSpot'
  },

  aliases: ['crm', 'sales', 'marketing'],
  
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
              operation: 'create',
              email: 'contact@example.com',
              firstname: 'John',
              lastname: 'Doe'
            }
          }
        ]
      }
    }
  ]
};

export default hubspotNode;
