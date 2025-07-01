/**
 * Core Nodes Registry
 * 
 * Exports all core n8n node definitions for use in the MCP server.
 * These are the fundamental nodes that form the backbone of most workflows.
 */

import { aggregateNode } from './aggregate-node.js';
import { calculatorNode } from './calculator-node.js';
import { codeNode } from './code-node.js';
import { datetimeNode } from './date-time-node.js';
import { filterNode } from './filter-node.js';
import { httprequestNode } from './http-request-node.js';
import { ifNode } from './if-node.js';
import { renamekeysNode } from './rename-keys-node.js';
import { respondToWebhookNode } from './respond-to-webhook-node.js';
import { rssReadNode } from './rss-read-node.js';
import { sendEmailNode } from './send-email-node.js';
import { setNode } from './set-node.js';
import { sortNode } from './sort-node.js';
import { splitoutNode } from './split-out-node.js';
import { sshNode } from './ssh-node.js';
import { sseTriggerNode } from './sse-trigger-node.js';
import { stopanderrorNode } from './stop-and-error-node.js';
import { summarizeNode } from './summarize-node.js';
import { switchNode } from './switch-node.js';
import { totpNode } from './totp-node.js';
import { waitNode } from './wait-node.js';
import { webhookNode } from './webhook-node.js';
import { xmlNode } from './xml-node.js';
import { workflowtriggerNode } from './workflow-trigger-node.js';
import { scheduletriggerNode } from './schedule-trigger-node.js';
import { mergeNode } from './merge-node.js';
import { manualTriggerNode } from './manual-trigger-node.js';
import { noOpNode } from './no-op-node.js';
import { htmlNode } from './html-node.js';
import { functionNode } from './function-node.js';
import { itemListsNode } from './item-lists-node.js';
import { limitNode } from './limit-node.js';
import { removeDuplicatesNode } from './remove-duplicates-node.js';
import { editFieldsNode } from './edit-fields-node.js';
import { aiTransformNode } from './ai-transform-node.js';
import { chatTriggerNode } from './chat-trigger-node.js';
import { compareDatasetsNode } from './compare-datasets-node.js';
import { compressionNode } from './compression-node.js';
import { cryptoNode } from './crypto-node.js';
import { executeCommandNode } from './execute-command-node.js';
import { splitInBatchesNode } from './split-in-batches-node.js';
import { jsonNode } from './json-node.js';
import { ftpNode } from './ftp-node.js';
import { convertToFileNode } from './convert-to-file-node.js';
import { debughelperNode } from './debug-helper-node.js';
import { editfieldssetNode } from './edit-fields-set-node.js';
import { httpRequestNodeComplete } from './enhanced-http-request-node.js';
import { executiondataNode } from './execution-data-node.js';
import { extractfromfileNode } from './extract-from-file-node.js';
import { loopoveritemssplitinbatchesNode } from './loop-over-items-split-in-batches-node.js';
import { qrCodeNode } from './qr-code-node.js';
import { ifNode as ifNodeReal } from './if-node-real.js';
import { setNode as setNodeReal } from './set-node-real.js';

