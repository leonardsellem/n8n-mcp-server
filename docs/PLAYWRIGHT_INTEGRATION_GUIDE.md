# Playwright Integration Guide for n8n MCP Server

## Overview

The n8n MCP Server now includes full Playwright integration, enabling AI agents to:
- **Verify workflows visually** by taking screenshots and inspecting the n8n UI
- **Interact with n8n nodes** directly through browser automation
- **Add nodes via the node menu** programmatically
- **Add notes and modify workflows** through the web interface
- **Automate complex workflow testing** scenarios

## Features

### ✅ Core Browser Automation
- **Session Management**: Create and manage multiple browser sessions
- **Smart Navigation**: Navigate to URLs with automatic error handling
- **Element Interaction**: Click, fill, and interact with page elements
- **Screenshot Capture**: Take full-page screenshots for visual verification
- **Page Information**: Extract titles, URLs, and other page data

### ✅ Enhanced Capabilities
- **Credential Management**: Store and retrieve login credentials securely
- **Automated Login**: Perform automated logins with stored credentials
- **Smart Element Detection**: Intelligent element finding with fallbacks
- **Error Handling**: Comprehensive error handling and recovery
- **Logging System**: Detailed logging for debugging and monitoring

### ✅ n8n-Specific Features
- **Workflow Verification**: Visually verify workflow creation and execution
- **Node Menu Automation**: Automate adding nodes through the UI
- **Workflow Editor Interaction**: Interact with the n8n workflow editor
- **Visual Testing**: Screenshot-based testing for UI validation

## Installation

Playwright is automatically installed with the n8n MCP Server. The installation includes:

```bash
# Playwright library (already included in package.json)
npm install playwright

# Browser binaries (automatically installed during build)
npx playwright install
```

## Available Tools

### Session Management

#### `browser_create_session`
Create a new browser session for automation.

```json
{
  "name": "browser_create_session",
  "arguments": {
    "siteName": "n8n-local"
  }
}
```

**Returns**: Session ID for subsequent operations

#### `browser_close_session`
Close a browser session and clean up resources.

```json
{
  "name": "browser_close_session",
  "arguments": {
    "sessionId": "session-id-here"
  }
}
```

### Navigation & Interaction

#### `browser_navigate`
Navigate to a URL in the browser session.

```json
{
  "name": "browser_navigate",
  "arguments": {
    "sessionId": "session-id-here",
    "url": "http://localhost:5678"
  }
}
```

#### `browser_click`
Click an element using CSS selector.

```json
{
  "name": "browser_click",
  "arguments": {
    "sessionId": "session-id-here",
    "selector": "button[data-test-id='add-node']"
  }
}
```

#### `browser_fill`
Fill an input field with text.

```json
{
  "name": "browser_fill",
  "arguments": {
    "sessionId": "session-id-here",
    "selector": "input[name='workflow-name']",
    "value": "My Test Workflow"
  }
}
```

### Visual Verification

#### `browser_take_screenshot`
Capture a screenshot of the current page.

```json
{
  "name": "browser_take_screenshot",
  "arguments": {
    "sessionId": "session-id-here"
  }
}
```

**Returns**: Screenshot file path for analysis

#### `browser_get_page_info`
Get current page information.

```json
{
  "name": "browser_get_page_info",
  "arguments": {
    "sessionId": "session-id-here"
  }
}
```

**Returns**: Title, URL, and other page metadata

### Authentication & Credentials

#### `browser_store_credentials`
Store login credentials for a site.

```json
{
  "name": "browser_store_credentials",
  "arguments": {
    "siteName": "n8n-local",
    "username": "admin@n8n.local",
    "password": "your-password",
    "siteUrl": "http://localhost:5678",
    "loginSelectors": {
      "username": "input[name='email']",
      "password": "input[name='password']",
      "submit": "button[type='submit']"
    }
  }
}
```

#### `browser_login`
Perform automated login using stored credentials.

```json
{
  "name": "browser_login",
  "arguments": {
    "sessionId": "session-id-here",
    "siteName": "n8n-local",
    "url": "http://localhost:5678/signin"
  }
}
```

#### `browser_list_credentials`
List all stored credentials (passwords not included).

```json
{
  "name": "browser_list_credentials",
  "arguments": {}
}
```

### Debugging & Monitoring

#### `browser_get_logs`
Get browser automation logs for debugging.

```json
{
  "name": "browser_get_logs",
  "arguments": {
    "sessionId": "session-id-here",
    "limit": 100
  }
}
```

## Common Use Cases

