/**
 * # Salesforce
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Sales & Marketing
 * 
 * ## Description
 * 
 * Use the Salesforce node to automate work in Salesforce, and integrate Salesforce with other applications. 
 * n8n has built-in support for a wide range of Salesforce features, including creating, updating, deleting, 
 * and getting accounts, attachments, cases, and leads, as well as uploading documents.
 * 
 * ## Key Features
 * 
 * - **Complete CRM Management**: Full lifecycle management for accounts, contacts, leads, and opportunities
 * - **Advanced Case Management**: Comprehensive customer support ticket and case tracking
 * - **Task & Activity Management**: Track and manage all sales activities and tasks
 * - **Custom Object Support**: Work with custom Salesforce objects and fields
 * - **Document Management**: Upload and manage documents and attachments
 * - **Flow Integration**: Invoke Salesforce flows for complex business processes
 * - **SOQL Search**: Execute powerful SOQL queries for data retrieval
 * - **Upsert Operations**: Create or update records with intelligent conflict resolution
 * - **Metadata Operations**: Get comprehensive metadata for all Salesforce objects
 * - **Campaign Management**: Add leads and contacts to marketing campaigns
 * - **Note Management**: Add notes to accounts, contacts, leads, and opportunities
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Custom Field Support**: Full support for Salesforce custom fields and objects
 * 
 * ## Credentials
 * 
 * Refer to [Salesforce credentials](../../credentials/salesforce/) for guidance on setting up authentication.
 * Uses Salesforce OAuth or API tokens for secure access to your Salesforce organization.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Account Operations
 * - **Create**: Add new accounts to your Salesforce organization
 * - **Update**: Modify existing account information and relationships
 * - **Upsert**: Create new accounts or update existing ones based on external ID
 * - **Get**: Retrieve specific account information by ID
 * - **Get All**: Retrieve all accounts with filtering and pagination
 * - **Delete**: Remove accounts from your Salesforce organization
 * - **Add Note**: Add notes and comments to account records
 * - **Get Metadata**: Returns comprehensive overview of account metadata structure
 * 
 * ### Contact Operations
 * - **Create**: Add new contacts to your Salesforce database
 * - **Update**: Modify existing contact information and relationships
 * - **Upsert**: Create new contacts or update existing ones based on external ID
 * - **Get**: Retrieve specific contact information by ID
 * - **Get All**: Retrieve all contacts with filtering and pagination
 * - **Delete**: Remove contacts from your Salesforce organization
 * - **Add Note**: Add notes and comments to contact records
 * - **Add to Campaign**: Add contacts to marketing campaigns for targeted outreach
 * - **Get Metadata**: Returns comprehensive overview of contact metadata structure
 * 
 * ### Lead Operations
 * - **Create**: Add new leads to your sales pipeline
 * - **Update**: Modify existing lead information and status
 * - **Upsert**: Create new leads or update existing ones based on external ID
 * - **Get**: Retrieve specific lead information by ID
 * - **Get All**: Retrieve all leads with filtering and pagination
 * - **Delete**: Remove leads from your Salesforce organization
 * - **Add Note**: Add notes and comments to lead records
 * - **Add to Campaign**: Add leads to marketing campaigns for nurturing
 * - **Get Metadata**: Returns comprehensive overview of lead metadata structure
 * 
 * ### Opportunity Operations
 * - **Create**: Add new opportunities to your sales pipeline
 * - **Update**: Modify opportunity details, stages, and amounts
 * - **Upsert**: Create new opportunities or update existing ones based on external ID
 * - **Get**: Retrieve specific opportunity information by ID
 * - **Get All**: Retrieve all opportunities with filtering and pagination
 * - **Delete**: Remove opportunities from your sales pipeline
 * - **Add Note**: Add notes and comments to opportunity records
 * - **Get Metadata**: Returns comprehensive overview of opportunity metadata structure
 * 
 * ### Case Operations
 * - **Create**: Create new customer support cases
 * - **Update**: Modify case status, priority, and assignment
 * - **Get**: Retrieve specific case information by ID
 * - **Get All**: Retrieve all cases with filtering and pagination
 * - **Delete**: Remove cases from your Salesforce organization
 * - **Add Comment**: Add comments and updates to case records
 * - **Get Metadata**: Returns comprehensive overview of case metadata structure
 * 
 * ### Task Operations
 * - **Create**: Create new tasks and activities
 * - **Update**: Modify task details, status, and assignments
 * - **Get**: Retrieve specific task information by ID
 * - **Get All**: Retrieve all tasks with filtering and pagination
 * - **Delete**: Remove tasks from your Salesforce organization
 * - **Get Metadata**: Returns comprehensive overview of task metadata structure
 * 
 * ### Custom Object Operations
 * - **Create**: Create records in custom Salesforce objects
 * - **Update**: Modify existing custom object records
 * - **Upsert**: Create or update custom object records based on external ID
 * - **Get**: Retrieve specific custom object records by ID
 * - **Get All**: Retrieve all records from custom objects with filtering
 * - **Delete**: Remove records from custom objects
 * 
 * ### Attachment Operations
 * - **Create**: Upload new attachments to Salesforce records
 * - **Update**: Modify attachment metadata and properties
 * - **Get**: Retrieve specific attachment information by ID
 * - **Get All**: Retrieve all attachments with filtering and pagination
 * - **Delete**: Remove attachments from Salesforce records
 * - **Get Metadata**: Returns comprehensive overview of attachment metadata structure
 * 
 * ### Document Operations
 * - **Upload**: Upload documents to Salesforce document library
 * 
 * ### Flow Operations
 * - **Get All**: Retrieve all available Salesforce flows
 * - **Invoke**: Execute Salesforce flows with input parameters
 * 
 * ### Search Operations
 * - **SOQL Query**: Execute SOQL queries that return all results in a single response
 * 
 * ### User Operations
 * - **Get**: Retrieve specific user information by ID
 * - **Get All**: Retrieve all users in your Salesforce organization
 * 
 * ## Working with Custom Fields
 * 
 * To add custom fields to your request:
 * 1. Select **Additional Fields** > **Add Field**
 * 2. In the dropdown, select **Custom Fields**
 * 3. Find and add your custom fields
 * 
 * The Salesforce node provides full support for custom fields and objects, allowing you to work 
 * with your organization's specific data structure and business requirements.
 * 
 * ## Related Resources
 * 
 * Refer to Salesforce's API documentation for more information about the service.
 * n8n provides trigger nodes for Salesforce to receive webhook notifications about record changes.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Salesforce API directly with your Salesforce credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include API limits, custom field mapping, and permission management.
 * 
 * ## Use Cases
 * 
 * - **Lead Management & Conversion**: Automate lead capture, qualification, and conversion processes
 * - **Sales Pipeline Automation**: Automate opportunity progression and sales team notifications
 * - **Customer Support Automation**: Automate case creation, routing, and resolution workflows
 * - **Data Synchronization**: Keep Salesforce data in sync with other business systems
 * - **Marketing Campaign Management**: Automate campaign member management and tracking
 * - **Customer Onboarding**: Automate account setup and onboarding processes
 * - **Activity Tracking**: Log all customer interactions and touchpoints automatically
 * - **Report Automation**: Generate and distribute custom reports and dashboards
 * - **Territory Management**: Automate lead and account assignment based on territories
 * - **Approval Processes**: Trigger and manage approval workflows for various business processes
 * - **Integration Workflows**: Connect Salesforce with ERP, marketing, and support systems
 * - **Data Quality Management**: Automate data cleansing and enrichment processes
 * - **Event Management**: Track and manage events, webinars, and customer meetings
 * - **Forecast Management**: Automate sales forecasting and pipeline reporting
 * - **Compliance Tracking**: Ensure compliance with industry regulations and audit trails
 * - **Partner Management**: Manage partner relationships and channel sales processes
 * - **Customer Success**: Monitor customer health and trigger intervention workflows
 * - **Quote & Proposal Management**: Automate quote generation and approval processes
 */

