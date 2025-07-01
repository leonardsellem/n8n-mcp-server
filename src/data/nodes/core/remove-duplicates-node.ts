/**
 * # Remove Duplicates
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * Use the Remove Duplicates node to identify and delete items that are identical across 
 * all fields or a subset of fields in a single execution, or identical to items seen 
 * in previous executions.
 * 
 * ## Major Changes in v1.64.0
 * 
 * The n8n team overhauled this node in n8n 1.64.0 with enhanced functionality for 
 * cross-execution deduplication and improved field comparison options.
 * 
 * ## Key Features
 * 
 * - **Current Input Deduplication**: Remove duplicates within current execution
 * - **Cross-Execution Tracking**: Compare against previous executions
 * - **Flexible Field Comparison**: All fields, selected fields, or exclude fields
 * - **Value-Based Filtering**: Keep higher values or later dates
 * - **History Management**: Control deduplication database size and scope
 * - **Scope Control**: Node-level or workflow-level deduplication
 * - **Database Cleanup**: Clear deduplication history when needed
 * 
 * ## Operation Modes
 * 
 * ### Remove Items Repeated Within Current Input
 * Identify and remove duplicate items in the current input across all fields or a subset of fields.
 * 
 * ### Remove Items Processed in Previous Executions
 * Compare items in the current input to items from previous executions and remove duplicates.
 * Can keep items with new values, higher values, or later dates.
 * 
 * ### Clear Deduplication History
 * Wipe the memory of items from previous executions to reset the deduplication database.
 * 
 * ## Use Cases
 * 
 * - **Prevent Duplicate User Accounts**: Remove users with same email addresses
 * - **Order Deduplication**: Prevent duplicate customer orders
 * - **Data Cleaning**: Remove duplicate records from large datasets
 * - **Incremental Processing**: Only process new or updated records
 * - **Time-Based Filtering**: Keep only the latest entries by date
 * - **Value Monitoring**: Track increasing metrics and ignore decreases
 * - **Database Maintenance**: Clean up accumulated deduplication data
 * - **Workflow Optimization**: Reduce processing of already-handled items
 */

import { NodeTypeInfo } from '../../node-types.js';

