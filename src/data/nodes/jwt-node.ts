/**
 * JWT Node
 * 
 * Generates or verifies JSON Web Tokens. It can sign payloads with a secret or key to produce a JWT, or decode/validate an incoming JWT’s signature and extract its payload.
 */

import { NodeTypeInfo } from '../node-types.js';

export const jwtNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.jwt',
  displayName: 'JWT',
  description: 'Generates or verifies JSON Web Tokens. It can sign payloads with a secret or key to produce a JWT, or decode/validate an incoming JWT’s signature and extract its payload.',
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
      description: 'Processed data from JWT'
    }
  ],

  credentials: [
    {
      name: 'jwtApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'JWT'
  },

  aliases: ['jwt'],
  
  examples: [
        {
      name: 'Sign Item',
      description: 'Sign an item from JWT',
      workflow: {
        nodes: [
          {
            name: 'JWT',
            type: 'n8n-nodes-base.jwt',
            parameters: {
              operation: 'sign',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default jwtNode;