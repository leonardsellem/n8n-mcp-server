/**
 * # WhatsApp Business Cloud
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Communication & Messaging
 * 
 * ## Description
 * 
 * Use the WhatsApp Business Cloud node to automate work in WhatsApp Business and integrate 
 * WhatsApp Business with other applications. n8n has built-in support for a wide range of 
 * WhatsApp Business features, including sending messages, uploading, downloading, and deleting media.
 * 
 * ## Key Features
 * 
 * - **Message Operations**: Send messages and templates with rich formatting
 * - **Interactive Messaging**: Send and wait for responses with custom forms
 * - **Media Management**: Upload, download, and delete media files
 * - **Template Support**: Use pre-approved WhatsApp business message templates
 * - **Response Handling**: Advanced form-based response collection
 * - **AI Integration**: Build AI-powered chatbots with memory
 * - **Approval Workflows**: Create approval processes within WhatsApp
 * - **Custom Forms**: Build interactive forms for data collection
 * - **Automated Responses**: Set up automated customer service workflows
 * - **Multi-Media Support**: Handle text, voice, images, and PDFs
 * - **Business Integration**: Connect with CRM and business systems
 * - **Customer Support**: Automate customer service interactions
 * - **Notification System**: Send automated business notifications
 * - **Lead Generation**: Capture leads through interactive forms
 * - **Order Management**: Handle orders and transactions through chat
 * 
 * ## Credentials
 * 
 * Refer to [WhatsApp Business Cloud credentials](../../credentials/whatsapp/) for guidance 
 * on setting up authentication. Requires WhatsApp Business API access and proper webhook configuration.
 * 
 * ## Operations
 * 
 * ### Message Operations
 * 
 * #### Send Message
 * - **Direct Messaging**: Send text messages, media, and rich content
 *   - Customer service and support communications
 *   - Order confirmations and shipping updates
 *   - Marketing campaigns and promotions
 *   - Appointment reminders and scheduling
 *   - Product information and catalogs
 *   - Payment confirmations and invoices
 *   - Welcome messages and onboarding
 *   - Survey and feedback collection
 *   - Event invitations and updates
 *   - Emergency notifications and alerts
 *   - Educational content and tutorials
 *   - Community engagement and updates
 * 
 * #### Send and Wait for Response
 * - **Interactive Messaging**: Send messages and pause workflow for user response
 *   - Customer approval processes and confirmations
 *   - Lead qualification and data collection
 *   - Service request handling and triage
 *   - Product configuration and customization
 *   - Appointment booking and scheduling
 *   - Feedback collection and surveys
 *   - Order placement and modification
 *   - Support ticket creation and updates
 *   - User onboarding and registration
 *   - Payment authorization and verification
 *   - Document submission and verification
 *   - Complaint resolution and follow-up
 * 
 * **Response Types:**
 * 
 * ##### Approval Response
 * - **Binary Decision Making**: Present approval/disapproval options
 *   - Purchase order approvals and procurement
 *   - Expense report approvals and finance
 *   - Time-off requests and HR processes
 *   - Content publication and marketing
 *   - Policy compliance and legal reviews
 *   - Budget approvals and financial controls
 *   - Project milestone approvals
 *   - Quality assurance and testing sign-offs
 *   - Contract reviews and negotiations
 *   - Vendor approvals and partnerships
 *   - Security access requests and permissions
 *   - Change management and IT approvals
 * 
 * ##### Free Text Response
 * - **Open-Ended Data Collection**: Collect detailed text responses
 *   - Customer feedback and testimonials
 *   - Support ticket descriptions and issues
 *   - Product reviews and ratings
 *   - Service improvement suggestions
 *   - Bug reports and technical issues
 *   - Feature requests and enhancements
 *   - Personal information and preferences
 *   - Address and contact details
 *   - Special instructions and requirements
 *   - Complaint details and resolution
 *   - Custom requirements and specifications
 *   - Open-ended survey responses
 * 
 * ##### Custom Form Response
 * - **Structured Data Collection**: Build custom forms with multiple field types
 *   - Lead generation and qualification forms
 *   - Customer registration and onboarding
 *   - Service request forms and ticketing
 *   - Product configuration and ordering
 *   - Event registration and RSVP
 *   - Survey and research questionnaires
 *   - Job application and recruitment
 *   - Insurance claim forms and documentation
 *   - Medical appointment scheduling
 *   - Financial application and KYC
 *   - Real estate inquiry and viewing requests
 *   - Educational enrollment and admissions
 * 
 * **Response Customization Options:**
 * - **Limit Wait Time**: Set automatic timeout for responses
 * - **Custom Button Labels**: Personalize action button text
 * - **Form Titles and Descriptions**: Brand and customize form appearance
 * - **n8n Attribution**: Control workflow attribution display
 * 
 * #### Send Template
 * - **Pre-Approved Messaging**: Use WhatsApp Business approved message templates
 *   - Transactional notifications and confirmations
 *   - Appointment reminders and scheduling
 *   - Shipping and delivery notifications
 *   - Payment confirmations and receipts
 *   - Account security and verification
 *   - Service disruption notifications
 *   - Policy updates and legal notices
 *   - Promotional campaigns and offers
 *   - Event announcements and invitations
 *   - Survey invitations and feedback requests
 *   - Welcome messages and onboarding
 *   - Subscription renewals and billing
 * 
 * ### Media Operations
 * 
 * #### Upload Media
 * - **Content Management**: Upload media files for messaging
 *   - Product images and catalogs
 *   - Marketing materials and brochures
 *   - Instructional videos and tutorials
 *   - Document templates and forms
 *   - Audio messages and voice notes
 *   - Presentation slides and materials
 *   - Infographics and visual content
 *   - Certificate and achievement badges
 *   - Brand assets and logos
 *   - Event photos and documentation
 *   - Technical diagrams and schematics
 *   - User-generated content compilation
 * 
 * #### Download Media
 * - **Content Retrieval**: Download media files from conversations
 *   - Customer-submitted documents and forms
 *   - Product photos and specifications
 *   - Support ticket attachments and evidence
 *   - User-generated content and reviews
 *   - Voice messages and audio recordings
 *   - Video testimonials and feedback
 *   - Receipt and invoice documentation
 *   - Identification and verification documents
 *   - Technical diagrams and sketches
 *   - Compliance documentation and records
 *   - Research materials and data collection
 *   - Quality assurance and inspection photos
 * 
 * #### Delete Media
 * - **Content Cleanup**: Remove media files from storage
 *   - Privacy compliance and data protection
 *   - Storage optimization and cost management
 *   - Content lifecycle management
 *   - Outdated material removal and updates
 *   - Security compliance and data retention
 *   - Workflow cleanup and maintenance
 *   - Legal compliance and record management
 *   - Performance optimization and efficiency
 *   - Brand consistency and content curation
 *   - Quality control and content moderation
 *   - User request compliance and deletion
 *   - Archive management and organization
 * 
 * ## Use Cases
 * 
 * - **Customer Service**: Automated support and help desk operations
 * - **Sales Automation**: Lead generation and qualification workflows
 * - **Marketing Campaigns**: Personalized promotional messaging
 * - **Order Management**: E-commerce order processing and updates
 * - **Appointment Booking**: Healthcare and service appointment scheduling
 * - **Educational Delivery**: Course content and learning management
 * - **Survey and Research**: Data collection and market research
 * - **Event Management**: Registration and attendee communication
 * - **Payment Processing**: Transaction confirmations and billing
 * - **HR Automation**: Employee onboarding and communication
 * - **Compliance Management**: Document collection and verification
 * - **Property Management**: Tenant communication and maintenance
 * - **Healthcare Communication**: Patient engagement and care coordination
 * - **Financial Services**: Account management and transaction alerts
 * - **Travel and Hospitality**: Booking confirmations and guest services
 * 
 * ## Integration Patterns
 * 
 * ### AI-Powered Chatbots
 * - **Natural Language Processing**: Understand and respond to customer queries
 * - **Context Awareness**: Maintain conversation history and context
 * - **Multi-Modal Support**: Handle text, voice, images, and documents
 * - **Learning Capabilities**: Improve responses through interaction data
 * 
 * ### CRM Integration
 * - **Lead Management**: Capture and qualify leads through WhatsApp
 * - **Customer Data Sync**: Update customer records with conversation data
 * - **Sales Pipeline**: Move prospects through sales stages via messaging
 * - **Support Ticketing**: Create and update support tickets from conversations
 * 
 * ### E-Commerce Automation
 * - **Product Catalogs**: Share product information and media
 * - **Order Processing**: Handle orders from inquiry to fulfillment
 * - **Payment Integration**: Process payments and send confirmations
 * - **Inventory Updates**: Notify customers of stock changes and availability
 * 
 * ### Business Process Automation
 * - **Approval Workflows**: Route requests through approval chains
 * - **Document Collection**: Gather required documents and forms
 * - **Notification Systems**: Send automated business notifications
 * - **Data Collection**: Collect structured data through forms and surveys
 */

