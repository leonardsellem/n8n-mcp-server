import { NodeTypeInfo } from '../node-types.js';

export const discordNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.discord',
  displayName: 'Discord',
  description: 'Use the Discord node to automate work in Discord, and integrate Discord with other applications. n8n has built-in support for a wide range of Discord features, including sending messages in a Discord channel and managing channels.',
  category: 'Communication',
  subcategory: 'Team Chat',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Channel', value: 'channel', description: 'Work with Discord channels' },
        { name: 'Message', value: 'message', description: 'Handle Discord messages' },
        { name: 'Member', value: 'member', description: 'Manage server members' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The operation to perform',
      options: [
        // Channel operations
        { name: 'Create', value: 'create', description: 'Create a new channel' },
        { name: 'Delete', value: 'delete', description: 'Delete a channel' },
        { name: 'Get', value: 'get', description: 'Get information about a channel' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple channels' },
        { name: 'Update', value: 'update', description: 'Update a channel' },
        // Message operations
        { name: 'Send', value: 'send', description: 'Send a message to a channel' },
        { name: 'Send and Wait for Response', value: 'sendAndWaitForResponse', description: 'Send a message and wait for response' },
        { name: 'React with Emoji', value: 'react', description: 'Add emoji reaction to a message' },
        // Member operations
        { name: 'Role Add', value: 'roleAdd', description: 'Add role to a member' },
        { name: 'Role Remove', value: 'roleRemove', description: 'Remove role from a member' }
      ]
    },
    {
      name: 'channelId',
      displayName: 'Channel ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the channel to operate on'
    },
    {
      name: 'messageId',
      displayName: 'Message ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the message to operate on'
    },
    {
      name: 'content',
      displayName: 'Content',
      type: 'string',
      required: false,
      default: '',
      description: 'The content of the message to send'
    },
    {
      name: 'channelName',
      displayName: 'Channel Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the channel (for create/update operations)'
    },
    {
      name: 'channelType',
      displayName: 'Channel Type',
      type: 'options',
      required: false,
      default: 'text',
      description: 'The type of channel to create',
      options: [
        { name: 'Text', value: 'text', description: 'Text channel' },
        { name: 'Voice', value: 'voice', description: 'Voice channel' },
        { name: 'Category', value: 'category', description: 'Category channel' },
        { name: 'Announcement', value: 'announcement', description: 'Announcement channel' },
        { name: 'Stage', value: 'stage', description: 'Stage voice channel' },
        { name: 'Forum', value: 'forum', description: 'Forum channel' }
      ]
    },
    {
      name: 'topic',
      displayName: 'Topic',
      type: 'string',
      required: false,
      default: '',
      description: 'The topic/description of the channel'
    },
    {
      name: 'position',
      displayName: 'Position',
      type: 'number',
      required: false,
      default: 0,
      description: 'The position of the channel in the channel list'
    },
    {
      name: 'nsfw',
      displayName: 'NSFW',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the channel is NSFW (Not Safe For Work)'
    },
    {
      name: 'parentId',
      displayName: 'Parent ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the parent category for this channel'
    },
    {
      name: 'embeds',
      displayName: 'Embeds',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of embed objects to send with the message'
    },
    {
      name: 'files',
      displayName: 'Files',
      type: 'string',
      required: false,
      default: '',
      description: 'Files to attach to the message (binary data property names)'
    },
    {
      name: 'emoji',
      displayName: 'Emoji',
      type: 'string',
      required: false,
      default: '',
      description: 'The emoji to react with (either Unicode emoji or custom emoji ID)'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to operate on'
    },
    {
      name: 'roleId',
      displayName: 'Role ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the role to add or remove'
    },
    {
      name: 'responseType',
      displayName: 'Response Type',
      type: 'options',
      required: false,
      default: 'approval',
      description: 'The type of response to wait for',
      options: [
        { name: 'Approval', value: 'approval', description: 'Wait for approval/disapproval' },
        { name: 'Free Text', value: 'freeText', description: 'Wait for free text response' },
        { name: 'Custom Form', value: 'customForm', description: 'Wait for custom form response' }
      ]
    },
    {
      name: 'approvalButtons',
      displayName: 'Approval Buttons',
      type: 'options',
      required: false,
      default: 'approveAndDisapprove',
      description: 'Which approval buttons to show',
      options: [
        { name: 'Approve only', value: 'approveOnly', description: 'Show only approve button' },
        { name: 'Approve and disapprove', value: 'approveAndDisapprove', description: 'Show both approve and disapprove buttons' }
      ]
    },
    {
      name: 'approveButtonText',
      displayName: 'Approve Button Text',
      type: 'string',
      required: false,
      default: 'Approve',
      description: 'Text for the approve button'
    },
    {
      name: 'disapproveButtonText',
      displayName: 'Disapprove Button Text',
      type: 'string',
      required: false,
      default: 'Disapprove',
      description: 'Text for the disapprove button'
    },
    {
      name: 'limitWaitTime',
      displayName: 'Limit Wait Time',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to limit the wait time for a response'
    },
    {
      name: 'waitTimeLimit',
      displayName: 'Wait Time Limit',
      type: 'number',
      required: false,
      default: 30,
      description: 'Maximum time to wait for a response (in minutes)'
    },
    {
      name: 'appendAttribution',
      displayName: 'Append n8n Attribution',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to mention that the message was sent automatically with n8n'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The processed Discord data'
    }
  ],
  credentials: ['discordApi', 'discordOAuth2Api', 'discordWebhook'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Message',
      description: 'Send a simple message to a Discord channel',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              resource: 'message',
              operation: 'send',
              channelId: '1234567890123456789',
              content: 'Hello from n8n workflow!'
            }
          }
        ]
      }
    },
    {
      name: 'Create Channel',
      description: 'Create a new text channel in a Discord server',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              resource: 'channel',
              operation: 'create',
              channelName: 'new-project-channel',
              channelType: 'text',
              topic: 'Discussion about the new project'
            }
          }
        ]
      }
    },
    {
      name: 'Send Message with Embed',
      description: 'Send a message with rich embed content',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              resource: 'message',
              operation: 'send',
              channelId: '1234567890123456789',
              content: 'Check out this embed!',
              embeds: JSON.stringify([{
                title: 'Workflow Completed',
                description: 'Your n8n workflow has finished successfully.',
                color: 0x00FF00,
                timestamp: new Date().toISOString()
              }])
            }
          }
        ]
      }
    },
    {
      name: 'Send and Wait for Approval',
      description: 'Send a message and wait for user approval',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              resource: 'message',
              operation: 'sendAndWaitForResponse',
              channelId: '1234567890123456789',
              content: 'Please review and approve this action.',
              responseType: 'approval',
              approvalButtons: 'approveAndDisapprove',
              limitWaitTime: true,
              waitTimeLimit: 60
            }
          }
        ]
      }
    },
    {
      name: 'Add Emoji Reaction',
      description: 'Add an emoji reaction to a Discord message',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              resource: 'message',
              operation: 'react',
              channelId: '1234567890123456789',
              messageId: '{{$json["messageId"]}}',
              emoji: '👍'
            }
          }
        ]
      }
    },
    {
      name: 'Add Role to Member',
      description: 'Add a role to a Discord server member',
      workflow: {
        nodes: [
          {
            name: 'Discord',
            type: 'n8n-nodes-base.discord',
            parameters: {
              resource: 'member',
              operation: 'roleAdd',
              userId: '1234567890123456789',
              roleId: '9876543210987654321'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing (maintaining consistency with Gmail/Slack pattern)
export const discordNodes: NodeTypeInfo[] = [discordNode];

// Export individual actions for the Discord node
export const discordActions = [
  // Channel actions
  'create_channel',
  'delete_channel',
  'get_channel',
  'get_many_channels',
  'update_channel',
  // Message actions
  'delete_message',
  'get_message',
  'get_many_messages',
  'react_with_emoji',
  'send_message',
  'send_message_and_wait_for_response',
  // Member actions
  'get_many_members',
  'add_role_to_member',
  'remove_role_from_member'
];

// Note: Discord does not have a trigger node, so no trigger events are exported
export const discordTriggers: string[] = [];