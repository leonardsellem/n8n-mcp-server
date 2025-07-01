/**
 * # Pipedrive
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Sales & Marketing
 * 
 * ## Description
 * 
 * Use the Pipedrive node to automate work in Pipedrive and integrate Pipedrive with other applications. 
 * n8n has built-in support for a wide range of Pipedrive features, including creating, updating, 
 * deleting, and getting activity, files, notes, organizations, and leads. Pipedrive specializes in 
 * sales pipeline management, lead tracking, and deal automation for sales teams.
 * 
 * ## Key Features
 * 
 * - **Sales Pipeline Management**: Visual pipeline tracking and deal progression
 * - **Lead Management**: Comprehensive lead capture and qualification workflows
 * - **Deal Management**: Complete deal lifecycle tracking and automation
 * - **Activity Management**: Task scheduling and sales activity coordination
 * - **Contact Management**: Person and organization relationship tracking
 * - **Product Management**: Product catalog and deal association
 * - **File Management**: Document storage and deal attachment system
 * - **Note Management**: Sales notes and communication tracking
 * - **Sales Reporting**: Performance analytics and revenue forecasting
 * - **Pipeline Automation**: Workflow triggers and deal progression rules
 * - **Email Integration**: Email tracking and communication logging
 * - **API Integration Hub**: Connect with marketing, finance, and business tools
 * - **Sales Team Collaboration**: Territory management and team coordination
 * - **Revenue Forecasting**: Sales prediction and quota management
 * - **Customer Lifecycle Management**: End-to-end customer journey tracking
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Credentials
 * 
 * Refer to [Pipedrive credentials](../../credentials/pipedrive/) for guidance on setting up authentication.
 * Supports API token authentication for secure access to Pipedrive data.
 * 
 * ## Use Cases
 * 
 * - **Sales Pipeline Management**: Visual deal tracking and revenue forecasting
 * - **Lead Management**: Lead capture, qualification, and conversion automation
 * - **Deal Automation**: Deal progression workflows and milestone tracking
 * - **Activity Management**: Sales task scheduling and follow-up automation
 * - **Contact Management**: Customer and prospect relationship tracking
 * - **Revenue Forecasting**: Sales prediction and quota management
 * - **Team Collaboration**: Sales team coordination and territory management
 * - **Customer Onboarding**: New customer setup and implementation tracking
 * - **Reporting and Analytics**: Sales performance and business intelligence
 * - **Email Integration**: Communication tracking and engagement monitoring
 * - **Document Management**: Proposal and contract organization
 * - **Product Management**: Product catalog and deal configuration
 * - **Competitive Analysis**: Win/loss tracking and market intelligence
 * - **Customer Success**: Account management and expansion tracking
 * - **Mobile Sales**: Field sales and remote team coordination
 * 
 * ## Integration Patterns
 * 
 * ### Marketing Automation Integration
 * - **Lead Hand-off**: Seamless marketing to sales lead transfer
 * - **Campaign Attribution**: Track marketing source and campaign effectiveness
 * - **Lead Scoring**: Automated qualification and priority assignment
 * - **Nurturing Coordination**: Align marketing and sales communication
 * 
 * ### Customer Success Integration
 * - **Onboarding Tracking**: Monitor new customer implementation progress
 * - **Expansion Opportunities**: Identify upsell and cross-sell potential
 * - **Renewal Management**: Track contract renewals and negotiations
 * - **Health Scoring**: Customer satisfaction and retention monitoring
 * 
 * ### Finance and Operations Integration
 * - **Revenue Recognition**: Align sales and financial reporting
 * - **Quote-to-Cash**: Streamline pricing to payment processes
 * - **Forecasting**: Combine sales and financial planning
 * - **Commission Tracking**: Sales compensation and performance measurement
 * 
 * ### Communication Platform Integration
 * - **Email Sync**: Automatic email tracking and logging
 * - **Calendar Integration**: Meeting and appointment coordination
 * - **Phone Integration**: Call logging and communication tracking
 * - **Video Conferencing**: Meeting scheduling and follow-up automation
 * 
 * ## Sales Process Automation
 * 
 * - **Deal Stage Progression**: Automated workflow triggers and notifications
 * - **Activity Automation**: Follow-up reminders and task creation
 * - **Proposal Generation**: Automated document creation and delivery
 * - **Approval Workflows**: Deal approval and escalation processes
 * - **Territory Management**: Lead routing and assignment automation
 * - **Performance Tracking**: Sales metrics and KPI monitoring
 * - **Integration Automation**: Cross-platform data synchronization
 */

import { NodeTypeInfo } from '../../node-types.js';

export const pipedriveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pipedrive',
  displayName: 'Pipedrive',
  description: 'Integrate with Pipedrive CRM platform. Manage deals, leads, activities, and sales pipeline.',
  category: 'Action Nodes',
  subcategory: 'Sales & Marketing',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'deal',
      description: 'The resource to operate on',
      options: [
        {
          name: 'Activity',
          value: 'activity',
          description: 'Operations on activities'
        },
        {
          name: 'Deal',
          value: 'deal',
          description: 'Operations on deals'
        },
        {
          name: 'Deal Activity',
          value: 'dealActivity',
          description: 'Operations on deal activities'
        },
        {
          name: 'Deal Product',
          value: 'dealProduct',
          description: 'Operations on deal products'
        },
        {
          name: 'File',
          value: 'file',
          description: 'Operations on files'
        },
        {
          name: 'Lead',
          value: 'lead',
          description: 'Operations on leads'
        },
        {
          name: 'Note',
          value: 'note',
          description: 'Operations on notes'
        },
        {
          name: 'Organization',
          value: 'organization',
          description: 'Operations on organizations'
        },
        {
          name: 'Person',
          value: 'person',
          description: 'Operations on persons'
        },
        {
          name: 'Product',
          value: 'product',
          description: 'Operations on products'
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
      name: 'pipedriveApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Pipedrive'
  },

  aliases: ['pipedrive', 'crm', 'sales pipeline', 'deal management', 'lead management'],
  
  examples: [
    {
      name: 'Create Deal',
      description: 'Create a new sales deal in Pipedrive',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'deal',
              operation: 'create',
              title: 'New Enterprise Deal',
              value: 50000,
              currency: 'USD',
              personId: '{{$json.personId}}',
              orgId: '{{$json.orgId}}'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Leads',
      description: 'Retrieve all leads for pipeline analysis',
      workflow: {
        nodes: [
          {
            name: 'Pipedrive',
            type: 'n8n-nodes-base.pipedrive',
            parameters: {
              resource: 'lead',
              operation: 'getAll',
              returnAll: false,
              limit: 100
            }
          }
        ]
      }
    },
    {
      name: 'Create Activity',
      description: 'Schedule a follow-up call activity',
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
              dealId: '{{$json.dealId}}',
              dueDate: '2024-02-15',
              dueTime: '14:00'
            }
          }
        ]
      }
    }
  ]
};

export default pipedriveNode;
