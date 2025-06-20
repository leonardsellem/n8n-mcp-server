import { NodeTypeInfo } from '../node-types.js';

export const mindeeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.mindee',
  displayName: 'Mindee',
  description: 'Use the Mindee node to automate work in Mindee, and integrate Mindee with other applications. n8n has built-in support for a wide range of Mindee features, including predicting invoices and extracting data from receipts using OCR.',
  category: 'AI',
  subcategory: 'Document Processing',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'invoice',
      description: 'The document type to process',
      options: [
        { name: 'Invoice', value: 'invoice', description: 'Process invoice documents with OCR' },
        { name: 'Receipt', value: 'receipt', description: 'Process receipt documents with OCR' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'predict',
      description: 'The operation to perform',
      options: [
        { name: 'Predict', value: 'predict', description: 'Extract data from document using OCR prediction' }
      ]
    },
    {
      name: 'inputType',
      displayName: 'Input Type',
      type: 'options',
      required: true,
      default: 'file',
      description: 'The type of input to process',
      options: [
        { name: 'File', value: 'file', description: 'Process a file from the workflow' },
        { name: 'URL', value: 'url', description: 'Process a document from a URL' },
        { name: 'Base64', value: 'base64', description: 'Process a base64 encoded document' }
      ]
    },
    {
      name: 'filePropertyName',
      displayName: 'File Property Name',
      type: 'string',
      required: false,
      default: 'data',
      description: 'The property name containing the file data in the input'
    },
    {
      name: 'documentUrl',
      displayName: 'Document URL',
      type: 'string',
      required: false,
      default: '',
      description: 'URL of the document to process'
    },
    {
      name: 'base64Data',
      displayName: 'Base64 Data',
      type: 'string',
      required: false,
      default: '',
      description: 'Base64 encoded document data'
    },
    {
      name: 'fileName',
      displayName: 'File Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Name of the file being processed'
    },
    {
      name: 'includeWords',
      displayName: 'Include Words',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to include word-level details in the response'
    },
    {
      name: 'cropper',
      displayName: 'Enable Cropper',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to automatically crop the document before processing'
    },
    {
      name: 'straighten',
      displayName: 'Auto Straighten',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Whether to automatically straighten the document'
    },
    {
      name: 'outputFormat',
      displayName: 'Output Format',
      type: 'options',
      required: false,
      default: 'structured',
      description: 'How to format the extracted data',
      options: [
        { name: 'Structured', value: 'structured', description: 'Return structured data object' },
        { name: 'Raw', value: 'raw', description: 'Return raw API response' },
        { name: 'Simple', value: 'simple', description: 'Return simplified key-value pairs' }
      ]
    },
    {
      name: 'extractionFields',
      displayName: 'Extraction Fields',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'Specific fields to extract (if empty, extracts all available fields)',
      options: [
        // Invoice fields
        { name: 'Invoice Number', value: 'invoice_number', description: 'Invoice number' },
        { name: 'Invoice Date', value: 'invoice_date', description: 'Invoice date' },
        { name: 'Due Date', value: 'due_date', description: 'Due date' },
        { name: 'Total Amount', value: 'total_amount', description: 'Total amount' },
        { name: 'Tax Amount', value: 'tax_amount', description: 'Tax amount' },
        { name: 'Supplier Name', value: 'supplier_name', description: 'Supplier name' },
        { name: 'Supplier Address', value: 'supplier_address', description: 'Supplier address' },
        { name: 'Customer Name', value: 'customer_name', description: 'Customer name' },
        { name: 'Customer Address', value: 'customer_address', description: 'Customer address' },
        { name: 'Line Items', value: 'line_items', description: 'Line items' },
        // Receipt fields
        { name: 'Receipt Number', value: 'receipt_number', description: 'Receipt number' },
        { name: 'Receipt Date', value: 'receipt_date', description: 'Receipt date' },
        { name: 'Receipt Time', value: 'receipt_time', description: 'Receipt time' },
        { name: 'Merchant Name', value: 'merchant_name', description: 'Merchant name' },
        { name: 'Merchant Address', value: 'merchant_address', description: 'Merchant address' },
        { name: 'Total Amount', value: 'total_amount', description: 'Total amount' },
        { name: 'Taxes', value: 'taxes', description: 'Tax information' },
        { name: 'Category', value: 'category', description: 'Expense category' }
      ]
    },
    {
      name: 'confidenceThreshold',
      displayName: 'Confidence Threshold',
      type: 'number',
      required: false,
      default: 0.8,
      description: 'Minimum confidence level for extracted data (0.0 to 1.0)'
    }
  ],
  inputs: [
    {
      type: 'main',
      displayName: 'Input',
      required: false
    }
  ],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'The extracted document data from Mindee OCR'
    }
  ],
  credentials: ['mindeeApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Extract Invoice Data',
      description: 'Extract data from an invoice document using Mindee OCR',
      workflow: {
        nodes: [
          {
            name: 'Mindee',
            type: 'n8n-nodes-base.mindee',
            parameters: {
              resource: 'invoice',
              operation: 'predict',
              inputType: 'file',
              filePropertyName: 'data',
              outputFormat: 'structured',
              extractionFields: ['invoice_number', 'invoice_date', 'total_amount', 'supplier_name']
            }
          }
        ]
      }
    },
    {
      name: 'Process Receipt from URL',
      description: 'Extract receipt data from a document URL',
      workflow: {
        nodes: [
          {
            name: 'Mindee',
            type: 'n8n-nodes-base.mindee',
            parameters: {
              resource: 'receipt',
              operation: 'predict',
              inputType: 'url',
              documentUrl: 'https://example.com/receipt.jpg',
              outputFormat: 'simple',
              cropper: true,
              straighten: true
            }
          }
        ]
      }
    },
    {
      name: 'Extract Receipt Data with High Confidence',
      description: 'Process receipt with high confidence threshold and specific fields',
      workflow: {
        nodes: [
          {
            name: 'Mindee',
            type: 'n8n-nodes-base.mindee',
            parameters: {
              resource: 'receipt',
              operation: 'predict',
              inputType: 'file',
              filePropertyName: 'data',
              outputFormat: 'structured',
              extractionFields: ['merchant_name', 'total_amount', 'receipt_date', 'category'],
              confidenceThreshold: 0.9,
              includeWords: true
            }
          }
        ]
      }
    },
    {
      name: 'Process Base64 Invoice',
      description: 'Extract invoice data from base64 encoded document',
      workflow: {
        nodes: [
          {
            name: 'Mindee',
            type: 'n8n-nodes-base.mindee',
            parameters: {
              resource: 'invoice',
              operation: 'predict',
              inputType: 'base64',
              base64Data: '{{$json["base64Document"]}}',
              fileName: 'invoice.pdf',
              outputFormat: 'structured',
              cropper: true
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const mindeeNodes: NodeTypeInfo[] = [mindeeNode];

// Export individual actions for the Mindee node
export const mindeeActions = [
  // Invoice actions
  'predict_invoice',
  'extract_invoice_data',
  'process_invoice_ocr',
  // Receipt actions
  'predict_receipt',
  'extract_receipt_data',
  'process_receipt_ocr',
  // General actions
  'extract_document_data',
  'process_document_ocr'
];

// Export supported document types
export const mindeeDocumentTypes = [
  'invoice',
  'receipt'
];

// Export supported input methods
export const mindeeInputTypes = [
  'file',
  'url',
  'base64'
];

// Export extraction capabilities
export const mindeeExtractionFields = {
  invoice: [
    'invoice_number',
    'invoice_date',
    'due_date',
    'total_amount',
    'tax_amount',
    'supplier_name',
    'supplier_address',
    'customer_name',
    'customer_address',
    'line_items'
  ],
  receipt: [
    'receipt_number',
    'receipt_date',
    'receipt_time',
    'merchant_name',
    'merchant_address',
    'total_amount',
    'taxes',
    'category'
  ]
};