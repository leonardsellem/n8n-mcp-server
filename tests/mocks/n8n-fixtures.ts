/**
 * Mock fixtures for n8n API responses
 */

import { Workflow, Execution } from '../../src/types/index.js';

/**
 * Create a mock workflow for testing
 */
export const createMockWorkflow = (overrides: Partial<Workflow> = {}): Workflow => {
  const id = overrides.id ?? 'mock-workflow-1';
  
  return {
    id,
    name: overrides.name ?? `Mock Workflow ${id}`,
    active: overrides.active ?? false,
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
    nodes: overrides.nodes ?? [
      {
        id: 'start',
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        parameters: {},
        position: [100, 300],
      },
    ],
    connections: overrides.connections ?? {},
    settings: overrides.settings ?? {},
    staticData: overrides.staticData ?? null,
    pinData: overrides.pinData ?? {},
    ...overrides,
  };
};

/**
 * Create multiple mock workflows
 */
export const createMockWorkflows = (count: number = 3): Workflow[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockWorkflow({
      id: `mock-workflow-${i + 1}`,
      name: `Mock Workflow ${i + 1}`,
      active: i % 2 === 0, // Alternate active status
    })
  );
};

/**
 * Create a mock execution for testing
 */
export const createMockExecution = (overrides: Partial<Execution> = {}): Execution => {
  const id = overrides.id ?? 'mock-execution-1';
  const workflowId = overrides.workflowId ?? 'mock-workflow-1';
  
  return {
    id,
    workflowId,
    finished: overrides.finished ?? true,
    mode: overrides.mode ?? 'manual',
    waitTill: overrides.waitTill ?? null,
    startedAt: overrides.startedAt ?? new Date().toISOString(),
    stoppedAt: overrides.stoppedAt ?? new Date().toISOString(),
    status: overrides.status ?? 'success',
    data: overrides.data ?? {
      resultData: {
        runData: {},
      },
    },
    workflowData: overrides.workflowData ?? createMockWorkflow({ id: workflowId }),
    ...overrides,
  };
};

/**
 * Create multiple mock executions
 */
export const createMockExecutions = (count: number = 3): Execution[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockExecution({
      id: `mock-execution-${i + 1}`,
      workflowId: `mock-workflow-${(i % 2) + 1}`, // Alternate between two workflows
      status: i % 3 === 0 ? 'success' : i % 3 === 1 ? 'error' : 'waiting',
    })
  );
};

/**
 * Create mock n8n API responses
 */
export const mockApiResponses = {
  workflows: {
    list: {
      data: createMockWorkflows(),
    },
    single: (id: string = 'mock-workflow-1') => createMockWorkflow({ id }),
    create: (workflow: Partial<Workflow> = {}) => createMockWorkflow(workflow),
    update: (id: string = 'mock-workflow-1', workflow: Partial<Workflow> = {}) => 
      createMockWorkflow({ ...workflow, id }),
    delete: { success: true },
    activate: (id: string = 'mock-workflow-1') => createMockWorkflow({ id, active: true }),
    deactivate: (id: string = 'mock-workflow-1') => createMockWorkflow({ id, active: false }),
  },
  
  executions: {
    list: {
      data: createMockExecutions(),
    },
    single: (id: string = 'mock-execution-1') => createMockExecution({ id }),
    delete: { success: true },
  },
};

export default {
  createMockWorkflow,
  createMockWorkflows,
  createMockExecution,
  createMockExecutions,
  mockApiResponses,
};
