/**
 * # Chat Trigger
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Triggers
 * 
 * ## Description
 * 
 * The Chat Trigger node starts a workflow when a chat message is received. This node enables 
 * interactive chat-based workflows, allowing users to trigger automation through conversational 
 * interfaces across various messaging platforms and chat systems.
 * 
 * ## Key Features
 * 
 * - **Multi-Platform Support**: Works with various chat platforms and messaging services
 * - **Message Processing**: Extract and process message content, metadata, and attachments
 * - **User Context**: Access user information, session data, and conversation history
 * - **Real-time Triggering**: Instant workflow activation upon message receipt
 * - **Message Filtering**: Filter messages based on content, sender, or other criteria
 * - **Rich Media Support**: Handle text, images, files, and other media types
 * - **Session Management**: Maintain conversation context across multiple messages
 * - **Response Integration**: Send responses back to the chat platform
 * - **Authentication**: Secure integration with chat platform APIs
 * - **Webhook Support**: Receive messages via webhook endpoints
 * - **Rate Limiting**: Handle message volume and API rate limits
 * - **Error Handling**: Robust error handling for chat platform connectivity
 * 
 * ## Supported Platforms
 * 
 * - **Slack**: Slack apps, bot integrations, and slash commands
 * - **Discord**: Discord bot messages and interactions
 * - **Microsoft Teams**: Teams bot framework and adaptive cards
 * - **Telegram**: Telegram bot API and webhook integration
 * - **WhatsApp**: WhatsApp Business API integration
 * - **Facebook Messenger**: Messenger platform webhook events
 * - **Custom Webhooks**: Generic webhook endpoints for any chat system
 * - **WebSocket**: Real-time WebSocket connections
 * - **IRC**: Internet Relay Chat protocol support
 * - **Matrix**: Matrix protocol for decentralized chat
 * 
 * ## Trigger Types
 * 
 * ### Message Events
 * - **New Message**: Triggered when a new message is received
 * - **Direct Message**: Private messages sent directly to the bot
 * - **Channel Message**: Messages posted in channels or groups
 * - **Mention**: Messages that mention the bot or specific keywords
 * - **Reply**: Responses to previous bot messages
 * - **Reaction**: Emoji reactions to messages
 * - **Edit**: Message edits and updates
 * - **Delete**: Message deletion events
 * 
 * ### User Events
 * - **User Join**: New users joining a channel or group
 * - **User Leave**: Users leaving a channel or group
 * - **Status Change**: User status or presence updates
 * - **Profile Update**: User profile information changes
 * 
 * ### Interactive Events
 * - **Button Click**: Interactive button presses
 * - **Menu Selection**: Dropdown menu selections
 * - **Form Submission**: Form or modal submissions
 * - **Command**: Slash commands or bot commands
 * - **Quick Reply**: Pre-defined quick response selections
 * 
 * ## Message Processing
 * 
 * ### Content Extraction
 * - **Text Content**: Raw message text and formatted content
 * - **Mentions**: Extract mentioned users, channels, or hashtags
 * - **Links**: URLs and embedded link previews
 * - **Files**: Attached files, images, and documents
 * - **Metadata**: Timestamps, message IDs, and platform-specific data
 * - **Thread Context**: Thread and conversation context
 * 
 * ### Natural Language Processing
 * - **Intent Recognition**: Identify user intents and purposes
 * - **Entity Extraction**: Extract names, dates, locations, and other entities
 * - **Sentiment Analysis**: Analyze message sentiment and tone
 * - **Language Detection**: Automatically detect message language
 * - **Keyword Matching**: Pattern matching and keyword detection
 * - **Command Parsing**: Parse structured commands and parameters
 * 
 * ## Use Cases
 * 
 * - **Customer Support**: Automated customer service and support workflows
 * - **Chatbots**: Interactive conversational AI and assistance bots
 * - **Team Automation**: Internal team workflows and notifications
 * - **Lead Generation**: Capture and qualify leads through chat interactions
 * - **Order Processing**: Handle orders and transactions via chat
 * - **FAQ Systems**: Automated frequently asked questions responses
 * - **Content Moderation**: Automatic content filtering and moderation
 * - **Notifications**: Send alerts and updates through chat platforms
 * - **Survey Collection**: Gather feedback and survey responses
 * - **Event Management**: Handle event registrations and updates
 * - **Knowledge Base**: Provide information and documentation access
 * - **Integration Hub**: Connect chat platforms with other business systems
 * 
 * ## Advanced Features
 * 
 * ### Conversation Management
 * - **Session State**: Maintain conversation state across messages
 * - **Context Awareness**: Access previous messages and conversation history
 * - **Multi-turn Dialogs**: Handle complex multi-step conversations
 * - **User Profiles**: Store and access user preference and information
 * - **Conversation Analytics**: Track engagement and conversation metrics
 * 
 * ### Response Generation
 * - **Template Responses**: Pre-built response templates and patterns
 * - **Dynamic Content**: Generate personalized responses based on context
 * - **Rich Formatting**: Support for markdown, HTML, and platform-specific formatting
 * - **Interactive Elements**: Buttons, cards, carousels, and other UI components
 * - **File Sharing**: Send images, documents, and other media files
 * 
 * ### Integration Capabilities
 * - **CRM Integration**: Connect with customer relationship management systems
 * - **Database Queries**: Access and update database information
 * - **API Calls**: Make external API requests based on chat interactions
 * - **Email Integration**: Send emails triggered by chat messages
 * - **Calendar Systems**: Schedule appointments and manage calendars
 * - **E-commerce**: Process orders and handle shopping workflows
 */

