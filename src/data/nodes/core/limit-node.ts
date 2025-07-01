/**
 * # Limit
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * Use the Limit node to remove items beyond a defined maximum number. You can choose whether 
 * n8n takes the items from the beginning or end of the input data.
 * 
 * ## Key Features
 * 
 * - **Max Items Control**: Set maximum number of items to keep
 * - **Position Selection**: Choose items from beginning or end
 * - **Simple Configuration**: Two basic parameters for easy setup
 * - **Data Flow Control**: Manage large datasets efficiently
 * - **Workflow Optimization**: Prevent memory issues with large data sets
 * - **Flexible Filtering**: Keep first or last items based on requirements
 * 
 * ## Parameters
 * 
 * ### Max Items
 * Enter the maximum number of items that n8n should keep. If the input data contains 
 * more than this value, n8n removes the excess items.
 * 
 * ### Keep
 * If the node has to remove items, select where it keeps the input items from:
 * - **First Items**: Keeps the Max Items number of items from the beginning of the input data
 * - **Last Items**: Keeps the Max Items number of items from the end of the input data
 * 
 * ## Use Cases
 * 
 * - **API Response Limiting**: Limit large API responses to manageable sizes
 * - **Top N Results**: Get top N items from sorted data
 * - **Recent Items**: Get the most recent items from time-sorted data
 * - **Performance Optimization**: Prevent memory issues with large datasets
 * - **Sampling**: Create data samples from larger datasets
 * - **Pagination Control**: Control data flow in paginated workflows
 * - **Testing**: Limit data for testing and development purposes
 * - **Resource Management**: Manage processing resources effectively
 */

import { NodeTypeInfo } from '../../node-types.js';

export const limitNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.limit',
  displayName: 'Limit',
  description: 'Remove items beyond a defined maximum number. Choose items from beginning or end of input data.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'maxItems',
      displayName: 'Max Items',
      type: 'number',
      required: true,
      default: 1,
      description: 'Maximum number of items that n8n should keep',
      typeOptions: {
        minValue: 1
      }
    },
    {
      name: 'keep',
      displayName: 'Keep',
      type: 'options',
      required: true,
      default: 'firstItems',
      description: 'Select where to keep the input items from',
      options: [
        {
          name: 'First Items',
          value: 'firstItems',
          description: 'Keep the Max Items number of items from the beginning'
        },
        {
          name: 'Last Items',
          value: 'lastItems', 
          description: 'Keep the Max Items number of items from the end'
        }
      ]
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
      displayName: 'Output'
    }
  ],

  credentials: [],

  version: [1, 2],
  defaults: {
    name: 'Limit'
  },

  aliases: ['first', 'last', 'top', 'sample', 'truncate'],
  
  examples: [
    {
      name: 'Top 10 Results',
      description: 'Get the first 10 items from a dataset',
      workflow: {
        nodes: [
          {
            name: 'Limit',
            type: 'n8n-nodes-base.limit',
            parameters: {
              maxItems: 10,
              keep: 'firstItems'
            }
          }
        ]
      }
    },
    {
      name: 'Latest 5 Records',
      description: 'Get the 5 most recent items from time-sorted data',
      workflow: {
        nodes: [
          {
            name: 'Limit',
            type: 'n8n-nodes-base.limit',
            parameters: {
              maxItems: 5,
              keep: 'lastItems'
            }
          }
        ]
      }
    },
    {
      name: 'Data Sampling',
      description: 'Create a sample of 100 items for testing',
      workflow: {
        nodes: [
          {
            name: 'Limit',
            type: 'n8n-nodes-base.limit',
            parameters: {
              maxItems: 100,
              keep: 'firstItems'
            }
          }
        ]
      }
    }
  ]
};

export default limitNode;
