import { NodeTypeInfo } from '../../node-types.js';

export const shopifyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.shopify',
  displayName: 'Shopify',
  description: 'Use the Shopify node to automate work in Shopify, and integrate Shopify with other applications. n8n has built-in support for a wide range of Shopify features, including creating, updating, deleting, and getting orders and products.',
  category: 'Sales & CRM',
  subcategory: 'E-commerce',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'order',
      description: 'The resource to operate on',
      options: [
        { name: 'Order', value: 'order', description: 'Work with orders' },
        { name: 'Product', value: 'product', description: 'Work with products' }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'create',
      description: 'The operation to perform',
      options: [
        // Order operations
        { name: 'Create', value: 'create', description: 'Create an order' },
        { name: 'Delete', value: 'delete', description: 'Delete an order' },
        { name: 'Get', value: 'get', description: 'Get an order' },
        { name: 'Get All', value: 'getAll', description: 'Get all orders' },
        { name: 'Update', value: 'update', description: 'Update an order' },
        // Product operations
        { name: 'Create', value: 'create', description: 'Create a product' },
        { name: 'Delete', value: 'delete', description: 'Delete a product' },
        { name: 'Get', value: 'get', description: 'Get a product' },
        { name: 'Get All', value: 'getAll', description: 'Get all products' },
        { name: 'Update', value: 'update', description: 'Update a product' }
      ]
    },
    {
      name: 'orderId',
      displayName: 'Order ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the order to operate on'
    },
    {
      name: 'productId',
      displayName: 'Product ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the product to operate on'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Customer email address'
    },
    {
      name: 'title',
      displayName: 'Title',
      type: 'string',
      required: false,
      default: '',
      description: 'Product or order title'
    },
    {
      name: 'bodyHtml',
      displayName: 'Body HTML',
      type: 'string',
      required: false,
      default: '',
      description: 'Product description in HTML format'
    },
    {
      name: 'vendor',
      displayName: 'Vendor',
      type: 'string',
      required: false,
      default: '',
      description: 'Product vendor'
    },
    {
      name: 'productType',
      displayName: 'Product Type',
      type: 'string',
      required: false,
      default: '',
      description: 'Product type or category'
    },
    {
      name: 'tags',
      displayName: 'Tags',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of tags'
    },
    {
      name: 'price',
      displayName: 'Price',
      type: 'number',
      required: false,
      default: 0,
      description: 'Product price'
    },
    {
      name: 'compareAtPrice',
      displayName: 'Compare At Price',
      type: 'number',
      required: false,
      default: 0,
      description: 'Compare at price for the product'
    },
    {
      name: 'sku',
      displayName: 'SKU',
      type: 'string',
      required: false,
      default: '',
      description: 'Product SKU (Stock Keeping Unit)'
    },
    {
      name: 'inventoryQuantity',
      displayName: 'Inventory Quantity',
      type: 'number',
      required: false,
      default: 0,
      description: 'Available inventory quantity'
    },
    {
      name: 'weight',
      displayName: 'Weight',
      type: 'number',
      required: false,
      default: 0,
      description: 'Product weight'
    },
    {
      name: 'weightUnit',
      displayName: 'Weight Unit',
      type: 'options',
      required: false,
      default: 'kg',
      description: 'Unit of weight measurement',
      options: [
        { name: 'Grams', value: 'g' },
        { name: 'Kilograms', value: 'kg' },
        { name: 'Ounces', value: 'oz' },
        { name: 'Pounds', value: 'lb' }
      ]
    },
    {
      name: 'published',
      displayName: 'Published',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the product is published'
    },
    {
      name: 'taxable',
      displayName: 'Taxable',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the product is taxable'
    },
    {
      name: 'requiresShipping',
      displayName: 'Requires Shipping',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether the product requires shipping'
    },
    {
      name: 'trackQuantity',
      displayName: 'Track Quantity',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to track inventory quantity'
    },
    {
      name: 'fulfillmentService',
      displayName: 'Fulfillment Service',
      type: 'string',
      required: false,
      default: 'manual',
      description: 'Fulfillment service for the product'
    },
    {
      name: 'inventoryPolicy',
      displayName: 'Inventory Policy',
      type: 'options',
      required: false,
      default: 'deny',
      description: 'Inventory policy when out of stock',
      options: [
        { name: 'Deny', value: 'deny', description: 'Deny orders when out of stock' },
        { name: 'Continue', value: 'continue', description: 'Allow orders when out of stock' }
      ]
    },
    {
      name: 'financialStatus',
      displayName: 'Financial Status',
      type: 'options',
      required: false,
      default: 'pending',
      description: 'Financial status of the order',
      options: [
        { name: 'Pending', value: 'pending' },
        { name: 'Authorized', value: 'authorized' },
        { name: 'Partially Paid', value: 'partially_paid' },
        { name: 'Paid', value: 'paid' },
        { name: 'Partially Refunded', value: 'partially_refunded' },
        { name: 'Refunded', value: 'refunded' },
        { name: 'Voided', value: 'voided' }
      ]
    },
    {
      name: 'fulfillmentStatus',
      displayName: 'Fulfillment Status',
      type: 'options',
      required: false,
      default: 'unfulfilled',
      description: 'Fulfillment status of the order',
      options: [
        { name: 'Fulfilled', value: 'fulfilled' },
        { name: 'Null', value: 'null' },
        { name: 'Partial', value: 'partial' },
        { name: 'Restocked', value: 'restocked' },
        { name: 'Unfulfilled', value: 'unfulfilled' }
      ]
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 50,
      description: 'Maximum number of results to return'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'string',
      required: false,
      default: '',
      description: 'Comma-separated list of fields to include in the response'
    },
    {
      name: 'sinceId',
      displayName: 'Since ID',
      type: 'string',
      required: false,
      default: '',
      description: 'Return items after this ID'
    },
    {
      name: 'createdAtMin',
      displayName: 'Created At Min',
      type: 'string',
      required: false,
      default: '',
      description: 'Show items created after this date (ISO 8601 format)'
    },
    {
      name: 'createdAtMax',
      displayName: 'Created At Max',
      type: 'string',
      required: false,
      default: '',
      description: 'Show items created before this date (ISO 8601 format)'
    },
    {
      name: 'updatedAtMin',
      displayName: 'Updated At Min',
      type: 'string',
      required: false,
      default: '',
      description: 'Show items updated after this date (ISO 8601 format)'
    },
    {
      name: 'updatedAtMax',
      displayName: 'Updated At Max',
      type: 'string',
      required: false,
      default: '',
      description: 'Show items updated before this date (ISO 8601 format)'
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'options',
      required: false,
      default: 'any',
      description: 'Filter by status',
      options: [
        { name: 'Any', value: 'any' },
        { name: 'Open', value: 'open' },
        { name: 'Closed', value: 'closed' },
        { name: 'Cancelled', value: 'cancelled' },
        { name: 'Active', value: 'active' },
        { name: 'Draft', value: 'draft' },
        { name: 'Archived', value: 'archived' }
      ]
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
      description: 'The processed Shopify data'
    }
  ],
  credentials: ['shopifyApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Product',
      description: 'Create a new product in Shopify',
      workflow: {
        nodes: [
          {
            name: 'Shopify',
            type: 'n8n-nodes-base.shopify',
            parameters: {
              resource: 'product',
              operation: 'create',
              title: 'Sample Product',
              bodyHtml: '<p>This is a sample product description.</p>',
              vendor: 'My Store',
              productType: 'Electronics',
              tags: 'sample, test, electronics',
              price: 29.99,
              sku: 'SAMPLE-001',
              inventoryQuantity: 100
            }
          }
        ]
      }
    },
    {
      name: 'Get All Orders',
      description: 'Retrieve all orders from Shopify',
      workflow: {
        nodes: [
          {
            name: 'Shopify',
            type: 'n8n-nodes-base.shopify',
            parameters: {
              resource: 'order',
              operation: 'getAll',
              limit: 50,
              status: 'any'
            }
          }
        ]
      }
    },
    {
      name: 'Update Product',
      description: 'Update an existing product',
      workflow: {
        nodes: [
          {
            name: 'Shopify',
            type: 'n8n-nodes-base.shopify',
            parameters: {
              resource: 'product',
              operation: 'update',
              productId: '123456789',
              title: 'Updated Product Title',
              price: 39.99,
              inventoryQuantity: 75
            }
          }
        ]
      }
    },
    {
      name: 'Create Order',
      description: 'Create a new order in Shopify',
      workflow: {
        nodes: [
          {
            name: 'Shopify',
            type: 'n8n-nodes-base.shopify',
            parameters: {
              resource: 'order',
              operation: 'create',
              email: 'customer@example.com',
              financialStatus: 'pending',
              fulfillmentStatus: 'unfulfilled'
            }
          }
        ]
      }
    },
    {
      name: 'Get Product',
      description: 'Get a specific product by ID',
      workflow: {
        nodes: [
          {
            name: 'Shopify',
            type: 'n8n-nodes-base.shopify',
            parameters: {
              resource: 'product',
              operation: 'get',
              productId: '123456789',
              fields: 'id,title,vendor,product_type,tags,variants'
            }
          }
        ]
      }
    }
  ]
};

