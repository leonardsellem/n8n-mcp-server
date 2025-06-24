import { NodeTypeInfo } from '../node-types.js';

export const toolsagentNode: NodeTypeInfo = {
  name: 'n8n-nodes-base.tools-agent',
  displayName: 'Tools Agent',
  description: 'Node for Tools Agent integration',
  category: 'Productivity',
  subcategory: 'General',
  properties: [],
  inputs: [{ type: 'main', displayName: 'Input', required: true }],
  outputs: [{ type: 'main', displayName: 'Output', description: 'Output data' }],
  credentials: [],
  version: [1],
  defaults: { name: 'Tools Agent' },
  examples: []
};

export default toolsagentNode;
