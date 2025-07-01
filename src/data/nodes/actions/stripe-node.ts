/**
 * # Stripe
 * 
 * **Status**: ✅ Active
 * **Category**: Action Nodes
 * **Subcategory**: Payments & E-commerce
 * 
 * ## Description
 * 
 * Use the Stripe node to automate work in Stripe, and integrate Stripe with other applications. 
 * n8n has built-in support for a wide range of Stripe features, including getting balance, 
 * creating charges, managing customers, and handling payment methods.
 * 
 * ## Key Features
 * 
 * - **Payment Processing**: Create and manage charges, payments, and transactions
 * - **Customer Management**: Complete customer lifecycle management and payment methods
 * - **Balance Management**: Monitor account balance and transaction history
 * - **Coupon & Discount Management**: Create and manage promotional codes and discounts
 * - **Payment Method Management**: Handle cards, sources, and payment tokens securely
 * - **Subscription Support**: Manage recurring billing and subscription payments
 * - **Webhook Integration**: Receive real-time notifications about payment events
 * - **Multi-currency Support**: Process payments in multiple currencies worldwide
 * - **Fraud Prevention**: Built-in fraud detection and prevention mechanisms
 * - **PCI Compliance**: Secure payment processing with PCI DSS compliance
 * - **Mobile Payments**: Support for mobile wallets and contactless payments
 * - **International Markets**: Global payment processing with local payment methods
 * 
 * ## Credentials
 * 
 * Refer to [Stripe credentials](../../credentials/stripe/) for guidance on setting up authentication.
 * Uses Stripe API keys (secret keys) for secure access to your Stripe account.
 * 
 * ## Operations by Resource
 * 
 * ### Balance Operations
 * - **Get Balance**: Retrieve current account balance and available funds
 *   - View available balance by currency
 *   - Check pending balance from recent transactions
 *   - Monitor connect account balances
 *   - Track reserve balances and holds
 * 
 * ### Charge Operations
 * - **Create Charge**: Process one-time payments and charges
 *   - Accept credit cards, debit cards, and digital wallets
 *   - Set custom amounts and currency
 *   - Add metadata and description for tracking
 *   - Handle 3D Secure authentication
 * - **Get Charge**: Retrieve specific charge details by ID
 *   - Access payment status and transaction details
 *   - View dispute and refund information
 *   - Check fraud detection results
 * - **Get All Charges**: List and filter all charges
 *   - Filter by date range, customer, or status
 *   - Paginate through large transaction volumes
 *   - Export transaction data for reporting
 * - **Update Charge**: Modify charge metadata and details
 *   - Update description and metadata
 *   - Add shipping and receipt information
 *   - Modify fraud detection settings
 * 
 * ### Customer Operations
 * - **Create Customer**: Add new customers to your Stripe account
 *   - Store customer contact information
 *   - Set default payment methods
 *   - Add custom metadata and tags
 *   - Configure tax information
 * - **Get Customer**: Retrieve specific customer information by ID
 *   - Access customer profile and payment history
 *   - View attached payment methods
 *   - Check subscription status
 * - **Get All Customers**: List and search all customers
 *   - Filter by creation date or metadata
 *   - Search by email or name
 *   - Export customer databases
 * - **Update Customer**: Modify existing customer information
 *   - Update contact details and preferences
 *   - Change default payment methods
 *   - Modify subscription settings
 * - **Delete Customer**: Remove customers from your account
 *   - Safely delete customer data
 *   - Handle data privacy compliance
 *   - Archive transaction history
 * 
 * ### Customer Card Operations
 * - **Add Customer Card**: Attach payment methods to customers
 *   - Add credit cards, debit cards, and bank accounts
 *   - Set default payment methods
 *   - Verify card information
 * - **Get Customer Card**: Retrieve specific payment method details
 *   - Access card brand, last 4 digits, and expiry
 *   - Check verification status
 *   - View usage history
 * - **Remove Customer Card**: Delete payment methods from customers
 *   - Safely remove expired or invalid cards
 *   - Handle payment method updates
 *   - Maintain payment history
 * 
 * ### Coupon Operations
 * - **Create Coupon**: Create promotional codes and discounts
 *   - Set percentage or fixed amount discounts
 *   - Configure usage limits and expiration dates
 *   - Create one-time or recurring discounts
 * - **Get All Coupons**: List and manage all promotional codes
 *   - View active and expired coupons
 *   - Track usage statistics
 *   - Export coupon performance data
 * 
 * ### Source Operations
 * - **Create Source**: Generate payment sources for various methods
 *   - Support ACH, SEPA, and other bank transfers
 *   - Handle alternative payment methods
 *   - Create reusable payment sources
 * - **Get Source**: Retrieve source details and status
 *   - Check payment method verification
 *   - Monitor transaction status
 *   - Access source metadata
 * - **Delete Source**: Remove payment sources
 *   - Clean up unused payment methods
 *   - Handle customer payment updates
 *   - Maintain security compliance
 * 
 * ### Token Operations
 * - **Create Token**: Generate secure payment tokens
 *   - Tokenize credit card information
 *   - Create bank account tokens
 *   - Generate one-time use tokens for security
 * 
 * ## Security Features
 * 
 * - **PCI DSS Compliance**: Stripe handles all PCI compliance requirements
 * - **Tokenization**: Secure card data with tokenization
 * - **3D Secure**: Strong customer authentication for European regulations
 * - **Fraud Detection**: Machine learning-powered fraud prevention
 * - **Encryption**: End-to-end encryption for all sensitive data
 * 
 * ## Related Resources
 * 
 * Refer to Stripe's API documentation for more information about the service.
 * n8n provides trigger nodes for Stripe to receive webhook notifications about payment events.
 * 
 * ## Custom API Operations
 * 
 * If this node doesn't support the operation you want to do, you can use the HTTP Request node 
 * to call the Stripe API directly with your Stripe credentials.
 * 
 * ## Common Issues & Solutions
 * 
 * For common errors or issues and suggested resolution steps, refer to the Common Issues documentation.
 * Common challenges include webhook handling, payment method validation, and currency conversion.
 * 
 * ## Use Cases
 * 
 * - **E-commerce Payment Processing**: Accept payments for online stores and marketplaces
 * - **Subscription Billing**: Automate recurring billing for SaaS and membership sites
 * - **Invoice Automation**: Generate and send invoices with payment links
 * - **Donation Processing**: Handle charitable donations and fundraising campaigns
 * - **Event Ticketing**: Process payments for events, conferences, and workshops
 * - **Marketplace Payments**: Facilitate payments between buyers and sellers
 * - **Mobile App Monetization**: Handle in-app purchases and premium features
 * - **Freelancer Payments**: Process payments for gig work and professional services
 * - **Course Sales**: Sell online courses and educational content
 * - **Product Pre-orders**: Handle pre-order payments and inventory management
 * - **Refund Management**: Automate refund processing and customer service
 * - **Payment Analytics**: Track revenue, conversion rates, and payment trends
 * - **Customer Retention**: Manage failed payments and dunning management
 * - **Tax Calculation**: Automatically calculate and collect taxes
 * - **Multi-tenant Platforms**: Handle payments for platform businesses
 * - **International Expansion**: Process payments in multiple currencies and regions
 * - **Fraud Prevention**: Monitor and prevent fraudulent transactions
 * - **Compliance Management**: Ensure PCI DSS and regulatory compliance
 * - **Financial Reporting**: Generate detailed financial reports and analytics
 * - **Customer Support**: Handle payment disputes and customer inquiries
 */

