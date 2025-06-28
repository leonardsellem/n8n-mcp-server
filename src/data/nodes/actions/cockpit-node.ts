/**
 * Cockpit Node
 * 
 * Integrates with Cockpit (headless CMS). Allows fetching entries from a collection, creating new collection entries, or updating existing entries. Useful for managing CMS content programmatically (e.g., publishing content from n8n).
 */

import { NodeTypeInfo } from '../../node-types.js';

export const cockpitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.cockpit',
  displayName: 'Cockpit',
  description: 'Integrates with Cockpit (headless CMS). Allows fetching entries from a collection, creating new collection entries, or updating existing entries. Useful for managing CMS content programmatically (e.g., publishing content from n8n).',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Collection Entries',
      description: 'The operation to perform',
      options: [
        { name: 'Get Collection Entries', value: 'Get Collection Entries' },
        { name: 'Create Entry', value: 'Create Entry' },
        { name: 'Update Entry', value: 'Update Entry' }
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
      description: 'Processed data from Cockpit'
    }
  ],

  credentials: [
    {
      name: 'cockpitApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Cockpit'
  },

  aliases: ['cockpit'],
  
  examples: [
        {
      name: 'Get Collection Entries Item',
      description: 'Get Collection Entries an item from Cockpit',
      workflow: {
        nodes: [
          {
            name: 'Cockpit',
            type: 'n8n-nodes-base.cockpit',
            parameters: {
              operation: 'Get Collection Entries',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default cockpitNode;