/**
 * # XML
 * 
 * **Status**: ✅ Active
 * **Category**: Core Nodes
 * **Subcategory**: Data Transformation
 * 
 * ## Description
 * 
 * Use the XML node to convert data from and to XML format. This node provides bidirectional 
 * conversion between JSON and XML with extensive customization options.
 * 
 * ## Key Features
 * 
 * - **Bidirectional Conversion**: Convert between JSON and XML formats seamlessly
 * - **Flexible Configuration**: Extensive options for customizing conversion behavior
 * - **Attribute Handling**: Full control over how XML attributes are processed
 * - **Whitespace Control**: Options for trimming and normalizing whitespace
 * - **CDATA Support**: Handle CDATA sections appropriately when needed
 * - **Binary File Compatibility**: Works with Extract from File node for binary XML
 * - **Unicode Support**: Handle special characters and surrogate pairs
 * - **Array Control**: Flexible handling of arrays in JSON/XML conversion
 * 
 * ## Node Parameters
 * 
 * ### Mode
 * The format the data should be converted from and to:
 * - **JSON to XML**: Converts data from JSON format to XML
 * - **XML to JSON**: Converts data from XML format to JSON
 * 
 * ### Property Name
 * Enter the name of the property which contains the data to convert.
 * 
 * ## Node Options
 * 
 * ### Common Options (All Modes)
 * These options are available regardless of the mode selected:
 * - **Attribute Key**: Prefix used to access XML attributes (default: `$`)
 * - **Character Key**: Prefix used to access character content (default: `_`)
 * 
 * ### JSON to XML Options
 * - **Allow Surrogate Chars**: Set whether to allow Unicode surrogate block characters
 * - **Cdata**: Wrap text nodes in `<![CDATA[ ... ]]>` when required (only when needed)
 * - **Headless**: Omit the XML header from output
 * - **Root Name**: Specify the root element name to use
 * 
 * ### XML to JSON Options
 * - **Explicit Array**: Put child nodes in array vs only when multiple children exist
 * - **Explicit Root**: Get root node in resulting object vs exclude it
 * - **Ignore Attributes**: Ignore all XML attributes and only create text nodes
 * - **Merge Attributes**: Merge attributes and child elements as properties of parent
 * - **Normalize**: Trim whitespaces inside text nodes
 * - **Normalize Tags**: Normalize all tag names to lowercase
 * - **Trim**: Trim whitespace at beginning and end of text nodes
 * 
 * ## Binary Files
 * 
 * If your XML is within a binary file, use the Extract from File node to convert it to text first,
 * then pass the text data to the XML node for conversion.
 * 
 * ## Use Cases
 * 
 * - Convert API responses between JSON and XML formats
 * - Process XML configuration files and feeds
 * - Transform data for XML-based systems (SOAP, RSS, etc.)
 * - Parse XML feeds and convert to JSON for processing
 * - Generate XML output from JSON data structures
 * - Handle SOAP web service requests and responses
 * - Process XML documents and extract structured data
 * - Web scraping XML-based content and data extraction
 * - Configuration file processing and transformation
 * - Legacy system integration requiring XML formats
 * 
 * ## Technical Notes
 * 
 * - Supports standard XML parsing and generation
 * - Handles XML namespaces and complex structures
 * - Preserves data types during conversion when possible
 * - Configurable handling of edge cases and special characters
 */

import { NodeTypeInfo } from '../../node-types.js';

