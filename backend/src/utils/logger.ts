/**
 * Log levels enum
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

/**
 * Interface for log entry
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  error?: Error | unknown;
}

/**
 * Creates a formatted log entry
 * @param {LogEntry} entry - The log entry to format
 * @returns {string} Formatted log message
 */
const formatLogEntry = ({ timestamp, level, context, message, error }: LogEntry): string => {
  const baseMessage = `[${timestamp}] ${level} [${context}]: ${message}`;
  if (error instanceof Error) {
    return `${baseMessage}\nError: ${error.message}\nStack: ${error.stack}`;
  }
  if (error) {
    return `${baseMessage}\nError Details: ${JSON.stringify(error)}`;
  }
  return baseMessage;
};

/**
 * Logger class for consistent logging across the application
 */
class Logger {
  /**
   * Log an info message
   * @param {string} context - The context where the log is coming from
   * @param {string} message - The message to log
   */
  static info(context: string, message: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      context,
      message
    };
    console.log(formatLogEntry(entry));
  }

  /**
   * Log a warning message
   * @param {string} context - The context where the log is coming from
   * @param {string} message - The message to log
   * @param {Error | unknown} [error] - Optional error object
   */
  static warn(context: string, message: string, error?: Error | unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      context,
      message,
      error
    };
    console.warn(formatLogEntry(entry));
  }

  /**
   * Log an error message
   * @param {string} context - The context where the log is coming from
   * @param {string} message - The message to log
   * @param {Error | unknown} error - The error object
   */
  static error(context: string, message: string, error: Error | unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      context,
      message,
      error
    };
    console.error(formatLogEntry(entry));
  }

  /**
   * Log a debug message
   * @param {string} context - The context where the log is coming from
   * @param {string} message - The message to log
   * @param {unknown} [data] - Optional data to log
   */
  static debug(context: string, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      context,
      message,
      error: data
    };
    console.debug(formatLogEntry(entry));
  }
}

export default Logger;
