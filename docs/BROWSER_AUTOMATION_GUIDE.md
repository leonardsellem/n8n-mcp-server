# Browser Automation Guide for n8n MCP Server

The n8n MCP Server now includes comprehensive browser automation capabilities powered by Playwright, enabling agents to interact with web interfaces visually and programmatically.

## Overview

The browser automation features allow agents to:
- Create multiple browser sessions for different sites
- Navigate to web pages and interact with elements
- Take screenshots for visual verification
- Store and manage login credentials securely
- Automate complex web workflows
- Verify n8n workflow UIs visually

## Key Features

### Multi-Session Management
- Create multiple isolated browser sessions
- Each session maintains its own cookies, storage, and state
- Associate sessions with specific sites for organization
- Clean session management with automatic cleanup

### Visual Interaction
- Click, hover, type, and fill form elements
- Drag and drop functionality
- Select dropdown options
- Upload files
- Navigate browser history

### Authentication & State Management
- Store login credentials securely (encrypted)
- Automated login workflows
- Save and restore browser sessions
- Cookie management

### Workflow Verification
- Take screenshots at any point
- Get page information (title, URL)
- Execute custom JavaScript
- Monitor browser logs for debugging

## Available Tools

### Session Management

#### `browser_create_session`
Creates a new browser session for web automation.

```javascript
{
  "siteName": "optional-site-name"  // For organizing sessions
}
```

#### `browser_list_sessions`
Lists all active browser sessions.

#### `browser_close_session`
Closes a browser session and cleans up resources.

```javascript
{
  "sessionId": "session-id-to-close"
}
```

### Navigation & Page Actions

#### `browser_navigate`
Navigate to a specific URL.

```javascript
{
  "sessionId": "your-session-id",
  "url": "https://example.com"
}
```

#### `browser_take_screenshot`
Capture a screenshot of the current page.

```javascript
{
  "sessionId": "your-session-id"
}
```

#### `browser_get_page_info`
Get current page title and URL.

```javascript
{
  "sessionId": "your-session-id"
}
```

### Element Interaction

#### `browser_click`
Click an element using CSS selector.

```javascript
{
  "sessionId": "your-session-id",
  "selector": "#submit-button"
}
```

#### `browser_type`
Type text into an input field.

```javascript
{
  "sessionId": "your-session-id",
  "selector": "#username",
  "text": "user@example.com"
}
```

#### `browser_fill`
Fill an input field (clears existing content first).

```javascript
{
  "sessionId": "your-session-id",
  "selector": "#password",
  "value": "secure-password"
}
```

#### `browser_hover`
Hover over an element.

```javascript
{
  "sessionId": "your-session-id",
  "selector": ".dropdown-trigger"
}
```

### Advanced Interactions

#### `browser_drag_and_drop`
Drag one element to another.

```javascript
{
  "sessionId": "your-session-id",
  "source": ".draggable-item",
  "target": ".drop-zone"
}
```

#### `browser_select_option`
Select an option from a dropdown.

```javascript
{
  "sessionId": "your-session-id",
  "selector": "#country-select",
  "value": "US"
}
```

#### `browser_upload_file`
Upload files to a file input.

```javascript
{
  "sessionId": "your-session-id",
  "selector": "#file-upload",
  "files": ["/path/to/file.pdf"]
}
```

### Authentication & Credentials

#### `browser_store_credentials`
Store login credentials for a site.

```javascript
{
  "siteName": "my-app",
  "username": "user@example.com",
  "password": "secure-password",
  "siteUrl": "https://app.example.com/login",
  "loginSelectors": {
    "username": "#email",
    "password": "#password",
    "submit": "#login-button"
  }
}
```

#### `browser_login`
Perform automated login using stored credentials.

```javascript
{
  "sessionId": "your-session-id",
  "siteName": "my-app",
  "url": "https://app.example.com/login"  // Optional
}
```

#### `browser_list_credentials`
List all stored credentials (passwords not returned).

### Session State Management

#### `browser_save_session`
Save current browser session state (cookies, localStorage, etc.).

```javascript
{
  "sessionId": "your-session-id",
  "siteName": "my-app"
}
```

#### `browser_restore_session`
Restore a previously saved session state.

```javascript
{
  "sessionId": "your-session-id",
  "siteName": "my-app"
}
```

### JavaScript Execution

#### `browser_evaluate`
Execute custom JavaScript in the browser context.

```javascript
{
  "sessionId": "your-session-id",
  "script": "return document.title"
}
```

### Utilities

#### `browser_wait`
Wait for an element to appear or for a timeout.

```javascript
{
  "sessionId": "your-session-id",
  "selector": ".loading-spinner",  // Optional
  "timeout": 30000  // Default: 30000ms
}
```

#### `browser_get_text`
Get text content from an element.

