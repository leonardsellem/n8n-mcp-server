/**
 * Credentials Tools Index
 * 
 * Exports all credentials-related tools and handlers.
 */

export {
  ListCredentialsHandler,
  GetCredentialHandler,
  CreateCredentialHandler,
  UpdateCredentialHandler,
  DeleteCredentialHandler,
  TestCredentialHandler,
  ListCredentialTypesHandler
} from './credentials.js';

/**
 * Setup credentials tools
 */
export async function setupCredentialsTools() {
  const {
    getListCredentialsToolDefinition,
    getGetCredentialToolDefinition,
    getCreateCredentialToolDefinition,
    getUpdateCredentialToolDefinition,
    getDeleteCredentialToolDefinition,
    getTestCredentialToolDefinition,
    getListCredentialTypesToolDefinition
  } = await import('./credentials.js');

  return [
    getListCredentialsToolDefinition(),
    getGetCredentialToolDefinition(),
    getCreateCredentialToolDefinition(),
    getUpdateCredentialToolDefinition(),
    getDeleteCredentialToolDefinition(),
    getTestCredentialToolDefinition(),
    getListCredentialTypesToolDefinition()
  ];
}