import { NodeTypeInfo } from '../../node-types.js';

export const stripeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.stripe',
  displayName: 'Stripe',
  description: 'Process payments, manage customers, and handle financial transactions with Stripe.',
  category: 'Action Nodes',
  subcategory: 'Payments & E-commerce',
  
  properties: [
    {
      name: 'resource',
      displayName: 'Resource',
      type: 'options',
      required: true,
      default: 'charge',
      description: 'Resource to operate on',
      options: [
        {
          name: 'Balance',
          value: 'balance',
          description: 'Work with account balance'
        },
        {
          name: 'Charge',
          value: 'charge',
          description: 'Work with charges and payments'
        },
        {
          name: 'Customer',
          value: 'customer',
          description: 'Work with customers'
        },
        {
          name: 'Customer Card',
          value: 'customerCard',
          description: 'Work with customer payment methods'
        },
        {
          name: 'Coupon',
          value: 'coupon',
          description: 'Work with coupons and discounts'
        },
        {
          name: 'Source',
          value: 'source',
          description: 'Work with payment sources'
        },
        {
          name: 'Token',
          value: 'token',
          description: 'Work with payment tokens'
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
      name: 'stripeApi',
      required: true
    }
  ],

  version: [1, 2],
  defaults: {
    name: 'Stripe'
  },

  aliases: ['payments', 'billing', 'ecommerce', 'transactions'],
  
  examples: [
    {
      name: 'Create Charge',
      description: 'Process a payment with Stripe',
      workflow: {
        nodes: [
          {
            name: 'Stripe',
            type: 'n8n-nodes-base.stripe',
            parameters: {
              resource: 'charge',
              operation: 'create',
              amount: 2000,
              currency: 'usd',
              source: 'tok_visa',
              description: 'Test payment'
            }
          }
        ]
      }
    }
  ]
};

export default stripeNode;
