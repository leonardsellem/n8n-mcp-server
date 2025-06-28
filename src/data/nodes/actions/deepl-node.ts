/**
 * DeepL Node
 * 
 * Uses the DeepL API for language translation. You provide text and target language, and it returns the translated text with DeepL’s high-quality machine translation:contentReference[oaicite:21]{index=21}. Useful for translating content within workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const deeplNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.deepl',
  displayName: 'DeepL',
  description: 'Uses the DeepL API for language translation. You provide text and target language, and it returns the translated text with DeepL’s high-quality machine translation:contentReference[oaicite:21]{index=21}. Useful for translating content within workflows.',
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
      description: 'Processed data from DeepL'
    }
  ],

  credentials: [
    {
      name: 'deeplApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'DeepL'
  },

  aliases: ['deepl'],
  
  examples: [
        {
      name: 'Translate Text Item',
      description: 'Translate Text an item from DeepL',
      workflow: {
        nodes: [
          {
            name: 'DeepL',
            type: 'n8n-nodes-base.deepl',
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

export default deeplNode;