### 1. Workflow Visual Verification

```javascript
// Example: Verify a workflow was created correctly
const sessionId = await browser_create_session({ siteName: 'n8n-verification' });
await browser_navigate({ sessionId, url: 'http://localhost:5678' });
await browser_login({ sessionId, siteName: 'n8n-local' });

// Navigate to workflows page
await browser_click({ sessionId, selector: '[data-test-id="menu-workflows"]' });

// Take screenshot for verification
const screenshot = await browser_take_screenshot({ sessionId });

// Verify workflow exists
const pageInfo = await browser_get_page_info({ sessionId });
console.log('Current page:', pageInfo.title);

await browser_close_session({ sessionId });
```

### 2. Automated Node Addition

```javascript
// Example: Add nodes to a workflow via UI
const sessionId = await browser_create_session({ siteName: 'n8n-node-addition' });
await browser_navigate({ sessionId, url: 'http://localhost:5678/workflow/new' });

// Click the "Add Node" button
await browser_click({ sessionId, selector: '[data-test-id="add-first-step"]' });

// Search for a specific node
await browser_fill({ sessionId, selector: 'input[placeholder="Search for apps and actions..."]', value: 'HTTP Request' });

// Click on the HTTP Request node
await browser_click({ sessionId, selector: '[data-test-id="item-httpRequest"]' });

// Configure the node
await browser_fill({ sessionId, selector: 'input[name="parameters.url"]', value: 'https://api.example.com' });

// Take screenshot to verify
await browser_take_screenshot({ sessionId });

await browser_close_session({ sessionId });
```

### 3. Workflow Testing Automation

```javascript
// Example: Test workflow execution
const sessionId = await browser_create_session({ siteName: 'n8n-testing' });
await browser_navigate({ sessionId, url: 'http://localhost:5678/workflow/123' });

// Execute the workflow
await browser_click({ sessionId, selector: '[data-test-id="execute-workflow-button"]' });

// Wait for execution to complete and take screenshot
await new Promise(resolve => setTimeout(resolve, 3000));
const screenshot = await browser_take_screenshot({ sessionId });

// Check execution status
const logs = await browser_get_logs({ sessionId });
console.log('Execution logs:', logs);

await browser_close_session({ sessionId });
```

## Best Practices

### 1. Session Management
- Always close sessions when done to free resources
- Use meaningful site names for organization
- Keep sessions focused on specific tasks

### 2. Element Selection
- Use data-test-id attributes when available
- Prefer specific selectors over generic ones
- Always verify elements exist before interaction

### 3. Error Handling
- Check screenshots after important actions
- Use browser_get_logs for debugging
- Implement retry logic for flaky operations

### 4. Performance
- Minimize screenshot frequency (they're expensive)
- Close sessions promptly
- Use efficient selectors

## Security Considerations

### Credential Storage
- Credentials are stored in SQLite database
- Passwords are NOT encrypted (use secure environment)
- Only store credentials you own/control
- Regularly clean up stored credentials

### Browser Security
- Runs in headless mode by default
- No persistent browser data
- Each session is isolated
- No access to system files outside project

## Troubleshooting

### Common Issues

#### Browser Launch Failed
```bash
# Reinstall Playwright browsers
npx playwright install
```

#### Element Not Found
- Take screenshot to see current page state
- Check browser logs for JavaScript errors
- Verify selector is correct

#### Session Timeout
- Increase timeout in browser operations
- Check network connectivity
- Verify target site is accessible

### Debug Mode
Enable verbose logging by setting environment variable:
```bash
DEBUG=n8n-mcp:browser npm start
```

## Integration with n8n Workflows

The browser tools can be used within n8n workflows themselves:

1. **Workflow Verification Workflows**: Create workflows that test other workflows
2. **UI Testing Pipelines**: Automate testing of n8n UI changes
3. **Screenshot Monitoring**: Periodic screenshots for visual monitoring
4. **Automated Workflow Creation**: Scripts that create workflows via UI

## Future Enhancements

Planned improvements include:
- **Mobile browser simulation**
- **Network request interception**
- **Advanced screenshot comparison**
- **PDF generation from pages**
- **Video recording of sessions**
- **Integration with testing frameworks**

## Support

For issues with Playwright integration:
1. Check browser logs: `browser_get_logs`
2. Take screenshots for visual debugging
3. Review the troubleshooting section
4. Check GitHub issues for known problems

The Playwright integration makes the n8n MCP Server a powerful tool for both workflow automation and verification, enabling AI agents to interact with n8n just like human users would.
