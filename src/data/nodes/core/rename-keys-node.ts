/**
 * # Rename Keys
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Rename Keys node to rename the keys of a key-value pair in n8n.
 * 
 * ## Node Parameters
 * 
 * You can rename one or multiple keys using the Rename Keys node. 
 * Select the **Add new key** button to rename a key.
 * 
 * For each key, enter the:
 * - **Current Key Name**: The current name of the key you want to rename
 * - **New Key Name**: The new name you want to assign to the key
 * 
 * ## Node Options
 * 
 * ### Regex Support
 * Choose whether to use a **Regex** regular expression to identify keys to rename.
 * 
 * When using regex, you must enter:
 * - **Regular Expression**: The expression you'd like to use to match keys
 * - **Replace With**: The new name pattern for keys matching the regex
 * 
 * ### Regex-Specific Options
 * - **Case Insensitive**: Set whether regex should match case (off) or be case insensitive (on)
 * - **Max Depth**: Maximum depth to replace keys
 *   - `-1` for unlimited depth
 *   - `0` for top-level only
 *   - Positive numbers for specific depth levels
 * 
 * **⚠️ Regex Impact**: Using regular expressions can affect any keys that match the expression, 
 * including keys you've already renamed.
 * 
 * ## Key Features
 * 
 * - **Simple key renaming**: Rename individual keys with specific mappings
 * - **Bulk renaming**: Rename multiple keys in a single operation
 * - **Regex pattern matching**: Use regular expressions for complex renaming patterns
 * - **Nested object support**: Control depth of key renaming in nested structures
 * - **Case sensitivity control**: Configure case-sensitive or insensitive matching
 * - **Pattern replacement**: Use capture groups and replacement patterns
 * 
 * ## Use Cases
 * 
 * - Standardize field names across different data sources
 * - Convert between naming conventions (camelCase, snake_case, kebab-case)
 * - Clean up API response field names for consistency
 * - Prepare data for external systems with specific field requirements
 * - Transform database column names to user-friendly labels
 * - Normalize data structure keys for downstream processing
 * 
 * ## Common Patterns
 * 
 * ### Individual Key Mapping
 * - Map specific fields: `user_id` → `userId`
 * - Rename for clarity: `qty` → `quantity`
 * 
 * ### Regex Patterns
 * - Convert snake_case to camelCase: `([a-z])_([a-z])` → `$1${upperCase($2)}`
 * - Remove prefixes: `^api_(.*)` → `$1`
 * - Add prefixes: `(.*)` → `data_$1`
 */

import { NodeTypeInfo } from '../../node-types.js';

export const renamekeysNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.renamekeys',
  displayName: 'Rename Keys',
  description: 'Rename the keys of a key-value pair',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'keys',
      displayName: 'Keys',
      type: 'fixedCollection',
      required: true,
      default: {
        key: [
          {
            currentKey: '',
            newKey: ''
          }
        ]
      },
      description: 'Keys to rename',
      typeOptions: {
        multipleValues: true,
        sortable: true
      },
      options: [
        {
          name: 'key',
          displayName: 'Key',
          values: [
            {
              name: 'currentKey',
              displayName: 'Current Key Name',
              type: 'string',
              required: true,
              default: '',
              description: 'The current name of the key you want to rename',
              placeholder: 'user_id'
            },
            {
              name: 'newKey',
              displayName: 'New Key Name',
              type: 'string',
              required: true,
              default: '',
              description: 'The new name you want to assign to the key',
              placeholder: 'userId'
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
      description: 'Additional options for key renaming',
      options: [
        {
          name: 'useRegex',
          displayName: 'Regex',
          type: 'boolean',
          default: false,
          description: 'Use regular expression to identify keys to rename'
        },
        {
          name: 'regex',
          displayName: 'Regular Expression',
          type: 'string',
          default: '',
          description: 'The regular expression to use for matching keys',
          placeholder: '([a-z])_([a-z])',
          displayOptions: {
            show: {
              useRegex: [true]
            }
          }
        },
        {
          name: 'replaceWith',
          displayName: 'Replace With',
          type: 'string',
          default: '',
          description: 'The replacement pattern for keys matching the regex',
          placeholder: '$1${upperCase($2)}',
          displayOptions: {
            show: {
              useRegex: [true]
            }
          }
        },
        {
          name: 'caseInsensitive',
          displayName: 'Case Insensitive',
          type: 'boolean',
          default: false,
          description: 'Set whether the regular expression should be case insensitive',
          displayOptions: {
            show: {
              useRegex: [true]
            }
          }
        },
        {
          name: 'maxDepth',
          displayName: 'Max Depth',
          type: 'number',
          default: -1,
          description: 'Maximum depth to replace keys (-1 for unlimited, 0 for top-level only)',
          displayOptions: {
            show: {
              useRegex: [true]
            }
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
      displayName: 'Output',
      description: 'Data with renamed keys'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Rename Keys'
  },

  aliases: ['rename', 'keys', 'transform', 'map'],
  
  examples: [
    {
      name: 'Simple Key Renaming',
      description: 'Rename specific keys to more readable names',
      workflow: {
        nodes: [
          {
            name: 'Rename Keys',
            type: 'n8n-nodes-base.renamekeys',
            parameters: {
              keys: {
                key: [
                  {
                    currentKey: 'user_id',
                    newKey: 'userId'
                  },
                  {
                    currentKey: 'first_name',
                    newKey: 'firstName'
                  },
                  {
                    currentKey: 'last_name',
                    newKey: 'lastName'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Snake Case to Camel Case',
      description: 'Convert all snake_case keys to camelCase using regex',
      workflow: {
        nodes: [
          {
            name: 'Rename Keys',
            type: 'n8n-nodes-base.renamekeys',
            parameters: {
              options: {
                useRegex: true,
                regex: '([a-z])_([a-z])',
                replaceWith: '$1${upperCase($2)}',
                caseInsensitive: false,
                maxDepth: -1
              }
            }
          }
        ]
      }
    },
    {
      name: 'Remove API Prefix',
      description: 'Remove "api_" prefix from all keys using regex',
      workflow: {
        nodes: [
          {
            name: 'Rename Keys',
            type: 'n8n-nodes-base.renamekeys',
            parameters: {
              options: {
                useRegex: true,
                regex: '^api_(.*)',
                replaceWith: '$1',
                caseInsensitive: true,
                maxDepth: 0
              }
            }
          }
        ]
      }
    },
    {
      name: 'Database to UI Field Mapping',
      description: 'Map database column names to user-friendly field names',
      workflow: {
        nodes: [
          {
            name: 'Rename Keys',
            type: 'n8n-nodes-base.renamekeys',
            parameters: {
              keys: {
                key: [
                  {
                    currentKey: 'created_at',
                    newKey: 'dateCreated'
                  },
                  {
                    currentKey: 'updated_at',
                    newKey: 'dateModified'
                  },
                  {
                    currentKey: 'is_active',
                    newKey: 'active'
                  },
                  {
                    currentKey: 'qty',
                    newKey: 'quantity'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Add Data Prefix',
      description: 'Add "data_" prefix to all top-level keys',
      workflow: {
        nodes: [
          {
            name: 'Rename Keys',
            type: 'n8n-nodes-base.renamekeys',
            parameters: {
              options: {
                useRegex: true,
                regex: '^(.*)$',
                replaceWith: 'data_$1',
                maxDepth: 0
              }
            }
          }
        ]
      }
    }
  ]
};

export default renamekeysNode;
