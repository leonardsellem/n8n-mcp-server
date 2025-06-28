/**
 * Compression Node
 * 
 * Compresses or decompresses files. Supports creating archive files (e.g. ZIP) from binary data, or extracting files from an archive.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const compressionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.compression',
  displayName: 'Compression',
  description: 'Compresses or decompresses files. Supports creating archive files (e.g. ZIP) from binary data, or extracting files from an archive.',
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
      description: 'Processed data from Compression'
    }
  ],

  credentials: [
    {
      name: 'compressionApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Compression'
  },

  aliases: ['compression'],
  
  examples: [
        {
      name: 'Creating Item',
      description: 'Creating an item from Compression',
      workflow: {
        nodes: [
          {
            name: 'Compression',
            type: 'n8n-nodes-base.compression',
            parameters: {
              operation: 'creating',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default compressionNode;