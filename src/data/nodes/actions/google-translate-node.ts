/**
 * Google Translate Node
 * 
 * Uses Google Translate API to translate text between languages. You provide the source text and target language (and optionally source language if not auto-detected), and it returns the translated text. Useful for multilingual workflows requiring translation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googletranslateNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-translate',
  displayName: 'Google Translate',
  description: 'Uses Google Translate API to translate text between languages. You provide the source text and target language (and optionally source language if not auto-detected), and it returns the translated text. Useful for multilingual workflows requiring translation.',
  category: 'Productivity',
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
      description: 'Processed data from Google Translate'
    }
  ],

  credentials: [
    {
      name: 'google-translateApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Translate'
  },

  aliases: ['google', 'translate'],
  
  examples: [
        {
      name: 'Translate Text Item',
      description: 'Translate Text an item from Google Translate',
      workflow: {
        nodes: [
          {
            name: 'Google Translate',
            type: 'n8n-nodes-base.google-translate',
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

export default googletranslateNode;