export const removeDuplicatesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.removeduplicates',
  displayName: 'Remove Duplicates',
  description: 'Identify and delete duplicate items within current input or across previous executions.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'removeItemsRepeatedInCurrentInput',
      description: 'The deduplication operation to perform',
      options: [
        {
          name: 'Remove Items Repeated Within Current Input',
          value: 'removeItemsRepeatedInCurrentInput',
          description: 'Remove duplicate items in the current input'
        },
        {
          name: 'Remove Items Processed in Previous Executions',
          value: 'removeItemsProcessedInPreviousExecutions',
          description: 'Compare against items from previous executions'
        },
        {
          name: 'Clear Deduplication History',
          value: 'clearDeduplicationHistory',
          description: 'Wipe the memory of items from previous executions'
        }
      ]
    },
    
    // Remove Items Repeated Within Current Input Parameters
    {
      name: 'compare',
      displayName: 'Compare',
      type: 'options',
      required: true,
      default: 'allFields',
      description: 'Which fields to compare to check if items are the same',
      displayOptions: {
        show: {
          operation: ['removeItemsRepeatedInCurrentInput']
        }
      },
      options: [
        {
          name: 'All Fields',
          value: 'allFields',
          description: 'Compare all fields of the input data'
        },
        {
          name: 'All Fields Except',
          value: 'allFieldsExcept',
          description: 'Compare all fields except specified ones'
        },
        {
          name: 'Selected Fields',
          value: 'selectedFields',
          description: 'Compare only specified fields'
        }
      ]
    },
    {
      name: 'fieldsToExclude',
      displayName: 'Fields to Exclude',
      type: 'string',
      required: true,
      default: '',
      description: 'Comma-separated list of fields to exclude from comparison',
      displayOptions: {
        show: {
          operation: ['removeItemsRepeatedInCurrentInput'],
          compare: ['allFieldsExcept']
        }
      }
    },
    {
      name: 'fieldsToInclude',
      displayName: 'Fields to Include',
      type: 'string',
      required: true,
      default: '',
      description: 'Comma-separated list of fields to include in comparison',
      displayOptions: {
        show: {
          operation: ['removeItemsRepeatedInCurrentInput'],
          compare: ['selectedFields']
        }
      }
    },
    
    // Remove Items Processed in Previous Executions Parameters
    {
      name: 'keepItemsWhere',
      displayName: 'Keep Items Where',
      type: 'options',
      required: true,
      default: 'valueIsNew',
      description: 'How n8n decides which items to keep',
      displayOptions: {
        show: {
          operation: ['removeItemsProcessedInPreviousExecutions']
        }
      },
      options: [
        {
          name: 'Value Is New',
          value: 'valueIsNew',
          description: 'Remove items if their value matches previous executions'
        },
        {
          name: 'Value Is Higher than Any Previous Value',
          value: 'valueIsHigher',
          description: 'Remove items if current value is not higher than previous'
        },
        {
          name: 'Value Is a Date Later than Any Previous Date',
          value: 'dateIsLater',
          description: 'Remove items if current date is not later than previous'
        }
      ]
    },
    {
      name: 'valueToDedupeOn',
      displayName: 'Value to Dedupe On',
      type: 'string',
      required: true,
      default: 'id',
      description: 'Input field or combination of fields to compare',
      displayOptions: {
        show: {
          operation: ['removeItemsProcessedInPreviousExecutions']
        }
      }
    },
    
    // Clear Deduplication History Parameters
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'cleanDatabase',
      description: 'How to manage the stored deduplication data',
      displayOptions: {
        show: {
          operation: ['clearDeduplicationHistory']
        }
      },
      options: [
        {
          name: 'Clean Database',
          value: 'cleanDatabase',
          description: 'Delete all duplication data stored in the database'
        }
      ]
    },
    
    // Options
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for deduplication',
      options: [
        {
          name: 'disableDotNotation',
          displayName: 'Disable Dot Notation',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Disable dot notation for referencing child fields'
        },
        {
          name: 'removeOtherFields',
          displayName: 'Remove Other Fields',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Remove fields that are not used in the comparison'
        },
        {
          name: 'scope',
          displayName: 'Scope',
          type: 'options',
          required: false,
          default: 'node',
          description: 'How deduplication data is stored and shared',
          options: [
            {
              name: 'Node',
              value: 'node',
              description: 'Store data independently for this node instance'
            },
            {
              name: 'Workflow',
              value: 'workflow',
              description: 'Share data with other Remove Duplicate nodes in workflow'
            }
          ]
        },
        {
          name: 'historySize',
          displayName: 'History Size',
          type: 'number',
          required: false,
          default: 10000,
          description: 'Number of items to store for tracking duplicates across executions',
          typeOptions: {
            minValue: 1,
            maxValue: 100000
          }
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
      displayName: 'Output'
    }
  ],

  credentials: [],

  version: [1, 2, 3],
  defaults: {
    name: 'Remove Duplicates'
  },

  aliases: ['dedupe', 'unique', 'distinct', 'filter'],
  
  examples: [
    {
      name: 'Remove Duplicate Users by Email',
      description: 'Remove users with duplicate email addresses within current input',
      workflow: {
        nodes: [
          {
            name: 'Remove Duplicates',
            type: 'n8n-nodes-base.removeduplicates',
            parameters: {
              operation: 'removeItemsRepeatedInCurrentInput',
              compare: 'selectedFields',
              fieldsToInclude: 'email'
            }
          }
        ]
      }
    },
    {
      name: 'Process Only New Records',
      description: 'Skip records that have been processed in previous executions',
      workflow: {
        nodes: [
          {
            name: 'Remove Duplicates',
            type: 'n8n-nodes-base.removeduplicates',
            parameters: {
              operation: 'removeItemsProcessedInPreviousExecutions',
              keepItemsWhere: 'valueIsNew',
              valueToDedupeOn: 'id',
              options: {
                scope: 'workflow',
                historySize: 5000
              }
            }
          }
        ]
      }
    },
    {
      name: 'Keep Latest Entries by Date',
      description: 'Keep only records with dates later than previously seen',
      workflow: {
        nodes: [
          {
            name: 'Remove Duplicates',
            type: 'n8n-nodes-base.removeduplicates',
            parameters: {
              operation: 'removeItemsProcessedInPreviousExecutions',
              keepItemsWhere: 'dateIsLater',
              valueToDedupeOn: 'createdAt'
            }
          }
        ]
      }
    },
    {
      name: 'Clear Deduplication Database',
      description: 'Reset the deduplication history for this workflow',
      workflow: {
        nodes: [
          {
            name: 'Remove Duplicates',
            type: 'n8n-nodes-base.removeduplicates',
            parameters: {
              operation: 'clearDeduplicationHistory',
              mode: 'cleanDatabase',
              options: {
                scope: 'workflow'
              }
            }
          }
        ]
      }
    }
  ]
};

export default removeDuplicatesNode;
