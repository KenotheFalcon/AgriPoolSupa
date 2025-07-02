'use client';

import { Alert as DbAlert, AlertSchema } from './db/schema';
import { monitoringDb, DatabaseError, ValidationError } from './db/monitoring';
import { notificationService } from './notifications';
import { dbPool } from './db/config';

/**
 * Configuration interface for the monitoring service
 * Defines thresholds and settings for performance monitoring
 */
export interface MonitoringConfig {
  key: string;
  value: {
    enableConsoleLogging: boolean;
    enableAlertNotifications: boolean;
    alertThresholds: {
      fcp: number;
      lcp: number;
      fid: number;
      cls: number;
      ttfb: number;
      sectionLoadTime: number;
    };
  };
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Retry configuration for database operations
 */
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export interface Alert {
  id?: string;
  type: string;
  message: string;
  metadata?: Record<string, any>;
  status: 'active' | 'resolved';
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Main monitoring service for the application
 * Handles alert creation, performance monitoring, and notifications
 */
class MonitoringService {
  private static instance: MonitoringService;
  private config: MonitoringConfig['value'] = {
    enableConsoleLogging: true,
    enableAlertNotifications: true,
    alertThresholds: {
      fcp: 1800,
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      ttfb: 600,
      sectionLoadTime: 1000,
    },
  };

  private readonly retryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
    backoffFactor: 2,
  };

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Retry a database operation with exponential backoff
   */
  private async retryOperation<T>(operation: () => Promise<T>, context: string): Promise<T> {
    let lastError: Error | null = null;
    let delay = this.retryConfig.initialDelay;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (error instanceof ValidationError) {
          // Don't retry validation errors
          throw error;
        }

        if (attempt === this.retryConfig.maxAttempts) {
          throw new Error(`Failed to ${context} after ${attempt} attempts: ${lastError.message}`);
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * this.retryConfig.backoffFactor, this.retryConfig.maxDelay);
      }
    }

    throw lastError;
  }

  /**
   * Load configuration from the database with retry logic
   */
  private async loadConfig() {
    try {
      const config = await this.retryOperation(
        () => monitoringDb.getConfig('monitoring'),
        'load configuration'
      );

      if (config) {
        this.config = config.value;
      }
    } catch (error) {
      console.error('Failed to load monitoring configuration:', error);
      // Continue with default config
    }
  }

  /**
   * Update monitoring configuration with validation
   */
  public async configure(config: Partial<MonitoringConfig['value']>) {
    try {
      // Validate thresholds
      if (config.alertThresholds) {
        Object.entries(config.alertThresholds).forEach(([key, value]) => {
          if (typeof value !== 'number' || value < 0) {
            throw new ValidationError(`Invalid threshold for ${key}: must be a positive number`);
          }
        });
      }

      this.config = { ...this.config, ...config };
      await this.retryOperation(
        () => monitoringDb.setConfig('monitoring', JSON.stringify(this.config), 'system'),
        'update configuration'
      );
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(
        `Failed to configure monitoring: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Create and process a new alert with validation and retry logic
   */
  public async addAlert(alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>): Promise<Alert> {
    try {
      const validatedAlert = AlertSchema.parse(alert);

      const result = await dbPool.query(
        `INSERT INTO alerts (type, message, metadata, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          validatedAlert.type,
          validatedAlert.message,
          validatedAlert.metadata,
          validatedAlert.status,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Failed to add alert:', error);
      throw error;
    }
  }

  /**
   * Retrieve alerts with retry logic
   */
  public async getAlerts(
    status?: Alert['status'],
    type?: string,
    limit: number = 100
  ): Promise<Alert[]> {
    try {
      let query = 'SELECT * FROM alerts';
      const params: any[] = [];
      const conditions: string[] = [];

      if (status) {
        conditions.push(`status = $${params.length + 1}`);
        params.push(status);
      }

      if (type) {
        conditions.push(`type = $${params.length + 1}`);
        params.push(type);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
      params.push(limit);

      const result = await dbPool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Failed to get alerts:', error);
      throw error;
    }
  }

  /**
   * Update alert status with retry logic
   */
  public async updateAlertStatus(id: string, status: Alert['status']): Promise<Alert> {
    try {
      const result = await dbPool.query(
        `UPDATE alerts
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) {
        throw new Error('Alert not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Failed to update alert status:', error);
      throw error;
    }
  }

  /**
   * Retrieve monitoring configuration
   */
  public async getConfig(key: string): Promise<MonitoringConfig | null> {
    try {
      const result = await dbPool.query('SELECT * FROM monitoring_config WHERE key = $1', [key]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error(`Failed to get config for key ${key}:`, error);
      throw new DatabaseError(`Failed to get config for key ${key}`, 'GET_CONFIG_FAILED');
    }
  }
}

export const monitoringService = MonitoringService.getInstance();
