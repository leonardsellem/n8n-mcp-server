/**
 * # Slack
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Communication & Messaging
 * 
 * ## Description
 * 
 * Use the Slack node to automate work in Slack, and integrate Slack with other applications. 
 * n8n has built-in support for a wide range of Slack features, including creating, archiving, 
 * and closing channels, getting users and files, as well as deleting messages.
 * 
 * ## Key Features
 * 
 * - **Comprehensive Channel Management**: Create, archive, join, leave, and manage channels
 * - **Advanced Messaging**: Send, update, delete messages with rich formatting and blocks
 * - **File Operations**: Upload, download, and manage team files
 * - **User & Profile Management**: Get user info, update profiles, and manage presence
 * - **Reaction System**: Add, remove, and get message reactions
 * - **Star Management**: Add, delete, and list starred items
 * - **User Group Administration**: Create, enable, disable, and update user groups
 * - **Thread Support**: Get replies and manage threaded conversations
 * - **Search Capabilities**: Search messages and get permalinks
 * - **Approval Workflows**: Send messages and wait for approval before continuing
 * - **Rich Block Kit Support**: Use Slack's modern block kit for interactive messages
 * - **Extensive API Coverage**: Access to most Slack Web API methods
 * 
 * ## Credentials
 * 
 * Refer to [Slack credentials](../../credentials/slack/) for guidance on setting up authentication.
 * Requires appropriate OAuth scopes for the operations you want to perform.
 * 
 * ## Operations by Resource
 * 
 * ### Channel Operations
 * - **Archive**: Archive a channel
 * - **Close**: Close a direct message or multi-person direct message
 * - **Create**: Create a public or private channel-based conversation
 * - **Get**: Get information about a channel
 * - **Get Many**: Get a list of channels in Slack
 * - **History**: Get a channel's history of messages and events
 * - **Invite**: Invite a user to a channel
 * - **Join**: Join an existing channel
 * - **Kick**: Remove a user from a channel
 * - **Leave**: Leave a channel
 * - **Member**: List the members of a channel
 * - **Open**: Open or resume a direct message or multi-person direct message
 * - **Rename**: Rename a channel
 * - **Replies**: Get a thread of messages posted to a channel
 * - **Set Purpose**: Set purpose of a channel
 * - **Set Topic**: Set topic of a channel
 * - **Unarchive**: Unarchive a channel
 * 
 * ### File Operations
 * - **Get**: Get a file
 * - **Get Many**: Get and filter team files
 * - **Upload**: Create or upload an existing file
 * 
 * ### Message Operations
 * - **Delete**: Delete a message
 * - **Get Permalink**: Get a message's permalink
 * - **Search**: Search for messages
 * - **Send**: Send a message
 * - **Send and Wait for Approval**: Send a message and wait for approval from recipient
 * - **Update**: Update a message
 * 
 * ### Reaction Operations
 * - **Add**: Add a reaction to a message
 * - **Get**: Get a message's reactions
 * - **Remove**: Remove a reaction from a message
 * 
 * ### Star Operations
 * - **Add**: Add a star to an item
 * - **Delete**: Delete a star from an item
 * - **Get Many**: Get a list of an authenticated user's stars
 * 
 * ### User Operations
 * - **Get**: Get information about a user
 * - **Get Many**: Get a list of users
 * - **Get User's Profile**: Get user's profile information
 * - **Get User's Status**: Get user's presence status
 * - **Update User's Profile**: Update user's profile
 * 
 * ### User Group Operations
 * - **Create**: Create a user group
 * - **Disable**: Disable a user group
 * - **Enable**: Enable a user group
 * - **Get Many**: Get a list of user groups
 * - **Update**: Update a user group
 * 
 * ## Required Scopes
 * 
 * Once you create a Slack app for your Slack credentials, you must add the appropriate scopes 
 * to your Slack app for this node to work. Each operation requires specific OAuth scopes.
 * Refer to the Slack API documentation for detailed scope requirements.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Slack API directly with your Slack credentials.
 * 
 * ## Use Cases
 * 
 * - Automated team notifications and status updates
 * - Error monitoring and alert systems
 * - Customer support automation and ticket routing
 * - File sharing and document management workflows
 * - Project management integration and updates
 * - CI/CD pipeline notifications and deployment alerts
 * - HR onboarding and employee engagement automation
 * - Sales and marketing campaign notifications
 * - Survey collection and feedback automation
 * - Integration hub for connecting multiple business tools
 * - Chatbot development and interactive workflows
 * - Compliance and audit trail automation
 */

