/**
 * # Summarize
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Summarize node to aggregate items together, in a manner similar to Excel pivot tables.
 * 
 * ## Node Parameters
 * 
 * ### Fields to Summarize
 * Use these fields to define how you want to summarize your input data:
 * 
 * **Aggregation Methods:**
 * - **Append**: Append values together
 *   - Option to include empty values
 * - **Average**: Calculate the numeric average of input data
 * - **Concatenate**: Combine values together
 *   - Option to include empty values
 *   - **Separator**: Select separator between concatenated values
 * - **Count**: Count total number of values
 * - **Count Unique**: Count number of unique values
 * - **Max**: Find the highest numeric value
 * - **Min**: Find the lowest numeric value
 * - **Sum**: Add together numeric values
 * 
 * **Field**: Enter the name of the field to perform aggregation on
 * 
 * ### Fields to Split By
 * Enter the name of input fields to split the summary by (similar to GROUP BY).
 * This allows separate summaries based on values in other fields.
 * 
 * Example: Sum `Deal Amount` split by `Sales Rep` to get totals per sales rep.
 * Use comma-separated list for multiple fields.
 * 
 * ## Node Options
 * 
 * ### Continue if Field Not Found
 * By default, missing fields throw an error. Enable this to continue and return empty item instead.
 * 
 * ### Disable Dot Notation
 * By default, n8n enables dot notation to reference child fields (`parent.child`).
 * Use this option to disable dot notation.
 * 
 * ### Output Format
 * Select format for output (recommended when using Fields to Split By):
 * - **Each Split in a Separate Item**: Generate separate output item for each split
 * - **All Splits in a Single Item**: Generate single item listing all splits
 * 
 * ### Ignore Items Without Valid Fields to Group By
 * Set whether to ignore input items that don't contain the Fields to Split By.
 * 
 * ## Key Features
 * 
 * - **Excel-like pivot tables**: Aggregate data similar to spreadsheet pivot functionality
 * - **Multiple aggregation methods**: Sum, average, count, min, max, concatenate, and more
 * - **Grouping support**: Split summaries by field values (GROUP BY functionality)
 * - **Flexible output formats**: Choose between separate items or single consolidated item
 * - **Dot notation support**: Access nested fields using `parent.child` format
 * - **Error handling**: Option to continue when fields are missing
 * 
 * ## Use Cases
 * 
 * - Sales reporting (sum deals by sales rep, product, or region)
 * - Data analytics and business intelligence
 * - Financial reporting and budget analysis
 * - Survey data aggregation and analysis
 * - Log analysis and metrics calculation
 * - Inventory reporting and stock analysis
 * 
 * ## Related Resources
 * 
 * Learn more about data structure and data flow in n8n workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const summarizeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.summarize',
  displayName: 'Summarize',
  description: 'Aggregate items together, in a manner similar to Excel pivot tables',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'fieldsToSummarize',
      displayName: 'Fields to Summarize',
      type: 'fixedCollection',
      required: true,
      default: {
        values: [
          {
            aggregation: 'sum',
            field: ''
          }
        ]
      },
      description: 'Define how you want to summarize your input data',
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
              name: 'aggregation',
              displayName: 'Aggregation',
              type: 'options',
              required: true,
              default: 'sum',
              description: 'The aggregation method to use',
              options: [
                { name: 'Append', value: 'append' },
                { name: 'Average', value: 'average' },
                { name: 'Concatenate', value: 'concatenate' },
                { name: 'Count', value: 'count' },
                { name: 'Count Unique', value: 'countUnique' },
                { name: 'Max', value: 'max' },
                { name: 'Min', value: 'min' },
                { name: 'Sum', value: 'sum' }
              ]
            },
            {
              name: 'field',
              displayName: 'Field',
              type: 'string',
              required: true,
              default: '',
              description: 'The field to perform aggregation on',
              placeholder: 'amount'
            },
            {
              name: 'includeEmptyValues',
              displayName: 'Include Empty Values',
              type: 'boolean',
              default: false,
              description: 'Whether to include empty values in the aggregation',
              displayOptions: {
                show: {
                  aggregation: ['append', 'concatenate']
                }
              }
            },
            {
              name: 'separator',
              displayName: 'Separator',
              type: 'options',
              default: ',',
              description: 'Separator to insert between concatenated values',
              options: [
                { name: 'Comma (,)', value: ',' },
                { name: 'Semicolon (;)', value: ';' },
                { name: 'Space ( )', value: ' ' },
                { name: 'Pipe (|)', value: '|' },
                { name: 'Tab', value: '\t' },
                { name: 'New Line', value: '\n' },
                { name: 'Custom', value: 'custom' }
              ],
              displayOptions: {
                show: {
                  aggregation: ['concatenate']
                }
              }
            },
            {
              name: 'customSeparator',
              displayName: 'Custom Separator',
              type: 'string',
              default: '',
              description: 'Custom separator to use between concatenated values',
              displayOptions: {
                show: {
                  aggregation: ['concatenate'],
                  separator: ['custom']
                }
              }
            }
          ]
        }
      ]
    },
    {
      name: 'fieldsToSplitBy',
      displayName: 'Fields to Split By',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to split the summary by (GROUP BY)',
      placeholder: 'category, region'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for summarization',
      options: [
        {
          name: 'continueIfFieldNotFound',
          displayName: 'Continue if Field Not Found',
          type: 'boolean',
          default: false,
          description: 'Continue and return empty item if field is missing instead of throwing error'
        },
        {
          name: 'disableDotNotation',
          displayName: 'Disable Dot Notation',
          type: 'boolean',
          default: false,
          description: 'Disable dot notation for nested field access'
        },
        {
          name: 'outputFormat',
          displayName: 'Output Format',
          type: 'options',
          default: 'separateItems',
          description: 'Format for output (recommended when using Fields to Split By)',
          options: [
            { name: 'Each Split in a Separate Item', value: 'separateItems' },
            { name: 'All Splits in a Single Item', value: 'singleItem' }
          ]
        },
        {
          name: 'ignoreItemsWithoutValidFields',
          displayName: 'Ignore Items Without Valid Fields to Group By',
          type: 'boolean',
          default: false,
          description: 'Ignore input items that don\'t contain the Fields to Split By'
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
      displayName: 'Summarized Data',
      description: 'Aggregated data based on specified criteria'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Summarize'
  },

  aliases: ['summarize', 'aggregate', 'pivot', 'group'],
  
  examples: [
    {
      name: 'Sum Sales by Rep',
      description: 'Calculate total sales amount for each sales representative',
      workflow: {
        nodes: [
          {
            name: 'Summarize',
            type: 'n8n-nodes-base.summarize',
            parameters: {
              fieldsToSummarize: {
                values: [
                  {
                    aggregation: 'sum',
                    field: 'amount'
                  }
                ]
              },
              fieldsToSplitBy: 'sales_rep'
            }
          }
        ]
      }
    },
    {
      name: 'Count Orders by Status',
      description: 'Count number of orders for each status type',
      workflow: {
        nodes: [
          {
            name: 'Summarize',
            type: 'n8n-nodes-base.summarize',
            parameters: {
              fieldsToSummarize: {
                values: [
                  {
                    aggregation: 'count',
                    field: 'order_id'
                  }
                ]
              },
              fieldsToSplitBy: 'status'
            }
          }
        ]
      }
    },
    {
      name: 'Average Score by Category',
      description: 'Calculate average score for each product category',
      workflow: {
        nodes: [
          {
            name: 'Summarize',
            type: 'n8n-nodes-base.summarize',
            parameters: {
              fieldsToSummarize: {
                values: [
                  {
                    aggregation: 'average',
                    field: 'rating'
                  }
                ]
              },
              fieldsToSplitBy: 'category'
            }
          }
        ]
      }
    }
  ]
};

export default summarizeNode;
