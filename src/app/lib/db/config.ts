import { Pool, PoolConfig } from 'pg';

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: PoolConfig['ssl'];
  maxConnections: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

/**
 * Default database configuration
 * In production, these values should be overridden by environment variables
 */
export const defaultConfig: DatabaseConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'monitoring',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  maxConnections: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

/**
 * Create a database connection pool
 * @param config Database configuration
 * @returns Configured connection pool
 */
export function createPool(config: Partial<DatabaseConfig> = {}): Pool {
  const poolConfig: DatabaseConfig = {
    ...defaultConfig,
    ...config,
  };

  return new Pool({
    ...poolConfig,
    max: config.maxConnections || defaultConfig.maxConnections,
    idleTimeoutMillis: config.idleTimeoutMillis || defaultConfig.idleTimeoutMillis,
    connectionTimeoutMillis:
      config.connectionTimeoutMillis || defaultConfig.connectionTimeoutMillis,
  });
}

// Create connection pool
export const dbPool = createPool();

// Test database connection
dbPool.on('connect', () => {});

dbPool.on('error', (err) => {
  process.exit(-1);
});

// Helper function to run queries with error handling
export async function query(text: string, params?: any[]) {
  const client = await dbPool.connect();
  try {
    return await client.query(text, params);
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

// Export database configuration for other modules
// export { defaultConfig };
