# 🤖 Teams Outlook Email & Calendar Manager - Complete Setup Guide

## 🎯 Overview

This n8n workflow creates a sophisticated Microsoft Teams chatbot that acts as your personal Outlook Email & Calendar assistant. Users can interact with it using natural language to manage emails, schedule meetings, and handle calendar events.

## 🌟 Key Features

### 📧 Email Management
- **Smart Email Summaries**: "Summarize my unread emails"
- **AI-Powered Composition**: "Send email to john@company.com about the project update"
- **Draft Management**: "Show my drafts" or "Send draft #2"
- **Thread Analysis**: Get AI-powered insights on email conversations

### 🗓️ Calendar Management
- **Natural Language Scheduling**: "Schedule meeting with Sarah tomorrow at 2pm"
- **Event Creation**: Creates calendar events with intelligent defaults
- **Meeting Management**: Organize events with proper attendees and details

### 🤖 AI-Powered Natural Language Interface
- **Intent Recognition**: Understands natural language commands
- **Context Awareness**: Maintains conversation context
- **Smart Parameter Extraction**: Automatically extracts recipients, dates, subjects from text

### 📱 Teams Integration
- **Adaptive Cards**: Rich interactive responses with buttons
- **Send and Wait**: Human-in-the-loop approvals for important actions
- **Real-time Notifications**: Instant feedback on all operations

## 🛠️ Prerequisites

### Required Credentials
1. **Microsoft Azure App Registration** (for Teams & Outlook APIs)
2. **OpenAI API Key** (for natural language processing)
3. **n8n Instance** (self-hosted or n8n Cloud)

### Required n8n Nodes
All nodes are included in the base n8n installation:
- `n8n-nodes-base.webhook`
- `n8n-nodes-base.openAi`
- `n8n-nodes-base.switch`
- `n8n-nodes-base.microsoftOutlook`
- `n8n-nodes-base.microsoftTeams`
- `n8n-nodes-base.respondToWebhook`

## 🔧 Step-by-Step Setup

### Step 1: Azure App Registration

1. **Go to Azure Portal** → App Registrations → New Registration
2. **Set Name**: "n8n Teams Outlook Bot"
3. **Set Redirect URI**: `https://your-n8n-domain.com/rest/oauth2-credential/callback`
4. **Note the Application (client) ID**

#### Required API Permissions:
```
Microsoft Graph:
- Mail.ReadWrite (Application)
- Mail.Send (Application) 
- Calendars.ReadWrite (Application)
- Chat.ReadWrite (Application)
- TeamMember.Read.All (Application)
- Channel.ReadBasic.All (Application)
```

5. **Grant Admin Consent** for all permissions
6. **Create Client Secret** → Note the secret value

### Step 2: Teams Bot Setup

#### Option A: Outgoing Webhook (Simpler)
1. **In Teams** → Apps → App Studio → Manifest Editor
2. **Create New App**
3. **Bot Section** → Set up bot → Outgoing webhook
4. **Endpoint**: `https://your-n8n-domain.com/webhook/teams-outlook-assistant`
5. **Download & Install** the app package

#### Option B: Azure Bot Framework (More Features)
1. **Azure Portal** → Create Resource → Bot Service
2. **Set Messaging Endpoint**: `https://your-n8n-domain.com/webhook/teams-outlook-assistant`
3. **Configure Teams Channel**
4. **Add to Teams** via App Studio

### Step 3: n8n Credentials Configuration

#### Microsoft OAuth2 Credential:
```json
{
  "clientId": "your-azure-app-id",
  "clientSecret": "your-azure-client-secret",
  "scope": "https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/Chat.ReadWrite",
  "authUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  "accessTokenUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/token"
}
```

#### OpenAI Credential:
```json
{
  "apiKey": "your-openai-api-key"
}
```

### Step 4: Import & Configure Workflow

