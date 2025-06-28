/**
 * Zoom Node
 * 
 * Connects to Zoom’s API. Allows scheduling Zoom meetings (with topic, time, etc.), retrieving meeting details or status, listing registrants for webinars/meetings, and adding a registrant to a meeting/webinar. Useful for automating virtual event setups and syncing attendance lists.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const zoomNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.zoom',
  displayName: 'Zoom',
  description: 'Connects to Zoom’s API. Allows scheduling Zoom meetings (with topic, time, etc.), retrieving meeting details or status, listing registrants for webinars/meetings, and adding a registrant to a meeting/webinar. Useful for automating virtual event setups and syncing attendance lists.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Create Meeting',
      description: 'The operation to perform',
      options: [
        { name: 'Create Meeting', value: 'Create Meeting' },
        { name: 'Get Meeting', value: 'Get Meeting' },
        { name: 'List Registrants', value: 'List Registrants' },
        { name: 'Add Registrant', value: 'Add Registrant' }
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
      description: 'Processed data from Zoom'
    }
  ],

  credentials: [
    {
      name: 'zoomApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Zoom'
  },

  aliases: ['zoom'],
  
  examples: [
        {
      name: 'Create Meeting Item',
      description: 'Create Meeting an item from Zoom',
      workflow: {
        nodes: [
          {
            name: 'Zoom',
            type: 'n8n-nodes-base.zoom',
            parameters: {
              operation: 'Create Meeting',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default zoomNode;