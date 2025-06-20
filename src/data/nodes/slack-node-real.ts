import { NodeTypeInfo } from '../node-types.js';

export const slackNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.slack',
  displayName: 'Slack',
  description: 'Send messages and interact with Slack. Send messages to channels, users, or groups. Create channels, archive channels, and more.',
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
        { name: 'Channel', value: 'channel', description: 'Manage Slack channels' },
        { name: 'Message', value: 'message', description: 'Send and manage messages' },
        { name: 'User', value: 'user', description: 'Manage user information' },
        { name: 'File', value: 'file', description: 'Upload and manage files' },
        { name: 'Reaction', value: 'reaction', description: 'Add and remove reactions' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'post',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['message']
        }
      },
      options: [
        { name: 'Post', value: 'post', description: 'Post a message' },
        { name: 'Update', value: 'update', description: 'Update a message' },
        { name: 'Delete', value: 'delete', description: 'Delete a message' },
        { name: 'Get', value: 'get', description: 'Get a message' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple messages' },
        { name: 'Search', value: 'search', description: 'Search messages' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      displayOptions: {
        show: {
          resource: ['channel']
        }
      },
      options: [
        { name: 'Archive', value: 'archive', description: 'Archive a channel' },
        { name: 'Close', value: 'close', description: 'Close a direct message or group channel' },
        { name: 'Create', value: 'create', description: 'Create a channel' },
        { name: 'Get', value: 'get', description: 'Get information about a channel' },
        { name: 'Get Many', value: 'getAll', description: 'Get multiple channels' },
        { name: 'History', value: 'history', description: 'Get channel message history' },
        { name: 'Invite', value: 'invite', description: 'Invite users to a channel' },
        { name: 'Join', value: 'join', description: 'Join a channel' },
        { name: 'Kick', value: 'kick', description: 'Remove a user from a channel' },
        { name: 'Leave', value: 'leave', description: 'Leave a channel' },
        { name: 'Open', value: 'open', description: 'Open a direct message or group channel' },
        { name: 'Rename', value: 'rename', description: 'Rename a channel' },
        { name: 'Set Purpose', value: 'setPurpose', description: 'Set the channel purpose' },
        { name: 'Set Topic', value: 'setTopic', description: 'Set the channel topic' },
        { name: 'Unarchive', value: 'unarchive', description: 'Unarchive a channel' }
      ]
    },
    // Authentication method
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'accessToken',
      description: 'Authentication method to use',
      options: [
        { name: 'Access Token', value: 'accessToken', description: 'Use Slack API access token' },
        { name: 'OAuth2', value: 'oAuth2', description: 'Use OAuth2 authentication' }
      ]
    },
    // Channel/Recipient Selection
    {
      name: 'select',
      displayName: 'Select',
      type: 'options',
      required: true,
      default: 'channel',
      description: 'Select the target type',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['post']
        }
      },
      options: [
        { name: 'Channel', value: 'channel', description: 'Send to a channel' },
        { name: 'User', value: 'user', description: 'Send to a user' }
      ]
    },
    // Channel ID with Resource Locator
    {
      name: 'channelId',
      displayName: 'Channel',
      type: 'resourceLocator',
      required: true,
      default: { mode: 'list', value: '' },
      description: 'Select the channel to send the message to',
      displayOptions: {
        show: {
          select: ['channel'],
          resource: ['message'],
          operation: ['post']
        }
      },
      modes: [
        {
          displayName: 'From List',
          name: 'list',
          type: 'list',
          placeholder: 'Select a channel...',
          typeOptions: {
            searchListMethod: 'getChannels',
            searchable: true
          }
        },
        {
          displayName: 'By ID',
          name: 'id',
          type: 'string',
          placeholder: 'C1234567890',
          validation: [
            {
              type: 'regex',
              properties: {
                regex: '^[CD][A-Z0-9]{8,}$',
                errorMessage: 'Channel ID must start with C or D followed by at least 8 alphanumeric characters'
              }
            }
          ]
        },
        {
          displayName: 'By Name',
          name: 'name',
          type: 'string',
          placeholder: 'general',
          hint: 'Use channel name without # symbol'
        }
      ]
    },
    // User ID with Resource Locator
    {
      name: 'userId',
      displayName: 'User',
      type: 'resourceLocator',
      required: true,
      default: { mode: 'list', value: '' },
      description: 'Select the user to send the message to',
      displayOptions: {
        show: {
          select: ['user'],
          resource: ['message'],
          operation: ['post']
        }
      },
      modes: [
        {
          displayName: 'From List',
          name: 'list',
          type: 'list',
          placeholder: 'Select a user...',
          typeOptions: {
            searchListMethod: 'getUsers',
            searchable: true
          }
        },
        {
          displayName: 'By ID',
          name: 'id',
          type: 'string',
          placeholder: 'U1234567890',
          validation: [
            {
              type: 'regex',
              properties: {
                regex: '^[UW][A-Z0-9]{8,}$',
                errorMessage: 'User ID must start with U or W followed by at least 8 alphanumeric characters'
              }
            }
          ]
        },
        {
          displayName: 'By Username',
          name: 'username',
          type: 'string',
          placeholder: 'username',
          hint: 'Use username without @ symbol'
        }
      ]
    },
    // Message Text
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: true,
      default: '',
      description: 'The text content of the message',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['post', 'update']
        }
      },
      typeOptions: {
        rows: 3
      }
    },
    // Message Formatting Options
    {
      name: 'otherOptions',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional message options',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['post', 'update']
        }
      },
      options: [
        {
          name: 'as_user',
          displayName: 'Send as User',
          type: 'boolean',
          default: false,
          description: 'Send the message as the authenticated user'
        },
        {
          name: 'username',
          displayName: 'Username',
          type: 'string',
          default: '',
          description: 'Username for the bot (if not sending as user)'
        },
        {
          name: 'icon_emoji',
          displayName: 'Icon Emoji',
          type: 'string',
          default: '',
          description: 'Emoji to use as the icon for the bot',
          placeholder: ':robot_face:'
        },
        {
          name: 'icon_url',
          displayName: 'Icon URL',
          type: 'string',
          default: '',
          description: 'URL to an image to use as icon for the bot'
        },
        {
          name: 'link_names',
          displayName: 'Link Names',
          type: 'boolean',
          default: true,
          description: 'Find and link user groups and channel names'
        },
        {
          name: 'thread_ts',
          displayName: 'Thread Timestamp',
          type: 'string',
          default: '',
          description: 'Timestamp of parent message to reply in thread'
        },
        {
          name: 'reply_broadcast',
          displayName: 'Reply Broadcast',
          type: 'boolean',
          default: false,
          description: 'Broadcast thread reply to channel'
        },
        {
          name: 'parse',
          displayName: 'Parse',
          type: 'options',
          default: 'none',
          description: 'Change how messages are treated',
          options: [
            { name: 'None', value: 'none' },
            { name: 'Full', value: 'full' }
          ]
        },
        {
          name: 'unfurl_links',
          displayName: 'Unfurl Links',
          type: 'boolean',
          default: true,
          description: 'Unfurl primarily text-based content'
        },
        {
          name: 'unfurl_media',
          displayName: 'Unfurl Media',
          type: 'boolean',
          default: true,
          description: 'Unfurl media content'
        }
      ]
    },
    // Blocks UI for Rich Formatting
    {
      name: 'blocksUi',
      displayName: 'Blocks',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Blocks for rich message formatting (alternative to text)',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['post', 'update']
        }
      },
      options: [
        {
          name: 'blocksValues',
          displayName: 'Block',
          values: [
            {
              name: 'type',
              displayName: 'Type',
              type: 'options',
              default: 'section',
              description: 'Block type',
              options: [
                { name: 'Section', value: 'section' },
                { name: 'Divider', value: 'divider' },
                { name: 'Header', value: 'header' },
                { name: 'Context', value: 'context' }
              ]
            },
            {
              name: 'text',
              displayName: 'Text',
              type: 'string',
              default: '',
              description: 'Block text content',
              displayOptions: {
                show: {
                  type: ['section', 'header', 'context']
                }
              }
            },
            {
              name: 'text_type',
              displayName: 'Text Type',
              type: 'options',
              default: 'mrkdwn',
              description: 'Text formatting type',
              displayOptions: {
                show: {
                  type: ['section', 'context']
                }
              },
              options: [
                { name: 'Markdown', value: 'mrkdwn' },
                { name: 'Plain Text', value: 'plain_text' }
              ]
            }
          ]
        }
      ]
    },
    // Attachments (Legacy)
    {
      name: 'attachments',
      displayName: 'Attachments',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Legacy attachment format',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['post']
        }
      },
      options: [
        {
          name: 'attachment',
          displayName: 'Attachment',
          values: [
            {
              name: 'color',
              displayName: 'Color',
              type: 'string',
              default: '',
              description: 'Color of the attachment (hex color or good/warning/danger)'
            },
            {
              name: 'pretext',
              displayName: 'Pretext',
              type: 'string',
              default: '',
              description: 'Text that appears before the attachment'
            },
            {
              name: 'title',
              displayName: 'Title',
              type: 'string',
              default: '',
              description: 'Title of the attachment'
            },
            {
              name: 'title_link',
              displayName: 'Title Link',
              type: 'string',
              default: '',
              description: 'URL to link the title to'
            },
            {
              name: 'text',
              displayName: 'Text',
              type: 'string',
              default: '',
              description: 'Main text of the attachment'
            },
            {
              name: 'fallback',
              displayName: 'Fallback',
              type: 'string',
              default: '',
              description: 'Fallback text for clients that cannot display attachments'
            },
            {
              name: 'footer',
              displayName: 'Footer',
              type: 'string',
              default: '',
              description: 'Footer text'
            }
          ]
        }
      ]
    },
    // Message ID for operations requiring it
    {
      name: 'messageId',
      displayName: 'Message',
      type: 'resourceLocator',
      required: true,
      default: { mode: 'id', value: '' },
      description: 'The message to operate on',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['update', 'delete', 'get']
        }
      },
      modes: [
        {
          displayName: 'By ID',
          name: 'id',
          type: 'string',
          placeholder: '1234567890.123456',
          hint: 'Message timestamp in format: 1234567890.123456'
        }
      ]
    },
    // Channel operations
    {
      name: 'channelData',
      displayName: 'Channel',
      type: 'resourceLocator',
      required: true,
      default: { mode: 'list', value: '' },
      description: 'Select the channel to operate on',
      displayOptions: {
        show: {
          resource: ['channel'],
          operation: ['archive', 'get', 'history', 'invite', 'join', 'kick', 'leave', 'rename', 'setPurpose', 'setTopic', 'unarchive']
        }
      },
      modes: [
        {
          displayName: 'From List',
          name: 'list',
          type: 'list',
          placeholder: 'Select a channel...',
          typeOptions: {
            searchListMethod: 'getChannels',
            searchable: true
          }
        },
        {
          displayName: 'By ID',
          name: 'id',
          type: 'string',
          placeholder: 'C1234567890'
        }
      ]
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
      description: 'Slack operation result'
    }
  ],
  credentials: [
    {
      name: 'slackApi',
      required: true,
      types: ['slackApi'],
      description: 'Slack API Token',
      documentationUrl: 'https://api.slack.com/authentication/token-types'
    },
    {
      name: 'slackOAuth2Api',
      required: false,
      types: ['slackOAuth2Api'],
      description: 'Slack OAuth2 API',
      documentationUrl: 'https://api.slack.com/authentication/oauth-v2'
    }
  ],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  webhookSupport: false,
  version: [1, 2, 3],
  defaults: {
    name: 'Slack',
    resource: 'message',
    operation: 'post',
    authentication: 'accessToken'
  },
  aliases: ['team chat', 'messaging', 'communication'],
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Send notifications to teams',
      'Post automated status updates',
      'Create interactive message workflows',
      'Broadcast alerts and warnings',
      'Share data summaries in channels',
      'Coordinate team communications'
    ],
    prerequisites: [
      'Slack workspace access',
      'Bot token with appropriate scopes',
      'Channel permissions configured'
    ],
    rateLimits: {
      requests: 100,
      window: 'minute',
      unit: 'requests'
    },
    errorHandling: {
      retryableErrors: ['Rate limit exceeded', 'Temporary server error'],
      nonRetryableErrors: ['Invalid token', 'Channel not found', 'User not found', 'Insufficient permissions'],
      documentation: 'Most errors are related to permissions or rate limits'
    }
  },
  examples: [
    {
      name: 'Send Message to Channel',
      description: 'Send a simple message to a Slack channel',
      workflow: {
        nodes: [
          {
            name: 'Send Message',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'message',
              operation: 'post',
              authentication: 'accessToken',
              select: 'channel',
              channelId: {
                __rl: true,
                mode: 'list',
                value: 'C0898R9G7JP',
                cachedResultName: 'general'
              },
              text: 'Hello from n8n! 👋'
            }
          }
        ]
      }
    },
    {
      name: 'Rich Message with Blocks',
      description: 'Send a formatted message using Slack blocks',
      workflow: {
        nodes: [
          {
            name: 'Rich Message',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'message',
              operation: 'post',
              authentication: 'accessToken',
              select: 'channel',
              channelId: {
                __rl: true,
                mode: 'name',
                value: 'alerts'
              },
              text: 'Fallback text for notifications',
              blocksUi: {
                blocksValues: [
                  {
                    type: 'header',
                    text: '🚨 System Alert'
                  },
                  {
                    type: 'section',
                    text: 'Server response time is above threshold',
                    text_type: 'mrkdwn'
                  },
                  {
                    type: 'context',
                    text: 'Triggered at {{$now}}',
                    text_type: 'mrkdwn'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Reply in Thread',
      description: 'Reply to a message in a thread',
      workflow: {
        nodes: [
          {
            name: 'Thread Reply',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'message',
              operation: 'post',
              authentication: 'accessToken',
              select: 'channel',
              channelId: {
                __rl: true,
                mode: 'id',
                value: '={{$json.channelId}}'
              },
              text: 'This is a reply in the thread',
              otherOptions: {
                thread_ts: '={{$json.messageTimestamp}}',
                reply_broadcast: false
              }
            }
          }
        ]
      }
    },
    {
      name: 'Send Direct Message',
      description: 'Send a private message to a user',
      workflow: {
        nodes: [
          {
            name: 'DM User',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'message',
              operation: 'post',
              authentication: 'accessToken',
              select: 'user',
              userId: {
                __rl: true,
                mode: 'list',
                value: 'U1234567890',
                cachedResultName: 'john.doe'
              },
              text: 'Hi! This is a private message from the automation system.'
            }
          }
        ]
      }
    }
  ]
};