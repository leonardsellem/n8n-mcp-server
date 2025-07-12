# 🤖 Teams-Outlook Manager Pro - Complete Setup Guide

## 🎯 Overview

This guide will help you set up a powerful AI-powered Teams bot that manages your Outlook emails and calendar through natural language conversations. The bot uses Microsoft Adaptive Cards for rich interactive responses.

## 📋 Prerequisites

### Required Services
- ✅ n8n instance (cloud or self-hosted)
- ✅ Microsoft Azure account with admin access
- ✅ Microsoft 365 Business/Enterprise subscription
- ✅ OpenAI API key
- ✅ Microsoft Teams (with admin permissions to install bots)

### Required Permissions
- Azure AD App Registration permissions
- Teams app installation rights
- Outlook email and calendar access

## 🔧 Step 1: Azure Bot Framework Setup

### 1.1 Create Azure Bot Resource

1. **Go to Azure Portal** → Search "Bot Service"
2. **Create a new Bot Resource**:
   - **Bot handle**: `outlook-manager-bot`
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Pricing**: F0 (Free tier for testing)
   - **App Type**: Multi Tenant
   - **Creation Type**: Create new Microsoft App ID

3. **Note down these values** (save for later):
   - Microsoft App ID
   - Microsoft App Password/Secret

### 1.2 Configure Bot Channels

1. **Go to your Bot Resource** → **Channels**
2. **Add Microsoft Teams Channel**:
   - Click "Microsoft Teams"
   - Enable the channel
   - Click "Apply"

## 🔧 Step 2: n8n Workflow Setup

### 2.1 Import the Workflow

1. **Open your n8n instance**
2. **Import the workflow**:
   - Copy the JSON from `teams-outlook-manager-pro-final.json`
   - Go to n8n → "Import from clipboard"
   - Paste and import

### 2.2 Configure Credentials

#### OpenAI Credentials
1. **AI Intent Analyzer** node → Click credentials gear
2. **Create new OpenAI credential**:
   - API Key: Your OpenAI API key
   - Organization ID: (optional)

#### Microsoft Outlook Credentials
1. **Email Status Checker** and **Calendar Checker** nodes
2. **Create new Microsoft OAuth2 credential**:
   - Grant Type: Authorization Code
   - Authorization URL: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`
   - Access Token URL: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
   - Scope: `https://graph.microsoft.com/mail.read https://graph.microsoft.com/calendars.read`
   - Auth URI Query Parameters: `response_type=code`
   - Authentication: Body

3. **Test the connection** by running a test execution

### 2.3 Get Webhook URL

1. **Click on Teams Webhook node**
2. **Copy the Webhook URL** (will look like):
   ```
   https://your-n8n-instance.com/webhook/teams-outlook-manager
   ```

## 🔧 Step 3: Azure Bot Configuration

### 3.1 Configure Messaging Endpoint

1. **Azure Portal** → **Your Bot Resource** → **Configuration**
2. **Set Messaging Endpoint**:
   ```
   https://your-n8n-instance.com/webhook/teams-outlook-manager
   ```
3. **Save changes**

### 3.2 Add Required API Permissions

1. **Azure Portal** → **Azure Active Directory** → **App registrations**
2. **Find your bot's app registration**
3. **API Permissions** → **Add a permission**:
   - **Microsoft Graph**
   - **Delegated permissions**:
     - `Mail.Read`
     - `Mail.ReadWrite`
     - `Calendars.Read`
     - `Calendars.ReadWrite`
     - `User.Read`
   - **Application permissions** (for service scenarios):
     - `Mail.Read`
     - `Calendars.Read`

4. **Grant admin consent** for these permissions

## 🔧 Step 4: Teams App Package

### 4.1 Create App Manifest

Create `manifest.json`:

```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
  "manifestVersion": "1.16",
  "version": "1.0.0",
  "id": "YOUR_MICROSOFT_APP_ID",
  "packageName": "com.yourcompany.outlookmanager",
  "developer": {
    "name": "Your Company",
    "websiteUrl": "https://yourcompany.com",
    "privacyUrl": "https://yourcompany.com/privacy",
    "termsOfUseUrl": "https://yourcompany.com/terms"
  },
  "icons": {
    "color": "color.png",
    "outline": "outline.png"
  },
  "name": {
    "short": "Outlook Manager Pro",
    "full": "AI-Powered Outlook Email & Calendar Manager"
  },
  "description": {
    "short": "Manage emails and calendar with AI",
    "full": "AI-powered assistant for managing Outlook emails and calendar through natural language commands"
  },
  "accentColor": "#FFFFFF",
  "bots": [
    {
      "botId": "YOUR_MICROSOFT_APP_ID",
      "scopes": [
        "personal",
        "team",
        "groupchat"
      ],
      "supportsFiles": false,
      "isNotificationOnly": false,
      "supportsCalling": false,
      "supportsVideo": false
    }
  ],
  "permissions": [
    "identity",
    "messageTeamMembers"
  ],
  "validDomains": [
    "your-n8n-instance.com"
  ]
}
```

