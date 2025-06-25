/**
 * Compression Utilities
 * 
 * Provides compression and decompression utilities for reducing
 * memory usage and improving performance of large data transfers.
 */

import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export interface CompressionOptions {
  threshold?: number; // Minimum size in bytes before compression
  level?: number; // Compression level (1-9)
  enableMetadata?: boolean; // Include compression metadata
}

export interface CompressionResult {
  compressed: boolean;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  data: Buffer | string;
  metadata?: {
    algorithm: string;
    level: number;
    timestamp: number;
  };
}

export interface CompressionStats {
  totalCompressions: number;
  totalDecompressions: number;
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  averageCompressionRatio: number;
  timeSpentCompressing: number;
  timeSpentDecompressing: number;
}

/**
 * Compression manager with statistics and performance monitoring
 */
export class CompressionManager {
  private stats: CompressionStats = {
    totalCompressions: 0,
    totalDecompressions: 0,
    totalOriginalBytes: 0,
    totalCompressedBytes: 0,
    averageCompressionRatio: 0,
    timeSpentCompressing: 0,
    timeSpentDecompressing: 0
  };

  private defaultOptions: Required<CompressionOptions> = {
    threshold: 1024, // 1KB
    level: 6, // Balanced compression
    enableMetadata: true
  };

  /**
   * Compress data if it exceeds the threshold
   */
  async compress(
    data: string | Buffer | object,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const opts = { ...this.defaultOptions, ...options };
    const startTime = Date.now();

    try {
      // Convert data to buffer
      let buffer: Buffer;
      let originalData: string | Buffer;

      if (typeof data === 'string') {
        buffer = Buffer.from(data, 'utf8');
        originalData = data;
      } else if (Buffer.isBuffer(data)) {
        buffer = data;
        originalData = data;
      } else {
        const jsonString = JSON.stringify(data);
        buffer = Buffer.from(jsonString, 'utf8');
        originalData = jsonString;
      }

      const originalSize = buffer.length;

      // Check if compression is needed
      if (originalSize < opts.threshold) {
        return {
          compressed: false,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 1.0,
          data: originalData
        };
      }

      // Compress the data
      const compressed = await gzipAsync(buffer, { level: opts.level });
      const compressedSize = compressed.length;
      const compressionRatio = originalSize / compressedSize;

      // Update statistics
      this.updateCompressionStats(originalSize, compressedSize, Date.now() - startTime);

      const result: CompressionResult = {
        compressed: true,
        originalSize,
        compressedSize,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        data: compressed
      };

      if (opts.enableMetadata) {
        result.metadata = {
          algorithm: 'gzip',
          level: opts.level,
          timestamp: Date.now()
        };
      }

      return result;
    } catch (error) {
      throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decompress previously compressed data
   */
  async decompress(
    compressedData: Buffer,
    outputFormat: 'string' | 'buffer' | 'json' = 'string'
  ): Promise<any> {
    const startTime = Date.now();

    try {
      const decompressed = await gunzipAsync(compressedData);
      
      // Update statistics
      this.updateDecompressionStats(compressedData.length, decompressed.length, Date.now() - startTime);

      switch (outputFormat) {
        case 'buffer':
          return decompressed;
        case 'json':
          return JSON.parse(decompressed.toString('utf8'));
        case 'string':
        default:
          return decompressed.toString('utf8');
      }
    } catch (error) {
      throw new Error(`Decompression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compress workflow data with optimization for n8n structures
   */
  async compressWorkflow(workflow: any): Promise<CompressionResult> {
    // Pre-process workflow to optimize for compression
    const optimizedWorkflow = this.optimizeWorkflowForCompression(workflow);
    
    return this.compress(optimizedWorkflow, {
      threshold: 512, // Lower threshold for workflows
      level: 9 // Higher compression for workflows (they're accessed less frequently)
    });
  }

  /**
   * Compress execution data with specific optimizations
   */
  async compressExecution(execution: any): Promise<CompressionResult> {
    // Remove or minimize large binary data that doesn't compress well
    const optimizedExecution = this.optimizeExecutionForCompression(execution);
    
    return this.compress(optimizedExecution, {
      threshold: 2048, // Higher threshold for executions (they're large)
      level: 4 // Lower compression for executions (they're accessed more frequently)
    });
  }

  /**
   * Compress response data for API calls
   */
  async compressResponse(response: any): Promise<CompressionResult> {
    return this.compress(response, {
      threshold: 1024,
      level: 6,
      enableMetadata: false // Skip metadata for API responses
    });
  }

  /**
   * Batch compress multiple items
   */
  async compressBatch(
    items: Array<{ key: string; data: any }>,
    options: CompressionOptions = {}
  ): Promise<Array<{ key: string; result: CompressionResult }>> {
    const results = await Promise.all(
      items.map(async item => ({
        key: item.key,
        result: await this.compress(item.data, options)
      }))
    );

    return results;
  }

  /**
   * Estimate compression ratio without actually compressing
   */
  estimateCompressionRatio(data: string | Buffer | object): number {
    let text: string;

    if (typeof data === 'string') {
      text = data;
    } else if (Buffer.isBuffer(data)) {
      text = data.toString('utf8');
    } else {
      text = JSON.stringify(data);
    }

    // Simple heuristic based on repetition and structure
    const uniqueChars = new Set(text).size;
    const totalChars = text.length;
    const repetitionFactor = totalChars / uniqueChars;

    // JSON structure bonus
    const structureBonus = (text.includes('{') && text.includes('}')) ? 1.2 : 1.0;
    
    // Estimate ratio (very rough approximation)
    const estimatedRatio = Math.min(repetitionFactor * structureBonus, 10);
    
    return Math.round(estimatedRatio * 100) / 100;
  }

  /**
   * Get compression statistics
   */
  getStats(): CompressionStats {
    return { ...this.stats };
  }

  /**
   * Reset compression statistics
   */
  resetStats(): void {
    this.stats = {
      totalCompressions: 0,
      totalDecompressions: 0,
      totalOriginalBytes: 0,
      totalCompressedBytes: 0,
      averageCompressionRatio: 0,
      timeSpentCompressing: 0,
      timeSpentDecompressing: 0
    };
  }

  /**
   * Get compression efficiency report
   */
  getEfficiencyReport(): {
    spaceSavings: number;
    averageCompressionTime: number;
    averageDecompressionTime: number;
    throughput: {
      compressionMBps: number;
      decompressionMBps: number;
    };
  } {
    const spaceSavings = this.stats.totalOriginalBytes > 0 
      ? ((this.stats.totalOriginalBytes - this.stats.totalCompressedBytes) / this.stats.totalOriginalBytes) * 100
      : 0;

    const avgCompressionTime = this.stats.totalCompressions > 0 
      ? this.stats.timeSpentCompressing / this.stats.totalCompressions
      : 0;

    const avgDecompressionTime = this.stats.totalDecompressions > 0 
      ? this.stats.timeSpentDecompressing / this.stats.totalDecompressions
      : 0;

    const compressionThroughput = this.stats.timeSpentCompressing > 0
      ? (this.stats.totalOriginalBytes / (1024 * 1024)) / (this.stats.timeSpentCompressing / 1000)
      : 0;

    const decompressionThroughput = this.stats.timeSpentDecompressing > 0
      ? (this.stats.totalCompressedBytes / (1024 * 1024)) / (this.stats.timeSpentDecompressing / 1000)
      : 0;

    return {
      spaceSavings: Math.round(spaceSavings * 100) / 100,
      averageCompressionTime: Math.round(avgCompressionTime * 100) / 100,
      averageDecompressionTime: Math.round(avgDecompressionTime * 100) / 100,
      throughput: {
        compressionMBps: Math.round(compressionThroughput * 100) / 100,
        decompressionMBps: Math.round(decompressionThroughput * 100) / 100
      }
    };
  }

  /**
   * Optimize workflow data for compression
   */
  private optimizeWorkflowForCompression(workflow: any): any {
    if (!workflow || typeof workflow !== 'object') {
      return workflow;
    }

    const optimized = { ...workflow };

    // Sort object keys for better compression
    if (optimized.nodes && Array.isArray(optimized.nodes)) {
      optimized.nodes = optimized.nodes.map((node: any) => this.sortObjectKeys(node));
    }

    if (optimized.connections) {
      optimized.connections = this.sortObjectKeys(optimized.connections);
    }

    return this.sortObjectKeys(optimized);
  }

  /**
   * Optimize execution data for compression
   */
  private optimizeExecutionForCompression(execution: any): any {
    if (!execution || typeof execution !== 'object') {
      return execution;
    }

    const optimized = { ...execution };

    // Remove or minimize large binary data
    if (optimized.data && typeof optimized.data === 'object') {
      optimized.data = this.minimizeBinaryData(optimized.data);
    }

    // Sort for consistency
    return this.sortObjectKeys(optimized);
  }

  /**
   * Sort object keys recursively for better compression
   */
  private sortObjectKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }

    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
      sorted[key] = this.sortObjectKeys(obj[key]);
    }

    return sorted;
  }

  /**
   * Minimize binary data for compression
   */
  private minimizeBinaryData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const minimized: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (Buffer.isBuffer(value)) {
        // Replace large buffers with metadata
        minimized[key] = {
          _type: 'buffer',
          size: value.length,
          preview: value.slice(0, 100).toString('base64')
        };
      } else if (typeof value === 'string' && value.length > 10000) {
        // Truncate very long strings
        minimized[key] = {
          _type: 'truncated_string',
          size: value.length,
          preview: value.substring(0, 1000) + '...'
        };
      } else if (typeof value === 'object') {
        minimized[key] = this.minimizeBinaryData(value);
      } else {
        minimized[key] = value;
      }
    }

    return minimized;
  }

  /**
   * Update compression statistics
   */
  private updateCompressionStats(originalSize: number, compressedSize: number, duration: number): void {
    this.stats.totalCompressions++;
    this.stats.totalOriginalBytes += originalSize;
    this.stats.totalCompressedBytes += compressedSize;
    this.stats.timeSpentCompressing += duration;
    
    // Recalculate average compression ratio
    this.stats.averageCompressionRatio = this.stats.totalCompressedBytes > 0
      ? this.stats.totalOriginalBytes / this.stats.totalCompressedBytes
      : 0;
  }

  /**
   * Update decompression statistics
   */
  private updateDecompressionStats(compressedSize: number, decompressedSize: number, duration: number): void {
    this.stats.totalDecompressions++;
    this.stats.timeSpentDecompressing += duration;
  }
}

// Global compression manager instance
let globalCompressionManager: CompressionManager | null = null;

/**
 * Get or create global compression manager
 */
export function getCompressionManager(): CompressionManager {
  if (!globalCompressionManager) {
    globalCompressionManager = new CompressionManager();
  }
  return globalCompressionManager;
}

/**
 * Quick compression utility functions
 */
export async function compressJson(data: any): Promise<CompressionResult> {
  return getCompressionManager().compress(data);
}

export async function compressString(text: string): Promise<CompressionResult> {
  return getCompressionManager().compress(text);
}

export async function decompressToJson(compressedData: Buffer): Promise<any> {
  return getCompressionManager().decompress(compressedData, 'json');
}

export async function decompressToString(compressedData: Buffer): Promise<string> {
  return getCompressionManager().decompress(compressedData, 'string');
}
