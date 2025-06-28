import { NodeTypeInfo } from '../../node-types.js';

export const mergeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.merge',
  displayName: 'Merge',
  description: 'Combine data from multiple workflow branches or inputs. Merge datasets, wait for multiple operations to complete, or join data based on common fields.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'append',
      description: 'How to merge the data',
      options: [
        { name: 'Append', value: 'append', description: 'Combine all data items into one list' },
        { name: 'Pass-through', value: 'passThrough', description: 'Keep data separate by input' },
        { name: 'Wait', value: 'wait', description: 'Wait for all inputs to have data' },
        { name: 'Merge by Key', value: 'mergeByKey', description: 'Join data based on matching field values' },
        { name: 'Merge by Index', value: 'mergeByIndex', description: 'Combine items with same array position' }
      ]
    },
    {
      name: 'joinMode',
      displayName: 'Join Mode',
      type: 'options',
      required: false,
      default: 'inner',
      description: 'How to join the data when merging by key',
      displayOptions: {
        show: {
          mode: ['mergeByKey']
        }
      },
      options: [
        { name: 'Inner Join', value: 'inner', description: 'Only items with matching keys in all inputs' },
        { name: 'Left Join', value: 'left', description: 'All items from first input, matching from others' },
        { name: 'Outer Join', value: 'outer', description: 'All items from all inputs' }
      ]
    },
    {
      name: 'propertyName1',
      displayName: 'Key Field Input 1',
      type: 'string',
      required: false,
      default: 'id',
      description: 'Field name to use for matching in first input',
      displayOptions: {
        show: {
          mode: ['mergeByKey']
        }
      },
      placeholder: 'id'
    },
    {
      name: 'propertyName2',
      displayName: 'Key Field Input 2',
      type: 'string',
      required: false,
      default: 'id',
      description: 'Field name to use for matching in second input',
      displayOptions: {
        show: {
          mode: ['mergeByKey']
        }
      },
      placeholder: 'id'
    },
    {
      name: 'outputDataFrom',
      displayName: 'Output Data From',
      type: 'options',
      required: false,
      default: 'both',
      description: 'Which input data to include in output',
      displayOptions: {
        show: {
          mode: ['mergeByKey']
        }
      },
      options: [
        { name: 'Both Inputs', value: 'both' },
        { name: 'Input 1', value: 'input1' },
        { name: 'Input 2', value: 'input2' }
      ]
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},description: 'Additional merge options',
      options: [
        {
      name: 'clashHandling',
      displayName: 'Property Name Clash',
      type: 'options',
      required: false,
          description: 'How to handle properties with the same name',
          options: [
            { name: 'Prefer Input 1', value: 'input1'
    },
            { name: 'Prefer Input 2', value: 'input2' },
            { name: 'Prefix Input 1', value: 'prefixInput1' },
            { name: 'Prefix Input 2', value: 'prefixInput2' }
          ]
        },
        {
      name: 'includeUnmatched',
      displayName: 'Include Unmatched',
      type: 'boolean',
      required: false,
      default: false,
          description: 'Include items without matches (only for merge by key)'
    },
        {
      name: 'waitTimeoutMs',
      displayName: 'Wait Timeout (ms)',
      type: 'number',
      required: false,
      default: 3000,
          description: 'Maximum time to wait for data (wait mode only)'
    }
      ]
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input 1',
      required: true
    },
    {
      type: 'main',
      displayName: 'Input 2',
      required: true
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Merged',
      description: 'The merged data from both inputs'
    }
  ],
  credentials: [],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  defaults: {
    mode: 'append',
    joinMode: 'inner',
    propertyName1: 'id',
    propertyName2: 'id',
    outputDataFrom: 'both'
  },
  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'medium',
    commonPatterns: [
      'Combine data from parallel API calls',
      'Join user data with profile information',
      'Merge search results from multiple sources',
      'Wait for multiple async operations',
      'Aggregate data from different workflows',
      'Synchronize multiple data streams'
    ],
    prerequisites: [
      'Multiple workflow branches or inputs',
      'Understanding of data joining concepts'
    ],
    errorHandling: {
      retryableErrors: ['Timeout waiting for input'],
      nonRetryableErrors: ['Key field not found', 'Invalid join configuration'],
      documentation: 'Common issues include missing key fields and timeout waiting for data'
    }
  },
  examples: [
    {
      name: 'Simple Data Append',
      description: 'Combine all data items from multiple inputs',
      workflow: {
        nodes: [
          {
            name: 'Merge Data',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'append'
            }
          }
        ]
      }
    },
    {
      name: 'Join User Data by ID',
      description: 'Merge user profiles with user activities using ID field',
      workflow: {
        nodes: [
          {
            name: 'Join by User ID',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'mergeByKey',
              joinMode: 'inner',
              propertyName1: 'userId',
              propertyName2: 'user_id',
              outputDataFrom: 'both'
            }
          }
        ]
      }
    },
    {
      name: 'Wait for Multiple APIs',
      description: 'Wait for multiple API calls to complete before proceeding',
      workflow: {
        nodes: [
          {
            name: 'Wait for APIs',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'wait',
              options: {
                waitTimeoutMs: 5000
              }
            }
          }
        ]
      }
    },
    {
      name: 'Left Join with Missing Data',
      description: 'Keep all records from first input, add matching data from second',
      workflow: {
        nodes: [
          {
            name: 'Left Join',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'mergeByKey',
              joinMode: 'left',
              propertyName1: 'id',
              propertyName2: 'customer_id',
              outputDataFrom: 'both',
              options: {
                clashHandling: 'prefixInput2',
                includeUnmatched: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Merge by Array Position',
      description: 'Combine items at the same array index from both inputs',
      workflow: {
        nodes: [
          {
            name: 'Merge by Position',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'mergeByIndex',
              outputDataFrom: 'both',
              options: {
                clashHandling: 'input1'
              }
            }
          }
        ]
      }
    }
  ]
};