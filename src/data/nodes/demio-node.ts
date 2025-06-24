/**
 * Demio Node
 * 
 * Connects to Demio (webinar platform). You can retrieve a list of upcoming or past webinars and register participants for a webinar. This automates webinar management tasks, like syncing registrations from other sources.
 */

import { NodeTypeInfo } from '../node-types.js';

export const demioNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.demio',
  displayName: 'Demio',
  description: 'Connects to Demio (webinar platform). You can retrieve a list of upcoming or past webinars and register participants for a webinar. This automates webinar management tasks, like syncing registrations from other sources.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'List Webinars',
      description: 'The operation to perform',
      options: [
        { name: 'List Webinars', value: 'List Webinars' },
        { name: 'Register for Webinar', value: 'Register for Webinar' }
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
      description: 'Processed data from Demio'
    }
  ],

  credentials: [
    {
      name: 'demioApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Demio'
  },

  aliases: ['demio'],
  
  examples: [
        {
      name: 'List Webinars Item',
      description: 'List Webinars an item from Demio',
      workflow: {
        nodes: [
          {
            name: 'Demio',
            type: 'n8n-nodes-base.demio',
            parameters: {
              operation: 'List Webinars',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default demioNode;