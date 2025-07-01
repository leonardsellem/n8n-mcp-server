/**
 * # Split In Batches
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * Split large datasets into smaller, manageable batches for processing. This node is essential
 * for handling large volumes of data efficiently, preventing memory issues, and enabling
 * parallel processing workflows. Perfect for scenarios where you need to process data in chunks.
 * 
 * ## Key Features
 * 
 * - **Batch Size Control**: Define exact number of items per batch
 * - **Memory Efficient**: Process large datasets without memory overflow
 * - **Flexible Splitting**: Multiple splitting strategies and criteria
 * - **Parallel Processing**: Enable concurrent batch processing
 * - **Progress Tracking**: Monitor batch processing progress
 * - **Error Isolation**: Isolate errors to specific batches
 * - **Resume Capability**: Resume processing from failed batches
 * - **Dynamic Batching**: Adjust batch size based on conditions
 * - **Metadata Preservation**: Maintain context across batches
 * - **Custom Logic**: Apply custom splitting logic
 * - **Performance Optimization**: Optimize for throughput or memory
 * - **Batch Numbering**: Track batch sequence and position
 * 
 * ## Splitting Strategies
 * 
 * ### Size-Based Splitting
 * - **Fixed Size**: Split into batches of exact size
 * - **Dynamic Size**: Adjust size based on item complexity
 * - **Memory-Based**: Split based on memory consumption
 * - **Time-Based**: Split after processing time threshold
 * 
 * ### Content-Based Splitting
 * - **Field Value**: Split based on field values or ranges
 * - **Data Type**: Group by data type or category
 * - **Pattern Matching**: Split using regex patterns
 * - **Custom Criteria**: User-defined splitting logic
 * 
 * ### Sequential Splitting
 * - **Linear Progression**: Process batches in order
 * - **Round Robin**: Distribute items across batches
 * - **Weighted Distribution**: Allocate based on weights
 * - **Random Distribution**: Randomize batch assignment
 * 
 * ## Use Cases
 * 
 * - **Large Dataset Processing**: Handle millions of records efficiently
 * - **API Rate Limiting**: Respect API rate limits with controlled batches
 * - **Database Operations**: Bulk insert/update operations in chunks
 * - **File Processing**: Process large files in manageable segments
 * - **Email Campaigns**: Send emails in batches to avoid spam filters
 * - **Data Migration**: Migrate data in controlled batches
 * - **Parallel Workflows**: Enable concurrent processing of data subsets
 * - **Memory Management**: Prevent out-of-memory errors with large datasets
 * - **Progress Reporting**: Track progress of long-running operations
 * - **Error Recovery**: Retry failed batches without reprocessing all data
 * - **Performance Tuning**: Optimize processing speed and resource usage
 * - **Load Balancing**: Distribute processing load across multiple workers
 */

import { NodeTypeInfo } from '../../node-types.js';