export const xmlNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.xml',
  displayName: 'XML',
  description: 'Convert data from and to XML format with bidirectional JSON-XML conversion and extensive customization options.',
  category: 'Core Nodes',
  subcategory: 'Data Transformation',
  
  properties: [
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'xmlToJson',
      description: 'The conversion direction to perform',
      options: [
        { name: 'XML to JSON', value: 'xmlToJson' },
        { name: 'JSON to XML', value: 'jsonToXml' }
      ]
    },
    {
      name: 'propertyName',
      displayName: 'Property Name',
      type: 'string',
      required: true,
      default: 'data',
      description: 'Name of the property which contains the data to convert',
      placeholder: 'data'
    },
    {
      name: 'options',
      displayName: 'Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional conversion options',
      options: [
        {
          name: 'attributeKey',
          displayName: 'Attribute Key',
          type: 'string',
          default: '$',
          description: 'Prefix used to access XML attributes'
        },
        {
          name: 'characterKey',
          displayName: 'Character Key',
          type: 'string',
          default: '_',
          description: 'Prefix used to access character content'
        },
        {
          name: 'allowSurrogateChars',
          displayName: 'Allow Surrogate Chars',
          type: 'boolean',
          default: false,
          description: 'Allow Unicode surrogate block characters',
          displayOptions: {
            show: {
              '/mode': ['jsonToXml']
            }
          }
        },
        {
          name: 'cdata',
          displayName: 'CDATA',
          type: 'boolean',
          default: false,
          description: 'Wrap text nodes in CDATA when required',
          displayOptions: {
            show: {
              '/mode': ['jsonToXml']
            }
          }
        },
        {
          name: 'headless',
          displayName: 'Headless',
          type: 'boolean',
          default: false,
          description: 'Omit the XML header from output',
          displayOptions: {
            show: {
              '/mode': ['jsonToXml']
            }
          }
        },
        {
          name: 'rootName',
          displayName: 'Root Name',
          type: 'string',
          default: 'root',
          description: 'Root element name to use',
          displayOptions: {
            show: {
              '/mode': ['jsonToXml']
            }
          }
        },
        {
          name: 'explicitArray',
          displayName: 'Explicit Array',
          type: 'boolean',
          default: false,
          description: 'Always put child nodes in arrays',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
            }
          }
        },
        {
          name: 'explicitRoot',
          displayName: 'Explicit Root',
          type: 'boolean',
          default: true,
          description: 'Include root node in resulting object',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
            }
          }
        },
        {
          name: 'ignoreAttributes',
          displayName: 'Ignore Attributes',
          type: 'boolean',
          default: false,
          description: 'Ignore XML attributes, create text nodes only',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
            }
          }
        },
        {
          name: 'mergeAttributes',
          displayName: 'Merge Attributes',
          type: 'boolean',
          default: false,
          description: 'Merge attributes with child elements',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
            }
          }
        },
        {
          name: 'normalize',
          displayName: 'Normalize',
          type: 'boolean',
          default: false,
          description: 'Trim whitespace inside text nodes',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
            }
          }
        },
        {
          name: 'normalizeTags',
          displayName: 'Normalize Tags',
          type: 'boolean',
          default: false,
          description: 'Convert all tag names to lowercase',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
            }
          }
        },
        {
          name: 'trim',
          displayName: 'Trim',
          type: 'boolean',
          default: false,
          description: 'Trim whitespace at beginning and end of text nodes',
          displayOptions: {
            show: {
              '/mode': ['xmlToJson']
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
      displayName: 'Converted Data',
      description: 'Data converted between JSON and XML formats'
    }
  ],

  credentials: [],

  regularNode: true,
  
  version: [1, 2],
  defaults: {
    name: 'XML'
  },

  aliases: ['json', 'convert', 'transform'],
  
  examples: [
    {
      name: 'XML to JSON Conversion',
      description: 'Convert XML data to JSON format',
      workflow: {
        nodes: [
          {
            name: 'XML',
            type: 'n8n-nodes-base.xml',
            parameters: {
              mode: 'xmlToJson',
              propertyName: 'xmlData'
            }
          }
        ]
      }
    },
    {
      name: 'JSON to XML Conversion',
      description: 'Convert JSON data to XML format',
      workflow: {
        nodes: [
          {
            name: 'XML',
            type: 'n8n-nodes-base.xml',
            parameters: {
              mode: 'jsonToXml',
              propertyName: 'jsonData',
              options: {
                rootName: 'response',
                headless: false
              }
            }
          }
        ]
      }
    },
    {
      name: 'Custom XML Conversion',
      description: 'XML conversion with custom options',
      workflow: {
        nodes: [
          {
            name: 'XML',
            type: 'n8n-nodes-base.xml',
            parameters: {
              mode: 'xmlToJson',
              propertyName: 'data',
              options: {
                ignoreAttributes: false,
                mergeAttributes: true,
                normalize: true,
                trim: true
              }
            }
          }
        ]
      }
    }
  ]
};

export default xmlNode;
