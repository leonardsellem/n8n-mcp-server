# 🚀 Teams-Outlook API Configuration Guide

This comprehensive guide walks you through setting up all required APIs, OAuth2 credentials, and Teams bot configuration for the n8n Teams-Outlook Email & Calendar Manager workflow.

## 📋 Prerequisites

- Azure subscription (free tier works)
- Microsoft 365 tenant with Teams and Outlook
- OpenAI API account
- n8n instance (cloud or self-hosted)
- Admin permissions for Azure AD and Teams

---

## 1. 🔑 Azure App Registration & OAuth2 Setup

### Step 1.1: Create Azure AD App Registration

1. **Navigate to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft 365 admin account

2. **Create App Registration**
   ```
   Azure Active Directory → App registrations → New registration
   ```
   
   **Configuration:**
   - **Name**: `n8n-teams-outlook-bot`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: `Web` → `https://your-n8n-instance.com/rest/oauth2-credential/callback`

3. **Note the Application Details**
   ```
   Application (client) ID: [SAVE THIS]
   Directory (tenant) ID: [SAVE THIS]
   ```

### Step 1.2: Configure API Permissions

1. **Add Microsoft Graph Permissions**
   ```
   API permissions → Add a permission → Microsoft Graph → Delegated permissions
   ```

   **Required Permissions:**
   ```
   Mail.Read                    - Read user mail
   Mail.ReadWrite              - Read and write user mail  
   Mail.Send                   - Send mail as user
   Calendars.Read              - Read user calendars
   Calendars.ReadWrite         - Read and write user calendars
   offline_access              - Maintain access to data
   openid                      - Sign in and read user profile
   profile                     - View users' basic profile
   User.Read                   - Sign in and read user profile
   ChatMessage.Send            - Send channel messages
   Team.ReadBasic.All          - Read the names and descriptions of teams
   Channel.ReadBasic.All       - Read the names and descriptions of channels
   ```

2. **Grant Admin Consent**
   ```
   Click "Grant admin consent for [Your Organization]"
   Status should show green checkmarks for all permissions
   ```

### Step 1.3: Create Client Secret

1. **Generate Secret**
   ```
   Certificates & secrets → Client secrets → New client secret
   ```
   
   **Configuration:**
   - **Description**: `n8n-teams-outlook-secret`
   - **Expires**: `24 months` (recommended)

2. **Save Client Secret**
   ```
   Value: [COPY AND SAVE IMMEDIATELY - Won't be shown again]
   ```

---

## 2. 🤖 Teams Bot Framework Setup

### Step 2.1: Create Azure Bot Resource

1. **Create Bot Service**
   ```
   Azure Portal → Create a resource → AI + Machine Learning → Bot Service
   ```

   **Configuration:**
   - **Bot handle**: `n8n-outlook-assistant` (must be globally unique)
   - **Subscription**: Your Azure subscription
   - **Resource group**: Create new or use existing
   - **Pricing tier**: `F0 (Free)`
   - **Microsoft App ID**: `Use existing app registration`
   - **Existing app ID**: [Use the Application ID from Step 1]

### Step 2.2: Configure Bot Endpoint

1. **Set Messaging Endpoint**
   ```
   Bot Service → Configuration → Messaging endpoint
   ```
   
   **Endpoint URL:**
   ```
   https://your-n8n-instance.com/webhook/teams-assistant
   ```

2. **Enable Teams Channel**
   ```
   Bot Service → Channels → Microsoft Teams
   ```
   - Click on Microsoft Teams
   - Enable the channel
   - Save configuration

### Step 2.3: Create Teams App Manifest

1. **Create App Package Directory**
   ```bash
   mkdir teams-app-package
   cd teams-app-package
   ```

