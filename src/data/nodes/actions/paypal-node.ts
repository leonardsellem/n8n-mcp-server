import { NodeTypeInfo } from '../../node-types.js';

export const paypalNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.paypal',
  displayName: 'PayPal',
  description: 'Use the PayPal node to automate work in PayPal, and integrate PayPal with other applications. n8n has built-in support for a wide range of PayPal features, including creating a batch payout and canceling unclaimed payout items.',
  category: 'Finance & Accounting',
  subcategory: 'Payment Processing',
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'payout',
      description: 'The resource to operate on',
      options: [
        { name: 'Payout', value: 'payout', description: 'Work with payouts' },
        { name: 'Payout Item', value: 'payoutItem', description: 'Manage payout items' }
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
        // Payout operations
        { name: 'Create', value: 'create', description: 'Create a batch payout' },
        { name: 'Get', value: 'get', description: 'Show batch payout details' },
        // Payout Item operations
        { name: 'Cancel', value: 'cancel', description: 'Cancels an unclaimed payout item' },
        { name: 'Get', value: 'get', description: 'Get payout item details' }
      ]
    },
    {
      name: 'payoutBatchId',
      displayName: 'Payout Batch ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the payout batch'
    },
    {
      name: 'payoutItemId',
      displayName: 'Payout Item ID',
      type: 'string',
      required: false,
      default: '',
      description: 'The ID of the payout item'
    },
    {
      name: 'senderBatchId',
      displayName: 'Sender Batch ID',
      type: 'string',
      required: false,
      default: '',
      description: 'A sender-specified ID number for tracking the batch payout'
    },
    {
      name: 'emailSubject',
      displayName: 'Email Subject',
      type: 'string',
      required: false,
      default: '',
      description: 'The subject line for the email sent to recipients'
    },
    {
      name: 'emailMessage',
      displayName: 'Email Message',
      type: 'string',
      required: false,
      default: '',
      description: 'The email message sent to recipients'
    },
    {
      name: 'recipientType',
      displayName: 'Recipient Type',
      type: 'options',
      required: false,
      default: 'EMAIL',
      description: 'The recipient type for payout items',
      options: [
        { name: 'Email', value: 'EMAIL', description: 'Send to email address' },
        { name: 'Phone', value: 'PHONE', description: 'Send to phone number' },
        { name: 'PayPal ID', value: 'PAYPAL_ID', description: 'Send to PayPal ID' }
      ]
    },
    {
      name: 'amount',
      displayName: 'Amount',
      type: 'string',
      required: false,
      default: '',
      description: 'The payout amount (e.g., "50.00")'
    },
    {
      name: 'currency',
      displayName: 'Currency',
      type: 'string',
      required: false,
      default: 'USD',
      description: 'The three-character ISO-4217 currency code'
    },
    {
      name: 'receiver',
      displayName: 'Receiver',
      type: 'string',
      required: false,
      default: '',
      description: 'The recipient email, phone, or PayPal ID'
    },
    {
      name: 'senderItemId',
      displayName: 'Sender Item ID',
      type: 'string',
      required: false,
      default: '',
      description: 'A sender-specified ID number for the payout item'
    },
    {
      name: 'note',
      displayName: 'Note',
      type: 'string',
      required: false,
      default: '',
      description: 'A note to the recipient about the payout'
    },
    {
      name: 'fields',
      displayName: 'Fields',
      type: 'multiOptions',
      required: false,
      default: [],
      description: 'List of fields to be returned in response',
      options: [
        { name: 'Batch Header', value: 'batch_header' },
        { name: 'Items', value: 'items' },
        { name: 'Links', value: 'links' },
        { name: 'Errors', value: 'errors' }
      ]
    },
    {
      name: 'page',
      displayName: 'Page',
      type: 'number',
      required: false,
      default: 1,
      description: 'The page number to retrieve'
    },
    {
      name: 'pageSize',
      displayName: 'Page Size',
      type: 'number',
      required: false,
      default: 25,
      description: 'The number of items to return per page'
    },
    {
      name: 'totalRequired',
      displayName: 'Total Required',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Indicates whether to show the total count in the response'
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
      description: 'The processed PayPal data'
    }
  ],
  credentials: ['paypalApi'],
  regularNode: true,
  codeable: false,
  examples: [
    {
      name: 'Create Batch Payout',
      description: 'Create a new batch payout to multiple recipients',
      workflow: {
        nodes: [
          {
            name: 'PayPal',
            type: 'n8n-nodes-base.paypal',
            parameters: {
              resource: 'payout',
              operation: 'create',
              senderBatchId: 'batch_001',
              emailSubject: 'You have a payout!',
              emailMessage: 'You have received a payout from our company.',
              recipientType: 'EMAIL',
              amount: '50.00',
              currency: 'USD',
              receiver: 'recipient@example.com',
              senderItemId: 'item_001',
              note: 'Payment for services'
            }
          }
        ]
      }
    },
    {
      name: 'Get Payout Details',
      description: 'Get details of a specific batch payout',
      workflow: {
        nodes: [
          {
            name: 'PayPal',
            type: 'n8n-nodes-base.paypal',
            parameters: {
              resource: 'payout',
              operation: 'get',
              payoutBatchId: 'BATCH_ID_HERE',
              fields: ['batch_header', 'items']
            }
          }
        ]
      }
    },
    {
      name: 'Cancel Payout Item',
      description: 'Cancel an unclaimed payout item',
      workflow: {
        nodes: [
          {
            name: 'PayPal',
            type: 'n8n-nodes-base.paypal',
            parameters: {
              resource: 'payoutItem',
              operation: 'cancel',
              payoutItemId: 'ITEM_ID_HERE'
            }
          }
        ]
      }
    },
    {
      name: 'Get Payout Item Details',
      description: 'Get details of a specific payout item',
      workflow: {
        nodes: [
          {
            name: 'PayPal',
            type: 'n8n-nodes-base.paypal',
            parameters: {
              resource: 'payoutItem',
              operation: 'get',
              payoutItemId: 'ITEM_ID_HERE'
            }
          }
        ]
      }
    }
  ]
};

