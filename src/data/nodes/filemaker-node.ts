/**
 * FileMaker Node
 * 
 * Integrates with FileMaker (database platform). You can add new records to a FileMaker database, query for records (with FileMaker’s find), retrieve a specific record, update it, or delete it. Great for connecting FileMaker data with other systems via n8n.
 */

import { NodeTypeInfo } from '../node-types.js';

export const filemakerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.filemaker',
  displayName: 'FileMaker',
  description: 'Integrates with FileMaker (database platform). You can add new records to a FileMaker database, query for records (with FileMaker’s find), retrieve a specific record, update it, or delete it. Great for connecting FileMaker data with other systems via n8n.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Record',
      description: 'The operation to perform',
      options: [
        { name: 'Create Record', value: 'Create Record' },
        { name: 'Find Records', value: 'Find Records' },
        { name: 'Get Record', value: 'Get Record' },
        { name: 'Update Record', value: 'Update Record' },
        { name: 'Delete Record', value: 'Delete Record' }
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
      description: 'Processed data from FileMaker'
    }
  ],

  credentials: [
    {
      name: 'filemakerApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'FileMaker'
  },

  aliases: ['filemaker'],
  
  examples: [
        {
      name: 'Create Record Item',
      description: 'Create Record an item from FileMaker',
      workflow: {
        nodes: [
          {
            name: 'FileMaker',
            type: 'n8n-nodes-base.filemaker',
            parameters: {
              operation: 'Create Record',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default filemakerNode;