import { NodeTypeInfo } from '../../node-types.js';

export const salesforceNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.salesforce',
  displayName: 'Salesforce',
  description: 'Manage accounts, contacts, leads, opportunities, and all CRM data in Salesforce.',
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
          name: 'Account',
          value: 'account',
          description: 'Work with accounts'
        },
        {
          name: 'Contact',
          value: 'contact',
          description: 'Work with contacts'
        },
        {
          name: 'Lead',
          value: 'lead',
          description: 'Work with leads'
        },
        {
          name: 'Opportunity',
          value: 'opportunity',
          description: 'Work with opportunities'
        },
        {
          name: 'Case',
          value: 'case',
          description: 'Work with cases'
        },
        {
          name: 'Task',
          value: 'task',
          description: 'Work with tasks'
        },
        {
          name: 'Custom Object',
          value: 'customObject',
          description: 'Work with custom objects'
        },
        {
          name: 'Attachment',
          value: 'attachment',
          description: 'Work with attachments'
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
          name: 'Upsert',
          value: 'upsert',
          description: 'Create or update based on external ID'
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
      name: 'salesforceOAuth2',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Salesforce'
  },

  aliases: ['crm', 'sales', 'leads', 'enterprise'],
  
  examples: [
    {
      name: 'Create Lead',
      description: 'Create a new lead in Salesforce',
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
              company: 'Example Corp'
            }
          }
        ]
      }
    }
  ]
};

export default salesforceNode;
