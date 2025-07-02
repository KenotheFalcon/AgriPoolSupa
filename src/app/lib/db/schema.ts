import { z } from 'zod';

/**
 * Schema for monitoring alerts
 * Defines the structure and validation rules for system alerts
 */
export const AlertSchema = z.object({
  // Unique identifier for the alert
  id: z.string().optional(),
  // Type of alert: performance issues, errors, or warnings
  type: z.enum(['performance', 'error', 'warning']),
  // Human-readable message describing the alert
  message: z.string(),
  // Unix timestamp when the alert was created
  timestamp: z.number(),
  // Additional context data specific to the alert
  metadata: z.record(z.any()).optional(),
  // Current state of the alert: new, acknowledged, or resolved
  status: z.enum(['new', 'acknowledged', 'resolved']).default('new'),
  // Timestamp when the alert was resolved (if applicable)
  resolvedAt: z.number().optional(),
  // Identifier of who resolved the alert (if applicable)
  resolvedBy: z.string().optional(),
});

/**
 * Schema for performance metrics
 * Defines the structure for tracking web vitals and custom metrics
 */
export const PerformanceMetricsSchema = z.object({
  // Unique identifier for the metrics record
  id: z.string().optional(),
  // Unix timestamp when metrics were collected
  timestamp: z.number(),
  // First Contentful Paint - time to first content render
  fcp: z.number(),
  // Largest Contentful Paint - time to largest content render
  lcp: z.number(),
  // First Input Delay - time to first interaction
  fid: z.number(),
  // Cumulative Layout Shift - measure of visual stability
  cls: z.number(),
  // Time to First Byte - server response time
  ttfb: z.number(),
  // Custom metrics for individual section load times
  sectionLoadTimes: z.record(z.number()),
  // URL where metrics were collected
  url: z.string(),
  // User agent string for browser identification
  userAgent: z.string().optional(),
});

/**
 * Schema for monitoring configuration
 * Defines the structure for system-wide monitoring settings
 */
export const MonitoringConfigSchema = z.object({
  // Unique identifier for the config
  id: z.string().optional(),
  // Configuration key (e.g., "alertThresholds", "notificationSettings")
  key: z.string(),
  // Configuration value (can be any type)
  value: z.any(),
  // Timestamp when config was last updated
  updatedAt: z.number(),
  // Identifier of who last updated the config
  updatedBy: z.string(),
});

// TypeScript type definitions derived from Zod schemas
export type Alert = z.infer<typeof AlertSchema>;
export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;
export type MonitoringConfig = z.infer<typeof MonitoringConfigSchema>;
