import { NodeTypeInfo } from '../accurate-massive-registry.js';

export const stripeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stripe',
  displayName: 'Stripe',
  description: 'Use the Stripe node to automate work in Stripe, and integrate Stripe with other applications. n8n has built-in support for a wide range of Stripe features, including getting balance, creating charges, and deleting customers.',
  category: 'Finance & Accounting',
  subcategory: 'Payment Processing',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'charge',
      description: 'The resource to operate on',
      options: [
        { name: 'Balance', value: 'balance', description: 'Work with account balance' },
        { name: 'Charge', value: 'charge', description: 'Handle payment charges' },
        { name: 'Coupon', value: 'coupon', description: 'Manage discount coupons' },
        { name: 'Customer', value: 'customer', description: 'Manage customers' },
        { name: 'Customer Card', value: 'customerCard', description: 'Manage customer payment methods' },
        { name: 'Source', value: 'source', description: 'Handle payment sources' },
        { name: 'Token', value: 'token', description: 'Create payment tokens' }
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
        // Balance operations
        { name: 'Get', value: 'get', description: 'Get account balance' },
        // Charge operations
        { name: 'Create', value: 'create', description: 'Create a new charge' },
        { name: 'Get', value: 'get', description: 'Get a charge' },
        { name: 'Update', value: 'update', description: 'Update a charge' },
        { name: 'Get All', value: 'getAll', description: 'Get all charges' },
        // Coupon operations
        { name: 'Create', value: 'create', description: 'Create a coupon' },
        { name: 'Get All', value: 'getAll', description: 'Get all coupons' },
        { name: 'Get', value: 'get', description: 'Get a coupon' },
        { name: 'Delete', value: 'delete', description: 'Delete a coupon' },
        // Customer operations
        { name: 'Create', value: 'create', description: 'Create a customer' },
        { name: 'Delete', value: 'delete', description: 'Delete a customer' },
        { name: 'Get', value: 'get', description: 'Get a customer' },
        { name: 'Get All', value: 'getAll', description: 'Get all customers' },
        { name: 'Update', value: 'update', description: 'Update a customer' },
        // Customer Card operations
        { name: 'Add', value: 'add', description: 'Add a customer card' },
        { name: 'Get', value: 'get', description: 'Get a customer card' },
        { name: 'Remove', value: 'remove', description: 'Remove a customer card' },
        // Source operations
        { name: 'Create', value: 'create', description: 'Create a source' },
        { name: 'Delete', value: 'delete', description: 'Delete a source' },
        { name: 'Get', value: 'get', description: 'Get a source' },
        // Token operations
        { name: 'Create', value: 'create', description: 'Create a token' }
      ]
    },
    {
      name: 'amount',
      displayName: 'Amount',
      type: 'number',
      required: false,
      default: 0,
      description: 'Amount to charge in cents'
    },
    {
      name: 'currency',
      displayName: 'Currency',
      type: 'string',
      required: false,
      default: 'USD',
      description: 'Three-letter ISO currency code'
    },
    {
      name: 'customerId',
      displayName: 'Customer ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the customer to operate on'
    },
    {
      name: 'chargeId',
      displayName: 'Charge ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the charge to operate on'
    },
    {
      name: 'sourceId',
      displayName: 'Source ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the payment source'
    },
    {
      name: 'tokenId',
      displayName: 'Token ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the token'
    },
    {
      name: 'couponId',
      displayName: 'Coupon ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the coupon'
    },
    {
      name: 'cardId',
      displayName: 'Card ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the card to operate on'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      required: false,
      default: '',
      description: 'Description for the operation'
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
      name: 'name',
      displayName: 'Name',
      type: 'string',
      required: false,
      default: '',
      description: 'Customer or item name'
    },
    {
      name: 'source',
      displayName: 'Source',
      type: 'string',
      required: false,
      default: '',
      description: 'Payment source (token, card, etc.)'
    },
    {
      name: 'receipt_email',
      displayName: 'Receipt Email',
      type: 'string',
      required: false,
      default: '',
      description: 'Email address to send receipt to'
    },
    {
      name: 'metadata',
      displayName: 'Metadata',
      type: 'string',
      required: false,
      default: '',
      description: 'JSON string of metadata key-value pairs'
    },
    {
      name: 'capture',
      displayName: 'Capture',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Whether to immediately capture the charge'
    },
    {
      name: 'limit',
      displayName: 'Limit',
      type: 'number',
      required: false,
      default: 100,
      description: 'Maximum number of results to return'
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
      description: 'The processed Stripe data'
    }
  ],
  credentials: ['stripeApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Charge',
      description: 'Create a new payment charge',
      workflow: {
        nodes: [
          {
            name: 'Stripe',
            type: 'n8n-nodes-base.stripe',
            parameters: {
              resource: 'charge',
              operation: 'create',
              amount: 2000,
              currency: 'USD',
              source: 'tok_visa',
              description: 'Test charge from n8n'
            }
          }
        ]
      }
    },
    {
      name: 'Create Customer',
      description: 'Create a new customer in Stripe',
      workflow: {
        nodes: [
          {
            name: 'Stripe',
            type: 'n8n-nodes-base.stripe',
            parameters: {
              resource: 'customer',
              operation: 'create',
              email: 'customer@example.com',
              name: 'John Doe',
              description: 'Customer created via n8n'
            }
          }
        ]
      }
    },
    {
      name: 'Get Balance',
      description: 'Get account balance from Stripe',
      workflow: {
        nodes: [
          {
            name: 'Stripe',
            type: 'n8n-nodes-base.stripe',
            parameters: {
              resource: 'balance',
              operation: 'get'
            }
          }
        ]
      }
    },
    {
      name: 'Create Coupon',
      description: 'Create a discount coupon',
      workflow: {
        nodes: [
          {
            name: 'Stripe',
            type: 'n8n-nodes-base.stripe',
            parameters: {
              resource: 'coupon',
              operation: 'create',
              couponId: 'SAVE20',
              name: '20% Off',
              description: 'Save 20% on your order'
            }
          }
        ]
      }
    }
  ]
};

