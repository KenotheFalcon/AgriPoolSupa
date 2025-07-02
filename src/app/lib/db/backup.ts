import { exec } from 'child_process';
import { promisify } from 'util';
import { dbPool } from './config';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Backup configuration interface
 */
interface BackupConfig {
  backupDir: string;
  retentionDays: number;
  compression: boolean;
  includeSchema: boolean;
  includeData: boolean;
}

/**
 * Default backup configuration
 */
const defaultBackupConfig: BackupConfig = {
  backupDir: process.env.BACKUP_DIR || 'backups',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '7'),
  compression: process.env.BACKUP_COMPRESSION === 'true',
  includeSchema: true,
  includeData: true,
};

/**
 * Service for handling database backups and recovery
 */
export class BackupService {
  private config: BackupConfig;

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...defaultBackupConfig, ...config };
  }

  /**
   * Create a database backup
   * @param description Optional description of the backup
   * @returns Path to the backup file
   */
  public async createBackup(description?: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}${description ? `-${description}` : ''}`;
    const backupPath = path.join(this.config.backupDir, backupName);

    try {
      // Ensure backup directory exists
      await fs.mkdir(this.config.backupDir, { recursive: true });

      // Build pg_dump command
      const { database, user, host, port } = dbPool.options;
      const dumpCommand = [
        'pg_dump',
        `--dbname=${database}`,
        `--username=${user}`,
        `--host=${host}`,
        `--port=${port}`,
        this.config.includeSchema ? '--schema-only' : '',
        this.config.includeData ? '--data-only' : '',
        this.config.compression ? '--compress=9' : '',
        `--file=${backupPath}`,
      ]
        .filter(Boolean)
        .join(' ');

      // Execute backup
      await execAsync(dumpCommand);

      // Clean up old backups
      await this.cleanupOldBackups();

      return backupPath;
    } catch (error) {
      throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Restore database from backup
   * @param backupPath Path to the backup file
   */
  public async restoreBackup(backupPath: string): Promise<void> {
    try {
      // Verify backup file exists
      await fs.access(backupPath);

      const { database, user, host, port } = dbPool.options;
      const restoreCommand = [
        'psql',
        `--dbname=${database}`,
        `--username=${user}`,
        `--host=${host}`,
        `--port=${port}`,
        `--file=${backupPath}`,
      ].join(' ');

      await execAsync(restoreCommand);
    } catch (error) {
      throw new Error(
        `Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * List available backups
   * @returns Array of backup files with metadata
   */
  public async listBackups(): Promise<Array<{ path: string; size: number; created: Date }>> {
    try {
      const files = await fs.readdir(this.config.backupDir);
      const backups = await Promise.all(
        files
          .filter((file) => file.startsWith('backup-'))
          .map(async (file) => {
            const filePath = path.join(this.config.backupDir, file);
            const stats = await fs.stat(filePath);
            return {
              path: filePath,
              size: stats.size,
              created: stats.birthtime,
            };
          })
      );

      return backups.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      throw new Error(
        `Failed to list backups: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Clean up old backups based on retention policy
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

      const oldBackups = backups.filter((backup) => backup.created < cutoffDate);
      await Promise.all(oldBackups.map((backup) => fs.unlink(backup.path)));
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }
}

// Export singleton instance
export const backupService = new BackupService();
