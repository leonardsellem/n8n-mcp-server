import { NodeTypeInfo } from '../node-types.js';

export const paddleNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.paddle',
  displayName: 'Paddle',
  description: 'Use the Paddle node to automate work in Paddle, and integrate Paddle with other applications. n8n has built-in support for a wide range of Paddle features, including creating, updating, and getting coupons, as well as getting plans, products, and users.',
  category: 'Finance & Accounting',
  subcategory: 'Payment Processing',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'coupon',
      description: 'The resource to operate on',
      options: [
        { name: 'Coupon', value: 'coupon', description: 'Work with discount coupons' },
        { name: 'Payment', value: 'payment', description: 'Manage payments' },
        { name: 'Plan', value: 'plan', description: 'Handle subscription plans' },
        { name: 'Product', value: 'product', description: 'Manage products' },
        { name: 'User', value: 'user', description: 'Handle users' }
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
        // Coupon operations
        { name: 'Create', value: 'create', description: 'Create a coupon' },
        { name: 'Get All', value: 'getAll', description: 'Get all coupons' },
        { name: 'Update', value: 'update', description: 'Update a coupon' },
        // Payment operations
        { name: 'Get All', value: 'getAll', description: 'Get all payment' },
        { name: 'Reschedule', value: 'reschedule', description: 'Reschedule payment' },
        // Plan operations
        { name: 'Get', value: 'get', description: 'Get a plan' },
        { name: 'Get All', value: 'getAll', description: 'Get all plans' },
        // Product operations
        { name: 'Get All', value: 'getAll', description: 'Get all products' },
        // User operations
        { name: 'Get All', value: 'getAll', description: 'Get all users' }
      ]
    },
    {
      name: 'couponCode',
      displayName: 'Coupon Code',
      type: 'string',
      required: false,
      default: '',
      description: 'The coupon code to create or update'
    },
    {
      name: 'couponType',
      displayName: 'Coupon Type',
      type: 'options',
      required: false,
      default: 'flat',
      description: 'The type of discount',
      options: [
        { name: 'Flat Amount', value: 'flat', description: 'Fixed amount discount' },
        { name: 'Percentage', value: 'percentage', description: 'Percentage discount' }
      ]
    },
    {
      name: 'discountAmount',
      displayName: 'Discount Amount',
      type: 'string',
      required: false,
      default: '',
      description: 'The discount amount (for flat) or percentage (for percentage)'
    },
    {
      name: 'currency',
      displayName: 'Currency',
      type: 'string',
      required: false,
      default: 'USD',
      description: 'The three-character currency code (for flat amount coupons)'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description of the coupon'
    },
    {
      name: 'expiresAt',
      displayName: 'Expires At',
      type: 'string',
      required: false,
      default: '',
      description: 'Expiration date for the coupon (YYYY-MM-DD format)'
    },
    {
      name: 'allowedUses',
      displayName: 'Allowed Uses',
      type: 'number',
      required: false,
      default: 1,
      description: 'Number of times the coupon can be used'
    },
    {
      name: 'paymentId',
      displayName: 'Payment ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the payment to operate on'
    },
    {
      name: 'planId',
      displayName: 'Plan ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the plan to retrieve'
    },
    {
      name: 'productId',
      displayName: 'Product ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the product to retrieve'
    },
    {
      name: 'userId',
      displayName: 'User ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the user to retrieve'
    },
    {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      required: false,
      default: '',
      description: 'User email address for filtering'
    },
    {
      name: 'subscriptionId',
      displayName: 'Subscription ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the subscription'
    },
    {
      name: 'newDate',
      displayName: 'New Date',
      type: 'string',
      required: false,
      default: '',
      description: 'New payment date for rescheduling (YYYY-MM-DD format)'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of results to return'
    },
    {
      name: 'offset',
      displayName: 'Offset',
      type: 'number',
      required: false,
      default: 0,
      description: 'Number of results to skip'
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
      description: 'The processed Paddle data'
    }
  ],
  credentials: ['paddle'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Coupon',
      description: 'Create a new discount coupon',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'coupon',
              operation: 'create',
              couponCode: 'SAVE10',
              couponType: 'percentage',
              discountAmount: '10',
              description: '10% off discount',
              allowedUses: 100,
              expiresAt: '2024-12-31'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Coupons',
      description: 'Retrieve all available coupons',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'coupon',
              operation: 'getAll',
              limit: 50
            }
          }
        ]
      }
    },
    {
      name: 'Update Coupon',
      description: 'Update an existing coupon',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'coupon',
              operation: 'update',
              couponCode: 'SAVE10',
              description: 'Updated 10% off discount',
              allowedUses: 200
            }
          }
        ]
      }
    },
    {
      name: 'Get All Payments',
      description: 'Retrieve all payments',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'payment',
              operation: 'getAll',
              limit: 100
            }
          }
        ]
      }
    },
    {
      name: 'Reschedule Payment',
      description: 'Reschedule a payment to a new date',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'payment',
              operation: 'reschedule',
              paymentId: 'PAYMENT_ID_HERE',
              newDate: '2024-07-01'
            }
          }
        ]
      }
    },
    {
      name: 'Get Plan Details',
      description: 'Get details of a specific plan',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'plan',
              operation: 'get',
              planId: 'PLAN_ID_HERE'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Plans',
      description: 'Retrieve all subscription plans',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'plan',
              operation: 'getAll'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Products',
      description: 'Retrieve all products',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'product',
              operation: 'getAll'
            }
          }
        ]
      }
    },
    {
      name: 'Get All Users',
      description: 'Retrieve all users',
      workflow: {
        nodes: [
          {
            name: 'Paddle',
            type: 'n8n-nodes-base.paddle',
            parameters: {
              resource: 'user',
              operation: 'getAll',
              limit: 50
            }
          }
        ]
      }
    }
  ]
};

// Export the node as an array for easier importing
export const paddleNodes: NodeTypeInfo[] = [paddleNode];

// Export individual actions for the Paddle node
export const paddleActions = [
  // Coupon actions
  'create_coupon',
  'get_all_coupons', 
  'update_coupon',
  // Payment actions
  'get_all_payments',
  'reschedule_payment',
  // Plan actions
  'get_plan',
  'get_all_plans',
  // Product actions
  'get_all_products',
  // User actions
  'get_all_users'
];