export const shopifyTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.shopifyTrigger',
  displayName: 'Shopify Trigger',
  description: 'Use the Shopify Trigger node to respond to events in Shopify. This node triggers workflows when specific events occur in your Shopify store, such as new orders, product updates, or customer changes.',
  category: 'Sales & CRM',
  subcategory: 'E-commerce',
  properties: [
    {
      name: 'topic',
      displayName: 'Topic',
      type: 'options',
      required: true,
      default: 'orders/create',
      description: 'The webhook topic to listen for',
      options: [
        // Order events
        { name: 'Order Created', value: 'orders/create', description: 'Triggered when a new order is created' },
        { name: 'Order Updated', value: 'orders/updated', description: 'Triggered when an order is updated' },
        { name: 'Order Paid', value: 'orders/paid', description: 'Triggered when an order is paid' },
        { name: 'Order Cancelled', value: 'orders/cancelled', description: 'Triggered when an order is cancelled' },
        { name: 'Order Fulfilled', value: 'orders/fulfilled', description: 'Triggered when an order is fulfilled' },
        { name: 'Order Partially Fulfilled', value: 'orders/partially_fulfilled', description: 'Triggered when an order is partially fulfilled' },
        { name: 'Order Deleted', value: 'orders/delete', description: 'Triggered when an order is deleted' },
        // Product events
        { name: 'Product Created', value: 'products/create', description: 'Triggered when a new product is created' },
        { name: 'Product Updated', value: 'products/update', description: 'Triggered when a product is updated' },
        { name: 'Product Deleted', value: 'products/delete', description: 'Triggered when a product is deleted' },
        // Customer events
        { name: 'Customer Created', value: 'customers/create', description: 'Triggered when a new customer is created' },
        { name: 'Customer Updated', value: 'customers/update', description: 'Triggered when a customer is updated' },
        { name: 'Customer Deleted', value: 'customers/delete', description: 'Triggered when a customer is deleted' },
        // Inventory events
        { name: 'Inventory Level Updated', value: 'inventory_levels/update', description: 'Triggered when inventory levels change' },
        { name: 'Inventory Item Updated', value: 'inventory_items/update', description: 'Triggered when inventory items are updated' },
        // App events
        { name: 'App Uninstalled', value: 'app/uninstalled', description: 'Triggered when the app is uninstalled' },
        // Collection events
        { name: 'Collection Created', value: 'collections/create', description: 'Triggered when a collection is created' },
        { name: 'Collection Updated', value: 'collections/update', description: 'Triggered when a collection is updated' },
        { name: 'Collection Deleted', value: 'collections/delete', description: 'Triggered when a collection is deleted' }
      ]
    },
    {
      name: 'webhookId',
      displayName: 'Webhook ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The webhook ID (automatically managed)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Shopify events occur'
    }
  ],
  credentials: ['shopifyApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor New Orders',
      description: 'Trigger workflow when new orders are created',
      workflow: {
        nodes: [
          {
            name: 'Shopify Trigger',
            type: 'n8n-nodes-base.shopifyTrigger',
            parameters: {
              topic: 'orders/create'
            }
          }
        ]
      }
    },
    {
      name: 'Track Product Updates',
      description: 'Trigger when products are updated',
      workflow: {
        nodes: [
          {
            name: 'Shopify Trigger',
            type: 'n8n-nodes-base.shopifyTrigger',
            parameters: {
              topic: 'products/update'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Customer Registration',
      description: 'Trigger when new customers are created',
      workflow: {
        nodes: [
          {
            name: 'Shopify Trigger',
            type: 'n8n-nodes-base.shopifyTrigger',
            parameters: {
              topic: 'customers/create'
            }
          }
        ]
      }
    },
    {
      name: 'Track Order Fulfillment',
      description: 'Trigger when orders are fulfilled',
      workflow: {
        nodes: [
          {
            name: 'Shopify Trigger',
            type: 'n8n-nodes-base.shopifyTrigger',
            parameters: {
              topic: 'orders/fulfilled'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const shopifyNodes: NodeTypeInfo[] = [shopifyNode, shopifyTriggerNode];

// Export individual actions for the regular Shopify node
export const shopifyActions = [
  // Order actions
  'create_order',
  'delete_order',
  'get_order',
  'get_all_orders',
  'update_order',
  // Product actions
  'create_product',
  'delete_product',
  'get_product',
  'get_all_products',
  'update_product'
];

// Export trigger topics
export const shopifyTriggers = [
  // Order triggers
  'orders_create',
  'orders_updated',
  'orders_paid',
  'orders_cancelled',
  'orders_fulfilled',
  'orders_partially_fulfilled',
  'orders_delete',
  // Product triggers
  'products_create',
  'products_update',
  'products_delete',
  // Customer triggers
  'customers_create',
  'customers_update',
  'customers_delete',
  // Inventory triggers
  'inventory_levels_update',
  'inventory_items_update',
  // App triggers
  'app_uninstalled',
  // Collection triggers
  'collections_create',
  'collections_update',
  'collections_delete'
];