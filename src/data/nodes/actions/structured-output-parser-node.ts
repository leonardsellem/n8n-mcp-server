/**
 * Structured Output Parser Node
 * 
 * A parser ensuring the LLM’s output is structured (e.g., JSON or a specific format):contentReference[oaicite:100]{index=100}. It likely works with the LLM by providing a format spec and then parsing the response to confirm it matches, possibly using the auto-fix parser if not. It’s used to reliably get JSON or other structured data from free-form AI output.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const structuredoutputparserNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.structured-output-parser',
  displayName: 'Structured Output Parser',
  description: 'A parser ensuring the LLM’s output is structured (e.g., JSON or a specific format):contentReference[oaicite:100]{index=100}. It likely works with the LLM by providing a format spec and then parsing the response to confirm it matches, possibly using the auto-fix parser if not. It’s used to reliably get JSON or other structured data from free-form AI output.',
  category: 'Utility',
  subcategory: 'Action',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'The operation to perform',
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
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
      description: 'Processed data from Structured Output Parser'
    }
  ],

  credentials: [
    {
      name: 'structured-output-parserApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Structured Output Parser'
  },

  aliases: ['structured', 'output', 'parser'],
  
  examples: [
        {
      name: 'Get Item',
      description: 'Get an item from Structured Output Parser',
      workflow: {
        nodes: [
          {
            name: 'Structured Output Parser',
            type: 'n8n-nodes-base.structured-output-parser',
            parameters: {
              operation: 'get',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default structuredoutputparserNode;