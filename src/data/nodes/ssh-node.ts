/**
 * SSH Node
 * 
 * Executes commands on a remote server via SSH, or transfers files using SCP/SFTP. Allows workflows to run remote shell commands or retrieve/send files securely to another host (requires SSH credentials).
 */

import { NodeTypeInfo } from '../node-types.js';

export const sshNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.ssh',
  displayName: 'SSH',
  description: 'Executes commands on a remote server via SSH, or transfers files using SCP/SFTP. Allows workflows to run remote shell commands or retrieve/send files securely to another host (requires SSH credentials).',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Execute Command',
      description: 'The operation to perform',
      options: [
        { name: 'Execute Command', value: 'Execute Command' },
        { name: 'Fetch File', value: 'Fetch File' },
        { name: 'Send File', value: 'Send File' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Processed data from SSH'
    }
  ],

  credentials: [
    {
      name: 'sshApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'SSH'
  },

  aliases: ['ssh'],
  
  examples: [
        {
      name: 'Execute Command Item',
      description: 'Execute Command an item from SSH',
      workflow: {
        nodes: [
          {
            name: 'SSH',
            type: 'n8n-nodes-base.ssh',
            parameters: {
              operation: 'Execute Command',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default sshNode;