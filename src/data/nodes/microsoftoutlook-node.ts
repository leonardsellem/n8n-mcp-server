import { NodeTypeInfo } from '../node-types.js';

export const microsoftoutlookNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.microsoftoutlook',
  displayName: 'Microsoftoutlook',
  description: 'Node for Microsoftoutlook integration',
  category: 'Productivity',
  subcategory: 'General',
  properties: [],
  inputs: [{ type: 'main', displayName: 'Input', required: true }],
  outputs: [{ type: 'main', displayName: 'Output', description: 'Output data' }],
  credentials: [],
  version: [1],
  defaults: { name: 'Microsoftoutlook' },
  examples: []
};

export default microsoftoutlookNode;
