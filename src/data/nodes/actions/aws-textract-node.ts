/**
 * AWS Textract Node
 * 
 * Uses Amazon Textract to extract text and structure from documents. It can do simple text extraction or full document analysis (including forms and tables). This enables processing PDFs or scanned images to get text content and structured data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awstextractNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-textract',
  displayName: 'AWS Textract',
  description: 'Uses Amazon Textract to extract text and structure from documents. It can do simple text extraction or full document analysis (including forms and tables). This enables processing PDFs or scanned images to get text content and structured data.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Detect Document Text',
      description: 'The operation to perform',
      options: [
        { name: 'Detect Document Text', value: 'Detect Document Text' },
        { name: 'Analyze Document', value: 'Analyze Document' }
      ]
    },

    {
      name: 'resourceId',
      displayName: 'Resource ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the resource to work with'
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
      description: 'Processed data from AWS Textract'
    }
  ],

  credentials: [
    {
      name: 'aws-textractApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Textract'
  },

  aliases: ['aws', 'textract'],
  
  examples: [
        {
      name: 'Detect Document Text Item',
      description: 'Detect Document Text an item from AWS Textract',
      workflow: {
        nodes: [
          {
            name: 'AWS Textract',
            type: 'n8n-nodes-base.aws-textract',
            parameters: {
              operation: 'Detect Document Text',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awstextractNode;