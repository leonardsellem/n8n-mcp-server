/**
 * QuickChart Node
 * 
 * Uses QuickChart API to create charts (as images) from data. You send chart configuration (like chart type and data in JSON or Chart.js format) and it returns an image URL or binary. Great for generating graphs on the fly for reports or notifications.
 */

import { NodeTypeInfo } from '../node-types.js';

export const quickchartNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.quickchart',
  displayName: 'QuickChart',
  description: 'Uses QuickChart API to create charts (as images) from data. You send chart configuration (like chart type and data in JSON or Chart.js format) and it returns an image URL or binary. Great for generating graphs on the fly for reports or notifications.',
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
      description: 'Processed data from QuickChart'
    }
  ],

  credentials: [
    {
      name: 'quickchartApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'QuickChart'
  },

  aliases: ['quickchart'],
  
  examples: [
        {
      name: 'Generate Chart Item',
      description: 'Generate Chart an item from QuickChart',
      workflow: {
        nodes: [
          {
            name: 'QuickChart',
            type: 'n8n-nodes-base.quickchart',
            parameters: {
              operation: 'Generate Chart',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default quickchartNode;