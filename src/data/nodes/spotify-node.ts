/**
 * Spotify Node
 * 
 * Connects to Spotify’s API for music data. You can search for tracks (or artists, albums), add a track to a user’s playlist, and get the currently playing track on a user’s account:contentReference[oaicite:43]{index=43}. Great for music-related automations, playlist management, or reacting to playback events.
 */

import { NodeTypeInfo } from '../node-types.js';

export const spotifyNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.spotify',
  displayName: 'Spotify',
  description: 'Connects to Spotify’s API for music data. You can search for tracks (or artists, albums), add a track to a user’s playlist, and get the currently playing track on a user’s account:contentReference[oaicite:43]{index=43}. Great for music-related automations, playlist management, or reacting to playback events.',
  category: 'Utility',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Search Tracks',
      description: 'The operation to perform',
      options: [
        { name: 'Search Tracks', value: 'Search Tracks' },
        { name: 'Add Track to Playlist', value: 'Add Track to Playlist' },
        { name: 'Get Currently Playing', value: 'Get Currently Playing' }
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
      description: 'Processed data from Spotify'
    }
  ],

  credentials: [
    {
      name: 'spotifyApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'Spotify'
  },

  aliases: ['spotify'],
  
  examples: [
        {
      name: 'Search Tracks Item',
      description: 'Search Tracks an item from Spotify',
      workflow: {
        nodes: [
          {
            name: 'Spotify',
            type: 'n8n-nodes-base.spotify',
            parameters: {
              operation: 'Search Tracks',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default spotifyNode;