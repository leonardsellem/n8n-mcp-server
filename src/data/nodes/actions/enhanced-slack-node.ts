import { NodeTypeInfo } from '../../node-types.js';

/**
 * Enhanced Slack Node - AI-Optimized Version
 * 
 * This version includes:
 * - Standardized authentication patterns
 * - AI-friendly descriptions with context
 * - Comprehensive examples for all major operations
 * - Clear usage guidance for AI agents
 */
export const slackNodeEnhanced: NodeTypeInfo = {
  name: 'n8n-nodes-base.slack',
  displayName: 'Slack',
  description: 'Send messages, manage channels, upload files, and interact with users in Slack workspaces. Ideal for notifications, team communication automation, and workflow updates.',
  category: 'Communication',
  subcategory: 'Team Chat',
  
  // Standardized credentials with clear documentation
  credentials: [
    {
      name: 'slackApi',
      required: true,
      types: ['apiToken'],
      description: 'Slack Bot Token for API access',
      documentationUrl: 'https://api.slack.com/authentication/token-types',
      displayOptions: {
        show: {
          authentication: ['accessToken']
        }
      }
    },
    {
      name: 'slackOAuth2Api',
      required: true,
      types: ['oauth2'],
      description: 'OAuth2 authentication for user permissions',
      documentationUrl: 'https://api.slack.com/authentication/oauth-v2',
      displayOptions: {
        show: {
          authentication: ['oAuth2']
        }
      }
    }
  ],

  properties: [
    {
      name: 'authentication',
      displayName: 'Authentication',
      type: 'options',
      required: true,
      default: 'accessToken',
      description: 'Method to authenticate with Slack. Use Bot Token for most automation scenarios, OAuth2 for user-specific actions.',
      options: [
        {
          name: 'Access Token (Bot)',
          value: 'accessToken',
          description: 'Use bot token for automated messaging and channel management'
        },
        {
          name: 'OAuth2 (User)',
          value: 'oAuth2',
          description: 'Use user credentials for personal actions and private channel access'
        }
      ]
    },
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The Slack resource to work with. Messages are most common for notifications, channels for workspace management.',
      options: [
        { 
          name: 'Message', 
          value: 'message', 
          description: 'Send, update, delete, or search messages in channels and DMs' 
        },
        { 
          name: 'Channel', 
          value: 'channel', 
          description: 'Create, manage, and get information about channels' 
        },
        { 
          name: 'File', 
          value: 'file', 
          description: 'Upload, download, and manage files in Slack' 
        },
        { 
          name: 'User', 
          value: 'user', 
          description: 'Get user information and manage user presence' 
        },
        { 
          name: 'Reaction', 
          value: 'reaction', 
          description: 'Add, remove, and list emoji reactions on messages' 
        }
      ]
    },
    
    // MESSAGE OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'send',
      description: 'The action to perform. Send is most common for notifications, Get for retrieving message history.',
      displayOptions: {
        show: {
          resource: ['message']
        }
      },
      options: [
        {
          name: 'Send',
          value: 'send',
          description: 'Send a new message to a channel or user',
          action: 'Send a message'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Edit an existing message (requires message timestamp)',
          action: 'Update a message'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a message (requires message timestamp)',
          action: 'Delete a message'
        },
        {
          name: 'Get Permalink',
          value: 'getPermalink',
          description: 'Get a permanent link to a specific message',
          action: 'Get message permalink'
        },
        {
          name: 'Search',
          value: 'search',
          description: 'Search for messages across the workspace',
          action: 'Search messages'
        }
      ]
    },

    // CHANNEL OPERATIONS
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'Channel management operations. Create for new channels, Get for information, List for discovery.',
      displayOptions: {
        show: {
          resource: ['channel']
        }
      },
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new public or private channel',
          action: 'Create a channel'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get detailed information about a specific channel',
          action: 'Get channel info'
        },
        {
          name: 'List',
          value: 'getAll',
          description: 'Get a list of all channels the bot can access',
          action: 'List channels'
        },
        {
          name: 'Archive',
          value: 'archive',
          description: 'Archive a channel (makes it read-only)',
          action: 'Archive channel'
        },
        {
          name: 'Unarchive',
          value: 'unarchive',
          description: 'Unarchive a previously archived channel',
          action: 'Unarchive channel'
        },
        {
          name: 'Invite User',
          value: 'invite',
          description: 'Invite a user to join a channel',
          action: 'Invite user to channel'
        },
        {
          name: 'Remove User',
          value: 'kick',
          description: 'Remove a user from a channel',
          action: 'Remove user from channel'
        }
      ]
    },

    // MESSAGE CONTENT FIELDS
    {
      name: 'channel',
      displayName: 'Channel',
      type: 'string',
      required: true,
      default: '',
      placeholder: '#general, @username, or C1234567890',
      description: 'Target channel, user, or channel ID. Use # for channels, @ for users, or direct channel IDs.',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['send', 'update', 'delete', 'getPermalink']
        }
      }
    },
    {
      name: 'text',
      displayName: 'Message Text',
      type: 'string',
      required: true,
      default: '',
      description: 'The message content. Supports Slack markdown formatting (@mentions, *bold*, _italic_, `code`).',
      typeOptions: {
        rows: 4
      },
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['send', 'update']
        }
      }
    },
    {
      name: 'ts',
      displayName: 'Message Timestamp',
      type: 'string',
      required: true,
      default: '',
      placeholder: '1234567890.123456',
      description: 'The timestamp of the message to update or delete. Found in message responses as "ts" field.',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['update', 'delete', 'getPermalink']
        }
      }
    },

    // CHANNEL CREATION FIELDS
    {
      name: 'channelName',
      displayName: 'Channel Name',
      type: 'string',
      required: true,
      default: '',
      placeholder: 'my-new-channel',
      description: 'Name for the new channel (lowercase, no spaces, use hyphens or underscores).',
      displayOptions: {
        show: {
          resource: ['channel'],
          operation: ['create']
        }
      }
    },

    // ADVANCED OPTIONS
    {
      name: 'additionalFields',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},
      placeholder: 'Add Option',
      description: 'Optional settings for enhanced functionality.',
      displayOptions: {
        show: {
          resource: ['message'],
          operation: ['send', 'update']
        }
      },
      options: [
        {
      name: 'username',
      displayName: 'Bot Username',
      type: 'string',
      required: false,
      default: '',
          description: 'Override the bot\'s display name for this message'
    },
        {
      name: 'icon_emoji',
      displayName: 'Bot Icon (Emoji)',
      type: 'string',
      required: false,
      default: '',
          placeholder: ':robot_face:',
          description: 'Emoji to use as bot icon (e.g., :robot_face:)'
    },
        {
      name: 'thread_ts',
      displayName: 'Thread Timestamp',
      type: 'string',
      required: false,
      default: '',
          description: 'Reply to a specific message thread by providing the parent message timestamp'
    },
        {
      name: 'link_names',
      displayName: 'Link Names',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Auto-link @mentions and #channels in message text'
    },
        {
      name: 'unfurl_links',
      displayName: 'Unfurl Links',
      type: 'boolean',
      required: false,
      default: true,
          description: 'Enable automatic link previews in messages'
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
      description: 'Slack API response with message/channel details and metadata'
    }
  ],

  regularNode: true,
  version: [1, 2],
  defaults: {
    name: 'Slack',
    color: '#4A154B'
  },
  aliases: ['slack', 'chat', 'message', 'notification', 'team'],
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',

  // AI-OPTIMIZED EXAMPLES
  examples: [
    {
      name: 'Send Simple Notification',
      description: 'Send a basic notification message to a channel',
      complexity: 'beginner',
      category: 'notification',
      useCase: 'Alert team about workflow completion or status updates',
      workflow: {
        nodes: [
          {
            name: 'Slack Notification',
            type: 'n8n-nodes-base.slack',
            parameters: {
              authentication: 'accessToken',
              resource: 'message',
              operation: 'send',
              channel: '#general',
              text: 'Workflow completed successfully! ✅'
            }
          }
        ]
      }
    },
    {
      name: 'Send Rich Message with Mentions',
      description: 'Send a formatted message with user mentions and formatting',
      complexity: 'intermediate',
      category: 'communication',
      useCase: 'Notify specific team members with detailed status information',
      workflow: {
        nodes: [
          {
            name: 'Rich Slack Message',
            type: 'n8n-nodes-base.slack',
            parameters: {
              authentication: 'accessToken',
              resource: 'message',
              operation: 'send',
              channel: '#dev-team',
              text: 'Hey <@user123>! The deployment to *production* is complete.\n\n:white_check_mark: Database migration successful\n:white_check_mark: API tests passing\n:warning: Monitor logs for the next hour',
              additionalFields: {
                username: 'DeployBot',
                icon_emoji: ':rocket:',
                link_names: true,
                unfurl_links: false
              }
            }
          }
        ]
      }
    },
    {
      name: 'Reply to Thread',
      description: 'Reply to an existing message thread',
      complexity: 'intermediate',
      category: 'communication',
      useCase: 'Provide updates or responses to ongoing discussions',
      workflow: {
        nodes: [
          {
            name: 'Thread Reply',
            type: 'n8n-nodes-base.slack',
            parameters: {
              authentication: 'accessToken',
              resource: 'message',
              operation: 'send',
              channel: '#support',
              text: 'Issue has been resolved. Closing ticket.',
              additionalFields: {
                thread_ts: '1234567890.123456'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Create Project Channel',
      description: 'Create a new channel for project collaboration',
      complexity: 'beginner',
      category: 'management',
      useCase: 'Automatically create channels for new projects or teams',
      workflow: {
        nodes: [
          {
            name: 'Create Channel',
            type: 'n8n-nodes-base.slack',
            parameters: {
              authentication: 'accessToken',
              resource: 'channel',
              operation: 'create',
              channelName: 'project-alpha-team'
            }
          }
        ]
      }
    },
    {
      name: 'Update Message with Status',
      description: 'Update an existing message with new information',
      complexity: 'advanced',
      category: 'automation',
      useCase: 'Dynamically update status messages as workflow progresses',
      workflow: {
        nodes: [
          {
            name: 'Update Status Message',
            type: 'n8n-nodes-base.slack',
            parameters: {
              authentication: 'accessToken',
              resource: 'message',
              operation: 'update',
              channel: '#deployments',
              ts: '{{$json["original_message_ts"]}}',
              text: 'Deployment Status: *COMPLETED* ✅\n\nDuration: 3m 42s\nSuccess Rate: 100%\nNext deployment: Tomorrow 2 PM'
            }
          }
        ]
      }
    }
  ],

  // AI METADATA
  aiMetadata: {
    aiOptimized: true,
    rateLimits: {
      requests: 100,
      window: 'minute',
      unit: 'per app per workspace'
    },
    commonPatterns: [
      'notification-system',
      'status-updates',
      'team-communication',
      'incident-response',
      'deployment-alerts'
    ],
    integrationComplexity: 'low',
    prerequisites: [
      'Slack workspace admin access for bot setup',
      'Appropriate channel permissions',
      'Bot token with required scopes'
    ],
    errorHandling: {
      retryableErrors: ['rate_limited', 'server_error', 'timeout'],
      nonRetryableErrors: ['invalid_auth', 'channel_not_found', 'user_not_found', 'message_not_found'],
      documentation: 'https://api.slack.com/web#errors'
    }
  },

  usageNotes: 'For AI agents: Always specify channel with # prefix for public channels or @ for direct messages. Message timestamps are required for update/delete operations and can be found in the response of send operations. Rate limits apply per workspace.',

  integrationGuide: 'Common workflow: 1) Send initial status message and store timestamp, 2) Update message as process progresses, 3) Send final completion notification. For channels, create before inviting users. Always handle rate limiting with retry logic.'
};

export default slackNodeEnhanced;