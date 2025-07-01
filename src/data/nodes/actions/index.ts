/**
 * Action Nodes Registry
 * 
 * Exports all action node definitions for integrations with external services.
 * These nodes perform actions on third-party platforms and applications.
 */

// Import existing action nodes
import { slackNode } from './slack-node.js';
import { githubNode } from './github-node.js';
import { discordNode } from './discord-node.js';
import { googleDriveNode } from './google-drive-node.js';
import { googleSheetsNode } from './google-sheets-node.js';
import { telegramNode } from './telegram-node.js';
import { mysqlNode } from './mysql-node.js';
import { postgresqlNode } from './postgresql-node.js';
import { mongodbNode } from './mongodb-node.js';
import { notionNode } from './notion-node.js';
import { airtableNode } from './airtable-node.js';
import { hubspotNode } from './hubspot-node.js';
import { salesforceNode } from './salesforce-node.js';
import { stripeNode } from './stripe-node.js';
import { twilioNode } from './twilio-node.js';
import { shopifyNode } from './shopify-node.js';
import { gmailNode } from './gmail-node.js';
import { microsoftOutlookNode } from './microsoft-outlook-node.js';
import { jiraNode } from './jira-node.js';
import { microsoftTeamsNode } from './microsoft-teams-node.js';
import { asanaNode } from './asana-node.js';
import { trelloNode } from './trello-node.js';
import { googleCalendarNode } from './google-calendar-node.js';
import { dropboxNode } from './dropbox-node.js';
import { microsoftExcelNode } from './microsoft-excel-node.js';
import { awsLambdaNode } from './aws-lambda-node.js';
import { microsoftSqlNode } from './microsoft-sql-node.js';
import { redisNode } from './redis-node.js';
import { awsS3Node } from './aws-s3-node.js';
import { linkedinNode } from './linkedin-node.js';
import { twitterNode } from './twitter-node.js';
import { youtubeNode } from './youtube-node.js';
import { whatsappNode } from './whatsapp-node.js';
import { zendeskNode } from './zendesk-node.js';
import { intercomNode } from './intercom-node.js';
import { pipedriveNode } from './pipedrive-node.js';
import { clickupNode } from './clickup-node.js';
import { mondayNode } from './monday-node.js';
import { mailchimpNode } from './mailchimp-node.js';
import { googleAnalyticsNode } from './google-analytics-node.js';
import { awsDynamodbNode } from './aws-dynamodb-node.js';
import { awsSesNode } from './aws-ses-node.js';
import { elasticsearchNode } from './elasticsearch-node.js';
import { openaiNode } from './openai-node.js';
import { boxNode } from './box-node.js';

export const actionNodes = {
  // Communication & Messaging
  'n8n-nodes-base.slack': slackNode,
  'n8n-nodes-base.discord': discordNode,
  'n8n-nodes-base.telegram': telegramNode,
  'n8n-nodes-base.twilio': twilioNode,
  'n8n-nodes-base.whatsapp': whatsappNode,
  'n8n-nodes-base.gmail': gmailNode,
  'n8n-nodes-base.microsoftOutlook': microsoftOutlookNode,
  'n8n-nodes-base.microsoftTeams': microsoftTeamsNode,
  'n8n-nodes-base.awsSes': awsSesNode,

  // Cloud Storage & File Management
  'n8n-nodes-base.googleDrive': googleDriveNode,
  'n8n-nodes-base.googleSheets': googleSheetsNode,
  'n8n-nodes-base.dropbox': dropboxNode,
  'n8n-nodes-base.box': boxNode,

  // Productivity & Collaboration
  'n8n-nodes-base.notion': notionNode,
  'n8n-nodes-base.airtable': airtableNode,
  'n8n-nodes-base.jira': jiraNode,
  'n8n-nodes-base.asana': asanaNode,
  'n8n-nodes-base.trello': trelloNode,
  'n8n-nodes-base.clickup': clickupNode,
  'n8n-nodes-base.mondaycom': mondayNode,
  'n8n-nodes-base.googleCalendar': googleCalendarNode,
  'n8n-nodes-base.microsoftExcel': microsoftExcelNode,

  // Social Media & Marketing
  'n8n-nodes-base.linkedin': linkedinNode,
  'n8n-nodes-base.twitter': twitterNode,
  'n8n-nodes-base.youtube': youtubeNode,

  // Sales & Marketing
  'n8n-nodes-base.hubspot': hubspotNode,
  'n8n-nodes-base.salesforce': salesforceNode,
  'n8n-nodes-base.pipedrive': pipedriveNode,
  'n8n-nodes-base.mailchimp': mailchimpNode,

  // Analytics & Tracking
  'n8n-nodes-base.googleAnalytics': googleAnalyticsNode,

  // Payments & E-commerce
  'n8n-nodes-base.stripe': stripeNode,
  'n8n-nodes-base.shopify': shopifyNode,

  // Development & DevOps
  'n8n-nodes-base.github': githubNode,

  // Cloud Services
  'n8n-nodes-base.awsLambda': awsLambdaNode,
  'n8n-nodes-base.awsS3': awsS3Node,

  // Databases & Search
  'n8n-nodes-base.mysql': mysqlNode,
  'n8n-nodes-base.postgresql': postgresqlNode,
  'n8n-nodes-base.mongodb': mongodbNode,
  'n8n-nodes-base.microsoftSql': microsoftSqlNode,
  'n8n-nodes-base.redis': redisNode,
  'n8n-nodes-base.awsDynamodb': awsDynamodbNode,
  'n8n-nodes-base.elasticsearch': elasticsearchNode,

  // Customer Service & Support
  'n8n-nodes-base.zendesk': zendeskNode,
  'n8n-nodes-base.intercom': intercomNode,

  // AI & Machine Learning
  'n8n-nodes-base.openai': openaiNode,
};

export {
  // Communication & Messaging
  slackNode,
  discordNode,
  telegramNode,
  twilioNode,
  whatsappNode,
  gmailNode,
  microsoftOutlookNode,
  microsoftTeamsNode,
  awsSesNode,

  // Cloud Storage & File Management
  googleDriveNode,
  googleSheetsNode,
  dropboxNode,

  // Productivity & Collaboration
  notionNode,
  airtableNode,
  jiraNode,
  asanaNode,
  trelloNode,
  clickupNode,
  mondayNode,
  googleCalendarNode,
  microsoftExcelNode,

  // Social Media & Marketing
  linkedinNode,
  twitterNode,
  youtubeNode,

  // Sales & Marketing
  hubspotNode,
  salesforceNode,
  pipedriveNode,
  mailchimpNode,

  // Analytics & Tracking
  googleAnalyticsNode,

  // Payments & E-commerce
  stripeNode,
  shopifyNode,

  // Development & DevOps
  githubNode,

  // Cloud Services
  awsLambdaNode,
  awsS3Node,

  // Databases & Search
  mysqlNode,
  postgresqlNode,
  mongodbNode,
  microsoftSqlNode,
  redisNode,
  awsDynamodbNode,
  elasticsearchNode,

  // Customer Service & Support
  zendeskNode,
  intercomNode,

  // AI & Machine Learning
  openaiNode,
  
  // Additional Cloud Storage
  boxNode,
};

export default actionNodes;
