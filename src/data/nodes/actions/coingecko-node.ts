/**
 * CoinGecko Node
 * 
 * Uses the CoinGecko API for cryptocurrency data. You can retrieve current price information for specified coins, list supported coins, and get market data or stats. Ideal for crypto price monitoring or reports.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const coingeckoNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.coingecko',
  displayName: 'CoinGecko',
  description: 'Uses the CoinGecko API for cryptocurrency data. You can retrieve current price information for specified coins, list supported coins, and get market data or stats. Ideal for crypto price monitoring or reports.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Coin Price',
      description: 'The operation to perform',
      options: [
        { name: 'Get Coin Price', value: 'Get Coin Price' },
        { name: 'List Coins', value: 'List Coins' },
        { name: 'Get Market Data', value: 'Get Market Data' }
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
      description: 'Processed data from CoinGecko'
    }
  ],

  credentials: [
    {
      name: 'coingeckoApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'CoinGecko'
  },

  aliases: ['coingecko'],
  
  examples: [
        {
      name: 'Get Coin Price Item',
      description: 'Get Coin Price an item from CoinGecko',
      workflow: {
        nodes: [
          {
            name: 'CoinGecko',
            type: 'n8n-nodes-base.coingecko',
            parameters: {
              operation: 'Get Coin Price',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default coingeckoNode;