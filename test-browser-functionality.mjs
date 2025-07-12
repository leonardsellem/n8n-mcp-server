#!/usr/bin/env node

import { BrowserService } from './dist/services/browser-service.js';

async function testBrowserFunctionality() {
  console.log('🧪 Testing browser functionality...');
  
  const browserService = BrowserService.getInstance();
  
  try {
    // Test creating a session
    console.log('1. Creating browser session...');
    const sessionId = await browserService.createSession('test-site');
    console.log('✅ Browser session created:', sessionId);
    
    // Test navigating to a page
    console.log('2. Navigating to a page...');
    const navResult = await browserService.executeAction(sessionId, {
      action: 'goto',
      params: { url: 'https://example.com' }
    });
    console.log('✅ Navigation successful:', navResult.result);
    
    // Test taking a screenshot
    console.log('3. Taking screenshot...');
    const screenshotResult = await browserService.executeAction(sessionId, {
      action: 'screenshot',
      params: {}
    });
    console.log('✅ Screenshot taken:', screenshotResult.result?.screenshot);
    
    // Test getting page title
    console.log('4. Getting page title...');
    const titleResult = await browserService.executeAction(sessionId, {
      action: 'evaluate',
      params: { script: 'document.title' }
    });
    console.log('✅ Page title:', titleResult.result);
    
    // Test getting page content
    console.log('5. Testing element interaction...');
    const elementsResult = await browserService.executeAction(sessionId, {
      action: 'evaluate',
      params: { script: 'document.querySelectorAll("h1").length' }
    });
    console.log('✅ Found', elementsResult.result, 'h1 elements');
    
    // Test getting URL
    console.log('6. Getting current URL...');
    const urlResult = await browserService.executeAction(sessionId, {
      action: 'getUrl',
      params: {}
    });
    console.log('✅ Current URL:', urlResult.result);
    
    // Clean up
    console.log('7. Cleaning up...');
    await browserService.closeSession(sessionId);
    console.log('✅ Session closed');
    
    console.log('🎉 All browser functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Browser test failed:', error);
    process.exit(1);
  }
}

testBrowserFunctionality();
