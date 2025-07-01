/**
 * # Twilio
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Communication & Messaging
 * 
 * ## Description
 * 
 * Use the Twilio node to automate work in Twilio, and integrate Twilio with other applications. 
 * n8n supports sending MMS/SMS and WhatsApp messages, as well as making phone calls with Twilio.
 * 
 * ## Key Features
 * 
 * - **SMS Messaging**: Send and receive SMS messages globally
 * - **MMS Support**: Send multimedia messages with images, videos, and files
 * - **WhatsApp Integration**: Send WhatsApp Business messages through Twilio
 * - **Voice Calls**: Make automated phone calls with text-to-speech
 * - **International Coverage**: Global reach with local phone numbers
 * - **Two-Factor Authentication**: Implement 2FA and phone verification
 * - **Bulk Messaging**: Send messages to multiple recipients efficiently
 * - **Message Status Tracking**: Track delivery status and read receipts
 * - **Short Codes**: Use short codes for high-volume messaging
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Phone Number Management**: Manage phone numbers and messaging services
 * - **Compliance Features**: Built-in compliance for various regulations and carriers
 * 
 * ## Credentials
 * 
 * Refer to [Twilio credentials](../../credentials/twilio/) for guidance on setting up authentication.
 * Uses Twilio Account SID and Auth Token for secure API access.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### SMS Operations
 * - **Send SMS**: Send text messages to phone numbers worldwide
 *   - Support for long messages with automatic segmentation
 *   - Delivery status tracking and webhooks
 *   - Custom sender IDs and short codes
 *   - Unicode and emoji support
 * - **Send MMS**: Send multimedia messages with attachments
 *   - Images, videos, audio, and document support
 *   - Multiple media attachments per message
 *   - Automatic media optimization and compression
 *   - Fallback to SMS for non-MMS devices
 * - **Send WhatsApp**: Send WhatsApp Business messages
 *   - Rich media support (images, documents, videos)
 *   - Template messages for notifications
 *   - Interactive messages with buttons and lists
 *   - Message status and read receipts
 * 
 * ### Call Operations
 * - **Make Call**: Initiate phone calls with automated messages
 *   - Text-to-speech conversion with multiple voices
 *   - Custom message content and scripts
 *   - Call recording and transcription
 *   - Interactive voice response (IVR) capabilities
 *   - Conference calls and call forwarding
 *   - Call status tracking and analytics
 * 
 * ## Message Types & Features
 * 
 * ### SMS Features
 * - **Global Reach**: Send messages to 180+ countries
 * - **High Delivery Rates**: Carrier-grade infrastructure
 * - **Two-Way Messaging**: Receive and respond to incoming messages
 * - **Message Scheduling**: Schedule messages for future delivery
 * - **Opt-out Management**: Handle STOP/START commands automatically
 * - **Short URLs**: Automatic URL shortening for better deliverability
 * 
 * ### MMS Features
 * - **Rich Media**: Images, GIFs, videos, and audio files
 * - **File Size Limits**: Up to 5MB per media attachment
 * - **Format Support**: JPEG, PNG, GIF, MP4, MP3, PDF, and more
 * - **Automatic Fallback**: Falls back to SMS if MMS not supported
 * - **Media Optimization**: Automatic compression and format conversion
 * 
 * ### WhatsApp Features
 * - **Business API**: Official WhatsApp Business API integration
 * - **Template Messages**: Pre-approved message templates
 * - **Session Messages**: Free-form messages within 24-hour window
 * - **Rich Media**: Images, documents, videos, and audio
 * - **Interactive Elements**: Quick reply buttons and list messages
 * - **Message Status**: Delivered, read, and failed status tracking
 * 
 * ### Voice Features
 * - **Text-to-Speech**: Natural-sounding voice synthesis
 * - **Multiple Languages**: Support for 20+ languages and accents
 * - **Voice Selection**: Male and female voice options
 * - **Call Recording**: Record calls for quality and compliance
 * - **Call Tracking**: Detailed call analytics and reporting
 * - **Interactive Response**: Gather DTMF input from callers
 * 
 * ## Advanced Capabilities
 * 
 * - **Programmable Messaging**: Build complex messaging workflows
 * - **Copilot Integration**: AI-powered messaging assistants
 * - **Phone Number Verification**: Verify phone numbers globally
 * - **Lookup API**: Validate and format phone numbers
 * - **Carrier Information**: Get carrier and phone type data
 * - **Message Insights**: Analytics and reporting on message performance
 * - **Compliance Tools**: Opt-out management and regulatory compliance
 * 
 * ## Related Resources
 * 
 * Refer to [Twilio's documentation](https://www.twilio.com/docs/usage/api) for more information about the service.
 * n8n provides trigger nodes for Twilio to receive incoming messages and call events.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Twilio API directly with your Twilio credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include message delivery, phone number formatting, and compliance requirements.
 * 
 * ## Use Cases
 * 
 * - **Customer Notifications**: Send order confirmations, shipping updates, and alerts
 * - **Two-Factor Authentication**: Implement secure 2FA with SMS verification codes
 * - **Marketing Campaigns**: Send promotional messages and marketing content
 * - **Appointment Reminders**: Automate appointment confirmations and reminders
 * - **Customer Support**: Handle customer inquiries via SMS and WhatsApp
 * - **Emergency Alerts**: Send urgent notifications and emergency communications
 * - **Lead Qualification**: Automate lead follow-up with SMS and phone calls
 * - **Survey Collection**: Gather customer feedback through SMS surveys
 * - **Event Management**: Send event updates and check-in instructions
 * - **E-commerce Integration**: Order status updates and customer service
 * - **Healthcare Communications**: Appointment reminders and health notifications
 * - **Real Estate Follow-up**: Property alerts and client communication
 * - **Educational Notifications**: Class updates and parent-teacher communication
 * - **Financial Alerts**: Account notifications and transaction alerts
 * - **Delivery Tracking**: Package delivery updates and logistics coordination
 * - **Social Media Integration**: Cross-platform messaging and notifications
 * - **CRM Integration**: Sync customer communications with CRM systems
 * - **Workflow Automation**: Trigger actions based on SMS responses
 * - **Multi-channel Communication**: Coordinate SMS, WhatsApp, and voice outreach
 * - **International Messaging**: Global customer communication and support
 * - **Compliance Management**: GDPR, TCPA, and carrier compliance automation
 * - **Analytics and Reporting**: Track message performance and engagement metrics
 * - **A/B Testing**: Test message content and delivery timing
 * - **Customer Journey Automation**: Automated communication sequences
 * - **Crisis Communication**: Mass notifications for emergencies and updates
 */

