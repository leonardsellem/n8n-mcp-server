// src/utils/logger.ts

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';

export interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

export const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

export interface LogEntry {
  timestamp: string;
  level: keyof LogLevel;
  message: string;
  data?: any;
  component?: string;
}

class Logger {
  private currentLevel: number;
  private logStream?: NodeJS.WritableStream;
  private enableConsole: boolean;
  private enableFile: boolean;
  private prefix: string;

  constructor(options?: { prefix?: string }) {
    this.currentLevel = this.getLogLevelFromEnv();
    this.enableConsole = process.env.NODE_ENV !== 'production';
    this.enableFile = process.env.ENABLE_FILE_LOGGING === 'true';
    this.prefix = options?.prefix || '';
    
    if (this.enableFile) {
      this.initializeFileLogging();
    }
  }

  private getLogLevelFromEnv(): number {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
    return LOG_LEVELS[envLevel as keyof LogLevel] ?? LOG_LEVELS.INFO;
  }

  private initializeFileLogging(): void {
    try {
      const logDir = path.join(process.cwd(), 'logs');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
      
      const logFile = path.join(logDir, `mcp-server-${new Date().toISOString().split('T')[0]}.log`);
      this.logStream = createWriteStream(logFile, { flags: 'a' });
    } catch (error) {
      console.error('Failed to initialize file logging:', error);
      this.enableFile = false;
    }
  }

  private formatMessage(level: keyof LogLevel, message: string, data?: any, component?: string): string {
    const timestamp = new Date().toISOString();
    const prefixStr = this.prefix ? `${this.prefix} ` : '';
    const componentStr = component ? `[${component}] ` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp} [${level}] ${prefixStr}${componentStr}${message}${dataStr}`;
  }

  private log(level: keyof LogLevel, message: string, data?: any, component?: string): void {
    const levelNum = LOG_LEVELS[level];
    
    if (levelNum <= this.currentLevel) {
      const formattedMessage = this.formatMessage(level, message, data, component);
      
      if (this.enableConsole) {
        switch (level) {
          case 'ERROR':
            console.error(formattedMessage);
            break;
          case 'WARN':
            console.warn(formattedMessage);
            break;
          case 'INFO':
            console.info(formattedMessage);
            break;
          case 'DEBUG':
            console.debug(formattedMessage);
            break;
        }
      }
      
      if (this.enableFile && this.logStream) {
        this.logStream.write(formattedMessage + '\n');
      }
    }
  }

  error(message: string, data?: any, component?: string): void {
    this.log('ERROR', message, data, component);
  }

  warn(message: string, data?: any, component?: string): void {
    this.log('WARN', message, data, component);
  }

  info(message: string, data?: any, component?: string): void {
    this.log('INFO', message, data, component);
  }

  debug(message: string, data?: any, component?: string): void {
    this.log('DEBUG', message, data, component);
  }

  setLevel(level: keyof LogLevel): void {
    this.currentLevel = LOG_LEVELS[level];
    this.info(`Log level set to: ${level}`);
  }

  close(): void {
    if (this.logStream) {
      this.logStream.end();
    }
  }
}

export const logger = new Logger();
export { Logger };
