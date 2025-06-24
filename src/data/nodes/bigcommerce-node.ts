/**
 * BigCommerce Node - Essential E-commerce Platform
 * 
 * Comprehensive BigCommerce API integration for e-commerce automation,
 * product management, and order processing.
 */

import { NodeTypeInfo } from '../node-types.js';

export const bigcommerceNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bigcommerce',
  displayName: 'BigCommerce',
  description: 'Integrate with BigCommerce for e-commerce automation, product management, and order processing',
  category: 'Sales',
  subcategory: 'E-commerce',
  
  properties: [
    // Store Hash (required for BigCommerce API)
    {
      name: 'storeHash',
      displayName: 'Store Hash',
      type: 'string',
      required: true,
      default: '',
      description: 'Your BigCommerce store hash (found in API settings)'
    },

    // Resource selector
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'product',
      options: [
        { name: 'Product', value: 'product' },
        { name: 'Order', value: 'order' },
        { name: 'Customer', value: 'customer' },
        { name: 'Category', value: 'category' },
        { name: 'Brand', value: 'brand' },
        { name: 'Coupon', value: 'coupon' },
        { name: 'Shipping Zone', value: 'shippingZone' },
        { name: 'Tax Class', value: 'taxClass' },
        { name: 'Store Information', value: 'storeInfo' },
        { name: 'Webhook', value: 'webhook' }
      ],
      description: 'Choose the BigCommerce resource to work with'
    },

    // Product operations
    {
      name: 'productOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Choose the operation to perform on products',
      displayOptions: {
        show: { resource: ['product'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Get Images', value: 'getImages' },
        { name: 'Create Image', value: 'createImage' },
        { name: 'Update Image', value: 'updateImage' },
        { name: 'Delete Image', value: 'deleteImage' }
      ]
    },

    // Order operations
    {
      name: 'orderOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Choose the operation to perform on orders',
      displayOptions: {
        show: { resource: ['order'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Get Products', value: 'getProducts' },
        { name: 'Get Shipments', value: 'getShipments' },
        { name: 'Create Shipment', value: 'createShipment' }
      ]
    },

    // Customer operations
    {
      name: 'customerOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Choose the operation to perform on customers',
      displayOptions: {
        show: { resource: ['customer'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
        { name: 'Get Addresses', value: 'getAddresses' },
        { name: 'Create Address', value: 'createAddress' }
      ]
    },

    // Category operations
    {
      name: 'categoryOperation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Choose the operation to perform on categories',
      displayOptions: {
        show: { resource: ['category'] }
      },
      options: [
        { name: 'Get', value: 'get' },
        { name: 'Get All', value: 'getAll' },
        { name: 'Create', value: 'create' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' }
      ]
    },

    // Resource IDs
    {
      name: 'productId',
      displayName: 'Product ID',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['get', 'update', 'delete', 'getImages', 'createImage']
        }
      },
      description: 'The BigCommerce product ID'
    },

    {
      name: 'orderId',
      displayName: 'Order ID',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['order'],
          orderOperation: ['get', 'update', 'delete', 'getProducts', 'getShipments', 'createShipment']
        }
      },
      description: 'The BigCommerce order ID'
    },

    {
      name: 'customerId',
      displayName: 'Customer ID',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['get', 'update', 'delete', 'getAddresses', 'createAddress']
        }
      },
      description: 'The BigCommerce customer ID'
    },

    {
      name: 'categoryId',
      displayName: 'Category ID',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['category'],
          categoryOperation: ['get', 'update', 'delete']
        }
      },
      description: 'The BigCommerce category ID'
    },

    // Product creation/update fields
    {
      name: 'productName',
      displayName: 'Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      description: 'The product name'
    },

    {
      name: 'productDescription',
      displayName: 'Description',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 4
    },
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      description: 'The product description'
    },

    {
      name: 'productType',
      displayName: 'Type',
      type: 'options',
      required: true,
      default: 'physical',
      description: 'The type of product (physical or digital)',
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Physical', value: 'physical' },
        { name: 'Digital', value: 'digital' }
      ]
    },

    {
      name: 'productPrice',
      displayName: 'Price',
      type: 'number',
      required: true,
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      description: 'The product price'
    },

    {
      name: 'productWeight',
      displayName: 'Weight',
      type: 'number',
      required: false,
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      description: 'The product weight'
    },

    {
      name: 'productSku',
      displayName: 'SKU',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      description: 'The product SKU'
    },

    {
      name: 'productAvailability',
      displayName: 'Availability',
      type: 'options',
      required: false,
      default: 'available',
      description: 'The availability status of the product',
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      options: [
        { name: 'Available', value: 'available' },
        { name: 'Disabled', value: 'disabled' },
        { name: 'Preorder', value: 'preorder' }
      ]
    },

    {
      name: 'productCategories',
      displayName: 'Category IDs',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['product'],
          productOperation: ['create', 'update']
        }
      },
      description: 'Comma-separated list of category IDs'
    },

    // Customer creation/update fields
    {
      name: 'customerEmail',
      displayName: 'Email',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'Customer email address'
    },

    {
      name: 'customerFirstName',
      displayName: 'First Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'Customer first name'
    },

    {
      name: 'customerLastName',
      displayName: 'Last Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'Customer last name'
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

    {
      name: 'customerCompany',
      displayName: 'Company',
      type: 'string',
      required: false,
      displayOptions: {
        show: { 
          resource: ['customer'],
          customerOperation: ['create', 'update']
        }
      },
      description: 'Customer company name'
    },

    // Order update fields
    {
      name: 'orderStatus',
      displayName: 'Status',
      type: 'options',
      required: false,
      description: 'The status to update the order to',
      displayOptions: {
        show: { 
          resource: ['order'],
          orderOperation: ['update']
        }
      },
      options: [
        { name: 'Pending', value: 'pending' },
        { name: 'Awaiting Payment', value: 'awaiting_payment' },
        { name: 'Awaiting Fulfillment', value: 'awaiting_fulfillment' },
        { name: 'Awaiting Shipment', value: 'awaiting_shipment' },
        { name: 'Awaiting Pickup', value: 'awaiting_pickup' },
        { name: 'Partially Shipped', value: 'partially_shipped' },
        { name: 'Shipped', value: 'shipped' },
        { name: 'Completed', value: 'completed' },
        { name: 'Cancelled', value: 'cancelled' },
        { name: 'Declined', value: 'declined' },
        { name: 'Refunded', value: 'refunded' },
        { name: 'Partially Refunded', value: 'partially_refunded' }
      ]
    },

    // Category creation/update fields
    {
      name: 'categoryName',
      displayName: 'Name',
      type: 'string',
      required: true,
      displayOptions: {
        show: { 
          resource: ['category'],
          categoryOperation: ['create', 'update']
        }
      },
      description: 'The category name'
    },

    {
      name: 'categoryDescription',
      displayName: 'Description',
      type: 'string',
      required: false,
      typeOptions: {
        rows: 3
    },
      displayOptions: {
        show: { 
          resource: ['category'],
          categoryOperation: ['create', 'update']
        }
      },
      description: 'The category description'
    },

    {
      name: 'categoryParentId',
      displayName: 'Parent Category ID',
      type: 'number',
      required: false,
      displayOptions: {
        show: { 
          resource: ['category'],
          categoryOperation: ['create', 'update']
        }
      },
      description: 'The parent category ID (for subcategories)'
    },

    // Filtering and search options
    {
      name: 'filters',
      displayName: 'Filters',
      type: 'collection',
      required: false,
      default: {},
      description: 'Optional filters to apply when retrieving multiple records',
      displayOptions: {
        show: { 
          operation: ['getAll']
        }
      },
      options: [
        {
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
          description: 'Filter by name (partial match)'
    },
        {
      name: 'sku',
      displayName: 'SKU',
      type: 'string',
      required: false,
      default: '',
          description: 'Filter by SKU'
    },
        {
      name: 'type',
      displayName: 'Type',
      type: 'options',
      required: false,
      default: '',
          options: [
            { name: 'All', value: ''
    },
            { name: 'Physical', value: 'physical' },
            { name: 'Digital', value: 'digital' }
          ]
        },
        {
      name: 'availability',
      displayName: 'Availability',
      type: 'options',
      required: false,
      default: '',
          options: [
            { name: 'All', value: ''
    },
            { name: 'Available', value: 'available' },
            { name: 'Disabled', value: 'disabled' },
            { name: 'Preorder', value: 'preorder' }
          ]
        },
        {
      name: 'categoryId',
      displayName: 'Category ID',
      type: 'number',
      required: false,
      default: '',
          description: 'Filter by category ID'
    },
        {
      name: 'minPrice',
      displayName: 'Minimum Price',
      type: 'number',
      required: false,
      default: '',
          description: 'Filter by minimum price'
    },
        {
      name: 'maxPrice',
      displayName: 'Maximum Price',
      type: 'number',
      required: false,
      default: '',
          description: 'Filter by maximum price'
    },
        {
      name: 'dateCreated',
      displayName: 'Date Created',
      type: 'string',
      required: false,
      default: '',
          description: 'Filter by creation date (ISO format)'
    },
        {
      name: 'dateModified',
      displayName: 'Date Modified',
      type: 'string',
      required: false,
      default: '',
          description: 'Filter by modification date (ISO format)'
    }
      ]
    },

    // Additional options
    {
      name: 'options',
      displayName: 'Additional Options',
      type: 'collection',
      required: false,
      default: {},
      description: 'Additional options for controlling the API request behavior',
      options: [
        {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
          description: 'Number of results to return'
    },
        {
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
      default: 1,
          description: 'Page number for pagination'
    },
        {
      name: 'sort',
      displayName: 'Sort By',
      type: 'options',
      required: false,
      default: 'date_created',
          options: [
            { name: 'Date Created', value: 'date_created'
    },
            { name: 'Date Modified', value: 'date_modified' },
            { name: 'Name', value: 'name' },
            { name: 'Price', value: 'price' },
            { name: 'SKU', value: 'sku' }
          ]
        },
        {
      name: 'direction',
      displayName: 'Sort Direction',
      type: 'options',
      required: false,
      default: 'desc',
          options: [
            { name: 'Ascending', value: 'asc'
    },
            { name: 'Descending', value: 'desc' }
          ]
        },
        {
      name: 'include',
      displayName: 'Include Fields',
      type: 'string',
      required: false,
      default: '',
          description: 'Comma-separated list of fields to include in response'
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
      description: 'BigCommerce API response data'
    }
  ],

  credentials: [
    {
      name: 'bigcommerceApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  version: [1],
  defaults: {
    name: 'BigCommerce'
  },

  aliases: ['ecommerce', 'online store', 'products', 'orders'],
  
  examples: [
    {
      name: 'Create Product',
      description: 'Create a new product in BigCommerce',
      workflow: {
        nodes: [
          {
            name: 'Create Product',
            type: 'n8n-nodes-base.bigcommerce',
            parameters: {
              storeHash: 'your_store_hash',
              resource: 'product',
              productOperation: 'create',
              productName: 'Premium T-Shirt',
              productDescription: 'High-quality cotton t-shirt with premium design',
              productType: 'physical',
              productPrice: 29.99,
              productWeight: 0.5,
              productSku: 'PREM-TSHIRT-001',
              productAvailability: 'available',
              productCategories: '23,45'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Orders',
      description: 'Retrieve all orders from BigCommerce',
      workflow: {
        nodes: [
          {
            name: 'Get Orders',
            type: 'n8n-nodes-base.bigcommerce',
            parameters: {
              storeHash: 'your_store_hash',
              resource: 'order',
              orderOperation: 'getAll',
              options: {
                limit: 25,
                sort: 'date_created',
                direction: 'desc'
              }
            }
          }
        ]
      }
    },
    {
      name: 'Update Order Status',
      description: 'Update the status of an existing order',
      workflow: {
        nodes: [
          {
            name: 'Update Order',
            type: 'n8n-nodes-base.bigcommerce',
            parameters: {
              storeHash: 'your_store_hash',
              resource: 'order',
              orderOperation: 'update',
              orderId: 12345,
              orderStatus: 'shipped'
            }
          }
        ]
      }
    },
    {
      name: 'Create Customer',
      description: 'Create a new customer in BigCommerce',
      workflow: {
        nodes: [
          {
            name: 'Create Customer',
            type: 'n8n-nodes-base.bigcommerce',
            parameters: {
              storeHash: 'your_store_hash',
              resource: 'customer',
              customerOperation: 'create',
              customerEmail: 'customer@example.com',
              customerFirstName: 'John',
              customerLastName: 'Doe',
              customerPhone: '555-123-4567',
              customerCompany: 'Acme Corporation'
            }
          }
        ]
      }
    },
    {
      name: 'Get Products by Category',
      description: 'Retrieve products filtered by category',
      workflow: {
        nodes: [
          {
            name: 'Get Category Products',
            type: 'n8n-nodes-base.bigcommerce',
            parameters: {
              storeHash: 'your_store_hash',
              resource: 'product',
              productOperation: 'getAll',
              filters: {
                categoryId: 23,
                availability: 'available'
              },
              options: {
                limit: 50,
                sort: 'name',
                direction: 'asc'
              }
            }
          }
        ]
      }
    }
  ]
};

export const bigcommerceTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.bigcommerceTrigger',
  displayName: 'BigCommerce Trigger',
  description: 'Triggers the workflow when events occur in BigCommerce, such as new orders, product updates, or customer registrations',
  category: 'Sales',
  subcategory: 'E-commerce',
  
  properties: [
    {
      name: 'storeHash',
      displayName: 'Store Hash',
      type: 'string',
      required: true,
      default: '',
      description: 'Your BigCommerce store hash (found in API settings)'
    },
    {
      name: 'event',
      displayName: 'Event',
      type: 'options',
      required: true,
      default: 'store/order/created',
      description: 'The event to listen for',
      options: [
        { name: 'Order Created', value: 'store/order/created' },
        { name: 'Order Updated', value: 'store/order/updated' },
        { name: 'Order Status Updated', value: 'store/order/statusUpdated' },
        { name: 'Product Created', value: 'store/product/created' },
        { name: 'Product Updated', value: 'store/product/updated' },
        { name: 'Product Deleted', value: 'store/product/deleted' },
        { name: 'Customer Created', value: 'store/customer/created' },
        { name: 'Customer Updated', value: 'store/customer/updated' },
        { name: 'Customer Deleted', value: 'store/customer/deleted' },
        { name: 'Category Created', value: 'store/category/created' },
        { name: 'Category Updated', value: 'store/category/updated' },
        { name: 'Category Deleted', value: 'store/category/deleted' },
        { name: 'Shipment Created', value: 'store/shipment/created' },
        { name: 'Shipment Updated', value: 'store/shipment/updated' }
      ]
    },
    {
      name: 'scope',
      displayName: 'Scope',
      type: 'string',
      required: false,
      default: '',
      description: 'Optional scope filter (e.g., specific resource ID)'
    }
  ],

  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when BigCommerce events occur'
    }
  ],

  credentials: [
    {
      name: 'bigcommerceApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  triggerNode: true,
  polling: false,
  webhookSupport: true,
  
  examples: [
    {
      name: 'Monitor New Orders',
      description: 'Trigger workflow when new orders are placed',
      workflow: {
        nodes: [
          {
            name: 'BigCommerce Trigger',
            type: 'n8n-nodes-base.bigcommerceTrigger',
            parameters: {
              storeHash: 'your_store_hash',
              event: 'store/order/created'
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Product Updates',
      description: 'Trigger when products are updated',
      workflow: {
        nodes: [
          {
            name: 'BigCommerce Trigger',
            type: 'n8n-nodes-base.bigcommerceTrigger',
            parameters: {
              storeHash: 'your_store_hash',
              event: 'store/product/updated'
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes
export const bigcommerceNodes: NodeTypeInfo[] = [bigcommerceNode, bigcommerceTriggerNode];

export default bigcommerceNode;