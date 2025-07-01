/**
 * # Sort
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Sort node to organize lists of items in a desired ordering, or generate a random selection.
 * 
 * **Array Sort Behavior**: The Sort operation uses the default JavaScript operation where the elements 
 * to be sorted are converted into strings and their values compared. Refer to Mozilla's guide to 
 * Array sort to learn more.
 * 
 * ## Node Parameters
 * 
 * Configure this node using the **Type** parameter with these options:
 * 
 * ### Simple
 * Performs an ascending or descending sort using the selected fields.
 * - Use the **Add Field To Sort By** button to input the **Field Name**
 * - Select whether to use **Ascending** or **Descending** order
 * - Option to **Disable Dot Notation** for child field references
 * 
 * ### Random
 * Creates a random order in the list.
 * 
 * ### Code
 * Input custom JavaScript code to perform the sort operation. Good option if a simple sort won't meet your needs.
 * 
 * ## Key Features
 * 
 * - **Multi-field sorting**: Sort by multiple fields with different directions
 * - **Dot notation support**: Access nested fields using `parent.child` format
 * - **Custom sorting**: Use JavaScript code for complex sorting logic
 * - **Random shuffling**: Generate random order of items
 * - **Case sensitivity options**: Control string comparison behavior
 * - **Null handling**: Control positioning of null values in results
 * 
 * ## Use Cases
 * 
 * - Sort product lists by price, rating, or name
 * - Organize user data by registration date or activity
 * - Randomize content for A/B testing
 * - Custom sorting algorithms for specific business logic
 * - Multi-criteria sorting (e.g., priority then date)
 * 
 * ## Related Resources
 * 
 * Learn more about data structure and data flow in n8n workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const sortNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.sort',
  displayName: 'Sort',
  description: 'Sorts the items of a list by their fields. Allows you to specify the field to sort by and the direction (ascending or descending).',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'type',
      displayName: 'Type',
      type: 'options',
      required: true,
      default: 'simple',
      description: 'How to perform the sort operation',
      options: [
        {
          name: 'Simple',
          value: 'simple',
          description: 'Sort by field names in ascending or descending order'
        },
        {
          name: 'Random',
          value: 'random',
          description: 'Create a random order in the list'
        },
        {
          name: 'Code',
          value: 'code',
          description: 'Use custom JavaScript code for sorting'
        }
      ]
    },
    {
      name: 'sortFieldsUi',
      displayName: 'Fields To Sort By',
      type: 'fixedCollection',
      required: true,
      default: {
        values: [
          {
            field: '',
            direction: 'asc'
          }
        ]
      },
      description: 'The fields to sort by',
      displayOptions: {
        show: {
          type: ['simple']
        }
      },
      typeOptions: {
        multipleValues: true,
        sortable: true
      },
      options: [
        {
          name: 'values',
          displayName: 'Values',
          values: [
            {
              name: 'field',
              displayName: 'Field Name',
              type: 'string',
              required: true,
              default: '',
              description: 'The field to sort by',
              placeholder: 'name'
            },
            {
              name: 'direction',
              displayName: 'Direction',
              type: 'options',
              required: true,
              default: 'asc',
              description: 'Sort direction',
              options: [
                { name: 'Ascending', value: 'asc' },
                { name: 'Descending', value: 'desc' }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'code',
      displayName: 'Code',
      type: 'string',
      required: true,
      default: '// Sort items by a custom JavaScript function\n// Available variables: items\n// Return: sorted array\n\nreturn items.sort((a, b) => {\n  // Your custom sorting logic here\n  return 0;\n});',
      description: 'Custom JavaScript code to perform the sort operation',
      displayOptions: {
        show: {
          type: ['code']
        }
      },
      typeOptions: {
        rows: 10
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional sorting options',
      options: [
        {
          name: 'disableDotNotation',
          displayName: 'Disable Dot Notation',
          type: 'boolean',
          default: false,
          description: 'Disable dot notation for nested field access'
        },
        {
          name: 'caseSensitive',
          displayName: 'Case Sensitive',
          type: 'boolean',
          default: false,
          description: 'Whether string comparisons should be case sensitive'
        },
        {
          name: 'nullsFirst',
          displayName: 'Nulls First',
          type: 'boolean',
          default: false,
          description: 'Whether null values should appear first in the sorted results'
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
      displayName: 'Sorted Items',
      description: 'Items sorted according to the specified criteria'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Sort'
  },

  aliases: ['sort', 'order'],
  
  examples: [
    {
      name: 'Sort by Name',
      description: 'Sort items alphabetically by name',
      workflow: {
        nodes: [
          {
            name: 'Sort',
            type: 'n8n-nodes-base.sort',
            parameters: {
              sortFieldsUi: {
                values: [
                  {
                    field: 'name',
                    direction: 'asc'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Multi-field Sort',
      description: 'Sort by priority (desc) then by date (asc)',
      workflow: {
        nodes: [
          {
            name: 'Sort',
            type: 'n8n-nodes-base.sort',
            parameters: {
              sortFieldsUi: {
                values: [
                  {
                    field: 'priority',
                    direction: 'desc'
                  },
                  {
                    field: 'created_date',
                    direction: 'asc'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Sort Nested Field',
      description: 'Sort by a nested field using dot notation',
      workflow: {
        nodes: [
          {
            name: 'Sort',
            type: 'n8n-nodes-base.sort',
            parameters: {
              sortFieldsUi: {
                values: [
                  {
                    field: 'user.score',
                    direction: 'desc'
                  }
                ]
              }
            }
          }
        ]
      }
    }
  ]
};

export default sortNode;
