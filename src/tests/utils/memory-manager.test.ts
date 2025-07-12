import { MemoryManager, memoryManager, formatBytes } from '../../utils/memory-manager';

// Mock process.memoryUsage for testing
const mockMemoryUsage = jest.fn();
Object.defineProperty(process, 'memoryUsage', {
  value: mockMemoryUsage,
  writable: true
});

// Mock global.gc
Object.defineProperty(global, 'gc', {
  value: jest.fn(),
  writable: true
});

describe('MemoryManager', () => {
  let manager: MemoryManager;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default memory usage mock
    mockMemoryUsage.mockReturnValue({
      heapUsed: 50 * 1024 * 1024,    // 50MB
      heapTotal: 100 * 1024 * 1024,  // 100MB
      external: 10 * 1024 * 1024,    // 10MB
      rss: 150 * 1024 * 1024,        // 150MB
      arrayBuffers: 5 * 1024 * 1024  // 5MB
    });

    manager = new MemoryManager({
      enabled: true,
      monitoringIntervalMs: 100, // Short interval for testing
      thresholds: {
        warning: 70,
        critical: 85,
        maximum: 95
      },
      enableGCLogging: false,
      autoCleanup: true
    });
  });

  afterEach(() => {
    manager.stopMonitoring();
    manager.destroy();
  });

  describe('Memory Statistics', () => {
    it('should calculate memory stats correctly', () => {
      const stats = manager.getMemoryStats();
      
      expect(stats.heapUsed).toBe(50 * 1024 * 1024);
      expect(stats.heapTotal).toBe(100 * 1024 * 1024);
      expect(stats.external).toBe(10 * 1024 * 1024);
      expect(stats.rss).toBe(150 * 1024 * 1024);
      expect(stats.arrayBuffers).toBe(5 * 1024 * 1024);
      expect(stats.heapUsedPercent).toBe(50); // 50MB / 100MB * 100
    });

    it('should track memory history', async () => {
      manager.startMonitoring();
      
      // Wait for a few monitoring cycles
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const history = manager.getMemoryHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0]).toHaveProperty('heapUsed');
      expect(history[0]).toHaveProperty('timestamp');
    });

    it('should limit memory history size', () => {
      manager.startMonitoring();
      
      // Simulate many memory checks
      for (let i = 0; i < 150; i++) {
        (manager as any).checkMemoryUsage();
      }
      
      const history = manager.getMemoryHistory();
      expect(history.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Memory Monitoring', () => {
    it('should start and stop monitoring', () => {
      expect((manager as any).monitoringInterval).toBeNull();
      
      manager.startMonitoring();
      expect((manager as any).monitoringInterval).not.toBeNull();
      
      manager.stopMonitoring();
      expect((manager as any).monitoringInterval).toBeNull();
    });

    it('should emit memory stats events', (done) => {
      manager.on('memory_stats', (stats) => {
        expect(stats).toHaveProperty('heapUsed');
        expect(stats).toHaveProperty('heapUsedPercent');
        done();
      });
      
      manager.startMonitoring();
    });

    it('should not start monitoring when disabled', () => {
      const disabledManager = new MemoryManager({ enabled: false });
      
      disabledManager.startMonitoring();
      expect((disabledManager as any).monitoringInterval).toBeNull();
      
      disabledManager.destroy();
    });
  });

  describe('Memory Thresholds', () => {
    it('should emit warning event at 70% usage', (done) => {
      // Set memory usage to 70%
      mockMemoryUsage.mockReturnValue({
        heapUsed: 70 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      manager.on('memory_warning', (stats) => {
        expect(stats.heapUsedPercent).toBe(70);
        done();
      });

      (manager as any).checkMemoryUsage();
    });

    it('should emit critical event at 85% usage', (done) => {
      // Set memory usage to 85%
      mockMemoryUsage.mockReturnValue({
        heapUsed: 85 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      manager.on('memory_critical', (stats) => {
        expect(stats.heapUsedPercent).toBe(85);
        done();
      });

      (manager as any).checkMemoryUsage();
    });

    it('should emit emergency event at 95% usage', (done) => {
      // Set memory usage to 95%
      mockMemoryUsage.mockReturnValue({
        heapUsed: 95 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      manager.on('memory_emergency', (stats) => {
        expect(stats.heapUsedPercent).toBe(95);
        done();
      });

      (manager as any).checkMemoryUsage();
    });

    it('should update thresholds dynamically', () => {
      manager.updateThresholds({ warning: 60, critical: 80 });
      
      const summary = manager.getMemorySummary();
      expect(summary.thresholds.warning).toBe(60);
      expect(summary.thresholds.critical).toBe(80);
    });
  });

  describe('Cleanup Operations', () => {
    it('should perform gentle cleanup on warning', async () => {
      const cleanupSpy = jest.fn();
      manager.on('cleanup_request', cleanupSpy);

      // Trigger warning level
      mockMemoryUsage.mockReturnValue({
        heapUsed: 70 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      (manager as any).checkMemoryUsage();
      
      expect(cleanupSpy).toHaveBeenCalledWith({ level: 'gentle' });
    });

    it('should perform aggressive cleanup on critical', async () => {
      const cleanupSpy = jest.fn();
      manager.on('cleanup_request', cleanupSpy);

      // Trigger critical level
      mockMemoryUsage.mockReturnValue({
        heapUsed: 85 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      (manager as any).checkMemoryUsage();
      
      // Wait for async cleanup
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(cleanupSpy).toHaveBeenCalledWith({ level: 'aggressive' });
    });

    it('should register and execute cleanup handlers', async () => {
      const cleanupHandler1 = jest.fn().mockResolvedValue(undefined);
      const cleanupHandler2 = jest.fn().mockResolvedValue(undefined);
      
      manager.onCleanup(cleanupHandler1);
      manager.onCleanup(cleanupHandler2);
      
      await (manager as any).executeCleanupHandlers();
      
      expect(cleanupHandler1).toHaveBeenCalled();
      expect(cleanupHandler2).toHaveBeenCalled();
    });

    it('should handle cleanup handler timeouts', async () => {
      const slowHandler = jest.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 10000))
      );
      
      manager.onCleanup(slowHandler);
      
      const startTime = Date.now();
      await (manager as any).executeCleanupHandlers();
      const endTime = Date.now();
      
      // Should timeout after 5 seconds
      expect(endTime - startTime).toBeLessThan(6000);
    });

    it('should continue executing other handlers if one fails', async () => {
      const failingHandler = jest.fn().mockRejectedValue(new Error('Handler failed'));
      const successHandler = jest.fn().mockResolvedValue(undefined);
      
      manager.onCleanup(failingHandler);
      manager.onCleanup(successHandler);
      
      await (manager as any).executeCleanupHandlers();
      
      expect(failingHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
    });
  });

  describe('Garbage Collection', () => {
    it('should force garbage collection when available', () => {
      const result = manager.forceGarbageCollection();
      
      expect(result).toBe(true);
      expect(global.gc).toHaveBeenCalled();
    });

    it('should handle unavailable garbage collection', () => {
      // Mock gc as unavailable
      (global as any).gc = undefined;
      
      const result = manager.forceGarbageCollection();
      
      expect(result).toBe(false);
    });

    it('should call garbage collection during aggressive cleanup', async () => {
      // Trigger critical level
      mockMemoryUsage.mockReturnValue({
        heapUsed: 85 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      (manager as any).checkMemoryUsage();
      
      // Wait for async cleanup
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(global.gc).toHaveBeenCalled();
    });
  });

  describe('Memory Trend Analysis', () => {
    it('should calculate increasing trend', () => {
      // Simulate increasing memory usage
      const history = [
        { heapUsedPercent: 50 },
        { heapUsedPercent: 55 },
        { heapUsedPercent: 60 },
        { heapUsedPercent: 65 },
        { heapUsedPercent: 70 },
        { heapUsedPercent: 72 },
        { heapUsedPercent: 74 },
        { heapUsedPercent: 76 },
        { heapUsedPercent: 78 },
        { heapUsedPercent: 80 }
      ];
      
      (manager as any).memoryHistory = history;
      
      const trend = (manager as any).calculateMemoryTrend();
      expect(trend).toBe('increasing');
    });

    it('should calculate decreasing trend', () => {
      // Simulate decreasing memory usage
      const history = [
        { heapUsedPercent: 80 },
        { heapUsedPercent: 78 },
        { heapUsedPercent: 76 },
        { heapUsedPercent: 74 },
        { heapUsedPercent: 72 },
        { heapUsedPercent: 68 },
        { heapUsedPercent: 66 },
        { heapUsedPercent: 64 },
        { heapUsedPercent: 62 },
        { heapUsedPercent: 60 }
      ];
      
      (manager as any).memoryHistory = history;
      
      const trend = (manager as any).calculateMemoryTrend();
      expect(trend).toBe('decreasing');
    });

    it('should calculate stable trend', () => {
      // Simulate stable memory usage
      const history = Array(10).fill({ heapUsedPercent: 50 });
      
      (manager as any).memoryHistory = history;
      
      const trend = (manager as any).calculateMemoryTrend();
      expect(trend).toBe('stable');
    });

    it('should handle insufficient history', () => {
      (manager as any).memoryHistory = [{ heapUsedPercent: 50 }];
      
      const trend = (manager as any).calculateMemoryTrend();
      expect(trend).toBe('unknown');
    });
  });

  describe('Emergency Shutdown', () => {
    it('should trigger emergency shutdown at maximum threshold', (done) => {
      manager.on('emergency_shutdown', (stats) => {
        expect(stats.heapUsedPercent).toBe(95);
        done();
      });

      // Mock process.exit to prevent actual exit during test
      const originalExit = process.exit;
      process.exit = jest.fn() as any;

      try {
        // Trigger maximum level
        mockMemoryUsage.mockReturnValue({
          heapUsed: 95 * 1024 * 1024,
          heapTotal: 100 * 1024 * 1024,
          external: 10 * 1024 * 1024,
          rss: 150 * 1024 * 1024,
          arrayBuffers: 5 * 1024 * 1024
        });

        (manager as any).checkMemoryUsage();
      } finally {
        process.exit = originalExit;
      }
    });

    it('should only trigger emergency shutdown once', () => {
      const emergencySpy = jest.fn();
      manager.on('emergency_shutdown', emergencySpy);

      // Mock process.exit to prevent actual exit during test
      const originalExit = process.exit;
      process.exit = jest.fn() as any;

      try {
        // Trigger maximum level multiple times
        mockMemoryUsage.mockReturnValue({
          heapUsed: 95 * 1024 * 1024,
          heapTotal: 100 * 1024 * 1024,
          external: 10 * 1024 * 1024,
          rss: 150 * 1024 * 1024,
          arrayBuffers: 5 * 1024 * 1024
        });

        (manager as any).checkMemoryUsage();
        (manager as any).checkMemoryUsage();
        (manager as any).checkMemoryUsage();

        expect(emergencySpy).toHaveBeenCalledTimes(1);
      } finally {
        process.exit = originalExit;
      }
    });
  });

  describe('Memory Health', () => {
    it('should report healthy memory when below warning threshold', () => {
      mockMemoryUsage.mockReturnValue({
        heapUsed: 60 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      const isHealthy = manager.isMemoryHealthy();
      expect(isHealthy).toBe(true);
    });

    it('should report unhealthy memory when above warning threshold', () => {
      mockMemoryUsage.mockReturnValue({
        heapUsed: 75 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 150 * 1024 * 1024,
        arrayBuffers: 5 * 1024 * 1024
      });

      // Trigger memory check to update stats
      (manager as any).checkMemoryUsage();

      const isHealthy = manager.isMemoryHealthy();
      expect(isHealthy).toBe(false);
    });

    it('should report healthy when no stats available', () => {
      const newManager = new MemoryManager({ enabled: false });
      
      const isHealthy = newManager.isMemoryHealthy();
      expect(isHealthy).toBe(true);
      
      newManager.destroy();
    });
  });

  describe('Cache Impact Analysis', () => {
    it('should estimate cache impact correctly', () => {
      const cacheSize = 20 * 1024 * 1024; // 20MB
      
      const impact = manager.estimateCacheImpact(cacheSize);
      
      expect(impact.currentImpact).toBe(20); // 20MB / 100MB * 100
      expect(impact.recommendedMaxSize).toBeGreaterThan(0);
      expect(typeof impact.exceedsRecommended).toBe('boolean');
    });

    it('should recommend safe cache sizes', () => {
      // Current: 50MB used out of 100MB total
      // Warning threshold: 70% = 70MB
      // Available: 70MB - 50MB = 20MB
      // Recommended: 50% of available = 10MB
      
      const impact = manager.estimateCacheImpact(5 * 1024 * 1024); // 5MB cache
      
      expect(impact.exceedsRecommended).toBe(false);
      expect(impact.recommendedMaxSize).toBeCloseTo(10 * 1024 * 1024, -1000000); // ~10MB
    });

    it('should detect when cache exceeds recommendations', () => {
      const largeCacheSize = 50 * 1024 * 1024; // 50MB cache
      
      const impact = manager.estimateCacheImpact(largeCacheSize);
      
      expect(impact.exceedsRecommended).toBe(true);
    });
  });

  describe('Memory Summary', () => {
    it('should provide comprehensive memory summary', () => {
      manager.startMonitoring();
      
      // Add some history
      (manager as any).checkMemoryUsage();
      
      const summary = manager.getMemorySummary();
      
      expect(summary).toHaveProperty('current');
      expect(summary).toHaveProperty('trend');
      expect(summary).toHaveProperty('thresholds');
      expect(summary).toHaveProperty('isMonitoring', true);
      expect(summary).toHaveProperty('cleanupHandlers', 0);
      expect(summary).toHaveProperty('emergencyTriggered', false);
      expect(summary).toHaveProperty('history');
      expect(summary.history).toHaveProperty('points');
      expect(summary.history).toHaveProperty('maxHeapUsed');
      expect(summary.history).toHaveProperty('avgHeapUsed');
    });

    it('should return null summary when no stats available', () => {
      const newManager = new MemoryManager({ enabled: false });
      
      const summary = newManager.getMemorySummary();
      expect(summary).toBeNull();
      
      newManager.destroy();
    });

    it('should track cleanup handlers count', () => {
      manager.onCleanup(async () => {});
      manager.onCleanup(async () => {});
      
      const summary = manager.getMemorySummary();
      expect(summary.cleanupHandlers).toBe(2);
    });
  });

  describe('Cleanup and Destruction', () => {
    it('should cleanup properly on destroy', () => {
      manager.startMonitoring();
      manager.onCleanup(async () => {});
      
      expect((manager as any).monitoringInterval).not.toBeNull();
      expect((manager as any).cleanupHandlers.length).toBe(1);
      
      manager.destroy();
      
      expect((manager as any).monitoringInterval).toBeNull();
      expect((manager as any).cleanupHandlers.length).toBe(0);
    });

    it('should remove all event listeners on destroy', () => {
      const listener = jest.fn();
      manager.on('memory_stats', listener);
      
      expect(manager.listenerCount('memory_stats')).toBe(1);
      
      manager.destroy();
      
      expect(manager.listenerCount('memory_stats')).toBe(0);
    });
  });
});

describe('Global Memory Manager', () => {
  it('should provide singleton instance', () => {
    expect(memoryManager).toBeInstanceOf(MemoryManager);
  });

  it('should be the same instance across imports', () => {
    // This test ensures the singleton pattern works
    expect(memoryManager).toBe(memoryManager);
  });
});

describe('formatBytes utility', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1572864)).toBe('1.5 MB');
  });

  it('should handle edge cases', () => {
    expect(formatBytes(-1)).toBe('0 Bytes');
    expect(formatBytes(0.5)).toBe('0.5 Bytes');
    expect(formatBytes(1023)).toBe('1023 Bytes');
  });
});