```javascript
{
  "sessionId": "your-session-id",
  "selector": ".status-message"
}
```

#### `browser_get_attribute`
Get an attribute value from an element.

```javascript
{
  "sessionId": "your-session-id",
  "selector": "#submit-button",
  "attribute": "disabled"
}
```

## Use Cases for n8n Workflow Verification

### 1. Visual Workflow Testing

```javascript
// Create a session for n8n
const session = await browser_create_session({siteName: "n8n"});

// Navigate to n8n workflow editor
await browser_navigate({
  sessionId: session.sessionId,
  url: "https://your-n8n-instance.com/workflow/123"
});

// Take screenshot to verify workflow appears correctly
await browser_take_screenshot({sessionId: session.sessionId});

// Click on a node to verify it's interactive
await browser_click({
  sessionId: session.sessionId,
  selector: '[data-name="HTTP Request"]'
});

// Verify node panel opens
await browser_wait({
  sessionId: session.sessionId,
  selector: '.node-settings-panel'
});
```

### 2. Node Configuration Verification

```javascript
// Add a new node via UI
await browser_click({
  sessionId: session.sessionId,
  selector: '.add-node-button'
});

// Search for a specific node
await browser_type({
  sessionId: session.sessionId,
  selector: '.node-search-input',
  text: 'Slack'
});

// Select the node
await browser_click({
  sessionId: session.sessionId,
  selector: '[data-node-type="nodes-base.slack"]'
});

// Configure the node
await browser_fill({
  sessionId: session.sessionId,
  selector: '[data-parameter="channel"]',
  value: '#general'
});

// Take screenshot of configured node
await browser_take_screenshot({sessionId: session.sessionId});
```

### 3. Workflow Execution Monitoring

```javascript
// Navigate to execution view
await browser_navigate({
  sessionId: session.sessionId,
  url: "https://your-n8n-instance.com/executions"
});

// Wait for executions to load
await browser_wait({
  sessionId: session.sessionId,
  selector: '.execution-list'
});

// Check for successful execution
const status = await browser_get_text({
  sessionId: session.sessionId,
  selector: '.execution-status:first-child'
});

// Take screenshot for verification
await browser_take_screenshot({sessionId: session.sessionId});
```

## Best Practices

### 1. Session Management
- Always close sessions when done to free resources
- Use descriptive site names for session organization
- Create separate sessions for different workflows or sites

### 2. Element Selection
- Use stable CSS selectors (IDs, data attributes)
- Avoid selectors based on dynamic content
- Test selectors in browser dev tools first

### 3. Wait Strategies
- Always wait for elements before interacting
- Use appropriate timeouts for different operations
- Consider page load times and network latency

### 4. Error Handling
- Check for element existence before interaction
- Handle timeouts gracefully
- Take screenshots on errors for debugging

### 5. Security
- Store credentials securely using the credential service
- Don't hardcode passwords in automation scripts
- Use environment variables for sensitive data

## Common CSS Selectors for n8n

### Workflow Canvas
```css
.node-view-container        /* Main canvas area */
.node                       /* Individual nodes */
.node-default              /* Default node style */
[data-name="Node Name"]    /* Specific node by name */
.connection                /* Node connections */
```

### Node Panel
```css
.node-settings-panel       /* Node configuration panel */
.parameter-item           /* Individual parameters */
[data-parameter="name"]   /* Specific parameter */
.node-credentials         /* Credentials section */
```

### UI Controls
```css
.add-node-button          /* Add node button */
.node-search-input        /* Node search field */
.execute-workflow-button  /* Execute button */
.save-button             /* Save workflow button */
```

### Execution View
```css
.execution-list          /* List of executions */
.execution-status        /* Execution status indicators */
.execution-time          /* Execution timestamps */
```

## Troubleshooting

### Common Issues

1. **Element not found**: Use `browser_wait` before interacting with elements
2. **Stale sessions**: Recreate sessions if they become unresponsive
3. **Timeout errors**: Increase timeout values for slow-loading pages
4. **Login failures**: Verify stored credentials and selectors

### Debugging Tools

- Use `browser_take_screenshot` frequently during development
- Check `browser_get_logs` for JavaScript errors
- Use `browser_get_page_info` to verify page navigation
- Execute custom JavaScript with `browser_evaluate` for debugging

## Integration with n8n Workflows

The browser automation tools integrate seamlessly with existing n8n MCP tools:

1. **Discovery**: Use n8n documentation tools to understand nodes
2. **Building**: Configure workflows using MCP tools
3. **Deployment**: Create workflows via n8n management API
4. **Verification**: Use browser tools to visually verify the deployed workflow
5. **Testing**: Automate UI testing of complex workflows

This creates a complete workflow lifecycle from design to visual verification.