2. **Create manifest.json**
   ```json
   {
     "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.16/MicrosoftTeams.schema.json",
     "manifestVersion": "1.16",
     "version": "1.0.0",
     "id": "YOUR-APP-ID-FROM-STEP-1",
     "packageName": "com.company.n8n-outlook-assistant",
     "developer": {
       "name": "Your Company",
       "websiteUrl": "https://your-company.com",
       "privacyUrl": "https://your-company.com/privacy",
       "termsOfUseUrl": "https://your-company.com/terms"
     },
     "icons": {
       "color": "color.png",
       "outline": "outline.png"
     },
     "name": {
       "short": "Outlook Assistant",
       "full": "n8n Outlook Email & Calendar Assistant"
     },
     "description": {
       "short": "AI-powered email and calendar management",
       "full": "Manage your Outlook emails and calendar using natural language commands through this AI assistant"
     },
     "accentColor": "#FFFFFF",
     "bots": [
       {
         "botId": "YOUR-APP-ID-FROM-STEP-1",
         "needsChannelSelector": false,
         "isNotificationOnly": false,
         "scopes": [
           "personal",
           "team"
         ],
         "commandLists": [
           {
             "scopes": [
               "personal",
               "team"
             ],
             "commands": [
               {
                 "title": "Summarize emails",
                 "description": "Get AI summary of unread emails"
               },
               {
                 "title": "Send email",
                 "description": "Compose and send email"
               },
               {
                 "title": "Schedule meeting",
                 "description": "Create calendar events"
               }
             ]
           }
         ]
       }
     ],
     "permissions": [
       "identity",
       "messageTeamMembers"
     ],
     "validDomains": [
       "*.botframework.com"
     ]
   }
   ```

3. **Create App Icons**
   
   **color.png** (192x192px):
   - Create or download a colorful icon representing your bot
   - Must be exactly 192x192 pixels
   
   **outline.png** (32x32px):
   - Create or download a monochrome outline version
   - Must be exactly 32x32 pixels

4. **Package the App**
   ```bash
   # Create zip file with manifest and icons
   zip -r teams-app.zip manifest.json color.png outline.png
   ```

---

## 3. 🔌 OpenAI API Setup

### Step 3.1: Get OpenAI API Key

1. **Create OpenAI Account**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in to your account

2. **Generate API Key**
   ```
   API Keys → Create new secret key
   ```
   
   **Configuration:**
   - **Name**: `n8n-teams-outlook-bot`
   - **Permissions**: `All` (or restricted to your needs)

3. **Save API Key**
   ```
   sk-proj-... [COPY AND SAVE SECURELY]
   ```

4. **Set Usage Limits** (Recommended)
   ```
   Billing → Usage limits → Set monthly budget
   ```

---

## 4. 🛠️ n8n Credential Configuration

### Step 4.1: Create OpenAI Credentials

1. **Navigate to n8n Credentials**
   ```
   n8n Dashboard → Credentials → Add credential
   ```

2. **Add OpenAI Credential**
   ```
   Search for "OpenAI" → Select "OpenAI"
   ```
   
   **Configuration:**
   - **API Key**: `[Your OpenAI API key from Step 3]`
   - **Name**: `OpenAI - Teams Bot`

### Step 4.2: Create Microsoft Outlook OAuth2 Credentials

1. **Add OAuth2 Credential**
   ```
   Credentials → Add credential → Search "Microsoft Outlook" → "Microsoft Outlook OAuth2 API"
   ```

2. **Configure OAuth2 Settings**
   ```
   Grant Type: Authorization Code
   Authorization URL: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
   Access Token URL: https://login.microsoftonline.com/common/oauth2/v2.0/token
   Client ID: [Application ID from Step 1.1]
   Client Secret: [Client Secret from Step 1.3]
   Scope: https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Calendars.ReadWrite offline_access
   ```

3. **Authorize the Application**
   - Click "Connect my account"
   - Sign in with your Microsoft 365 account
   - Grant permissions when prompted

### Step 4.3: Create Microsoft Teams OAuth2 Credentials

1. **Add Teams OAuth2 Credential**
   ```
   Credentials → Add credential → Search "Microsoft Teams" → "Microsoft Teams OAuth2 API"
   ```

2. **Configure OAuth2 Settings**
   ```
   Grant Type: Authorization Code
   Authorization URL: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
   Access Token URL: https://login.microsoftonline.com/common/oauth2/v2.0/token
   Client ID: [Application ID from Step 1.1]
   Client Secret: [Client Secret from Step 1.3]
   Scope: https://graph.microsoft.com/ChatMessage.Send https://graph.microsoft.com/Team.ReadBasic.All offline_access
   ```

3. **Authorize the Application**
   - Click "Connect my account"
   - Grant Teams permissions

---

## 5. 📱 Teams App Installation

### Step 5.1: Upload Custom App to Teams