import { NodeTypeInfo } from '../../node-types.js';

export const twilioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.twilio',
  displayName: 'Twilio',
  description: 'Send SMS, MMS, WhatsApp messages, and make phone calls using Twilio.',
  category: 'Action Nodes',
  subcategory: 'Communication & Messaging',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'sms',
      description: 'Resource to operate on',
      options: [
        {
          name: 'SMS',
          value: 'sms',
          description: 'Send SMS/MMS/WhatsApp messages'
        },
        {
          name: 'Call',
          value: 'call',
          description: 'Make phone calls'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'Operation to perform',
      options: [
        {
          name: 'Send',
          value: 'send',
          description: 'Send a message or make a call'
        }
      ]
    },
    {
      name: 'messageType',
      displayName: 'Message Type',
      type: 'options',
      required: true,
      default: 'sms',
      description: 'Type of message to send',
      displayOptions: {
        show: {
          resource: ['sms']
        }
      },
      options: [
        {
          name: 'SMS',
          value: 'sms',
          description: 'Send a text message'
        },
        {
          name: 'MMS',
          value: 'mms',
          description: 'Send a multimedia message'
        },
        {
          name: 'WhatsApp',
          value: 'whatsapp',
          description: 'Send a WhatsApp message'
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
      name: 'twilioApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Twilio'
  },

  aliases: ['sms', 'messaging', 'whatsapp', 'phone', 'calls'],
  
  examples: [
    {
      name: 'Send SMS',
      description: 'Send a text message via Twilio',
      workflow: {
        nodes: [
          {
            name: 'Twilio',
            type: 'n8n-nodes-base.twilio',
            parameters: {
              resource: 'sms',
              operation: 'send',
              messageType: 'sms',
              from: '+1234567890',
              to: '+0987654321',
              message: 'Hello from n8n!'
            }
          }
        ]
      }
    }
  ]
};

export default twilioNode;
