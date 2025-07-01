/**
 * Date & Time Node
 * 
 * Manipulates dates and times. Can format dates, add or subtract time intervals, or output the current date/time. Useful for timestamping or scheduling logic.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const datetimeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.date-time',
  displayName: 'Date & Time',
  description: 'Manipulates dates and times. Can format dates, add or subtract time intervals, or output the current date/time. Useful for timestamping or scheduling logic.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'action',
      displayName: 'Action',
      type: 'options',
      required: true,
      default: 'format',
      description: 'The action to perform on the date/time',
      options: [
        { name: 'Format', value: 'format', description: 'Format a date/time' },
        { name: 'Get Current Time', value: 'getCurrentTime', description: 'Get the current date/time' },
        { name: 'Calculate', value: 'calculate', description: 'Add or subtract time from a date' },
        { name: 'Extract', value: 'extract', description: 'Extract parts of a date' },
        { name: 'Compare', value: 'compare', description: 'Compare two dates' }
      ]
    },
    {
      name: 'value',
      displayName: 'Value',
      type: 'string',
      required: true,
      default: '',
      description: 'The date/time value to work with',
      placeholder: '{{ $json.date }}',
      displayOptions: {
        show: {
          action: ['format', 'calculate', 'extract', 'compare']
        }
      }
    },
    {
      name: 'format',
      displayName: 'Format',
      type: 'options',
      required: false,
      default: 'MM/dd/yyyy',
      description: 'The output format for the date',
      options: [
        { name: 'MM/dd/yyyy', value: 'MM/dd/yyyy' },
        { name: 'dd/MM/yyyy', value: 'dd/MM/yyyy' },
        { name: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
        { name: 'yyyy-MM-dd HH:mm:ss', value: 'yyyy-MM-dd HH:mm:ss' },
        { name: 'MMM dd, yyyy', value: 'MMM dd, yyyy' },
        { name: 'MMMM dd, yyyy', value: 'MMMM dd, yyyy' },
        { name: 'ISO 8601', value: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx" },
        { name: 'Unix Timestamp', value: 'X' },
        { name: 'Custom', value: 'custom' }
      ],
      displayOptions: {
        show: {
          action: ['format', 'getCurrentTime']
        }
      }
    },
    {
      name: 'customFormat',
      displayName: 'Custom Format',
      type: 'string',
      required: false,
      default: '',
      description: 'Custom date format (moment.js format)',
      placeholder: 'YYYY-MM-DD HH:mm:ss',
      displayOptions: {
        show: {
          action: ['format', 'getCurrentTime'],
          format: ['custom']
        }
      }
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'add',
      description: 'Whether to add or subtract time',
      options: [
        { name: 'Add', value: 'add' },
        { name: 'Subtract', value: 'subtract' }
      ],
      displayOptions: {
        show: {
          action: ['calculate']
        }
      }
    },
    {
      name: 'duration',
      displayName: 'Duration',
      type: 'number',
      required: true,
      default: 1,
      description: 'The amount to add or subtract',
      displayOptions: {
        show: {
          action: ['calculate']
        }
      }
    },
    {
      name: 'unit',
      displayName: 'Unit',
      type: 'options',
      required: true,
      default: 'days',
      description: 'The time unit',
      options: [
        { name: 'Years', value: 'years' },
        { name: 'Months', value: 'months' },
        { name: 'Weeks', value: 'weeks' },
        { name: 'Days', value: 'days' },
        { name: 'Hours', value: 'hours' },
        { name: 'Minutes', value: 'minutes' },
        { name: 'Seconds', value: 'seconds' }
      ],
      displayOptions: {
        show: {
          action: ['calculate']
        }
      }
    },
    {
      name: 'extractPart',
      displayName: 'Extract',
      type: 'options',
      required: true,
      default: 'year',
      description: 'The part of the date to extract',
      options: [
        { name: 'Year', value: 'year' },
        { name: 'Month', value: 'month' },
        { name: 'Day', value: 'day' },
        { name: 'Hour', value: 'hour' },
        { name: 'Minute', value: 'minute' },
        { name: 'Second', value: 'second' },
        { name: 'Day of Week', value: 'dayOfWeek' },
        { name: 'Week of Year', value: 'weekOfYear' }
      ],
      displayOptions: {
        show: {
          action: ['extract']
        }
      }
    },
    {
      name: 'outputFieldName',
      displayName: 'Output Field Name',
      type: 'string',
      required: false,
      default: 'formattedDate',
      description: 'Name of the field to store the result',
      placeholder: 'timestamp'
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
      displayName: 'Date/Time Result',
      description: 'Data with processed date/time information'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1],
  defaults: {
    name: 'Date & Time'
  },

  aliases: ['date', 'time', 'datetime', 'timestamp'],
  
  examples: [
    {
      name: 'Format Current Date',
      description: 'Get current date in a specific format',
      workflow: {
        nodes: [
          {
            name: 'Date & Time',
            type: 'n8n-nodes-base.date-time',
            parameters: {
              action: 'getCurrentTime',
              format: 'yyyy-MM-dd HH:mm:ss',
              outputFieldName: 'current_timestamp'
            }
          }
        ]
      }
    },
    {
      name: 'Add Days to Date',
      description: 'Add 7 days to a given date',
      workflow: {
        nodes: [
          {
            name: 'Date & Time',
            type: 'n8n-nodes-base.date-time',
            parameters: {
              action: 'calculate',
              value: '{{ $json.created_date }}',
              operation: 'add',
              duration: 7,
              unit: 'days',
              outputFieldName: 'due_date'
            }
          }
        ]
      }
    },
    {
      name: 'Extract Year from Date',
      description: 'Extract the year component from a date field',
      workflow: {
        nodes: [
          {
            name: 'Date & Time',
            type: 'n8n-nodes-base.date-time',
            parameters: {
              action: 'extract',
              value: '{{ $json.birthdate }}',
              extractPart: 'year',
              outputFieldName: 'birth_year'
            }
          }
        ]
      }
    }
  ]
};

export default datetimeNode;
