/**
 * OpenWeatherMap Node
 * 
 * Integrates with OpenWeatherMap to retrieve weather data. You can get current weather for a city or geographic coordinates, and fetch forecast data (e.g., 5-day forecast). Useful for weather-related automations like alerts or adding weather info to records.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const openweathermapNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.openweathermap',
  displayName: 'OpenWeatherMap',
  description: 'Integrates with OpenWeatherMap to retrieve weather data. You can get current weather for a city or geographic coordinates, and fetch forecast data (e.g., 5-day forecast). Useful for weather-related automations like alerts or adding weather info to records.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Get Current Weather',
      description: 'The operation to perform',
      options: [
        { name: 'Get Current Weather', value: 'Get Current Weather' },
        { name: 'Get Forecast', value: 'Get Forecast' }
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
      description: 'Processed data from OpenWeatherMap'
    }
  ],

  credentials: [
    {
      name: 'openweathermapApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'OpenWeatherMap'
  },

  aliases: ['openweathermap'],
  
  examples: [
        {
      name: 'Get Current Weather Item',
      description: 'Get Current Weather an item from OpenWeatherMap',
      workflow: {
        nodes: [
          {
            name: 'OpenWeatherMap',
            type: 'n8n-nodes-base.openweathermap',
            parameters: {
              operation: 'Get Current Weather',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default openweathermapNode;