import { NodeTypeInfo } from '../../node-types.js';

export const slackNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.slack',
  displayName: 'Slack',
  description: 'Integrate with Slack to send messages, manage channels, and automate team communication.',
  category: 'Action Nodes',
  subcategory: 'Communication & Messaging',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'postMessage',
      description: 'Operation to perform on Slack',
      options: [
        {
          name: 'Post Message',
          value: 'postMessage',
          description: 'Send a message to a channel or user'
        },
        {
          name: 'Update Message',
          value: 'updateMessage',
          description: 'Update an existing message'
        },
        {
          name: 'Delete Message',
          value: 'deleteMessage',
          description: 'Delete a message'
        },
        {
          name: 'Get User',
          value: 'getUser',
          description: 'Get information about a user'
        },
        {
          name: 'Get Channel',
          value: 'getChannel',
          description: 'Get information about a channel'
        },
        {
          name: 'Upload File',
          value: 'uploadFile',
          description: 'Upload a file to Slack'
        },
        {
          name: 'Get Files',
          value: 'getFiles',
          description: 'Get files from Slack'
        }
      ]
    },
    {
      name: 'channel',
      displayName: 'Channel',
      type: 'string',
      required: true,
      default: '',
      description: 'Channel, private group, or IM channel to send message to',
      displayOptions: {
        show: {
          operation: ['postMessage', 'updateMessage', 'deleteMessage', 'uploadFile']
        }
      }
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
          operation: ['postMessage', 'updateMessage']
        }
      }
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'Set the bot username for the message',
      displayOptions: {
        show: {
          operation: ['postMessage']
        }
      }
    },
    {
      name: 'iconEmoji',
      displayName: 'Icon Emoji',
      type: 'string',
      required: false,
      default: '',
      description: 'Emoji to use as the icon for this message',
      displayOptions: {
        show: {
          operation: ['postMessage']
        }
      }
    },
    {
      name: 'attachments',
      displayName: 'Attachments',
      type: 'json',
      required: false,
      default: '[]',
      description: 'Structured message attachments in JSON format',
      displayOptions: {
        show: {
          operation: ['postMessage', 'updateMessage']
        }
      }
    },
    {
      name: 'blocks',
      displayName: 'Blocks',
      type: 'json',
      required: false,
      default: '[]',
      description: 'Blocks for rich message formatting',
      displayOptions: {
        show: {
          operation: ['postMessage', 'updateMessage']
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
      name: 'slackApi',
      required: true
    }
  ],

  version: [1, 2, 3],
  defaults: {
    name: 'Slack'
  },

  aliases: ['message', 'chat', 'notification'],
  
  examples: [
    {
      name: 'Send Simple Message',
      description: 'Send a simple text message to a Slack channel',
      workflow: {
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            parameters: {
              operation: 'postMessage',
              channel: '#general',
              text: 'Hello from n8n! 👋'
            }
          }
        ]
      }
    },
    {
      name: 'Send Rich Message',
      description: 'Send a message with attachments and formatting',
      workflow: {
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            parameters: {
              operation: 'postMessage',
              channel: '#alerts',
              text: 'System Alert',
              attachments: JSON.stringify([
                {
                  color: 'danger',
                  title: 'Error Detected',
                  text: 'There was an error in the system',
                  fields: [
                    {
                      title: 'Error Code',
                      value: '500',
                      short: true
                    },
                    {
                      title: 'Timestamp',
                      value: new Date().toISOString(),
                      short: true
                    }
                  ]
                }
              ])
            }
          }
        ]
      }
    },
    {
      name: 'Upload File',
      description: 'Upload a file to a Slack channel',
      workflow: {
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            parameters: {
              operation: 'uploadFile',
              channel: '#documents',
              file: 'data:text/plain;base64,SGVsbG8gV29ybGQ=',
              filename: 'hello.txt',
              title: 'Sample File'
            }
          }
        ]
      }
    }
  ]
};

export default slackNode;
