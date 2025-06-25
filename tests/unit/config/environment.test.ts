import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import findConfig from 'find-config'; // Use the actual find-config

import { loadEnvironmentVariables } from '../../../src/config/environment';
import { ENV_VARS } from '../../../src/config/environment'; // To access defined var names

// Determine project root for placing dummy .env file
let projectRootDir: string | null = null;
let dummyEnvPath: string | null = null;

try {
  const packageJsonPath = findConfig('package.json');
  if (packageJsonPath) {
    projectRootDir = path.dirname(packageJsonPath);
    dummyEnvPath = path.resolve(projectRootDir, '.env.test_dummy'); // Use a distinct name
  } else {
    console.error("Could not find project root (package.json). Tests involving .env file might fail or be skipped.");
  }
} catch (e) {
  console.error("Error finding project root:", e);
}


const originalEnv = { ...process.env };

const clearTestEnvVars = () => {
  delete process.env[ENV_VARS.N8N_API_URL];
  delete process.env[ENV_VARS.N8N_API_KEY];
  delete process.env[ENV_VARS.N8N_WEBHOOK_USERNAME];
  delete process.env[ENV_VARS.N8N_WEBHOOK_PASSWORD];
};

const saveEnvState = () => {
  return { ...process.env };
};

const DUMMY_ENV_CONTENT = `
${ENV_VARS.N8N_API_URL}=http://dummyapi.com
${ENV_VARS.N8N_API_KEY}=dummyapikey
${ENV_VARS.N8N_WEBHOOK_USERNAME}=dummyuser
${ENV_VARS.N8N_WEBHOOK_PASSWORD}=dummypassword
`;

