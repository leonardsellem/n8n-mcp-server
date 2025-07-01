/**
 * # HTML
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Processing
 * 
 * ## Description
 * 
 * The HTML node provides operations to help you work with HTML in n8n.
 * This node replaces the HTML Extract node from version 0.213.0 onwards.
 * 
 * ## Key Features
 * 
 * - **Generate HTML Template**: Create HTML templates with expressions and CSS/JavaScript
 * - **Extract HTML Content**: Extract data from HTML using CSS selectors
 * - **Convert to HTML Table**: Transform data into formatted HTML tables
 * - **JSON and Binary Sources**: Handle HTML from JSON properties or binary files
 * - **Advanced Extraction**: Support for attributes, text, HTML content, and values
 * - **Custom Styling**: Full control over table appearance and formatting
 * - **Expression Support**: Use n8n expressions in HTML templates
 * - **Security Awareness**: Built-in XSS protection warnings
 * 
 * ## Operations
 * 
 * ### Generate HTML Template
 * Create an HTML template using data from your workflow. Supports:
 * - Standard HTML markup
 * - CSS in `<style>` tags
 * - JavaScript in `<script>` tags (not executed by n8n)
 * - n8n expressions wrapped in `{{}}`
 * - Built-in methods and variables
 * 
 * ### Extract HTML Content
 * Extract contents from HTML-formatted sources using CSS selectors:
 * - **Source Data**: JSON properties or binary files
 * - **CSS Selectors**: Powerful element targeting
 * - **Return Values**: Attributes, HTML, text content, or input values
 * - **Array Support**: Single values or arrays of matches
 * - **Text Processing**: Trimming and cleanup options
 * 
 * ### Convert to HTML Table
 * Transform workflow data into formatted HTML tables:
 * - **Custom Styling**: Full control over appearance
 * - **Header Capitalization**: Automatic header formatting
 * - **Table Attributes**: Custom styling and properties
 * - **Caption Support**: Add descriptive captions
 * - **Cell Formatting**: Individual row and cell styling
 * 
 * ## Security Considerations
 * 
 * ⚠️ **XSS Warning**: When generating HTML templates, be careful with untrusted inputs
 * to prevent cross-site scripting attacks. Always validate and sanitize user data.
 * 
 * ## Use Cases
 * 
 * - **Web Scraping**: Extract data from scraped HTML pages
 * - **Email Templates**: Generate HTML emails with dynamic content
 * - **Report Generation**: Create formatted HTML reports from workflow data
 * - **Data Extraction**: Parse HTML responses from APIs
 * - **Content Processing**: Clean and extract content from HTML sources
 * - **Table Creation**: Convert JSON data to HTML tables for display
 * - **Document Parsing**: Extract specific information from HTML documents
 * - **Template Generation**: Create dynamic HTML content with expressions
 */

import { NodeTypeInfo } from '../../node-types.js';

