/**
 * APITemplate.io Node
 * 
 * Uses APITemplate.io service to generate documents or images from templates. You can supply template ID and data to fill in, and the node will produce a rendered document (PDF, image, etc.) via the APITemplate API.
 */

import { NodeTypeInfo } from '../node-types.js';

export const apitemplateioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.apitemplateio',
  displayName: 'APITemplate.io',
  description: 'Uses APITemplate.io service to generate documents or images from templates. You can supply template ID and data to fill in, and the node will produce a rendered document (PDF, image, etc.) via the APITemplate API.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Generate Document',
      description: 'The operation to perform',
      options: [
        { name: 'Generate Document', value: 'Generate Document' },
        { name: 'Generate Image', value: 'Generate Image' }
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
      description: 'Processed data from APITemplate.io'
    }
  ],

  credentials: [
    {
      name: 'apitemplateioApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'APITemplate.io'
  },

  aliases: ['apitemplate.io'],
  
  examples: [
        {
      name: 'Generate Document Item',
      description: 'Generate Document an item from APITemplate.io',
      workflow: {
        nodes: [
          {
            name: 'APITemplate.io',
            type: 'n8n-nodes-base.apitemplateio',
            parameters: {
              operation: 'Generate Document',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default apitemplateioNode;