import { NodeTypeInfo } from '../../node-types.js';

export const slackNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.slack',
  displayName: 'Slack',
  description: 'Use the Slack node to automate work in Slack, and integrate Slack with other applications. n8n has built-in support for a wide range of Slack features, including creating, archiving, and closing channels, getting users and files, as well as deleting messages.',
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
        { name: 'Channel', value: 'channel', description: 'Work with Slack channels' },
        { name: 'File', value: 'file', description: 'Manage files in Slack' },
        { name: 'Message', value: 'message', description: 'Handle Slack messages' },
        { name: 'Reaction', value: 'reaction', description: 'Manage message reactions' },
        { name: 'Star', value: 'star', description: 'Work with starred items' },
        { name: 'User', value: 'user', description: 'Manage users' },
        { name: 'User Group', value: 'userGroup', description: 'Manage user groups' },
        { name: 'User Profile', value: 'userProfile', description: 'Manage user profiles' }
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
        { name: 'Archive', value: 'archive', description: 'Archive a channel' },
        { name: 'Close', value: 'close', description: 'Close a direct message or multi-person direct message' },
        { name: 'Create', value: 'create', description: 'Create a public or private channel-based conversation' },
        { name: 'Get', value: 'get', description: 'Get information about a channel' },
        { name: 'Get Many', value: 'getAll', description: 'Get a list of channels in Slack' },
        { name: 'History', value: 'history', description: 'Get a channel\'s history of messages and events' },
        { name: 'Invite', value: 'invite', description: 'Invite a user to a channel' },
        { name: 'Join', value: 'join', description: 'Join an existing channel' },
        { name: 'Kick', value: 'kick', description: 'Remove a user from a channel' },
        { name: 'Leave', value: 'leave', description: 'Leave a channel' },
        { name: 'Member', value: 'member', description: 'List the members of a channel' },
        { name: 'Open', value: 'open', description: 'Open or resume a direct message or multi-person direct message' },
        { name: 'Rename', value: 'rename', description: 'Rename a channel' },
        { name: 'Replies', value: 'replies', description: 'Get a thread of messages posted to a channel' },
        { name: 'Set Purpose', value: 'setPurpose', description: 'Set purpose of a channel' },
        { name: 'Set Topic', value: 'setTopic', description: 'Set topic of a channel' },
        { name: 'Unarchive', value: 'unarchive', description: 'Unarchive a channel' },
        // File operations
        { name: 'Upload', value: 'upload', description: 'Create or upload an existing file' },
        // Message operations
        { name: 'Delete', value: 'delete', description: 'Delete a message' },
        { name: 'Get Permalink', value: 'getPermalink', description: 'Get a message\'s permalink' },
        { name: 'Search', value: 'search', description: 'Search for messages' },
        { name: 'Send', value: 'send', description: 'Send a message' },
        { name: 'Send and Wait for Approval', value: 'sendAndWaitForApproval', description: 'Send a message and wait for approval from the recipient before continuing' },
        { name: 'Update', value: 'update', description: 'Update a message' },
        // Reaction operations
        { name: 'Add', value: 'add', description: 'Add a reaction to a message' },
        { name: 'Remove', value: 'remove', description: 'Remove a reaction from a message' },
        // Star operations
        // User operations
        { name: 'Get User\'s Profile', value: 'getUserProfile', description: 'Get user\'s profile' },
        { name: 'Get User\'s Status', value: 'getUserStatus', description: 'Get user\'s status' },
        { name: 'Update User\'s Profile', value: 'updateUserProfile', description: 'Update user\'s profile' },
        // User Group operations
        { name: 'Disable', value: 'disable', description: 'Disable a user group' },
        { name: 'Enable', value: 'enable', description: 'Enable a user group' }
      ]
    },
    {
      name: 'channel',
      displayName: 'Channel',
      type: 'string',
      required: false,
      default: '',
      description: 'The channel to send the message to. Can be a public channel, private group or IM channel. Can be an encoded ID, or a name.'
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
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The text content of the message'
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
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to operate on'
    },
    {
      name: 'fileId',
      displayName: 'File ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the file to operate on'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the file to upload'
    },
    {
      name: 'fileContent',
      displayName: 'File Content',
      type: 'string',
      required: false,
      default: '',
      description: 'The content of the file to upload'
    },
    {
      name: 'emoji',
      displayName: 'Emoji',
      type: 'string',
      required: false,
      default: '',
      description: 'The emoji to use for the reaction (without colons)'
    },
    {
      name: 'threadTs',
      displayName: 'Thread Timestamp',
      type: 'string',
      required: false,
      default: '',
      description: 'The timestamp of the parent message to reply to'
    },
    {
      name: 'asUser',
      displayName: 'As User',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to post as the authed user instead of as a bot'
    },
    {
      name: 'attachments',
      displayName: 'Attachments',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of attachment objects'
    },
    {
      name: 'blocks',
      displayName: 'Blocks',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON array of block objects'
    },
    {
      name: 'iconEmoji',
      displayName: 'Icon Emoji',
      type: 'string',
      required: false,
      default: '',
      description: 'Emoji to use as the icon for this message'
    },
    {
      name: 'iconUrl',
      displayName: 'Icon URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to an image to use as the icon for this message'
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'Set your bot\'s user name'
    },
    {
      name: 'parse',
      displayName: 'Parse',
      type: 'options',
      required: false,
      default: 'none',
      description: 'Change how messages are treated',
      options: [
        { name: 'None', value: 'none', description: 'No parsing' },
        { name: 'Full', value: 'full', description: 'Parse links and channel names' }
      ]
    },
    {
      name: 'linkNames',
      displayName: 'Link Names',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Find and link channel names and usernames'
    },
    {
      name: 'unfurlLinks',
      displayName: 'Unfurl Links',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Pass true to enable unfurling of primarily text-based content'
    },
    {
      name: 'unfurlMedia',
      displayName: 'Unfurl Media',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Pass false to disable unfurling of media content'
    },
    {
      name: 'replyBroadcast',
      displayName: 'Reply Broadcast',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
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
      description: 'The processed Slack data'
    }
  ],
  credentials: ['slackApi', 'slackOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Message',
      description: 'Send a simple message to a Slack channel',
      workflow: {
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'message',
              operation: 'send',
              channel: '#general',
              text: 'Hello from n8n workflow!'
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
              resource: 'file',
              operation: 'upload',
              channel: '#general',
              fileName: 'report.txt',
              fileContent: 'This is a test file content'
            }
          }
        ]
      }
    },
    {
      name: 'Create Channel',
      description: 'Create a new Slack channel',
      workflow: {
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'channel',
              operation: 'create',
              channel: 'new-project-channel'
            }
          }
        ]
      }
    },
    {
      name: 'Add Reaction',
      description: 'Add a reaction to a message',
      workflow: {
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            parameters: {
              resource: 'reaction',
              operation: 'add',
              channel: '#general',
              messageId: '{{$json["messageId"]}}',
              emoji: 'thumbsup'
            }
          }
        ]
      }
    }
  ]
};

