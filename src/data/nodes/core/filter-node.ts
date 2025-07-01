/**
 * Filter Node
 * 
 * Filters items based on conditions. This node passes through only the items that meet the specified criteria (conditions can be numeric, string, boolean comparisons, etc.), allowing conditional branching of data in workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const filterNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.filter',
  displayName: 'Filter',
  description: 'Filters items based on conditions. This node passes through only the items that meet the specified criteria (conditions can be numeric, string, boolean comparisons, etc.), allowing conditional branching of data in workflows.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'conditions',
      displayName: 'Conditions',
      type: 'fixedCollection',
      required: true,
      default: {
        values: [
          {
            field: '',
            operation: 'equal',
            value: ''
          }
        ]
      },
      description: 'The conditions that determine which items pass through the filter',
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
              displayName: 'Field',
              type: 'string',
              required: true,
              default: '',
              description: 'The field to check',
              placeholder: 'data.email'
            },
            {
              name: 'operation',
              displayName: 'Operation',
              type: 'options',
              required: true,
              default: 'equal',
              description: 'The comparison operation to perform',
              options: [
                { name: 'Equal', value: 'equal' },
                { name: 'Not Equal', value: 'notEqual' },
                { name: 'Contains', value: 'contains' },
                { name: 'Does Not Contain', value: 'notContains' },
                { name: 'Starts With', value: 'startsWith' },
                { name: 'Ends With', value: 'endsWith' },
                { name: 'Greater Than', value: 'greaterThan' },
                { name: 'Less Than', value: 'lessThan' },
                { name: 'Greater Than or Equal', value: 'greaterThanOrEqual' },
                { name: 'Less Than or Equal', value: 'lessThanOrEqual' },
                { name: 'Is Empty', value: 'isEmpty' },
                { name: 'Is Not Empty', value: 'isNotEmpty' },
                { name: 'Regex Match', value: 'regex' }
              ]
            },
            {
              name: 'value',
              displayName: 'Value',
              type: 'string',
              default: '',
              description: 'The value to compare against',
              placeholder: 'Enter comparison value',
              displayOptions: {
                hide: {
                  operation: ['isEmpty', 'isNotEmpty']
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'combineOperation',
      displayName: 'Combine',
      type: 'options',
      required: false,
      default: 'and',
      description: 'How to combine multiple conditions',
      options: [
        { name: 'AND', value: 'and', description: 'All conditions must be true' },
        { name: 'OR', value: 'or', description: 'At least one condition must be true' }
      ],
      displayOptions: {
        show: {
          'conditions.values': [2]
        }
      }
    },
    {
      name: 'keepOnlySet',
      displayName: 'Keep Only Set',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to keep only items that have the specified field set'
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
      displayName: 'Filtered Items',
      description: 'Items that passed the filter conditions'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Filter'
  },

  aliases: ['filter', 'condition', 'where'],
  
  examples: [
    {
      name: 'Filter by Email Domain',
      description: 'Filter items to only include Gmail addresses',
      workflow: {
        nodes: [
          {
            name: 'Filter',
            type: 'n8n-nodes-base.filter',
            parameters: {
              conditions: {
                values: [
                  {
                    field: 'email',
                    operation: 'contains',
                    value: '@gmail.com'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Filter by Status and Priority',
      description: 'Filter items where status is active AND priority is high',
      workflow: {
        nodes: [
          {
            name: 'Filter',
            type: 'n8n-nodes-base.filter',
            parameters: {
              conditions: {
                values: [
                  {
                    field: 'status',
                    operation: 'equal',
                    value: 'active'
                  },
                  {
                    field: 'priority',
                    operation: 'equal',
                    value: 'high'
                  }
                ]
              },
              combineOperation: 'and'
            }
          }
        ]
      }
    },
    {
      name: 'Filter Empty Fields',
      description: 'Remove items that have empty description fields',
      workflow: {
        nodes: [
          {
            name: 'Filter',
            type: 'n8n-nodes-base.filter',
            parameters: {
              conditions: {
                values: [
                  {
                    field: 'description',
                    operation: 'isNotEmpty'
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

export default filterNode;
