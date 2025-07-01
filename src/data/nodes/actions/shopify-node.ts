/**
 * # Shopify
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: E-commerce & Sales
 * 
 * ## Description
 * 
 * Use the Shopify node to automate work in Shopify, and integrate Shopify with other applications. 
 * n8n has built-in support for a wide range of Shopify features, including creating, updating, 
 * deleting, and getting orders and products.
 * 
 * ## Key Features
 * 
 * - **Order Management**: Complete order lifecycle management and processing
 * - **Product Management**: Comprehensive product catalog and inventory control
 * - **Customer Management**: Handle customer data and relationships
 * - **Inventory Tracking**: Real-time inventory updates and stock management
 * - **Multi-channel Sales**: Sync across online store, POS, and marketplace channels
 * - **Payment Processing**: Integration with multiple payment gateways
 * - **Shipping Integration**: Connect with shipping carriers and fulfillment services
 * - **Tax Management**: Automated tax calculation and compliance
 * - **Analytics Integration**: Connect sales data with business intelligence tools
 * - **Multi-store Support**: Manage multiple Shopify stores from one workflow
 * - **Webhook Integration**: Real-time notifications for store events
 * - **App Ecosystem**: Integration with Shopify's extensive app marketplace
 * 
 * ## Credentials
 * 
 * Refer to [Shopify credentials](../../credentials/shopify/) for guidance on setting up authentication.
 * Uses Shopify Admin API with private app credentials or OAuth for secure store access.
 * 
 * ## Operations by Resource
 * 
 * ### Order Operations
 * - **Create Order**: Create new orders programmatically
 *   - Manual order creation for phone/email sales
 *   - Custom pricing and discount application
 *   - Multiple payment method support
 *   - Customer assignment and billing information
 *   - Shipping address and delivery options
 *   - Order notes and custom attributes
 * - **Get Order**: Retrieve specific order details by ID
 *   - Complete order information including line items
 *   - Customer details and contact information
 *   - Payment status and transaction history
 *   - Fulfillment status and tracking numbers
 *   - Shipping and billing addresses
 *   - Applied discounts and tax calculations
 * - **Get All Orders**: List and filter orders with advanced criteria
 *   - Filter by date range, status, or customer
 *   - Search by order number or customer email
 *   - Sort by creation date, total amount, or fulfillment status
 *   - Pagination for large order volumes
 *   - Export order data for reporting and analysis
 * - **Update Order**: Modify existing order details
 *   - Update customer information and addresses
 *   - Modify line items and quantities
 *   - Change shipping methods and costs
 *   - Add order notes and tags
 *   - Update fulfillment and payment status
 * - **Delete Order**: Remove orders from the system
 *   - Permanently delete draft or cancelled orders
 *   - Handle refunds and cancellations
 *   - Maintain order history for compliance
 * 
 * ### Product Operations
 * - **Create Product**: Add new products to the catalog
 *   - Product title, description, and SEO metadata
 *   - Multiple product variants (size, color, etc.)
 *   - Pricing, cost, and profit margin tracking
 *   - Inventory tracking and stock levels
 *   - Product images and media gallery
 *   - Product categories and collections
 *   - Vendor and supplier information
 * - **Get Product**: Retrieve specific product information by ID
 *   - Complete product details and specifications
 *   - All product variants and their attributes
 *   - Current inventory levels and locations
 *   - Pricing history and cost information
 *   - Product images and media assets
 *   - SEO settings and search optimization
 * - **Get All Products**: List and search the entire product catalog
 *   - Filter by product type, vendor, or collection
 *   - Search by title, description, or SKU
 *   - Sort by creation date, price, or inventory
 *   - Bulk export for catalog management
 *   - Inventory reports and stock analysis
 * - **Update Product**: Modify existing product information
 *   - Update product details and descriptions
 *   - Modify pricing and cost information
 *   - Change inventory levels and tracking
 *   - Update product images and media
 *   - Modify SEO settings and metadata
 *   - Reorganize product collections and categories
 * - **Delete Product**: Remove products from the catalog
 *   - Archive discontinued products
 *   - Handle product lifecycle management
 *   - Maintain sales history for deleted products
 * 
 * ## Advanced E-commerce Features
 * 
 * ### Order Processing
 * - **Order Fulfillment**: Automate fulfillment workflows
 * - **Shipping Calculation**: Real-time shipping rates and options
 * - **Tax Management**: Automatic tax calculation by location
 * - **Payment Processing**: Multiple payment gateway integration
 * - **Order Tracking**: Customer communication and status updates
 * 
 * ### Product Management
 * - **Inventory Sync**: Real-time inventory across channels
 * - **Variant Management**: Handle product options and combinations
 * - **Pricing Rules**: Dynamic pricing and promotional strategies
 * - **Product Collections**: Organize products into categories
 * - **SEO Optimization**: Search engine optimization tools
 * 
 * ### Customer Experience
 * - **Customer Profiles**: Detailed customer information and history
 * - **Loyalty Programs**: Integration with reward and loyalty systems
 * - **Personalization**: Customized shopping experiences
 * - **Reviews and Ratings**: Product feedback and social proof
 * - **Wishlist Management**: Customer saved items and preferences
 * 
 * ### Analytics and Reporting
 * - **Sales Analytics**: Revenue, conversion, and performance metrics
 * - **Inventory Reports**: Stock levels, turnover, and forecasting
 * - **Customer Insights**: Behavior analysis and segmentation
 * - **Product Performance**: Best sellers and slow-moving inventory
 * - **Financial Reports**: Profit margins and cost analysis
 * 
 * ## Related Resources
 * 
 * Refer to Shopify's Admin API documentation for more information about the service.
 * n8n provides trigger nodes for Shopify to receive webhook notifications about store events.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Shopify Admin API directly with your Shopify credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include API rate limits, webhook handling, and inventory synchronization.
 * 
 * ## Use Cases
 * 
 * - **Order Processing Automation**: Automate order fulfillment and customer notifications
 * - **Inventory Management**: Sync inventory across multiple sales channels
 * - **Customer Service Integration**: Connect orders with support ticketing systems
 * - **Marketing Automation**: Trigger campaigns based on purchase behavior
 * - **Accounting Integration**: Sync sales data with accounting and ERP systems
 * - **Shipping Automation**: Automate label creation and tracking updates
 * - **Product Feed Management**: Export products to marketplaces and advertising platforms
 * - **Analytics and Reporting**: Generate custom sales and inventory reports
 * - **Dropshipping Automation**: Automate supplier order placement and tracking
 * - **Multi-store Management**: Sync data between multiple Shopify stores
 * - **Price Monitoring**: Track competitor pricing and adjust automatically
 * - **Seasonal Campaigns**: Automate holiday and promotional inventory management
 * - **Subscription Management**: Handle recurring orders and subscription billing
 * - **Return Processing**: Automate return authorization and refund processing
 * - **Loyalty Program Integration**: Sync customer rewards and point systems
 * - **Social Media Integration**: Share new products across social platforms
 * - **Email Marketing**: Trigger abandoned cart and post-purchase campaigns
 * - **Review Management**: Collect and manage customer product reviews
 * - **Fraud Prevention**: Integrate with fraud detection and prevention systems
 * - **B2B Wholesale**: Manage wholesale pricing and bulk order processing
 * - **International Sales**: Handle multi-currency and international shipping
 * - **Product Bundling**: Create and manage product bundles and kits
 * - **Flash Sales**: Automate limited-time offers and inventory allocation
 * - **Vendor Management**: Coordinate with suppliers and dropship partners
 * - **Quality Control**: Track product defects and quality metrics
 */

