import { AuthManager } from '../src/utils/auth';

describe('AuthManager', () => {
  let authManager: AuthManager;

  beforeEach(() => {
    authManager = new AuthManager();
  });

  describe('validateToken', () => {
    it('should return true when no authentication is required', () => {
      expect(authManager.validateToken('any-token')).toBe(true);
      expect(authManager.validateToken(undefined)).toBe(true);
    });

    it('should validate static token correctly', () => {
      const expectedToken = 'secret-token';
      
      expect(authManager.validateToken('secret-token', expectedToken)).toBe(true);
      expect(authManager.validateToken('wrong-token', expectedToken)).toBe(false);
      expect(authManager.validateToken(undefined, expectedToken)).toBe(false);
    });

    it('should validate generated tokens', () => {
      const token = authManager.generateToken(1);
      
      expect(authManager.validateToken(token, 'expected-token')).toBe(true);
    });

    it('should reject expired tokens', () => {
      jest.useFakeTimers();
      
      const token = authManager.generateToken(1); // 1 hour expiry
      
      // Token should be valid initially
      expect(authManager.validateToken(token, 'expected-token')).toBe(true);
      
      // Fast forward 2 hours
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      
      // Token should be expired
      expect(authManager.validateToken(token, 'expected-token')).toBe(false);
      
      jest.useRealTimers();
    });
  });

  describe('generateToken', () => {
    it('should generate unique tokens', () => {
      const token1 = authManager.generateToken();
      const token2 = authManager.generateToken();
      
      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(64); // 32 bytes hex = 64 chars
    });

    it('should set custom expiry time', () => {
      jest.useFakeTimers();
      
      const token = authManager.generateToken(24); // 24 hours
      
      // Token should be valid after 23 hours
      jest.advanceTimersByTime(23 * 60 * 60 * 1000);
      expect(authManager.validateToken(token, 'expected')).toBe(true);
      
      // Token should expire after 25 hours
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      expect(authManager.validateToken(token, 'expected')).toBe(false);
      
      jest.useRealTimers();
    });
  });

  describe('revokeToken', () => {
    it('should revoke a generated token', () => {
      const token = authManager.generateToken();
      
      expect(authManager.validateToken(token, 'expected')).toBe(true);
      
      authManager.revokeToken(token);
      
      expect(authManager.validateToken(token, 'expected')).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should hash tokens consistently', () => {
      const token = 'my-secret-token';
      const hash1 = AuthManager.hashToken(token);
      const hash2 = AuthManager.hashToken(token);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hex = 64 chars
    });

    it('should compare tokens securely', () => {
      const token = 'my-secret-token';
      const hashedToken = AuthManager.hashToken(token);
      
      expect(AuthManager.compareTokens(token, hashedToken)).toBe(true);
      expect(AuthManager.compareTokens('wrong-token', hashedToken)).toBe(false);
    });
  });
});