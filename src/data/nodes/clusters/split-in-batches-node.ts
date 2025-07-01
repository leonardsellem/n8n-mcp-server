import { NodeTypeInfo } from '../../node-types.js';

export const splitInBatchesNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.splitInBatches',
  displayName: 'Split In Batches',
  description: 'Split incoming data into smaller batches for distributed processing across cluster nodes',
  category: 'Cluster Nodes',
  subcategory: 'Data Distribution',
  properties: [
    {
      name: 'batchSize',
      displayName: 'Batch Size',
      type: 'number',
      required: true,
      default: 100,
      description: 'Number of items per batch'
    },
    {
      name: 'mode',
      displayName: 'Mode',
      type: 'options',
      required: true,
      default: 'splitByCount',
      options: [
        { name: 'Split by Count', value: 'splitByCount' },
        { name: 'Split by Percentage', value: 'splitByPercentage' },
        { name: 'Split by Size', value: 'splitBySize' }
      ],
      description: 'How to split the data'
    }
  ],
  inputs: [{ type: 'main', displayName: 'Input', required: true }],
  outputs: [{ type: 'main', displayName: 'Batches', description: 'Split data batches' }],
  credentials: [],
  regularNode: true,
  codeable: false,
  triggerNode: false,
  webhookSupport: false,
  version: [1, 2],
  defaults: { name: 'Split In Batches', batchSize: 100, mode: 'splitByCount' },
  aliases: ['split', 'batch', 'distribute', 'chunk']
};
