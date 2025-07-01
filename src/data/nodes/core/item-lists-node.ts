/**
 * # Item Lists
 * 
 * **Status**: Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * The Item Lists node provides powerful operations for working with arrays and lists of data.
 * It can split items into separate executions, combine multiple items, and perform various list operations.
 * 
 * ## Key Features
 * 
 * - **Split Items**: Convert array items into separate workflow items
 * - **Combine Items**: Merge multiple items into a single array
 * - **List Operations**: Sort, filter, and manipulate lists
 * - **Aggregation**: Group and aggregate data from lists
 * - **Transformation**: Transform list structures and formats
 * - **Deduplication**: Remove duplicate items from lists
 * - **Pagination**: Handle paginated data sets
 * 
 * ## Use Cases
 * 
 * - Processing API responses with arrays
 * - Splitting bulk data into individual items
 * - Combining results from multiple sources
 * - Data aggregation and summarization
 * - List manipulation and transformation
 * - Handling paginated API responses
 * - Removing duplicates from datasets
 * - Preparing data for batch processing
 * 
 * ## Operations
 * 
 * - **Split Out Items**: Split array into separate items
 * - **Aggregate Items**: Combine items into arrays
 * - **Sort Items**: Sort items by specified criteria
 * - **Limit Items**: Limit number of items processed
 * - **Remove Duplicates**: Filter out duplicate items
 */

import { NodeTypeInfo } from '../../node-types.js';

export const itemListsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.itemLists',
  displayName: 'Item Lists',
  description: 'Manipulate lists of items with operations like split, combine, sort, and aggregate.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'splitOutItems',
      description: 'Operation to perform on the item list',
      options: [
        {
          name: 'Split Out Items',
          value: 'splitOutItems',
          description: 'Split array items into separate workflow executions'
        },
        {
          name: 'Aggregate Items',
          value: 'aggregateItems',
          description: 'Combine multiple items into arrays'
        },
        {
          name: 'Sort Items',
          value: 'sort',
          description: 'Sort items by specified field'
        },
        {
          name: 'Limit Items',
          value: 'limit',
          description: 'Limit the number of items'
        },
        {
          name: 'Remove Duplicates',
          value: 'removeDuplicates',
          description: 'Remove duplicate items from the list'
        }
      ]
    },
    {
      name: 'fieldName',
      displayName: 'Field Name',
      type: 'string',
      required: true,
      default: '',
      description: 'Name of the field containing the array to split',
      displayOptions: {
        show: {
          operation: ['splitOutItems']
        }
      }
    },
    {
      name: 'sortFieldName',
      displayName: 'Sort Field',
      type: 'string',
      required: true,
      default: '',
      description: 'Field name to sort by',
      displayOptions: {
        show: {
          operation: ['sort']
        }
      }
    },
    {
      name: 'sortOrder',
      displayName: 'Sort Order',
      type: 'options',
      required: false,
      default: 'ascending',
      description: 'Order to sort items',
      displayOptions: {
        show: {
          operation: ['sort']
        }
      },
      options: [
        {
          name: 'Ascending',
          value: 'ascending'
        },
        {
          name: 'Descending',
          value: 'descending'
        }
      ]
    },
    {
      name: 'maxItems',
      displayName: 'Max Items',
      type: 'number',
      required: true,
      default: 1,
      description: 'Maximum number of items to return',
      displayOptions: {
        show: {
          operation: ['limit']
        }
      }
    },
    {
      name: 'aggregateBy',
      displayName: 'Aggregate By',
      type: 'string',
      required: false,
      default: '',
      description: 'Field to group items by (leave empty to aggregate all)',
      displayOptions: {
        show: {
          operation: ['aggregateItems']
        }
      }
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

  version: [1, 2, 3],
  defaults: {
    name: 'Item Lists'
  },

  aliases: ['split', 'combine', 'aggregate', 'list', 'array'],
  
  examples: [
    {
      name: 'Split Array Items',
      description: 'Split an array field into separate workflow items',
      workflow: {
        nodes: [
          {
            name: 'Item Lists',
            type: 'n8n-nodes-base.itemLists',
            parameters: {
              operation: 'splitOutItems',
              fieldName: 'results'
            }
          }
        ]
      }
    },
    {
      name: 'Sort Items',
      description: 'Sort items by a specific field',
      workflow: {
        nodes: [
          {
            name: 'Item Lists',
            type: 'n8n-nodes-base.itemLists',
            parameters: {
              operation: 'sort',
              sortFieldName: 'createdAt',
              sortOrder: 'descending'
            }
          }
        ]
      }
    },
    {
      name: 'Limit Results',
      description: 'Limit the number of items processed',
      workflow: {
        nodes: [
          {
            name: 'Item Lists',
            type: 'n8n-nodes-base.itemLists',
            parameters: {
              operation: 'limit',
              maxItems: 10
            }
          }
        ]
      }
    }
  ]
};

export default itemListsNode;
