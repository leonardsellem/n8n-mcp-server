/**
 * Webflow Node
 * 
 * Connects to Webflow (website design CMS). Allows creating new CMS items (for collections), updating existing items, retrieving items from a collection, and triggering a site publish (to push draft changes live). Useful for automating content updates on Webflow sites or deploying changes programmatically.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const webflowNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.webflow',
  displayName: 'Webflow',
  description: 'Connects to Webflow (website design CMS). Allows creating new CMS items (for collections), updating existing items, retrieving items from a collection, and triggering a site publish (to push draft changes live). Useful for automating content updates on Webflow sites or deploying changes programmatically.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Item',
      description: 'The operation to perform',
      options: [
        { name: 'Create Item', value: 'Create Item' },
        { name: 'Update Item', value: 'Update Item' },
        { name: 'Get Items', value: 'Get Items' },
        { name: 'Publish Site', value: 'Publish Site' }
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
      description: 'Processed data from Webflow'
    }
  ],

  credentials: [
    {
      name: 'webflowApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Webflow'
  },

  aliases: ['webflow'],
  
  examples: [
        {
      name: 'Create Item Item',
      description: 'Create Item an item from Webflow',
      workflow: {
        nodes: [
          {
            name: 'Webflow',
            type: 'n8n-nodes-base.webflow',
            parameters: {
              operation: 'Create Item',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default webflowNode;