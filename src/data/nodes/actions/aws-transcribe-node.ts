/**
 * AWS Transcribe Node
 * 
 * Leverages Amazon Transcribe for speech-to-text. You can start a transcription job for an audio file (in S3), then later retrieve the transcribed text. This helps automate converting audio (calls, videos) into text transcripts.
 */

import { NodeTypeInfo } from '../../node-types.js';

export const awstranscribeNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-transcribe',
  displayName: 'AWS Transcribe',
  description: 'Leverages Amazon Transcribe for speech-to-text. You can start a transcription job for an audio file (in S3), then later retrieve the transcribed text. This helps automate converting audio (calls, videos) into text transcripts.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Start Transcription',
      description: 'The operation to perform',
      options: [
        { name: 'Start Transcription', value: 'Start Transcription' },
        { name: 'Get Transcription', value: 'Get Transcription' }
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
      description: 'Processed data from AWS Transcribe'
    }
  ],

  credentials: [
    {
      name: 'aws-transcribeApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Transcribe'
  },

  aliases: ['aws', 'transcribe'],
  
  examples: [
        {
      name: 'Start Transcription Item',
      description: 'Start Transcription an item from AWS Transcribe',
      workflow: {
        nodes: [
          {
            name: 'AWS Transcribe',
            type: 'n8n-nodes-base.aws-transcribe',
            parameters: {
              operation: 'Start Transcription',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awstranscribeNode;