import { NodeTypeInfo } from '../../node-types.js';

export const shopifyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.shopify',
  displayName: 'Shopify',
  description: 'Manage orders, products, and customers in your Shopify store.',
  category: 'Action Nodes',
  subcategory: 'E-commerce & Sales',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'order',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Order',
          value: 'order',
          description: 'Work with orders'
        },
        {
          name: 'Product',
          value: 'product',
          description: 'Work with products'
        }
      ]
    },
    {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'get',
      description: 'Operation to perform',
      options: [
        {
          name: 'Create',
          value: 'create',
          description: 'Create a new record'
        },
        {
          name: 'Get',
          value: 'get',
          description: 'Get a record by ID'
        },
        {
          name: 'Get All',
          value: 'getAll',
          description: 'Get all records'
        },
        {
          name: 'Update',
          value: 'update',
          description: 'Update an existing record'
        },
        {
          name: 'Delete',
          value: 'delete',
          description: 'Delete a record'
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

  credentials: [
    {
      name: 'shopifyApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Shopify'
  },

  aliases: ['ecommerce', 'store', 'products', 'orders', 'retail'],
  
  examples: [
    {
      name: 'Get All Orders',
      description: 'Retrieve all orders from Shopify store',
      workflow: {
        nodes: [
          {
            name: 'Shopify',
            type: 'n8n-nodes-base.shopify',
            parameters: {
              resource: 'order',
              operation: 'getAll',
              returnAll: true
            }
          }
        ]
      }
    }
  ]
};

export default shopifyNode;
