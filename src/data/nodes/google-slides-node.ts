/**
 * Google Slides Node
 * 
 * Works with Google Slides. You can create a new presentation (possibly from a template), retrieve slides and content, and replace text placeholders in slides. Useful for auto-generating presentation decks (e.g., for reports) by injecting dynamic data into slide templates.
 */

import { NodeTypeInfo } from '../node-types.js';

export const googleslidesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-slides',
  displayName: 'Google Slides',
  description: 'Works with Google Slides. You can create a new presentation (possibly from a template), retrieve slides and content, and replace text placeholders in slides. Useful for auto-generating presentation decks (e.g., for reports) by injecting dynamic data into slide templates.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Presentation',
      description: 'The operation to perform',
      options: [
        { name: 'Create Presentation', value: 'Create Presentation' },
        { name: 'Get Presentation', value: 'Get Presentation' },
        { name: 'Replace Text', value: 'Replace Text' }
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
      description: 'Processed data from Google Slides'
    }
  ],

  credentials: [
    {
      name: 'google-slidesApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Slides'
  },

  aliases: ['google', 'slides'],
  
  examples: [
        {
      name: 'Create Presentation Item',
      description: 'Create Presentation an item from Google Slides',
      workflow: {
        nodes: [
          {
            name: 'Google Slides',
            type: 'n8n-nodes-base.google-slides',
            parameters: {
              operation: 'Create Presentation',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googleslidesNode;