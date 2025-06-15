/**
 * n8n API Client
 * 
 * This module provides a client for interacting with the n8n API.
 */

import axios, { AxiosInstance } from 'axios';
import { EnvConfig } from '../config/environment.js';
import { handleAxiosError, N8nApiError } from '../errors/index.js';

/**
 * n8n API Client class for making requests to the n8n API
 */
export class N8nApiClient {
  private axiosInstance: AxiosInstance;
  private config: EnvConfig;

  /**
   * Create a new n8n API client
   * 
   * @param config Environment configuration
   */
  constructor(config: EnvConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.n8nApiUrl,
      headers: {
        'X-N8N-API-KEY': config.n8nApiKey,
        'Accept': 'application/json',
      },
      timeout: 10000, // 10 seconds
    });

    // Add request debugging if debug mode is enabled
    if (config.debug) {
      this.axiosInstance.interceptors.request.use(request => {
        console.error(`[DEBUG] Request: ${request.method?.toUpperCase()} ${request.url}`);
        return request;
      });

      this.axiosInstance.interceptors.response.use(response => {
        console.error(`[DEBUG] Response: ${response.status} ${response.statusText}`);
        return response;
      });
    }
  }

  /**
   * Check connectivity to the n8n API
   * 
   * @returns Promise that resolves if connectivity check succeeds
   * @throws N8nApiError if connectivity check fails
   */
  async checkConnectivity(): Promise<void> {
    try {
      // Try to fetch health endpoint or workflows
      const response = await this.axiosInstance.get('/workflows');
      
      if (response.status !== 200) {
        throw new N8nApiError(
          'n8n API connectivity check failed',
          response.status
        );
      }
      
      if (this.config.debug) {
        console.error(`[DEBUG] Successfully connected to n8n API at ${this.config.n8nApiUrl}`);
        console.error(`[DEBUG] Found ${response.data.data?.length || 0} workflows`);
      }
    } catch (error) {
      throw handleAxiosError(error, 'Failed to connect to n8n API');
    }
  }

  /**
   * Get the axios instance for making custom requests
   * 
   * @returns Axios instance
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Get all workflows from n8n
   * 
   * @returns Array of workflow objects
   */
  async getWorkflows(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/workflows');
      return response.data.data || [];
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch workflows');
    }
  }

  /**
   * Get a specific workflow by ID
   * 
   * @param id Workflow ID
   * @returns Workflow object
   */
  async getWorkflow(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch workflow ${id}`);
    }
  }

  /**
   * Get all workflow executions
   * 
   * @returns Array of execution objects
   */
  async getExecutions(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/executions');
      return response.data.data || [];
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch executions');
    }
  }

  /**
   * Get a specific execution by ID
   * 
   * @param id Execution ID
   * @returns Execution object
   */
  async getExecution(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/executions/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch execution ${id}`);
    }
  }

  /**
   * Execute a workflow by ID
   * 
   * @param id Workflow ID
   * @param data Optional data to pass to the workflow
   * @returns Execution result
   */
  async executeWorkflow(id: string, data?: Record<string, any>): Promise<any> {
    try {
      const response = await this.axiosInstance.post(`/workflows/${id}/execute`, data || {});
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to execute workflow ${id}`);
    }
  }

  /**
   * Create a new workflow
   * 
   * @param workflow Workflow object to create
   * @returns Created workflow
   */
  async createWorkflow(workflow: Record<string, any>): Promise<any> {
    try {
      // Make sure settings property is present
      if (!workflow.settings) {
        workflow.settings = {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600,
          timezone: "UTC"
        };
      }
      
      // Remove read-only properties that cause issues
      const workflowToCreate = { ...workflow };
      delete workflowToCreate.active; // Remove active property as it's read-only
      delete workflowToCreate.id; // Remove id property if it exists
      delete workflowToCreate.createdAt; // Remove createdAt property if it exists
      delete workflowToCreate.updatedAt; // Remove updatedAt property if it exists
      // Note: Keep tags for now but handle them properly
      
      // Log request for debugging
      console.error('[DEBUG] Creating workflow with data:', JSON.stringify(workflowToCreate, null, 2));
      
      const response = await this.axiosInstance.post('/workflows', workflowToCreate);
      return response.data;
    } catch (error) {
      console.error('[ERROR] Create workflow error:', error);
      throw handleAxiosError(error, 'Failed to create workflow');
    }
  }

  /**
   * Update an existing workflow
   * 
   * @param id Workflow ID
   * @param workflow Updated workflow object
   * @returns Updated workflow
   */
  async updateWorkflow(id: string, workflow: Record<string, any>): Promise<any> {
    try {
      // Remove read-only properties that cause issues with n8n API v1
      const workflowToUpdate = { ...workflow };
      delete workflowToUpdate.id; // Remove id property as it's read-only
      delete workflowToUpdate.createdAt; // Remove createdAt property as it's read-only
      delete workflowToUpdate.updatedAt; // Remove updatedAt property as it's read-only
      delete workflowToUpdate.active; // Remove active property as it's read-only
      // Note: Keep tags for now but handle them properly

      // Log request for debugging
      if (this.config.debug) {
        console.error('[DEBUG] Updating workflow with data:', JSON.stringify(workflowToUpdate, null, 2));
      }

      const response = await this.axiosInstance.put(`/workflows/${id}`, workflowToUpdate);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to update workflow ${id}`);
    }
  }

  /**
   * Delete a workflow
   * 
   * @param id Workflow ID
   * @returns Deleted workflow
   */
  async deleteWorkflow(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to delete workflow ${id}`);
    }
  }

  /**
   * Activate a workflow
   * 
   * @param id Workflow ID
   * @returns Activated workflow
   */
  async activateWorkflow(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.post(`/workflows/${id}/activate`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to activate workflow ${id}`);
    }
  }

  /**
   * Deactivate a workflow
   * 
   * @param id Workflow ID
   * @returns Deactivated workflow
   */
  async deactivateWorkflow(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.post(`/workflows/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to deactivate workflow ${id}`);
    }
  }
  
  /**
   * Delete an execution
   * 
   * @param id Execution ID
   * @returns Deleted execution or success message
   */
  async deleteExecution(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/executions/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to delete execution ${id}`);
    }
  }

  /**
   * Get all credentials from n8n
   *
   * @returns Array of credential objects (without sensitive data)
   */
  async getCredentials(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/credentials');
      return response.data.data || [];
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch credentials');
    }
  }

  /**
   * Get a specific credential by ID
   *
   * @param id Credential ID
   * @returns Credential object (without sensitive data)
   */
  async getCredential(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch credential ${id}`);
    }
  }

  /**
   * Create a new credential
   *
   * @param credential Credential object to create
   * @returns Created credential
   */
  async createCredential(credential: Record<string, any>): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/credentials', credential);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to create credential');
    }
  }

  /**
   * Update an existing credential
   *
   * @param id Credential ID
   * @param credential Updated credential object
   * @returns Updated credential
   */
  async updateCredential(id: string, credential: Record<string, any>): Promise<any> {
    try {
      const response = await this.axiosInstance.put(`/credentials/${id}`, credential);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to update credential ${id}`);
    }
  }

  /**
   * Delete a credential
   *
   * @param id Credential ID
   * @returns Deleted credential or success message
   */
  async deleteCredential(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to delete credential ${id}`);
    }
  }

  /**
   * Test credential configuration
   *
   * @param credential Credential data to test
   * @returns Test result
   */
  async testCredential(credential: Record<string, any>): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/credentials/test', credential);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to test credential');
    }
  }

  /**
   * Get all available credential types
   *
   * @returns Array of credential type objects
   */
  async getCredentialTypes(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/credential-types');
      return response.data.data || [];
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch credential types');
    }
  }

  /**
   * Get all available node types from n8n
   *
   * @returns Array of node type objects
   */
  async getNodeTypes(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/node-types');
      return response.data.data || [];
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch node types');
    }
  }

  /**
   * Get workflows that can be used as templates
   *
   * @param options Query options for filtering templates
   * @returns Array of template workflows
   */
  async getTemplates(options: { category?: string; search?: string } = {}): Promise<any[]> {
    try {
      // Try templates endpoint first, fallback to workflows if needed
      let endpoint = '/templates';
      const params = new URLSearchParams();
      
      if (options.category) params.append('category', options.category);
      if (options.search) params.append('search', options.search);
      
      try {
        const response = await this.axiosInstance.get(`${endpoint}?${params.toString()}`);
        return response.data.data || [];
      } catch (error: any) {
        // If templates endpoint doesn't exist, fall back to workflows
        if (error.response?.status === 404) {
          const workflowResponse = await this.axiosInstance.get('/workflows');
          const workflows = workflowResponse.data.data || [];
          
          // Filter workflows that could serve as templates
          return workflows.filter((workflow: any) => {
            if (options.search) {
              const searchLower = options.search.toLowerCase();
              return workflow.name?.toLowerCase().includes(searchLower) ||
                     workflow.tags?.some((tag: any) => tag.name?.toLowerCase().includes(searchLower));
            }
            return true;
          });
        }
        throw error;
      }
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch templates');
    }
  }
}

/**
 * Create and return a configured n8n API client
 * 
 * @param config Environment configuration
 * @returns n8n API client instance
 */
export function createApiClient(config: EnvConfig): N8nApiClient {
  return new N8nApiClient(config);
}
