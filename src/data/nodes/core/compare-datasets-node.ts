/**
 * # Compare Datasets
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Analysis
 * 
 * ## Description
 * 
 * Compare two or more datasets to identify differences, similarities, and relationships between them.
 * This node enables advanced data analysis by comparing datasets based on specified keys and fields,
 * making it easy to detect changes, find matches, and analyze data quality across different sources.
 * 
 * ## Key Features
 * 
 * - **Multiple Comparison Types**: Inner join, left join, right join, full outer join, and difference analysis
 * - **Flexible Key Matching**: Compare datasets using single or multiple key fields
 * - **Field-Specific Comparison**: Compare specific fields or entire records
 * - **Fuzzy Matching**: Approximate string matching for data with minor variations
 * - **Data Type Handling**: Smart comparison of different data types (strings, numbers, dates)
 * - **Statistical Analysis**: Generate comparison statistics and summaries
 * - **Difference Detection**: Identify new, removed, and modified records
 * - **Threshold Configuration**: Set similarity thresholds for fuzzy matching
 * - **Performance Optimization**: Efficient algorithms for large dataset comparison
 * - **Multiple Output Modes**: Separate outputs for matches, differences, and statistics
 * - **Custom Comparison Logic**: Define custom comparison rules and conditions
 * - **Data Quality Assessment**: Identify data quality issues and inconsistencies
 * 
 * ## Comparison Types
 * 
 * ### Join Operations
 * - **Inner Join**: Return only records that exist in both datasets
 * - **Left Join**: Return all records from the first dataset with matches from the second
 * - **Right Join**: Return all records from the second dataset with matches from the first
 * - **Full Outer Join**: Return all records from both datasets with match indicators
 * - **Cross Join**: Cartesian product of both datasets (use with caution)
 * 
 * ### Difference Analysis
 * - **New Records**: Records that exist in dataset B but not in dataset A
 * - **Removed Records**: Records that exist in dataset A but not in dataset B
 * - **Modified Records**: Records that exist in both but have different values
 * - **Unchanged Records**: Records that are identical in both datasets
 * 
 * ### Statistical Comparison
 * - **Field Statistics**: Compare statistical measures (mean, median, count, etc.)
 * - **Distribution Analysis**: Compare data distributions and patterns
 * - **Quality Metrics**: Assess data completeness, consistency, and accuracy
 * - **Correlation Analysis**: Identify relationships between fields
 * 
 * ## Key Matching Options
 * 
 * ### Exact Matching
 * - **Single Key**: Match records based on one field
 * - **Composite Key**: Match using multiple fields combined
 * - **Case Sensitive**: Exact string matching with case consideration
 * - **Case Insensitive**: String matching ignoring case differences
 * 
 * ### Fuzzy Matching
 * - **String Similarity**: Levenshtein distance, Jaro-Winkler, or other algorithms
 * - **Phonetic Matching**: Soundex or Metaphone for similar-sounding values
 * - **Partial Matching**: Substring or pattern-based matching
 * - **Threshold Configuration**: Set minimum similarity scores for matches
 * 
 * ## Use Cases
 * 
 * - **Data Migration Validation**: Verify data integrity after system migrations
 * - **Database Synchronization**: Compare and sync data between databases
 * - **Data Quality Assessment**: Identify inconsistencies and quality issues
 * - **Change Detection**: Monitor changes in datasets over time
 * - **Duplicate Detection**: Find and manage duplicate records
 * - **Master Data Management**: Maintain consistent reference data
 * - **ETL Validation**: Verify extract, transform, and load processes
 * - **Audit and Compliance**: Track data changes for regulatory requirements
 * - **A/B Testing Analysis**: Compare results between test groups
 * - **Performance Monitoring**: Compare metrics across time periods
 * - **Customer Data Integration**: Merge customer data from multiple sources
 * - **Inventory Management**: Compare stock levels and product catalogs
 */

import { NodeTypeInfo } from '../../node-types.js';