1. **Import the JSON file** `teams-outlook-workflow.json` into n8n
2. **Configure Credentials** for each node:
   - Set Microsoft OAuth2 on Outlook & Teams nodes
   - Set OpenAI credential on AI nodes
3. **Activate the Workflow**
4. **Test the Webhook** endpoint

## 💬 Usage Examples

### Email Commands
```
"Summarize my unread emails"
"Show me emails from john@company.com"
"Send email to sarah@company.com about the budget meeting"
"Compose message to team@company.com: The project is complete"
"Show my drafts"
"Send draft #2"
```

### Calendar Commands
```
"Schedule meeting with John tomorrow at 2pm"
"Create event 'Budget Review' for next Monday 10am"
"Book 1 hour meeting with marketing team Friday afternoon"
"Schedule call with client next week"
```

### Mixed Commands
```
"Summarize emails from this week and schedule follow-up meetings"
"Check my calendar for conflicts before scheduling with Sarah"
"Send draft about the proposal and schedule presentation"
```

## 🔄 Workflow Architecture

### 1. Webhook Trigger (`🎯 Teams Bot Webhook`)
- **Receives**: Natural language input from Teams
- **Endpoint**: `/teams-outlook-assistant`
- **Method**: POST
- **Response Mode**: Using 'Respond to Webhook' node

### 2. AI Intent Parser (`🧠 AI Intent Parser`)
- **Model**: GPT-4 for high accuracy
- **Purpose**: Extract intent and parameters from natural language
- **Output**: Structured JSON with intent, parameters, and confidence

### 3. Intent Router (`🔀 Intent Router`)
Routes to appropriate action based on extracted intent:
- `SUMMARIZE_EMAIL` → Email summary flow
- `COMPOSE_EMAIL` → Email composition flow  
- `SCHEDULE_EVENT` → Calendar creation flow
- `MANAGE_DRAFT` → Draft management flow

### 4. Action Flows

#### Email Summary Flow:
```
📧 Get Unread Emails → 📝 AI Email Summarizer → 📱 Teams Summary Response
```

#### Email Composition Flow:
```
✉️ Compose & Send Email → 📱 Teams Compose Response
```

#### Calendar Flow:
```
🗓️ Create Calendar Event → 📱 Teams Schedule Response
```

#### Draft Management Flow:
```
📝 Get Email Drafts → 📱 Teams Draft Response
```

### 5. Teams Responses
- **Adaptive Cards**: Rich interactive UI elements
- **Send and Wait**: Human approval for important actions
- **Action Buttons**: Quick actions for common tasks

## 🛡️ Security & Error Handling

### Security Features
- **OAuth2 Authentication**: Secure Microsoft Graph API access
- **Webhook Validation**: Verify Teams requests
- **Scoped Permissions**: Minimal required permissions only
- **Encrypted Credentials**: n8n credential encryption

### Error Handling
- **AI Parsing Errors**: Fallback to clarification requests
- **API Rate Limits**: Automatic retry with exponential backoff
- **Network Errors**: Graceful error messages to users
- **Permission Errors**: Clear instructions for missing permissions

### Monitoring
- **Execution Logs**: Full audit trail in n8n
- **Error Notifications**: Teams alerts for failures
- **Performance Metrics**: Response time tracking

## 🎛️ Customization Options

### AI Model Configuration
```javascript
// In AI Intent Parser node
"modelId": "gpt-4",  // or "gpt-3.5-turbo" for faster/cheaper
"maxTokens": 500,    // Adjust based on complexity
"temperature": 0.1   // Lower = more focused, Higher = more creative
```

### Email Filters
```javascript
// In Get Unread Emails node
"filters": {
  "isRead": false,
  "importance": "high",  // Optional: only high importance
  "hasAttachments": true // Optional: only emails with attachments
}
```

### Calendar Settings
```javascript
// In Create Calendar Event node
"options": {
  "isOnlineMeeting": true,     // Auto-create Teams meeting
  "allowNewTimeProposals": true, // Allow rescheduling
  "importance": "normal"        // or "high", "low"
}
```

