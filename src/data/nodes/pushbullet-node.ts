import { NodeTypeInfo } from '../node-types.js';

export const pushbulletNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.pushbullet',
  displayName: 'Pushbullet',
  description: 'Use the Pushbullet node to automate work in Pushbullet, and integrate Pushbullet with other applications. n8n has built-in support for a wide range of Pushbullet features, including creating, updating, deleting, and getting a push.',
  category: 'Communication',
  subcategory: 'Messaging',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'push',
      description: 'The resource to operate on',
      options: [
        { name: 'Push', value: 'push', description: 'Work with push operations' }
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
        { name: 'Create', value: 'create', description: 'Create a push' },
        { name: 'Delete', value: 'delete', description: 'Delete a push' },
        { name: 'Get All', value: 'getAll', description: 'Get all pushes' },
        { name: 'Update', value: 'update', description: 'Update a push' }
      ]
    },
    {
      name: 'pushId',
      displayName: 'Push ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the push to delete or update'
    },
    {
      name: 'type',
      displayName: 'Type',
      type: 'options',
      required: false,
      default: 'note',
      description: 'The type of push to create',
      options: [
        { name: 'Note', value: 'note', description: 'A simple text note' },
        { name: 'Link', value: 'link', description: 'A URL link' },
        { name: 'File', value: 'file', description: 'A file attachment' }
      ]
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'The title of the push'
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      required: false,
      default: '',
      description: 'The body text of the push'
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      required: false,
      default: '',
      description: 'The URL for link-type pushes'
    },
    {
      name: 'deviceId',
      displayName: 'Device ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The device ID to send the push to (optional - if not specified, sends to all devices)'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Email address to send the push to'
    },
    {
      name: 'channel',
      displayName: 'Channel',
      type: 'string',
      required: false,
      default: '',
      description: 'Channel tag to send the push to'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file for file-type pushes'
    },
    {
      name: 'fileType',
      displayName: 'File Type',
      type: 'string',
      required: false,
      default: '',
      description: 'MIME type of the file'
    },
    {
      name: 'fileUrl',
      displayName: 'File URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the file to push'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of pushes to return (for Get All operation)'
    },
    {
      name: 'cursor',
      displayName: 'Cursor',
      type: 'string',
      required: false,
      default: '',
      description: 'Cursor for pagination (for Get All operation)'
    },
    {
      name: 'modifiedAfter',
      displayName: 'Modified After',
      type: 'dateTime',
      required: false,
      default: '',
      description: 'Only return pushes modified after this timestamp'
    },
    {
      name: 'active',
      displayName: 'Active',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to include only active pushes'
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
      description: 'The processed Pushbullet data'
    }
  ],
  credentials: ['pushbulletOAuth2Api'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Send Note',
      description: 'Send a simple note push to all devices',
      workflow: {
        nodes: [
          {
            name: 'Pushbullet',
            type: 'n8n-nodes-base.pushbullet',
            parameters: {
              resource: 'push',
              operation: 'create',
              type: 'note',
              title: 'Hello from n8n!',
              body: 'This is a test push from n8n workflow automation.'
            }
          }
        ]
      }
    },
    {
      name: 'Send Link',
      description: 'Send a link push with URL',
      workflow: {
        nodes: [
          {
            name: 'Pushbullet',
            type: 'n8n-nodes-base.pushbullet',
            parameters: {
              resource: 'push',
              operation: 'create',
              type: 'link',
              title: 'Check this out!',
              body: 'Interesting article to read',
              url: 'https://n8n.io'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Pushes',
      description: 'Retrieve all recent pushes',
      workflow: {
        nodes: [
          {
            name: 'Pushbullet',
            type: 'n8n-nodes-base.pushbullet',
            parameters: {
              resource: 'push',
              operation: 'getAll',
              limit: 20,
              active: true
            }
          }
        ]
      }
    },
    {
      name: 'Send to Specific Device',
      description: 'Send a push to a specific device',
      workflow: {
        nodes: [
          {
            name: 'Pushbullet',
            type: 'n8n-nodes-base.pushbullet',
            parameters: {
              resource: 'push',
              operation: 'create',
              type: 'note',
              title: 'Device-specific push',
              body: 'This push goes to a specific device',
              deviceId: 'ujpah72o0sjAiVhfaLpMuG'
            }
          }
        ]
      }
    }
  ]
};

// Export the node
export const pushbulletNodes: NodeTypeInfo[] = [pushbulletNode];

// Export individual actions for the Pushbullet node
export const pushbulletActions = [
  'create_push',
  'delete_push',
  'get_all_pushes',
  'update_push'
];

// Push types supported
export const pushbulletPushTypes = [
  'note',
  'link',
  'file'
];

// Export for easier access
export default pushbulletNode;