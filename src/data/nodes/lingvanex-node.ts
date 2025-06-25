/**
 * LingvaNex Node
 * 
 * Uses LingvaNex translation API to translate text between languages (similar to Google Translate node). You provide text and target language, and get a translated result. An alternative translation service for multilingual automation.
 */

import { NodeTypeInfo } from '../node-types.js';

export const lingvanexNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.lingvanex',
  displayName: 'LingvaNex',
  description: 'Uses LingvaNex translation API to translate text between languages (similar to Google Translate node). You provide text and target language, and get a translated result. An alternative translation service for multilingual automation.',
  category: 'Utility',
  subcategory: 'Integration',
  
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
      description: 'Processed data from LingvaNex'
    }
  ],

  credentials: [
    {
      name: 'lingvanexApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'LingvaNex'
  },

  aliases: ['lingvanex'],
  
  examples: [
        {
      name: 'Translate Text Item',
      description: 'Translate Text an item from LingvaNex',
      workflow: {
        nodes: [
          {
            name: 'LingvaNex',
            type: 'n8n-nodes-base.lingvanex',
            parameters: {
              operation: 'Translate Text',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default lingvanexNode;