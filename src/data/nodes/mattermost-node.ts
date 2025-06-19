import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const mattermostNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mattermost',
  displayName: 'Mattermost',
  description: 'Use the Mattermost node to automate work in Mattermost, and integrate Mattermost with other applications. Supports creating, deleting, and getting channels and users, posting messages, and adding reactions.',
  category: 'Communication',
  subcategory: 'Chat',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'message',
      description: 'The resource to operate on',
      options: [
        { name: 'Channel', value: 'channel', description: 'Manage channels' },
        { name: 'Message', value: 'message', description: 'Send and manage messages' },
        { name: 'Reaction', value: 'reaction', description: 'Manage reactions to posts' },
        { name: 'User', value: 'user', description: 'Manage users' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'post',
      description: 'The operation to perform',
      options: [
        { name: 'Add User to Channel', value: 'addUser', description: 'Add a user to a channel' },
        { name: 'Create Channel', value: 'create', description: 'Create a new channel' },
        { name: 'Delete Channel', value: 'delete', description: 'Soft delete a channel' },
        { name: 'Get Channel Members', value: 'members', description: 'Get a page of members for a channel' },
        { name: 'Restore Channel', value: 'restore', description: 'Restore a soft deleted channel' },
        { name: 'Search Channel', value: 'search', description: 'Search for a channel' },
        { name: 'Get Channel Statistics', value: 'statistics', description: 'Get statistics for a channel' },
        { name: 'Delete Message', value: 'deletePost', description: 'Soft delete a post' },
        { name: 'Post Message', value: 'post', description: 'Post a message into a channel' },
        { name: 'Post Ephemeral Message', value: 'postEphemeral', description: 'Post an ephemeral message into a channel' },
        { name: 'Add Reaction', value: 'addReaction', description: 'Add a reaction to a post' },
        { name: 'Remove Reaction', value: 'removeReaction', description: 'Remove a reaction from a post' },
        { name: 'Get Reactions', value: 'getReactions', description: 'Get all reactions to posts' },
        { name: 'Create User', value: 'createUser', description: 'Create a new user' },
        { name: 'Deactivate User', value: 'deactivateUser', description: 'Deactivate user and revoke sessions' },
        { name: 'Get All Users', value: 'getAll', description: 'Retrieve all users' },
        { name: 'Get User by Email', value: 'getByEmail', description: 'Get a user by email' },
        { name: 'Get User by ID', value: 'getById', description: 'Get a user by ID' },
        { name: 'Invite User to Team', value: 'invite', description: 'Invite user to team' }
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
      name: 'channelName',
      displayName: 'Channel Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the channel'
    },
    {
      name: 'channelDisplayName',
      displayName: 'Channel Display Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The display name of the channel'
    },
    {
      name: 'channelType',
      displayName: 'Channel Type',
      type: 'options',
      required: false,
      default: 'O',
      description: 'The type of channel to create',
      options: [
        { name: 'Public Channel', value: 'O', description: 'Open channel' },
        { name: 'Private Channel', value: 'P', description: 'Private channel' },
        { name: 'Direct Message', value: 'D', description: 'Direct message channel' }
      ]
    },
    {
      name: 'channelPurpose',
      displayName: 'Channel Purpose',
      type: 'string',
      required: false,
      default: '',
      description: 'The purpose of the channel'
    },
    {
      name: 'channelHeader',
      displayName: 'Channel Header',
      type: 'string',
      required: false,
      default: '',
      description: 'The header of the channel'
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The message content to post'
    },
    {
      name: 'postId',
      displayName: 'Post ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the post to operate on'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user'
    },
    {
      name: 'username',
      displayName: 'Username',
      type: 'string',
      required: false,
      default: '',
      description: 'The username'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'The email address'
    },
    {
      name: 'firstName',
      displayName: 'First Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The first name of the user'
    },
    {
      name: 'lastName',
      displayName: 'Last Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The last name of the user'
    },
    {
      name: 'password',
      displayName: 'Password',
      type: 'string',
      required: false,
      default: '',
      description: 'The password for the user'
    },
    {
      name: 'teamId',
      displayName: 'Team ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the team'
    },
    {
      name: 'emojiName',
      displayName: 'Emoji Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the emoji for the reaction'
    },
    {
      name: 'searchTerm',
      displayName: 'Search Term',
      type: 'string',
      required: false,
      default: '',
      description: 'The term to search for'
    },
    {
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
      default: 0,
      description: 'Page number for pagination'
    },
    {
      name: 'perPage',
      displayName: 'Per Page',
      type: 'number',
      required: false,
      default: 60,
      description: 'Number of items per page'
    },
    {
      name: 'includeDeleted',
      displayName: 'Include Deleted',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Include deleted channels in search results'
    },
    {
      name: 'attachments',
      displayName: 'Attachments',
      type: 'string',
      required: false,
      default: '',
      description: 'Message attachments in JSON format'
    },
    {
      name: 'props',
      displayName: 'Props',
      type: 'string',
      required: false,
      default: '',
      description: 'Additional properties for the post in JSON format'
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
      description: 'The processed Mattermost response data'
    }
  ],
  credentials: ['mattermost'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Post Message to Channel',
      description: 'Post a simple message to a Mattermost channel',
      workflow: {
        nodes: [
          {
            name: 'Mattermost',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'message',
              operation: 'post',
              channelId: 'channel_id_here',
              message: 'Hello from n8n! 👋'
            }
          }
        ]
      }
    },
    {
      name: 'Create Channel and Post Message',
      description: 'Create a new Mattermost channel and post a welcome message',
      workflow: {
        nodes: [
          {
            name: 'Create Channel',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'channel',
              operation: 'create',
              channelName: 'n8n-automation',
              channelDisplayName: 'n8n Automation',
              channelType: 'O',
              channelPurpose: 'Automated messages from n8n workflows'
            }
          },
          {
            name: 'Post Welcome Message',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'message',
              operation: 'post',
              channelId: '{{ $json.id }}',
              message: 'Welcome to the n8n automation channel! 🚀'
            }
          }
        ]
      }
    },
    {
      name: 'Add Reaction to Post',
      description: 'Add an emoji reaction to a Mattermost post',
      workflow: {
        nodes: [
          {
            name: 'Mattermost',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'reaction',
              operation: 'addReaction',
              postId: 'post_id_here',
              emojiName: 'thumbsup'
            }
          }
        ]
      }
    },
    {
      name: 'Get Channel Statistics',
      description: 'Retrieve statistics for a Mattermost channel',
      workflow: {
        nodes: [
          {
            name: 'Mattermost',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'channel',
              operation: 'statistics',
              channelId: 'channel_id_here'
            }
          }
        ]
      }
    },
    {
      name: 'Create User and Invite to Team',
      description: 'Create a new user and invite them to a team',
      workflow: {
        nodes: [
          {
            name: 'Create User',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'user',
              operation: 'createUser',
              username: 'newuser',
              email: 'newuser@example.com',
              password: 'SecurePassword123',
              firstName: 'New',
              lastName: 'User'
            }
          },
          {
            name: 'Invite to Team',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'user',
              operation: 'invite',
              email: 'newuser@example.com',
              teamId: 'team_id_here'
            }
          }
        ]
      }
    },
    {
      name: 'Search Channels',
      description: 'Search for channels matching a term',
      workflow: {
        nodes: [
          {
            name: 'Mattermost',
            type: 'n8n-nodes-base.mattermost',
            parameters: {
              resource: 'channel',
              operation: 'search',
              searchTerm: 'automation',
              includeDeleted: false
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other files
export const mattermostNodes: NodeTypeInfo[] = [mattermostNode];

// Export individual actions for the Mattermost node
export const mattermostActions = [
  'add_user_to_channel',
  'create_channel',
  'delete_channel',
  'get_channel_members',
  'restore_channel',
  'search_channel',
  'get_channel_statistics',
  'delete_message',
  'post_message',
  'post_ephemeral_message',
  'add_reaction',
  'remove_reaction',
  'get_reactions',
  'create_user',
  'deactivate_user',
  'get_all_users',
  'get_user_by_email',
  'get_user_by_id',
  'invite_user_to_team'
];

// No trigger node exists for Mattermost (based on 404 response)
export const mattermostTriggers: string[] = [];