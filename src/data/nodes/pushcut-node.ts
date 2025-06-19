import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const pushcutNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pushcut',
  displayName: 'Pushcut',
  description: 'Use the Pushcut node to automate work in Pushcut, and integrate Pushcut with other applications. n8n supports sending notifications with Pushcut.',
  category: 'Communication',
  subcategory: 'Messaging',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'notification',
      description: 'The resource to operate on',
      options: [
        { name: 'Notification', value: 'notification', description: 'Work with notification operations' }
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
        { name: 'Send a notification', value: 'send', description: 'Send a notification via Pushcut' }
      ]
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the notification'
    },
    {
      name: 'text',
      displayName: 'Text',
      type: 'string',
      required: false,
      default: '',
      description: 'The body text of the notification'
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL to open when notification is tapped'
    },
    {
      name: 'sound',
      displayName: 'Sound',
      type: 'string',
      required: false,
      default: '',
      description: 'Sound to play with the notification'
    },
    {
      name: 'image',
      displayName: 'Image',
      type: 'string',
      required: false,
      default: '',
      description: 'Image URL to include with the notification'
    },
    {
      name: 'isTimeSensitive',
      displayName: 'Is Time Sensitive',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether the notification is time sensitive'
    },
    {
      name: 'input',
      displayName: 'Input',
      type: 'string',
      required: false,
      default: '',
      description: 'Input value to pass with the notification'
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
      description: 'The notification response data'
    }
  ],
  credentials: ['pushcutApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Simple Notification',
      description: 'Send a basic notification via Pushcut',
      workflow: {
        nodes: [
          {
            name: 'Pushcut',
            type: 'n8n-nodes-base.pushcut',
            parameters: {
              resource: 'notification',
              operation: 'send',
              title: 'Hello from n8n!',
              text: 'This is a test notification sent via Pushcut from your n8n workflow.'
            }
          }
        ]
      }
    },
    {
      name: 'Send Notification with URL',
      description: 'Send a notification that opens a URL when tapped',
      workflow: {
        nodes: [
          {
            name: 'Pushcut',
            type: 'n8n-nodes-base.pushcut',
            parameters: {
              resource: 'notification',
              operation: 'send',
              title: 'Check this out!',
              text: 'Click to open n8n documentation',
              url: 'https://docs.n8n.io'
            }
          }
        ]
      }
    },
    {
      name: 'Send Time-Sensitive Notification',
      description: 'Send a time-sensitive notification with sound',
      workflow: {
        nodes: [
          {
            name: 'Pushcut',
            type: 'n8n-nodes-base.pushcut',
            parameters: {
              resource: 'notification',
              operation: 'send',
              title: 'Urgent Alert',
              text: 'This is an urgent notification that requires immediate attention.',
              sound: 'alert',
              isTimeSensitive: true
            }
          }
        ]
      }
    }
  ]
};

export const pushcutTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pushcutTrigger',
  displayName: 'Pushcut Trigger',
  description: 'Pushcut is an app for iOS that lets you create smart notifications to kick off shortcuts, URLs, and online automation.',
  category: 'Trigger',
  subcategory: 'Integration',
  properties: [
    {
      name: 'actionName',
      displayName: 'Action Name',
      type: 'string',
      required: true,
      default: '',
      description: 'The name of the Pushcut action that will trigger this workflow'
    },
    {
      name: 'webhookId',
      displayName: 'Webhook ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Custom webhook ID for this trigger (auto-generated if not provided)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Data received from the Pushcut trigger'
    }
  ],
  credentials: ['pushcutApi'],
  regularNode: false,
  triggerNode: true,
  codeable: false,
  examples: [
    {
      name: 'Basic Pushcut Trigger',
      description: 'Trigger a workflow when a Pushcut action is executed',
      workflow: {
        nodes: [
          {
            name: 'Pushcut Trigger',
            type: 'n8n-nodes-base.pushcutTrigger',
            parameters: {
              actionName: 'Start Workflow'
            }
          }
        ]
      }
    },
    {
      name: 'Custom Webhook Trigger',
      description: 'Use a custom webhook ID for the Pushcut trigger',
      workflow: {
        nodes: [
          {
            name: 'Pushcut Trigger',
            type: 'n8n-nodes-base.pushcutTrigger',
            parameters: {
              actionName: 'Custom Action',
              webhookId: 'my-custom-webhook-id'
            }
          }
        ]
      }
    }
  ]
};

// Export the nodes
export const pushcutNodes: NodeTypeInfo[] = [pushcutNode, pushcutTriggerNode];

// Export individual actions for the Pushcut nodes
export const pushcutActions = [
  'send_notification'
];

export const pushcutTriggerActions = [
  'trigger_webhook'
];

// Export for easier access
export default pushcutNodes;