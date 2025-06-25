/**
 * TheHive 5 Node
 * 
 * Specifically targets TheHive 5’s API (newer version of TheHive). Similar to TheHive node: create cases, search through alerts in the alert queue. Ensures compatibility with TheHive 5’s slightly changed API endpoints for incident response automation.
 */

import { NodeTypeInfo } from '../node-types.js';

export const thehive5Node: NodeTypeInfo = {
  name: 'n8n-nodes-base.thehive-5',
  displayName: 'TheHive 5',
  description: 'Specifically targets TheHive 5’s API (newer version of TheHive). Similar to TheHive node: create cases, search through alerts in the alert queue. Ensures compatibility with TheHive 5’s slightly changed API endpoints for incident response automation.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Case',
      description: 'The operation to perform',
      options: [
        { name: 'Create Case', value: 'Create Case' },
        { name: 'Search Alerts', value: 'Search Alerts' }
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
      description: 'Processed data from TheHive 5'
    }
  ],

  credentials: [
    {
      name: 'thehive-5Api',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'TheHive 5'
  },

  aliases: ['thehive'],
  
  examples: [
        {
      name: 'Create Case Item',
      description: 'Create Case an item from TheHive 5',
      workflow: {
        nodes: [
          {
            name: 'TheHive 5',
            type: 'n8n-nodes-base.thehive-5',
            parameters: {
              operation: 'Create Case',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default thehive5Node;