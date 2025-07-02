import { Logger, LogLevel } from '../src/utils/logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger({ timestamp: false, prefix: 'test' });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('log levels', () => {
    it('should only log errors when level is ERROR', () => {
      logger.setLevel(LogLevel.ERROR);
      
      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });

    it('should log errors and warnings when level is WARN', () => {
      logger.setLevel(LogLevel.WARN);
      
      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
    });

    it('should log all except debug when level is INFO', () => {
      logger.setLevel(LogLevel.INFO);
      
      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('should log everything when level is DEBUG', () => {
      logger.setLevel(LogLevel.DEBUG);
      
      logger.error('error message');
      logger.warn('warn message');
      logger.info('info message');
      logger.debug('debug message');
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(2); // info + debug
    });
  });

  describe('message formatting', () => {
    it('should include prefix in messages', () => {
      logger.info('test message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('[test] [INFO] test message');
    });

    it('should include timestamp when enabled', () => {
      const timestampLogger = new Logger({ timestamp: true, prefix: 'test' });
      const dateSpy = jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-01T00:00:00.000Z');
      
      timestampLogger.info('test message');
      
      expect(consoleLogSpy).toHaveBeenCalledWith('[2024-01-01T00:00:00.000Z] [test] [INFO] test message');
      
      dateSpy.mockRestore();
    });

    it('should pass additional arguments', () => {
      const obj = { foo: 'bar' };
      logger.info('test message', obj, 123);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('[test] [INFO] test message', obj, 123);
    });
  });

  describe('parseLogLevel', () => {
    it('should parse log level strings correctly', () => {
      expect(Logger.parseLogLevel('error')).toBe(LogLevel.ERROR);
      expect(Logger.parseLogLevel('ERROR')).toBe(LogLevel.ERROR);
      expect(Logger.parseLogLevel('warn')).toBe(LogLevel.WARN);
      expect(Logger.parseLogLevel('info')).toBe(LogLevel.INFO);
      expect(Logger.parseLogLevel('debug')).toBe(LogLevel.DEBUG);
      expect(Logger.parseLogLevel('unknown')).toBe(LogLevel.INFO);
    });
  });

  describe('singleton instance', () => {
    it('should return the same instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});