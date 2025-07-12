import { 
  DomainError, 
  SecurityError, 
  GitHubError, 
  TimeoutError,
  ValidationError,
  ErrorHandler,
  errorHandler
} from '../../utils/error-handling';

describe('Error Handling System', () => {
  describe('DomainError', () => {
    it('should create error with proper structure', () => {
      const error = new SecurityError('Test security error', { userId: 123 });
      
      expect(error.name).toBe('SecurityError');
      expect(error.message).toBe('Test security error');
      expect(error.code).toBe('SECURITY_ERROR');
      expect(error.statusCode).toBe(403);
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.context.userId).toBe(123);
    });

    it('should sanitize sensitive context data', () => {
      const error = new DomainError('Test error', 'TEST_ERROR', 500, {
        password: 'secret123',
        token: 'abc123',
        normalData: 'visible'
      });
      
      expect(error.context.password).toBe('[REDACTED]');
      expect(error.context.token).toBe('[REDACTED]');
      expect(error.context.normalData).toBe('visible');
    });

    it('should truncate long context values', () => {
      const longValue = 'x'.repeat(1500);
      const error = new DomainError('Test error', 'TEST_ERROR', 500, {
        longData: longValue
      });
      
      expect(error.context.longData.length).toBeLessThan(longValue.length);
      expect(error.context.longData).toContain('[TRUNCATED]');
    });

    it('should serialize to JSON properly', () => {
      const error = new SecurityError('Test error', { key: 'value' });
      const json = error.toJSON();
      
      expect(json).toHaveProperty('name', 'SecurityError');
      expect(json).toHaveProperty('message', 'Test error');
      expect(json).toHaveProperty('code', 'SECURITY_ERROR');
      expect(json).toHaveProperty('statusCode', 403);
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('context');
      expect(json).toHaveProperty('stack');
      expect(Array.isArray(json.stack)).toBe(true);
    });
  });

  describe('Specific Error Types', () => {
    it('should create SecurityError with correct properties', () => {
      const error = new SecurityError('Access denied');
      expect(error.code).toBe('SECURITY_ERROR');
      expect(error.statusCode).toBe(403);
    });

    it('should create GitHubError with correct properties', () => {
      const error = new GitHubError('API rate limit exceeded');
      expect(error.code).toBe('GITHUB_ERROR');
      expect(error.statusCode).toBe(502);
    });

    it('should create TimeoutError with correct properties', () => {
      const error = new TimeoutError('Operation timed out');
      expect(error.code).toBe('TIMEOUT_ERROR');
      expect(error.statusCode).toBe(408);
    });

    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('ErrorHandler', () => {
    let handler: ErrorHandler;

    beforeEach(() => {
      handler = new ErrorHandler();
    });

    describe('executeWithErrorHandling', () => {
      it('should execute operation successfully', async () => {
        const operation = jest.fn().mockResolvedValue('success');
        
        const result = await handler.executeWithErrorHandling(operation, {
          operationName: 'test-operation'
        });
        
        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(1);
      });

      it('should retry failed operations', async () => {
        const operation = jest.fn()
          .mockRejectedValueOnce(new Error('First failure'))
          .mockRejectedValueOnce(new Error('Second failure'))
          .mockResolvedValue('success');
        
        const result = await handler.executeWithErrorHandling(operation, {
          operationName: 'test-operation',
          maxRetries: 3,
          retryDelayMs: 10
        });
        
        expect(result).toBe('success');
        expect(operation).toHaveBeenCalledTimes(3);
      });

      it('should fail after max retries', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Persistent failure'));
        
        await expect(handler.executeWithErrorHandling(operation, {
          operationName: 'test-operation',
          maxRetries: 2,
          retryDelayMs: 10
        })).rejects.toThrow('Persistent failure');
        
        expect(operation).toHaveBeenCalledTimes(2);
      });

      it('should apply exponential backoff', async () => {
        const operation = jest.fn()
          .mockRejectedValueOnce(new Error('First failure'))
          .mockRejectedValueOnce(new Error('Second failure'))
          .mockResolvedValue('success');
        
        const startTime = Date.now();
        
        await handler.executeWithErrorHandling(operation, {
          operationName: 'test-operation',
          maxRetries: 3,
          retryDelayMs: 100
        });
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        // Should have waited at least 100ms + 200ms for exponential backoff
        expect(totalTime).toBeGreaterThan(250);
      });

      it('should timeout long-running operations', async () => {
        const operation = jest.fn().mockImplementation(() => 
          new Promise(resolve => setTimeout(resolve, 1000))
        );
        
        await expect(handler.executeWithErrorHandling(operation, {
          operationName: 'test-operation',
          timeoutMs: 100
        })).rejects.toThrow(TimeoutError);
      });

      it('should enhance generic errors', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Generic error'));
        
        try {
          await handler.executeWithErrorHandling(operation, {
            operationName: 'test-operation',
            context: { key: 'value' }
          });
        } catch (error) {
          expect(error).toBeInstanceOf(DomainError);
          expect((error as DomainError).code).toBe('OPERATION_FAILED');
          expect((error as DomainError).context.operationName).toBe('test-operation');
          expect((error as DomainError).context.key).toBe('value');
        }
      });

      it('should detect and convert timeout errors', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Operation timeout after 5000ms'));
        
        try {
          await handler.executeWithErrorHandling(operation, {
            operationName: 'test-operation'
          });
        } catch (error) {
          expect(error).toBeInstanceOf(TimeoutError);
        }
      });

      it('should detect and convert security errors', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Unauthorized access'));
        
        try {
          await handler.executeWithErrorHandling(operation, {
            operationName: 'test-operation'
          });
        } catch (error) {
          expect(error).toBeInstanceOf(SecurityError);
        }
      });
    });

    describe('Circuit Breaker', () => {
      it('should open circuit after threshold failures', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Service unavailable'));
        
        // Fail enough times to trigger circuit breaker
        for (let i = 0; i < 5; i++) {
          try {
            await handler.executeWithErrorHandling(operation, {
              operationName: 'failing-service',
              maxRetries: 1,
              retryDelayMs: 10
            });
          } catch (error) {
            // Expected to fail
          }
        }
        
        // Next call should fail immediately due to circuit breaker
        const startTime = Date.now();
        try {
          await handler.executeWithErrorHandling(operation, {
            operationName: 'failing-service',
            maxRetries: 3,
            retryDelayMs: 100
          });
        } catch (error) {
          const endTime = Date.now();
          expect(error.code).toBe('CIRCUIT_BREAKER_OPEN');
          expect(endTime - startTime).toBeLessThan(50); // Should fail fast
        }
      });

      it('should reset circuit breaker after timeout', async () => {
        const operation = jest.fn()
          .mockRejectedValueOnce(new Error('Failure'))
          .mockResolvedValue('success');
        
        // Configure circuit breaker with short timeout for testing
        const circuitBreaker = (handler as any).getCircuitBreaker('test-service');
        circuitBreaker.config.resetTimeoutMs = 50;
        
        // Trigger circuit breaker
        for (let i = 0; i < 5; i++) {
          circuitBreaker.recordFailure();
        }
        
        expect(circuitBreaker.isOpen()).toBe(true);
        
        // Wait for reset timeout
        await new Promise(resolve => setTimeout(resolve, 60));
        
        // Should try again and succeed
        const result = await handler.executeWithErrorHandling(operation, {
          operationName: 'test-service',
          circuitBreakerEnabled: true
        });
        
        expect(result).toBe('success');
      });

      it('should provide circuit breaker statistics', () => {
        const stats = handler.getErrorStats();
        
        expect(stats).toHaveProperty('errorCounts');
        expect(stats).toHaveProperty('circuitBreakers');
      });

      it('should reset all circuit breakers', () => {
        // Trigger some failures first
        const cb = (handler as any).getCircuitBreaker('test-service');
        cb.recordFailure();
        cb.recordFailure();
        
        expect(cb.getFailureCount()).toBe(2);
        
        handler.resetCircuitBreakers();
        
        expect(cb.getFailureCount()).toBe(0);
        expect(cb.getState()).toBe('CLOSED');
      });
    });

    describe('Error Statistics', () => {
      it('should track error counts', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Test error'));
        
        try {
          await handler.executeWithErrorHandling(operation, {
            operationName: 'test-operation',
            maxRetries: 1
          });
        } catch (error) {
          // Expected
        }
        
        const stats = handler.getErrorStats();
        expect(stats.errorCounts['test-operation']).toBe(1);
      });

      it('should reset error counts periodically', async () => {
        const operation = jest.fn().mockRejectedValue(new Error('Test error'));
        
        try {
          await handler.executeWithErrorHandling(operation, {
            operationName: 'test-operation',
            maxRetries: 1
          });
        } catch (error) {
          // Expected
        }
        
        // Force reset by setting last reset time to past
        (handler as any).lastErrorReset = Date.now() - (60 * 60 * 1000 + 1000);
        (handler as any).incrementErrorCount('test-operation');
        
        const stats = handler.getErrorStats();
        expect(Object.keys(stats.errorCounts)).toHaveLength(1); // Should be reset
      });
    });
  });

  describe('Global Error Handler', () => {
    it('should provide singleton instance', () => {
      expect(errorHandler).toBeInstanceOf(ErrorHandler);
    });

    it('should be reusable across different operations', async () => {
      const operation1 = jest.fn().mockResolvedValue('result1');
      const operation2 = jest.fn().mockResolvedValue('result2');
      
      const result1 = await errorHandler.executeWithErrorHandling(operation1, {
        operationName: 'op1'
      });
      
      const result2 = await errorHandler.executeWithErrorHandling(operation2, {
        operationName: 'op2'
      });
      
      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
    });
  });

  describe('Circuit Breaker Implementation', () => {
    let circuitBreaker: any;

    beforeEach(() => {
      const handler = new ErrorHandler();
      circuitBreaker = (handler as any).getCircuitBreaker('test');
    });

    it('should start in CLOSED state', () => {
      expect(circuitBreaker.getState()).toBe('CLOSED');
      expect(circuitBreaker.isOpen()).toBe(false);
    });

    it('should transition to OPEN after threshold failures', () => {
      for (let i = 0; i < 5; i++) {
        circuitBreaker.recordFailure();
      }
      
      expect(circuitBreaker.getState()).toBe('OPEN');
      expect(circuitBreaker.isOpen()).toBe(true);
    });

    it('should transition to HALF_OPEN after timeout', () => {
      // Force circuit to OPEN state
      for (let i = 0; i < 5; i++) {
        circuitBreaker.recordFailure();
      }
      
      // Manually set next attempt time to past
      circuitBreaker.nextAttemptTime = new Date(Date.now() - 1000);
      
      expect(circuitBreaker.isOpen()).toBe(false); // Should transition to HALF_OPEN
      expect(circuitBreaker.getState()).toBe('HALF_OPEN');
    });

    it('should reset to CLOSED on success', () => {
      circuitBreaker.recordFailure();
      circuitBreaker.recordFailure();
      
      expect(circuitBreaker.getFailureCount()).toBe(2);
      
      circuitBreaker.recordSuccess();
      
      expect(circuitBreaker.getFailureCount()).toBe(0);
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });

    it('should track failure times', () => {
      expect(circuitBreaker.getLastFailureTime()).toBeNull();
      
      circuitBreaker.recordFailure();
      
      expect(circuitBreaker.getLastFailureTime()).toBeInstanceOf(Date);
    });

    it('should reset all state', () => {
      circuitBreaker.recordFailure();
      circuitBreaker.recordFailure();
      
      circuitBreaker.reset();
      
      expect(circuitBreaker.getState()).toBe('CLOSED');
      expect(circuitBreaker.getFailureCount()).toBe(0);
      expect(circuitBreaker.getLastFailureTime()).toBeNull();
    });
  });
});