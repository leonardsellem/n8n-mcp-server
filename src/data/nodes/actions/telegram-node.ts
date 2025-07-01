/**
 * # Telegram
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Communication & Messaging
 * 
 * ## Description
 * 
 * Use the Telegram node to automate work in Telegram and integrate Telegram with other applications. 
 * n8n has built-in support for a wide range of Telegram features, including getting files as well as 
 * deleting and editing messages.
 * 
 * ## Key Features
 * 
 * - **Comprehensive Chat Management**: Get chat info, administrators, members, and manage settings
 * - **Advanced Message Operations**: Send, edit, delete, pin/unpin messages with rich formatting
 * - **Multi-Media Support**: Send photos, videos, animations, audio, documents, stickers, and locations
 * - **Interactive Callbacks**: Handle inline keyboard callbacks and inline queries
 * - **File Operations**: Get and manage files from Telegram
 * - **Bot Integration**: Full Telegram Bot API capabilities with authentication
 * - **Media Groups**: Send groups of photos and videos together
 * - **Chat Actions**: Send typing indicators and other status messages
 * - **Channel & Group Support**: Work with channels, groups, and private chats
 * - **Geolocation Support**: Send and receive location data
 * - **Sticker Support**: Send static .WEBP, animated .TGS, or video .WEBM stickers
 * - **Real-time Messaging**: Instant message delivery and status updates
 * 
 * ## Credentials
 * 
 * Refer to [Telegram credentials](../../credentials/telegram/) for guidance on setting up authentication.
 * Uses Telegram Bot API tokens for secure bot communication.
 * 
 * ## Operations by Resource
 * 
 * ### Chat Operations
 * - **Get**: Get up-to-date information about a chat
 * - **Get Administrators**: Get a list of all administrators in a chat
 * - **Get Member**: Get the details of a chat member
 * - **Leave**: Leave a chat
 * - **Set Description**: Set description of a chat
 * - **Set Title**: Set title of a chat
 * 
 * ### Callback Operations
 * - **Answer Query**: Send answers to callback queries sent from inline keyboards
 * - **Answer Inline Query**: Send answers to callback queries sent from inline queries
 * 
 * ### File Operations
 * - **Get File**: Get a file from Telegram
 * 
 * ### Message Operations
 * - **Delete Chat Message**: Delete a message from the chat
 * - **Edit Message Text**: Edit the text of an existing message
 * - **Pin Chat Message**: Pin a message for the chat
 * - **Send Animation**: Send GIFs or H.264/MPEG-4 AVC videos without sound (up to 50 MB)
 * - **Send Audio**: Send audio file to the chat and display it in the music player
 * - **Send Chat Action**: Tell the user that something is happening on the bot's side (typing, uploading, etc.)
 * - **Send Document**: Send a document to the chat
 * - **Send Location**: Send a geolocation to the chat
 * - **Send Media Group**: Send a group of photos and/or videos
 * - **Send Message**: Send a text message to the chat
 * - **Send Photo**: Send a photo to the chat
 * - **Send Sticker**: Send static .WEBP, animated .TGS, or video .WEBM stickers to the chat
 * - **Send Video**: Send a video to the chat
 * - **Unpin Chat Message**: Unpin a message from the chat
 * 
 * ## Bot Channel Requirements
 * 
 * To use most of the Message operations, you must add your bot to a channel so that it can send messages 
 * to that channel. Refer to Common Issues documentation for guidance on adding a bot to a Telegram channel.
 * 
 * ## Related Resources
 * 
 * Refer to [Telegram's API documentation](https://core.telegram.org/bots/api) for more information about the service.
 * n8n provides a trigger node for Telegram for receiving messages and updates.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include bot permissions, chat access, and media format requirements.
 * 
 * ## Use Cases
 * 
 * - **Customer Support Automation**: Automated responses, ticket creation, and support workflows
 * - **Notification Systems**: System alerts, monitoring notifications, and status updates
 * - **News & Broadcasting**: Content distribution, announcement channels, and media sharing
 * - **Interactive Bot Development**: Conversational bots, menu systems, and user interfaces
 * - **Business Communication**: Team notifications, project updates, and internal alerts
 * - **E-commerce Integration**: Order notifications, payment confirmations, and customer updates
 * - **Educational Platforms**: Course announcements, assignment reminders, and student engagement
 * - **Event Management**: Event notifications, RSVP collection, and attendee communication
 * - **IoT & Monitoring**: Device alerts, sensor data reporting, and system status updates
 * - **Social Media Automation**: Cross-platform posting, engagement tracking, and content syndication
 * - **File Sharing & Management**: Document distribution, media sharing, and collaborative workflows
 * - **Gaming & Entertainment**: Game notifications, community management, and interactive experiences
 */

import { NodeTypeInfo } from '../../node-types.js';

export const telegramNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.telegram',
  displayName: 'Telegram',
  description: 'Send messages and interact with Telegram bots for communication automation.',
  category: 'Action Nodes',
  subcategory: 'Communication & Messaging',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'sendMessage',
      description: 'Operation to perform on Telegram',
      options: [
        {
          name: 'Send Message',
          value: 'sendMessage',
          description: 'Send a text message'
        },
        {
          name: 'Send Photo',
          value: 'sendPhoto',
          description: 'Send a photo'
        },
        {
          name: 'Send Document',
          value: 'sendDocument',
          description: 'Send a document'
        }
      ]
    },
    {
      name: 'chatId',
      displayName: 'Chat ID',
      type: 'string',
      required: true,
      default: '',
      description: 'Unique identifier for the target chat'
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: true,
      default: '',
      description: 'Text of the message to send',
      displayOptions: {
        show: {
          operation: ['sendMessage']
        }
      }
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
      name: 'telegramApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Telegram'
  },

  aliases: ['bot', 'message', 'chat'],
  
  examples: [
    {
      name: 'Send Message',
      description: 'Send a text message to Telegram',
      workflow: {
        nodes: [
          {
            name: 'Telegram',
            type: 'n8n-nodes-base.telegram',
            parameters: {
              operation: 'sendMessage',
              chatId: '123456789',
              text: 'Hello from n8n! 📱'
            }
          }
        ]
      }
    }
  ]
};

export default telegramNode;
