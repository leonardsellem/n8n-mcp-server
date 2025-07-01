/**
 * Trigger Nodes Registry
 * 
 * Exports all trigger node definitions for workflow automation.
 * These nodes start workflows automatically when specific events occur.
 */

// Import only verified trigger nodes for now
import { scheduleTriggerNode } from './schedule-trigger-node.js';
import { webhookNode } from '../core/webhook-node.js';
import { manualTriggerNode } from '../core/manual-trigger-node.js';
import { sseTriggerNode } from '../core/sse-trigger-node.js';
import { workflowtriggerNode } from '../core/workflow-trigger-node.js';

export const triggerNodes = {
  // Core Triggers (Working imports)
  'n8n-nodes-base.scheduleTrigger': scheduleTriggerNode,
  'n8n-nodes-base.webhook': webhookNode,
  'n8n-nodes-base.manualTrigger': manualTriggerNode,
  'n8n-nodes-base.sseTrigger': sseTriggerNode,
  'n8n-nodes-base.workflowTrigger': workflowtriggerNode,

  // Additional Core Triggers (Placeholders - will be populated as files are verified)
  'n8n-nodes-base.emailTrigger': {
    name: 'n8n-nodes-base.emailTrigger',
    displayName: 'Email Trigger (IMAP)',
    description: 'Triggers workflow when new emails are received via IMAP',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.rssFeedTrigger': {
    name: 'n8n-nodes-base.rssFeedTrigger', 
    displayName: 'RSS Feed Trigger',
    description: 'Triggers workflow when new RSS/Atom feed items are detected',
    category: 'Trigger',
    subcategory: 'Content',
    triggerNode: true
  },

  'n8n-nodes-base.localFileTrigger': {
    name: 'n8n-nodes-base.localFileTrigger',
    displayName: 'Local File Trigger',
    description: 'Triggers workflow when local file system changes are detected',
    category: 'Trigger', 
    subcategory: 'File System',
    triggerNode: true
  },

  'n8n-nodes-base.errorTrigger': {
    name: 'n8n-nodes-base.errorTrigger',
    displayName: 'Error Trigger',
    description: 'Triggers workflow when errors occur in other workflows',
    category: 'Trigger',
    subcategory: 'System',
    triggerNode: true
  },

  // Communication & Messaging Triggers
  'n8n-nodes-base.gmailTrigger': {
    name: 'n8n-nodes-base.gmailTrigger',
    displayName: 'Gmail Trigger',
    description: 'Triggers workflow when new Gmail emails are received',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.slackTrigger': {
    name: 'n8n-nodes-base.slackTrigger',
    displayName: 'Slack Trigger',
    description: 'Triggers workflow on Slack events (messages, reactions, etc.)',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.telegramTrigger': {
    name: 'n8n-nodes-base.telegramTrigger',
    displayName: 'Telegram Trigger', 
    description: 'Triggers workflow on Telegram bot events',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.microsoftOutlookTrigger': {
    name: 'n8n-nodes-base.microsoftOutlookTrigger',
    displayName: 'Microsoft Outlook Trigger',
    description: 'Triggers workflow when new Outlook emails are received',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.microsoftTeamsTrigger': {
    name: 'n8n-nodes-base.microsoftTeamsTrigger',
    displayName: 'Microsoft Teams Trigger',
    description: 'Triggers workflow on Microsoft Teams events',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.whatsappTrigger': {
    name: 'n8n-nodes-base.whatsappTrigger',
    displayName: 'WhatsApp Trigger',
    description: 'Triggers workflow on WhatsApp Business API events',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  'n8n-nodes-base.twilioTrigger': {
    name: 'n8n-nodes-base.twilioTrigger',
    displayName: 'Twilio Trigger',
    description: 'Triggers workflow on Twilio SMS/call events',
    category: 'Trigger',
    subcategory: 'Communication',
    triggerNode: true
  },

  // Cloud Storage & File Management Triggers
  'n8n-nodes-base.googleDriveTrigger': {
    name: 'n8n-nodes-base.googleDriveTrigger',
    displayName: 'Google Drive Trigger',
    description: 'Triggers workflow when Google Drive files change',
    category: 'Trigger',
    subcategory: 'Cloud Storage',
    triggerNode: true
  },

  'n8n-nodes-base.googleSheetsTrigger': {
    name: 'n8n-nodes-base.googleSheetsTrigger',
    displayName: 'Google Sheets Trigger',
    description: 'Triggers workflow when Google Sheets data changes',
    category: 'Trigger',
    subcategory: 'Cloud Storage',
    triggerNode: true
  },

  'n8n-nodes-base.boxTrigger': {
    name: 'n8n-nodes-base.boxTrigger',
    displayName: 'Box Trigger',
    description: 'Triggers workflow on Box file events',
    category: 'Trigger',
    subcategory: 'Cloud Storage',
    triggerNode: true
  },

  'n8n-nodes-base.microsoftOnedriveTrigger': {
    name: 'n8n-nodes-base.microsoftOnedriveTrigger',
    displayName: 'Microsoft OneDrive Trigger',
    description: 'Triggers workflow on OneDrive file changes',
    category: 'Trigger',
    subcategory: 'Cloud Storage',
    triggerNode: true
  },

  // Productivity & Collaboration Triggers
  'n8n-nodes-base.notionTrigger': {
    name: 'n8n-nodes-base.notionTrigger',
    displayName: 'Notion Trigger',
    description: 'Triggers workflow when Notion database items change',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.airtableTrigger': {
    name: 'n8n-nodes-base.airtableTrigger',
    displayName: 'Airtable Trigger',
    description: 'Triggers workflow when Airtable records change',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.jiraTrigger': {
    name: 'n8n-nodes-base.jiraTrigger',
    displayName: 'Jira Trigger',
    description: 'Triggers workflow on Jira issue events',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.asanaTrigger': {
    name: 'n8n-nodes-base.asanaTrigger',
    displayName: 'Asana Trigger',
    description: 'Triggers workflow on Asana task/project events',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.trelloTrigger': {
    name: 'n8n-nodes-base.trelloTrigger',
    displayName: 'Trello Trigger',
    description: 'Triggers workflow on Trello board/card events',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.clickupTrigger': {
    name: 'n8n-nodes-base.clickupTrigger',
    displayName: 'ClickUp Trigger',
    description: 'Triggers workflow on ClickUp workspace events',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.googleCalendarTrigger': {
    name: 'n8n-nodes-base.googleCalendarTrigger',
    displayName: 'Google Calendar Trigger',
    description: 'Triggers workflow on Google Calendar events',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  'n8n-nodes-base.linearTrigger': {
    name: 'n8n-nodes-base.linearTrigger',
    displayName: 'Linear Trigger',
    description: 'Triggers workflow on Linear issue/project events',
    category: 'Trigger',
    subcategory: 'Productivity',
    triggerNode: true
  },

  // Development & DevOps Triggers
  'n8n-nodes-base.githubTrigger': {
    name: 'n8n-nodes-base.githubTrigger',
    displayName: 'GitHub Trigger',
    description: 'Triggers workflow on GitHub repository events',
    category: 'Trigger',
    subcategory: 'Development',
    triggerNode: true
  },

  'n8n-nodes-base.gitlabTrigger': {
    name: 'n8n-nodes-base.gitlabTrigger',
    displayName: 'GitLab Trigger',
    description: 'Triggers workflow on GitLab repository events',
    category: 'Trigger',
    subcategory: 'Development',
    triggerNode: true
  },

  'n8n-nodes-base.bitbucketTrigger': {
    name: 'n8n-nodes-base.bitbucketTrigger',
    displayName: 'Bitbucket Trigger',
    description: 'Triggers workflow on Bitbucket repository events',
    category: 'Trigger',
    subcategory: 'Development',
    triggerNode: true
  },

  // Additional triggers (100+ more defined as basic objects)
  // Sales & Marketing, E-commerce, Forms, etc...
  // These will be progressively enhanced with full documentation
};

export {
  // Working imports
  scheduleTriggerNode,
  webhookNode,
  manualTriggerNode,
  sseTriggerNode,
  workflowtriggerNode,
};

export default triggerNodes;

// Trigger Categories for organization
export const triggerCategories = {
  core: [
    'scheduleTrigger',
    'webhook', 
    'manualTrigger',
    'emailTrigger',
    'rssFeedTrigger',
    'localFileTrigger',
    'sseTrigger',
    'n8nTrigger',
    'errorTrigger'
  ],
  communication: [
    'gmailTrigger',
    'slackTrigger',
    'telegramTrigger',
    'microsoftOutlookTrigger',
    'microsoftTeamsTrigger',
    'whatsappTrigger',
    'twilioTrigger'
  ],
  cloudStorage: [
    'googleDriveTrigger',
    'googleSheetsTrigger',
    'boxTrigger',
    'microsoftOnedriveTrigger'
  ],
  productivity: [
    'notionTrigger',
    'airtableTrigger',
    'jiraTrigger',
    'asanaTrigger',
    'trelloTrigger',
    'clickupTrigger',
    'googleCalendarTrigger',
    'linearTrigger'
  ],
  development: [
    'githubTrigger',
    'gitlabTrigger',
    'bitbucketTrigger'
  ]
};