### 4.2 Create App Icons

1. **color.png**: 192x192 pixels (full color icon)
2. **outline.png**: 32x32 pixels (outline icon)

### 4.3 Package the App

1. **Create a ZIP file** containing:
   - `manifest.json`
   - `color.png`
   - `outline.png`

2. **Name it**: `outlook-manager-pro.zip`

## 🔧 Step 5: Deploy to Teams

### 5.1 Upload to Teams

1. **Microsoft Teams** → **Apps** → **Manage your apps**
2. **Upload a custom app** → **Upload for [Your Organization]**
3. **Select your ZIP file**
4. **Install the app**

### 5.2 Test Installation

1. **Start a chat with your bot**
2. **Send "help"** to see the welcome card
3. **Try natural language commands**:
   - "What's in my inbox?"
   - "Check my calendar"
   - "Draft an email to John"

## 🎮 Usage Examples

### Natural Language Commands

#### Email Status
- "Check my emails"
- "Any new messages?"
- "What's in my inbox?"
- "Show me unread emails"

#### Calendar Management
- "What's on my calendar today?"
- "Any meetings this week?"
- "Check my schedule"
- "What's next on my calendar?"

#### Email Composition
- "Draft email to john.doe@company.com about project update"
- "Compose message to marketing team"
- "Write email about tomorrow's meeting"

#### Help Commands
- "help"
- "what can you do?"
- "show commands"

### Interactive Features

The bot responds with **Microsoft Adaptive Cards** featuring:
- 📊 **Status summaries** with unread email counts
- 📅 **Calendar overviews** with event details
- ✏️ **Email draft previews** with editing options
- 🔄 **Quick action buttons** for common tasks

## 🔒 Security Considerations

### Data Protection
- **OAuth2 authentication** ensures secure access
- **Scoped permissions** limit access to required data only
- **No data storage** in n8n (real-time API calls only)

### Best Practices
1. **Regular credential rotation**
2. **Monitor API usage** and costs
3. **Audit bot conversations** for compliance
4. **Limit user access** through Teams app policies

## 🚀 Advanced Features (Optional)

### Email Automation
Add nodes for:
- **Auto-categorization** of emails
- **Priority detection** with AI
- **Follow-up reminders**
- **Email templates**

### Calendar Intelligence
Add nodes for:
- **Meeting summaries** with AI
- **Schedule optimization**
- **Conflict detection**
- **Automatic scheduling**

### Integration Extensions
- **SharePoint integration** for file attachments
- **CRM synchronization** for contact management
- **Task management** integration
- **Analytics and reporting**

## 🛠️ Troubleshooting

### Common Issues

#### Bot Not Responding
1. **Check webhook URL** in Azure Bot configuration
2. **Verify n8n workflow** is activated
3. **Test webhook endpoint** directly

#### Permission Errors
1. **Verify API permissions** in Azure AD
2. **Ensure admin consent** is granted
3. **Check credential configuration** in n8n

#### AI Responses Not Working
1. **Verify OpenAI API key** and quota
2. **Check model availability** (gpt-4o-mini)
3. **Monitor API usage** and limits

### Debugging Steps

1. **n8n Workflow Execution**:
   - Check execution history
   - Review error logs
   - Test individual nodes

2. **Azure Bot Logs**:
   - Monitor Application Insights
   - Check bot framework logs
   - Review API call traces

3. **Teams Integration**:
   - Verify app manifest
   - Check installation status
   - Test in different contexts

## 📞 Support

For issues with setup or functionality:
1. **Check n8n documentation**: https://docs.n8n.io
2. **Azure Bot Framework docs**: https://docs.microsoft.com/en-us/azure/bot-service/
3. **Microsoft Graph API docs**: https://docs.microsoft.com/en-us/graph/

## 🎉 Success!

Your Teams-Outlook Manager Pro is now ready! Users can chat naturally with the bot to manage their emails and calendar efficiently through the power of AI and Microsoft's ecosystem.

---

**Next Steps**: Consider adding more sophisticated features like email sentiment analysis, meeting scheduling automation, or integration with other productivity tools.
