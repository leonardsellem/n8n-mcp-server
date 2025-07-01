/**
 * # Split Out
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Split Out node to separate a single data item containing a list into multiple items. 
 * For example, a list of customers, and you want to split them so that you have an item for each customer.
 * 
 * ## Node Parameters
 * 
 * ### Field to Split Out
 * Enter the field containing the list you want to separate out into individual items.
 * If you're working with binary data inputs, use `$binary` in an expression to set the field to split out.
 * 
 * ### Include
 * Select whether and how you want n8n to keep any other fields from the input data with each new individual item:
 * - **No Other Fields**: No other fields will be included
 * - **All Other Fields**: All other fields will be included  
 * - **Selected Other Fields**: Only the selected fields will be included
 *   - **Fields to Include**: Enter a comma separated list of the fields you want to include
 * 
 * ## Node Options
 * 
 * ### Disable Dot Notation
 * By default, n8n enables dot notation to reference child fields in the format `parent.child`. 
 * Use this option to disable dot notation (turned on) or to continue using dot (turned off).
 * 
 * ### Destination Field Name
 * Enter the field in the output where the split field contents should go.
 * 
 * ### Include Binary
 * Choose whether to include binary data from the input in the new output (turned on) or not (turned off).
 * 
 * ## Key Features
 * 
 * - **Array splitting**: Convert arrays into individual workflow items
 * - **Flexible field inclusion**: Control which other fields are preserved
 * - **Dot notation support**: Access nested fields using `parent.child` format
 * - **Binary data handling**: Option to include or exclude binary data
 * - **Custom field naming**: Specify destination field names for split data
 * 
 * ## Use Cases
 * 
 * - Process each customer from a customer list individually
 * - Split API response arrays for individual item processing
 * - Convert bulk data into individual workflow items
 * - Extract nested arrays for separate processing
 * - Prepare data for batch operations on individual items
 * 
 * ## Related Resources
 * 
 * Learn more about data structure and data flow in n8n workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const splitoutNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.split-out',
  displayName: 'Split Out',
  description: 'Splits a single item that contains multiple elements (e.g., an array) into separate items. This is useful if a previous node returned data grouped in an array and you want to process each element individually in subsequent nodes.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'fieldToSplitOut',
      displayName: 'Field to Split Out',
      type: 'string',
      required: true,
      default: '',
      description: 'The field containing the array to split into separate items. Use $binary for binary data inputs.',
      placeholder: 'data.items'
    },
    {
      name: 'include',
      displayName: 'Include',
      type: 'options',
      required: true,
      default: 'allOtherFields',
      description: 'Whether and how to keep other fields from input data with each new item',
      options: [
        {
          name: 'No Other Fields',
          value: 'noOtherFields',
          description: 'No other fields will be included'
        },
        {
          name: 'All Other Fields',
          value: 'allOtherFields',
          description: 'All other fields will be included'
        },
        {
          name: 'Selected Other Fields',
          value: 'selectedOtherFields',
          description: 'Only the selected fields will be included'
        }
      ]
    },
    {
      name: 'fieldsToInclude',
      displayName: 'Fields to Include',
      type: 'string',
      required: true,
      default: '',
      description: 'Comma separated list of fields to include with each split item',
      placeholder: 'id, name, timestamp',
      displayOptions: {
        show: {
          include: ['selectedOtherFields']
        }
      }
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for splitting',
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
          default: '',
          description: 'Field name to store the split-out item data (defaults to the original field name)'
        },
        {
          name: 'includeBinary',
          displayName: 'Include Binary',
          type: 'boolean',
          default: true,
          description: 'Whether to include binary data from input in the new output'
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
      displayName: 'Split Items',
      description: 'Each array element as a separate workflow item'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Split Out'
  },

  aliases: ['split', 'out', 'splitout', 'array'],
  
  examples: [
    {
      name: 'Split Array Field',
      description: 'Split an array field into separate items',
      workflow: {
        nodes: [
          {
            name: 'Split Out',
            type: 'n8n-nodes-base.split-out',
            parameters: {
              fieldToSplitOut: 'users'
            }
          }
        ]
      }
    },
    {
      name: 'Split Nested Array',
      description: 'Split a nested array using dot notation',
      workflow: {
        nodes: [
          {
            name: 'Split Out',
            type: 'n8n-nodes-base.split-out',
            parameters: {
              fieldToSplitOut: 'response.data.results'
            }
          }
        ]
      }
    },
    {
      name: 'Split with Custom Field Name',
      description: 'Split array and rename the output field',
      workflow: {
        nodes: [
          {
            name: 'Split Out',
            type: 'n8n-nodes-base.split-out',
            parameters: {
              fieldToSplitOut: 'items',
              options: {
                destinationFieldName: 'product'
              }
            }
          }
        ]
      }
    }
  ]
};

export default splitoutNode;
