/**
 * MISP Node
 * 
 * Integrates with MISP (Malware Information Sharing Platform). Allows searching for threat events/indicators in MISP and adding new attributes/indicators to an event. Useful for cybersecurity workflows to share or query threat intelligence data.
 */

import { NodeTypeInfo } from '../node-types.js';

export const mispNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.misp',
  displayName: 'MISP',
  description: 'Integrates with MISP (Malware Information Sharing Platform). Allows searching for threat events/indicators in MISP and adding new attributes/indicators to an event. Useful for cybersecurity workflows to share or query threat intelligence data.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Events',
      description: 'The operation to perform',
      options: [
        { name: 'Search Events', value: 'Search Events' },
        { name: 'Add Attribute', value: 'Add Attribute' }
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
      description: 'Processed data from MISP'
    }
  ],

  credentials: [
    {
      name: 'mispApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'MISP'
  },

  aliases: ['misp'],
  
  examples: [
        {
      name: 'Search Events Item',
      description: 'Search Events an item from MISP',
      workflow: {
        nodes: [
          {
            name: 'MISP',
            type: 'n8n-nodes-base.misp',
            parameters: {
              operation: 'Search Events',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default mispNode;