1. **Upload App Package**
   ```
   Microsoft Teams → Apps → Manage your apps → Upload a custom app
   ```
   
   - Select "Upload for [Your Organization]"
   - Choose the `teams-app.zip` file created in Step 2.3

2. **Install the App**
   - Click "Add" to install for yourself
   - Or click "Add to a team" to install for a specific team

### Step 5.2: Configure App Permissions

1. **Grant App Permissions**
   ```
   Teams Admin Center → Teams apps → Manage apps
   ```
   
   - Find your custom app
   - Set status to "Allowed"
   - Configure org-wide settings if needed

2. **Test Bot Communication**
   - Go to the installed app in Teams
   - Send a test message: "Hello"
   - Verify the bot responds

---

## 6. 🔧 Workflow Configuration in n8n

### Step 6.1: Import Workflow

1. **Import the Workflow**
   ```
   n8n → Workflows → Import from file
   ```
   - Select `teams-outlook-workflow-final.json`

2. **Configure Node Credentials**
   
   **AI Intent Parser Node:**
   - Credential: `OpenAI - Teams Bot`
   
   **AI Email Summary Node:**
   - Credential: `OpenAI - Teams Bot`
   
   **Email Summarizer Node:**
   - Credential: `Microsoft Outlook OAuth2`
   
   **Draft Handler Node:**
   - Credential: `Microsoft Outlook OAuth2`
   
   **Email Sender Node:**
   - Credential: `Microsoft Outlook OAuth2`
   
   **Calendar Manager Node:**
   - Credential: `Microsoft Outlook OAuth2`
   
   **Teams Responder Node:**
   - Credential: `Microsoft Teams OAuth2`

### Step 6.2: Configure Webhook Settings

1. **Update Webhook Path** (if needed)
   ```
   Teams Bot Webhook Node → Parameters
   ```
   - **Path**: `teams-assistant`
   - **HTTP Method**: `POST`
   - **Response Mode**: `responseNode`

2. **Get Webhook URL**
   ```
   Copy webhook URL: https://your-n8n-instance.com/webhook/teams-assistant
   ```

### Step 6.3: Update Bot Framework Endpoint

1. **Update Azure Bot Endpoint**
   ```
   Azure Portal → Your Bot Service → Configuration
   ```
   - **Messaging endpoint**: `https://your-n8n-instance.com/webhook/teams-assistant`
   - Save configuration

---

## 7. ✅ Testing & Validation

### Step 7.1: Test Basic Connectivity

