/**
 * Wikipedia Node
 * 
 * A tool that allows searching Wikipedia and retrieving article snippets. The agent can provide a query (like a topic or question) and this returns a summary or relevant extract from Wikipedia. Useful for general knowledge queries as part of an agent’s toolbox.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const wikipediaNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.wikipedia',
  displayName: 'Wikipedia',
  description: 'A tool that allows searching Wikipedia and retrieving article snippets. The agent can provide a query (like a topic or question) and this returns a summary or relevant extract from Wikipedia. Useful for general knowledge queries as part of an agent’s toolbox.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
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
      description: 'Processed data from Wikipedia'
    }
  ],

  credentials: [
    {
      name: 'wikipediaApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Wikipedia'
  },

  aliases: ['wikipedia'],
  
  examples: [
        {
      name: 'Provide Item',
      description: 'Provide an item from Wikipedia',
      workflow: {
        nodes: [
          {
            name: 'Wikipedia',
            type: 'n8n-nodes-base.wikipedia',
            parameters: {
              operation: 'provide',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default wikipediaNode;