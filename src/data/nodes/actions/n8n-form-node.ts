/**
 * n8n Form Node
 * 
 * Displays an input form in the n8n workflow (particularly in Triggerable Forms). It allows collecting user input via a form that can be submitted to continue the workflow. Often used with **n8n Form Trigger** to create human-in-the-loop steps.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const n8nformNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.n8n-form',
  displayName: 'n8n Form',
  description: 'Displays an input form in the n8n workflow (particularly in Triggerable Forms). It allows collecting user input via a form that can be submitted to continue the workflow. Often used with **n8n Form Trigger** to create human-in-the-loop steps.',
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
      description: 'Processed data from n8n Form'
    }
  ],

  credentials: [
    {
      name: 'n8n-formApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'n8n Form'
  },

  aliases: ['n8n', 'form'],
  
  examples: [
        {
      name: 'Display Form Item',
      description: 'Display Form an item from n8n Form',
      workflow: {
        nodes: [
          {
            name: 'n8n Form',
            type: 'n8n-nodes-base.n8n-form',
            parameters: {
              operation: 'Display Form',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default n8nformNode;