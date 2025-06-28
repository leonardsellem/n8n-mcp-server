import { NodeTypeInfo } from '../../node-types.js';

export const mailerliteNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailerlite',
  displayName: 'MailerLite',
  description: 'Use the MailerLite node to automate work in MailerLite, and integrate MailerLite with other applications. n8n has built-in support for a wide range of MailerLite features, including creating, updating, deleting, and getting subscribers.',
  category: 'Communication',
  subcategory: 'Email Marketing',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'subscriber',
      description: 'The resource to operate on',
      options: [
        { name: 'Subscriber', value: 'subscriber', description: 'Work with email subscribers' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        { name: 'Create', value: 'create', description: 'Create a new subscriber' },
        { name: 'Get', value: 'get', description: 'Get a subscriber' },
        { name: 'Get All', value: 'getAll', description: 'Get all subscribers' },
        { name: 'Update', value: 'update', description: 'Update a subscriber' }
      ]
    },
    {
      name: 'subscriberId',
      displayName: 'Subscriber ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the subscriber to operate on'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'The email address of the subscriber'
    },
    {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'The name of the subscriber'
    },
    {
      name: 'fields',
      displayName: 'Custom Fields',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Custom fields for the subscriber'
    },
    {
      name: 'groups',
      displayName: 'Groups',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of group IDs to assign subscriber to'
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'active',
      description: 'The status of the subscriber',
      options: [
        { name: 'Active', value: 'active', description: 'Active subscriber' },
        { name: 'Unsubscribed', value: 'unsubscribed', description: 'Unsubscribed subscriber' },
        { name: 'Unconfirmed', value: 'unconfirmed', description: 'Unconfirmed subscriber' },
        { name: 'Bounced', value: 'bounced', description: 'Bounced subscriber' },
        { name: 'Junk', value: 'junk', description: 'Junk subscriber' }
      ]
    },
    {
      name: 'resend_autoresponders',
      displayName: 'Resend Autoresponders',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to resend autoresponders to the subscriber'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 25,
      description: 'Maximum number of results to return'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of results to skip'
    },
    {
      name: 'filter',
      displayName: 'Filter',
      type: 'options',
      required: false,
      default: 'all',
      description: 'Filter subscribers by status',
      options: [
        { name: 'All', value: 'all', description: 'All subscribers' },
        { name: 'Active', value: 'active', description: 'Active subscribers only' },
        { name: 'Unsubscribed', value: 'unsubscribed', description: 'Unsubscribed subscribers only' },
        { name: 'Unconfirmed', value: 'unconfirmed', description: 'Unconfirmed subscribers only' },
        { name: 'Bounced', value: 'bounced', description: 'Bounced subscribers only' },
        { name: 'Junk', value: 'junk', description: 'Junk subscribers only' }
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
      description: 'The processed MailerLite data'
    }
  ],
  credentials: ['mailerLiteApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Subscriber',
      description: 'Create a new subscriber in MailerLite',
      workflow: {
        nodes: [
          {
            name: 'MailerLite',
            type: 'n8n-nodes-base.mailerlite',
            parameters: {
              resource: 'subscriber',
              operation: 'create',
              email: 'user@example.com',
              name: 'John Doe',
              status: 'active'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Subscribers',
      description: 'Retrieve all subscribers from MailerLite',
      workflow: {
        nodes: [
          {
            name: 'MailerLite',
            type: 'n8n-nodes-base.mailerlite',
            parameters: {
              resource: 'subscriber',
              operation: 'getAll',
              limit: 50,
              filter: 'active'
            }
          }
        ]
      }
    },
    {
      name: 'Update Subscriber',
      description: 'Update an existing subscriber',
      workflow: {
        nodes: [
          {
            name: 'MailerLite',
            type: 'n8n-nodes-base.mailerlite',
            parameters: {
              resource: 'subscriber',
              operation: 'update',
              subscriberId: '{{$json["subscriber_id"]}}',
              name: 'Jane Doe Updated',
              status: 'active'
            }
          }
        ]
      }
    },
    {
      name: 'Get Subscriber',
      description: 'Get a specific subscriber by ID',
      workflow: {
        nodes: [
          {
            name: 'MailerLite',
            type: 'n8n-nodes-base.mailerlite',
            parameters: {
              resource: 'subscriber',
              operation: 'get',
              subscriberId: '12345'
            }
          }
        ]
      }
    }
  ]
};

export const mailerliteTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mailerliteTrigger',
  displayName: 'MailerLite Trigger',
  description: 'Triggers the workflow when events occur in MailerLite, such as new subscribers, campaign activities, or subscriber status changes.',
  category: 'Communication',
  subcategory: 'Email Marketing',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'subscriber.created',
      description: 'The event to listen for',
      options: [
        { name: 'Campaign Sent', value: 'campaign.sent', description: 'When a campaign is sent' },
        { name: 'Subscriber Added to Group', value: 'subscriber.added_to_group', description: 'When a subscriber is added to a group' },
        { name: 'Subscriber Automation Completed', value: 'subscriber.automation_completed', description: 'When a subscriber completes an automation' },
        { name: 'Subscriber Automation Triggered', value: 'subscriber.automation_triggered', description: 'When an automation is triggered for a subscriber' },
        { name: 'Subscriber Bounced', value: 'subscriber.bounced', description: 'When a subscriber email bounces' },
        { name: 'Subscriber Created', value: 'subscriber.created', description: 'When a new subscriber is created' },
        { name: 'Subscriber Complained', value: 'subscriber.complained', description: 'When a subscriber files a spam complaint' },
        { name: 'Subscriber Removed from Group', value: 'subscriber.removed_from_group', description: 'When a subscriber is removed from a group' },
        { name: 'Subscriber Unsubscribed', value: 'subscriber.unsubscribed', description: 'When a subscriber unsubscribes' },
        { name: 'Subscriber Updated', value: 'subscriber.updated', description: 'When a subscriber is updated' }
      ]
    },
    {
      name: 'groupId',
      displayName: 'Group ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the specific group to monitor (optional)'
    },
    {
      name: 'campaignId',
      displayName: 'Campaign ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the specific campaign to monitor (optional)'
    },
    {
      name: 'automationId',
      displayName: 'Automation ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the specific automation to monitor (optional)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when MailerLite events occur'
    }
  ],
  credentials: ['mailerLiteApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Subscribers',
      description: 'Trigger workflow when new subscribers are created',
      workflow: {
        nodes: [
          {
            name: 'MailerLite Trigger',
            type: 'n8n-nodes-base.mailerliteTrigger',
            parameters: {
              event: 'subscriber.created'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Unsubscribes',
      description: 'Trigger workflow when subscribers unsubscribe',
      workflow: {
        nodes: [
          {
            name: 'MailerLite Trigger',
            type: 'n8n-nodes-base.mailerliteTrigger',
            parameters: {
              event: 'subscriber.unsubscribed'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Campaign Sent',
      description: 'Trigger workflow when campaigns are sent',
      workflow: {
        nodes: [
          {
            name: 'MailerLite Trigger',
            type: 'n8n-nodes-base.mailerliteTrigger',
            parameters: {
              event: 'campaign.sent',
              campaignId: 'your-campaign-id'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Group Additions',
      description: 'Trigger workflow when subscribers are added to a specific group',
      workflow: {
        nodes: [
          {
            name: 'MailerLite Trigger',
            type: 'n8n-nodes-base.mailerliteTrigger',
            parameters: {
              event: 'subscriber.added_to_group',
              groupId: 'your-group-id'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Automation Completions',
      description: 'Trigger workflow when subscribers complete automations',
      workflow: {
        nodes: [
          {
            name: 'MailerLite Trigger',
            type: 'n8n-nodes-base.mailerliteTrigger',
            parameters: {
              event: 'subscriber.automation_completed',
              automationId: 'your-automation-id'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const mailerliteNodes: NodeTypeInfo[] = [mailerliteNode, mailerliteTriggerNode];

// Export individual actions for the regular MailerLite node
export const mailerliteActions = [
  'create_subscriber',
  'get_subscriber',
  'get_all_subscribers',
  'update_subscriber'
];

// Export trigger events
export const mailerliteTriggers = [
  'campaign_sent',
  'subscriber_added_to_group',
  'subscriber_automation_completed',
  'subscriber_automation_triggered',
  'subscriber_bounced',
  'subscriber_created',
  'subscriber_complained',
  'subscriber_removed_from_group',
  'subscriber_unsubscribed',
  'subscriber_updated'
];