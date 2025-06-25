/**
 * Pagination Utilities
 * 
 * Provides advanced pagination capabilities for large datasets
 * with cursor-based and offset-based pagination support.
 */

export interface PaginationConfig {
  defaultLimit?: number;
  maxLimit?: number;
  enableCursor?: boolean;
  enableCount?: boolean;
}

export interface OffsetPagination {
  offset: number;
  limit: number;
}

export interface CursorPagination {
  cursor?: string;
  limit: number;
  direction?: 'forward' | 'backward';
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    offset?: number;
    limit: number;
    total?: number;
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
    page?: number;
    totalPages?: number;
  };
  meta?: {
    processingTime: number;
    cacheHit: boolean;
    source: string;
  };
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/**
 * Advanced pagination manager with multiple pagination strategies
 */
export class PaginationManager {
  private config: Required<PaginationConfig>;

  constructor(config: PaginationConfig = {}) {
    this.config = {
      defaultLimit: config.defaultLimit || 50,
      maxLimit: config.maxLimit || 1000,
      enableCursor: config.enableCursor ?? true,
      enableCount: config.enableCount ?? true
    };
  }

  /**
   * Validate and normalize pagination parameters
   */
  validateParams(params: PaginationParams): {
    offset: number;
    limit: number;
    cursor?: string;
    direction: 'forward' | 'backward';
    sortBy?: string;
    sortOrder: 'asc' | 'desc';
  } {
    // Validate and set limit
    let limit = params.limit || this.config.defaultLimit;
    if (limit > this.config.maxLimit) {
      limit = this.config.maxLimit;
    }
    if (limit < 1) {
      limit = 1;
    }

    // Validate and set offset
    let offset = params.offset || 0;
    if (offset < 0) {
      offset = 0;
    }

    // Validate direction
    const direction = params.direction || 'forward';
    if (direction !== 'forward' && direction !== 'backward') {
      throw new Error('Direction must be "forward" or "backward"');
    }

    // Validate sort order
    const sortOrder = params.sortOrder || 'asc';
    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      throw new Error('Sort order must be "asc" or "desc"');
    }