### Teams Response Customization
```javascript
// Modify Adaptive Card templates
{
  "type": "AdaptiveCard",
  "version": "1.3",
  "body": [
    // Customize your card layout here
  ],
  "actions": [
    // Add custom action buttons
  ]
}
```

## 🚀 Advanced Features

### Attachment Handling
Add HTTP Request node to fetch files from Teams/SharePoint:
```javascript
// Fetch attachment from Teams
{
  "method": "GET",
  "url": "https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/files/{fileId}/content",
  "authentication": "microsoftOAuth2Api"
}
```

### Follow-up Reminders
Add Wait/Delay nodes for automatic follow-ups:
```javascript
// Add after email send
{
  "amount": 3,
  "unit": "days"
}
```

### Multi-language Support
Modify AI prompts for different languages:
```javascript
// In system prompt
"You are an expert assistant that parses natural language requests in English, Spanish, and French..."
```

## 📊 Performance Optimization

### Caching Strategy
- **Email Lists**: Cache recent email lists for 5 minutes
- **Calendar Events**: Cache upcoming events for 15 minutes
- **User Preferences**: Store user settings in workflow static data

### Rate Limiting
- **Microsoft Graph**: 10,000 requests per 10 minutes
- **OpenAI**: Adjust based on your plan
- **Teams**: 600 requests per 30 seconds per app

### Response Time Optimization
- **Parallel Processing**: Use parallel branches where possible
- **Lazy Loading**: Only fetch detailed data when needed
- **Efficient Queries**: Use filters to minimize data transfer

## 🔍 Troubleshooting

### Common Issues

#### "Unauthorized" Errors
- **Check**: Azure app permissions granted
- **Verify**: Redirect URI matches exactly
- **Ensure**: Admin consent provided

#### Teams Not Responding
- **Verify**: Webhook URL is accessible
- **Check**: Teams app is properly installed
- **Test**: Webhook endpoint manually

#### AI Parsing Errors
- **Monitor**: OpenAI API quotas
- **Adjust**: Temperature and token limits
- **Fallback**: Add clarification prompts

### Debug Commands
```javascript
// Add to any node for debugging
console.log('Node input:', JSON.stringify($input.all(), null, 2));
console.log('Current item:', JSON.stringify($json, null, 2));
```

## 📈 Monitoring & Analytics

### Key Metrics to Track
- **Response Time**: Average time from Teams message to response
- **Success Rate**: Percentage of successful intent recognition
- **User Engagement**: Most used features and commands
- **Error Rate**: Failed API calls and their causes

### Dashboard Setup
Create monitoring dashboard with:
- **Workflow Execution Count**: Daily/weekly/monthly
- **Error Trends**: Track and alert on error spikes
- **Performance Metrics**: Response times and bottlenecks
- **User Activity**: Popular commands and usage patterns

## 🤝 Support & Community

### Getting Help
1. **n8n Community Forum**: [community.n8n.io](https://community.n8n.io)
2. **Microsoft Graph Documentation**: [docs.microsoft.com/graph](https://docs.microsoft.com/graph)
3. **Teams Bot Documentation**: [docs.microsoft.com/microsoftteams](https://docs.microsoft.com/microsoftteams)

### Contributing
- **Share Improvements**: Post workflow enhancements in n8n community
- **Report Issues**: Use GitHub issues for bug reports
- **Feature Requests**: Suggest new capabilities

---

## 🎉 Conclusion

This Teams Outlook Email & Calendar Manager transforms how business owners interact with their email and calendar systems. By providing a natural language interface through Microsoft Teams, it eliminates the friction of switching between applications and enables efficient, AI-powered productivity.

The workflow is designed to be:
- **Extensible**: Easy to add new features and integrations
- **Secure**: Following Microsoft security best practices
- **User-friendly**: Natural language interface with zero learning curve
- **Reliable**: Comprehensive error handling and monitoring

Start with the basic setup and gradually customize it to match your specific business needs and workflows.
