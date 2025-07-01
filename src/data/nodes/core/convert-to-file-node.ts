/**
 * # Convert to File
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the Convert to File node to take input data and output it as a file. This converts
 * the input JSON data into a binary format. Node parameters and options depend on the operation you select.
 * 
 * ## Key Features
 * 
 * - **Multiple File Formats**: Support for CSV, HTML, ICS, JSON, ODS, RTF, Text, XLS, XLSX
 * - **Base64 Conversion**: Move Base64 string data to file format
 * - **Format-specific Options**: Each format has tailored configuration options
 * - **Field Output Control**: Specify which field contains the generated file
 * - **Header Support**: CSV format includes header row options
 * - **Calendar Export**: ICS format for calendar data
 * - **Spreadsheet Formats**: Excel (XLS/XLSX) and OpenDocument (ODS) support
 * 
 * ## Operations
 * 
 * ### Convert to CSV
 * - Convert data to comma-separated values format
 * - Configurable header row inclusion
 * - Custom file naming options
 * 
 * ### Convert to HTML
 * - Transform data into HTML table format
 * - Structured presentation of tabular data
 * 
 * ### Convert to ICS
 * - Create calendar files from event data
 * - Compatible with calendar applications
 * 
 * ### Convert to JSON
 * - Export data as JSON file
 * - Preserves data structure and types
 * 
 * ### Convert to ODS
 * - OpenDocument Spreadsheet format
 * - LibreOffice/OpenOffice compatible
 * 
 * ### Convert to RTF
 * - Rich Text Format for document compatibility
 * - Cross-platform text document format
 * 
 * ### Convert to Text File
 * - Plain text file output
 * - Simple data export option
 * 
 * ### Convert to XLS/XLSX
 * - Microsoft Excel spreadsheet formats
 * - XLS (legacy) and XLSX (modern) support
 * 
 * ### Move Base64 String to File
 * - Convert Base64 encoded strings to actual files
 * - Useful for binary data handling
 * 
 * ## Use Cases
 * 
 * - Export API data to spreadsheets for analysis
 * - Generate downloadable reports from workflow data
 * - Create calendar files from event information
 * - Convert processed data for external system integration
 * - Transform Base64 encoded files for storage or transmission
 * - Generate HTML reports from JSON data
 * - Create backup files of workflow results
 * - Prepare data for email attachments
 */

import { NodeTypeInfo } from '../../node-types.js';

export const convertToFileNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.convertToFile',
  displayName: 'Convert to File',
  description: 'Use the Convert to File node to take input data and output it as a file. This converts the input JSON data into a binary format.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',

  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'convertToCsv',
      description: 'The operation to perform',
      options: [
        { name: 'Convert to CSV', value: 'convertToCsv' },
        { name: 'Convert to HTML', value: 'convertToHtml' },
        { name: 'Convert to ICS', value: 'convertToIcs' },
        { name: 'Convert to JSON', value: 'convertToJson' },
        { name: 'Convert to ODS', value: 'convertToOds' },
        { name: 'Convert to RTF', value: 'convertToRtf' },
        { name: 'Convert to Text File', value: 'convertToTextFile' },
        { name: 'Convert to XLS', value: 'convertToXls' },
        { name: 'Convert to XLSX', value: 'convertToXlsx' },
        { name: 'Move Base64 String to File', value: 'moveBase64StringToFile' }
      ]
    },
    {
      name: 'filePropertyName',
      displayName: 'Put Output File in Field',
      type: 'string',
      required: true,
      default: 'data',
      description: 'Enter the name of the field in the output data to contain the file'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: 'data.csv',
      description: 'Enter the file name for the generated output file',
      displayOptions: {
        show: {
          operation: ['convertToCsv']
        }
      }
    },
    {
      name: 'headerRow',
      displayName: 'Header Row',
      type: 'boolean',
      required: false,
      default: true,
      description: 'If the first row of the file contains header names, turn on this option',
      displayOptions: {
        show: {
          operation: ['convertToCsv']
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

  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The converted file data'
    }
  ],

  credentials: [],
  regularNode: true,
  codeable: false,
  
  version: [1, 1.1],
  defaults: {
    name: 'Convert to File'
  },

  aliases: ['file', 'export', 'convert', 'csv', 'excel', 'json', 'html'],

  examples: [
    {
      name: 'Export to CSV',
      description: 'Convert JSON data to CSV file for spreadsheet import',
      workflow: {
        nodes: [
          {
            name: 'Convert to CSV',
            type: 'n8n-nodes-base.convertToFile',
            parameters: {
              operation: 'convertToCsv',
              filePropertyName: 'csvFile',
              fileName: 'export.csv',
              headerRow: true
            }
          }
        ]
      }
    },
    {
      name: 'Generate Excel Report',
      description: 'Create Excel file from processed data',
      workflow: {
        nodes: [
          {
            name: 'Create Excel',
            type: 'n8n-nodes-base.convertToFile',
            parameters: {
              operation: 'convertToXlsx',
              filePropertyName: 'excelFile'
            }
          }
        ]
      }
    },
    {
      name: 'Calendar Export',
      description: 'Export event data as ICS calendar file',
      workflow: {
        nodes: [
          {
            name: 'Export Calendar',
            type: 'n8n-nodes-base.convertToFile',
            parameters: {
              operation: 'convertToIcs',
              filePropertyName: 'calendarFile'
            }
          }
        ]
      }
    },
    {
      name: 'Base64 to File',
      description: 'Convert Base64 encoded data to actual file',
      workflow: {
        nodes: [
          {
            name: 'Base64 Conversion',
            type: 'n8n-nodes-base.convertToFile',
            parameters: {
              operation: 'moveBase64StringToFile',
              filePropertyName: 'outputFile'
            }
          }
        ]
      }
    }
  ],

  aiMetadata: {
    aiOptimized: true,
    integrationComplexity: 'low',
    commonPatterns: [
      'Export data to CSV for spreadsheet analysis',
      'Generate downloadable reports',
      'Create calendar files from events',
      'Convert Base64 files for storage',
      'Export JSON data as files',
      'Generate HTML reports',
      'Create Excel files for business reporting'
    ],
    errorHandling: {
      retryableErrors: [],
      nonRetryableErrors: ['Invalid data format', 'Base64 decode error', 'File generation error'],
      documentation: 'Errors typically occur due to invalid input data format or Base64 decoding issues'
    }
  },

  usageNotes: 'The Convert to File node is essential for exporting workflow data to various file formats. Choose the appropriate operation based on your target format and use case.',
  integrationGuide: 'Select the conversion operation that matches your required output format. CSV is ideal for spreadsheets, JSON preserves data structure, and Base64 conversion handles binary data.'
};

export default convertToFileNode;
