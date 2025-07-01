/**
 * # Merge
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * Use the Merge node to combine data from multiple streams, once data of all streams is available.
 * The node waits for execution of all connected inputs before processing.
 * 
 * ## Key Features
 * 
 * - **Multiple Modes**: Append, Combine, SQL Query, Choose Branch
 * - **Flexible Combining**: By matching fields, position, or all possible combinations
 * - **SQL Support**: Custom SQL queries for complex merging operations (v1.49.0+)
 * - **Join Operations**: Inner, outer, left, and right join equivalents
 * - **Multiple Inputs**: Support for more than two inputs (v1.49.0+)
 * - **Clash Handling**: Configure how to handle field conflicts and nested data
 * - **Type Tolerance**: Fuzzy compare option for different data types
 * - **Advanced Options**: Multiple match handling, unpaired items inclusion
 * 
 * ## Merge Modes
 * 
 * ### Append Mode
 * - Keep data from all inputs, outputting items one after another
 * - Choose number of inputs to combine sequentially
 * - Simple concatenation of data streams
 * 
 * ### Combine Mode
 * Four different combination strategies:
 * 
 * #### Matching Fields
 * - Compare items by field values
 * - **Output Types**:
 *   - **Keep Matches**: Inner join - merge matching items only
 *   - **Keep Non-Matches**: Merge items that don't match
 *   - **Keep Everything**: Outer join - merge all items
 *   - **Enrich Input 1**: Left join - keep all Input 1, add matching Input 2
 *   - **Enrich Input 2**: Right join - keep all Input 2, add matching Input 1
 * 
 * #### Position
 * - Combine items based on their order/index
 * - Item at index 0 in Input 1 merges with item at index 0 in Input 2
 * - Option to include unpaired items
 * 
 * #### All Possible Combinations
 * - Output all possible item combinations
 * - Merges fields with the same name
 * - Creates cartesian product of inputs
 * 
 * ### SQL Query Mode (v1.49.0+)
 * - Write custom SQL queries for complex merging
 * - Data available as tables: input1, input2, input3, etc.
 * - Full AlaSQL support for complex operations
 * 
 * ### Choose Branch Mode
 * - Select which input to keep
 * - Options: Input 1 data, Input 2 data, or single empty item
 * - Useful for conditional data flow control
 * 
 * ## Advanced Options
 * 
 * ### Clash Handling
 * - **Field Value Clashes**: Choose which input takes priority
 * - **Nested Field Merging**: Deep merge vs shallow merge options
 * - **Add Input Numbers**: Append input number to field names
 * 
 * ### Additional Options
 * - **Fuzzy Compare**: Tolerate type differences (treats "3" and 3 as same)
 * - **Disable Dot Notation**: Prevent parent.child field access
 * - **Multiple Matches**: Include all matches or first match only
 * - **Include Unpaired Items**: Keep items without matches in position mode
 * 
 * ## Version History
 * 
 * - **v0.194.0**: Major overhaul with new modes and options
 * - **v1.49.0**: Added SQL Query mode and multiple inputs support
 * 
 * ## Use Cases
 * 
 * - Combining data from multiple APIs or databases
 * - Joining datasets on common fields (user ID, email, etc.)
 * - Merging user profiles with preferences or settings
 * - Concatenating results from parallel workflow branches
 * - Creating lookup tables and enriching data
 * - Data validation by comparing multiple sources
 * - Complex data transformations with SQL
 * - Synchronizing data from different systems
 */

import { NodeTypeInfo } from '../../node-types.js';