export const compareDatasetsNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.compareDatasets',
  displayName: 'Compare Datasets',
  description: 'Compare two or more datasets to identify differences, similarities, and relationships',
  category: 'Core Nodes',
  subcategory: 'Data Analysis',
  
  properties: [
    {
      name: 'comparisonType',
      displayName: 'Comparison Type',
      type: 'options',
      required: true,
      default: 'inner_join',
      description: 'Type of comparison to perform',
      options: [
        {
          name: 'Inner Join',
          value: 'inner_join',
          description: 'Return only matching records from both datasets'
        },
        {
          name: 'Left Join',
          value: 'left_join',
          description: 'Return all records from first dataset with matches from second'
        },
        {
          name: 'Right Join',
          value: 'right_join',
          description: 'Return all records from second dataset with matches from first'
        },
        {
          name: 'Full Outer Join',
          value: 'full_outer_join',
          description: 'Return all records from both datasets'
        },
        {
          name: 'Difference Analysis',
          value: 'difference',
          description: 'Identify new, removed, and modified records'
        },
        {
          name: 'Statistical Comparison',
          value: 'statistical',
          description: 'Compare statistical properties of datasets'
        }
      ]
    },
    {
      name: 'keyFields',
      displayName: 'Key Fields',
      type: 'string',
      required: true,
      default: 'id',
      description: 'Comma-separated list of fields to use as matching keys',
      placeholder: 'id, email, name'
    },
    {
      name: 'compareFields',
      displayName: 'Fields to Compare',
      type: 'string',
      required: false,
      default: '',
      description: 'Specific fields to compare (empty = all fields)',
      placeholder: 'name, price, status'
    },
    {
      name: 'matchingOptions',
      displayName: 'Matching Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure how records are matched',
      options: [
        {
          name: 'caseSensitive',
          displayName: 'Case Sensitive',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Perform case-sensitive string matching'
        },
        {
          name: 'fuzzyMatching',
          displayName: 'Enable Fuzzy Matching',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Enable approximate string matching'
        },
        {
          name: 'similarityThreshold',
          displayName: 'Similarity Threshold',
          type: 'number',
          required: false,
          default: 0.8,
          description: 'Minimum similarity score for fuzzy matches (0-1)',
          typeOptions: {
            minValue: 0,
            maxValue: 1
          },
          displayOptions: {
            show: {
              fuzzyMatching: [true]
            }
          }
        },
        {
          name: 'algorithm',
          displayName: 'Similarity Algorithm',
          type: 'options',
          required: false,
          default: 'levenshtein',
          description: 'Algorithm to use for fuzzy matching',
          displayOptions: {
            show: {
              fuzzyMatching: [true]
            }
          },
          options: [
            {
              name: 'Levenshtein Distance',
              value: 'levenshtein',
              description: 'Character-based edit distance'
            },
            {
              name: 'Jaro-Winkler',
              value: 'jaro_winkler',
              description: 'String similarity with prefix weighting'
            },
            {
              name: 'Cosine Similarity',
              value: 'cosine',
              description: 'Vector-based similarity measure'
            }
          ]
        }
      ]
    },
    {
      name: 'outputOptions',
      displayName: 'Output Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Configure output format and content',
      options: [
        {
          name: 'includeMetadata',
          displayName: 'Include Metadata',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Include comparison metadata in results'
        },
        {
          name: 'addSourceIndicator',
          displayName: 'Add Source Indicator',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Add field indicating source dataset'
        },
        {
          name: 'showDifferences',
          displayName: 'Show Field Differences',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Highlight specific field differences'
        },
        {
          name: 'generateSummary',
          displayName: 'Generate Summary',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Generate comparison summary statistics'
        }
      ]
    }
  ],

  inputs: [
    {
      type: 'main',
      displayName: 'Dataset A',
      required: true
    },
    {
      type: 'main',
      displayName: 'Dataset B',
      required: true
    }
  ],

  outputs: [
    {
      type: 'main',
      displayName: 'Results',
      description: 'Comparison results based on selected type'
    },
    {
      type: 'main',
      displayName: 'Summary',
      description: 'Comparison statistics and metadata'
    }
  ],

  credentials: [],
  
  version: [1],
  defaults: {
    name: 'Compare Datasets'
  },

  aliases: ['compare', 'join', 'merge', 'diff', 'match', 'analysis'],
  
  examples: [
    {
      name: 'Database Sync Validation',
      description: 'Compare production and backup databases to verify synchronization',
      workflow: {
        nodes: [
          {
            name: 'Compare Datasets',
            type: 'n8n-nodes-base.compareDatasets',
            parameters: {
              comparisonType: 'difference',
              keyFields: 'id',
              compareFields: 'name, email, status, updated_at',
              outputOptions: {
                includeMetadata: true,
                showDifferences: true,
                generateSummary: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Customer Data Merge',
      description: 'Merge customer data from CRM and email marketing platform',
      workflow: {
        nodes: [
          {
            name: 'Compare Datasets',
            type: 'n8n-nodes-base.compareDatasets',
            parameters: {
              comparisonType: 'full_outer_join',
              keyFields: 'email',
              matchingOptions: {
                caseSensitive: false,
                fuzzyMatching: true,
                similarityThreshold: 0.9,
                algorithm: 'jaro_winkler'
              },
              outputOptions: {
                addSourceIndicator: true,
                includeMetadata: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Change Detection',
      description: 'Monitor changes in product catalog over time',
      workflow: {
        nodes: [
          {
            name: 'Compare Datasets',
            type: 'n8n-nodes-base.compareDatasets',
            parameters: {
              comparisonType: 'difference',
              keyFields: 'product_id, sku',
              compareFields: 'name, price, description, stock',
              outputOptions: {
                showDifferences: true,
                generateSummary: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Statistical Analysis',
      description: 'Compare sales performance between different time periods',
      workflow: {
        nodes: [
          {
            name: 'Compare Datasets',
            type: 'n8n-nodes-base.compareDatasets',
            parameters: {
              comparisonType: 'statistical',
              keyFields: 'product_category',
              compareFields: 'revenue, units_sold, profit_margin',
              outputOptions: {
                generateSummary: true,
                includeMetadata: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default compareDatasetsNode;