export const slackTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.slackTrigger',
  displayName: 'Slack Trigger',
  description: 'Use the Slack Trigger node to respond to events in Slack and integrate Slack with other applications. n8n has built-in support for a wide range of Slack events, including new messages, reactions, and new channels.',
  category: 'Communication',
  subcategory: 'Team Chat',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['message'],
      description: 'The events to trigger on',
      options: [
        { name: 'Any Event', value: 'any', description: 'The node triggers on any event in Slack' },
        { name: 'Bot / App Mention', value: 'app_mention', description: 'The node triggers when your bot or app is mentioned in a channel the app is in' },
        { name: 'File Made Public', value: 'file_public', description: 'The node triggers when a file is made public' },
        { name: 'File Shared', value: 'file_shared', description: 'The node triggers when a file is shared in a channel the app is in' },
        { name: 'New Message Posted to Channel', value: 'message', description: 'The node triggers when a new message is posted to a channel the app is in' },
        { name: 'New Public Channel Created', value: 'channel_created', description: 'The node triggers when a new public channel is created' },
        { name: 'New User', value: 'team_join', description: 'The node triggers when a new user is added to Slack' },
        { name: 'Reaction Added', value: 'reaction_added', description: 'The node triggers when a reaction is added to a message the app is added to' }
      ]
    },
    {
      name: 'watchWholeWorkspace',
      displayName: 'Watch Whole Workspace',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the node should watch for the selected Events in all channels in the workspace'
    },
    {
      name: 'channelToWatch',
      displayName: 'Channel to Watch',
      type: 'string',
      required: false,
      default: '',
      description: 'The channel to watch for events. Only used if Watch Whole Workspace is false'
    },
    {
      name: 'downloadFiles',
      displayName: 'Download Files',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to download files and use them in the node\'s output'
    },
    {
      name: 'resolveIds',
      displayName: 'Resolve IDs',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to resolve the IDs to their respective names and return them'
    },
    {
      name: 'ignoreUsers',
      displayName: 'Usernames or IDs to ignore',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated string of usernames or user IDs to ignore events from'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Slack events occur'
    }
  ],
  credentials: ['slackApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Channel Messages',
      description: 'Trigger workflow when new messages are posted to a specific channel',
      workflow: {
        nodes: [
          {
            name: 'Slack Trigger',
            type: 'n8n-nodes-base.slackTrigger',
            parameters: {
              events: ['message'],
              watchWholeWorkspace: false,
              channelToWatch: '#general',
              resolveIds: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Bot Mentions',
      description: 'Trigger when the bot is mentioned anywhere in the workspace',
      workflow: {
        nodes: [
          {
            name: 'Slack Trigger',
            type: 'n8n-nodes-base.slackTrigger',
            parameters: {
              events: ['app_mention'],
              watchWholeWorkspace: true,
              resolveIds: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor File Shares',
      description: 'Trigger when files are shared in channels',
      workflow: {
        nodes: [
          {
            name: 'Slack Trigger',
            type: 'n8n-nodes-base.slackTrigger',
            parameters: {
              events: ['file_shared'],
              watchWholeWorkspace: true,
              downloadFiles: true,
              resolveIds: true
            }
          }
        ]
      }
    },
    {
      name: 'Monitor New Users',
      description: 'Trigger when new users join the workspace',
      workflow: {
        nodes: [
          {
            name: 'Slack Trigger',
            type: 'n8n-nodes-base.slackTrigger',
            parameters: {
              events: ['team_join'],
              watchWholeWorkspace: true,
              resolveIds: true
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const slackNodes: NodeTypeInfo[] = [slackNode, slackTriggerNode];

// Export individual actions for the regular Slack node
export const slackActions = [
  // Channel actions
  'archive_channel',
  'close_channel',
  'create_channel',
  'get_channel',
  'get_many_channels',
  'get_channel_history',
  'invite_user_to_channel',
  'join_channel',
  'kick_user_from_channel',
  'leave_channel',
  'list_channel_members',
  'open_channel',
  'rename_channel',
  'get_channel_replies',
  'set_channel_purpose',
  'set_channel_topic',
  'unarchive_channel',
  // File actions
  'get_file',
  'get_many_files',
  'upload_file',
  // Message actions
  'delete_message',
  'get_message_permalink',
  'search_messages',
  'send_message',
  'send_message_and_wait_for_approval',
  'update_message',
  // Reaction actions
  'add_reaction',
  'get_message_reactions',
  'remove_reaction',
  // Star actions
  'add_star',
  'delete_star',
  'get_many_stars',
  // User actions
  'get_user',
  'get_many_users',
  'get_user_profile',
  'get_user_status',
  'update_user_profile',
  // User Group actions
  'create_user_group',
  'disable_user_group',
  'enable_user_group',
  'get_many_user_groups',
  'update_user_group'
];

// Export trigger events
export const slackTriggers = [
  'any_event',
  'app_mention',
  'file_made_public',
  'file_shared',
  'message_posted',
  'channel_created',
  'user_joined',
  'reaction_added'
];