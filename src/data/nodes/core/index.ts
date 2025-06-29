/**
 * Core Nodes Registry
 * 
 * Exports all core n8n node definitions for use in the MCP server.
 * These are the fundamental nodes that form the backbone of most workflows.
 */

import { httprequestNode } from './http-request-node.js';
import { ifNode } from './if-node.js';
import { setNode } from './set-node.js';
import { webhookNode } from './webhook-node.js';
import { switchNode } from './switch-node.js';
import { codeNode } from './code-node.js';
import { waitNode } from './wait-node.js';

export const coreNodes = {
  'n8n-nodes-base.httpRequest': httprequestNode,
  'n8n-nodes-base.if': ifNode,
  'n8n-nodes-base.set': setNode,
  'n8n-nodes-base.webhook': webhookNode,
  'n8n-nodes-base.switch': switchNode,
  'n8n-nodes-base.code': codeNode,
  'n8n-nodes-base.wait': waitNode,
};

export {
  httprequestNode,
  ifNode,
  setNode,
  webhookNode,
  switchNode,
  codeNode,
  waitNode,
};

export default coreNodes;