export const splitInBatchesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.splitInBatches',
  displayName: 'Split In Batches',
  description: 'Split large datasets into smaller, manageable batches for efficient processing',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'batchSize',
      displayName: 'Batch Size',
      type: 'number',
      required: true,
      default: 100,
      description: 'Number of items to include in each batch',
      typeOptions: {
        minValue: 1,
        maxValue: 10000
      }
    },
    {
      name: 'splitMode',
      displayName: 'Split Mode',
      type: 'options',
      required: false,
      default: 'sequential',
      description: 'How to split the data into batches',
      options: [
        {
          name: 'Sequential',
          value: 'sequential',
          description: 'Split items in order'
        },
        {
          name: 'Round Robin',
          value: 'roundrobin',
          description: 'Distribute items evenly across batches'
        },
        {
          name: 'Random',
          value: 'random',
          description: 'Randomly assign items to batches'
        },
        {
          name: 'Field Based',
          value: 'fieldbased',
          description: 'Split based on field values'
        }
      ]
    },
    {
      name: 'splitField',
      displayName: 'Split Field',
      type: 'string',
      required: false,
      default: '',
      description: 'Field to use for splitting (field-based mode)',
      displayOptions: {
        show: {
          splitMode: ['fieldbased']
        }
      },
      placeholder: 'category'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional splitting options',
      options: [
        {
          name: 'preserveOrder',
          displayName: 'Preserve Order',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Maintain original order of items'
        },
        {
          name: 'addBatchInfo',
          displayName: 'Add Batch Info',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Add batch metadata to each item'
        },
        {
          name: 'resetBetweenRuns',
          displayName: 'Reset Between Runs',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Reset batch counter between workflow runs'
        },
        {
          name: 'maxBatches',
          displayName: 'Max Batches',
          type: 'number',
          required: false,
          default: 0,
          description: 'Maximum number of batches (0 = unlimited)',
          typeOptions: {
            minValue: 0,
            maxValue: 1000
          }
        },
        {
          name: 'skipEmpty',
          displayName: 'Skip Empty Batches',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Skip batches with no items'
        }
      ]
    },
    {
      name: 'batchInfo',
      displayName: 'Batch Information',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure batch metadata',
      displayOptions: {
        show: {
          'options.addBatchInfo': [true]
        }
      },
      options: [
        {
          name: 'batchNumberField',
          displayName: 'Batch Number Field',
          type: 'string',
          required: false,
          default: '_batchNumber',
          description: 'Field name for batch number'
        },
        {
          name: 'batchSizeField',
          displayName: 'Batch Size Field',
          type: 'string',
          required: false,
          default: '_batchSize',
          description: 'Field name for batch size'
        },
        {
          name: 'totalBatchesField',
          displayName: 'Total Batches Field',
          type: 'string',
          required: false,
          default: '_totalBatches',
          description: 'Field name for total batch count'
        },
        {
          name: 'itemIndexField',
          displayName: 'Item Index Field',
          type: 'string',
          required: false,
          default: '_itemIndex',
          description: 'Field name for item index within batch'
        }
      ]
    },
    {
      name: 'errorHandling',
      displayName: 'Error Handling',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure error handling options',
      options: [
        {
          name: 'continueOnError',
          displayName: 'Continue on Error',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Continue processing even if a batch fails'
        },
        {
          name: 'retryFailedBatches',
          displayName: 'Retry Failed Batches',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Automatically retry failed batches'
        },
        {
          name: 'maxRetries',
          displayName: 'Max Retries',
          type: 'number',
          required: false,
          default: 3,
          description: 'Maximum retry attempts per batch',
          displayOptions: {
            show: {
              retryFailedBatches: [true]
            }
          },
          typeOptions: {
            minValue: 1,
            maxValue: 10
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
      displayName: 'Batches',
      description: 'Data split into batches'
    },
    {
      type: 'main',
      displayName: 'Summary',
      description: 'Batch processing summary'
    }
  ],

  credentials: [],
  
  version: [1],
  defaults: {
    name: 'Split In Batches'
  },

  aliases: ['batch', 'split', 'chunk', 'partition', 'divide', 'segment'],
  
  examples: [
    {
      name: 'Process Large Dataset',
      description: 'Split 10,000 records into batches of 100 for processing',
      workflow: {
        nodes: [
          {
            name: 'Split In Batches',
            type: 'n8n-nodes-base.splitInBatches',
            parameters: {
              batchSize: 100,
              splitMode: 'sequential',
              options: {
                preserveOrder: true,
                addBatchInfo: true,
                skipEmpty: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'API Rate Limiting',
      description: 'Split API requests into smaller batches to respect rate limits',
      workflow: {
        nodes: [
          {
            name: 'Split In Batches',
            type: 'n8n-nodes-base.splitInBatches',
            parameters: {
              batchSize: 50,
              splitMode: 'sequential',
              options: {
                maxBatches: 20,
                addBatchInfo: true
              },
              errorHandling: {
                continueOnError: true,
                retryFailedBatches: true,
                maxRetries: 3
              }
            }
          }
        ]
      }
    },
    {
      name: 'Category-Based Splitting',
      description: 'Split data based on category field values',
      workflow: {
        nodes: [
          {
            name: 'Split In Batches',
            type: 'n8n-nodes-base.splitInBatches',
            parameters: {
              batchSize: 200,
              splitMode: 'fieldbased',
              splitField: 'category',
              options: {
                preserveOrder: false,
                addBatchInfo: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default splitInBatchesNode;
