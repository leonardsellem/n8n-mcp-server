/**
 * Markdown Node
 * 
 * Renders or manipulates Markdown text. It can convert Markdown to HTML or preview it. Useful when you need to format text (from documentation or user input) and later send it as formatted content (e.g. in emails).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const markdownNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.markdown',
  displayName: 'Markdown',
  description: 'Renders or manipulates Markdown text. It can convert Markdown to HTML or preview it. Useful when you need to format text (from documentation or user input) and later send it as formatted content (e.g. in emails).',
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
      description: 'Processed data from Markdown'
    }
  ],

  credentials: [
    {
      name: 'markdownApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Markdown'
  },

  aliases: ['markdown'],
  
  examples: [
        {
      name: 'Convert Item',
      description: 'Convert an item from Markdown',
      workflow: {
        nodes: [
          {
            name: 'Markdown',
            type: 'n8n-nodes-base.markdown',
            parameters: {
              operation: 'convert',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default markdownNode;