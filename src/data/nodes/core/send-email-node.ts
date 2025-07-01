/**
 * # Send Email
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Communication
 * 
 * ## Description
 * 
 * The Send Email node sends emails using an SMTP email server. It supports both simple email sending 
 * and advanced scenarios where you can send an email and wait for a response from the recipient.
 * 
 * ## AI Tool Capability
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Node Parameters
 * 
 * ### Operation
 * - **Send**: Send an email message
 * - **Send and Wait for Response**: Send an email and pause workflow execution until user responds
 * 
 * ### Basic Email Configuration
 * - **From Email**: Sender email address (supports format: "Name <email@domain.com>")
 * - **To Email**: Recipient email address(es), comma-separated for multiple recipients
 * - **Subject**: Email subject line
 * - **Email Format**: Text, HTML, or Both formats
 * 
 * ### Advanced Options
 * - **CC Email**: Carbon copy recipients
 * - **BCC Email**: Blind carbon copy recipients
 * - **Reply To**: Reply-to email address
 * - **Attachments**: Binary properties to attach as files
 * - **Append n8n Attribution**: Include "sent with n8n" footer
 * - **Ignore SSL Issues**: Skip SSL certificate validation
 * 
 * ## Response Types (Send and Wait for Response)
 * 
 * ### Approval
 * - Present approval/disapproval buttons in email
 * - Customizable button labels and styles
 * - Single approval or approval/disapproval options
 * 
 * ### Free Text
 * - Allow users to submit text responses via form
 * - Customizable form title, description, and button labels
 * 
 * ### Custom Form
 * - Build custom forms with multiple field types
 * - Same form elements as n8n Form trigger
 * - Fully customizable form interface
 * 
 * ## Key Features
 * 
 * - **SMTP compatibility**: Works with any SMTP email server
 * - **Multiple formats**: Send text, HTML, or both email formats
 * - **File attachments**: Attach files from binary data
 * - **Interactive emails**: Send emails that wait for user responses
 * - **Approval workflows**: Build approval processes via email
 * - **Custom forms**: Create complex data collection forms
 * - **Time limits**: Set automatic timeouts for responses
 * - **Rich formatting**: Support for HTML emails with embedded images
 * 
 * ## Use Cases
 * 
 * - Send notification emails to users or administrators
 * - Create approval workflows for business processes
 * - Send reports and analytics via email
 * - Collect feedback through email forms
 * - Automated marketing and communication campaigns
 * - Alert systems for monitoring and error notifications
 * - Document sharing with file attachments
 * 
 * ## Related Resources
 * 
 * Learn more about SMTP credentials and email automation in n8n workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const sendEmailNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sendEmail',
  displayName: 'Send Email',
  description: 'Sends an email using an SMTP email server. Supports both simple email sending and interactive emails that wait for responses.',
  category: 'Core Nodes',
  subcategory: 'Communication',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The operation to perform',
      options: [
        { name: 'Send', value: 'send' },
        { name: 'Send and Wait for Response', value: 'sendAndWait' }
      ]
    },
    {
      name: 'fromEmail',
      displayName: 'From Email',
      type: 'string',
      required: true,
      default: '',
      description: 'Email address to send from. Format: "Name <email@domain.com>"',
      placeholder: 'admin@company.com'
    },
    {
      name: 'toEmail',
      displayName: 'To Email',
      type: 'string',
      required: true,
      default: '',
      description: 'Email address(es) to send to. Comma-separated for multiple recipients',
      placeholder: 'user@company.com, team@company.com'
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      required: true,
      default: '',
      description: 'Subject line of the email',
      placeholder: 'Your subject here'
    },
    {
      name: 'emailFormat',
      displayName: 'Email Format',
      type: 'options',
      required: true,
      default: 'text',
      description: 'Format to send the email in',
      displayOptions: {
        show: {
          operation: ['send']
        }
      },
      options: [
        { name: 'Text', value: 'text' },
        { name: 'HTML', value: 'html' },
        { name: 'Both', value: 'both' }
      ]
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: true,
      default: '',
      description: 'Content of the email message',
      typeOptions: {
        rows: 5
      }
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
          operation: ['sendAndWait']
        }
      },
      options: [
        { name: 'Approval', value: 'approval' },
        { name: 'Free Text', value: 'freeText' },
        { name: 'Custom Form', value: 'customForm' }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional email options',
      options: [
        {
          name: 'ccEmail',
          displayName: 'CC Email',
          type: 'string',
          default: '',
          description: 'Carbon copy email address(es)'
        },
        {
          name: 'bccEmail',
          displayName: 'BCC Email',
          type: 'string',
          default: '',
          description: 'Blind carbon copy email address(es)'
        },
        {
          name: 'replyTo',
          displayName: 'Reply To',
          type: 'string',
          default: '',
          description: 'Reply-to email address'
        },
        {
          name: 'attachments',
          displayName: 'Attachments',
          type: 'string',
          default: '',
          description: 'Binary properties to attach (comma-separated)'
        },
        {
          name: 'appendAttribution',
          displayName: 'Append n8n Attribution',
          type: 'boolean',
          default: true,
          description: 'Whether to include "sent with n8n" footer'
        },
        {
          name: 'ignoreSSL',
          displayName: 'Ignore SSL Issues',
          type: 'boolean',
          default: false,
          description: 'Ignore SSL certificate validation failures'
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
      displayName: 'Output',
      description: 'Email sending result or user response data'
    }
  ],

  credentials: [
    {
      name: 'smtp',
      required: true
    }
  ],

  regularNode: true,
  
  version: [1, 2, 3],
  defaults: {
    name: 'Send Email'
  },

  aliases: ['email', 'smtp', 'mail'],
  
  examples: [
    {
      name: 'Simple Email',
      description: 'Send a basic text email',
      workflow: {
        nodes: [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.sendEmail',
            parameters: {
              operation: 'send',
              fromEmail: 'sender@company.com',
              toEmail: 'recipient@company.com',
              subject: 'Hello from n8n',
              emailFormat: 'text',
              message: 'This is a test email sent from n8n!'
            }
          }
        ]
      }
    },
    {
      name: 'HTML Email with Attachment',
      description: 'Send an HTML email with file attachment',
      workflow: {
        nodes: [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.sendEmail',
            parameters: {
              operation: 'send',
              fromEmail: 'reports@company.com',
              toEmail: 'team@company.com',
              subject: 'Monthly Report',
              emailFormat: 'html',
              message: '<h1>Monthly Report</h1><p>Please find the attached report.</p>',
              options: {
                attachments: 'report_data'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Approval Email',
      description: 'Send email and wait for approval response',
      workflow: {
        nodes: [
          {
            name: 'Send Email',
            type: 'n8n-nodes-base.sendEmail',
            parameters: {
              operation: 'sendAndWait',
              fromEmail: 'approvals@company.com',
              toEmail: 'manager@company.com',
              subject: 'Approval Required: Expense Report',
              message: 'Please review and approve the expense report.',
              responseType: 'approval'
            }
          }
        ]
      }
    }
  ]
};

export default sendEmailNode;
