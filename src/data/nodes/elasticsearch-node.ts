/**
 * Elasticsearch Node
 * 
 * Connects to an Elasticsearch server. You can search for documents using a query, index (add/update) a document in an index, retrieve a document by ID, or delete a document. Enables integrating search and analytics data in workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const elasticsearchNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.elasticsearch',
  displayName: 'Elasticsearch',
  description: 'Connects to an Elasticsearch server. You can search for documents using a query, index (add/update) a document in an index, retrieve a document by ID, or delete a document. Enables integrating search and analytics data in workflows.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Documents',
      description: 'The operation to perform',
      options: [
        { name: 'Search Documents', value: 'Search Documents' },
        { name: 'Index Document', value: 'Index Document' },
        { name: 'Get Document', value: 'Get Document' },
        { name: 'Delete Document', value: 'Delete Document' }
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
      description: 'Processed data from Elasticsearch'
    }
  ],

  credentials: [
    {
      name: 'elasticsearchApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Elasticsearch'
  },

  aliases: ['elasticsearch'],
  
  examples: [
        {
      name: 'Search Documents Item',
      description: 'Search Documents an item from Elasticsearch',
      workflow: {
        nodes: [
          {
            name: 'Elasticsearch',
            type: 'n8n-nodes-base.elasticsearch',
            parameters: {
              operation: 'Search Documents',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default elasticsearchNode;