import { NodeTypeInfo } from '../../node-types.js';

export const chatTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.chatTrigger',
  displayName: 'Chat Trigger',
  description: 'Triggers workflow execution when chat messages are received from various messaging platforms',
  category: 'Core Nodes',
  subcategory: 'Triggers',
  
  properties: [
    {
      name: 'platform',
      displayName: 'Chat Platform',
      type: 'options',
      required: true,
      default: 'webhook',
      description: 'The chat platform to listen for messages from',
      options: [
        {
          name: 'Generic Webhook',
          value: 'webhook',
          description: 'Receive messages via webhook from any chat platform'
        },
        {
          name: 'Slack',
          value: 'slack',
          description: 'Slack bot and app integrations'
        },
        {
          name: 'Discord',
          value: 'discord',
          description: 'Discord bot messages and interactions'
        },
        {
          name: 'Telegram',
          value: 'telegram',
          description: 'Telegram bot API integration'
        },
        {
          name: 'Microsoft Teams',
          value: 'teams',
          description: 'Microsoft Teams bot framework'
        },
        {
          name: 'WhatsApp',
          value: 'whatsapp',
          description: 'WhatsApp Business API'
        }
      ]
    },
    {
      name: 'triggerOn',
      displayName: 'Trigger On',
      type: 'multiOptions',
      required: true,
      default: ['message'],
      description: 'What events should trigger the workflow',
      options: [
        {
          name: 'New Message',
          value: 'message',
          description: 'Any new message received'
        },
        {
          name: 'Direct Message',
          value: 'direct_message',
          description: 'Private messages sent directly to the bot'
        },
        {
          name: 'Mention',
          value: 'mention',
          description: 'Messages that mention the bot'
        },
        {
          name: 'Channel Message',
          value: 'channel_message',
          description: 'Messages in channels or groups'
        },
        {
          name: 'Command',
          value: 'command',
          description: 'Slash commands or bot commands'
        },
        {
          name: 'Button Click',
          value: 'button_click',
          description: 'Interactive button interactions'
        },
        {
          name: 'Reaction',
          value: 'reaction',
          description: 'Emoji reactions to messages'
        }
      ]
    },
    {
      name: 'messageFilters',
      displayName: 'Message Filters',
      type: 'collection',
      required: false,
      default: {},
      description: 'Filter incoming messages based on criteria',
      options: [
        {
          name: 'keywords',
          displayName: 'Keywords',
          type: 'string',
          required: false,
          default: '',
          description: 'Comma-separated keywords to filter messages',
          placeholder: 'help, support, order'
        },
        {
          name: 'userFilter',
          displayName: 'User Filter',
          type: 'string',
          required: false,
          default: '',
          description: 'Filter by specific user IDs or usernames',
          placeholder: '@username, user123'
        },
        {
          name: 'channelFilter',
          displayName: 'Channel Filter',
          type: 'string',
          required: false,
          default: '',
          description: 'Filter by specific channels or groups',
          placeholder: '#general, #support'
        },
        {
          name: 'messagePattern',
          displayName: 'Message Pattern',
          type: 'string',
          required: false,
          default: '',
          description: 'Regular expression pattern to match messages',
          placeholder: '^/order\\s+\\d+'
        }
      ]
    },
    {
      name: 'responseSettings',
      displayName: 'Response Settings',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure automatic responses',
      options: [
        {
          name: 'autoRespond',
          displayName: 'Auto Respond',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Send automatic responses to messages'
        },
        {
          name: 'acknowledgmentMessage',
          displayName: 'Acknowledgment Message',
          type: 'string',
          required: false,
          default: 'Message received, processing...',
          description: 'Message to send immediately upon receiving input',
          displayOptions: {
            show: {
              autoRespond: [true]
            }
          }
        },
        {
          name: 'typingIndicator',
          displayName: 'Show Typing Indicator',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Show typing indicator while processing',
          displayOptions: {
            show: {
              autoRespond: [true]
            }
          }
        }
      ]
    },
    {
      name: 'sessionManagement',
      displayName: 'Session Management',
      type: 'collection',
      required: false,
      default: {},
      description: 'Manage conversation sessions and context',
      options: [
        {
          name: 'enableSessions',
          displayName: 'Enable Sessions',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Maintain conversation context across messages'
        },
        {
          name: 'sessionTimeout',
          displayName: 'Session Timeout',
          type: 'number',
          required: false,
          default: 30,
          description: 'Session timeout in minutes',
          typeOptions: {
            minValue: 1,
            maxValue: 1440
          },
          displayOptions: {
            show: {
              enableSessions: [true]
            }
          }
        },
        {
          name: 'contextLimit',
          displayName: 'Context Limit',
          type: 'number',
          required: false,
          default: 10,
          description: 'Maximum number of previous messages to keep in context',
          typeOptions: {
            minValue: 1,
            maxValue: 100
          },
          displayOptions: {
            show: {
              enableSessions: [true]
            }
          }
        }
      ]
    }
  ],

  inputs: [],

  outputs: [
    {
      type: 'main',
      displayName: 'Message Received',
      description: 'Triggered when a chat message is received'
    }
  ],

  credentials: [
    {
      name: 'slackApi',
      required: false,
      displayOptions: {
        show: {
          platform: ['slack']
        }
      }
    },
    {
      name: 'discordApi',
      required: false,
      displayOptions: {
        show: {
          platform: ['discord']
        }
      }
    },
    {
      name: 'telegramApi',
      required: false,
      displayOptions: {
        show: {
          platform: ['telegram']
        }
      }
    }
  ],

  version: [1],
  defaults: {
    name: 'Chat Trigger'
  },

  aliases: ['chat', 'message', 'bot', 'conversation', 'messaging'],
  
  examples: [
    {
      name: 'Simple Chat Bot',
      description: 'Basic chatbot that responds to user messages',
      workflow: {
        nodes: [
          {
            name: 'Chat Trigger',
            type: 'n8n-nodes-base.chatTrigger',
            parameters: {
              platform: 'webhook',
              triggerOn: ['message', 'direct_message'],
              responseSettings: {
                autoRespond: true,
                acknowledgmentMessage: 'Thanks for your message! Let me help you.',
                typingIndicator: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Customer Support Bot',
      description: 'Automated customer support with keyword filtering',
      workflow: {
        nodes: [
          {
            name: 'Support Chat Trigger',
            type: 'n8n-nodes-base.chatTrigger',
            parameters: {
              platform: 'slack',
              triggerOn: ['mention', 'direct_message'],
              messageFilters: {
                keywords: 'help, support, issue, problem',
                channelFilter: '#support, #general'
              },
              sessionManagement: {
                enableSessions: true,
                sessionTimeout: 60,
                contextLimit: 5
              }
            }
          }
        ]
      }
    },
    {
      name: 'Order Processing Bot',
      description: 'Process orders through chat commands',
      workflow: {
        nodes: [
          {
            name: 'Order Chat Trigger',
            type: 'n8n-nodes-base.chatTrigger',
            parameters: {
              platform: 'telegram',
              triggerOn: ['command'],
              messageFilters: {
                messagePattern: '^/order\\s+.*'
              },
              responseSettings: {
                autoRespond: true,
                acknowledgmentMessage: 'Processing your order...'
              }
            }
          }
        ]
      }
    }
  ]
};

export default chatTriggerNode;