export const stripeTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stripeTrigger',
  displayName: 'Stripe Trigger',
  description: 'Use the Stripe Trigger node to respond to events in Stripe and integrate Stripe with other applications. n8n has built-in support for a wide range of Stripe events, including new charges, customer updates, and payment failures.',
  category: 'Finance & Accounting',
  subcategory: 'Payment Processing',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['charge.succeeded'],
      description: 'The events to trigger on',
      options: [
        { name: 'Charge Failed', value: 'charge.failed', description: 'Triggered when a charge fails' },
        { name: 'Charge Succeeded', value: 'charge.succeeded', description: 'Triggered when a charge succeeds' },
        { name: 'Charge Updated', value: 'charge.updated', description: 'Triggered when a charge is updated' },
        { name: 'Customer Created', value: 'customer.created', description: 'Triggered when a customer is created' },
        { name: 'Customer Deleted', value: 'customer.deleted', description: 'Triggered when a customer is deleted' },
        { name: 'Customer Updated', value: 'customer.updated', description: 'Triggered when a customer is updated' },
        { name: 'Invoice Payment Failed', value: 'invoice.payment_failed', description: 'Triggered when an invoice payment fails' },
        { name: 'Invoice Payment Succeeded', value: 'invoice.payment_succeeded', description: 'Triggered when an invoice payment succeeds' },
        { name: 'Payment Intent Succeeded', value: 'payment_intent.succeeded', description: 'Triggered when a payment intent succeeds' },
        { name: 'Payment Intent Failed', value: 'payment_intent.payment_failed', description: 'Triggered when a payment intent fails' },
        { name: 'Subscription Created', value: 'customer.subscription.created', description: 'Triggered when a subscription is created' },
        { name: 'Subscription Updated', value: 'customer.subscription.updated', description: 'Triggered when a subscription is updated' },
        { name: 'Subscription Deleted', value: 'customer.subscription.deleted', description: 'Triggered when a subscription is deleted' }
      ]
    },
    {
      name: 'endpoint',
      displayName: 'Webhook Endpoint',
      type: 'string',
      required: false,
      default: '',
      description: 'The webhook endpoint URL (automatically generated)'
    }
  ],
  inputs: [],
  outputs: [
    {
      type: 'main',
      displayName: 'Output',
      description: 'Triggers when Stripe events occur'
    }
  ],
  credentials: ['stripeApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Successful Payments',
      description: 'Trigger workflow when charges succeed',
      workflow: {
        nodes: [
          {
            name: 'Stripe Trigger',
            type: 'n8n-nodes-base.stripeTrigger',
            parameters: {
              events: ['charge.succeeded']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Customer Events',
      description: 'Trigger when customers are created or updated',
      workflow: {
        nodes: [
          {
            name: 'Stripe Trigger',
            type: 'n8n-nodes-base.stripeTrigger',
            parameters: {
              events: ['customer.created', 'customer.updated']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Payment Failures',
      description: 'Trigger when charges or payment intents fail',
      workflow: {
        nodes: [
          {
            name: 'Stripe Trigger',
            type: 'n8n-nodes-base.stripeTrigger',
            parameters: {
              events: ['charge.failed', 'payment_intent.payment_failed']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Subscription Changes',
      description: 'Trigger when subscriptions are created, updated, or deleted',
      workflow: {
        nodes: [
          {
            name: 'Stripe Trigger',
            type: 'n8n-nodes-base.stripeTrigger',
            parameters: {
              events: ['customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted']
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const stripeNodes: NodeTypeInfo[] = [stripeNode, stripeTriggerNode];

// Export individual actions for the regular Stripe node
export const stripeActions = [
  // Balance actions
  'get_balance',
  // Charge actions
  'create_charge',
  'get_charge',
  'update_charge',
  'get_all_charges',
  // Coupon actions
  'create_coupon',
  'get_all_coupons',
  'get_coupon',
  'delete_coupon',
  // Customer actions
  'create_customer',
  'delete_customer',
  'get_customer',
  'get_all_customers',
  'update_customer',
  // Customer Card actions
  'add_customer_card',
  'get_customer_card',
  'remove_customer_card',
  // Source actions
  'create_source',
  'delete_source',
  'get_source',
  // Token actions
  'create_token'
];

// Export trigger events
export const stripeTriggers = [
  'charge_failed',
  'charge_succeeded',
  'charge_updated',
  'customer_created',
  'customer_deleted',
  'customer_updated',
  'invoice_payment_failed',
  'invoice_payment_succeeded',
  'payment_intent_succeeded',
  'payment_intent_failed',
  'subscription_created',
  'subscription_updated',
  'subscription_deleted'
];