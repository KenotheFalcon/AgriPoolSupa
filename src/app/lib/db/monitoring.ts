import {
  Alert,
  AlertSchema,
  PerformanceMetrics,
  PerformanceMetricsSchema,
  MonitoringConfig,
  MonitoringConfigSchema,
} from './schema';

/**
 * Custom error types for database operations
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * In-memory database service for monitoring data
 * Note: In production, this would be replaced with a real database client
 */
class MonitoringDatabase {
  private static instance: MonitoringDatabase;
  private alerts: Alert[] = [];
  private metrics: PerformanceMetrics[] = [];
  private configs: MonitoringConfig[] = [];
  private readonly MAX_ALERTS = 10000; // Prevent unbounded growth
  private readonly MAX_METRICS = 100000;

  private constructor() {}

  public static getInstance(): MonitoringDatabase {
    if (!MonitoringDatabase.instance) {
      MonitoringDatabase.instance = new MonitoringDatabase();
    }
    return MonitoringDatabase.instance;
  }

  /**
   * Validate and create a new alert
   * @throws {ValidationError} If alert data is invalid
   * @throws {DatabaseError} If database operation fails
   */
  public async createAlert(alert: Omit<Alert, 'id'>): Promise<Alert> {
    try {
      // Validate alert data
      const validatedAlert = AlertSchema.parse(alert);

      // Check storage limits
      if (this.alerts.length >= this.MAX_ALERTS) {
        throw new DatabaseError('Alert storage limit reached', 'STORAGE_LIMIT_EXCEEDED');
      }

      const newAlert = {
        ...validatedAlert,
        id: crypto.randomUUID(),
      };

      this.alerts.push(newAlert);
      return newAlert;
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(`Failed to create alert: ${error.message}`, 'CREATE_FAILED');
      }
      throw error;
    }
  }

  /**
   * Retrieve alerts with validation and error handling
   */
  public async getAlerts(
    options: {
      limit?: number;
      offset?: number;
      type?: Alert['type'];
      status?: Alert['status'];
    } = {}
  ): Promise<Alert[]> {
    try {
      // Validate pagination parameters
      if (options.limit && (options.limit < 1 || options.limit > 100)) {
        throw new ValidationError('Limit must be between 1 and 100');
      }
      if (options.offset && options.offset < 0) {
        throw new ValidationError('Offset must be non-negative');
      }

      let filtered = [...this.alerts];

      if (options.type) {
        filtered = filtered.filter((alert) => alert.type === options.type);
      }

      if (options.status) {
        filtered = filtered.filter((alert) => alert.status === options.status);
      }

      if (options.offset) {
        filtered = filtered.slice(options.offset);
      }

      if (options.limit) {
        filtered = filtered.slice(0, options.limit);
      }

      return filtered;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to retrieve alerts: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RETRIEVE_FAILED'
      );
    }
  }

  /**
   * Update alert status with validation
   */
  public async updateAlertStatus(
    id: string,
    status: Alert['status'],
    resolvedBy?: string
  ): Promise<Alert | null> {
    try {
      if (!id) {
        throw new ValidationError('Alert ID is required');
      }

      const alert = this.alerts.find((a) => a.id === id);
      if (!alert) {
        return null;
      }

      // Validate status transition
      if (alert.status === 'resolved' && status !== 'resolved') {
        throw new ValidationError('Cannot change status of resolved alert');
      }

      alert.status = status;
      if (status === 'resolved') {
        alert.resolvedAt = Date.now();
        alert.resolvedBy = resolvedBy;
      }

      return alert;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to update alert status: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'UPDATE_FAILED'
      );
    }
  }

  /**
   * Store performance metrics with validation
   */
  public async createMetrics(metrics: Omit<PerformanceMetrics, 'id'>): Promise<PerformanceMetrics> {
    try {
      // Validate metrics data
      const validatedMetrics = PerformanceMetricsSchema.parse(metrics);

      // Check storage limits
      if (this.metrics.length >= this.MAX_METRICS) {
        // Remove oldest metrics if limit reached
        this.metrics = this.metrics.slice(-this.MAX_METRICS + 1);
      }

      const newMetrics = {
        ...validatedMetrics,
        id: crypto.randomUUID(),
      };

      this.metrics.push(newMetrics);
      return newMetrics;
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(`Failed to create metrics: ${error.message}`, 'CREATE_FAILED');
      }
      throw error;
    }
  }

  /**
   * Retrieve metrics with validation
   */
  public async getMetrics(
    options: {
      limit?: number;
      offset?: number;
      startTime?: number;
      endTime?: number;
    } = {}
  ): Promise<PerformanceMetrics[]> {
    try {
      // Validate pagination parameters
      if (options.limit && (options.limit < 1 || options.limit > 1000)) {
        throw new ValidationError('Limit must be between 1 and 1000');
      }
      if (options.offset && options.offset < 0) {
        throw new ValidationError('Offset must be non-negative');
      }

      let filtered = [...this.metrics];

      if (options.startTime) {
        filtered = filtered.filter((m) => m.timestamp >= options.startTime!);
      }

      if (options.endTime) {
        filtered = filtered.filter((m) => m.timestamp <= options.endTime!);
      }

      if (options.offset) {
        filtered = filtered.slice(options.offset);
      }

      if (options.limit) {
        filtered = filtered.slice(0, options.limit);
      }

      return filtered;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to retrieve metrics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RETRIEVE_FAILED'
      );
    }
  }

  /**
   * Get configuration with validation
   */
  public async getConfig(key: string): Promise<MonitoringConfig | null> {
    try {
      if (!key) {
        throw new ValidationError('Config key is required');
      }
      return this.configs.find((c) => c.key === key) || null;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to get config: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RETRIEVE_FAILED'
      );
    }
  }

  /**
   * Set configuration with validation
   */
  public async setConfig(key: string, value: any, updatedBy: string): Promise<MonitoringConfig> {
    try {
      if (!key) {
        throw new ValidationError('Config key is required');
      }
      if (!updatedBy) {
        throw new ValidationError('Updated by is required');
      }

      // Validate config value
      const validatedConfig = MonitoringConfigSchema.parse({
        key,
        value,
        updatedAt: Date.now(),
        updatedBy,
      });

      const existing = this.configs.find((c) => c.key === key);
      if (existing) {
        Object.assign(existing, validatedConfig);
        return existing;
      }

      const newConfig = {
        ...validatedConfig,
        id: crypto.randomUUID(),
      };

      this.configs.push(newConfig);
      return newConfig;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError(
        `Failed to set config: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'UPDATE_FAILED'
      );
    }
  }
}

export const monitoringDb = MonitoringDatabase.getInstance();