1. **Test Webhook**
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/teams-assistant \
     -H "Content-Type: application/json" \
     -d '{"body": {"text": "Hello test"}}'
   ```

2. **Expected Response**
   ```json
   {"status": "success", "message": "Request processed successfully"}
   ```

### Step 7.2: Test Teams Integration

1. **Send Test Messages in Teams**
   ```
   "Summarize my unread emails"
   "Schedule meeting with John tomorrow at 2pm"
   "Send email to jane@company.com about the project"
   ```

2. **Verify Responses**
   - Bot should respond with Adaptive Cards
   - Cards should have appropriate action buttons
   - Error handling should work for invalid requests

### Step 7.3: Test Outlook Operations

1. **Email Tests**
   - Verify email summarization works
   - Test sending emails
   - Check draft handling

2. **Calendar Tests**
   - Create test calendar events
   - Verify event details are correct
   - Test attendee invitations

---

## 8. 🔒 Security Best Practices

### Step 8.1: Credential Security

1. **Store Secrets Securely**
   - Never commit API keys to source control
   - Use n8n's built-in credential encryption
   - Rotate secrets regularly

2. **Limit Permissions**
   - Grant minimum required API permissions
   - Use specific scopes rather than broad access
   - Regular permission audits

### Step 8.2: Access Control

1. **Teams App Permissions**
   ```
   Teams Admin Center → Teams apps → Permission policies
   ```
   - Restrict app installation to specific users/groups
   - Monitor app usage and permissions

2. **Azure AD Security**
   - Enable conditional access policies
   - Monitor sign-in logs
   - Set up alerts for unusual activity

---

## 9. 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue: Bot not responding in Teams
**Solutions:**
- Check webhook URL in Azure Bot Framework
- Verify n8n workflow is active
- Check n8n execution logs for errors
- Validate Teams app manifest

#### Issue: OAuth2 authentication failing
**Solutions:**
- Verify redirect URI matches exactly
- Check API permissions are granted with admin consent
- Ensure client secret hasn't expired
- Validate scopes in credential configuration

#### Issue: Email/Calendar operations failing
**Solutions:**
- Check Outlook OAuth2 permissions
- Verify user has valid Microsoft 365 license
- Test API permissions in Graph Explorer
- Check for conditional access blocking

#### Issue: OpenAI API errors
**Solutions:**
- Verify API key is valid and active
- Check usage limits and billing
- Ensure model (gpt-4o-mini) is available
- Review rate limiting

### Debug Steps

1. **Check n8n Execution Logs**
   ```
   n8n → Executions → View recent executions
   ```

2. **Test Individual Nodes**
   - Use "Execute Node" feature in n8n
   - Test each node independently
   - Verify data flow between nodes

3. **Monitor Azure Logs**
   ```
   Azure Portal → Bot Service → Analytics → Conversations
   ```

---

## 10. 📈 Production Deployment

### Step 10.1: Environment Considerations

1. **Production n8n Instance**
   - Use HTTPS with valid SSL certificate
   - Configure proper backup and monitoring
   - Set up high availability if needed
   - Use environment variables for configuration

2. **Azure Production Settings**
   ```
   App Registration → Authentication → Production redirect URIs
   Bot Service → Production messaging endpoint
   Teams App → App Studio → Production deployment
   ```

3. **OpenAI Production Limits**
   - Set appropriate rate limits
   - Monitor usage and costs
   - Configure usage alerts

### Step 10.2: Monitoring & Logging

1. **n8n Monitoring**
   ```
   Enable execution logging
   Set up error notifications
   Monitor webhook response times
   Track workflow success rates
   ```

2. **Azure Monitoring**
   ```
   Application Insights for bot analytics
   Azure Monitor for resource health
   Alert rules for failures
   ```

3. **Teams Usage Analytics**
   ```
   Teams Admin Center → Analytics & reports → Usage reports
   Monitor bot interactions and user adoption
   ```

---

## 11. 📋 Quick Reference

### Essential URLs
```
Azure Portal: https://portal.azure.com
Teams Admin Center: https://admin.teams.microsoft.com
Graph Explorer: https://developer.microsoft.com/en-us/graph/graph-explorer
OpenAI Platform: https://platform.openai.com
n8n Documentation: https://docs.n8n.io
```

### Key Configuration Values
```
Webhook Path: /webhook/teams-assistant
OAuth2 Redirect: /rest/oauth2-credential/callback
Teams Manifest Version: 1.16
OpenAI Model: gpt-4o-mini
Bot Framework Version: v4
```

### Required Scopes Summary
**Microsoft Graph (Outlook):**
- Mail.Read, Mail.ReadWrite, Mail.Send
- Calendars.Read, Calendars.ReadWrite
- offline_access, openid, profile, User.Read

**Microsoft Graph (Teams):**
- ChatMessage.Send, Team.ReadBasic.All
- Channel.ReadBasic.All, offline_access

---

## 12. 🎯 Next Steps After Setup

1. **Test the Complete Flow**
   - Send various natural language commands
   - Verify all integrations work correctly
   - Test error scenarios

2. **User Training**
   - Create user documentation
   - Provide example commands
   - Set up support channels

3. **Scaling Considerations**
   - Monitor API usage and costs
   - Plan for additional features
   - Consider multi-tenant deployment

4. **Maintenance Schedule**
   - Regular credential rotation
   - API permission reviews
   - Performance monitoring
   - Security updates

---

## 📞 Support & Resources

### Documentation Links
- [Azure Bot Framework Documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
- [Microsoft Graph API Reference](https://docs.microsoft.com/en-us/graph/)
- [Teams App Development Guide](https://docs.microsoft.com/en-us/microsoftteams/platform/)
- [n8n Workflow Documentation](https://docs.n8n.io/workflows/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

### Community Support
- [n8n Community Forum](https://community.n8n.io/)
- [Microsoft Teams Developer Community](https://docs.microsoft.com/en-us/microsoftteams/platform/feedback)
- [Azure Developer Community](https://techcommunity.microsoft.com/t5/azure-developer-community/ct-p/AzureDevCommunity)

---

*This guide provides comprehensive setup instructions for the Teams-Outlook Email & Calendar Manager. For additional support or customization requirements, refer to the official documentation links or community forums.*
