import { NodeTypeInfo } from '../../node-types.js';

export const mailchimpNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailchimp',
  displayName: 'Mailchimp',
  description: 'Use the Mailchimp node to automate work in Mailchimp, and integrate Mailchimp with other applications. Supports creating, updating, and deleting campaigns, as well as managing list groups, members, and member tags.',
  category: 'Communication',
  subcategory: 'Email Marketing',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'campaign',
      description: 'The resource to operate on',
      options: [
        { name: 'Campaign', value: 'campaign', description: 'Work with email campaigns' },
        { name: 'List Group', value: 'listGroup', description: 'Manage list groups' },
        { name: 'Member', value: 'member', description: 'Handle list members' },
        { name: 'Member Tag', value: 'memberTag', description: 'Manage member tags' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'getAll',
      description: 'The operation to perform',
      options: [
        { name: 'Create', value: 'create', description: 'Create a new item' },
        { name: 'Delete', value: 'delete', description: 'Delete an item' },
        { name: 'Get', value: 'get', description: 'Get an item' },
        { name: 'Get All', value: 'getAll', description: 'Get multiple items' },
        { name: 'Replicate', value: 'replicate', description: 'Replicate a campaign' },
        { name: 'Resend', value: 'resend', description: 'Create a Resend to Non-Openers version' },
        { name: 'Send', value: 'send', description: 'Send a campaign' },
        { name: 'Update', value: 'update', description: 'Update an item' },
        { name: 'Add Tags', value: 'addTags', description: 'Add tags to a member' },
        { name: 'Remove Tags', value: 'removeTags', description: 'Remove tags from a member' }
      ]
    },
    {
      name: 'campaignId',
      displayName: 'Campaign ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the campaign to operate on'
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the list to work with'
    },
    {
      name: 'memberId',
      displayName: 'Member ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID or email address of the member'
    },
    {
      name: 'groupId',
      displayName: 'Group ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the group to work with'
    },
    {
      name: 'emailAddress',
      displayName: 'Email Address',
      type: 'string',
      required: false,
      default: '',
      description: 'The email address of the member'
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'subscribed',
      description: 'The subscription status of the member',
      options: [
        { name: 'Subscribed', value: 'subscribed', description: 'Active subscriber' },
        { name: 'Unsubscribed', value: 'unsubscribed', description: 'Unsubscribed member' },
        { name: 'Cleaned', value: 'cleaned', description: 'Cleaned from list' },
        { name: 'Pending', value: 'pending', description: 'Pending confirmation' }
      ]
    },
    {
      name: 'mergeFields',
      displayName: 'Merge Fields',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Merge fields for the member'
    },
    {
      name: 'interests',
      displayName: 'Interests',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Interest categories for the member'
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of tags'
    },
    {
      name: 'skipMergeValidation',
      displayName: 'Skip Merge Validation',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Skip validation of merge fields'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of results to skip'
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
      description: 'The processed Mailchimp data'
    }
  ],
  credentials: ['mailchimpApi', 'mailchimpOAuth2'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Get All Campaigns',
      description: 'Retrieve all campaigns from Mailchimp',
      workflow: {
        nodes: [
          {
            name: 'Mailchimp',
            type: 'n8n-nodes-base.mailchimp',
            parameters: {
              resource: 'campaign',
              operation: 'getAll',
              limit: 10
            }
          }
        ]
      }
    },
    {
      name: 'Add Member to List',
      description: 'Add a new member to a Mailchimp list',
      workflow: {
        nodes: [
          {
            name: 'Mailchimp',
            type: 'n8n-nodes-base.mailchimp',
            parameters: {
              resource: 'member',
              operation: 'create',
              listId: 'your-list-id',
              emailAddress: 'user@example.com',
              status: 'subscribed'
            }
          }
        ]
      }
    },
    {
      name: 'Send Campaign',
      description: 'Send an existing campaign',
      workflow: {
        nodes: [
          {
            name: 'Mailchimp',
            type: 'n8n-nodes-base.mailchimp',
            parameters: {
              resource: 'campaign',
              operation: 'send',
              campaignId: '{{$json["campaignId"]}}'
            }
          }
        ]
      }
    }
  ]
};

export const mailchimpTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailchimpTrigger',
  displayName: 'Mailchimp Trigger',
  description: 'Triggers the workflow when events occur in Mailchimp, such as new subscribers, unsubscribes, or campaign activity.',
  category: 'Communication',
  subcategory: 'Email Marketing',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'subscribe',
      description: 'The event to listen for',
      options: [
        { name: 'Subscribe', value: 'subscribe', description: 'When someone subscribes to a list' },
        { name: 'Unsubscribe', value: 'unsubscribe', description: 'When someone unsubscribes from a list' },
        { name: 'Profile Update', value: 'profile', description: 'When a subscriber updates their profile' },
        { name: 'Email Update', value: 'upemail', description: 'When a subscriber changes their email' },
        { name: 'Cleaned', value: 'cleaned', description: 'When an email is cleaned from a list' },
        { name: 'Campaign Send', value: 'campaign', description: 'When a campaign is sent' }
      ]
    },
    {
      name: 'listId',
      displayName: 'List ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the list to monitor'
    },
    {
      name: 'source',
      displayName: 'Source',
      type: 'options',
      required: false,
      default: 'any',
      description: 'Filter by subscription source',
      options: [
        { name: 'Any', value: 'any', description: 'Any source' },
        { name: 'User', value: 'user', description: 'User initiated' },
        { name: 'Admin', value: 'admin', description: 'Admin initiated' },
        { name: 'API', value: 'api', description: 'API initiated' }
      ]
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Mailchimp events occur'
    }
  ],
  credentials: ['mailchimpApi', 'mailchimpOAuth2'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Subscribers',
      description: 'Trigger workflow when someone subscribes to a list',
      workflow: {
        nodes: [
          {
            name: 'Mailchimp Trigger',
            type: 'n8n-nodes-base.mailchimpTrigger',
            parameters: {
              event: 'subscribe',
              listId: 'your-list-id',
              source: 'any'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Unsubscribes',
      description: 'Trigger workflow when someone unsubscribes',
      workflow: {
        nodes: [
          {
            name: 'Mailchimp Trigger',
            type: 'n8n-nodes-base.mailchimpTrigger',
            parameters: {
              event: 'unsubscribe',
              listId: 'your-list-id'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const mailchimpNodes: NodeTypeInfo[] = [mailchimpNode, mailchimpTriggerNode];

// Export individual actions for the regular Mailchimp node
export const mailchimpActions = [
  'delete_campaign',
  'get_campaign',
  'get_all_campaigns',
  'replicate_campaign',
  'resend_campaign',
  'send_campaign',
  'get_all_list_groups',
  'create_member',
  'delete_member',
  'get_member',
  'get_all_members',
  'update_member',
  'add_member_tags',
  'remove_member_tags'
];

// Export trigger events
export const mailchimpTriggers = [
  'member_subscribed',
  'member_unsubscribed',
  'member_profile_updated',
  'member_email_updated',
  'member_cleaned',
  'campaign_sent'
];