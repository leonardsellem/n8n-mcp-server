/**
 * # Discord
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Communication & Messaging
 * 
 * ## Description
 * 
 * Use the Discord node to automate work in Discord, and integrate Discord with other applications. 
 * n8n has built-in support for a wide range of Discord features, including sending messages in a Discord channel 
 * and managing channels.
 * 
 * ## Key Features
 * 
 * - **Comprehensive Channel Management**: Create, delete, get, update, and list channels
 * - **Advanced Message Operations**: Send, delete, get, react with emoji, and manage messages
 * - **Interactive Workflows**: Send and wait for user responses with approval, forms, or custom interactions
 * - **Member Management**: Get member lists, add/remove roles, and manage permissions
 * - **AI Tool Integration**: Can be used as an AI tool with automatic parameter setting
 * - **Rich Message Support**: Embeds, files, reactions, and rich formatting
 * - **Workflow Integration**: Pause workflows for user input and approval processes
 * - **Real-time Communication**: Instant message delivery and response handling
 * - **Bot Functionality**: Full Discord bot capabilities with proper authentication
 * - **Community Automation**: Automated moderation, announcements, and engagement tools
 * 
 * ## Credentials
 * 
 * Refer to [Discord credentials](../../credentials/discord/) for guidance on setting up authentication.
 * Supports Discord bot tokens and webhook authentication.
 * 
 * ## AI Tool Integration
 * 
 * This node can be used as an AI tool to enhance the capabilities of an AI agent. When used in this way, 
 * many parameters can be set automatically, or with information directed by AI.
 * 
 * ## Operations by Resource
 * 
 * ### Channel Operations
 * - **Create**: Create a new channel in the server
 * - **Delete**: Delete an existing channel
 * - **Get**: Get details of a specific channel
 * - **Get Many**: Get a list of channels in the server
 * - **Update**: Update channel properties and settings
 * 
 * ### Message Operations
 * - **Delete**: Delete a message from a channel
 * - **Get**: Get details of a specific message
 * - **Get Many**: Get a list of messages from a channel
 * - **React with Emoji**: Add an emoji reaction to a message
 * - **Send**: Send a message to a channel
 * - **Send and Wait for Response**: Send a message and pause workflow until user responds
 * 
 * ### Member Operations
 * - **Get Many**: Get a list of members in the server
 * - **Role Add**: Add a role to a member
 * - **Role Remove**: Remove a role from a member
 * 
 * ## Advanced Features
 * 
 * ### Send and Wait for Response
 * 
 * This powerful feature allows you to send a message and pause workflow execution until a person 
 * confirms the action or provides more information.
 * 
 * #### Response Types:
 * - **Approval**: Users can approve or disapprove from within the message
 * - **Free Text**: Users can submit a response with a form
 * - **Custom Form**: Users can submit a response with a custom form
 * 
 * #### Configuration Options:
 * - **Limit Wait Time**: Set automatic workflow resumption after specified time
 * - **Append n8n Attribution**: Choose whether to mention n8n in the message
 * - **Custom Button Labels**: Personalize button text for user interactions
 * - **Form Customization**: Create custom forms with multiple fields and validation
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Discord API directly with your Discord credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include bot permissions, rate limiting, and webhook configuration.
 * 
 * ## Use Cases
 * 
 * - **Gaming Community Management**: Server notifications, event announcements, and player engagement
 * - **Business Team Communication**: Project updates, alerts, and team coordination
 * - **Customer Support**: Automated ticket responses, escalation notifications, and community support
 * - **Content Creation**: Publication announcements, feedback collection, and audience engagement
 * - **DevOps & Monitoring**: System alerts, deployment notifications, and incident management
 * - **Educational Platforms**: Course announcements, assignment reminders, and student engagement
 * - **Event Management**: Event notifications, RSVP collection, and attendee communication
 * - **E-commerce**: Order notifications, inventory alerts, and customer service automation
 * - **Community Moderation**: Automated moderation, rule enforcement, and community guidelines
 * - **Social Media Integration**: Cross-platform posting, engagement tracking, and audience growth
 * - **Workflow Approvals**: Manual approval processes, review workflows, and decision collection
 * - **AI Bot Integration**: AI-powered chatbots, automated responses, and intelligent community management
 */

import { NodeTypeInfo } from '../../node-types.js';

export const discordNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.discord',
  displayName: 'Discord',
  description: 'Send messages and interact with Discord servers for community management and notifications.',
  category: 'Action Nodes',
  subcategory: 'Communication & Messaging',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'sendMessage',
      description: 'Operation to perform on Discord',
      options: [
        {
          name: 'Send Message',
          value: 'sendMessage',
          description: 'Send a message to a channel'
        },
        {
          name: 'Send Embed',
          value: 'sendEmbed',
          description: 'Send a rich embed message'
        },
        {
          name: 'Upload File',
          value: 'uploadFile',
          description: 'Upload a file to a channel'
        }
      ]
    },
    {
      name: 'webhookUrl',
      displayName: 'Webhook URL',
      type: 'string',
      required: true,
      default: '',
      description: 'Discord webhook URL for sending messages'
    },
    {
      name: 'content',
      displayName: 'Content',
      type: 'string',
      required: true,
      default: '',
      description: 'Message content to send',
      displayOptions: {
        show: {
          operation: ['sendMessage']
        }
      }
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'Override the default username of the webhook'
    },
    {
      name: 'avatarUrl',
      displayName: 'Avatar URL',
      type: 'string',
      required: false,
      default: '',
      description: 'Override the default avatar of the webhook'
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

  credentials: [],

  version: [1, 2],
  defaults: {
    name: 'Discord'
  },

  aliases: ['chat', 'message', 'gaming'],
  
  examples: [
    {
      name: 'Send Simple Message',
      description: 'Send a text message to Discord',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              operation: 'sendMessage',
              webhookUrl: 'https://discord.com/api/webhooks/...',
              content: 'Hello from n8n! 🎮'
            }
          }
        ]
      }
    }
  ]
};

export default discordNode;
