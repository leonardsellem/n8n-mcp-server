# n8n Trigger Nodes Registry

Trigger nodes start workflows automatically when specific events occur. They monitor external systems, schedules, or conditions to initiate workflow execution.

## Trigger Node Categories

### Core Triggers (Built-in)
- Schedule Trigger
- Webhook 
- Manual Trigger
- Chat Trigger
- n8n Trigger
- Workflow Trigger
- Error Trigger
- Email Trigger (IMAP)
- RSS Feed Trigger
- Local File Trigger
- SSE Trigger
- Evaluation Trigger
- Execute Sub-workflow Trigger
- n8n Form Trigger
- MCP Server Trigger

### Application-Specific Triggers
- Gmail Trigger
- Slack Trigger
- Discord Trigger
- Telegram Trigger
- Microsoft Outlook Trigger
- Google Sheets Trigger
- Google Drive Trigger
- Dropbox Trigger
- GitHub Trigger
- Webhooks from various services

### Database Triggers
- PostgreSQL Trigger
- MySQL Trigger
- MongoDB Trigger
- Redis Trigger

### Communication Triggers
- Email-based triggers
- Chat platform triggers
- SMS triggers
- Voice call triggers

### File & Storage Triggers
- File system monitoring triggers
- Cloud storage triggers (S3, Google Drive, Dropbox)
- FTP triggers

### Time-Based Triggers
- Cron-style scheduling
- Interval-based execution
- Date/time condition triggers

---

## Trigger Nodes Documentation

### Core Trigger Nodes

#### 1. Schedule Trigger
**Status**: ✅ Active
**Category**: Core - Time-based Trigger
**Purpose**: Execute workflows on a schedule using cron expressions or intervals

**Configuration Options:**
- **Cron Expression**: Standard cron syntax for complex scheduling
- **Interval**: Simple interval-based execution (seconds, minutes, hours, days)
- **Timezone**: Specific timezone for execution
- **Trigger Rules**: Complex scheduling rules

**Use Cases:**
- Regular data synchronization
- Periodic report generation
- Maintenance tasks
- Batch processing
- Automated backups

#### 2. Webhook
**Status**: ✅ Active
**Category**: Core - HTTP Trigger
**Purpose**: Receive HTTP requests to trigger workflows

**Configuration Options:**
- **HTTP Method**: GET, POST, PUT, DELETE, PATCH
- **Authentication**: None, Basic Auth, Header Auth
- **Response**: Custom response configuration
- **Binary Data**: Handle file uploads

**Use Cases:**
- API endpoints
- Third-party service integrations
- Form submissions
- External system notifications
- Real-time data processing

#### 3. Manual Trigger
**Status**: ✅ Active
**Category**: Core - Manual Trigger
**Purpose**: Manually start workflows for testing and development

**Configuration Options:**
- **Input Data**: Test data for workflow execution
- **Execution Mode**: Test vs production execution

**Use Cases:**
- Workflow testing
- Development and debugging
- One-time manual execution
- Workflow validation

#### 4. Email Trigger (IMAP)
**Status**: ✅ Active
**Category**: Core - Email Trigger
**Purpose**: Monitor email inbox and trigger workflows on new emails

**Configuration Options:**
- **IMAP Server**: Email server connection
- **Mailbox**: Specific folder to monitor
- **Filter Rules**: Email filtering criteria
- **Attachment Handling**: Download attachments option

**Use Cases:**
- Email automation
- Document processing from attachments
- Customer support workflows
- Email-based data entry

#### 5. RSS Feed Trigger
**Status**: ✅ Active
**Category**: Core - Content Trigger
**Purpose**: Monitor RSS feeds for new content

**Configuration Options:**
- **Feed URL**: RSS/Atom feed URL
- **Poll Interval**: Check frequency
- **Item Limit**: Number of items to process

**Use Cases:**
- Content aggregation
- News monitoring
- Blog post automation
- Social media posting

#### 6. Local File Trigger
**Status**: ✅ Active
**Category**: Core - File System Trigger
**Purpose**: Monitor local file system for changes

**Configuration Options:**
- **Watch Path**: Directory or file to monitor
- **Event Types**: Created, modified, deleted
- **File Patterns**: Include/exclude patterns

**Use Cases:**
- File processing automation
- Document workflow triggers
- Data import automation
- File synchronization

---

### Application Trigger Nodes

#### Gmail Trigger
**Status**: ✅ Active
**Category**: Application - Email Trigger
**Purpose**: Monitor Gmail for new emails

**Authentication**: OAuth2 or Service Account
**Configuration Options:**
- **Label Filters**: Specific Gmail labels
- **Search Query**: Gmail search syntax
- **Attachment Processing**: Handle attachments

**Use Cases:**
- Gmail automation
- Email parsing and processing
- Customer communication workflows

#### Slack Trigger
**Status**: ✅ Active
**Category**: Application - Communication Trigger
**Purpose**: Monitor Slack for messages and events

**Authentication**: OAuth2 or Bot Token
**Configuration Options:**
- **Channel Monitoring**: Specific channels
- **Message Types**: Direct messages, mentions, etc.
- **Event Types**: Messages, reactions, file uploads

**Use Cases:**
- Chat bot automation
- Team communication workflows
- Alert processing
- Collaboration automation

#### GitHub Trigger
**Status**: ✅ Active
**Category**: Application - Development Trigger
**Purpose**: Monitor GitHub repositories for events

**Authentication**: Personal Access Token or GitHub App
**Configuration Options:**
- **Repository**: Specific repo to monitor
- **Event Types**: Push, pull request, issues, releases
- **Branch Filters**: Specific branches

**Use Cases:**
- CI/CD automation
- Code review workflows
- Issue tracking automation
- Release management

---

## Trigger Nodes To Be Documented

### High Priority Triggers:
1. **Google Sheets Trigger** - Spreadsheet change monitoring
2. **Microsoft Outlook Trigger** - Outlook email monitoring
3. **Discord Trigger** - Discord server monitoring
4. **Telegram Trigger** - Telegram bot triggers
5. **Dropbox Trigger** - File change monitoring
6. **Google Drive Trigger** - Drive file monitoring

### Database Triggers:
1. **PostgreSQL Trigger** - Database change monitoring
2. **MySQL Trigger** - Database event monitoring
3. **MongoDB Trigger** - Document change streams
4. **Redis Trigger** - Key/value change monitoring

### Integration Triggers:
1. **Salesforce Trigger** - CRM event monitoring
2. **HubSpot Trigger** - Marketing automation triggers
3. **Stripe Trigger** - Payment event monitoring
4. **Shopify Trigger** - E-commerce event monitoring

### Communication Triggers:
1. **WhatsApp Trigger** - Message monitoring
2. **Teams Trigger** - Microsoft Teams events
3. **Zoom Trigger** - Meeting and webinar events
4. **Twilio Trigger** - SMS and call events

### Cloud Storage Triggers:
1. **AWS S3 Trigger** - Bucket change monitoring
2. **Google Cloud Storage Trigger** - Object change events
3. **Azure Blob Trigger** - Storage account monitoring
4. **Box Trigger** - File collaboration events

---

*Note: This registry will be systematically expanded through browser navigation of the n8n documentation to ensure complete coverage of all trigger nodes with detailed configuration options, authentication requirements, and real-world use cases.*
