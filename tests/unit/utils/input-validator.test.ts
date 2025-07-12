/**
 * Unit tests for InputValidator utility
 */

import { InputValidator } from '../../../src/utils/input-validator';

describe('InputValidator', () => {
  describe('sanitizeString', () => {
    it('should sanitize basic string input', () => {
      const result = InputValidator.sanitizeString('hello world');
      expect(result).toBe('hello world');
    });

    it('should escape HTML characters', () => {
      const result = InputValidator.sanitizeString('<script>alert("xss")</script>');
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('should remove null bytes', () => {
      const result = InputValidator.sanitizeString('hello\0world');
      expect(result).toBe('helloworld');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(20000);
      const result = InputValidator.sanitizeString(longString);
      expect(result.length).toBe(10000);
    });

    it('should throw error for non-string input', () => {
      expect(() => InputValidator.sanitizeString(123)).toThrow('Input must be a string');
      expect(() => InputValidator.sanitizeString(null)).toThrow('Input must be a string');
      expect(() => InputValidator.sanitizeString({})).toThrow('Input must be a string');
    });
  });

  describe('validateNodeType', () => {
    it('should validate correct node type formats', () => {
      expect(InputValidator.validateNodeType('nodes-base.slack')).toBe('nodes-base.slack');
      expect(InputValidator.validateNodeType('n8n-nodes-base.httpRequest')).toBe('n8n-nodes-base.httpRequest');
      expect(InputValidator.validateNodeType('@n8n/n8n-nodes-langchain.openAi')).toBe('@n8n&#x2F;n8n-nodes-langchain.openAi');
    });

    it('should reject invalid node type formats', () => {
      expect(() => InputValidator.validateNodeType('invalid/path')).toThrow('Potential path traversal');
      expect(() => InputValidator.validateNodeType('node..type')).toThrow('Potential path traversal');
      expect(() => InputValidator.validateNodeType('!@#$%')).toThrow('Invalid node type format');
    });
  });

  describe('validateWorkflowId', () => {
    it('should validate correct workflow IDs', () => {
      expect(InputValidator.validateWorkflowId('workflow-123')).toBe('workflow-123');
      expect(InputValidator.validateWorkflowId('abc_def_456')).toBe('abc_def_456');
    });

    it('should reject invalid workflow IDs', () => {
      expect(() => InputValidator.validateWorkflowId('workflow/123')).toThrow('Invalid workflow ID format');
      expect(() => InputValidator.validateWorkflowId('workflow@123')).toThrow('Invalid workflow ID format');
      expect(() => InputValidator.validateWorkflowId('a'.repeat(200))).toThrow('Invalid workflow ID format');
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(InputValidator.validateUrl('https://example.com')).toBe('https://example.com');
      expect(InputValidator.validateUrl('http://localhost:5678')).toBe('http://localhost:5678');
    });

    it('should reject invalid URLs', () => {
      expect(() => InputValidator.validateUrl('ftp://example.com')).toThrow('Invalid protocol');
      expect(() => InputValidator.validateUrl('not-a-url')).toThrow('Invalid URL format');
      expect(() => InputValidator.validateUrl('javascript:alert(1)')).toThrow('Invalid protocol');
    });
  });

  describe('validateObject', () => {
    it('should validate objects within size limits', () => {
      const obj = { name: 'test', value: 123 };
      expect(InputValidator.validateObject(obj)).toEqual(obj);
    });

    it('should reject non-objects', () => {
      expect(() => InputValidator.validateObject('string')).toThrow('Input must be a non-null object');
      expect(() => InputValidator.validateObject(null)).toThrow('Input must be a non-null object');
      expect(() => InputValidator.validateObject([])).toThrow('Input must be a non-null object');
    });

    it('should reject oversized objects', () => {
      const largeObj = { data: 'x'.repeat(2 * 1024 * 1024) }; // 2MB
      expect(() => InputValidator.validateObject(largeObj, 1)).toThrow('Object too large');
    });
  });

  describe('validateNumber', () => {
    it('should validate numbers within range', () => {
      expect(InputValidator.validateNumber(42)).toBe(42);
      expect(InputValidator.validateNumber(5, 0, 10)).toBe(5);
    });

    it('should reject invalid numbers', () => {
      expect(() => InputValidator.validateNumber(NaN)).toThrow('Invalid number');
      expect(() => InputValidator.validateNumber(Infinity)).toThrow('Invalid number');
      expect(() => InputValidator.validateNumber('123')).toThrow('Invalid number');
    });

    it('should reject numbers outside range', () => {
      expect(() => InputValidator.validateNumber(15, 0, 10)).toThrow('Number out of range');
      expect(() => InputValidator.validateNumber(-5, 0, 10)).toThrow('Number out of range');
    });
  });

  describe('validateEnum', () => {
    it('should validate allowed enum values', () => {
      const allowed = ['red', 'green', 'blue'];
      expect(InputValidator.validateEnum('red', allowed)).toBe('red');
      expect(InputValidator.validateEnum('blue', allowed)).toBe('blue');
    });

    it('should reject disallowed enum values', () => {
      const allowed = ['red', 'green', 'blue'];
      expect(() => InputValidator.validateEnum('yellow', allowed)).toThrow('Invalid value: yellow');
      expect(() => InputValidator.validateEnum('RED', allowed)).toThrow('Invalid value: RED');
    });
  });
});