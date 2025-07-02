import axios from 'axios';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    };
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    const entry = this.formatMessage(level, message, data, error);

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'debug' ? 'debug' : level;
      console[consoleMethod](
        `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
        data || '',
        error || ''
      );
    }

    // Send to error tracking service in production
    if (level === 'error' && !this.isDevelopment) {
      this.sendToErrorTracking(entry);
    }
  }

  private async sendToErrorTracking(entry: LogEntry) {
    try {
      // Here you would integrate with your error tracking service
      // For example, Sentry, LogRocket, etc.
      await axios.post('/api/logs', entry);
    } catch (error) {
      console.error('Failed to send log to error tracking:', error);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error, data?: any) {
    this.log('error', message, data, error);
  }

  getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter((log) => log.level === level) : this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