export const mergeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.merge',
  displayName: 'Merge',
  description: 'Combine data from multiple streams using append, field matching, position, SQL queries, or branch selection.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'append',
      description: 'How to merge the data from different inputs',
      options: [
        {
          name: 'Append',
          value: 'append',
          description: 'Keep data from all inputs, one after another'
        },
        {
          name: 'Combine',
          value: 'combine',
          description: 'Combine data from inputs using various strategies'
        },
        {
          name: 'SQL Query',
          value: 'sql',
          description: 'Use custom SQL query to merge data'
        },
        {
          name: 'Choose Branch',
          value: 'chooseBranch',
          description: 'Choose which input to keep'
        }
      ]
    },
    {
      name: 'combineBy',
      displayName: 'Combine By',
      type: 'options',
      required: false,
      default: 'combineByFields',
      description: 'How to combine the inputs',
      displayOptions: {
        show: {
          mode: ['combine']
        }
      },
      options: [
        {
          name: 'Matching Fields',
          value: 'combineByFields',
          description: 'Combine items with matching field values'
        },
        {
          name: 'Position',
          value: 'combineByPosition',
          description: 'Combine items based on their position/index'
        },
        {
          name: 'All Possible Combinations',
          value: 'multiplex',
          description: 'Create all possible combinations of items'
        }
      ]
    },
    {
      name: 'fieldsToMatch',
      displayName: 'Fields to Match',
      type: 'fixedCollection',
      required: false,
      default: {},
      description: 'Fields to match for combining',
      displayOptions: {
        show: {
          mode: ['combine'],
          combineBy: ['combineByFields']
        }
      },
      typeOptions: {
        multipleValues: true
      },
      options: [
        {
          name: 'field',
          displayName: 'Field Pair',
          values: [
            {
              name: 'input1Field',
              displayName: 'Input 1 Field',
              type: 'string',
              required: true,
              default: '',
              description: 'Field name from Input 1'
            },
            {
              name: 'input2Field',
              displayName: 'Input 2 Field',
              type: 'string',
              required: true,
              default: '',
              description: 'Field name from Input 2'
            }
          ]
        }
      ]
    },
    {
      name: 'outputType',
      displayName: 'Output Type',
      type: 'options',
      required: false,
      default: 'keepMatches',
      description: 'What to output',
      displayOptions: {
        show: {
          mode: ['combine'],
          combineBy: ['combineByFields']
        }
      },
      options: [
        {
          name: 'Keep Matches',
          value: 'keepMatches',
          description: 'Keep only items that match (inner join)'
        },
        {
          name: 'Keep Non-Matches',
          value: 'keepNonMatches',
          description: 'Keep only items that don\'t match'
        },
        {
          name: 'Keep Everything',
          value: 'keepEverything',
          description: 'Keep all items (outer join)'
        },
        {
          name: 'Enrich Input 1',
          value: 'enrichInput1',
          description: 'Keep all Input 1, add matching Input 2 (left join)'
        },
        {
          name: 'Enrich Input 2',
          value: 'enrichInput2',
          description: 'Keep all Input 2, add matching Input 1 (right join)'
        }
      ]
    },
    {
      name: 'sqlQuery',
      displayName: 'SQL Query',
      type: 'string',
      required: false,
      default: 'SELECT * FROM input1 LEFT JOIN input2 ON input1.id = input2.id',
      description: 'SQL query to merge the data. Inputs are available as input1, input2, etc.',
      displayOptions: {
        show: {
          mode: ['sql']
        }
      }
    },
    {
      name: 'output',
      displayName: 'Output',
      type: 'options',
      required: false,
      default: 'input1',
      description: 'Which input to output',
      displayOptions: {
        show: {
          mode: ['chooseBranch']
        }
      },
      options: [
        {
          name: 'Input 1 Data',
          value: 'input1'
        },
        {
          name: 'Input 2 Data',
          value: 'input2'
        },
        {
          name: 'A Single, Empty Item',
          value: 'empty'
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
      displayName: 'Merged'
    }
  ],

  credentials: [],

  version: [2, 3],
  defaults: {
    name: 'Merge'
  },

  aliases: ['join', 'combine', 'union', 'concat'],
  
  examples: [
    {
      name: 'Append Two Data Sets',
      description: 'Simple concatenation of two data streams',
      workflow: {
        nodes: [
          {
            name: 'Merge',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'append'
            }
          }
        ]
      }
    },
    {
      name: 'Join by Matching Field',
      description: 'Combine data based on matching ID fields',
      workflow: {
        nodes: [
          {
            name: 'Merge',
            type: 'n8n-nodes-base.merge',
            parameters: {
              mode: 'combine',
              combineBy: 'combineByFields',
              fieldsToMatch: {
                field: [
                  {
                    input1Field: 'id',
                    input2Field: 'userId'
                  }
                ]
              },
              outputType: 'keepMatches'
            }
          }
        ]
      }
    }
  ]
};

export default mergeNode;
