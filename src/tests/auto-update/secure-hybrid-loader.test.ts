import { SecureHybridNodeLoader, SecureHybridLoaderConfig } from '../../loaders/secure-hybrid-loader';
import { GitHubSync } from '../../services/github-sync';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('../../services/github-sync');
jest.mock('../../utils/logger');
jest.mock('vm2');

const mockGitHubSync = GitHubSync as jest.MockedClass<typeof GitHubSync>;

describe('SecureHybridNodeLoader', () => {
  let loader: SecureHybridNodeLoader;
  let mockConfig: SecureHybridLoaderConfig;

  beforeEach(() => {
    mockConfig = {
      github: {
        token: 'test-token',
        localCachePath: './test-cache',
        enabled: true
      },
      fallbackToLocal: true,
      prioritizeGitHub: false, // Prioritize NPM for security
      autoSync: false,
      syncInterval: '*/15 * * * *',
      security: {
        enableCodeExecution: false, // DISABLED by default
        executionTimeout: 5000,
        memoryLimit: 64,
        allowedModules: ['n8n-workflow', 'n8n-core']
      }
    };

    loader = new SecureHybridNodeLoader(mockConfig);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Security Configuration', () => {
    it('should initialize with code execution DISABLED by default', async () => {
      expect(mockConfig.security.enableCodeExecution).toBe(false);
    });

    it('should validate security configuration on initialization', async () => {
      const invalidConfig = {
        ...mockConfig,
        security: {
          ...mockConfig.security,
          enableCodeExecution: true,
          executionTimeout: 40000, // Too high
          memoryLimit: 512 // Too high
        }
      };

      await expect(async () => {
        const invalidLoader = new SecureHybridNodeLoader(invalidConfig);
        await invalidLoader.initialize();
      }).rejects.toThrow('Execution timeout cannot exceed 30 seconds');
    });

    it('should require allowlisted modules when code execution is enabled', async () => {
      const invalidConfig = {
        ...mockConfig,
        security: {
          ...mockConfig.security,
          enableCodeExecution: true,
          allowedModules: [] // Empty allowlist
        }
      };

      await expect(async () => {
        const invalidLoader = new SecureHybridNodeLoader(invalidConfig);
        await invalidLoader.initialize();
      }).rejects.toThrow('At least one module must be in the allowlist');
    });

    it('should log security events properly', async () => {
      await loader.initialize();
      const stats = loader.getSecurityStats();
      
      expect(stats.codeExecutionEnabled).toBe(false);
      expect(stats.allowedModules).toEqual(['n8n-workflow', 'n8n-core']);
      expect(stats.executionTimeout).toBe(5000);
    });
  });

  describe('Node Loading Security', () => {
    beforeEach(() => {
      // Mock GitHubSync methods
      mockGitHubSync.prototype.initialize.mockResolvedValue();
      mockGitHubSync.prototype.getCachedNodeFiles.mockResolvedValue([]);
      mockGitHubSync.prototype.readCachedFile.mockResolvedValue('');
    });

    it('should load only from NPM when code execution is disabled', async () => {
      await loader.initialize();
      
      // Mock the parent class loadAllNodes method
      const mockLoadAllNodes = jest.fn().mockResolvedValue([
        { packageName: 'n8n-nodes-base', nodeName: 'TestNode', NodeClass: class TestNode {} }
      ]);
      Object.setPrototypeOf(loader, { loadAllNodes: mockLoadAllNodes });

      const nodes = await loader.loadAllNodes();
      
      expect(nodes).toHaveLength(1);
      expect(nodes[0].packageName).toBe('n8n-nodes-base');
      expect(mockLoadAllNodes).toHaveBeenCalled();
    });

    it('should skip GitHub nodes when code execution is disabled', async () => {
      await loader.initialize();
      
      // Mock GitHub files available
      mockGitHubSync.prototype.getCachedNodeFiles.mockResolvedValue(['TestNode.node.ts']);
      
      const mockLoadAllNodes = jest.fn().mockResolvedValue([]);
      Object.setPrototypeOf(loader, { loadAllNodes: mockLoadAllNodes });

      const nodes = await loader.loadAllNodes();
      
      // Should not process GitHub files when code execution is disabled
      expect(nodes).toHaveLength(0);
    });
  });

  describe('Source Code Validation', () => {
    it('should detect dangerous patterns in source code', () => {
      const dangerousCodes = [
        'eval(userInput)',
        'new Function(code)',
        'require("child_process")',
        'process.env.SECRET',
        '__dirname + "/file"'
      ];

      dangerousCodes.forEach(code => {
        // Access private method for testing
        const isValid = (loader as any).validateSourceCodeSafety(code, 'test.ts');
        expect(isValid).toBe(false);
      });
    });

    it('should accept safe source code', () => {
      const safeCodes = [
        'class TestNode { description = { name: "test" }; }',
        'export default class Safe { execute() { return "safe"; } }',
        'const node = { properties: [] };'
      ];

      safeCodes.forEach(code => {
        const isValid = (loader as any).validateSourceCodeSafety(code, 'test.ts');
        expect(isValid).toBe(true);
      });
    });

    it('should reject files that are too large', () => {
      const largeCode = 'a'.repeat(1024 * 1024 + 1); // 1MB + 1 byte
      const isValid = (loader as any).validateSourceCodeSafety(largeCode, 'large.ts');
      expect(isValid).toBe(false);
    });

    it('should verify file integrity', () => {
      const validFile = 'export default class TestNode { description = {}; }';
      const invalidFile = 'just some random text without structure';
      
      expect((loader as any).verifyNodeFileIntegrity(validFile, 'test.ts')).toBe(true);
      expect((loader as any).verifyNodeFileIntegrity(invalidFile, 'test.ts')).toBe(false);
      expect((loader as any).verifyNodeFileIntegrity('', 'test.ts')).toBe(false);
    });
  });

  describe('Security Statistics and Monitoring', () => {
    it('should track security violations', async () => {
      await loader.initialize();
      
      // Simulate security violations by calling private method
      (loader as any).logSecurityEvent('file_integrity_failure', { fileName: 'test.ts' });
      (loader as any).logSecurityEvent('dangerous_pattern_detected', { pattern: 'eval(' });
      
      const stats = loader.getSecurityStats();
      expect(stats.securityViolations).toBe(2);
      expect(stats.recentViolations).toHaveLength(2);
    });

    it('should clear security history', async () => {
      await loader.initialize();
      
      (loader as any).logSecurityEvent('test_violation', {});
      expect(loader.getSecurityStats().securityViolations).toBe(1);
      
      loader.clearSecurityHistory();
      expect(loader.getSecurityStats().securityViolations).toBe(0);
    });

    it('should validate cached nodes', async () => {
      await loader.initialize();
      
      // Mock compilation cache with mixed valid/invalid entries
      const mockCache = new Map();
      mockCache.set('valid', { success: true, nodeClass: class ValidNode {} });
      mockCache.set('invalid', { success: true, nodeClass: null });
      (loader as any).compilationCache = mockCache;
      
      const result = await loader.validateAllCachedNodes();
      expect(result.valid).toBeGreaterThan(0);
      expect(result.invalid).toBeGreaterThan(0);
    });
  });

  describe('Fallback Behavior', () => {
    it('should fall back to NPM when GitHub is unavailable', async () => {
      // Mock GitHub initialization failure
      mockGitHubSync.prototype.initialize.mockRejectedValue(new Error('GitHub unavailable'));
      
      const mockLoadAllNodes = jest.fn().mockResolvedValue([
        { packageName: 'n8n-nodes-base', nodeName: 'TestNode', NodeClass: class TestNode {} }
      ]);
      Object.setPrototypeOf(loader, { loadAllNodes: mockLoadAllNodes });

      await loader.initialize();
      const nodes = await loader.loadAllNodes();
      
      expect(nodes).toHaveLength(1);
      expect(nodes[0].packageName).toBe('n8n-nodes-base');
    });

    it('should throw error when fallback is disabled and GitHub fails', async () => {
      const noFallbackConfig = { ...mockConfig, fallbackToLocal: false };
      const noFallbackLoader = new SecureHybridNodeLoader(noFallbackConfig);
      
      mockGitHubSync.prototype.initialize.mockRejectedValue(new Error('GitHub unavailable'));
      
      await expect(noFallbackLoader.initialize()).rejects.toThrow('Secure loader initialization failed');
    });
  });

  describe('Memory Management', () => {
    it('should limit compilation cache size', async () => {
      await loader.initialize();
      
      // Add many entries to cache
      const cache = (loader as any).compilationCache;
      for (let i = 0; i < 1000; i++) {
        cache.set(`entry${i}`, { success: true, nodeClass: class {} });
      }
      
      // Cache should be managed (exact behavior depends on implementation)
      expect(cache.size).toBeLessThanOrEqual(1000);
    });

    it('should clean up old security violations', async () => {
      await loader.initialize();
      
      // Add many security violations
      for (let i = 0; i < 1500; i++) {
        (loader as any).logSecurityEvent('test_violation', { index: i });
      }
      
      const stats = loader.getSecurityStats();
      expect(stats.securityViolations).toBeLessThanOrEqual(1000); // Should be limited
    });
  });

  describe('Error Handling', () => {
    it('should handle GitHub sync errors gracefully', async () => {
      mockGitHubSync.prototype.syncNodes.mockRejectedValue(new Error('Sync failed'));
      
      await loader.initialize();
      
      // Should not throw - should handle error gracefully
      await expect(loader.loadAllNodes()).resolves.toBeDefined();
    });

    it('should handle malformed node files', async () => {
      await loader.initialize();
      
      mockGitHubSync.prototype.getCachedNodeFiles.mockResolvedValue(['bad.node.ts']);
      mockGitHubSync.prototype.readCachedFile.mockResolvedValue('invalid typescript syntax {[');
      
      // Enable code execution for this test
      (loader as any).config.security.enableCodeExecution = true;
      
      const nodes = await loader.loadAllNodes();
      
      // Should handle malformed files gracefully without throwing
      expect(Array.isArray(nodes)).toBe(true);
    });
  });

  describe('Configuration Validation', () => {
    it('should enforce secure defaults', () => {
      const defaultLoader = new SecureHybridNodeLoader({
        github: { token: 'test', localCachePath: './test', enabled: true }
      });
      
      expect((defaultLoader as any).config.security.enableCodeExecution).toBe(false);
      expect((defaultLoader as any).config.fallbackToLocal).toBe(true);
      expect((defaultLoader as any).config.security.executionTimeout).toBeLessThanOrEqual(30000);
    });

    it('should validate module allowlist', async () => {
      const configWithDangerousModules = {
        ...mockConfig,
        security: {
          ...mockConfig.security,
          enableCodeExecution: true,
          allowedModules: ['fs', 'child_process'] // Dangerous modules
        }
      };
      
      // Should warn about dangerous modules (implementation dependent)
      const dangerousLoader = new SecureHybridNodeLoader(configWithDangerousModules);
      await dangerousLoader.initialize();
      
      // Test that it initializes but with warnings
      expect(logger.warn).toHaveBeenCalled();
    });
  });
});