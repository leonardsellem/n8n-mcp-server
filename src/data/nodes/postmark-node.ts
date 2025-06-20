import { NodeTypeInfo } from '../node-types.js';

export const postmarkTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.postmarkTrigger',
  displayName: 'Postmark Trigger',
  description: 'Triggers the workflow when events occur in Postmark. Postmark helps deliver and track application email. You can track statistics such as the number of emails sent or processed, opens, bounces and, spam complaints.',
  category: 'Communication',
  subcategory: 'Email',
  properties: [
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'open',
      description: 'The event to listen for',
      options: [
        { name: 'Open', value: 'open', description: 'When an email is opened' },
        { name: 'Click', value: 'click', description: 'When a link in an email is clicked' },
        { name: 'Delivery', value: 'delivery', description: 'When an email is successfully delivered' },
        { name: 'Bounce', value: 'bounce', description: 'When an email bounces' },
        { name: 'Spam Complaint', value: 'spamComplaint', description: 'When an email is marked as spam' },
        { name: 'Subscription Change', value: 'subscriptionChange', description: 'When subscription preferences change' }
      ]
    },
    {
      name: 'serverApiToken',
      displayName: 'Server API Token',
      type: 'string',
      required: true,
      default: '',
      description: 'The Server API token from your Postmark server'
    },
    {
      name: 'messageStream',
      displayName: 'Message Stream',
      type: 'string',
      required: false,
      default: 'outbound',
      description: 'Filter events by message stream'
    },
    {
      name: 'tag',
      displayName: 'Tag',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by specific tag'
    },
    {
      name: 'metadata',
      displayName: 'Metadata',
      type: 'string',
      required: false,
      default: '',
      description: 'Filter events by metadata key-value pair'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Postmark email events occur'
    }
  ],
  credentials: ['postmarkApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Email Opens',
      description: 'Trigger workflow when emails are opened by recipients',
      workflow: {
        nodes: [
          {
            name: 'Postmark Trigger',
            type: 'n8n-nodes-base.postmarkTrigger',
            parameters: {
              event: 'open',
              messageStream: 'outbound'
            }
          }
        ]
      }
    },
    {
      name: 'Track Email Clicks',
      description: 'Trigger workflow when links in emails are clicked',
      workflow: {
        nodes: [
          {
            name: 'Postmark Trigger',
            type: 'n8n-nodes-base.postmarkTrigger',
            parameters: {
              event: 'click',
              messageStream: 'outbound'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Email Bounces',
      description: 'Trigger workflow when emails bounce',
      workflow: {
        nodes: [
          {
            name: 'Postmark Trigger',
            type: 'n8n-nodes-base.postmarkTrigger',
            parameters: {
              event: 'bounce',
              messageStream: 'outbound'
            }
          }
        ]
      }
    },
    {
      name: 'Track Spam Complaints',
      description: 'Trigger workflow when emails are marked as spam',
      workflow: {
        nodes: [
          {
            name: 'Postmark Trigger',
            type: 'n8n-nodes-base.postmarkTrigger',
            parameters: {
              event: 'spamComplaint',
              messageStream: 'outbound'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Tagged Emails',
      description: 'Trigger workflow for events on emails with specific tags',
      workflow: {
        nodes: [
          {
            name: 'Postmark Trigger',
            type: 'n8n-nodes-base.postmarkTrigger',
            parameters: {
              event: 'delivery',
              messageStream: 'outbound',
              tag: 'newsletter'
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for consistency with other files
export const postmarkNodes: NodeTypeInfo[] = [postmarkTriggerNode];

// No regular app node exists for Postmark (only trigger node)
export const postmarkActions: string[] = [];

// Export trigger events
export const postmarkTriggers = [
  'email_opened',
  'link_clicked', 
  'email_delivered',
  'email_bounced',
  'spam_complaint_received',
  'subscription_changed'
];