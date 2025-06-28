/**
 * Debug Helper Node
 * 
 * A utility node to help debug workflows. It can pause execution or emit information to the browser console for inspection, aiding in troubleshooting and workflow development.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const debughelperNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.debug-helper',
  displayName: 'Debug Helper',
  description: 'A utility node to help debug workflows. It can pause execution or emit information to the browser console for inspection, aiding in troubleshooting and workflow development.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
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
      description: 'Processed data from Debug Helper'
    }
  ],

  credentials: [
    {
      name: 'debug-helperApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Debug Helper'
  },

  aliases: ['debug', 'helper'],
  
  examples: [
        {
      name: 'Pause Item',
      description: 'Pause an item from Debug Helper',
      workflow: {
        nodes: [
          {
            name: 'Debug Helper',
            type: 'n8n-nodes-base.debug-helper',
            parameters: {
              operation: 'pause',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default debughelperNode;