/**
 * Extract From File Node
 * 
 * Extracts data from files. Depending on file type, it can parse content (e.g. read text, CSV, or PDF content) and output structured data. Useful for processing attachments or downloaded files.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const extractfromfileNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.extract-from-file',
  displayName: 'Extract From File',
  description: 'Extracts data from files. Depending on file type, it can parse content (e.g. read text, CSV, or PDF content) and output structured data. Useful for processing attachments or downloaded files.',
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
      description: 'Processed data from Extract From File'
    }
  ],

  credentials: [
    {
      name: 'extract-from-fileApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Extract From File'
  },

  aliases: ['extract', 'from', 'file'],
  
  examples: [
        {
      name: 'Parse Item',
      description: 'Parse an item from Extract From File',
      workflow: {
        nodes: [
          {
            name: 'Extract From File',
            type: 'n8n-nodes-base.extract-from-file',
            parameters: {
              operation: 'parse',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default extractfromfileNode;