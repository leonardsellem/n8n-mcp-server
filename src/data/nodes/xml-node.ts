/**
 * XML Node
 * 
 * Converts data between XML and JSON. In **Parse** mode, it takes XML content and outputs equivalent JSON; in **Build** mode, it takes JSON and constructs an XML string. This is useful for integrating with systems that require or produce XML.
 */

import { NodeTypeInfo } from '../node-types.js';

export const xmlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.xml',
  displayName: 'XML',
  description: 'Converts data between XML and JSON. In **Parse** mode, it takes XML content and outputs equivalent JSON; in **Build** mode, it takes JSON and constructs an XML string. This is useful for integrating with systems that require or produce XML.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Parse XML',
      description: 'The operation to perform',
      options: [
        { name: 'Parse XML', value: 'Parse XML' },
        { name: 'Build XML', value: 'Build XML' }
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
      description: 'Processed data from XML'
    }
  ],

  credentials: [
    {
      name: 'xmlApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'XML'
  },

  aliases: ['xml'],
  
  examples: [
        {
      name: 'Parse XML Item',
      description: 'Parse XML an item from XML',
      workflow: {
        nodes: [
          {
            name: 'XML',
            type: 'n8n-nodes-base.xml',
            parameters: {
              operation: 'Parse XML',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default xmlNode;