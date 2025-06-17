/**
 * Axios mock utilities for n8n MCP Server tests
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { jest } from '@jest/globals';

export interface MockResponse {
  data: any;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}

export const createMockAxiosResponse = (options: Partial<MockResponse> = {}): AxiosResponse => {
  return {
    data: options.data ?? {},
    status: options.status ?? 200,
    statusText: options.statusText ?? 'OK',
    headers: options.headers ?? {},
    config: options.config ?? {},
  } as AxiosResponse;
};

/**
 * Create a mock axios instance for testing
 */
export const createMockAxiosInstance = () => {
  const mockRequests: Record<string, any[]> = {};
  const mockResponses: Record<string, MockResponse[]> = {};
  
  const mockInstance: any = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    defaults: {},
    
    // Helper method to add mock response
    addMockResponse(method: string, url: string, response: MockResponse | Error) {
      if (!mockResponses[`${method}:${url}`]) {
        mockResponses[`${method}:${url}`] = [];
      }
      
      if (response instanceof Error) {
        mockResponses[`${method}:${url}`].push(response as any);
      } else {
        mockResponses[`${method}:${url}`].push(response);
      }
    },
    
    // Helper method to get request history
    getRequestHistory(method: string, url: string) {
      return mockRequests[`${method}:${url}`] || [];
    },
    
    // Reset all mocks
    reset() {
      Object.keys(mockRequests).forEach(key => {
        delete mockRequests[key];
      });
      
      Object.keys(mockResponses).forEach(key => {
        delete mockResponses[key];
      });
      
      mockInstance.get.mockReset();
      mockInstance.post.mockReset();
      mockInstance.put.mockReset();
      mockInstance.delete.mockReset();
    }
  };
  
  // Setup method implementations
  ['get', 'post', 'put', 'delete'].forEach(method => {
    mockInstance[method].mockImplementation(async (url: string, data?: any) => {
      const requestKey = `${method}:${url}`;
      
      if (!mockRequests[requestKey]) {
        mockRequests[requestKey] = [];
      }
      
      mockRequests[requestKey].push(data);
      
      if (mockResponses[requestKey] && mockResponses[requestKey].length > 0) {
        const response = mockResponses[requestKey].shift();
        
        if (response instanceof Error) {
          throw response;
        }
        
        return createMockAxiosResponse(response);
      }
      
      throw new Error(`No mock response defined for ${method.toUpperCase()} ${url}`);
    });
  });
  
  return mockInstance;
};

export default {
  createMockAxiosResponse,
  createMockAxiosInstance,
};