export const coreNodes = {
  'n8n-nodes-base.aggregate': aggregateNode,
  'n8n-nodes-base.aiTransform': aiTransformNode,
  'n8n-nodes-base.calculator': calculatorNode,
  'n8n-nodes-base.chatTrigger': chatTriggerNode,
  'n8n-nodes-base.code': codeNode,
  'n8n-nodes-base.compareDatasets': compareDatasetsNode,
  'n8n-nodes-base.compression': compressionNode,
  'n8n-nodes-base.convertToFile': convertToFileNode,
  'n8n-nodes-base.crypto': cryptoNode,
  'n8n-nodes-base.dateTime': datetimeNode,
  'n8n-nodes-base.debug-helper': debughelperNode,
  'n8n-nodes-base.editFields': editFieldsNode,
  'n8n-nodes-base.edit-fields-set': editfieldssetNode,
  'n8n-nodes-base.executeCommand': executeCommandNode,
  'n8n-nodes-base.execution-data': executiondataNode,
  'n8n-nodes-base.extract-from-file': extractfromfileNode,
  'n8n-nodes-base.filter': filterNode,
  'n8n-nodes-base.ftp': ftpNode,
  'n8n-nodes-base.function': functionNode,
  'n8n-nodes-base.html': htmlNode,
  'n8n-nodes-base.httpRequest': httprequestNode,
  'n8n-nodes-base.httpRequestComplete': httpRequestNodeComplete,
  'n8n-nodes-base.if': ifNode,
  'n8n-nodes-base.itemLists': itemListsNode,
  'n8n-nodes-base.json': jsonNode,
  'n8n-nodes-base.limit': limitNode,
  'n8n-nodes-base.loop-over-items-split-in-batches': loopoveritemssplitinbatchesNode,
  'n8n-nodes-base.manualTrigger': manualTriggerNode,
  'n8n-nodes-base.merge': mergeNode,
  'n8n-nodes-base.noOp': noOpNode,
  'n8n-nodes-base.qrCode': qrCodeNode,
  'n8n-nodes-base.removeduplicates': removeDuplicatesNode,
  'n8n-nodes-base.renameKeys': renamekeysNode,
  'n8n-nodes-base.respondToWebhook': respondToWebhookNode,
  'n8n-nodes-base.rssReadTrigger': rssReadNode,
  'n8n-nodes-base.scheduleTrigger': scheduletriggerNode,
  'n8n-nodes-base.sendEmail': sendEmailNode,
  'n8n-nodes-base.set': setNode,
  'n8n-nodes-base.sort': sortNode,
  'n8n-nodes-base.split-out': splitoutNode,
  'n8n-nodes-base.splitInBatches': splitInBatchesNode,
  'n8n-nodes-base.ssh': sshNode,
  'n8n-nodes-base.sseTrigger': sseTriggerNode,
  'n8n-nodes-base.stopAndError': stopanderrorNode,
  'n8n-nodes-base.summarize': summarizeNode,
  'n8n-nodes-base.switch': switchNode,
  'n8n-nodes-base.totp': totpNode,
  'n8n-nodes-base.wait': waitNode,
  'n8n-nodes-base.webhook': webhookNode,
  'n8n-nodes-base.workflowTrigger': workflowtriggerNode,
  'n8n-nodes-base.xml': xmlNode,
  'n8n-nodes-base.if-real': ifNodeReal,
  'n8n-nodes-base.set-real': setNodeReal,
};

export {
  aggregateNode,
  aiTransformNode,
  calculatorNode,
  chatTriggerNode,
  codeNode,
  compareDatasetsNode,
  compressionNode,
  convertToFileNode,
  cryptoNode,
  datetimeNode,
  debughelperNode,
  editFieldsNode,
  editfieldssetNode,
  executeCommandNode,
  executiondataNode,
  extractfromfileNode,
  filterNode,
  ftpNode,
  functionNode,
  htmlNode,
  httpRequestNodeComplete,
  httprequestNode,
  ifNode,
  itemListsNode,
  jsonNode,
  limitNode,
  loopoveritemssplitinbatchesNode,
  manualTriggerNode,
  mergeNode,
  noOpNode,
  qrCodeNode,
  removeDuplicatesNode,
  renamekeysNode,
  respondToWebhookNode,
  rssReadNode,
  scheduletriggerNode,
  sendEmailNode,
  setNode,
  sortNode,
  splitInBatchesNode,
  splitoutNode,
  sshNode,
  sseTriggerNode,
  stopanderrorNode,
  summarizeNode,
  switchNode,
  totpNode,
  waitNode,
  webhookNode,
  workflowtriggerNode,
  xmlNode,
  ifNodeReal,
  setNodeReal,
};

export default coreNodes;