export const htmlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.html',
  displayName: 'HTML',
  description: 'Work with HTML content: generate templates, extract data using CSS selectors, and convert data to HTML tables.',
  category: 'Core Nodes',
  subcategory: 'Data Processing',
  
  properties: [
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'extractHtmlContent',
      description: 'The operation to perform on the HTML',
      options: [
        {
          name: 'Generate HTML Template',
          value: 'generateHtmlTemplate',
          description: 'Create an HTML template with expressions and styling'
        },
        {
          name: 'Extract HTML Content',
          value: 'extractHtmlContent',
          description: 'Extract contents from HTML using CSS selectors'
        },
        {
          name: 'Convert to HTML Table',
          value: 'convertToHtmlTable',
          description: 'Convert workflow data to an HTML table'
        }
      ]
    },
    
    // Generate HTML Template Parameters
    {
      name: 'htmlTemplate',
      displayName: 'HTML Template',
      type: 'string',
      required: true,
      default: '<!DOCTYPE html>\n<html>\n<head>\n  <title>{{$json.title}}</title>\n</head>\n<body>\n  <h1>{{$json.heading}}</h1>\n  <p>{{$json.content}}</p>\n</body>\n</html>',
      description: 'HTML template with expressions wrapped in {{}}',
      typeOptions: {
        rows: 10
      },
      displayOptions: {
        show: {
          operation: ['generateHtmlTemplate']
        }
      }
    },
    
    // Extract HTML Content Parameters
    {
      name: 'sourceData',
      displayName: 'Source Data',
      type: 'options',
      required: true,
      default: 'json',
      description: 'Where to get the HTML content from',
      options: [
        {
          name: 'JSON',
          value: 'json',
          description: 'HTML content from a JSON property'
        },
        {
          name: 'Binary',
          value: 'binary',
          description: 'HTML content from a binary file'
        }
      ],
      displayOptions: {
        show: {
          operation: ['extractHtmlContent']
        }
      }
    },
    {
      name: 'jsonProperty',
      displayName: 'JSON Property',
      type: 'string',
      required: true,
      default: 'html',
      description: 'Name of the JSON property containing the HTML',
      displayOptions: {
        show: {
          operation: ['extractHtmlContent'],
          sourceData: ['json']
        }
      }
    },
    {
      name: 'binaryProperty',
      displayName: 'Input Binary Field',
      type: 'string',
      required: true,
      default: 'data',
      description: 'Name of the binary property containing the HTML',
      displayOptions: {
        show: {
          operation: ['extractHtmlContent'],
          sourceData: ['binary']
        }
      }
    },
    {
      name: 'extractionValues',
      displayName: 'Extraction Values',
      type: 'fixedCollection',
      required: true,
      default: { values: [{ key: 'text', cssSelector: 'body', returnValue: 'text', returnArray: false }] },
      description: 'Values to extract from the HTML',
      typeOptions: {
        multipleValues: true
      },
      displayOptions: {
        show: {
          operation: ['extractHtmlContent']
        }
      },
      options: [
        {
          name: 'values',
          displayName: 'Values',
          values: [
            {
              name: 'key',
              displayName: 'Key',
              type: 'string',
              required: true,
              default: '',
              description: 'Key to save the extracted value under'
            },
            {
              name: 'cssSelector',
              displayName: 'CSS Selector',
              type: 'string',
              required: true,
              default: '',
              description: 'CSS selector to search for'
            },
            {
              name: 'returnValue',
              displayName: 'Return Value',
              type: 'options',
              required: true,
              default: 'text',
              description: 'Type of data to return',
              options: [
                {
                  name: 'Attribute',
                  value: 'attribute',
                  description: 'Return an attribute value from the element'
                },
                {
                  name: 'HTML',
                  value: 'html',
                  description: 'Return the HTML that the element contains'
                },
                {
                  name: 'Text',
                  value: 'text',
                  description: 'Return the text content of the element'
                },
                {
                  name: 'Value',
                  value: 'value',
                  description: 'Return the value of input, select, or textarea'
                }
              ]
            },
            {
              name: 'attribute',
              displayName: 'Attribute',
              type: 'string',
              required: true,
              default: '',
              description: 'Name of the attribute to return the value of',
              displayOptions: {
                show: {
                  returnValue: ['attribute']
                }
              }
            },
            {
              name: 'skipSelectors',
              displayName: 'Skip Selectors',
              type: 'string',
              required: false,
              default: '',
              description: 'Comma-separated list of selectors to skip when extracting text',
              displayOptions: {
                show: {
                  returnValue: ['text']
                }
              }
            },
            {
              name: 'returnArray',
              displayName: 'Return Array',
              type: 'boolean',
              required: false,
              default: false,
              description: 'Return multiple extraction values as array or single string'
            }
          ]
        }
      ]
    },
    
    // Extract HTML Content Options
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional extraction options',
      displayOptions: {
        show: {
          operation: ['extractHtmlContent']
        }
      },
      options: [
        {
          name: 'trimValues',
          displayName: 'Trim Values',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Remove spaces and newlines from beginning and end of values'
        },
        {
          name: 'cleanUpText',
          displayName: 'Clean Up Text',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Remove extra whitespaces and condense multiple spaces'
        }
      ]
    },
    
    // Convert to HTML Table Options
    {
      name: 'tableOptions',
      displayName: 'Table Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'HTML table formatting options',
      displayOptions: {
        show: {
          operation: ['convertToHtmlTable']
        }
      },
      options: [
        {
          name: 'capitalizeHeaders',
          displayName: 'Capitalize Headers',
          type: 'boolean',
          required: false,
          default: true,
          description: 'Capitalize the table headers'
        },
        {
          name: 'customStyling',
          displayName: 'Custom Styling',
          type: 'boolean',
          required: false,
          default: false,
          description: 'Use custom styling for the table'
        },
        {
          name: 'caption',
          displayName: 'Caption',
          type: 'string',
          required: false,
          default: '',
          description: 'Caption to add to the table'
        },
        {
          name: 'tableAttributes',
          displayName: 'Table Attributes',
          type: 'string',
          required: false,
          default: '',
          description: 'Attributes to apply to the <table> element'
        },
        {
          name: 'headerAttributes',
          displayName: 'Header Attributes',
          type: 'string',
          required: false,
          default: '',
          description: 'Attributes to apply to header <th> elements'
        },
        {
          name: 'rowAttributes',
          displayName: 'Row Attributes',
          type: 'string',
          required: false,
          default: '',
          description: 'Attributes to apply to <tr> elements'
        },
        {
          name: 'cellAttributes',
          displayName: 'Cell Attributes',
          type: 'string',
          required: false,
          default: '',
          description: 'Attributes to apply to <td> elements'
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

  version: [1, 2],
  defaults: {
    name: 'HTML'
  },

  aliases: ['scrape', 'extract', 'css', 'selector', 'template', 'table'],
  
  examples: [
    {
      name: 'Generate HTML Email Template',
      description: 'Create dynamic HTML email with workflow data',
      workflow: {
        nodes: [
          {
            name: 'HTML',
            type: 'n8n-nodes-base.html',
            parameters: {
              operation: 'generateHtmlTemplate',
              htmlTemplate: '<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: Arial, sans-serif; }\n    .header { color: #333; }\n  </style>\n</head>\n<body>\n  <h1 class="header">Welcome {{$json.name}}!</h1>\n  <p>Your order #{{$json.orderId}} has been confirmed.</p>\n  <p>Total: ${{$json.total}}</p>\n</body>\n</html>'
            }
          }
        ]
      }
    },
    {
      name: 'Extract Data from HTML Page',
      description: 'Extract title, links, and text from HTML content',
      workflow: {
        nodes: [
          {
            name: 'HTML',
            type: 'n8n-nodes-base.html',
            parameters: {
              operation: 'extractHtmlContent',
              sourceData: 'json',
              jsonProperty: 'html',
              extractionValues: {
                values: [
                  {
                    key: 'title',
                    cssSelector: 'h1',
                    returnValue: 'text',
                    returnArray: false
                  },
                  {
                    key: 'links',
                    cssSelector: 'a',
                    returnValue: 'attribute',
                    attribute: 'href',
                    returnArray: true
                  },
                  {
                    key: 'content',
                    cssSelector: '.content',
                    returnValue: 'html',
                    returnArray: false
                  }
                ]
              },
              options: {
                trimValues: true,
                cleanUpText: true
              }
            }
          }
        ]
      }
    },
    {
      name: 'Convert Data to Styled HTML Table',
      description: 'Transform JSON data into a formatted HTML table',
      workflow: {
        nodes: [
          {
            name: 'HTML',
            type: 'n8n-nodes-base.html',
            parameters: {
              operation: 'convertToHtmlTable',
              tableOptions: {
                capitalizeHeaders: true,
                customStyling: true,
                caption: 'Sales Report',
                tableAttributes: 'style="border-collapse: collapse; width: 100%;"',
                headerAttributes: 'style="background-color: #f2f2f2; padding: 8px; border: 1px solid #ddd;"',
                rowAttributes: 'style="border: 1px solid #ddd;"',
                cellAttributes: 'style="padding: 8px; border: 1px solid #ddd;"'
              }
            }
          }
        ]
      }
    }
  ]
};

export default htmlNode;
