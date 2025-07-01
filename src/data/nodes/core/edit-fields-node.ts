/**
 * # Edit Fields (Set)
 * 
 * **Status**: Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * The Edit Fields node (also known as Set) allows you to add, modify, or remove fields from your data.
 * It's one of the most essential nodes for data transformation and preparation.
 * 
 * ## Key Features
 * 
 * - **Add Fields**: Add new fields with static or dynamic values
 * - **Modify Fields**: Update existing field values
 * - **Remove Fields**: Delete unwanted fields from data
 * - **Field Mapping**: Map fields from one structure to another
 * - **Data Type Conversion**: Convert between different data types
 * - **Expression Support**: Use expressions for dynamic field values
 * - **Multiple Operations**: Perform multiple field operations in one node
 * 
 * ## Use Cases
 * 
 * - Data cleaning and preparation
 * - API response transformation
 * - Adding metadata to records
 * - Field renaming and restructuring
 * - Data format standardization
 * - Removing sensitive information
 * - Preparing data for external systems
 * - Adding calculated fields
 * 
 * ## Operations
 * 
 * - **Keep Only Set Fields**: Keep only the fields you specify
 * - **Add Fields**: Add new fields to existing data
 * - **Remove Fields**: Remove specified fields
 * - **Include Fields**: Include only specified fields
 */

import { NodeTypeInfo } from '../../node-types.js';

export const editFieldsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.set',
  displayName: 'Edit Fields (Set)',
  description: 'Add, modify, or remove fields from data items. Essential for data transformation.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'manual',
      description: 'How to define the fields to set',
      options: [
        {
          name: 'Manual',
          value: 'manual',
          description: 'Define fields manually'
        },
        {
          name: 'Expression',
          value: 'expression',
          description: 'Use expressions to define fields'
        }
      ]
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Fields to add or modify',
      displayOptions: {
        show: {
          mode: ['manual']
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'values',
          displayName: 'Values',
          values: [
            {
              name: 'name',
              displayName: 'Name',
              type: 'string',
              required: true,
              default: '',
              description: 'Name of the field to set'
            },
            {
              name: 'type',
              displayName: 'Type',
              type: 'options',
              required: false,
              default: 'stringValue',
              description: 'Type of the value',
              options: [
                {
                  name: 'String',
                  value: 'stringValue'
                },
                {
                  name: 'Number',
                  value: 'numberValue'
                },
                {
                  name: 'Boolean',
                  value: 'booleanValue'
                },
                {
                  name: 'Array',
                  value: 'arrayValue'
                },
                {
                  name: 'Object',
                  value: 'objectValue'
                }
              ]
            },
            {
              name: 'stringValue',
              displayName: 'Value',
              type: 'string',
              required: false,
              default: '',
              description: 'Value to set',
              displayOptions: {
                show: {
                  type: ['stringValue']
                }
              }
            },
            {
              name: 'numberValue',
              displayName: 'Value',
              type: 'number',
              required: false,
              default: 0,
              description: 'Value to set',
              displayOptions: {
                show: {
                  type: ['numberValue']
                }
              }
            },
            {
              name: 'booleanValue',
              displayName: 'Value',
              type: 'boolean',
              required: false,
              default: false,
              description: 'Value to set',
              displayOptions: {
                show: {
                  type: ['booleanValue']
                }
              }
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
      description: 'Additional options for field operations',
      options: [
        {
          name: 'dotNotation',
          displayName: 'Dot Notation',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Allow dot notation for nested fields'
        },
        {
          name: 'keepOnlySet',
          displayName: 'Keep Only Set Fields',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Keep only the fields that are set'
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
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
    name: 'Edit Fields (Set)'
  },

  aliases: ['set', 'transform', 'modify', 'fields'],
  
  examples: [
    {
      name: 'Add New Fields',
      description: 'Add new fields to existing data',
      workflow: {
        nodes: [
          {
            name: 'Edit Fields (Set)',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              fields: {
                values: [
                  {
                    name: 'processedAt',
                    type: 'stringValue',
                    stringValue: '={{ new Date().toISOString() }}'
                  },
                  {
                    name: 'status',
                    type: 'stringValue',
                    stringValue: 'processed'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Transform Data Structure',
      description: 'Transform data from one structure to another',
      workflow: {
        nodes: [
          {
            name: 'Edit Fields (Set)',
            type: 'n8n-nodes-base.set',
            parameters: {
              mode: 'manual',
              fields: {
                values: [
                  {
                    name: 'fullName',
                    type: 'stringValue',
                    stringValue: '={{ $json.firstName }} {{ $json.lastName }}'
                  },
                  {
                    name: 'email',
                    type: 'stringValue',
                    stringValue: '={{ $json.email.toLowerCase() }}'
                  }
                ]
              },
              options: {
                keepOnlySet: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default editFieldsNode;
