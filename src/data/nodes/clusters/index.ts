/**
 * Cluster Nodes Registry
 * 
 * Exports all cluster node definitions for distributed processing.
 * These nodes enable scaling workflows across multiple n8n instances.
 */

import { NodeTypeInfo } from '../../node-types.js';

// Core Cluster Nodes
export const clusterNodes = {
  'n8n-nodes-base.splitInBatches': {
    name: 'n8n-nodes-base.splitInBatches',
    displayName: 'Split In Batches',
    description: 'Split incoming data into smaller batches for distributed processing across cluster nodes',
    category: 'Cluster Nodes',
    subcategory: 'Data Distribution',
    properties: [
      {
        name: 'batchSize',
        displayName: 'Batch Size',
        type: 'number',
        required: true,
        default: 100,
        description: 'Number of items per batch'
      },
      {
        name: 'mode',
        displayName: 'Mode',
        type: 'options',
        required: true,
        default: 'splitByCount',
        options: [
          { name: 'Split by Count', value: 'splitByCount' },
          { name: 'Split by Percentage', value: 'splitByPercentage' },
          { name: 'Split by Size', value: 'splitBySize' }
        ],
        description: 'How to split the data'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Batches', description: 'Split data batches' }],
    credentials: [],
    regularNode: true,
    codeable: false,
    triggerNode: false,
    webhookSupport: false,
    version: [1, 2],
    defaults: { name: 'Split In Batches', batchSize: 100, mode: 'splitByCount' },
    aliases: ['split', 'batch', 'distribute', 'chunk']
  } as NodeTypeInfo,

  'n8n-nodes-base.clusterMerge': {
    name: 'n8n-nodes-base.clusterMerge',
    displayName: 'Cluster Merge',
    description: 'Merge results from distributed cluster processing back into a single data stream',
    category: 'Cluster Nodes',
    subcategory: 'Data Aggregation',
    properties: [
      {
        name: 'mergeMode',
        displayName: 'Merge Mode',
        type: 'options',
        required: true,
        default: 'append',
        options: [
          { name: 'Append All', value: 'append' },
          { name: 'Merge Objects', value: 'merge' },
          { name: 'Combine Arrays', value: 'combine' },
          { name: 'Keep Unique', value: 'unique' }
        ],
        description: 'How to merge the distributed results'
      },
      {
        name: 'waitForAll',
        displayName: 'Wait for All Batches',
        type: 'boolean',
        required: false,
        default: true,
        description: 'Wait for all cluster nodes to complete before merging'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Merged', description: 'Merged cluster results' }],
    credentials: [],
    regularNode: true,
    codeable: false,
    triggerNode: false,
    webhookSupport: false,
    version: [1, 2],
    defaults: { name: 'Cluster Merge', mergeMode: 'append', waitForAll: true },
    aliases: ['merge', 'combine', 'aggregate', 'collect']
  } as NodeTypeInfo,

  'n8n-nodes-base.clusterBalance': {
    name: 'n8n-nodes-base.clusterBalance',
    displayName: 'Cluster Load Balancer',
    description: 'Distribute workload across available cluster nodes based on load balancing strategies',
    category: 'Cluster Nodes',
    subcategory: 'Load Distribution',
    properties: [
      {
        name: 'strategy',
        displayName: 'Load Balancing Strategy',
        type: 'options',
        required: true,
        default: 'roundRobin',
        options: [
          { name: 'Round Robin', value: 'roundRobin' },
          { name: 'Least Connections', value: 'leastConnections' },
          { name: 'Weighted Round Robin', value: 'weightedRoundRobin' },
          { name: 'Resource Based', value: 'resourceBased' }
        ],
        description: 'Strategy for distributing load across cluster nodes'
      },
      {
        name: 'maxConcurrent',
        displayName: 'Max Concurrent',
        type: 'number',
        required: false,
        default: 10,
        description: 'Maximum concurrent executions per node'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Distributed', description: 'Load balanced output' }],
    credentials: [],
    regularNode: true,
    codeable: false,
    triggerNode: false,
    webhookSupport: false,
    version: [1],
    defaults: { name: 'Cluster Load Balancer', strategy: 'roundRobin', maxConcurrent: 10 },
    aliases: ['balance', 'distribute', 'loadbalance']
  } as NodeTypeInfo,

  'n8n-nodes-base.clusterSync': {
    name: 'n8n-nodes-base.clusterSync',
    displayName: 'Cluster Sync',
    description: 'Synchronize data and state across cluster nodes for consistent distributed processing',
    category: 'Cluster Nodes',
    subcategory: 'Synchronization',
    properties: [
      {
        name: 'syncType',
        displayName: 'Sync Type',
        type: 'options',
        required: true,
        default: 'state',
        options: [
          { name: 'State Sync', value: 'state' },
          { name: 'Data Sync', value: 'data' },
          { name: 'Config Sync', value: 'config' },
          { name: 'Cache Sync', value: 'cache' }
        ],
        description: 'Type of synchronization to perform'
      },
      {
        name: 'syncInterval',
        displayName: 'Sync Interval (ms)',
        type: 'number',
        required: false,
        default: 1000,
        description: 'Interval between sync operations in milliseconds'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: true }],
    outputs: [{ type: 'main', displayName: 'Synced', description: 'Synchronized data' }],
    credentials: [],
    regularNode: true,
    codeable: false,
    triggerNode: false,
    webhookSupport: false,
    version: [1],
    defaults: { name: 'Cluster Sync', syncType: 'state', syncInterval: 1000 },
    aliases: ['sync', 'synchronize', 'coordinate']
  } as NodeTypeInfo,

  'n8n-nodes-base.clusterMonitor': {
    name: 'n8n-nodes-base.clusterMonitor',
    displayName: 'Cluster Monitor',
    description: 'Monitor cluster node health, performance, and resource utilization',
    category: 'Cluster Nodes',
    subcategory: 'Monitoring',
    properties: [
      {
        name: 'metrics',
        displayName: 'Metrics to Monitor',
        type: 'multiOptions',
        required: true,
        default: ['cpu', 'memory', 'disk'],
        options: [
          { name: 'CPU Usage', value: 'cpu' },
          { name: 'Memory Usage', value: 'memory' },
          { name: 'Disk Usage', value: 'disk' },
          { name: 'Network I/O', value: 'network' },
          { name: 'Active Workflows', value: 'workflows' },
          { name: 'Queue Length', value: 'queue' }
        ],
        description: 'System metrics to monitor'
      },
      {
        name: 'alertThreshold',
        displayName: 'Alert Threshold (%)',
        type: 'number',
        required: false,
        default: 80,
        description: 'Threshold percentage for triggering alerts'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Input', required: false }],
    outputs: [
      { type: 'main', displayName: 'Metrics', description: 'Cluster health metrics' },
      { type: 'main', displayName: 'Alerts', description: 'Threshold alerts' }
    ],
    credentials: [],
    regularNode: true,
    codeable: false,
    triggerNode: false,
    webhookSupport: false,
    version: [1],
    defaults: { name: 'Cluster Monitor', metrics: ['cpu', 'memory', 'disk'], alertThreshold: 80 },
    aliases: ['monitor', 'health', 'metrics', 'observe']
  } as NodeTypeInfo,

  'n8n-nodes-base.clusterQueue': {
    name: 'n8n-nodes-base.clusterQueue',
    displayName: 'Cluster Queue',
    description: 'Manage distributed job queues across cluster nodes with priority and retry mechanisms',
    category: 'Cluster Nodes',
    subcategory: 'Queue Management',
    properties: [
      {
        name: 'queueType',
        displayName: 'Queue Type',
        type: 'options',
        required: true,
        default: 'fifo',
        options: [
          { name: 'First In First Out (FIFO)', value: 'fifo' },
          { name: 'Last In First Out (LIFO)', value: 'lifo' },
          { name: 'Priority Queue', value: 'priority' },
          { name: 'Delay Queue', value: 'delay' }
        ],
        description: 'Type of queue processing'
      },
      {
        name: 'maxRetries',
        displayName: 'Max Retries',
        type: 'number',
        required: false,
        default: 3,
        description: 'Maximum retry attempts for failed jobs'
      },
      {
        name: 'retryDelay',
        displayName: 'Retry Delay (ms)',
        type: 'number',
        required: false,
        default: 5000,
        description: 'Delay between retry attempts'
      }
    ],
    inputs: [{ type: 'main', displayName: 'Jobs', required: true }],
    outputs: [
      { type: 'main', displayName: 'Processed', description: 'Successfully processed jobs' },
      { type: 'main', displayName: 'Failed', description: 'Failed jobs after retries' }
    ],
    credentials: [],
    regularNode: true,
    codeable: false,
    triggerNode: false,
    webhookSupport: false,
    version: [1],
    defaults: { name: 'Cluster Queue', queueType: 'fifo', maxRetries: 3, retryDelay: 5000 },
    aliases: ['queue', 'jobs', 'process', 'schedule']
  } as NodeTypeInfo
};

export default clusterNodes;

// Cluster node categories
export const clusterCategories = {
  dataDistribution: ['splitInBatches'],
  dataAggregation: ['clusterMerge'],
  loadDistribution: ['clusterBalance'],
  synchronization: ['clusterSync'],
  monitoring: ['clusterMonitor'],
  queueManagement: ['clusterQueue']
};
