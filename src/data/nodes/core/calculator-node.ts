/**
 * Calculator Node
 * 
 * A tool that can evaluate mathematical expressions. Often used by an AI agent that when encountering a math problem, can delegate computation to this calculator and get the result. It handles arithmetic or maybe more complex calculations reliably instead of forcing the LLM to do math.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const calculatorNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.calculator',
  displayName: 'Calculator',
  description: 'A tool that can evaluate mathematical expressions. Often used by an AI agent that when encountering a math problem, can delegate computation to this calculator and get the result. It handles arithmetic or maybe more complex calculations reliably instead of forcing the LLM to do math.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'evaluate',
      description: 'The type of calculation to perform',
      options: [
        { name: 'Evaluate Expression', value: 'evaluate', description: 'Evaluate a mathematical expression' },
        { name: 'Sum', value: 'sum', description: 'Calculate sum of values' },
        { name: 'Average', value: 'average', description: 'Calculate average of values' },
        { name: 'Min', value: 'min', description: 'Find minimum value' },
        { name: 'Max', value: 'max', description: 'Find maximum value' },
        { name: 'Count', value: 'count', description: 'Count number of values' },
        { name: 'Round', value: 'round', description: 'Round to specified decimal places' }
      ]
    },
    {
      name: 'expression',
      displayName: 'Expression',
      type: 'string',
      required: true,
      default: '',
      description: 'Mathematical expression to evaluate (e.g., 2 + 3 * 4, sqrt(16), sin(30))',
      placeholder: '{{ $json.value1 }} + {{ $json.value2 }}',
      displayOptions: {
        show: {
          operation: ['evaluate']
        }
      }
    },
    {
      name: 'values',
      displayName: 'Values',
      type: 'string',
      required: true,
      default: '',
      description: 'Comma-separated values or field reference for calculation',
      placeholder: '{{ $json.numbers }}',
      displayOptions: {
        show: {
          operation: ['sum', 'average', 'min', 'max', 'count']
        }
      }
    },
    {
      name: 'number',
      displayName: 'Number',
      type: 'number',
      required: true,
      default: 0,
      description: 'The number to round',
      displayOptions: {
        show: {
          operation: ['round']
        }
      }
    },
    {
      name: 'decimalPlaces',
      displayName: 'Decimal Places',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of decimal places to round to',
      typeOptions: {
        minValue: 0,
        maxValue: 10
      },
      displayOptions: {
        show: {
          operation: ['round']
        }
      }
    },
    {
      name: 'outputField',
      displayName: 'Output Field',
      type: 'string',
      required: false,
      default: 'result',
      description: 'Name of the field to store the result in',
      placeholder: 'calculation_result'
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
      displayName: 'Result',
      description: 'Calculated result with original data'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Calculator'
  },

  aliases: ['calculator', 'math', 'calculate', 'evaluate'],
  
  examples: [
    {
      name: 'Basic Math Expression',
      description: 'Evaluate a simple mathematical expression',
      workflow: {
        nodes: [
          {
            name: 'Calculator',
            type: 'n8n-nodes-base.calculator',
            parameters: {
              operation: 'evaluate',
              expression: '({{ $json.price }} * {{ $json.quantity }}) * 0.08',
              outputField: 'tax_amount'
            }
          }
        ]
      }
    },
    {
      name: 'Sum Array Values',
      description: 'Calculate the sum of an array of numbers',
      workflow: {
        nodes: [
          {
            name: 'Calculator',
            type: 'n8n-nodes-base.calculator',
            parameters: {
              operation: 'sum',
              values: '{{ $json.sales_data }}',
              outputField: 'total_sales'
            }
          }
        ]
      }
    },
    {
      name: 'Scientific Functions',
      description: 'Use scientific functions like sqrt, sin, cos',
      workflow: {
        nodes: [
          {
            name: 'Calculator',
            type: 'n8n-nodes-base.calculator',
            parameters: {
              operation: 'evaluate',
              expression: 'sqrt({{ $json.area }}) + sin({{ $json.angle }} * PI / 180)',
              outputField: 'calculated_value'
            }
          }
        ]
      }
    },
    {
      name: 'Round to Decimal Places',
      description: 'Round a number to specific decimal places',
      workflow: {
        nodes: [
          {
            name: 'Calculator',
            type: 'n8n-nodes-base.calculator',
            parameters: {
              operation: 'round',
              number: '{{ $json.precise_value }}',
              decimalPlaces: 2,
              outputField: 'rounded_value'
            }
          }
        ]
      }
    }
  ]
};

export default calculatorNode;
