/**
 * Crypto Node
 * 
 * Performs cryptographic operations on data. Supports hashing data (e.g. MD5, SHA), creating or verifying HMAC signatures, and encrypting or decrypting data.
 */

import { NodeTypeInfo } from '../node-types.js';

export const cryptoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.crypto',
  displayName: 'Crypto',
  description: 'Performs cryptographic operations on data. Supports hashing data (e.g. MD5, SHA), creating or verifying HMAC signatures, and encrypting or decrypting data.',
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
      description: 'Processed data from Crypto'
    }
  ],

  credentials: [
    {
      name: 'cryptoApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Crypto'
  },

  aliases: ['crypto'],
  
  examples: [
        {
      name: 'Hashing Item',
      description: 'Hashing an item from Crypto',
      workflow: {
        nodes: [
          {
            name: 'Crypto',
            type: 'n8n-nodes-base.crypto',
            parameters: {
              operation: 'hashing',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default cryptoNode;