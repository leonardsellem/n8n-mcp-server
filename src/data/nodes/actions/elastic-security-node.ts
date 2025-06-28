/**
 * Elastic Security Node
 * 
 * Integrates with Elastic Security (part of Elastic Stack for SIEM). Allows retrieving security signals/alerts and creating new signals. Useful for security automation, pulling alerts into n8n or forwarding new findings into Elastic.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const elasticsecurityNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.elastic-security',
  displayName: 'Elastic Security',
  description: 'Integrates with Elastic Security (part of Elastic Stack for SIEM). Allows retrieving security signals/alerts and creating new signals. Useful for security automation, pulling alerts into n8n or forwarding new findings into Elastic.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Signals',
      description: 'The operation to perform',
      options: [
        { name: 'Get Signals', value: 'Get Signals' },
        { name: 'Create Signal', value: 'Create Signal' }
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
      description: 'Processed data from Elastic Security'
    }
  ],

  credentials: [
    {
      name: 'elastic-securityApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Elastic Security'
  },

  aliases: ['elastic', 'security'],
  
  examples: [
        {
      name: 'Get Signals Item',
      description: 'Get Signals an item from Elastic Security',
      workflow: {
        nodes: [
          {
            name: 'Elastic Security',
            type: 'n8n-nodes-base.elastic-security',
            parameters: {
              operation: 'Get Signals',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default elasticsecurityNode;