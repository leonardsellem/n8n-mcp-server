import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { enhancedBrowserService } from '../services/enhanced-browser-service.js';
import { CredentialService } from '../services/credential-service.js';
import { logger } from '../utils/logger.js';

export const browserTools: Tool[] = [
  {
    name: 'browser_create_session',
    description: 'Create a new browser session for automated web interactions. Returns a session ID to use for subsequent operations.',
    inputSchema: {
      type: 'object',
      properties: {
        siteName: {
          type: 'string',
          description: 'Optional site name to associate with this session (helpful for organizing sessions)'
        }
      }
    }
  },
  {
    name: 'browser_navigate',
    description: 'Navigate to a URL in the specified browser session.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID from browser_create_session'
        },
        url: {
          type: 'string',
          description: 'URL to navigate to'
        }
      },
      required: ['sessionId', 'url']
    }
  },
  {
    name: 'browser_take_screenshot',
    description: 'Take a screenshot of the current page in the browser session.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID'
        }
      },
      required: ['sessionId']
    }
  },
  {
    name: 'browser_click',
    description: 'Click an element on the page using CSS selector.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID'
        },
        selector: {
          type: 'string',
          description: 'CSS selector for the element to click'
        }
      },
      required: ['sessionId', 'selector']
    }
  },
  {
    name: 'browser_fill',
    description: 'Fill an input field with text (clears existing content first).',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID'
        },
        selector: {
          type: 'string',
          description: 'CSS selector for the input element'
        },
        value: {
          type: 'string',
          description: 'Value to fill into the element'
        }
      },
      required: ['sessionId', 'selector', 'value']
    }
  },
  {
    name: 'browser_get_page_info',
    description: 'Get current page information (title, URL, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID'
        }
      },
      required: ['sessionId']
    }
  },
  {
    name: 'browser_login',
    description: 'Perform automated login using stored credentials for a specific site.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID'
        },
        siteName: {
          type: 'string',
          description: 'Site name to login to (must have stored credentials)'
        },
        url: {
          type: 'string',
          description: 'Optional login URL to navigate to first'
        }
      },
      required: ['sessionId', 'siteName']
    }
  },
  {
    name: 'browser_store_credentials',
    description: 'Store login credentials for a specific site.',
    inputSchema: {
      type: 'object',
      properties: {
        siteName: {
          type: 'string',
          description: 'Unique site name identifier'
        },
        username: {
          type: 'string',
          description: 'Username or email for login'
        },
        password: {
          type: 'string',
          description: 'Password for login'
        },
        siteUrl: {
          type: 'string',
          description: 'URL of the login page'
        },
        loginSelectors: {
          type: 'object',
          description: 'Optional custom CSS selectors for login elements',
          properties: {
            username: {
              type: 'string',
              description: 'CSS selector for username field'
            },
            password: {
              type: 'string',
              description: 'CSS selector for password field'
            },
            submit: {
              type: 'string',
              description: 'CSS selector for submit button'
            }
          }
        }
      },
      required: ['siteName', 'username', 'password']
    }
  },
  {
    name: 'browser_close_session',
    description: 'Close a browser session and clean up resources.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Browser session ID to close'
        }
      },
      required: ['sessionId']
    }
  },
  {
    name: 'browser_get_logs',
    description: 'Get browser automation logs for debugging.',
    inputSchema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          description: 'Optional session ID to filter logs'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of logs to return',
          default: 100
        }
      }
    }
  },
  {
    name: 'browser_list_credentials',
    description: 'List all stored credentials (passwords are not returned).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

export async function handleBrowserTool(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      case 'browser_create_session':
        return await enhancedBrowserService.createSession(args.siteName);

      case 'browser_navigate':
        return await enhancedBrowserService.navigate(args.sessionId, args.url);

      case 'browser_take_screenshot':
        return await enhancedBrowserService.takeScreenshot(args.sessionId);

      case 'browser_click':
        return await enhancedBrowserService.smartClick(args.sessionId, args.selector);

      case 'browser_fill':
        return await enhancedBrowserService.smartFill(args.sessionId, args.selector, args.value);

      case 'browser_get_page_info':
        return await enhancedBrowserService.getPageInfo(args.sessionId);

      case 'browser_login':
        return await enhancedBrowserService.enhancedLogin(args.sessionId, args.siteName, args.url);

      case 'browser_store_credentials':
        await enhancedBrowserService.storeCredentials({
          siteName: args.siteName,
          username: args.username,
          password: args.password,
          siteUrl: args.siteUrl,
          loginSelectors: args.loginSelectors
        });
        return { success: true, message: 'Credentials stored successfully' };

      case 'browser_close_session':
        await enhancedBrowserService.closeSession(args.sessionId);
        return { success: true, message: 'Session closed successfully' };

      case 'browser_get_logs':
        return await enhancedBrowserService.getBrowserLogs(args.sessionId);

      case 'browser_list_credentials':
        return await enhancedBrowserService.listCredentials();

      default:
        throw new Error(`Unknown browser tool: ${name}`);
    }
  } catch (error: any) {
    logger.error(`Browser tool error (${name}):`, error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred'
    };
  }
}
