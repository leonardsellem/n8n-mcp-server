/**
 * QuickBooks Node - Essential Accounting Platform
 * 
 * Comprehensive QuickBooks Online API integration for accounting automation,
 * financial management, and business operations.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const quickbooksNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.quickbooks',
  displayName: 'QuickBooks',
  description: 'Integrate with QuickBooks Online for accounting automation, invoice management, and financial operations',
  category: 'Finance',
  subcategory: 'Accounting',
  
  properties: [
    // Company ID (required for QB Online)
    {
      name: 'companyId',
      displayName: 'Company ID',
      type: 'string',
      required: true,
      default: '',
      description: 'Your QuickBooks Online Company ID (found in settings)'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'customer',
      options: [
        { name: 'Customer', value: 'customer' },
        { name: 'Vendor', value: 'vendor' },
        { name: 'Item', value: 'item' },
        { name: 'Invoice', value: 'invoice' },
        { name: 'Bill', value: 'bill' },
        { name: 'Payment', value: 'payment' },
        { name: 'Estimate', value: 'estimate' },
        { name: 'Employee', value: 'employee' },
        { name: 'Account', value: 'account' },
        { name: 'Class', value: 'class' },
        { name: 'Department', value: 'department' },
        { name: 'Tax Rate', value: 'taxRate' },
        { name: 'Company Info', value: 'companyInfo' }
      ],
      description: 'Choose the QuickBooks resource to work with'
    },

    // Customer operations
    {
      name: 'customerOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['customer'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ],
      description: 'Choose the operation to perform on the customer resource'
    },

    // Invoice operations
    {
      name: 'invoiceOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['invoice'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Send', value: 'send' },
        { name: 'Get PDF', value: 'getPdf' }
      ],
      description: 'Choose the operation to perform on the invoice resource'
    },

    // Item operations
    {
      name: 'itemOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['item'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ],
      description: 'Choose the operation to perform on the item resource'
    },

    // Payment operations
    {
      name: 'paymentOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      displayOptions: {
        show: { resource: ['payment'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ],
      description: 'Choose the operation to perform on the payment resource'
    },

    // Resource ID
    {
      name: 'resourceId',
      displayName: 'ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['customer', 'vendor', 'item', 'invoice', 'bill', 'payment', 'estimate', 'employee'],
          operation: ['get', 'update', 'delete', 'send', 'getPdf']
        }
      },
      description: 'The ID of the resource'
    },

    // Customer fields
    {
      name: 'customerName',
      displayName: 'Customer Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'The name of the customer'
    },

    {
      name: 'customerEmail',
      displayName: 'Email',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'Customer email address'
    },

    {
      name: 'customerPhone',
      displayName: 'Phone',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'Customer phone number'
    },

    // Invoice fields
    {
      name: 'invoiceCustomerId',
      displayName: 'Customer ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['invoice'],
          invoiceOperation: ['create', 'update']
        }
      },
      description: 'The ID of the customer for this invoice'
    },

    {
      name: 'invoiceDate',
      displayName: 'Invoice Date',
      type: 'dateTime',
      required: false,
      displayOptions: {
        show: { 
          resource: ['invoice'],
          invoiceOperation: ['create', 'update']
        }
      },
      description: 'The date of the invoice'
    },

    {
      name: 'dueDate',
      displayName: 'Due Date',
      type: 'dateTime',
      required: false,
      displayOptions: {
        show: { 
          resource: ['invoice'],
          invoiceOperation: ['create', 'update']
        }
      },
      description: 'The due date for payment'
    },

    {
      name: 'docNumber',
      displayName: 'Invoice Number',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['invoice'],
          invoiceOperation: ['create', 'update']
        }
      },
      description: 'The invoice number (auto-generated if not provided)'
    },

    // Line items for invoices
    {
      name: 'lineItems',
      displayName: 'Line Items',
      type: 'fixedCollection',
      required: false,
      typeOptions: {
        multipleValues: true
    },
      default: {},
      displayOptions: {
        show: { 
          resource: ['invoice'],
          invoiceOperation: ['create', 'update']
        }
      },
      description: 'Line items to include in the invoice with item details, quantities, and prices',
      options: [
        {
          name: 'lineItem',
          displayName: 'Line Item',
          values: [
            {
              name: 'itemId',
              displayName: 'Item ID',
              type: 'string',
              required: false,
              default: '',
              description: 'The ID of the item'
            },
            {
              name: 'description',
              displayName: 'Description',
              type: 'string',
              required: false,
              default: '',
              description: 'Description of the line item'
            },
            {
              name: 'quantity',
              displayName: 'Quantity',
              type: 'number',
              required: false,
              default: 1,
              description: 'Quantity of the item'
            },
            {
              name: 'unitPrice',
              displayName: 'Unit Price',
              type: 'number',
              required: false,
              default: 0,
              description: 'Price per unit'
            },
            {
              name: 'amount',
              displayName: 'Amount',
              type: 'number',
              required: false,
              default: 0,
              description: 'Total amount for this line item'
            }
          ]
        }
      ]
    },

    // Item fields
    {
      name: 'itemName',
      displayName: 'Item Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['item'],
          itemOperation: ['create', 'update']
        }
      },
      description: 'The name of the item'
    },

    {
      name: 'itemType',
      displayName: 'Item Type',
      type: 'options',
      required: true,
      default: 'Inventory',
      displayOptions: {
        show: { 
          resource: ['item'],
          itemOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Inventory', value: 'Inventory' },
        { name: 'Service', value: 'Service' },
        { name: 'Non-inventory', value: 'NonInventory' }
      ],
      description: 'The type of item to create in QuickBooks'
    },

    {
      name: 'unitPrice',
      displayName: 'Unit Price',
      type: 'number',
      required: false,
      displayOptions: {
        show: { 
          resource: ['item'],
          itemOperation: ['create', 'update']
        }
      },
      description: 'The price of the item'
    },

    {
      name: 'incomeAccountId',
      displayName: 'Income Account ID',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['item'],
          itemOperation: ['create', 'update']
        }
      },
      description: 'The ID of the income account for this item'
    },

    // Payment fields
    {
      name: 'paymentAmount',
      displayName: 'Amount',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['payment'],
          paymentOperation: ['create', 'update']
        }
      },
      description: 'The payment amount'
    },

    {
      name: 'paymentCustomerId',
      displayName: 'Customer ID',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['payment'],
          paymentOperation: ['create', 'update']
        }
      },
      description: 'The ID of the customer making the payment'
    },

    {
      name: 'paymentDate',
      displayName: 'Payment Date',
      type: 'dateTime',
      required: false,
      displayOptions: {
        show: { 
          resource: ['payment'],
          paymentOperation: ['create', 'update']
        }
      },
      description: 'The date of the payment'
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for API calls and data filtering',
      options: [
        {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
          description: 'Number of results to return'
    },
        {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
          description: 'Number of results to skip'
    },
        {
      name: 'query',
      displayName: 'Query',
      type: 'string',
      required: false,
      default: '',
          description: 'SQL-like query to filter results'
    },
        {
      name: 'orderBy',
      displayName: 'Order By',
      type: 'string',
      required: false,
      default: '',
          description: 'Field to order results by'
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
      description: 'QuickBooks API response data'
    }
  ],

  credentials: [
    {
      name: 'quickbooksOAuth2',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  version: [1],
  defaults: {
    name: 'QuickBooks'
  },

  aliases: ['accounting', 'finance', 'invoice', 'bookkeeping', 'qb'],
  
  examples: [
    {
      name: 'Create Customer',
      description: 'Create a new customer in QuickBooks',
      workflow: {
        nodes: [
          {
            name: 'Create Customer',
            type: 'n8n-nodes-base.quickbooks',
            parameters: {
              companyId: '123456789',
              resource: 'customer',
              customerOperation: 'create',
              customerName: 'John Doe',
              customerEmail: 'john@example.com',
              customerPhone: '555-123-4567'
            }
          }
        ]
      }
    },
    {
      name: 'Create Invoice',
      description: 'Create a new invoice for a customer',
      workflow: {
        nodes: [
          {
            name: 'Create Invoice',
            type: 'n8n-nodes-base.quickbooks',
            parameters: {
              companyId: '123456789',
              resource: 'invoice',
              invoiceOperation: 'create',
              invoiceCustomerId: '1',
              docNumber: 'INV-001',
              lineItems: {
                lineItem: [
                  {
                    description: 'Web Development Services',
                    quantity: 10,
                    unitPrice: 150,
                    amount: 1500
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      name: 'Get All Invoices',
      description: 'Retrieve all invoices from QuickBooks',
      workflow: {
        nodes: [
          {
            name: 'Get Invoices',
            type: 'n8n-nodes-base.quickbooks',
            parameters: {
              companyId: '123456789',
              resource: 'invoice',
              invoiceOperation: 'getAll',
              options: {
                limit: 50,
                query: "WHERE TxnDate > '2024-01-01'"
              }
            }
          }
        ]
      }
    },
    {
      name: 'Record Payment',
      description: 'Record a payment received from a customer',
      workflow: {
        nodes: [
          {
            name: 'Record Payment',
            type: 'n8n-nodes-base.quickbooks',
            parameters: {
              companyId: '123456789',
              resource: 'payment',
              paymentOperation: 'create',
              paymentAmount: 1500,
              paymentCustomerId: '1',
              paymentDate: '2024-01-15'
            }
          }
        ]
      }
    }
  ]
};

export default quickbooksNode;