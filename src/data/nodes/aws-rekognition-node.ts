/**
 * AWS Rekognition Node
 * 
 * Uses Amazon Rekognition (image and video analysis). For images, it can detect labels/objects, detect faces and their attributes, compare faces between images, or detect text in images. Enables adding image recognition capabilities to workflows.
 */

import { NodeTypeInfo } from '../node-types.js';

export const awsrekognitionNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.aws-rekognition',
  displayName: 'AWS Rekognition',
  description: 'Uses Amazon Rekognition (image and video analysis). For images, it can detect labels/objects, detect faces and their attributes, compare faces between images, or detect text in images. Enables adding image recognition capabilities to workflows.',
  category: 'Cloud',
  subcategory: 'Integration',
  
  properties: [
        {
      name: 'operation',
      displayName: 'Operation',
      type: 'options',
      required: true,
      default: 'Detect Labels',
      description: 'The operation to perform',
      options: [
        { name: 'Detect Labels', value: 'Detect Labels' },
        { name: 'Detect Faces', value: 'Detect Faces' },
        { name: 'Compare Faces', value: 'Compare Faces' },
        { name: 'Detect Text', value: 'Detect Text' }
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
      description: 'Processed data from AWS Rekognition'
    }
  ],

  credentials: [
    {
      name: 'aws-rekognitionApi',
      required: true,
      displayOptions: {
        show: {}
      }
    }
  ],

  regularNode: true,
  
  
  
  version: [1],
  defaults: {
    name: 'AWS Rekognition'
  },

  aliases: ['aws', 'rekognition'],
  
  examples: [
        {
      name: 'Detect Labels Item',
      description: 'Detect Labels an item from AWS Rekognition',
      workflow: {
        nodes: [
          {
            name: 'AWS Rekognition',
            type: 'n8n-nodes-base.aws-rekognition',
            parameters: {
              operation: 'Detect Labels',
              resourceId: '123456'
            }
          }
        ]
      }
    }
  ]
};

export default awsrekognitionNode;