/**
 * TheHive Node
 * 
 * Integrates with TheHive (cybersecurity incident response platform). Allows creating a new case (incident record), retrieving case details, and adding a task to a case (for responders to work on). Useful for automating incident creation from alerts and enhancing case management in security operations.
 */

import { NodeTypeInfo } from '../node-types.js';

export const thehiveNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.thehive',
  displayName: 'TheHive',
  description: 'Integrates with TheHive (cybersecurity incident response platform). Allows creating a new case (incident record), retrieving case details, and adding a task to a case (for responders to work on). Useful for automating incident creation from alerts and enhancing case management in security operations.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Case',
      description: 'The operation to perform',
      options: [
        { name: 'Create Case', value: 'Create Case' },
        { name: 'Get Case', value: 'Get Case' },
        { name: 'Add Case Task', value: 'Add Case Task' }
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
      description: 'Processed data from TheHive'
    }
  ],

  credentials: [
    {
      name: 'thehiveApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'TheHive'
  },

  aliases: ['thehive'],
  
  examples: [
        {
      name: 'Create Case Item',
      description: 'Create Case an item from TheHive',
      workflow: {
        nodes: [
          {
            name: 'TheHive',
            type: 'n8n-nodes-base.thehive',
            parameters: {
              operation: 'Create Case',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default thehiveNode;