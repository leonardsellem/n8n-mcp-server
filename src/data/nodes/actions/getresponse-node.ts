/**
 * GetResponse Node
 * 
 * Integrates with GetResponse (email marketing). Allows adding a contact to a list, retrieving contact details, and triggering a newsletter send (or campaign). Useful for keeping mailing lists updated or sending emails via GetResponse as part of workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const getresponseNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.getresponse',
  displayName: 'GetResponse',
  description: 'Integrates with GetResponse (email marketing). Allows adding a contact to a list, retrieving contact details, and triggering a newsletter send (or campaign). Useful for keeping mailing lists updated or sending emails via GetResponse as part of workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Add Contact',
      description: 'The operation to perform',
      options: [
        { name: 'Add Contact', value: 'Add Contact' },
        { name: 'Get Contact', value: 'Get Contact' },
        { name: 'Send Newsletter', value: 'Send Newsletter' }
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
      description: 'Processed data from GetResponse'
    }
  ],

  credentials: [
    {
      name: 'getresponseApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'GetResponse'
  },

  aliases: ['getresponse'],
  
  examples: [
        {
      name: 'Add Contact Item',
      description: 'Add Contact an item from GetResponse',
      workflow: {
        nodes: [
          {
            name: 'GetResponse',
            type: 'n8n-nodes-base.getresponse',
            parameters: {
              operation: 'Add Contact',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default getresponseNode;