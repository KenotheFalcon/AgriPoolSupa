'use client';

import { monitoringService } from './monitoring';
import { dbPool } from './db/config';

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  url: string;
  userAgent: string;
}

export class PerformanceService {
  private static instance: PerformanceService;

  private constructor() {}

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  public async recordMetrics(metrics: PerformanceMetrics): Promise<void> {
    try {
      await dbPool.query(
        `INSERT INTO performance_metrics (
          fcp, lcp, fid, cls, ttfb, url, user_agent, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
        [
          metrics.fcp,
          metrics.lcp,
          metrics.fid,
          metrics.cls,
          metrics.ttfb,
          metrics.url,
          metrics.userAgent,
        ]
      );
    } catch (error) {
      console.error('Failed to record performance metrics:', error);
      throw error;
    }
  }

  public async getMetrics(startDate: Date, endDate: Date): Promise<PerformanceMetrics[]> {
    try {
      const result = await dbPool.query(
        `SELECT fcp, lcp, fid, cls, ttfb, url, user_agent, created_at
         FROM performance_metrics
         WHERE created_at BETWEEN $1 AND $2
         ORDER BY created_at ASC`,
        [startDate, endDate]
      );

      return result.rows.map((row) => ({
        fcp: row.fcp,
        lcp: row.lcp,
        fid: row.fid,
        cls: row.cls,
        ttfb: row.ttfb,
        url: row.url,
        userAgent: row.user_agent,
      }));
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      throw error;
    }
  }

  public async getLatestMetrics(limit: number = 100): Promise<PerformanceMetrics[]> {
    try {
      const result = await dbPool.query(
        `SELECT fcp, lcp, fid, cls, ttfb, url, user_agent, created_at
         FROM performance_metrics
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row) => ({
        fcp: row.fcp,
        lcp: row.lcp,
        fid: row.fid,
        cls: row.cls,
        ttfb: row.ttfb,
        url: row.url,
        userAgent: row.user_agent,
      }));
    } catch (error) {
      console.error('Failed to fetch latest performance metrics:', error);
      throw error;
    }
  }
}

export const performanceService = PerformanceService.getInstance();