export const paypalTriggerNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.paypalTrigger',
  displayName: 'PayPal Trigger',
  description: 'Use the PayPal Trigger node to respond to events in PayPal and integrate PayPal with other applications. n8n has built-in support for a wide range of PayPal events, including billing plan activations, payment completions, and dispute notifications.',
  category: 'Finance & Accounting',
  subcategory: 'Payment Processing',
  properties: [
    {
      name: 'events',
      displayName: 'Events',
      type: 'multiOptions',
      required: true,
      default: ['PAYMENT.CAPTURE.COMPLETED'],
      description: 'The events to trigger on',
      options: [
        { name: 'Billing Plan Activated', value: 'BILLING.PLAN.ACTIVATED', description: 'Triggered when a billing plan is activated' },
        { name: 'Billing Plan Created', value: 'BILLING.PLAN.CREATED', description: 'Triggered when a billing plan is created' },
        { name: 'Billing Plan Updated', value: 'BILLING.PLAN.UPDATED', description: 'Triggered when a billing plan is updated' },
        { name: 'Billing Subscription Activated', value: 'BILLING.SUBSCRIPTION.ACTIVATED', description: 'Triggered when a subscription is activated' },
        { name: 'Billing Subscription Cancelled', value: 'BILLING.SUBSCRIPTION.CANCELLED', description: 'Triggered when a subscription is cancelled' },
        { name: 'Billing Subscription Created', value: 'BILLING.SUBSCRIPTION.CREATED', description: 'Triggered when a subscription is created' },
        { name: 'Billing Subscription Suspended', value: 'BILLING.SUBSCRIPTION.SUSPENDED', description: 'Triggered when a subscription is suspended' },
        { name: 'Billing Subscription Updated', value: 'BILLING.SUBSCRIPTION.UPDATED', description: 'Triggered when a subscription is updated' },
        { name: 'Checkout Order Approved', value: 'CHECKOUT.ORDER.APPROVED', description: 'Triggered when a checkout order is approved' },
        { name: 'Checkout Order Completed', value: 'CHECKOUT.ORDER.COMPLETED', description: 'Triggered when a checkout order is completed' },
        { name: 'Customer Dispute Created', value: 'CUSTOMER.DISPUTE.CREATED', description: 'Triggered when a dispute is created' },
        { name: 'Customer Dispute Resolved', value: 'CUSTOMER.DISPUTE.RESOLVED', description: 'Triggered when a dispute is resolved' },
        { name: 'Customer Dispute Updated', value: 'CUSTOMER.DISPUTE.UPDATED', description: 'Triggered when a dispute is updated' },
        { name: 'Payment Authorization Created', value: 'PAYMENT.AUTHORIZATION.CREATED', description: 'Triggered when a payment authorization is created' },
        { name: 'Payment Authorization Voided', value: 'PAYMENT.AUTHORIZATION.VOIDED', description: 'Triggered when a payment authorization is voided' },
        { name: 'Payment Capture Completed', value: 'PAYMENT.CAPTURE.COMPLETED', description: 'Triggered when a payment capture is completed' },
        { name: 'Payment Capture Denied', value: 'PAYMENT.CAPTURE.DENIED', description: 'Triggered when a payment capture is denied' },
        { name: 'Payment Capture Pending', value: 'PAYMENT.CAPTURE.PENDING', description: 'Triggered when a payment capture is pending' },
        { name: 'Payment Capture Refunded', value: 'PAYMENT.CAPTURE.REFUNDED', description: 'Triggered when a payment capture is refunded' },
        { name: 'Payment Capture Reversed', value: 'PAYMENT.CAPTURE.REVERSED', description: 'Triggered when a payment capture is reversed' },
        { name: 'Payments Payment Created', value: 'PAYMENTS.PAYMENT.CREATED', description: 'Triggered when a payment is created' }
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
      description: 'Triggers when PayPal events occur'
    }
  ],
  credentials: ['paypalApi'],
  triggerNode: true,
  polling: false,
  webhookSupport: true,
  examples: [
    {
      name: 'Monitor Payment Completions',
      description: 'Trigger workflow when payments are completed',
      workflow: {
        nodes: [
          {
            name: 'PayPal Trigger',
            type: 'n8n-nodes-base.paypalTrigger',
            parameters: {
              events: ['PAYMENT.CAPTURE.COMPLETED']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Subscription Events',
      description: 'Trigger when subscriptions are created, activated, or cancelled',
      workflow: {
        nodes: [
          {
            name: 'PayPal Trigger',
            type: 'n8n-nodes-base.paypalTrigger',
            parameters: {
              events: ['BILLING.SUBSCRIPTION.CREATED', 'BILLING.SUBSCRIPTION.ACTIVATED', 'BILLING.SUBSCRIPTION.CANCELLED']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Dispute Activities',
      description: 'Trigger when customer disputes are created or updated',
      workflow: {
        nodes: [
          {
            name: 'PayPal Trigger',
            type: 'n8n-nodes-base.paypalTrigger',
            parameters: {
              events: ['CUSTOMER.DISPUTE.CREATED', 'CUSTOMER.DISPUTE.UPDATED', 'CUSTOMER.DISPUTE.RESOLVED']
            }
          }
        ]
      }
    },
    {
      name: 'Monitor Order Events',
      description: 'Trigger when checkout orders are approved or completed',
      workflow: {
        nodes: [
          {
            name: 'PayPal Trigger',
            type: 'n8n-nodes-base.paypalTrigger',
            parameters: {
              events: ['CHECKOUT.ORDER.APPROVED', 'CHECKOUT.ORDER.COMPLETED']
            }
          }
        ]
      }
    }
  ]
};

// Export both nodes as an array for easier importing
export const paypalNodes: NodeTypeInfo[] = [paypalNode, paypalTriggerNode];

// Export individual actions for the regular PayPal node
export const paypalActions = [
  // Payout actions
  'create_payout',
  'get_payout',
  // Payout Item actions
  'cancel_payout_item',
  'get_payout_item'
];

// Export trigger events
export const paypalTriggers = [
  'billing_plan_activated',
  'billing_plan_created',
  'billing_plan_updated',
  'billing_subscription_activated',
  'billing_subscription_cancelled',
  'billing_subscription_created',
  'billing_subscription_suspended',
  'billing_subscription_updated',
  'checkout_order_approved',
  'checkout_order_completed',
  'customer_dispute_created',
  'customer_dispute_resolved',
  'customer_dispute_updated',
  'payment_authorization_created',
  'payment_authorization_voided',
  'payment_capture_completed',
  'payment_capture_denied',
  'payment_capture_pending',
  'payment_capture_refunded',
  'payment_capture_reversed',
  'payments_payment_created'
];