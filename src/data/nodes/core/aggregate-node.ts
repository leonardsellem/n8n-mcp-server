/**
 * Aggregate Node
 * 
 * Groups multiple incoming items (or selected fields of items) into single combined items. Useful for bundling data (via modes like **Individual Fields** or **All Item Data**) before passing it to the next node.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const aggregateNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aggregate',
  displayName: 'Aggregate',
  description: 'Groups multiple incoming items (or selected fields of items) into single combined items. Useful for bundling data (via modes like **Individual Fields** or **All Item Data**) before passing it to the next node.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'aggregate',
      displayName: 'Aggregate',
      type: 'options',
      required: true,
      default: 'aggregateIndividualFields',
      description: 'How to aggregate the incoming data',
      options: [
        {
          name: 'Individual Fields',
          value: 'aggregateIndividualFields',
          description: 'Combine specific fields from all items'
        },
        {
          name: 'All Item Data',
          value: 'aggregateAllItemData',
          description: 'Combine all data from all items into arrays'
        }
      ]
    },
    {
      name: 'fieldsToAggregate',
      displayName: 'Fields to Aggregate',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'The fields to aggregate from the incoming items',
      typeOptions: {
        multipleValues: true,
        sortable: true
      },
      displayOptions: {
        show: {
          aggregate: ['aggregateIndividualFields']
        }
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
              description: 'The field to aggregate',
              placeholder: 'data.email'
            },
            {
              name: 'renameField',
              displayName: 'Rename Field',
              type: 'string',
              required: false,
              default: '',
              description: 'Optionally rename the aggregated field',
              placeholder: 'email_list'
            }
          ]
        }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for aggregation',
      options: [
        {
          name: 'disableDotNotation',
          displayName: 'Disable Dot Notation',
          type: 'boolean',
          default: false,
          description: 'Disable dot notation for nested field access'
        },
        {
          name: 'destinationFieldName',
          displayName: 'Destination Field Name',
          type: 'string',
          default: 'data',
          description: 'Field name to store aggregated data in',
          displayOptions: {
            show: {
              '/aggregate': ['aggregateAllItemData']
            }
          }
        },
        {
          name: 'includeNullValues',
          displayName: 'Include Null Values',
          type: 'boolean',
          default: false,
          description: 'Include null and undefined values in aggregation'
        },
        {
          name: 'mergeArrays',
          displayName: 'Merge Arrays',
          type: 'boolean',
          default: false,
          description: 'Merge array values instead of creating nested arrays'
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
      displayName: 'Aggregated Data',
      description: 'Single item containing aggregated data from all input items'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Aggregate'
  },

  aliases: ['aggregate', 'combine', 'merge', 'group'],
  
  examples: [
    {
      name: 'Aggregate Email List',
      description: 'Collect all email addresses into a single array',
      workflow: {
        nodes: [
          {
            name: 'Aggregate',
            type: 'n8n-nodes-base.aggregate',
            parameters: {
              aggregate: 'aggregateIndividualFields',
              fieldsToAggregate: {
                values: [
                  {
                    field: 'email',
                    renameField: 'email_list'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Aggregate All Data',
      description: 'Combine all item data into arrays organized by field',
      workflow: {
        nodes: [
          {
            name: 'Aggregate',
            type: 'n8n-nodes-base.aggregate',
            parameters: {
              aggregate: 'aggregateAllItemData',
              options: {
                destinationFieldName: 'collected_data'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Aggregate Multiple Fields',
      description: 'Collect multiple specific fields from all items',
      workflow: {
        nodes: [
          {
            name: 'Aggregate',
            type: 'n8n-nodes-base.aggregate',
            parameters: {
              aggregate: 'aggregateIndividualFields',
              fieldsToAggregate: {
                values: [
                  {
                    field: 'name',
                    renameField: 'user_names'
                  },
                  {
                    field: 'score',
                    renameField: 'user_scores'
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

export default aggregateNode;
