/**
 * marketstack Node
 * 
 * Uses the marketstack API to retrieve stock market data. You can get current or historical stock prices and intraday data for tickers. Great for financial workflows needing stock quotes or market analysis data.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const marketstackNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.marketstack',
  displayName: 'marketstack',
  description: 'Uses the marketstack API to retrieve stock market data. You can get current or historical stock prices and intraday data for tickers. Great for financial workflows needing stock quotes or market analysis data.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Stock Price',
      description: 'The operation to perform',
      options: [
        { name: 'Get Stock Price', value: 'Get Stock Price' },
        { name: 'Get Intraday Data', value: 'Get Intraday Data' }
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
      description: 'Processed data from marketstack'
    }
  ],

  credentials: [
    {
      name: 'marketstackApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'marketstack'
  },

  aliases: ['marketstack'],
  
  examples: [
        {
      name: 'Get Stock Price Item',
      description: 'Get Stock Price an item from marketstack',
      workflow: {
        nodes: [
          {
            name: 'marketstack',
            type: 'n8n-nodes-base.marketstack',
            parameters: {
              operation: 'Get Stock Price',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default marketstackNode;