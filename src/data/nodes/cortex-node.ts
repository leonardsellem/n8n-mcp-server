/**
 * Cortex Node
 * 
 * Integrates with Cortex (TheHive Project’s analysis engine). You can search for host information or fetch alerts from Cortex. Generally used in security automation workflows, to query threat intel or analysis results.
 */

import { NodeTypeInfo } from '../node-types.js';

export const cortexNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.cortex',
  displayName: 'Cortex',
  description: 'Integrates with Cortex (TheHive Project’s analysis engine). You can search for host information or fetch alerts from Cortex. Generally used in security automation workflows, to query threat intel or analysis results.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Hosts',
      description: 'The operation to perform',
      options: [
        { name: 'Search Hosts', value: 'Search Hosts' },
        { name: 'Get Alerts', value: 'Get Alerts' }
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
      description: 'Processed data from Cortex'
    }
  ],

  credentials: [
    {
      name: 'cortexApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Cortex'
  },

  aliases: ['cortex'],
  
  examples: [
        {
      name: 'Search Hosts Item',
      description: 'Search Hosts an item from Cortex',
      workflow: {
        nodes: [
          {
            name: 'Cortex',
            type: 'n8n-nodes-base.cortex',
            parameters: {
              operation: 'Search Hosts',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default cortexNode;