import { NodeTypeInfo } from '../../node-types.js';

export const whatsappNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.whatsapp',
  displayName: 'WhatsApp Business Cloud',
  description: 'Integrate with WhatsApp Business Cloud API. Send messages, handle responses, and manage media.',
  category: 'Action Nodes',
  subcategory: 'Communication & Messaging',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        {
          name: 'Message',
          value: 'message',
          description: 'Operations on messages'
        },
        {
          name: 'Media',
          value: 'media',
          description: 'Operations on media files'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['message']
        }
      },
      options: [
        {
          name: 'Send',
          value: 'send',
          description: 'Send a message'
        },
        {
          name: 'Send and Wait for Response',
          value: 'sendAndWait',
          description: 'Send a message and wait for a response'
        },
        {
          name: 'Send Template',
          value: 'sendTemplate',
          description: 'Send a pre-approved template message'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'upload',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['media']
        }
      },
      options: [
        {
          name: 'Upload',
          value: 'upload',
          description: 'Upload media'
        },
        {
          name: 'Download',
          value: 'download',
          description: 'Download media'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete media'
        }
      ]
    },
    {
      name: 'responseType',
      displayName: 'Response Type',
      type: 'options',
      required: true,
      default: 'approval',
      description: 'Type of response to wait for',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['sendAndWait']
        }
      },
      options: [
        {
          name: 'Approval',
          value: 'approval',
          description: 'Wait for approval/disapproval'
        },
        {
          name: 'Free Text',
          value: 'freeText',
          description: 'Wait for free text response'
        },
        {
          name: 'Custom Form',
          value: 'customForm',
          description: 'Wait for custom form submission'
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
      name: 'whatsAppApi',
      required: true
    }
  ],

  version: [1],
  defaults: {
    name: 'WhatsApp Business Cloud'
  },

  aliases: ['whatsapp', 'whatsapp business', 'messaging', 'chat', 'business messaging'],
  
  examples: [
    {
      name: 'Send Message',
      description: 'Send a text message to a WhatsApp contact',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Business Cloud',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'message',
              operation: 'send',
              to: '+1234567890',
              message: 'Hello! This is an automated message from n8n.'
            }
          }
        ]
      }
    },
    {
      name: 'Send and Wait for Approval',
      description: 'Send a message and wait for approval response',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Business Cloud',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'message',
              operation: 'sendAndWait',
              responseType: 'approval',
              to: '+1234567890',
              message: 'Please approve this request',
              approvalOptions: {
                approveButtonLabel: 'Approve',
                disapproveButtonLabel: 'Reject'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Custom Form Response',
      description: 'Send a message with custom form for data collection',
      workflow: {
        nodes: [
          {
            name: 'WhatsApp Business Cloud',
            type: 'n8n-nodes-base.whatsapp',
            parameters: {
              resource: 'message',
              operation: 'sendAndWait',
              responseType: 'customForm',
              to: '+1234567890',
              message: 'Please fill out this form',
              formElements: [
                {
                  fieldType: 'text',
                  fieldLabel: 'Full Name',
                  fieldRequired: true
                },
                {
                  fieldType: 'email',
                  fieldLabel: 'Email Address',
                  fieldRequired: true
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

export default whatsappNode;