    return {
      offset,
      limit,
      cursor: params.cursor,
      direction,
      sortBy: params.sortBy,
      sortOrder
    };
  }

  /**
   * Paginate array data with offset-based pagination
   */
  paginateArray<T>(
    items: T[],
    params: PaginationParams,
    options: {
      includeTotal?: boolean;
      sortFunction?: (a: T, b: T) => number;
    } = {}
  ): PaginationResult<T> {
    const startTime = Date.now();
    const { offset, limit, sortBy, sortOrder } = this.validateParams(params);
    
    let sortedItems = [...items];

    // Apply sorting if specified
    if (options.sortFunction) {
      sortedItems.sort(options.sortFunction);
    } else if (sortBy) {
      sortedItems.sort((a, b) => {
        const aVal = this.getNestedValue(a, sortBy);
        const bVal = this.getNestedValue(b, sortBy);
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply filters if any
    if (params.filters) {
      sortedItems = this.applyFilters(sortedItems, params.filters);
    }

    const total = sortedItems.length;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedItems = sortedItems.slice(startIndex, endIndex);
    
    const hasMore = endIndex < total;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return {
      items: paginatedItems,
      pagination: {
        offset,
        limit,
        total: options.includeTotal ? total : undefined,
        hasMore,
        page,
        totalPages: options.includeTotal ? totalPages : undefined
      },
      meta: {
        processingTime: Date.now() - startTime,
        cacheHit: false,
        source: 'array'
      }
    };
  }

  /**
   * Create cursor-based pagination for efficient large dataset handling
   */
  createCursorPagination<T>(
    items: T[],
    params: PaginationParams,
    options: {
      cursorField: string;
      includeTotal?: boolean;
    }
  ): PaginationResult<T> {
    const startTime = Date.now();
    const { limit, cursor, direction, sortBy, sortOrder } = this.validateParams(params);
    
    let filteredItems = [...items];

    // Apply filters if any
    if (params.filters) {
      filteredItems = this.applyFilters(filteredItems, params.filters);
    }

    // Sort items
    const sortField = sortBy || options.cursorField;
    filteredItems.sort((a, b) => {
      const aVal = this.getNestedValue(a, sortField);
      const bVal = this.getNestedValue(b, sortField);
      
      let comparison = 0;
      if (aVal > bVal) comparison = 1;
      if (aVal < bVal) comparison = -1;
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Find cursor position
    let startIndex = 0;
    if (cursor) {
      const decodedCursor = this.decodeCursor(cursor);
      startIndex = filteredItems.findIndex(item => 
        this.getNestedValue(item, options.cursorField) === decodedCursor.value
      );
      
      if (startIndex === -1) {
        startIndex = 0;
      } else if (direction === 'forward') {
        startIndex += 1;
      } else {
        startIndex = Math.max(0, startIndex - limit);
      }
    }

    const endIndex = Math.min(startIndex + limit, filteredItems.length);
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    // Generate cursors
    const nextCursor = endIndex < filteredItems.length && paginatedItems.length > 0
      ? this.encodeCursor(this.getNestedValue(paginatedItems[paginatedItems.length - 1], options.cursorField))
      : undefined;
      
    const prevCursor = startIndex > 0 && paginatedItems.length > 0
      ? this.encodeCursor(this.getNestedValue(paginatedItems[0], options.cursorField))
      : undefined;

    return {
      items: paginatedItems,
      pagination: {
        limit,
        total: options.includeTotal ? filteredItems.length : undefined,
        hasMore: endIndex < filteredItems.length,
        nextCursor,
        prevCursor
      },
      meta: {
        processingTime: Date.now() - startTime,
        cacheHit: false,
        source: 'cursor'
      }
    };
  }

  /**
   * Create paginated response for API endpoints
   */
  createApiResponse<T>(
    items: T[],
    params: PaginationParams,
    options: {
      baseUrl?: string;
      sortField?: string;
      includeTotal?: boolean;
      enableCursor?: boolean;
    } = {}
  ): PaginationResult<T> & {
    links?: {
      first?: string;
      prev?: string;
      next?: string;
      last?: string;
    };
  } {
    const useCursor = options.enableCursor && this.config.enableCursor;
    
    let result: PaginationResult<T>;
    
    if (useCursor && options.sortField) {
      result = this.createCursorPagination(items, params, {
        cursorField: options.sortField,
        includeTotal: options.includeTotal
      });
    } else {
      result = this.paginateArray(items, params, {
        includeTotal: options.includeTotal
      });
    }

    // Generate navigation links if baseUrl is provided
    let links: any = undefined;
    if (options.baseUrl) {
      links = this.generateNavigationLinks(options.baseUrl, params, result.pagination);
    }

    return {
      ...result,
      links
    };
  }

  /**
   * Paginate search results with relevance scoring
   */
  paginateSearchResults<T>(
    items: Array<T & { score?: number }>,
    params: PaginationParams,
    options: {
      minScore?: number;
      includeTotal?: boolean;
    } = {}
  ): PaginationResult<T> {
    const startTime = Date.now();
    
    let filteredItems = [...items];

    // Filter by minimum score
    if (options.minScore !== undefined) {
      filteredItems = filteredItems.filter(item => 
        (item.score || 0) >= options.minScore!
      );
    }

    // Sort by relevance score (descending)
    filteredItems.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Apply standard pagination
    const result = this.paginateArray(filteredItems, params, {
      includeTotal: options.includeTotal
    });

    result.meta!.source = 'search';
    result.meta!.processingTime = Date.now() - startTime;

    return result;
  }

  /**
   * Create streaming pagination for real-time data
   */
  createStreamingPagination<T>(
    items: T[],
    params: PaginationParams,
    options: {
      timestampField: string;
      windowSize?: number;
    }
  ): PaginationResult<T> & {
    streaming: {
      windowStart: number;
      windowEnd: number;
      isLive: boolean;
    };
  } {
    const { limit } = this.validateParams(params);
    const windowSize = options.windowSize || 3600000; // 1 hour default
    
    const now = Date.now();
    const windowStart = now - windowSize;
    
    // Filter items within the time window
    const windowedItems = items.filter(item => {
      const timestamp = this.getNestedValue(item, options.timestampField);
      return timestamp >= windowStart && timestamp <= now;
    });

    // Sort by timestamp (newest first)
    windowedItems.sort((a, b) => {
      const aTime = this.getNestedValue(a, options.timestampField);
      const bTime = this.getNestedValue(b, options.timestampField);
      return bTime - aTime;
    });

    const result = this.paginateArray(windowedItems, { ...params, offset: 0, limit }, {
      includeTotal: false
    });

    return {
      ...result,
      streaming: {
        windowStart,
        windowEnd: now,
        isLive: true
      }
    };
  }

  /**
   * Apply filters to items
   */
  private applyFilters<T>(items: T[], filters: Record<string, any>): T[] {
    return items.filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        const itemValue = this.getNestedValue(item, key);
        
        if (Array.isArray(value)) {
          if (!value.includes(itemValue)) return false;
        } else if (typeof value === 'string' && typeof itemValue === 'string') {
          if (!itemValue.toLowerCase().includes(value.toLowerCase())) return false;
        } else if (value !== itemValue) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : undefined, obj
    );
  }

  /**
   * Encode cursor for pagination
   */
  private encodeCursor(value: any): string {
    return Buffer.from(JSON.stringify(value)).toString('base64');
  }

  /**
   * Decode cursor for pagination
   */
  private decodeCursor(cursor: string): { value: any } {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf8');
      return { value: JSON.parse(decoded) };
    } catch {
      return { value: null };
    }
  }

  /**
   * Generate navigation links for API responses
   */
  private generateNavigationLinks(
    baseUrl: string,
    params: PaginationParams,
    pagination: any
  ): any {
    const links: any = {};
    
    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
    
    if (pagination.nextCursor) {
      links.next = `${baseUrl}?cursor=${pagination.nextCursor}&limit=${pagination.limit}`;
    } else if (pagination.offset !== undefined && pagination.hasMore) {
      const nextOffset = pagination.offset + pagination.limit;
      links.next = `${baseUrl}?offset=${nextOffset}&limit=${pagination.limit}`;
    }
    
    if (pagination.prevCursor) {
      links.prev = `${baseUrl}?cursor=${pagination.prevCursor}&limit=${pagination.limit}&direction=backward`;
    } else if (pagination.offset !== undefined && pagination.offset > 0) {
      const prevOffset = Math.max(0, pagination.offset - pagination.limit);
      links.prev = `${baseUrl}?offset=${prevOffset}&limit=${pagination.limit}`;
    }
    
    if (pagination.offset !== undefined) {
      links.first = `${baseUrl}?offset=0&limit=${pagination.limit}`;
      
      if (pagination.totalPages) {
        const lastOffset = (pagination.totalPages - 1) * pagination.limit;
        links.last = `${baseUrl}?offset=${lastOffset}&limit=${pagination.limit}`;
      }
    }
    
    return Object.keys(links).length > 0 ? links : undefined;
  }
}

// Global pagination manager instance
let globalPaginationManager: PaginationManager | null = null;

/**
 * Get or create global pagination manager
 */
export function getPaginationManager(): PaginationManager {
  if (!globalPaginationManager) {
    globalPaginationManager = new PaginationManager();
  }
  return globalPaginationManager;
}

/**
 * Quick pagination utility functions
 */
export function paginateWorkflows(
  workflows: any[],
  params: PaginationParams
): PaginationResult<any> {
  return getPaginationManager().paginateArray(workflows, params, {
    includeTotal: true
  });
}

export function paginateExecutions(
  executions: any[],
  params: PaginationParams
): PaginationResult<any> {
  return getPaginationManager().createCursorPagination(executions, params, {
    cursorField: 'startedAt',
    includeTotal: false
  });
}

export function paginateNodes(
  nodes: any[],
  params: PaginationParams
): PaginationResult<any> {
  return getPaginationManager().paginateArray(nodes, params, {
    includeTotal: true,
    sortFunction: (a, b) => a.displayName.localeCompare(b.displayName)
  });
}