/**
 * Google Business Profile Node
 * 
 * Integrates with Google Business Profile (formerly Google My Business). You can list your business locations, create a new post/update on a business profile, and respond to customer reviews. Helps manage local business presence on Google via automation.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const googlebusinessprofileNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.google-business-profile',
  displayName: 'Google Business Profile',
  description: 'Integrates with Google Business Profile (formerly Google My Business). You can list your business locations, create a new post/update on a business profile, and respond to customer reviews. Helps manage local business presence on Google via automation.',
  category: 'Productivity',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Locations',
      description: 'The operation to perform',
      options: [
        { name: 'Get Locations', value: 'Get Locations' },
        { name: 'Create Post', value: 'Create Post' },
        { name: 'Reply to Review', value: 'Reply to Review' }
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
      description: 'Processed data from Google Business Profile'
    }
  ],

  credentials: [
    {
      name: 'google-business-profileApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Google Business Profile'
  },

  aliases: ['google', 'business', 'profile'],
  
  examples: [
        {
      name: 'Get Locations Item',
      description: 'Get Locations an item from Google Business Profile',
      workflow: {
        nodes: [
          {
            name: 'Google Business Profile',
            type: 'n8n-nodes-base.google-business-profile',
            parameters: {
              operation: 'Get Locations',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default googlebusinessprofileNode;