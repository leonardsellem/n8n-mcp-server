/**
 * LinkedIn Node
 * 
 * Integrates with LinkedIn’s API. Allows posting a share/update to a LinkedIn profile or company page, retrieving a LinkedIn profile’s details (like your own or a company), and searching for companies. Useful for social media automation in a professional context (posting updates, etc.).
 */

import { NodeTypeInfo } from '../node-types.js';

export const linkedinNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.linkedin',
  displayName: 'LinkedIn',
  description: 'Integrates with LinkedIn’s API. Allows posting a share/update to a LinkedIn profile or company page, retrieving a LinkedIn profile’s details (like your own or a company), and searching for companies. Useful for social media automation in a professional context (posting updates, etc.).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Share Update',
      description: 'The operation to perform',
      options: [
        { name: 'Share Update', value: 'Share Update' },
        { name: 'Get Profile', value: 'Get Profile' },
        { name: 'Search Companies', value: 'Search Companies' }
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
      description: 'Processed data from LinkedIn'
    }
  ],

  credentials: [
    {
      name: 'linkedinApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'LinkedIn'
  },

  aliases: ['linkedin'],
  
  examples: [
        {
      name: 'Share Update Item',
      description: 'Share Update an item from LinkedIn',
      workflow: {
        nodes: [
          {
            name: 'LinkedIn',
            type: 'n8n-nodes-base.linkedin',
            parameters: {
              operation: 'Share Update',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default linkedinNode;