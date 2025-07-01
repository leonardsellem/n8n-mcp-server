/**
 * # Stop And Error
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Flow Logic
 * 
 * ## Description
 * 
 * Use the Stop And Error node to display custom error messages, cause executions to fail under certain conditions, 
 * and send custom error information to error workflows.
 * 
 * ## Operations
 * 
 * ### Error Message
 * Throw a simple error message to stop workflow execution.
 * 
 * ### Error Object
 * Throw a detailed error object with custom properties to stop workflow execution.
 * 
 * ## Node Parameters
 * 
 * Both operations include the **Error Type** parameter to select the type of error to throw.
 * 
 * ### Error Message Parameters
 * - **Error Message**: Enter the message you'd like to throw
 * 
 * ### Error Object Parameters
 * - **Error Object**: Enter a JSON object that contains the error properties you'd like to throw
 * 
 * ## Key Features
 * 
 * - **Custom error messages**: Display meaningful error messages for debugging
 * - **Conditional workflow stopping**: Stop execution based on specific conditions
 * - **Error workflow integration**: Send custom error information to error workflows
 * - **Flexible error data**: Include structured error objects with detailed information
 * - **Workflow validation**: Implement validation checkpoints in workflows
 * 
 * ## Use Cases
 * 
 * - Data validation checkpoints (stop if data is invalid)
 * - Conditional workflow termination
 * - Custom error reporting for debugging
 * - Integration with error handling workflows
 * - Business logic validation (e.g., stop if budget exceeded)
 * - Input sanitization and validation
 * 
 * ## Related Resources
 * 
 * You can use the Stop And Error node with the Error trigger node.
 * Read more about Error workflows in n8n workflows.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const stopanderrorNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stopanderror',
  displayName: 'Stop And Error',
  description: 'Display custom error messages, cause executions to fail under certain conditions, and send custom error information to error workflows',
  category: 'Core Nodes',
  subcategory: 'Flow Logic',
  
  properties: [
    {
      name: 'errorType',
      displayName: 'Error Type',
      type: 'options',
      required: true,
      default: 'errorMessage',
      description: 'The type of error to throw',
      options: [
        {
          name: 'Error Message',
          value: 'errorMessage',
          description: 'Throw a simple error message'
        },
        {
          name: 'Error Object',
          value: 'errorObject',
          description: 'Throw a detailed error object'
        }
      ]
    },
    {
      name: 'errorMessage',
      displayName: 'Error Message',
      type: 'string',
      required: true,
      default: 'Workflow execution stopped',
      description: 'The error message to display when the workflow stops',
      placeholder: 'Invalid data detected - stopping workflow',
      displayOptions: {
        show: {
          errorType: ['errorMessage']
        }
      }
    },
    {
      name: 'errorObject',
      displayName: 'Error Object',
      type: 'json',
      required: true,
      default: '{\n  "message": "Workflow execution stopped",\n  "code": "WORKFLOW_STOPPED",\n  "details": {}\n}',
      description: 'A JSON object containing the error properties to throw',
      displayOptions: {
        show: {
          errorType: ['errorObject']
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

  outputs: [],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Stop And Error'
  },

  aliases: ['stop', 'error', 'fail', 'throw'],
  
  examples: [
    {
      name: 'Simple Error Message',
      description: 'Stop workflow with a simple error message',
      workflow: {
        nodes: [
          {
            name: 'Stop And Error',
            type: 'n8n-nodes-base.stopanderror',
            parameters: {
              errorType: 'errorMessage',
              errorMessage: 'Data validation failed - invalid email format'
            }
          }
        ]
      }
    },
    {
      name: 'Detailed Error Object',
      description: 'Stop workflow with detailed error information',
      workflow: {
        nodes: [
          {
            name: 'Stop And Error',
            type: 'n8n-nodes-base.stopanderror',
            parameters: {
              errorType: 'errorObject',
              errorObject: {
                message: 'Budget limit exceeded',
                code: 'BUDGET_EXCEEDED',
                details: {
                  currentAmount: 15000,
                  budgetLimit: 10000,
                  overageAmount: 5000
                }
              }
            }
          }
        ]
      }
    },
    {
      name: 'Conditional Data Validation',
      description: 'Stop workflow if required data is missing',
      workflow: {
        nodes: [
          {
            name: 'Stop And Error',
            type: 'n8n-nodes-base.stopanderror',
            parameters: {
              errorType: 'errorMessage',
              errorMessage: 'Required field "customer_id" is missing from input data'
            }
          }
        ]
      }
    },
    {
      name: 'API Error Handling',
      description: 'Stop workflow with API error details',
      workflow: {
        nodes: [
          {
            name: 'Stop And Error',
            type: 'n8n-nodes-base.stopanderror',
            parameters: {
              errorType: 'errorObject',
              errorObject: {
                message: 'API request failed',
                code: 'API_ERROR',
                details: {
                  statusCode: 401,
                  endpoint: '/api/users',
                  timestamp: '2024-01-15T10:30:00Z'
                }
              }
            }
          }
        ]
      }
    }
  ]
};

export default stopanderrorNode;