describe('loadEnvironmentVariables', () => {
  beforeEach(() => {
    jest.resetModules(); // Reset module cache, critical for dotenv
    process.env = { ...originalEnv }; // Restore original env
    clearTestEnvVars(); // Clear our specific vars

    // Ensure dummy .env is clean before each test that might create it
    if (dummyEnvPath && fs.existsSync(dummyEnvPath)) {
      fs.unlinkSync(dummyEnvPath);
    }
  });

  afterEach(() => {
    // Restore original env
    process.env = { ...originalEnv };
    // Clean up dummy .env file if it exists after a test
    if (dummyEnvPath && fs.existsSync(dummyEnvPath)) {
      try {
        fs.unlinkSync(dummyEnvPath);
      } catch (e) {
        // In case the test itself deleted it, or it was never created.
      }
    }
  });

  // Test Case 1: All environment variables set
  test('should not change process.env if all required env vars are already set', () => {
    process.env[ENV_VARS.N8N_API_URL] = 'http://existingapi.com';
    process.env[ENV_VARS.N8N_API_KEY] = 'existingapikey';
    process.env[ENV_VARS.N8N_WEBHOOK_USERNAME] = 'existinguser';
    process.env[ENV_VARS.N8N_WEBHOOK_PASSWORD] = 'existingpassword';

    const envStateBeforeLoad = saveEnvState();
    loadEnvironmentVariables(); // Should not load .env because vars are present
    
    expect(process.env).toEqual(envStateBeforeLoad);
  });

  // Test Case 2: No environment variables set, .env file exists
  test('should load vars from .env file if no required env vars are set and .env exists', () => {
    if (!projectRootDir || !dummyEnvPath) {
      console.warn("Skipping test: Project root not found, cannot create dummy .env file.");
      return; // or expect.hasAssertions() with a different path
    }
    
    // Pre-condition: specific vars are not set (cleared in beforeEach)
    expect(process.env[ENV_VARS.N8N_API_URL]).toBeUndefined();

    fs.writeFileSync(dummyEnvPath, DUMMY_ENV_CONTENT);

    // Temporarily point findConfig's "idea" of .env to our dummy .env by hijacking process.env for dotenv
    // This is tricky because loadEnvironmentVariables uses findConfig to locate package.json, then path.resolve for .env
    // The most straightforward way is to ensure findConfig returns our projectRootDir, and then dotenv loads our dummyEnvPath.
    // The current implementation of loadEnvironmentVariables is:
    //   const projectRoot = findConfig('package.json');
    //   if (projectRoot) {
    //     const envPath = path.resolve(path.dirname(projectRoot), '.env'); <--- This is the key
    //     dotenv.config({ path: envPath });
    //   }
    // So, for this test, we need to make `path.resolve` point to `dummyEnvPath` OR make the actual `.env` the dummy.
    // Let's rename the actual .env if it exists, place our dummy, then restore.
    // A simpler approach for testing: the function loads ".env". So we make our dummy file THE ".env".
    
    const actualEnvPath = path.resolve(projectRootDir, '.env');
    let actualEnvRenamedPath: string | null = null;
    if (fs.existsSync(actualEnvPath)) {
      actualEnvRenamedPath = actualEnvPath + '.backup';
      fs.renameSync(actualEnvPath, actualEnvRenamedPath);
    }

    fs.writeFileSync(actualEnvPath, DUMMY_ENV_CONTENT); // Write our dummy content to the actual .env path

    try {
      loadEnvironmentVariables();

      expect(process.env[ENV_VARS.N8N_API_URL]).toBe('http://dummyapi.com');
      expect(process.env[ENV_VARS.N8N_API_KEY]).toBe('dummyapikey');
      expect(process.env[ENV_VARS.N8N_WEBHOOK_USERNAME]).toBe('dummyuser');
      expect(process.env[ENV_VARS.N8N_WEBHOOK_PASSWORD]).toBe('dummypassword');
    } finally {
      // Clean up: remove our dummy .env and restore original .env if it was renamed
      if (fs.existsSync(actualEnvPath)) {
        fs.unlinkSync(actualEnvPath);
      }
      if (actualEnvRenamedPath && fs.existsSync(actualEnvRenamedPath)) {
        fs.renameSync(actualEnvRenamedPath, actualEnvPath);
      }
    }
  });

  // Test Case 3: No environment variables set, no .env file exists
  test('should not change process.env if no required env vars are set and no .env file exists', () => {
    if (!projectRootDir) {
      console.warn("Skipping test: Project root not found, .env file check might be unreliable.");
      return;
    }
    
    const actualEnvPath = path.resolve(projectRootDir, '.env');
    let actualEnvRenamedPath: string | null = null;
    
    // Temporarily remove the .env file if it exists to simulate "no .env file exists"
    if (fs.existsSync(actualEnvPath)) {
      actualEnvRenamedPath = actualEnvPath + '.backup_test3';
      fs.renameSync(actualEnvPath, actualEnvRenamedPath);
    }

    try {
      // Vars are cleared in beforeEach
      const envStateBeforeLoad = saveEnvState();
      loadEnvironmentVariables(); // Should not find a .env file to load
      
      expect(process.env[ENV_VARS.N8N_API_URL]).toBeUndefined();
      expect(process.env[ENV_VARS.N8N_API_KEY]).toBeUndefined();
      expect(process.env[ENV_VARS.N8N_WEBHOOK_USERNAME]).toBeUndefined();
      expect(process.env[ENV_VARS.N8N_WEBHOOK_PASSWORD]).toBeUndefined();
      // Check if other env vars were not disturbed (more robust check)
      expect(process.env).toEqual(envStateBeforeLoad);
    } finally {
      // Restore the original .env file if it was renamed
      if (actualEnvRenamedPath && fs.existsSync(actualEnvRenamedPath)) {
        fs.renameSync(actualEnvRenamedPath, actualEnvPath);
      }
    }
  });

  // Test Case 4: Some environment variables set
  test('should not change process.env if some (but not all) required env vars are set', () => {
    process.env[ENV_VARS.N8N_API_URL] = 'http://partialapi.com';
    process.env[ENV_VARS.N8N_API_KEY] = 'partialapikey';
    // N8N_WEBHOOK_USERNAME and N8N_WEBHOOK_PASSWORD are not set (cleared by beforeEach)

    const envStateBeforeLoad = saveEnvState();
    loadEnvironmentVariables(); // Should not load .env because some vars are present
    
    expect(process.env).toEqual(envStateBeforeLoad);
    expect(process.env[ENV_VARS.N8N_API_URL]).toBe('http://partialapi.com');
    expect(process.env[ENV_VARS.N8N_API_KEY]).toBe('partialapikey');
    expect(process.env[ENV_VARS.N8N_WEBHOOK_USERNAME]).toBeUndefined();
    expect(process.env[ENV_VARS.N8N_WEBHOOK_PASSWORD]).toBeUndefined();
  });
});
