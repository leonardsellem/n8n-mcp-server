/**
 * BambooHR Node
 * 
 * Integrates with BambooHR (HR management platform). You can retrieve employee data, list employees, add a new employee record, or update an existing employee’s information. Useful for HR automation tasks.
 */

import { NodeTypeInfo } from '../node-types.js';

export const bamboohrNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bamboohr',
  displayName: 'BambooHR',
  description: 'Integrates with BambooHR (HR management platform). You can retrieve employee data, list employees, add a new employee record, or update an existing employee’s information. Useful for HR automation tasks.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Employee',
      description: 'The operation to perform',
      options: [
        { name: 'Get Employee', value: 'Get Employee' },
        { name: 'List Employees', value: 'List Employees' },
        { name: 'Add Employee', value: 'Add Employee' },
        { name: 'Update Employee', value: 'Update Employee' }
      ]
    },

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
      description: 'Processed data from BambooHR'
    }
  ],

  credentials: [
    {
      name: 'bamboohrApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'BambooHR'
  },

  aliases: ['bamboohr'],
  
  examples: [
        {
      name: 'Get Employee Item',
      description: 'Get Employee an item from BambooHR',
      workflow: {
        nodes: [
          {
            name: 'BambooHR',
            type: 'n8n-nodes-base.bamboohr',
            parameters: {
              operation: 'Get Employee',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default bamboohrNode;